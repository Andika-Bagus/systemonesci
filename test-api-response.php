<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Website;
use App\Models\OjsInstance;

echo "=== Simulating API Response ===\n\n";

// Simulate what DomainController::getAllDomains() returns
$websites = Website::select([
    'id',
    'url',
    'holding',
    'jenis_website as type',
    'domain_registered_at',
    'domain_expires_at',
    'domain_registrar',
    'domain_last_checked',
    'domain_status',
    'days_until_expiry'
])->get()->map(function($item) {
    $item->source = 'website';
    return $item;
});

echo "Websites fetched: " . $websites->count() . "\n";
if ($websites->count() > 0) {
    echo "Sample website:\n";
    echo "  - URL: " . $websites->first()->url . "\n";
    echo "  - Holding: " . $websites->first()->holding . "\n";
    echo "  - Status: " . ($websites->first()->domain_status ?? 'unknown') . "\n";
}

// Get OJS instances
function isMainDomain($url) {
    $parsed = parse_url($url);
    $host = $parsed['host'] ?? '';
    $host = preg_replace('/^www\./', '', $host);
    $dotCount = substr_count($host, '.');
    if (preg_match('/\.co\.id$/', $host)) {
        return $dotCount === 2;
    }
    return $dotCount === 1;
}

$ojsInstances = OjsInstance::select([
    'id',
    'url',
    'holding',
    'versi_ojs as type',
    'domain_registered_at',
    'domain_expires_at',
    'domain_registrar',
    'domain_last_checked',
    'domain_status',
    'days_until_expiry'
])->get()->filter(function($item) {
    return isMainDomain($item->url);
})->map(function($item) {
    $item->source = 'ojs_instance';
    $item->type = 'OJS ' . $item->type;
    return $item;
})->values();

echo "\nOJS instances fetched (main domains only): " . $ojsInstances->count() . "\n";
if ($ojsInstances->count() > 0) {
    echo "Sample OJS:\n";
    echo "  - URL: " . $ojsInstances->first()->url . "\n";
    echo "  - Holding: " . $ojsInstances->first()->holding . "\n";
    echo "  - Status: " . ($ojsInstances->first()->domain_status ?? 'unknown') . "\n";
}

// Combine
$allDomains = $websites->concat($ojsInstances);

echo "\nTotal domains to return: " . $allDomains->count() . "\n";
echo "\n=== API would return " . $allDomains->count() . " items ===\n";
