<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Testing Domain Filter Logic ===\n\n";

// Test URLs
$testUrls = [
    'https://example.com',
    'https://www.example.com',
    'https://ojs.example.com',
    'https://api.example.com',
    'https://example.co.id',
    'https://www.example.co.id',
    'https://ojs.example.co.id',
    'https://subdomain.example.co.id',
];

function isMainDomain($url) {
    $parsed = parse_url($url);
    $host = $parsed['host'] ?? '';
    
    // Remove www if present
    $host = preg_replace('/^www\./', '', $host);
    
    // Count dots
    $dotCount = substr_count($host, '.');
    
    // Check if it's .co.id domain
    if (preg_match('/\.co\.id$/', $host)) {
        return $dotCount === 2;
    }
    
    // For other domains
    return $dotCount === 1;
}

foreach ($testUrls as $url) {
    $isMain = isMainDomain($url) ? 'MAIN DOMAIN ✓' : 'subdomain ✗';
    echo sprintf("%-40s => %s\n", $url, $isMain);
}

echo "\n=== Real OJS Instances Sample ===\n";
$ojsInstances = App\Models\OjsInstance::limit(10)->get();
foreach ($ojsInstances as $ojs) {
    $isMain = isMainDomain($ojs->url) ? '✓ INCLUDED' : '✗ EXCLUDED';
    echo sprintf("%-50s => %s\n", $ojs->url, $isMain);
}

echo "\n=== Test Complete ===\n";
