<?php

namespace App\Console\Commands;

use App\Models\Website;
use App\Http\Controllers\UptimeController;
use Illuminate\Console\Command;

class CheckAllUptimeCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'uptime:check-all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check uptime for all websites';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting uptime check for all websites...');
        
        $websites = Website::all();
        $totalWebsites = $websites->count();
        
        if ($totalWebsites === 0) {
            $this->warn('No websites found to check.');
            return 0;
        }

        $this->info("Found {$totalWebsites} websites to check.");
        
        $bar = $this->output->createProgressBar($totalWebsites);
        $bar->start();

        $uptimeController = new UptimeController();
        $successCount = 0;
        $failCount = 0;

        foreach ($websites as $website) {
            try {
                // Call the checkUptime method
                $uptimeController->checkUptime($website->id);
                $successCount++;
            } catch (\Exception $e) {
                $this->error("\nError checking {$website->url}: " . $e->getMessage());
                $failCount++;
            }
            
            $bar->advance();
            
            // Small delay to avoid overwhelming the server
            usleep(100000); // 0.1 second delay
        }

        $bar->finish();
        $this->newLine(2);
        
        $this->info("Uptime check completed!");
        $this->info("✓ Success: {$successCount}");
        
        if ($failCount > 0) {
            $this->warn("✗ Failed: {$failCount}");
        }

        return 0;
    }
}
