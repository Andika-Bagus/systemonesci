<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Test 1: Check WordPress websites count
echo "=== Test 1: WordPress Websites Count ===\n";
$wpCount = App\Models\Website::where('jenis_website', 'WordPress')->count();
echo "Total WordPress websites: $wpCount\n\n";

// Test 2: Check WP credentials from env
echo "=== Test 2: Check WP Credentials ===\n";
echo "WP_SECURE_USERNAME: " . env('WP_SECURE_USERNAME', 'NOT SET') . "\n";
echo "WP_SECURE_PASSWORD: " . env('WP_SECURE_PASSWORD', 'NOT SET') . "\n\n";

// Test 3: Check first user
echo "=== Test 3: Check First User ===\n";
$user = App\Models\User::first();
if ($user) {
    echo "User ID: {$user->id}\n";
    echo "User Name: {$user->name}\n";
    echo "User Email: {$user->email}\n";
} else {
    echo "No users found!\n";
}
echo "\n";

// Test 4: Sample WordPress websites
echo "=== Test 4: Sample WordPress Websites (first 3) ===\n";
$samples = App\Models\Website::where('jenis_website', 'WordPress')->limit(3)->get();
foreach ($samples as $site) {
    echo "- {$site->holding} ({$site->url})\n";
    echo "  wp_username: " . ($site->wp_username ?: 'NULL') . "\n";
    echo "  wp_password: " . ($site->wp_password ?: 'NULL') . "\n";
}

echo "\n=== All Tests Complete ===\n";
