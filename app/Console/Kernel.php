<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        // Run PageSpeed check every hour
        $schedule->command('pagespeed:check-all')
            ->hourly()
            ->withoutOverlapping()
            ->onFailure(function () {
                \Log::error('PageSpeed scheduled check failed');
            })
            ->onSuccess(function () {
                \Log::info('PageSpeed scheduled check completed successfully');
            });

        // Run Uptime check every 5 minutes
        $schedule->command('uptime:check-all')
            ->everyFiveMinutes()
            ->withoutOverlapping()
            ->onFailure(function () {
                \Log::error('Uptime scheduled check failed');
            })
            ->onSuccess(function () {
                \Log::info('Uptime scheduled check completed successfully');
            });

        // Run Domain Expiry check every week (Sunday at 2 AM)
        $schedule->command('domain:check-all')
            ->weekly()
            ->sundays()
            ->at('02:00')
            ->withoutOverlapping()
            ->onFailure(function () {
                \Log::error('Domain expiry scheduled check failed');
            })
            ->onSuccess(function () {
                \Log::info('Domain expiry scheduled check completed successfully');
            });

        // Run Gambling Detection scan every hour
        // $schedule->command('scan:gambling')
        //     ->hourly()
        //     ->withoutOverlapping()
        //     ->onFailure(function () {
        //         \Log::error('Gambling detection scheduled scan failed');
        //     })
        //     ->onSuccess(function () {
        //         \Log::info('Gambling detection scheduled scan completed successfully');
        //     });
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
