<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateSuperAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:superadmin {email?} {password?} {name?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a super admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email') ?? $this->ask('Enter email address', 'itmaintainance@gmail.com');
        $name = $this->argument('name') ?? $this->ask('Enter full name', 'IT Maintenance');
        $password = $this->argument('password') ?? $this->secret('Enter password (leave empty for default)') ?? 'SuperAdmin123!';

        // Check if user already exists
        $existingUser = User::where('email', $email)->first();
        
        if ($existingUser) {
            if ($this->confirm("User with email {$email} already exists. Update to superadmin?")) {
                $existingUser->update([
                    'name' => $name,
                    'role' => 'superadmin',
                    'holding_id' => null,
                ]);
                $this->info("User {$email} updated to Super Admin successfully!");
            } else {
                $this->info('Operation cancelled.');
                return;
            }
        } else {
            User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => 'superadmin',
                'holding_id' => null,
                'email_verified_at' => now(),
            ]);
            
            $this->info("Super Admin user created successfully!");
        }
        
        $this->table(
            ['Field', 'Value'],
            [
                ['Name', $name],
                ['Email', $email],
                ['Role', 'superadmin'],
                ['Password', $existingUser ? '(unchanged)' : $password],
            ]
        );
    }
}
