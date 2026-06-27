<?php

namespace App\Console\Commands;

use App\Jobs\CheckPageSpeedJob;
use App\Models\Website;
use Illuminate\Console\Command;

class CheckPageSpeedsCommand extends Command
{
    protected $signature = 'pagespeed:check-all';
    protected $description = 'Check PageSpeed for all websites';

    public function handle(): int
    {
        $websites = Website::all();
        
        $this->info("Dispatching PageSpeed checks for {$websites->count()} websites...");

        foreach ($websites as $website) {
            CheckPageSpeedJob::dispatch($website->id);
            $this->line("Queued check for website ID {$website->id}: {$website->url}");
        }

        $this->info('All PageSpeed checks queued successfully!');
        return 0;
    }
}
