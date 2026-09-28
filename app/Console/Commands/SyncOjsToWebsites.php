<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\OjsInstance;
use App\Models\Website;

class SyncOjsToWebsites extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:ojs-to-websites';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync all OJS instances to the websites table for Uptime Monitoring';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting sync of OJS instances to Websites table...');
        
        $ojsInstances = OjsInstance::all();
        $count = 0;

        foreach ($ojsInstances as $ojs) {
            Website::updateOrCreate(
                ['url' => $ojs->url],
                [
                    'jenis_website' => 'OJS',
                    'holding' => $ojs->holding ?? 'Unknown',
                    'letak_server' => $ojs->letak_server,
                    'cdn_provider' => $ojs->letak_cdn,
                    'domain_registered_at' => $ojs->domain_registered_at,
                    'domain_expires_at' => $ojs->domain_expires_at,
                    'domain_registrar' => $ojs->domain_registrar,
                    'domain_last_checked' => $ojs->domain_last_checked,
                    'domain_status' => $ojs->domain_status,
                    'days_until_expiry' => $ojs->days_until_expiry,
                ]
            );
            $count++;
        }

        $this->info("Successfully synced {$count} OJS instances to the Websites table.");
    }
}
