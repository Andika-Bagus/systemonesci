<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateTestTicketingUserCommand extends Command
{
    protected $signature = 'create:test-ticketing-user {email} {password} {holding_id} {name}';
    protected $description = 'Create a test ticketing user for development';

    public function handle()
    {
        $email = $this->argument('email');
        $password = $this->argument('password');
        $holding_id = $this->argument('holding_id');
        $name = $this->argument('name');
        
        // Check if user already exists
        if (User::where('email', $email)->exists()) {
            $this->info("User with email {$email} already exists!");
            return;
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'ticketing_user',
            'holding_id' => $holding_id,
        ]);

        $this->info("Test ticketing user created successfully!");
        $this->info("Name: {$name}");
        $this->info("Email: {$email}");
        $this->info("Password: {$password}");
        $this->info("Role: {$user->role}");
        $this->info("Holding ID: {$user->holding_id}");
    }
}
