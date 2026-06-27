<?php

namespace App\Http\Controllers;

use App\Models\Website;
use App\Services\WhoisService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DomainController extends Controller
{
    protected $whoisService;

    public function __construct(WhoisService $whoisService)
    {
        $this->whoisService = $whoisService;
    }

    /**
     * Check domain expiry for a specific website
     */
    public function checkDomain($websiteId)
    {
        try {
            $website = Website::findOrFail($websiteId);
            
            // Get WHOIS info
            $domainInfo = $this->whoisService->getDomainInfo($website->url);
            
            if (!$domainInfo['success']) {
                return response()->json([
                    'error' => 'Failed to fetch WHOIS data: ' . $domainInfo['error']
                ], 400);
            }

            // Update website with domain info
            $website->update([
                'domain_registered_at' => $domainInfo['registered_at'],
                'domain_expires_at' => $domainInfo['expires_at'],
                'domain_registrar' => $domainInfo['registrar'],
                'domain_last_checked' => $domainInfo['checked_at'],
                'domain_status' => $domainInfo['status'],
                'days_until_expiry' => $domainInfo['days_until_expiry'],
            ]);

            return response()->json([
                'message' => 'Domain info updated successfully',
                'data' => $website->fresh(),
            ]);

        } catch (\Exception $e) {
            Log::error('Domain check error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to check domain: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all domains with expiry info
     */
    public function getAllDomains()
    {
        try {
            $websites = Website::select([
                'id',
                'url',
                'holding',
                'jenis_website',
                'domain_registered_at',
                'domain_expires_at',
                'domain_registrar',
                'domain_last_checked',
                'domain_status',
                'days_until_expiry'
            ])->get();

            return response()->json($websites);

        } catch (\Exception $e) {
            Log::error('Get domains error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch domains'
            ], 500);
        }
    }

    /**
     * Get domains expiring soon (within 30 days)
     */
    public function getExpiringSoon()
    {
        try {
            $websites = Website::where('domain_status', 'expiring_soon')
                ->orWhere('domain_status', 'expired')
                ->orderBy('days_until_expiry', 'asc')
                ->get();

            return response()->json([
                'count' => $websites->count(),
                'data' => $websites,
            ]);

        } catch (\Exception $e) {
            Log::error('Get expiring domains error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch expiring domains'
            ], 500);
        }
    }

    /**
     * Get domain statistics
     */
    public function getStats()
    {
        try {
            $total = Website::count();
            $active = Website::where('domain_status', 'active')->count();
            $expiringSoon = Website::where('domain_status', 'expiring_soon')->count();
            $expired = Website::where('domain_status', 'expired')->count();
            $unknown = Website::where('domain_status', 'unknown')->count();

            return response()->json([
                'total' => $total,
                'active' => $active,
                'expiring_soon' => $expiringSoon,
                'expired' => $expired,
                'unknown' => $unknown,
            ]);

        } catch (\Exception $e) {
            Log::error('Get domain stats error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch domain stats'
            ], 500);
        }
    }
}
