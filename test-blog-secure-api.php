<?php
$token = 'blog_tF1vR'; // dummy or let's just make a new login
// Actually let's just use curl in bash.

$url = "http://127.0.0.1:8000/api/blog-secure/authenticate";
$data = json_encode(['username' => 'blog_admin', 'password' => 'BlogSecure_2026!']);
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
$response = curl_exec($ch);
echo "Auth response:\n" . $response . "\n\n";

$resObj = json_decode($response, true);
if (isset($resObj['session_token'])) {
    $token = $resObj['session_token'];
    
    // Now test session
    $url = "http://127.0.0.1:8000/api/blog-secure/session";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'X-Blog-Session: ' . $token
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    echo "Session HTTP Code: " . $httpCode . "\n";
    echo "Session response:\n" . $response . "\n\n";
    
    // Now test blogs
    $url = "http://127.0.0.1:8000/api/blog-secure/blogs";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'X-Blog-Session: ' . $token
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    echo "Blogs HTTP Code: " . $httpCode . "\n";
    echo "Blogs response:\n" . $response . "\n\n";
}
