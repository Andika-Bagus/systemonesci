<?php

/**
 * Simple test - hit authenticate endpoint directly
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "\n=== SIMPLE AUTH TEST ===\n\n";

// Get user
$user = \App\Models\User::find(27);
if (!$user) {
    $user = \App\Models\User::first();
}

echo "User: {$user->name} (ID: {$user->id})\n";

// Create token
$token = $user->createToken('simple-test')->plainTextToken;
echo "Token created\n\n";

// Test different URLs
$urls = [
    'http://localhost/api/ojs-secure/authenticate',
    'http://127.0.0.1/api/ojs-secure/authenticate',
    'https://api.itmsci.com/api/ojs-secure/authenticate',
];

foreach ($urls as $url) {
    echo "Testing URL: {$url}\n";
    echo str_repeat("-", 60) . "\n";
    
    try {
        $response = \Illuminate\Support\Facades\Http::withToken($token)
            ->timeout(10)
            ->post($url, [
                'username' => 'ojs_admin',
                'password' => 'OJS_Secure_2026!',
            ]);
        
        echo "Status: " . $response->status() . "\n";
        
        if ($response->successful()) {
            echo "✓ SUCCESS\n";
            $data = $response->json();
            echo "Session Token: " . substr($data['session_token'] ?? 'N/A', 0, 30) . "...\n";
        } else {
            echo "✗ FAILED\n";
            $body = $response->body();
            // Only show first 200 chars
            echo "Response: " . substr($body, 0, 200) . "...\n";
        }
        
    } catch (\Exception $e) {
        echo "✗ EXCEPTION: " . $e->getMessage() . "\n";
    }
    
    echo "\n";
}

// Cleanup
$user->tokens()->delete();

echo "Done.\n\n";
