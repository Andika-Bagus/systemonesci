<?php

namespace App\Http\Controllers;

use App\Models\UptimeCheck;
use App\Models\UptimeIncident;
use App\Models\Website;
use App\Models\Notification;
use App\Models\User;
use App\Mail\WebsiteDownAlert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class UptimeController extends Controller
{
    /**
     * Check uptime for a specific website
     */
    public function checkUptime($websiteId)
    {
        try {
            $website = Website::findOrFail($websiteId);
            
            $result = $this->performUptimeCheck($website);
            
            return response()->json([
                'website_id' => $website->id,
                'url' => $website->url,
                'status' => $result['status'],
                'http_code' => $result['http_code'],
                'response_time' => $result['response_time'],
                'checked_at' => now()->format('Y-m-d H:i:s'),
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error checking uptime: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Perform the actual uptime check
     */
    private function performUptimeCheck($website)
    {
        $url = $website->url;
        
        // Ensure URL has protocol
        if (!preg_match('~^https?://~i', $url)) {
            $url = 'https://' . $url;
        }

        $startTime = microtime(true);
        $status = 'down';
        $httpCode = null;
        $errorMessage = null;

        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_NOBODY, true); // HEAD request only
            
            curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            curl_close($ch);

            $endTime = microtime(true);
            $responseTime = round(($endTime - $startTime) * 1000); // Convert to milliseconds

            // Consider 2xx and 3xx as UP
            if ($httpCode >= 200 && $httpCode < 400) {
                $status = 'up';
            } else {
                $status = 'down';
                $errorMessage = "HTTP {$httpCode}";
            }

            if ($curlError) {
                $status = 'down';
                $errorMessage = $curlError;
            }

        } catch (\Exception $e) {
            $endTime = microtime(true);
            $responseTime = round(($endTime - $startTime) * 1000);
            $status = 'down';
            $errorMessage = $e->getMessage();
        }

        // Save check result
        $uptimeCheck = UptimeCheck::create([
            'website_id' => $website->id,
            'status' => $status,
            'http_code' => $httpCode,
            'response_time' => $responseTime ?? null,
            'error_message' => $errorMessage,
            'checked_at' => now(),
        ]);

        // Handle incidents
        $this->handleIncident($website, $status, $errorMessage);

        return [
            'status' => $status,
            'http_code' => $httpCode,
            'response_time' => $responseTime ?? null,
            'error_message' => $errorMessage,
        ];
    }

    /**
     * Handle uptime incidents (track downtime)
     */
    private function handleIncident($website, $status, $errorMessage)
    {
        // Get the last unresolved incident
        $lastIncident = UptimeIncident::where('website_id', $website->id)
            ->where('is_resolved', false)
            ->latest()
            ->first();

        if ($status === 'down') {
            // If no active incident, create new one
            if (!$lastIncident) {
                UptimeIncident::create([
                    'website_id' => $website->id,
                    'started_at' => now(),
                    'reason' => $errorMessage,
                    'is_resolved' => false,
                ]);

                // Send notification to admins
                $this->sendDownNotification($website, $errorMessage);
            }
        } else {
            // If status is UP and there's an active incident, resolve it
            if ($lastIncident) {
                $duration = now()->diffInSeconds($lastIncident->started_at);
                
                $lastIncident->update([
                    'ended_at' => now(),
                    'duration' => $duration,
                    'is_resolved' => true,
                ]);

                // Send recovery notification
                $this->sendRecoveryNotification($website, $duration);
            }
        }
    }

    /**
     * Send notification when website goes down
     */
    private function sendDownNotification($website, $errorMessage)
    {
        $admins = User::whereIn('role', ['superadmin', 'ticketing_user'])->get();

        foreach ($admins as $admin) {
            // Create in-app notification
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'website_down',
                'title' => "Website Down: {$website->url}",
                'message' => "Website {$website->url} is currently down. Reason: {$errorMessage}",
                'related_model' => 'Website',
                'related_id' => $website->id,
            ]);

            // Send email notification
            try {
                $httpCode = preg_match('/HTTP (\d+)/', $errorMessage, $matches) ? $matches[1] : null;
                Mail::to($admin->email)->send(new WebsiteDownAlert($website, $httpCode, now()));
            } catch (\Exception $e) {
                \Log::error("Failed to send email to {$admin->email}: " . $e->getMessage());
            }
        }
    }

    /**
     * Send notification when website recovers
     */
    private function sendRecoveryNotification($website, $duration)
    {
        $admins = User::whereIn('role', ['superadmin', 'ticketing_user'])->get();
        $durationText = $this->formatDuration($duration);

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'website_recovered',
                'title' => "Website Recovered: {$website->url}",
                'message' => "Website {$website->url} is back online. Downtime: {$durationText}",
                'related_model' => 'Website',
                'related_id' => $website->id,
            ]);
        }
    }

    /**
     * Format duration in human readable format
     */
    private function formatDuration($seconds)
    {
        if ($seconds < 60) {
            return "{$seconds} detik";
        } elseif ($seconds < 3600) {
            $minutes = floor($seconds / 60);
            return "{$minutes} menit";
        } else {
            $hours = floor($seconds / 3600);
            $minutes = floor(($seconds % 3600) / 60);
            return "{$hours} jam {$minutes} menit";
        }
    }

    /**
     * Get uptime statistics for a website
     */
    public function getUptimeStats($websiteId, Request $request)
    {
        try {
            $days = $request->get('days', 30);
            $website = Website::findOrFail($websiteId);

            // Get all checks in the period
            $checks = UptimeCheck::where('website_id', $websiteId)
                ->where('checked_at', '>=', now()->subDays($days))
                ->orderBy('checked_at', 'desc')
                ->get();

            $totalChecks = $checks->count();
            $upChecks = $checks->where('status', 'up')->count();
            $downChecks = $checks->where('status', 'down')->count();

            $uptimePercentage = $totalChecks > 0 
                ? round(($upChecks / $totalChecks) * 100, 2) 
                : 0;

            // Get current status (latest check)
            $latestCheck = $checks->first();
            $currentStatus = $latestCheck ? $latestCheck->status : 'unknown';

            // Get average response time
            $avgResponseTime = $checks->where('status', 'up')
                ->avg('response_time');
            $avgResponseTime = $avgResponseTime ? round($avgResponseTime) : null;

            // Get incidents in the period
            $incidents = UptimeIncident::where('website_id', $websiteId)
                ->where('started_at', '>=', now()->subDays($days))
                ->orderBy('started_at', 'desc')
                ->get()
                ->map(function($incident) {
                    return [
                        'id' => $incident->id,
                        'started_at' => $incident->started_at->format('Y-m-d H:i:s'),
                        'ended_at' => $incident->ended_at ? $incident->ended_at->format('Y-m-d H:i:s') : null,
                        'duration' => $incident->duration,
                        'duration_text' => $incident->duration ? $this->formatDuration($incident->duration) : 'Ongoing',
                        'reason' => $incident->reason,
                        'is_resolved' => $incident->is_resolved,
                    ];
                });

            return response()->json([
                'website' => [
                    'id' => $website->id,
                    'url' => $website->url,
                ],
                'current_status' => $currentStatus,
                'uptime_percentage' => $uptimePercentage,
                'total_checks' => $totalChecks,
                'up_checks' => $upChecks,
                'down_checks' => $downChecks,
                'avg_response_time' => $avgResponseTime,
                'incidents' => $incidents,
                'period' => [
                    'days' => $days,
                    'from' => $checks->last() ? $checks->last()->checked_at->format('Y-m-d H:i:s') : null,
                    'to' => $checks->first() ? $checks->first()->checked_at->format('Y-m-d H:i:s') : null,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error getting uptime stats: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get uptime history for charts
     */
    public function getUptimeHistory($websiteId, Request $request)
    {
        try {
            $days = $request->get('days', 7);
            
            $history = UptimeCheck::where('website_id', $websiteId)
                ->where('checked_at', '>=', now()->subDays($days))
                ->orderBy('checked_at', 'asc')
                ->get()
                ->map(function($check) {
                    return [
                        'checked_at' => $check->checked_at->format('Y-m-d H:i:s'),
                        'date' => $check->checked_at->format('Y-m-d'),
                        'time' => $check->checked_at->format('H:i'),
                        'status' => $check->status,
                        'http_code' => $check->http_code,
                        'response_time' => $check->response_time,
                    ];
                });

            return response()->json([
                'history' => $history,
                'period' => [
                    'days' => $days,
                    'from' => $history->first() ? $history->first()['checked_at'] : null,
                    'to' => $history->last() ? $history->last()['checked_at'] : null,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error getting uptime history: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get uptime status for all websites
     */
    public function getAllUptimeStatus()
    {
        try {
            $websites = Website::all();
            
            $statuses = $websites->map(function($website) {
                $latestCheck = UptimeCheck::where('website_id', $website->id)
                    ->latest('checked_at')
                    ->first();

                return [
                    'website_id' => $website->id,
                    'url' => $website->url,
                    'status' => $latestCheck ? $latestCheck->status : 'unknown',
                    'http_code' => $latestCheck ? $latestCheck->http_code : null,
                    'response_time' => $latestCheck ? $latestCheck->response_time : null,
                    'last_checked' => $latestCheck ? $latestCheck->checked_at->format('Y-m-d H:i:s') : null,
                ];
            });

            return response()->json($statuses);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error getting uptime statuses: ' . $e->getMessage()
            ], 500);
        }
    }
}
