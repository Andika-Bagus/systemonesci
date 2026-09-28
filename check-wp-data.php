<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Website;

echo "=== WP Secure Data Check ===\n\n";

$totalWebsites = Website::count();
$wpWebsites = Website::where('jenis_website', 'WordPress')->count();

echo "Total websites in database: {$totalWebsites}\n";
echo "WordPress websites: {$wpWebsites}\n\n";

if ($wpWebsites > 0) {
    echo "WordPress websites list:\n";
    echo str_repeat("-", 80) . "\n";
    
    Website::where('jenis_website', 'WordPress')
        ->orderBy('holding')
        ->get(['id', 'holding', 'url', 'wp_username', 'wp_password'])
        ->each(function($website) {
            $hasUsername = $website->wp_username ? '✓' : '✗';
            $hasPassword = $website->wp_password ? '✓' : '✗';
            echo sprintf(
                "ID: %3d | %-30s | User: %s | Pass: %s\n",
                $website->id,
                $website->holding,
                $hasUsername,
                $hasPassword
            );
        });
} else {
    echo "❌ No WordPress websites found!\n\n";
    echo "Sample data from websites table:\n";
    echo str_repeat("-", 80) . "\n";
    
    Website::limit(5)->get(['id', 'holding', 'jenis_website'])->each(function($website) {
        echo "ID: {$website->id} | {$website->holding} | Type: {$website->jenis_website}\n";
    });
}

echo "\n";
