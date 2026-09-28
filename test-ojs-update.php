<?php
/**
 * Test OJS Instance Update Endpoint
 * 
 * Purpose: Test if updating OJS credentials works with Laravel Sanctum auth
 * 
 * Usage: php test-ojs-update.php
 */

require __DIR__ . '/vendor/autoload.php';

// Load environment
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

use Illuminate\Support\Facades\Artisan;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "\n🔧 Testing OJS Instance Update Endpoint\n";
echo str_repeat("=", 60) . "\n\n";

try {
    // 1. Login as a user first
    echo "1️⃣  Logging in to get Sanctum token...\n";
    
    $user = App\Models\User::where('email', 'andikabgs0508@gmail.com')->first();
    
    if (!$user) {
        echo "❌ Test user not found!\n";
        exit(1);
    }
    
    echo "✅ Found user: {$user->name} ({$user->email})\n\n";
    
    // 2. Create a token for this user
    $token = $user->createToken('test-token')->plainTextToken;
    echo "✅ Generated Sanctum token: " . substr($token, 0, 30) . "...\n\n";
    
    // 3. Find an OJS instance to test with
    echo "2️⃣  Finding an OJS instance to test...\n";
    
    $ojsInstance = App\Models\OjsInstance::first();
    
    if (!$ojsInstance) {
        echo "❌ No OJS instances found in database!\n";
        exit(1);
    }
    
    echo "✅ Found instance: {$ojsInstance->name} (ID: {$ojsInstance->id})\n";
    echo "   URL: {$ojsInstance->url}\n";
    echo "   Current username: " . ($ojsInstance->ojs_username ?? 'NULL') . "\n";
    echo "   Current password: " . ($ojsInstance->ojs_password ? 'SET' : 'NULL') . "\n\n";
    
    // 4. Test update with credentials
    echo "3️⃣  Testing update with new credentials...\n";
    
    $testUsername = 'test_user_' . time();
    $testPassword = 'test_pass_' . time();
    
    echo "   New username: {$testUsername}\n";
    echo "   New password: {$testPassword}\n\n";
    
    // Simulate an HTTP request
    $request = Request::create(
        "/api/ojs-instances/{$ojsInstance->id}",
        'PUT',
        [
            'ojs_username' => $testUsername,
            'ojs_password' => $testPassword,
        ]
    );
    
    // Set the user on the request (simulate auth:sanctum middleware)
    $request->setUserResolver(function () use ($user) {
        return $user;
    });
    
    // Call the controller directly
    $controller = new App\Http\Controllers\OjsInstanceController();
    $response = $controller->update($request, $ojsInstance);
    
    echo "✅ Update successful!\n";
    echo "   Response status: " . $response->status() . "\n\n";
    
    // 5. Verify the update
    echo "4️⃣  Verifying update in database...\n";
    
    $ojsInstance->refresh();
    
    echo "   Username in DB: " . ($ojsInstance->ojs_username ?? 'NULL') . "\n";
    echo "   Password in DB: " . ($ojsInstance->ojs_password ?? 'NULL') . "\n";
    
    if ($ojsInstance->ojs_username === $testUsername && $ojsInstance->ojs_password === $testPassword) {
        echo "\n✅ SUCCESS! Credentials saved correctly to database!\n";
    } else {
        echo "\n❌ FAILED! Credentials not saved correctly:\n";
        echo "   Expected username: {$testUsername}\n";
        echo "   Got username: " . ($ojsInstance->ojs_username ?? 'NULL') . "\n";
        echo "   Expected password: {$testPassword}\n";
        echo "   Got password: " . ($ojsInstance->ojs_password ?? 'NULL') . "\n";
    }
    
    // 6. Cleanup - restore original values
    echo "\n5️⃣  Restoring original values...\n";
    
    $ojsInstance->update([
        'ojs_username' => null,
        'ojs_password' => null
    ]);
    
    echo "✅ Cleaned up test data\n";
    
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "✅ All tests passed!\n\n";
    
} catch (Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n";
    echo "   File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "\n   Stack trace:\n";
    echo $e->getTraceAsString() . "\n";
    exit(1);
}
