<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Website;
use App\Http\Controllers\GamblingDetectionController;
use Illuminate\Http\Request;

class ScanGamblingCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scan:gambling';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scan all websites for gambling keywords';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting gambling scan for all websites...');
        
        $websites = Website::all();
        $websiteIds = $websites->pluck('id')->toArray();
        
        if (empty($websiteIds)) {
            $this->info('No websites found to scan.');
            return;
        }

        $controller = new GamblingDetectionController();
        $request = new Request(['websiteIds' => $websiteIds]);
        
        $response = $controller->bulkScan($request);
        $data = json_decode($response->getContent(), true);
        
        $this->info("Scan completed. Success: {$data['success_count']}, Failed: {$data['fail_count']}");
    }
}
