<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::first();
if (!$user) die("No user found");

$token = 'test_token_' . time();
App\Models\WpSecureSession::create([
    'session_token' => $token,
    'user_id' => $user->id,
    'expires_at' => now()->addHours(1),
    'user_agent' => 'test',
    'ip_address' => '127.0.0.1'
]);

$req = Illuminate\Http\Request::create('/api/wp-secure/websites', 'GET');
$req->headers->set('X-WP-Session', $token);
$req->setUserResolver(function() use ($user) { return $user; });

$ctrl = new App\Http\Controllers\WpSecureController();
$res = $ctrl->getWebsites($req);

echo "Status: " . $res->getStatusCode() . "\n";
if ($res->getStatusCode() == 200) {
    $data = $res->getData(true);
    echo "Total websites in response: " . $data['total'] . "\n";
} else {
    echo "Response: " . json_encode($res->getData()) . "\n";
}
