<?php
// Simple test for WP Secure session without full Laravel bootstrap

$config = [
    'DB_HOST' => '127.0.0.1',
    'DB_PORT' => '3306',  
    'DB_DATABASE' => 'itm',
    'DB_USERNAME' => 'root',
    'DB_PASSWORD' => ''
];

try {
    $pdo = new PDO(
        "mysql:host={$config['DB_HOST']};port={$config['DB_PORT']};dbname={$config['DB_DATABASE']}",
        $config['DB_USERNAME'],
        $config['DB_PASSWORD']
    );
    
    echo "WP Secure Sessions in Database:\n";
    
    $stmt = $pdo->prepare("
        SELECT s.*, u.name as user_name 
        FROM wp_secure_sessions s 
        LEFT JOIN users u ON s.user_id = u.id 
        ORDER BY s.created_at DESC
    ");
    $stmt->execute();
    $sessions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Total sessions: " . count($sessions) . "\n\n";
    
    foreach($sessions as $session) {
        echo "ID: {$session['id']}\n";
        echo "User: {$session['user_name']} (ID: {$session['user_id']})\n";  
        echo "Token: " . substr($session['session_token'], 0, 15) . "...\n";
        echo "Expires: {$session['expires_at']}\n";
        echo "IP: {$session['ip_address']}\n";
        echo "Created: {$session['created_at']}\n";
        $isExpired = (strtotime($session['expires_at']) < time());
        echo "Expired: " . ($isExpired ? 'YES' : 'NO') . "\n";
        echo "---\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}