<?php
// Fix tinker command
$cmd = 'php artisan tinker --execute="echo App\Models\User::first()->createToken(\'test\')->plainTextToken;"';
$tokenOutput = shell_exec($cmd);
$mainToken = trim($tokenOutput);

echo "Main Token: " . $mainToken . "\n";

$baseUrl = "http://127.0.0.1:8000/api";

// 1. Blog Secure Authenticate
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
    
    // 2. Blog Secure Session Check
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
    
    // 3. Get Blogs
    $ch = curl_init($baseUrl . '/blog-secure/blogs');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
        'Authorization: Bearer ' . $mainToken,
        'X-Blog-Session: ' . $blogToken
    ]);
    $response = curl_exec($ch);
    echo "Get Blogs HTTP " . curl_getinfo($ch, CURLINFO_HTTP_CODE) . ": " . substr($response, 0, 500) . "...\n";
}
