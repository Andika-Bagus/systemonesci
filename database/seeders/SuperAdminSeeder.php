<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if user already exists
        $existingUser = User::where('email', 'itmaintainance@gmail.com')->first();
        
        if (!$existingUser) {
            User::create([
                'name' => 'IT Maintenance',
                'email' => 'itmaintainance@gmail.com',
                'password' => Hash::make('SuperAdmin123!'),
                'role' => 'superadmin',
                'holding_id' => null, // Superadmin tidak terikat ke holding tertentu
                'email_verified_at' => now(),
            ]);
            
            $this->command->info('Super Admin user created successfully!');
            $this->command->info('Email: itmaintainance@gmail.com');
            $this->command->info('Password: SuperAdmin123!');
        } else {
            // Update existing user to superadmin if not already
            if ($existingUser->role !== 'superadmin') {
                $existingUser->update([
                    'role' => 'superadmin',
                    'holding_id' => null,
                ]);
                $this->command->info('Existing user updated to Super Admin!');
            } else {
                $this->command->info('Super Admin user already exists!');
            }
        }
    }
}