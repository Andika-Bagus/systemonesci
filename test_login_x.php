<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('email', 'adminitm@gmail.com')->first();
if ($user) {
    if (\Illuminate\Support\Facades\Hash::check('adminitm123', $user->password)) {
        echo "Valid password\n";
    } else {
        echo "Invalid password\n";
    }
} else {
    echo "User not found\n";
}
