<?php
// Test WP Secure backend manually

$token = 'd605d7929bd6a5d'; // First part of your token

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => 'http://127.0.0.1:8000/api/wp-secure/session',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Content-Type: application/json',
        'Authorization: Bearer 1|vG0ovlLKLi7Qq2U1UQ22qGLG1cFIKnQUl3jcF1o2e3f3f0ca', // Your main auth token
        'X-WP-Session: ' . $token,
    ],
]);

echo "Testing WP Secure session endpoint...\n";
$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n";

curl_close($curl);

// Test websites endpoint
echo "\nTesting WP Secure websites endpoint...\n";

$curl2 = curl_init();
curl_setopt_array($curl2, [
    CURLOPT_URL => 'http://127.0.0.1:8000/api/wp-secure/websites',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Content-Type: application/json',
        'Authorization: Bearer 1|vG0ovlLKLi7Qq2U1UQ22qGLG1cFIKnQUl3jcF1o2e3f3f0ca', // Your main auth token  
        'X-WP-Session: ' . $token,
    ],
]);

$response2 = curl_exec($curl2);
$httpCode2 = curl_getinfo($curl2, CURLINFO_HTTP_CODE);

echo "HTTP Code: $httpCode2\n";
echo "Response: $response2\n";

curl_close($curl2);