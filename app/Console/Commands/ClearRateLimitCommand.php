<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class ClearRateLimitCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'auth:clear-rate-limit {ip?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear rate limiting for authentication attempts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $ip = $this->argument('ip');
        
        if ($ip) {
            // Clear rate limit for specific IP
            $key = 'login_attempts:' . $ip;
            Cache::forget($key);
            $this->info("Rate limit cleared for IP: {$ip}");
        } else {
            // Clear all rate limits (pattern matching)
            $this->info('Clearing all authentication rate limits...');
            
            // Get current IP from request if available
            $currentIp = request()->ip() ?? '127.0.0.1';
            $key = 'login_attempts:' . $currentIp;
            Cache::forget($key);
            
            // Also try to clear common IPs
            $commonIps = ['127.0.0.1', 'localhost', '::1'];
            foreach ($commonIps as $commonIp) {
                Cache::forget('login_attempts:' . $commonIp);
            }
            
            $this->info('Rate limits cleared for common IPs and current session.');
            $this->info('If you know the specific IP, use: php artisan auth:clear-rate-limit [IP]');
        }
        
        return 0;
    }
}
