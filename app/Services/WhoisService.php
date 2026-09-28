<?php

namespace App\Services;

use Iodev\Whois\Factory;
use Carbon\Carbon;
use Exception;

class WhoisService
{
    protected $whois;

    public function __construct()
    {
        $this->whois = Factory::get()->createWhois();
    }

    /**
     * Get domain information from WHOIS with retry
     */
    public function getDomainInfo(string $url): array
    {
        $maxRetries = 2;
        $retryDelay = 2; // seconds
        
        for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
            try {
                // Extract domain from URL
                $domain = $this->extractDomain($url);
                
                if (!$domain) {
                    throw new Exception('Invalid domain format');
                }

                // Query WHOIS with timeout
                $info = $this->whois->loadDomainInfo($domain);
                
                if (!$info) {
                    throw new Exception('No WHOIS data available for this domain');
                }

                // Get expiration date
                $expirationDate = $info->expirationDate;
                $creationDate = $info->creationDate;
                $registrar = $info->registrar;

                // Calculate days until expiry
                $daysUntilExpiry = null;
                $status = 'unknown';
                
                if ($expirationDate) {
                    $expiryCarbon = Carbon::createFromTimestamp($expirationDate);
                    $daysUntilExpiry = now()->diffInDays($expiryCarbon, false);
                    
                    // Determine status
                    if ($daysUntilExpiry < 0) {
                        $status = 'expired';
                    } elseif ($daysUntilExpiry <= 30) {
                        $status = 'expiring_soon';
                    } else {
                        $status = 'active';
                    }
                }

                return [
                    'success' => true,
                    'domain' => $domain,
                    'registered_at' => $creationDate ? Carbon::createFromTimestamp($creationDate)->format('Y-m-d') : null,
                    'expires_at' => $expirationDate ? Carbon::createFromTimestamp($expirationDate)->format('Y-m-d') : null,
                    'registrar' => $registrar,
                    'days_until_expiry' => $daysUntilExpiry ? (int) $daysUntilExpiry : null,
                    'status' => $status,
                    'checked_at' => now(),
                ];

            } catch (Exception $e) {
                $lastError = $e->getMessage();
                
                // If this is not the last attempt, wait and retry
                if ($attempt < $maxRetries) {
                    \Log::warning("WHOIS attempt {$attempt} failed for {$url}: {$lastError}. Retrying...");
                    sleep($retryDelay);
                    continue;
                }
                
                // Last attempt failed
                \Log::error("WHOIS check failed for {$url} after {$maxRetries} attempts: {$lastError}");
                
                return [
                    'success' => false,
                    'error' => $lastError,
                    'domain' => $domain ?? $url,
                ];
            }
        }
        
        // Fallback (should not reach here)
        return [
            'success' => false,
            'error' => 'WHOIS check failed after multiple attempts',
            'domain' => $url,
        ];
    }

    /**
     * Extract domain from URL
     */
    protected function extractDomain(string $url): ?string
    {
        // Remove protocol
        $url = preg_replace('#^https?://#', '', $url);
        
        // Remove www
        $url = preg_replace('#^www\.#', '', $url);
        
        // Remove path and query string
        $url = explode('/', $url)[0];
        $url = explode('?', $url)[0];
        
        // Get domain without subdomain (keep only domain.tld)
        $parts = explode('.', $url);
        
        if (count($parts) >= 2) {
            // Handle special TLDs like .co.id, .ac.id, etc
            if (count($parts) >= 3 && in_array($parts[count($parts) - 2], ['co', 'ac', 'or', 'go', 'net', 'web'])) {
                return implode('.', array_slice($parts, -3));
            }
            
            // Regular domain.tld
            return implode('.', array_slice($parts, -2));
        }
        
        return null;
    }

    /**
     * Check if domain is expiring soon (within 30 days)
     */
    public function isExpiringSoon(?int $daysUntilExpiry): bool
    {
        return $daysUntilExpiry !== null && $daysUntilExpiry >= 0 && $daysUntilExpiry <= 30;
    }

    /**
     * Check if domain is expired
     */
    public function isExpired(?int $daysUntilExpiry): bool
    {
        return $daysUntilExpiry !== null && $daysUntilExpiry < 0;
    }
}
