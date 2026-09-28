<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    $dbh = new PDO('mysql:host=127.0.0.1;port=3306', 'root', '');
    echo "Connected to MySQL successfully\n";
    
    $stmt = $dbh->query("SHOW DATABASES LIKE 'itm'");
    if ($stmt->rowCount() > 0) {
        echo "Database 'itm' exists\n";
        
        $dbh->exec('USE itm');
        $stmt = $dbh->query("SELECT email, password FROM users WHERE email='adminitm@gmail.com'");
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            echo "User found!\n";
            if (password_verify('adminitm123', $user['password'])) {
                echo "Password matches!\n";
            } else {
                echo "Password does NOT match! Hash in DB: " . $user['password'] . "\n";
            }
        } else {
            echo "User adminitm@gmail.com not found in 'itm.users' table.\n";
        }
    } else {
        echo "Database 'itm' DOES NOT exist!\n";
    }
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
