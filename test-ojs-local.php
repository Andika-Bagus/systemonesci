<?php

/**
 * Quick test OJS Secure locally
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "\n=== OJS SECURE LOCAL TEST ===\n\n";

// Create a mock authenticated user for testing
$user = \App\Models\User::first();

if (!$user) {
    echo "✗ No user found in database. Please create a user first.\n";
    exit(1);
}

echo "Testing with user: {$user->name} (ID: {$user->id})\n\n";

// Test 1: Authentication
echo "1. Testing Authentication...\n";
$request = \Illuminate\Http\Request::create('/api/ojs-secure/authenticate', 'POST', [
    'username' => env('OJS_SECURE_USERNAME', 'ojs_admin'),
    'password' => env('OJS_SECURE_PASSWORD', 'OJS_Secure_2026!'),
]);

// Set authenticated user
$request->setUserResolver(function () use ($user) {
    return $user;
});

$controller = new \App\Http\Controllers\OjsSecureController();
$response = $controller->authenticate($request);
$data = json_decode($response->getContent(), true);

if ($response->getStatusCode() === 200) {
    echo "   ✓ Authentication SUCCESS\n";
    $token = $data['session_token'];
    echo "   Token: " . substr($token, 0, 30) . "...\n\n";
    
    // Test 2: Verify
    echo "2. Testing Verify...\n";
    $verifyRequest = \Illuminate\Http\Request::create('/api/ojs-secure/verify', 'POST', [
        'session_token' => $token,
    ]);
    $verifyRequest->headers->set('X-OJS-Session', $token);
    $verifyRequest->setUserResolver(function () use ($user) {
        return $user;
    });
    
    $verifyResponse = $controller->verify($verifyRequest);
    $verifyData = json_decode($verifyResponse->getContent(), true);
    
    if ($verifyResponse->getStatusCode() === 200 && ($verifyData['valid'] ?? false)) {
        echo "   ✓ Verify SUCCESS\n\n";
    } else {
        echo "   ✗ Verify FAILED\n";
        echo "   Response: " . $verifyResponse->getContent() . "\n\n";
    }
    
    // Test 3: Session in DB
    echo "3. Checking Session in Database...\n";
    $session = \App\Models\OjsSecureSession::where('session_token', $token)->first();
    if ($session) {
        echo "   ✓ Session found\n";
        echo "   User ID: {$session->user_id}\n";
        echo "   Expected User ID: {$user->id}\n";
        echo "   Match: " . ($session->user_id == $user->id ? 'YES ✓' : 'NO ✗') . "\n\n";
    } else {
        echo "   ✗ Session NOT found in database\n\n";
    }
    
    echo "✓ All tests passed!\n";
    
} else {
    echo "   ✗ Authentication FAILED\n";
    echo "   Response: " . $response->getContent() . "\n";
}

echo "\n";
