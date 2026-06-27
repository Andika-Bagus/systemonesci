<?php

namespace App\Jobs;

use App\Models\Website;
use App\Http\Controllers\PageSpeedController;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class CheckPageSpeedJob implements ShouldQueue
{
    use Queueable;

    public $timeout = 300;
    public $tries = 1;

    public function __construct(
        public int $websiteId
    ) {}

    public function handle(): void
    {
        $website = Website::find($this->websiteId);
        
        if (!$website) {
            \Log::warning("Website ID {$this->websiteId} not found for PageSpeed check");
            return;
        }

        try {
            $controller = new PageSpeedController();
            $controller->checkPageSpeed($this->websiteId);
            \Log::info("PageSpeed check completed for website {$this->websiteId}");
        } catch (\Exception $e) {
            \Log::error("PageSpeed job failed for website {$this->websiteId}: " . $e->getMessage());
            throw $e;
        }
    }
}
