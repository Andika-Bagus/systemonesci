<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateViewerUserCommand extends Command
{
    protected $signature = 'create:viewer-user {name?} {email?} {password?}';
    protected $description = 'Create a viewer user with access to Domain Monitor only';

    public function handle()
    {
        // Get input from arguments
        $name = $this->argument('name');
        $email = $this->argument('email');
        $password = $this->argument('password');

        // Validate required arguments
        if (!$name || !$email || !$password) {
            $this->error('All arguments are required: name, email, password');
            $this->info('Usage: php artisan create:viewer-user "Name" email@example.com password123');
            return 1;
        }

        // Validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Invalid email format!');
            return 1;
        }

        // Check if user already exists
        if (User::where('email', $email)->exists()) {
            $this->error("User with email {$email} already exists!");
            return 1;
        }

        try {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => 'viewer',
                'holding_id' => null, // Viewer can see all websites
            ]);

            $this->info('✓ Viewer user created successfully!');
            $this->line('');
            $this->info('User Details:');
            $this->line("  Name: {$user->name}");
            $this->line("  Email: {$user->email}");
            $this->line("  Role: {$user->role}");
            $this->line('');
            $this->warn('Permissions:');
            $this->line('  ✓ Can access Domain Monitor page');
            $this->line('  ✓ Can run domain checks');
            $this->line('  ✓ Can see Domain notifications');
            $this->line('  ✗ Cannot access Dashboard');
            $this->line('  ✗ Cannot access PageSpeed Monitor');
            $this->line('  ✗ Cannot access Uptime Monitor');
            $this->line('  ✗ Cannot access Website Management');
            $this->line('  ✗ Cannot access Support Tickets');
            $this->line('  ✗ Cannot perform any write operations');
            $this->line('');

            return 0;
        } catch (\Exception $e) {
            $this->error('Error creating user: ' . $e->getMessage());
            return 1;
        }
    }
}
