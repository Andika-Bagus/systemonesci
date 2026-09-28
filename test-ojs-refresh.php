<?php

/**
 * Test OJS Secure - Simulate Page Refresh
 * Test apakah session persist setelah refresh
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "\n=== SIMULATE PAGE REFRESH TEST ===\n\n";

$user = \App\Models\User::first();

if (!$user) {
    echo "✗ No user found\n";
    exit(1);
}

$controller = new \App\Http\Controllers\OjsSecureController();

// Step 1: Login
echo "STEP 1: Login (First Visit)\n";
echo str_repeat("-", 50) . "\n";

$loginRequest = \Illuminate\Http\Request::create('/api/ojs-secure/authenticate', 'POST', [
    'username' => env('OJS_SECURE_USERNAME', 'ojs_admin'),
    'password' => env('OJS_SECURE_PASSWORD', 'OJS_Secure_2026!'),
]);
$loginRequest->setUserResolver(function () use ($user) {
    return $user;
});

$loginResponse = $controller->authenticate($loginRequest);
$loginData = json_decode($loginResponse->getContent(), true);

if ($loginResponse->getStatusCode() !== 200) {
    echo "✗ Login failed\n";
    echo $loginResponse->getContent() . "\n";
    exit(1);
}

$sessionToken = $loginData['session_token'];
echo "✓ Login success\n";
echo "Session Token: " . substr($sessionToken, 0, 30) . "...\n";
echo "User ID: {$user->id}\n\n";

// Step 2: Load data (first time)
echo "STEP 2: Load Data (First Time)\n";
echo str_repeat("-", 50) . "\n";

$loadRequest1 = \Illuminate\Http\Request::create('/api/ojs-secure/instances', 'GET');
$loadRequest1->headers->set('X-OJS-Session', $sessionToken);
$loadRequest1->setUserResolver(function () use ($user) {
    return $user;
});

$loadResponse1 = $controller->getInstances($loadRequest1);
$loadData1 = json_decode($loadResponse1->getContent(), true);

if ($loadResponse1->getStatusCode() === 200) {
    echo "✓ Data loaded successfully\n";
    echo "Total instances: " . ($loadData1['total'] ?? 0) . "\n";
    if (!empty($loadData1['instances'])) {
        $sample = $loadData1['instances'][0];
        echo "Sample: {$sample['name']}\n";
        echo "  Username: " . ($sample['ojs_username'] ?? '(empty)') . "\n";
        echo "  Password: " . ($sample['ojs_password'] ? '***' : '(empty)') . "\n";
    }
} else {
    echo "✗ Load data failed\n";
    echo $loadResponse1->getContent() . "\n";
}
echo "\n";

// Step 3: Simulate page refresh - verify session masih ada
echo "STEP 3: Page Refresh - Verify Session\n";
echo str_repeat("-", 50) . "\n";
echo "Simulating user refresh page (F5)...\n\n";

sleep(1); // Wait 1 second

// Check session in DB
$sessionInDb = \App\Models\OjsSecureSession::where('session_token', $sessionToken)->first();
if ($sessionInDb) {
    echo "✓ Session still in database\n";
    echo "  Session ID: {$sessionInDb->id}\n";
    echo "  User ID: {$sessionInDb->user_id}\n";
    echo "  Is Expired: " . ($sessionInDb->isExpired() ? 'YES' : 'NO') . "\n";
} else {
    echo "✗ Session NOT in database (BUG!)\n";
}
echo "\n";

// Verify via API (like frontend does on refresh)
$verifyRequest = \Illuminate\Http\Request::create('/api/ojs-secure/verify', 'POST', [
    'session_token' => $sessionToken,
]);
$verifyRequest->headers->set('X-OJS-Session', $sessionToken);
$verifyRequest->setUserResolver(function () use ($user) {
    return $user;
});

$verifyResponse = $controller->verify($verifyRequest);
$verifyData = json_decode($verifyResponse->getContent(), true);

if ($verifyResponse->getStatusCode() === 200 && ($verifyData['valid'] ?? false)) {
    echo "✓ Session verify SUCCESS\n";
    echo "  Session valid: " . ($verifyData['valid'] ? 'YES' : 'NO') . "\n";
} else {
    echo "✗ Session verify FAILED (BUG!)\n";
    echo "  Status: " . $verifyResponse->getStatusCode() . "\n";
    echo "  Response: " . $verifyResponse->getContent() . "\n";
}
echo "\n";

// Step 4: Load data again (after refresh)
echo "STEP 4: Load Data Again (After Refresh)\n";
echo str_repeat("-", 50) . "\n";

$loadRequest2 = \Illuminate\Http\Request::create('/api/ojs-secure/instances', 'GET');
$loadRequest2->headers->set('X-OJS-Session', $sessionToken);
$loadRequest2->setUserResolver(function () use ($user) {
    return $user;
});

$loadResponse2 = $controller->getInstances($loadRequest2);
$loadData2 = json_decode($loadResponse2->getContent(), true);

if ($loadResponse2->getStatusCode() === 200) {
    echo "✓ Data loaded successfully (after refresh)\n";
    echo "Total instances: " . ($loadData2['total'] ?? 0) . "\n";
    if (!empty($loadData2['instances'])) {
        $sample = $loadData2['instances'][0];
        echo "Sample: {$sample['name']}\n";
        echo "  Username: " . ($sample['ojs_username'] ?? '(empty)') . "\n";
        echo "  Password: " . ($sample['ojs_password'] ? '***' : '(empty)') . "\n";
    }
    echo "\n✓✓✓ DATA PERSIST AFTER REFRESH! ✓✓✓\n";
} else {
    echo "✗ Load data failed (after refresh)\n";
    echo "Status: " . $loadResponse2->getStatusCode() . "\n";
    echo "Response: " . $loadResponse2->getContent() . "\n";
    echo "\n✗✗✗ DATA LOST AFTER REFRESH! ✗✗✗\n";
}

echo "\n";
