<?php

namespace App\Console\Commands;

use App\Models\Website;
use App\Services\WhoisService;
use Illuminate\Console\Command;

class CheckAllDomainsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'domain:check-all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check domain expiry for all websites';

    protected $whoisService;

    public function __construct(WhoisService $whoisService)
    {
        parent::__construct();
        $this->whoisService = $whoisService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting domain expiry check for all websites...');
        
        $websites = Website::all();
        $totalWebsites = $websites->count();
        
        if ($totalWebsites === 0) {
            $this->warn('No websites found to check.');
            return 0;
        }

        $this->info("Found {$totalWebsites} websites to check.");
        
        $bar = $this->output->createProgressBar($totalWebsites);
        $bar->start();

        $successCount = 0;
        $failCount = 0;

        foreach ($websites as $website) {
            try {
                // Get WHOIS info
                $domainInfo = $this->whoisService->getDomainInfo($website->url);
                
                if ($domainInfo['success']) {
                    // Update website with domain info
                    $website->update([
                        'domain_registered_at' => $domainInfo['registered_at'],
                        'domain_expires_at' => $domainInfo['expires_at'],
                        'domain_registrar' => $domainInfo['registrar'],
                        'domain_last_checked' => $domainInfo['checked_at'],
                        'domain_status' => $domainInfo['status'],
                        'days_until_expiry' => $domainInfo['days_until_expiry'],
                    ]);
                    
                    $successCount++;
                } else {
                    $this->error("\nFailed to check {$website->url}: " . $domainInfo['error']);
                    $failCount++;
                }
            } catch (\Exception $e) {
                $this->error("\nError checking {$website->url}: " . $e->getMessage());
                $failCount++;
            }
            
            $bar->advance();
            
            // Delay to avoid rate limiting (WHOIS servers can be strict)
            sleep(2); // 2 second delay between checks
        }

        $bar->finish();
        $this->newLine(2);
        
        $this->info("Domain expiry check completed!");
        $this->info("✓ Success: {$successCount}");
        
        if ($failCount > 0) {
            $this->warn("✗ Failed: {$failCount}");
        }

        // Show expiring domains
        $expiringSoon = Website::where('domain_status', 'expiring_soon')->count();
        $expired = Website::where('domain_status', 'expired')->count();
        
        if ($expiringSoon > 0) {
            $this->warn("⚠ Domains expiring soon: {$expiringSoon}");
        }
        
        if ($expired > 0) {
            $this->error("⚠ Expired domains: {$expired}");
        }

        return 0;
    }
}
