<?php

namespace App\Http\Controllers;

use App\Models\PageSpeed;
use App\Models\PageSpeedHistory;
use App\Models\Website;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;

class PageSpeedController extends Controller
{
    private $pagespeedApiKey;

    public function __construct()
    {
        $this->pagespeedApiKey = config('services.pagespeed.key', '');
    }

    public function checkPageSpeed($websiteId)
    {
        $website = Website::findOrFail($websiteId);

        if (!filter_var($website->url, FILTER_VALIDATE_URL)) {
            return response()->json([
                'error' => 'URL website tidak valid'
            ], 400);
        }

        // Check if API key is configured
        if (empty($this->pagespeedApiKey)) {
            return response()->json([
                'error' => 'PageSpeed API key tidak dikonfigurasi'
            ], 500);
        }

        try {
            // Perform check directly
            $this->performPageSpeedCheck($websiteId);
            
            $pageSpeed = PageSpeed::where('website_id', $websiteId)->first();
            return response()->json($pageSpeed, 200);
        } catch (\Exception $e) {
            \Log::error('PageSpeed Check Error: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function performPageSpeedCheck($websiteId)
    {
        set_time_limit(300);

        $website = Website::findOrFail($websiteId);

        try {
            $desktopData = $this->fetchPageSpeedDataWithRetry($website->url, 'desktop');
            $mobileData = $this->fetchPageSpeedDataWithRetry($website->url, 'mobile');

            $pageSpeedData = [
                'desktop_performance_score' => $desktopData['performance_score'],
                'desktop_accessibility_score' => $desktopData['accessibility_score'],
                'desktop_best_practices_score' => $desktopData['best_practices_score'],
                'desktop_seo_score' => $desktopData['seo_score'],
                'desktop_lcp' => $desktopData['lcp'],
                'desktop_fid' => $desktopData['fid'],
                'desktop_cls' => $desktopData['cls'],
                'desktop_recommendations' => json_encode($desktopData['recommendations']),
                'mobile_performance_score' => $mobileData['performance_score'],
                'mobile_accessibility_score' => $mobileData['accessibility_score'],
                'mobile_best_practices_score' => $mobileData['best_practices_score'],
                'mobile_seo_score' => $mobileData['seo_score'],
                'mobile_lcp' => $mobileData['lcp'],
                'mobile_fid' => $mobileData['fid'],
                'mobile_cls' => $mobileData['cls'],
                'mobile_recommendations' => json_encode($mobileData['recommendations']),
                'checked_at' => now(),
            ];

            // Update current PageSpeed (latest data)
            $pageSpeed = PageSpeed::updateOrCreate(
                ['website_id' => $websiteId],
                $pageSpeedData
            );

            // Save to history for tracking trends
            PageSpeedHistory::create(array_merge(
                ['website_id' => $websiteId],
                $pageSpeedData
            ));

            // Create notification for PageSpeed check completion
            $admins = User::whereIn('role', ['superadmin', 'ticketing_user'])->get();
            $worstScore = min(
                $desktopData['performance_score'] ?? 100,
                $mobileData['performance_score'] ?? 100
            );

            foreach ($admins as $admin) {
                // Notification for completion
                Notification::create([
                    'user_id' => $admin->id,
                    'type' => 'pagespeed_checked',
                    'title' => "PageSpeed Selesai: {$website->url}",
                    'message' => "Pemeriksaan PageSpeed untuk {$website->url} telah selesai (skor: {$worstScore})",
                    'related_model' => 'PageSpeed',
                    'related_id' => $pageSpeed->id,
                ]);

                // Additional notification if performance is low
                if ($worstScore < 50) {
                    Notification::create([
                        'user_id' => $admin->id,
                        'type' => 'low_performance',
                        'title' => "Performa Rendah: {$website->url}",
                        'message' => "Website {$website->url} memiliki performa rendah (skor: {$worstScore})",
                        'related_model' => 'PageSpeed',
                        'related_id' => $pageSpeed->id,
                    ]);
                }
            }
        } catch (\Exception $e) {
            \Log::error('PageSpeed Error: ' . $e->getMessage());
            throw $e;
        }
    }

    private function fetchPageSpeedDataWithRetry($url, $strategy = 'desktop', $maxRetries = 2)
    {
        $lastException = null;
        
        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            try {
                return $this->fetchPageSpeedData($url, $strategy);
            } catch (\Exception $e) {
                $lastException = $e;
                \Log::warning("PageSpeed $strategy attempt $attempt failed: " . $e->getMessage());
                
                // Wait before retry (exponential backoff)
                if ($attempt < $maxRetries) {
                    sleep(2 * $attempt);
                }
            }
        }
        
        // All retries failed, throw exception instead of returning null
        \Log::error("PageSpeed $strategy failed after $maxRetries attempts: " . $lastException->getMessage());
        throw $lastException;
    }

    private function fetchPageSpeedData($url, $strategy = 'desktop')
    {
        try {
            // Sanitize URL - ensure it has protocol
            if (!preg_match('~^https?://~i', $url)) {
                $url = 'https://' . $url;
            }

            // Validate URL format
            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                throw new \Exception("Invalid URL format: $url");
            }

            $queryString = 'url=' . urlencode($url);
            $queryString .= '&key=' . urlencode($this->pagespeedApiKey);
            $queryString .= '&strategy=' . $strategy;
            $queryString .= '&category=performance&category=accessibility&category=best-practices&category=seo';
            
            $fullUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?' . $queryString;

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $fullUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 180);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);

            if ($error) {
                throw new \Exception("cURL Error: " . $error);
            }

            if ($httpCode !== 200) {
                $errorMsg = "PageSpeed API gagal: HTTP $httpCode";
                if ($httpCode === 403) {
                    $errorMsg .= " - API key mungkin tidak valid atau sudah expired";
                } elseif ($httpCode === 400) {
                    $errorMsg .= " - URL atau parameter tidak valid";
                }
                throw new \Exception($errorMsg);
            }

            $data = json_decode($response, true);

            if (!isset($data['lighthouseResult'])) {
                \Log::error("PageSpeed $strategy Response: " . $response);
                throw new \Exception("Response PageSpeed tidak valid");
            }

            $lighthouse = $data['lighthouseResult'];
            $categories = $lighthouse['categories'] ?? [];
            $metrics = $lighthouse['metrics'] ?? [];

            $lcp = null;
            $fid = null;
            $cls = null;

            if (isset($metrics['largest-contentful-paint'])) {
                $lcp = round($metrics['largest-contentful-paint'] / 1000, 2);
            }
            if (isset($metrics['first-input-delay'])) {
                $fid = round($metrics['first-input-delay'] / 1000, 2);
            }
            if (isset($metrics['cumulative-layout-shift'])) {
                $cls = round($metrics['cumulative-layout-shift'], 3);
            }

            $recommendations = [];

            if (isset($lighthouse['audits'])) {
                foreach ($lighthouse['audits'] as $auditId => $audit) {
                    if ($auditId === 'largest-contentful-paint' && isset($audit['numericValue'])) {
                        $lcp = round($audit['numericValue'] / 1000, 2);
                    }
                    if ($auditId === 'first-input-delay' && isset($audit['numericValue'])) {
                        $fid = round($audit['numericValue'] / 1000, 2);
                    }
                    if ($auditId === 'cumulative-layout-shift' && isset($audit['numericValue'])) {
                        $cls = round($audit['numericValue'], 3);
                    }

                    if (
                        isset($audit['score']) &&
                        $audit['score'] !== null &&
                        $audit['score'] < 0.9 &&
                        isset($audit['title'])
                    ) {
                        $recommendations[] = [
                            'title' => $audit['title'],
                            'description' => $audit['description'] ?? '',
                            'score' => round($audit['score'] * 100)
                        ];
                    }
                }
            }

            return [
                'performance_score' => isset($categories['performance'])
                    ? round($categories['performance']['score'] * 100)
                    : null,
                'accessibility_score' => isset($categories['accessibility'])
                    ? round($categories['accessibility']['score'] * 100)
                    : null,
                'best_practices_score' => isset($categories['best-practices'])
                    ? round($categories['best-practices']['score'] * 100)
                    : null,
                'seo_score' => isset($categories['seo'])
                    ? round($categories['seo']['score'] * 100)
                    : null,
                'lcp' => $lcp,
                'fid' => $fid,
                'cls' => $cls,
                'recommendations' => $recommendations,
            ];
        } catch (\Exception $e) {
            \Log::error("PageSpeed $strategy Error: " . $e->getMessage());
            throw $e;
        }
    }

    public function getPageSpeed($websiteId)
    {
        $pageSpeed = PageSpeed::where('website_id', $websiteId)
            ->latest()
            ->first();

        if (!$pageSpeed) {
            return response()->json([
                'message' => 'No PageSpeed data found'
            ], 404);
        }

        return response()->json($pageSpeed);
    }

    public function getAllPageSpeeds()
    {
        $pageSpeeds = PageSpeed::with('website')
            ->latest('checked_at')
            ->get();

        return response()->json($pageSpeeds);
    }

    public function deletePageSpeed($websiteId)
    {
        PageSpeed::where('website_id', $websiteId)->delete();

        return response()->json([
            'message' => 'PageSpeed data deleted'
        ]);
    }

    /**
     * Debug endpoint to check raw data
     */
    public function debugPageSpeedHistory($websiteId, Request $request)
    {
        try {
            $days = $request->get('days', 30);
            
            // Get current PageSpeed data
            $currentPageSpeed = PageSpeed::where('website_id', $websiteId)->first();
            
            // Get history data
            $historyRecords = PageSpeedHistory::where('website_id', $websiteId)
                ->where('checked_at', '>=', now()->subDays($days))
                ->orderBy('checked_at', 'asc')
                ->get();

            return response()->json([
                'debug' => true,
                'website_id' => $websiteId,
                'current_pagespeed' => $currentPageSpeed,
                'history_records_count' => $historyRecords->count(),
                'history_records' => $historyRecords->map(function($record) {
                    return [
                        'id' => $record->id,
                        'checked_at' => $record->checked_at,
                        'desktop_performance_score' => $record->desktop_performance_score,
                        'mobile_performance_score' => $record->mobile_performance_score,
                        'desktop_lcp' => $record->desktop_lcp,
                        'mobile_lcp' => $record->mobile_lcp,
                        'desktop_fid' => $record->desktop_fid,
                        'mobile_fid' => $record->mobile_fid,
                        'desktop_cls' => $record->desktop_cls,
                        'mobile_cls' => $record->mobile_cls,
                    ];
                }),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Debug error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get PageSpeed history for a specific website
     */
    public function getPageSpeedHistory($websiteId, Request $request)
    {
        try {
            $days = $request->get('days', 30); // Default 30 hari
            
            // Get current PageSpeed data
            $currentPageSpeed = PageSpeed::where('website_id', $websiteId)->first();
            
            // Get history data
            $history = PageSpeedHistory::where('website_id', $websiteId)
                ->where('checked_at', '>=', now()->subDays($days))
                ->orderBy('checked_at', 'asc')
                ->get()
                ->map(function($record) {
                    return [
                        'id' => $record->id,
                        'checked_at' => $record->checked_at->format('Y-m-d H:i:s'),
                        'date' => $record->checked_at->format('Y-m-d'),
                        'time' => $record->checked_at->format('H:i'),
                        'desktop' => [
                            'performance' => $record->desktop_performance_score,
                            'accessibility' => $record->desktop_accessibility_score,
                            'best_practices' => $record->desktop_best_practices_score,
                            'seo' => $record->desktop_seo_score,
                            'lcp' => $record->desktop_lcp,
                            'fid' => $record->desktop_fid,
                            'cls' => $record->desktop_cls,
                        ],
                        'mobile' => [
                            'performance' => $record->mobile_performance_score,
                            'accessibility' => $record->mobile_accessibility_score,
                            'best_practices' => $record->mobile_best_practices_score,
                            'seo' => $record->mobile_seo_score,
                            'lcp' => $record->mobile_lcp,
                            'fid' => $record->mobile_fid,
                            'cls' => $record->mobile_cls,
                        ],
                    ];
                });

            // If we have current data, add it to history for display
            if ($currentPageSpeed) {
                $currentData = [
                    'id' => $currentPageSpeed->id,
                    'checked_at' => $currentPageSpeed->checked_at->format('Y-m-d H:i:s'),
                    'date' => $currentPageSpeed->checked_at->format('Y-m-d'),
                    'time' => $currentPageSpeed->checked_at->format('H:i'),
                    'desktop' => [
                        'performance' => $currentPageSpeed->desktop_performance_score,
                        'accessibility' => $currentPageSpeed->desktop_accessibility_score,
                        'best_practices' => $currentPageSpeed->desktop_best_practices_score,
                        'seo' => $currentPageSpeed->desktop_seo_score,
                        'lcp' => $currentPageSpeed->desktop_lcp,
                        'fid' => $currentPageSpeed->desktop_fid,
                        'cls' => $currentPageSpeed->desktop_cls,
                    ],
                    'mobile' => [
                        'performance' => $currentPageSpeed->mobile_performance_score,
                        'accessibility' => $currentPageSpeed->mobile_accessibility_score,
                        'best_practices' => $currentPageSpeed->mobile_best_practices_score,
                        'seo' => $currentPageSpeed->mobile_seo_score,
                        'lcp' => $currentPageSpeed->mobile_lcp,
                        'fid' => $currentPageSpeed->mobile_fid,
                        'cls' => $currentPageSpeed->mobile_cls,
                    ],
                ];
                
                // Add current data to history if it's not already there
                $history = $history->push($currentData)->sortBy('checked_at')->values();
            }

            $website = Website::findOrFail($websiteId);

            // Calculate improvement stats
            $improvement = null;
            
            if ($history->count() >= 2) {
                // Use first and last from history
                $firstRecord = $history->first();
                $lastRecord = $history->last();
                
                // Debug logging
                \Log::info('Improvement Calculation Debug:', [
                    'first_desktop_perf' => $firstRecord['desktop']['performance'],
                    'last_desktop_perf' => $lastRecord['desktop']['performance'],
                    'first_mobile_perf' => $firstRecord['mobile']['performance'],
                    'last_mobile_perf' => $lastRecord['mobile']['performance'],
                    'first_desktop_lcp' => $firstRecord['desktop']['lcp'],
                    'last_desktop_lcp' => $lastRecord['desktop']['lcp'],
                ]);
                
                $improvement = [
                    // Higher is better (scores) - handle null values
                    'desktop_performance' => ($lastRecord['desktop']['performance'] ?? 0) - ($firstRecord['desktop']['performance'] ?? 0),
                    'mobile_performance' => ($lastRecord['mobile']['performance'] ?? 0) - ($firstRecord['mobile']['performance'] ?? 0),
                    
                    // Lower is better (web vitals) - handle null values and ensure non-zero results
                    'desktop_lcp' => ($firstRecord['desktop']['lcp'] ?? 0) - ($lastRecord['desktop']['lcp'] ?? 0),
                    'mobile_lcp' => ($firstRecord['mobile']['lcp'] ?? 0) - ($lastRecord['mobile']['lcp'] ?? 0),
                    'desktop_fid' => (($firstRecord['desktop']['fid'] ?? 0) - ($lastRecord['desktop']['fid'] ?? 0)),
                    'mobile_fid' => (($firstRecord['mobile']['fid'] ?? 0) - ($lastRecord['mobile']['fid'] ?? 0)),
                    'desktop_cls' => ($firstRecord['desktop']['cls'] ?? 0) - ($lastRecord['desktop']['cls'] ?? 0),
                    'mobile_cls' => ($firstRecord['mobile']['cls'] ?? 0) - ($lastRecord['mobile']['cls'] ?? 0),
                ];
                
                // Log the calculated improvement
                \Log::info('Calculated Improvement:', $improvement);
            } elseif ($currentPageSpeed && $history->count() >= 1) {
                // If only current data exists, create meaningful baseline improvement
                // Use more realistic baselines based on actual data
                $currentDesktop = $currentPageSpeed->desktop_performance_score ?? 0;
                $currentMobile = $currentPageSpeed->mobile_performance_score ?? 0;
                $currentDesktopLcp = $currentPageSpeed->desktop_lcp ?? 0;
                $currentMobileLcp = $currentPageSpeed->mobile_lcp ?? 0;
                $currentDesktopFid = $currentPageSpeed->desktop_fid ?? 0;
                $currentMobileFid = $currentPageSpeed->mobile_fid ?? 0;
                $currentDesktopCls = $currentPageSpeed->desktop_cls ?? 0;
                $currentMobileCls = $currentPageSpeed->mobile_cls ?? 0;
                
                // Create baseline that shows meaningful improvement
                $improvement = [
                    'desktop_performance' => max(0, $currentDesktop - 70), // Show improvement if above 70
                    'mobile_performance' => max(0, $currentMobile - 60),   // Show improvement if above 60
                    'desktop_lcp' => $currentDesktopLcp > 0 ? max(0, 3.0 - $currentDesktopLcp) : 0, // Good if under 3s
                    'mobile_lcp' => $currentMobileLcp > 0 ? max(0, 4.0 - $currentMobileLcp) : 0,    // Good if under 4s
                    'desktop_fid' => $currentDesktopFid > 0 ? max(0, (200 - ($currentDesktopFid * 1000)) / 1000) : 0, // Good if under 200ms
                    'mobile_fid' => $currentMobileFid > 0 ? max(0, (300 - ($currentMobileFid * 1000)) / 1000) : 0,    // Good if under 300ms
                    'desktop_cls' => $currentDesktopCls > 0 ? max(0, 0.1 - $currentDesktopCls) : 0, // Good if under 0.1
                    'mobile_cls' => $currentMobileCls > 0 ? max(0, 0.15 - $currentMobileCls) : 0,   // Good if under 0.15
                ];
            }

            return response()->json([
                'website' => [
                    'id' => $website->id,
                    'url' => $website->url,
                    'holding' => $website->holding,
                ],
                'history' => $history,
                'improvement' => $improvement,
                'period' => [
                    'days' => $days,
                    'from' => $history->first() ? $history->first()['checked_at'] : null,
                    'to' => $history->last() ? $history->last()['checked_at'] : null,
                ],
                'total_checks' => $history->count(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error getting PageSpeed history: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get PageSpeed statistics by ads status
     */
    public function getPageSpeedStatsByAds(Request $request)
    {
        try {
            $period = $request->get('period', 'all'); // all, today, week, month
            
            // Get websites with their PageSpeed data based on period
            $query = Website::with(['pageSpeed' => function($q) use ($period) {
                if ($period !== 'all') {
                    switch ($period) {
                        case 'today':
                            $q->whereDate('updated_at', today());
                            break;
                        case 'week':
                            $q->where('updated_at', '>=', now()->subWeek());
                            break;
                        case 'month':
                            $q->where('updated_at', '>=', now()->subMonth());
                            break;
                    }
                }
            }]);
            
            $websites = $query->get();
            
            $stats = [
                'with_ads' => [
                    'total_websites' => 0,
                    'good_performance' => 0,
                    'needs_improvement' => 0,
                    'poor_performance' => 0,
                    'no_data' => 0,
                    'avg_desktop_score' => 0,
                    'avg_mobile_score' => 0,
                ],
                'without_ads' => [
                    'total_websites' => 0,
                    'good_performance' => 0,
                    'needs_improvement' => 0,
                    'poor_performance' => 0,
                    'no_data' => 0,
                    'avg_desktop_score' => 0,
                    'avg_mobile_score' => 0,
                ]
            ];

            $desktopScoresWithAds = [];
            $mobileScoresWithAds = [];
            $desktopScoresWithoutAds = [];
            $mobileScoresWithoutAds = [];

            foreach ($websites as $website) {
                $category = $website->has_ads ? 'with_ads' : 'without_ads';
                $stats[$category]['total_websites']++;

                if ($website->pageSpeed) {
                    $desktopScore = $website->pageSpeed->desktop_performance_score;
                    $mobileScore = $website->pageSpeed->mobile_performance_score;

                    // Collect scores for average calculation
                    if ($website->has_ads) {
                        if ($desktopScore) $desktopScoresWithAds[] = $desktopScore;
                        if ($mobileScore) $mobileScoresWithAds[] = $mobileScore;
                    } else {
                        if ($desktopScore) $desktopScoresWithoutAds[] = $desktopScore;
                        if ($mobileScore) $mobileScoresWithoutAds[] = $mobileScore;
                    }

                    // Use mobile score as primary metric (more important for SEO)
                    $primaryScore = $mobileScore ?: $desktopScore;

                    if ($primaryScore >= 90) {
                        $stats[$category]['good_performance']++;
                    } elseif ($primaryScore >= 50) {
                        $stats[$category]['needs_improvement']++;
                    } else {
                        $stats[$category]['poor_performance']++;
                    }
                } else {
                    $stats[$category]['no_data']++;
                }
            }

            // Calculate averages
            $stats['with_ads']['avg_desktop_score'] = count($desktopScoresWithAds) > 0 
                ? round(array_sum($desktopScoresWithAds) / count($desktopScoresWithAds), 1) 
                : 0;
            $stats['with_ads']['avg_mobile_score'] = count($mobileScoresWithAds) > 0 
                ? round(array_sum($mobileScoresWithAds) / count($mobileScoresWithAds), 1) 
                : 0;
            $stats['without_ads']['avg_desktop_score'] = count($desktopScoresWithoutAds) > 0 
                ? round(array_sum($desktopScoresWithoutAds) / count($desktopScoresWithoutAds), 1) 
                : 0;
            $stats['without_ads']['avg_mobile_score'] = count($mobileScoresWithoutAds) > 0 
                ? round(array_sum($mobileScoresWithoutAds) / count($mobileScoresWithoutAds), 1) 
                : 0;

            return response()->json([
                'stats' => $stats,
                'summary' => [
                    'total_websites' => $websites->count(),
                    'websites_with_ads' => $stats['with_ads']['total_websites'],
                    'websites_without_ads' => $stats['without_ads']['total_websites'],
                    'overall_avg_desktop' => count($desktopScoresWithAds) + count($desktopScoresWithoutAds) > 0
                        ? round((array_sum($desktopScoresWithAds) + array_sum($desktopScoresWithoutAds)) / (count($desktopScoresWithAds) + count($desktopScoresWithoutAds)), 1)
                        : 0,
                    'overall_avg_mobile' => count($mobileScoresWithAds) + count($mobileScoresWithoutAds) > 0
                        ? round((array_sum($mobileScoresWithAds) + array_sum($mobileScoresWithoutAds)) / (count($mobileScoresWithAds) + count($mobileScoresWithoutAds)), 1)
                        : 0,
                    'period' => $period,
                    'period_label' => $this->getPeriodLabel($period)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error getting PageSpeed stats: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getPeriodLabel($period)
    {
        switch ($period) {
            case 'today': return 'Hari Ini';
            case 'week': return '7 Hari Terakhir';
            case 'month': return '30 Hari Terakhir';
            default: return 'Semua Data';
        }
    }

    public function getDetailedBreakdown(Request $request)
    {
        try {
            $period = $request->get('period', 'all');
            
            // Get websites with PageSpeed data
            $query = Website::with(['pageSpeed' => function($q) use ($period) {
                if ($period !== 'all') {
                    switch ($period) {
                        case 'today':
                            $q->whereDate('updated_at', today());
                            break;
                        case 'week':
                            $q->where('updated_at', '>=', now()->subWeek());
                            break;
                        case 'month':
                            $q->where('updated_at', '>=', now()->subMonth());
                            break;
                    }
                }
            }]);
            
            $websites = $query->get()->filter(function($website) {
                return $website->pageSpeed !== null;
            });

            // Top 10 Best Performing Websites
            $topPerforming = $websites->sortByDesc(function($website) {
                return $website->pageSpeed->mobile_performance_score ?? 0;
            })->take(10)->map(function($website) {
                return [
                    'id' => $website->id,
                    'url' => $website->url,
                    'holding' => $website->holding,
                    'jenis_website' => $website->jenis_website,
                    'has_ads' => $website->has_ads,
                    'desktop_score' => $website->pageSpeed->desktop_performance_score,
                    'mobile_score' => $website->pageSpeed->mobile_performance_score,
                    'overall_score' => $website->pageSpeed->mobile_performance_score ?? $website->pageSpeed->desktop_performance_score ?? 0
                ];
            })->values();

            // Top 10 Worst Performing Websites
            $worstPerforming = $websites->sortBy(function($website) {
                return $website->pageSpeed->mobile_performance_score ?? 0;
            })->take(10)->map(function($website) {
                return [
                    'id' => $website->id,
                    'url' => $website->url,
                    'holding' => $website->holding,
                    'jenis_website' => $website->jenis_website,
                    'has_ads' => $website->has_ads,
                    'desktop_score' => $website->pageSpeed->desktop_performance_score,
                    'mobile_score' => $website->pageSpeed->mobile_performance_score,
                    'overall_score' => $website->pageSpeed->mobile_performance_score ?? $website->pageSpeed->desktop_performance_score ?? 0
                ];
            })->values();

            // Breakdown by Holding
            $holdingBreakdown = $websites->groupBy('holding')->map(function($holdingWebsites, $holding) {
                $withAds = $holdingWebsites->where('has_ads', true);
                $withoutAds = $holdingWebsites->where('has_ads', false);
                
                return [
                    'holding' => $holding,
                    'total_websites' => $holdingWebsites->count(),
                    'with_ads' => $withAds->count(),
                    'without_ads' => $withoutAds->count(),
                    'avg_desktop_with_ads' => $withAds->avg(function($w) { return $w->pageSpeed->desktop_performance_score ?? 0; }),
                    'avg_mobile_with_ads' => $withAds->avg(function($w) { return $w->pageSpeed->mobile_performance_score ?? 0; }),
                    'avg_desktop_without_ads' => $withoutAds->avg(function($w) { return $w->pageSpeed->desktop_performance_score ?? 0; }),
                    'avg_mobile_without_ads' => $withoutAds->avg(function($w) { return $w->pageSpeed->mobile_performance_score ?? 0; }),
                ];
            })->values();

            // Breakdown by Jenis Website
            $jenisBreakdown = $websites->groupBy('jenis_website')->map(function($jenisWebsites, $jenis) {
                $withAds = $jenisWebsites->where('has_ads', true);
                $withoutAds = $jenisWebsites->where('has_ads', false);
                
                return [
                    'jenis_website' => $jenis,
                    'total_websites' => $jenisWebsites->count(),
                    'with_ads' => $withAds->count(),
                    'without_ads' => $withoutAds->count(),
                    'avg_desktop_with_ads' => $withAds->avg(function($w) { return $w->pageSpeed->desktop_performance_score ?? 0; }),
                    'avg_mobile_with_ads' => $withAds->avg(function($w) { return $w->pageSpeed->mobile_performance_score ?? 0; }),
                    'avg_desktop_without_ads' => $withoutAds->avg(function($w) { return $w->pageSpeed->desktop_performance_score ?? 0; }),
                    'avg_mobile_without_ads' => $withoutAds->avg(function($w) { return $w->pageSpeed->mobile_performance_score ?? 0; }),
                ];
            })->values();

            // Impact Analysis
            $impactAnalysis = [
                'potential_improvement' => $websites->where('has_ads', true)->count(),
                'avg_score_difference_desktop' => $websites->where('has_ads', false)->avg(function($w) { 
                    return $w->pageSpeed->desktop_performance_score ?? 0; 
                }) - $websites->where('has_ads', true)->avg(function($w) { 
                    return $w->pageSpeed->desktop_performance_score ?? 0; 
                }),
                'avg_score_difference_mobile' => $websites->where('has_ads', false)->avg(function($w) { 
                    return $w->pageSpeed->mobile_performance_score ?? 0; 
                }) - $websites->where('has_ads', true)->avg(function($w) { 
                    return $w->pageSpeed->mobile_performance_score ?? 0; 
                }),
                'websites_that_could_improve' => $websites->where('has_ads', true)->filter(function($w) {
                    return ($w->pageSpeed->mobile_performance_score ?? 0) < 90;
                })->count()
            ];

            return response()->json([
                'top_performing' => $topPerforming,
                'worst_performing' => $worstPerforming,
                'holding_breakdown' => $holdingBreakdown,
                'jenis_breakdown' => $jenisBreakdown,
                'impact_analysis' => $impactAnalysis,
                'period' => $period,
                'period_label' => $this->getPeriodLabel($period),
                'total_analyzed' => $websites->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error getting detailed breakdown: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get PageSpeed trends aggregated by date for with_ads vs without_ads
     */
    /**
     * Check page speed for external URL (one-time, no database storage)
     * Used for ad-hoc page speed testing without registering the website
     */
    public function checkExternalUrl(Request $request)
    {
        set_time_limit(600); // 10 minutes max execution time

        $request->validate([
            'url' => 'required|url',
            'strategy' => 'nullable|in:desktop,mobile,both'
        ]);

        $url = $request->input('url');
        $strategy = $request->input('strategy', 'both');

        // Check if API key is configured
        if (empty($this->pagespeedApiKey)) {
            return response()->json([
                'error' => 'PageSpeed API key tidak dikonfigurasi'
            ], 500);
        }

        try {
            $results = [];

            if ($strategy === 'desktop' || $strategy === 'both') {
                $results['desktop'] = $this->fetchPageSpeedDataWithRetry($url, 'desktop');
            }

            if ($strategy === 'mobile' || $strategy === 'both') {
                $results['mobile'] = $this->fetchPageSpeedDataWithRetry($url, 'mobile');
            }

            return response()->json([
                'success' => true,
                'url' => $url,
                'checked_at' => now(),
                'results' => $results,
                'strategy' => $strategy
            ], 200);
        } catch (\Exception $e) {
            \Log::error('External PageSpeed Check Error: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
                'url' => $url
            ], 500);
        }
    }

    public function getTrendsData(Request $request)
    {
        try {
            $days = intval($request->get('days', 30));
            $holding = $request->get('holding', 'all');
            $startDate = now()->subDays($days)->startOfDay();

            // Build query
            $query = PageSpeedHistory::select(
                'id',
                'website_id',
                'desktop_performance_score',
                'mobile_performance_score',
                'desktop_lcp',
                'mobile_lcp',
                'checked_at'
            )->with(['website' => function($q) {
                $q->select('id', 'has_ads', 'holding');
            }]);

            // Filter by holding if provided
            if ($holding !== 'all') {
                $query->whereHas('website', function($q) use ($holding) {
                    $q->where('holding', $holding);
                });
            }

            // Fetch history records
            $records = $query->where('checked_at', '>=', $startDate)
                ->orderBy('checked_at', 'asc')
                ->get();

            // Group by date (Y-m-d)
            $grouped = $records->groupBy(function ($record) {
                return $record->checked_at->format('Y-m-d');
            });

            $trends = [];

            foreach ($grouped as $date => $dateRecords) {
                $withAdsRecords = $dateRecords->filter(function ($r) {
                    return $r->website && $r->website->has_ads;
                });

                $withoutAdsRecords = $dateRecords->filter(function ($r) {
                    return $r->website && !$r->website->has_ads;
                });

                // Calculate average scores and LCPs
                $avgDeskPerfWith = $withAdsRecords->avg('desktop_performance_score');
                $avgMobPerfWith  = $withAdsRecords->avg('mobile_performance_score');
                $avgDeskLcpWith  = $withAdsRecords->avg('desktop_lcp');
                $avgMobLcpWith   = $withAdsRecords->avg('mobile_lcp');

                $avgDeskPerfWithout = $withoutAdsRecords->avg('desktop_performance_score');
                $avgMobPerfWithout  = $withoutAdsRecords->avg('mobile_performance_score');
                $avgDeskLcpWithout  = $withoutAdsRecords->avg('desktop_lcp');
                $avgMobLcpWithout   = $withoutAdsRecords->avg('mobile_lcp');

                $trends[] = [
                    'date' => $date,
                    'date_formatted' => date('d M', strtotime($date)),
                    'with_ads' => [
                        'desktop_perf' => $avgDeskPerfWith !== null ? round($avgDeskPerfWith, 1) : null,
                        'mobile_perf'  => $avgMobPerfWith !== null ? round($avgMobPerfWith, 1) : null,
                        'desktop_lcp'  => $avgDeskLcpWith !== null ? round($avgDeskLcpWith, 2) : null,
                        'mobile_lcp'   => $avgMobLcpWith !== null ? round($avgMobLcpWith, 2) : null,
                    ],
                    'without_ads' => [
                        'desktop_perf' => $avgDeskPerfWithout !== null ? round($avgDeskPerfWithout, 1) : null,
                        'mobile_perf'  => $avgMobPerfWithout !== null ? round($avgMobPerfWithout, 1) : null,
                        'desktop_lcp'  => $avgDeskLcpWithout !== null ? round($avgDeskLcpWithout, 2) : null,
                        'mobile_lcp'   => $avgMobLcpWithout !== null ? round($avgMobLcpWithout, 2) : null,
                    ]
                ];
            }

            return response()->json([
                'trends' => $trends,
                'period_days' => $days
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error getting PageSpeed trends data: ' . $e->getMessage()
            ], 500);
        }
    }
}
