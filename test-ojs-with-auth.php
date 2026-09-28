<?php

/**
 * Test OJS Secure with Laravel Auth (Sanctum)
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "\n=== TEST OJS SECURE WITH AUTH ===\n\n";

// Get a user to test with
$user = \App\Models\User::find(27); // User ID from diagnostic

if (!$user) {
    echo "✗ User ID 27 not found\n";
    $user = \App\Models\User::first();
    if (!$user) {
        echo "✗ No users in database\n";
        exit(1);
    }
}

echo "Testing with user: {$user->name} (ID: {$user->id})\n\n";

// Create Sanctum token for this user
$token = $user->createToken('test-ojs-secure')->plainTextToken;
echo "Sanctum Token: " . substr($token, 0, 40) . "...\n\n";

// Test 1: Authenticate to OJS Secure
echo "1. Testing OJS Secure Authentication\n";
echo str_repeat("-", 50) . "\n";

$authResponse = \Illuminate\Support\Facades\Http::withToken($token)
    ->post(env('APP_URL') . '/api/ojs-secure/authenticate', [
        'username' => env('OJS_SECURE_USERNAME', 'ojs_admin'),
        'password' => env('OJS_SECURE_PASSWORD', 'OJS_Secure_2026!'),
    ]);

if ($authResponse->successful()) {
    $authData = $authResponse->json();
    $ojsToken = $authData['session_token'];
    
    echo "✓ OJS Authentication SUCCESS\n";
    echo "OJS Session Token: " . substr($ojsToken, 0, 30) . "...\n";
    echo "Expires at: {$authData['expires_at']}\n\n";
    
    // Test 2: Verify session
    echo "2. Testing Session Verification\n";
    echo str_repeat("-", 50) . "\n";
    
    $verifyResponse = \Illuminate\Support\Facades\Http::withToken($token)
        ->withHeaders(['X-OJS-Session' => $ojsToken])
        ->post(env('APP_URL') . '/api/ojs-secure/verify', [
            'session_token' => $ojsToken,
        ]);
    
    if ($verifyResponse->successful()) {
        $verifyData = $verifyResponse->json();
        echo "✓ Session Verification SUCCESS\n";
        echo "Valid: " . ($verifyData['valid'] ? 'YES' : 'NO') . "\n\n";
    } else {
        echo "✗ Session Verification FAILED\n";
        echo "Response: " . $verifyResponse->body() . "\n\n";
    }
    
    // Test 3: Get instances
    echo "3. Testing Get OJS Instances\n";
    echo str_repeat("-", 50) . "\n";
    
    $instancesResponse = \Illuminate\Support\Facades\Http::withToken($token)
        ->withHeaders(['X-OJS-Session' => $ojsToken])
        ->get(env('APP_URL') . '/api/ojs-secure/instances');
    
    if ($instancesResponse->successful()) {
        $instancesData = $instancesResponse->json();
        echo "✓ Get Instances SUCCESS\n";
        echo "Total: " . ($instancesData['total'] ?? 0) . " instances\n";
        
        if (!empty($instancesData['instances'])) {
            $sample = $instancesData['instances'][0];
            echo "Sample:\n";
            echo "  Name: {$sample['name']}\n";
            echo "  URL: {$sample['url']}\n";
            echo "  Username: " . ($sample['ojs_username'] ?? '(empty)') . "\n";
        }
        echo "\n";
    } else {
        echo "✗ Get Instances FAILED\n";
        echo "Response: " . $instancesResponse->body() . "\n\n";
    }
    
    // Test 4: Simulate refresh - verify again
    echo "4. Simulating Page Refresh\n";
    echo str_repeat("-", 50) . "\n";
    echo "Waiting 2 seconds...\n";
    sleep(2);
    
    $verifyResponse2 = \Illuminate\Support\Facades\Http::withToken($token)
        ->withHeaders(['X-OJS-Session' => $ojsToken])
        ->post(env('APP_URL') . '/api/ojs-secure/verify', [
            'session_token' => $ojsToken,
        ]);
    
    if ($verifyResponse2->successful()) {
        $verifyData2 = $verifyResponse2->json();
        echo "✓ Session STILL VALID after refresh\n";
        echo "Valid: " . ($verifyData2['valid'] ? 'YES' : 'NO') . "\n\n";
        
        echo "✓✓✓ OJS SECURE WORKS PERFECTLY! ✓✓✓\n";
    } else {
        echo "✗ Session LOST after refresh\n";
        echo "Response: " . $verifyResponse2->body() . "\n\n";
        
        echo "✗✗✗ SESSION PERSISTENCE ISSUE ✗✗✗\n";
    }
    
    // Cleanup
    $user->tokens()->delete();
    
} else {
    echo "✗ OJS Authentication FAILED\n";
    echo "Status: " . $authResponse->status() . "\n";
    echo "Response: " . $authResponse->body() . "\n\n";
}

echo "\n";
