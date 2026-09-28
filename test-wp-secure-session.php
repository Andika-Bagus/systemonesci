<?php

require_once 'bootstrap/app.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "WP Secure Session Debug:\n";

try {
    $sessions = App\Models\WpSecureSession::with('user')->get();
    echo "Total WP sessions: " . $sessions->count() . "\n";
    
    foreach($sessions as $session) {
        echo "Session ID: " . $session->id . "\n";
        echo "User: " . ($session->user ? $session->user->name : 'No user') . "\n";
        echo "Token: " . substr($session->session_token, 0, 10) . "...\n";
        echo "Expires: " . $session->expires_at . "\n";
        echo "Expired: " . ($session->isExpired() ? 'YES' : 'NO') . "\n";
        echo "User ID: " . $session->user_id . "\n";
        echo "IP: " . $session->ip_address . "\n";
        echo "Created: " . $session->created_at . "\n";
        echo "---\n";
    }
    
    echo "\nTesting WP session check:\n";
    $testToken = $sessions->first() ? $sessions->first()->session_token : 'no-token';
    echo "Test token: " . substr($testToken, 0, 10) . "...\n";
    
} catch(Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}