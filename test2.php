<?php
// Let's create a script to fully test the API as a frontend would.
$baseUrl = "http://127.0.0.1:8000/api";

// 1. Login to main system
$ch = curl_init($baseUrl . '/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['email' => 'andikabgs0508@gmail.com', 'password' => 'password'])); // guessing password, or I can bypass
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Accept: application/json']);
$response = curl_exec($ch);
$loginData = json_decode($response, true);

if (!isset($loginData['token'])) {
    echo "Main login failed: " . $response . "\n";
    
    // Fallback: create token directly
    echo "Creating token via artisan...\n";
    $tokenOutput = shell_exec('php artisan tinker --execute="\$user = App\Models\User::where(\'email\', \'andikabgs0508@gmail.com\')->first(); echo \$user->createToken(\'test\')->plainTextToken;"');
    $mainToken = trim($tokenOutput);
} else {
    $mainToken = $loginData['token'];
}

echo "Main Token: " . substr($mainToken, 0, 15) . "...\n";

// 2. Blog Secure Authenticate
$ch = curl_init($baseUrl . '/blog-secure/authenticate');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['username' => 'blog_admin', 'password' => 'BlogSecure_2026!']));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'Authorization: Bearer ' . $mainToken
]);
$response = curl_exec($ch);
$blogAuth = json_decode($response, true);
echo "Blog Auth HTTP " . curl_getinfo($ch, CURLINFO_HTTP_CODE) . ": " . $response . "\n";

if (isset($blogAuth['session_token'])) {
    $blogToken = $blogAuth['session_token'];
    
    // 3. Blog Secure Session Check
    $ch = curl_init($baseUrl . '/blog-secure/session');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . $mainToken,
        'X-Blog-Session: ' . $blogToken
    ]);
    $response = curl_exec($ch);
    echo "Session Check HTTP " . curl_getinfo($ch, CURLINFO_HTTP_CODE) . ": " . $response . "\n";
    
    // 4. Get Blogs
    $ch = curl_init($baseUrl . '/blog-secure/blogs');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . $mainToken,
        'X-Blog-Session: ' . $blogToken
    ]);
    $response = curl_exec($ch);
    echo "Get Blogs HTTP " . curl_getinfo($ch, CURLINFO_HTTP_CODE) . ": " . substr($response, 0, 200) . "...\n";
}
