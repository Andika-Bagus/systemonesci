<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateTestUserCommand extends Command
{
    protected $signature = 'create:test-user';
    protected $description = 'Create a test user for local development';

    public function handle()
    {
        $email = 'admin@test.com';
        $password = 'password123';
        
        // Check if user already exists
        if (User::where('email', $email)->exists()) {
            $this->info("User with email {$email} already exists!");
            return;
        }

        $user = User::create([
            'name' => 'Test Admin',
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'super_admin',
            'holding_id' => 1,
        ]);

        $this->info("Test user created successfully!");
        $this->info("Email: {$email}");
        $this->info("Password: {$password}");
        $this->info("Role: {$user->role}");
    }
}