<?php

namespace Database\Seeders;

use App\Models\Barter;
use App\Models\Product;
use App\Models\Review;
use App\Models\TradeIn;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Verification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin
        $admin = User::create([
            'name' => 'Admin Midas',
            'email' => 'admin@midasvault.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'phone' => '081234567890',
            'address' => 'Magelang, Jawa Tengah',
            'reputation_score' => 5.00,
        ]);

        // Create sellers
        $seller1 = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@example.com',
            'password' => Hash::make('password123'),
            'role' => 'seller',
            'phone' => '081234567891',
            'address' => 'Jl. Merdeka No. 123, Magelang',
            'reputation_score' => 4.8,
        ]);

        $seller2 = User::create([
            'name' => 'Sari Indah',
            'email' => 'sari@example.com',
            'password' => Hash::make('password123'),
            'role' => 'seller',
            'phone' => '081234567892',
            'address' => 'Jl. Pahlawan No. 45, Magelang',
            'reputation_score' => 4.9,
        ]);

        // Create buyers
        $buyer1 = User::create([
            'name' => 'Rina Wijaya',
            'email' => 'rina@example.com',
            'password' => Hash::make('password123'),
            'role' => 'buyer',
            'phone' => '081234567893',
            'address' => 'Jl. Sudirman No. 67, Magelang',
            'reputation_score' => 4.7,
        ]);

        $buyer2 = User::create([
            'name' => 'Ahmad Fauzi',
            'email' => 'ahmad@example.com',
            'password' => Hash::make('password123'),
            'role' => 'buyer',
            'phone' => '081234567894',
            'address' => 'Jl. Gatot Subroto No. 89, Magelang',
            'reputation_score' => 4.6,
        ]);


        $this->command->info('Database seeded successfully!');
        $this->command->info('Admin Login: admin@midasvault.com / password123');
        $this->command->info('Seller 1: budi@example.com / password123');
        $this->command->info('Seller 2: sari@example.com / password123');
        $this->command->info('Buyer 1: rina@example.com / password123');
        $this->command->info('Buyer 2: ahmad@example.com / password123');
    }
}