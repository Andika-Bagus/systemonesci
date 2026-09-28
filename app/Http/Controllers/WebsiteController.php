<?php

namespace App\Http\Controllers;

use App\Models\Website;
use Illuminate\Http\Request;

class WebsiteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Website::query();
        
        // Exclude OJS instances by default (for Website List), 
        // but include them if requested (e.g. for Uptime Monitor)
        if (!$request->has('include_ojs')) {
            $query->where('jenis_website', '!=', 'OJS');
        }
        
        return response()->json($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Normalize URL - add trailing slash for consistency
        $url = $request->input('url');
        if ($url && !str_ends_with($url, '/')) {
            $url = $url . '/';
            $request->merge(['url' => $url]);
        }

        $validated = $request->validate([
            'holding' => 'required|string',
            'jenis_website' => 'required|string',
            'url' => 'required|url|unique:websites,url',
            'letak_server' => 'nullable|string',
            'cdn_provider' => 'nullable|string',
            'pic' => 'nullable|string',
            'has_ads' => 'boolean',
            'wp_username' => 'nullable|string',
            'wp_password' => 'nullable|string',
        ]);

        $website = Website::create($validated);
        return response()->json($website, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Website $website)
    {
        return response()->json($website);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Website $website)
    {
        // Normalize URL - add trailing slash for consistency
        $url = $request->input('url');
        if ($url && !str_ends_with($url, '/')) {
            $url = $url . '/';
            $request->merge(['url' => $url]);
        }

        $validated = $request->validate([
            'holding' => 'sometimes|string',
            'jenis_website' => 'sometimes|string',
            'url' => 'sometimes|url|unique:websites,url,' . $website->id,
            'letak_server' => 'nullable|string',
            'cdn_provider' => 'nullable|string',
            'pic' => 'nullable|string',
            'has_ads' => 'boolean',
            'wp_username' => 'nullable|string',
            'wp_password' => 'nullable|string',
            'wp_login_url' => 'nullable|url',
        ]);

        $website->update($validated);
        return response()->json($website);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Website $website)
    {
        $website->delete();
        return response()->json(null, 204);
    }

    /**
     * Check if website has ads
     */
    public function checkAds(Website $website)
    {
        try {
            // Get website content
            $context = stream_context_create([
                'http' => [
                    'timeout' => 30,
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                ]
            ]);
            
            $content = @file_get_contents($website->url, false, $context);
            
            if ($content === false) {
                return response()->json([
                    'error' => 'Unable to fetch website content',
                    'has_ads' => null
                ], 400);
            }
            
            // Check for common ad indicators
            $adIndicators = [
                'google-adsense',
                'googlesyndication',
                'doubleclick.net',
                'adsystem.com',
                'amazon-adsystem',
                'facebook.com/tr',
                'ads.yahoo.com',
                'bing.com/ads',
                'outbrain.com',
                'taboola.com',
                'adsense',
                'adnxs.com',
                'adsystem',
                'advertisement',
                'ad-banner',
                'ad-container',
                'google_ads',
                'data-ad-',
                'class="ad',
                'id="ad',
            ];
            
            $hasAds = false;
            $foundIndicators = [];
            
            foreach ($adIndicators as $indicator) {
                if (stripos($content, $indicator) !== false) {
                    $hasAds = true;
                    $foundIndicators[] = $indicator;
                }
            }
            
            // Update website record
            $website->update(['has_ads' => $hasAds]);
            
            return response()->json([
                'website_id' => $website->id,
                'url' => $website->url,
                'has_ads' => $hasAds,
                'indicators_found' => $foundIndicators,
                'checked_at' => now()
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error checking ads: ' . $e->getMessage(),
                'has_ads' => null
            ], 500);
        }
    }

    /**
     * Check ads for all websites
     */
    public function checkAllAds()
    {
        try {
            $websites = Website::all();
            $results = [];
            
            foreach ($websites as $website) {
                // Get website content
                $context = stream_context_create([
                    'http' => [
                        'timeout' => 30,
                        'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    ]
                ]);
                
                $content = @file_get_contents($website->url, false, $context);
                
                if ($content === false) {
                    $results[] = [
                        'website_id' => $website->id,
                        'url' => $website->url,
                        'error' => 'Unable to fetch content',
                        'has_ads' => null
                    ];
                    continue;
                }
                
                // Check for common ad indicators
                $adIndicators = [
                    'google-adsense',
                    'googlesyndication',
                    'doubleclick.net',
                    'adsystem.com',
                    'amazon-adsystem',
                    'facebook.com/tr',
                    'ads.yahoo.com',
                    'bing.com/ads',
                    'outbrain.com',
                    'taboola.com',
                    'adsense',
                    'adnxs.com',
                    'adsystem',
                    'advertisement',
                    'ad-banner',
                    'ad-container',
                    'google_ads',
                    'data-ad-',
                    'class="ad',
                    'id="ad',
                ];
                
                $hasAds = false;
                $foundIndicators = [];
                
                foreach ($adIndicators as $indicator) {
                    if (stripos($content, $indicator) !== false) {
                        $hasAds = true;
                        $foundIndicators[] = $indicator;
                    }
                }
                
                // Update website record
                $website->update(['has_ads' => $hasAds]);
                
                $results[] = [
                    'website_id' => $website->id,
                    'url' => $website->url,
                    'has_ads' => $hasAds,
                    'indicators_found' => $foundIndicators
                ];
                
                // Small delay to avoid overwhelming servers
                usleep(500000); // 0.5 seconds
            }
            
            return response()->json([
                'message' => 'Ads check completed for all websites',
                'total_checked' => count($websites),
                'results' => $results,
                'checked_at' => now()
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error checking ads for all websites: ' . $e->getMessage()
            ], 500);
        }
    }
}
