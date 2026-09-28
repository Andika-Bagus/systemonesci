<?php

/**
 * Test OJS Secure Session API
 * 
 * Usage:
 * 1. Upload file ini ke server
 * 2. Jalankan: php test-ojs-secure.php
 */

require __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Artisan;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== OJS SECURE SESSION TEST ===\n\n";

// Test 1: Authentication
echo "1. Testing Authentication...\n";
$username = env('OJS_SECURE_USERNAME', 'ojs_admin');
$password = env('OJS_SECURE_PASSWORD', 'OJS_Secure_2026!');

echo "   Credentials: {$username} / {$password}\n";

$authResponse = \Illuminate\Support\Facades\Http::post(env('APP_URL') . '/api/ojs-secure/authenticate', [
    'username' => $username,
    'password' => $password,
]);

if ($authResponse->successful()) {
    $authData = $authResponse->json();
    $sessionToken = $authData['session_token'] ?? null;
    
    echo "   ✓ Authentication successful!\n";
    echo "   Session Token: " . substr($sessionToken, 0, 20) . "...\n";
    echo "   Expires at: " . ($authData['expires_at'] ?? 'N/A') . "\n\n";
    
    // Test 2: Verify Session
    echo "2. Testing Session Verification...\n";
    $verifyResponse = \Illuminate\Support\Facades\Http::withHeaders([
        'X-OJS-Session' => $sessionToken,
    ])->post(env('APP_URL') . '/api/ojs-secure/verify', [
        'session_token' => $sessionToken,
    ]);
    
    if ($verifyResponse->successful()) {
        $verifyData = $verifyResponse->json();
        echo "   ✓ Session verification successful!\n";
        echo "   Valid: " . ($verifyData['valid'] ? 'YES' : 'NO') . "\n";
        echo "   Message: " . ($verifyData['message'] ?? 'N/A') . "\n\n";
    } else {
        echo "   ✗ Session verification failed!\n";
        echo "   Status: " . $verifyResponse->status() . "\n";
        echo "   Response: " . $verifyResponse->body() . "\n\n";
    }
    
    // Test 3: Get OJS Instances
    echo "3. Testing Get OJS Instances...\n";
    $instancesResponse = \Illuminate\Support\Facades\Http::withHeaders([
        'X-OJS-Session' => $sessionToken,
    ])->get(env('APP_URL') . '/api/ojs-secure/instances');
    
    if ($instancesResponse->successful()) {
        $instancesData = $instancesResponse->json();
        $total = $instancesData['total'] ?? 0;
        echo "   ✓ Get instances successful!\n";
        echo "   Total instances: {$total}\n";
        
        if (!empty($instancesData['instances'])) {
            echo "   Sample instance:\n";
            $sample = $instancesData['instances'][0];
            echo "     - Name: " . ($sample['name'] ?? 'N/A') . "\n";
            echo "     - URL: " . ($sample['url'] ?? 'N/A') . "\n";
            echo "     - Version: " . ($sample['version'] ?? 'N/A') . "\n";
            echo "     - Username: " . ($sample['ojs_username'] ?? '(empty)') . "\n";
            echo "     - Password: " . ($sample['ojs_password'] ? '***' : '(empty)') . "\n";
        }
        echo "\n";
    } else {
        echo "   ✗ Get instances failed!\n";
        echo "   Status: " . $instancesResponse->status() . "\n";
        echo "   Response: " . $instancesResponse->body() . "\n\n";
    }
    
    // Test 4: Check Session in Database
    echo "4. Checking Session in Database...\n";
    $session = \App\Models\OjsSecureSession::where('session_token', $sessionToken)->first();
    
    if ($session) {
        echo "   ✓ Session found in database!\n";
        echo "   ID: {$session->id}\n";
        echo "   User ID: " . ($session->user_id ?? 'NULL (guest)') . "\n";
        echo "   IP: {$session->ip_address}\n";
        echo "   Expires at: {$session->expires_at}\n";
        echo "   Is Expired: " . ($session->isExpired() ? 'YES' : 'NO') . "\n\n";
    } else {
        echo "   ✗ Session NOT found in database!\n\n";
    }
    
    // Test 5: Simulate Page Refresh (verify again)
    echo "5. Simulating Page Refresh (verify session again)...\n";
    sleep(2); // Wait 2 seconds
    
    $verifyResponse2 = \Illuminate\Support\Facades\Http::withHeaders([
        'X-OJS-Session' => $sessionToken,
    ])->post(env('APP_URL') . '/api/ojs-secure/verify', [
        'session_token' => $sessionToken,
    ]);
    
    if ($verifyResponse2->successful()) {
        $verifyData2 = $verifyResponse2->json();
        echo "   ✓ Session still valid after refresh!\n";
        echo "   Valid: " . ($verifyData2['valid'] ? 'YES' : 'NO') . "\n\n";
    } else {
        echo "   ✗ Session lost after refresh!\n";
        echo "   Status: " . $verifyResponse2->status() . "\n";
        echo "   Response: " . $verifyResponse2->body() . "\n\n";
    }
    
    // Test 6: Logout
    echo "6. Testing Logout...\n";
    $logoutResponse = \Illuminate\Support\Facades\Http::withHeaders([
        'X-OJS-Session' => $sessionToken,
    ])->post(env('APP_URL') . '/api/ojs-secure/logout', [
        'session_token' => $sessionToken,
    ]);
    
    if ($logoutResponse->successful()) {
        echo "   ✓ Logout successful!\n\n";
    } else {
        echo "   ✗ Logout failed!\n";
        echo "   Status: " . $logoutResponse->status() . "\n\n";
    }
    
    // Test 7: Verify after logout
    echo "7. Verifying session after logout...\n";
    $verifyResponse3 = \Illuminate\Support\Facades\Http::withHeaders([
        'X-OJS-Session' => $sessionToken,
    ])->post(env('APP_URL') . '/api/ojs-secure/verify', [
        'session_token' => $sessionToken,
    ]);
    
    if ($verifyResponse3->successful()) {
        $verifyData3 = $verifyResponse3->json();
        echo "   Valid: " . ($verifyData3['valid'] ? 'YES (BUG!)' : 'NO (correct)') . "\n\n";
    } else {
        echo "   Session invalid (correct)\n\n";
    }
    
} else {
    echo "   ✗ Authentication failed!\n";
    echo "   Status: " . $authResponse->status() . "\n";
    echo "   Response: " . $authResponse->body() . "\n\n";
}

echo "=== TEST COMPLETED ===\n";
