<?php

/**
 * Check OJS Secure Session - Simple Version
 * 
 * Usage: php check-ojs-session.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "\n=== CHECKING OJS SECURE SESSIONS ===\n\n";

// Check all active sessions
$sessions = \App\Models\OjsSecureSession::orderBy('created_at', 'desc')->get();

echo "Total sessions in database: " . $sessions->count() . "\n\n";

if ($sessions->count() > 0) {
    echo "Active Sessions:\n";
    echo str_repeat("-", 80) . "\n";
    printf("%-5s %-10s %-20s %-20s %-10s\n", "ID", "User ID", "IP Address", "Expires At", "Status");
    echo str_repeat("-", 80) . "\n";
    
    foreach ($sessions as $session) {
        $status = $session->isExpired() ? "EXPIRED" : "ACTIVE";
        $userId = $session->user_id ?? 'NULL';
        
        printf(
            "%-5s %-10s %-20s %-20s %-10s\n",
            $session->id,
            $userId,
            $session->ip_address,
            $session->expires_at->format('Y-m-d H:i:s'),
            $status
        );
    }
    echo str_repeat("-", 80) . "\n\n";
    
    // Count active vs expired
    $active = $sessions->filter(fn($s) => !$s->isExpired())->count();
    $expired = $sessions->filter(fn($s) => $s->isExpired())->count();
    
    echo "Summary:\n";
    echo "  Active: {$active}\n";
    echo "  Expired: {$expired}\n\n";
    
    // Show last session details
    $lastSession = $sessions->first();
    echo "Last Session Details:\n";
    echo "  Token: " . substr($lastSession->session_token, 0, 30) . "...\n";
    echo "  User ID: " . ($lastSession->user_id ?? 'NULL (guest session)') . "\n";
    echo "  User Agent: " . $lastSession->user_agent . "\n";
    echo "  Created: " . $lastSession->created_at->format('Y-m-d H:i:s') . "\n";
    echo "  Expires: " . $lastSession->expires_at->format('Y-m-d H:i:s') . "\n";
    echo "  Status: " . ($lastSession->isExpired() ? 'EXPIRED' : 'ACTIVE') . "\n";
    
    if ($lastSession->user_id) {
        $user = \App\Models\User::find($lastSession->user_id);
        if ($user) {
            echo "  User Name: {$user->name}\n";
            echo "  User Email: {$user->email}\n";
        }
    }
    
} else {
    echo "No sessions found in database.\n";
}

echo "\n";

// Check OJS instances count
$ojsCount = \App\Models\OjsInstance::count();
echo "Total OJS Instances: {$ojsCount}\n";

// Check environment variables
echo "\nEnvironment Check:\n";
echo "  OJS_SECURE_USERNAME: " . (env('OJS_SECURE_USERNAME') ?: 'NOT SET') . "\n";
echo "  OJS_SECURE_PASSWORD: " . (env('OJS_SECURE_PASSWORD') ? '***SET***' : 'NOT SET') . "\n";

echo "\n=== CHECK COMPLETED ===\n\n";
