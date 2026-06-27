<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateLocalAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:local-admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a local admin user for development';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = 'admin@local.dev';
        $password = 'admin123';
        
        // Check if user already exists
        $existingUser = User::where('email', $email)->first();
        
        if ($existingUser) {
            $this->info('Local admin user already exists: ' . $email);
            return;
        }
        
        // Create the user
        $user = User::create([
            'name' => 'Local Admin',
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'super_admin',
        ]);
        
        $this->info('Local admin user created successfully!');
        $this->info('Email: ' . $email);
        $this->info('Password: ' . $password);
    }
}
