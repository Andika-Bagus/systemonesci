<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateViewerCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create-viewer {name} {email} {password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new viewer user (read-only access)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');
        $email = $this->argument('email');
        $password = $this->argument('password');

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
            ]);

            $this->info("✓ Viewer user created successfully!");
            $this->line("Name: {$user->name}");
            $this->line("Email: {$user->email}");
            $this->line("Role: {$user->role}");
            $this->line("ID: {$user->id}");
            $this->line("");
            $this->info("This user can:");
            $this->line("  • View all websites");
            $this->line("  • View PageSpeed data");
            $this->line("  • View Uptime status");
            $this->line("  • View Domain information");
            $this->line("  • View Gambling scan results");
            $this->line("");
            $this->warn("This user CANNOT:");
            $this->line("  • Run PageSpeed checks");
            $this->line("  • Run Uptime checks");
            $this->line("  • Run Domain checks");
            $this->line("  • Run Gambling scans");
            $this->line("  • Create/Edit/Delete websites");
            $this->line("  • Create/Edit/Delete tickets");

            return 0;
        } catch (\Exception $e) {
            $this->error("Error creating viewer user: " . $e->getMessage());
            return 1;
        }
    }
}
