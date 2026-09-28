<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Testing Domain API ===" . PHP_EOL . PHP_EOL;

// Test 1: Get all domains
echo "1. Testing /api/domains endpoint:" . PHP_EOL;
$controller = new \App\Http\Controllers\DomainController(new \App\Services\WhoisService());
$response = $controller->getAllDomains();
$data = json_decode($response->getContent(), true);

echo "Total domains returned: " . count($data) . PHP_EOL;
echo "First 3 domains:" . PHP_EOL;
foreach (array_slice($data, 0, 3) as $domain) {
    echo "  - ID: {$domain['id']}, URL: {$domain['url']}, Registrar: " . ($domain['domain_registrar'] ?? 'null') . ", Status: {$domain['domain_status']}" . PHP_EOL;
}

echo PHP_EOL;

// Test 2: Check a specific domain
echo "2. Testing domain check for ID 20:" . PHP_EOL;
$website = \App\Models\Website::find(20);
if ($website) {
    echo "Before check:" . PHP_EOL;
    echo "  URL: {$website->url}" . PHP_EOL;
    echo "  Registrar: " . ($website->domain_registrar ?? 'null') . PHP_EOL;
    echo "  Status: {$website->domain_status}" . PHP_EOL;
    
    // Perform check
    echo PHP_EOL . "Performing WHOIS check..." . PHP_EOL;
    $checkResponse = $controller->checkDomain(20);
    $checkData = json_decode($checkResponse->getContent(), true);
    
    if (isset($checkData['data'])) {
        echo "After check:" . PHP_EOL;
        echo "  Registrar: " . ($checkData['data']['domain_registrar'] ?? 'null') . PHP_EOL;
        echo "  Expires: " . ($checkData['data']['domain_expires_at'] ?? 'null') . PHP_EOL;
        echo "  Status: " . ($checkData['data']['domain_status'] ?? 'null') . PHP_EOL;
    } else {
        echo "Check failed: " . ($checkData['error'] ?? 'Unknown error') . PHP_EOL;
    }
    
    echo PHP_EOL;
    
    // Test 3: Get domains again to see if it's updated
    echo "3. Re-fetching all domains to verify update:" . PHP_EOL;
    $response2 = $controller->getAllDomains();
    $data2 = json_decode($response2->getContent(), true);
    $domain20 = collect($data2)->firstWhere('id', 20);
    
    if ($domain20) {
        echo "Domain ID 20 in list:" . PHP_EOL;
        echo "  Registrar: " . ($domain20['domain_registrar'] ?? 'null') . PHP_EOL;
        echo "  Status: {$domain20['domain_status']}" . PHP_EOL;
    }
} else {
    echo "Website ID 20 not found" . PHP_EOL;
}
