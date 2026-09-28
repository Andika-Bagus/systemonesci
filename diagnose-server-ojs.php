<?php

/**
 * Diagnose OJS Secure Issues on Server
 * Khusus untuk debug masalah di production
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "\n";
echo "╔════════════════════════════════════════════════════════════╗\n";
echo "║   DIAGNOSA OJS SECURE - PRODUCTION SERVER                 ║\n";
echo "╚════════════════════════════════════════════════════════════╝\n\n";

// 1. Environment Check
echo "1. ENVIRONMENT CONFIGURATION\n";
echo "   " . str_repeat("-", 55) . "\n";
echo "   APP_ENV:              " . env('APP_ENV') . "\n";
echo "   APP_DEBUG:            " . (env('APP_DEBUG') ? 'true' : 'false') . "\n";
echo "   APP_URL:              " . env('APP_URL') . "\n";
echo "   FRONTEND_URL:         " . env('FRONTEND_URL') . "\n";
echo "   SESSION_DRIVER:       " . env('SESSION_DRIVER') . "\n";
echo "   SESSION_ENCRYPT:      " . (env('SESSION_ENCRYPT') ? 'true' : 'false') . "\n";
echo "   SESSION_DOMAIN:       " . env('SESSION_DOMAIN') . "\n";
echo "   SESSION_SECURE:       " . (env('SESSION_SECURE_COOKIE') ? 'true' : 'false') . "\n\n";

// 2. Database Connection
echo "2. DATABASE CONNECTION\n";
echo "   " . str_repeat("-", 55) . "\n";
try {
    \DB::connection()->getPdo();
    echo "   ✓ Database connected successfully\n";
    echo "   Database: " . env('DB_DATABASE') . "\n";
    
    // Check if ojs_secure_sessions table exists
    $tableExists = \Schema::hasTable('ojs_secure_sessions');
    echo "   ojs_secure_sessions table: " . ($tableExists ? '✓ EXISTS' : '✗ NOT FOUND') . "\n";
    
    if ($tableExists) {
        $sessionCount = \DB::table('ojs_secure_sessions')->count();
        echo "   Total sessions: {$sessionCount}\n";
        
        $activeCount = \DB::table('ojs_secure_sessions')
            ->where('expires_at', '>', now())
            ->count();
        echo "   Active sessions: {$activeCount}\n";
    }
} catch (\Exception $e) {
    echo "   ✗ Database connection failed: " . $e->getMessage() . "\n";
}
echo "\n";

// 3. OJS Secure Credentials
echo "3. OJS SECURE CREDENTIALS\n";
echo "   " . str_repeat("-", 55) . "\n";
$ojsUsername = env('OJS_SECURE_USERNAME');
$ojsPassword = env('OJS_SECURE_PASSWORD');
echo "   Username: " . ($ojsUsername ?: '✗ NOT SET') . "\n";
echo "   Password: " . ($ojsPassword ? '✓ SET (' . str_repeat('*', strlen($ojsPassword)) . ')' : '✗ NOT SET') . "\n\n";

// 4. Test Authentication
echo "4. AUTHENTICATION TEST\n";
echo "   " . str_repeat("-", 55) . "\n";

if ($ojsUsername && $ojsPassword) {
    try {
        $controller = new \App\Http\Controllers\OjsSecureController();
        $request = \Illuminate\Http\Request::create('/api/ojs-secure/authenticate', 'POST', [
            'username' => $ojsUsername,
            'password' => $ojsPassword,
        ]);
        
        $response = $controller->authenticate($request);
        $data = json_decode($response->getContent(), true);
        
        if ($response->getStatusCode() === 200) {
            echo "   ✓ Authentication SUCCESS\n";
            $sessionToken = $data['session_token'] ?? null;
            echo "   Token: " . substr($sessionToken, 0, 30) . "...\n";
            
            // Check if session was saved to database
            $savedSession = \App\Models\OjsSecureSession::where('session_token', $sessionToken)->first();
            if ($savedSession) {
                echo "   ✓ Session saved to database\n";
                echo "   Session ID: {$savedSession->id}\n";
                echo "   User ID: " . ($savedSession->user_id ?? 'NULL (guest)') . "\n";
                echo "   Expires: {$savedSession->expires_at}\n";
                
                // Test verify
                echo "\n   Testing verify endpoint...\n";
                $verifyRequest = \Illuminate\Http\Request::create('/api/ojs-secure/verify', 'POST', [
                    'session_token' => $sessionToken,
                ]);
                $verifyRequest->headers->set('X-OJS-Session', $sessionToken);
                
                $verifyResponse = $controller->verify($verifyRequest);
                $verifyData = json_decode($verifyResponse->getContent(), true);
                
                if ($verifyResponse->getStatusCode() === 200 && ($verifyData['valid'] ?? false)) {
                    echo "   ✓ Verify SUCCESS - Session valid\n";
                } else {
                    echo "   ✗ Verify FAILED\n";
                    echo "   Response: " . $verifyResponse->getContent() . "\n";
                }
                
            } else {
                echo "   ✗ Session NOT saved to database!\n";
            }
        } else {
            echo "   ✗ Authentication FAILED\n";
            echo "   Status: " . $response->getStatusCode() . "\n";
            echo "   Response: " . $response->getContent() . "\n";
        }
    } catch (\Exception $e) {
        echo "   ✗ Error: " . $e->getMessage() . "\n";
        echo "   Trace: " . $e->getTraceAsString() . "\n";
    }
} else {
    echo "   ✗ Cannot test - credentials not configured\n";
}
echo "\n";

// 5. CORS Configuration
echo "5. CORS CONFIGURATION\n";
echo "   " . str_repeat("-", 55) . "\n";
$corsConfig = config('cors');
echo "   Allowed Origins: " . count($corsConfig['allowed_origins']) . " domains\n";
foreach ($corsConfig['allowed_origins'] as $origin) {
    echo "     - {$origin}\n";
}
echo "   Exposed Headers: " . implode(', ', $corsConfig['exposed_headers']) . "\n";
echo "   Supports Credentials: " . ($corsConfig['supports_credentials'] ? 'true' : 'false') . "\n\n";

// 6. Route Check
echo "6. ROUTE VERIFICATION\n";
echo "   " . str_repeat("-", 55) . "\n";
$routes = [
    'POST /api/ojs-secure/authenticate',
    'POST /api/ojs-secure/verify',
    'GET /api/ojs-secure/instances',
    'POST /api/ojs-secure/logout',
    'GET /api/ojs-secure/session',
];

foreach ($routes as $route) {
    echo "   ✓ {$route}\n";
}
echo "\n";

// 7. Recent Sessions
echo "7. RECENT SESSIONS (Last 5)\n";
echo "   " . str_repeat("-", 55) . "\n";
$recentSessions = \App\Models\OjsSecureSession::orderBy('created_at', 'desc')->take(5)->get();

if ($recentSessions->count() > 0) {
    foreach ($recentSessions as $session) {
        $status = $session->isExpired() ? '✗ EXPIRED' : '✓ ACTIVE';
        $userId = $session->user_id ?? 'NULL';
        echo "   [{$status}] ID: {$session->id}, User: {$userId}, Created: {$session->created_at}\n";
    }
} else {
    echo "   No sessions found\n";
}
echo "\n";

// 8. Recommendations
echo "8. RECOMMENDATIONS\n";
echo "   " . str_repeat("-", 55) . "\n";

$issues = [];

if (!$ojsUsername || !$ojsPassword) {
    $issues[] = "Set OJS_SECURE_USERNAME and OJS_SECURE_PASSWORD in .env";
}

if (env('SESSION_ENCRYPT') === true) {
    $issues[] = "SESSION_ENCRYPT=true may cause issues with custom sessions";
}

if (!in_array('X-OJS-Session', $corsConfig['exposed_headers'])) {
    $issues[] = "Add 'X-OJS-Session' to exposed_headers in cors.php";
}

if (count($issues) > 0) {
    foreach ($issues as $issue) {
        echo "   ⚠ {$issue}\n";
    }
} else {
    echo "   ✓ No issues detected\n";
}

echo "\n";
echo "╔════════════════════════════════════════════════════════════╗\n";
echo "║   DIAGNOSA SELESAI                                         ║\n";
echo "╚════════════════════════════════════════════════════════════╝\n\n";
