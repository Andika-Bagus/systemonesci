<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create superadmin user
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password'),
            'role' => 'superadmin',
        ]);

        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create user tiket (hanya bisa akses halaman tiket)
        User::create([
            'name' => 'User Tiket',
            'email' => 'user.tiket@example.com',
            'password' => Hash::make('password'),
            'role' => 'user_tiket',
        ]);

        // Call other seeders
        $this->call([
            SuperAdminSeeder::class,
            WebsiteSeeder::class,
        ]);
    }
}
