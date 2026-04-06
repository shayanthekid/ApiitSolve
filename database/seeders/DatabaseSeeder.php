<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin Staff',
            'email' => 'admin@helpdesk.com',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'IT Support Agent',
            'email' => 'agent@helpdesk.com',
            'role' => 'it_agent',
        ]);

        User::factory()->create([
            'name' => 'Standard Student',
            'email' => 'student@helpdesk.com',
            'role' => 'student',
        ]);
    }
}
