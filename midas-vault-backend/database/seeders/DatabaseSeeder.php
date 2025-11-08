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

        // Products for seller1
        $product1 = Product::create([
            'user_id' => $seller1->id,
            'name' => 'Sepatu Sneakers Nike Air Max',
            'description' => 'Sepatu sneakers Nike Air Max kondisi sangat baik, hanya dipakai beberapa kali. Original dan nyaman digunakan.',
            'category' => 'Fashion',
            'condition' => 'excellent',
            'price' => 450000,
            'image_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
            'verified_at' => now(),
            'verified_by' => $admin->id,
            'verification_status' => 'approved'
            
        ]);

        $product2 = Product::create([
            'user_id' => $seller1->id,
            'name' => 'Kamera Canon EOS 600D',
            'description' => 'Kamera DSLR Canon 600D dengan lensa kit 18-55mm. Kondisi baik, berfungsi normal, cocok untuk pemula fotografi.',
            'category' => 'Electronics',
            'condition' => 'good',
            'price' => 1200000,
            'image_url' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
            'verified_at' => now(),
            'verified_by' => $admin->id,
            'verification_status' => 'approved',
        ]);

        // Products for seller2
        $product3 = Product::create([
            'user_id' => $seller2->id,
            'name' => 'Tas Ransel The North Face',
            'description' => 'Tas ransel outdoor merk The North Face, waterproof dan banyak kompartemen. Cocok untuk hiking dan travel.',
            'category' => 'Fashion',
            'condition' => 'good',
            'price' => 350000,
            'image_url' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
            'verified_at' => now(),
            'verified_by' => $admin->id,
            'verification_status' => 'approved',
        ]);

        $product4 = Product::create([
            'user_id' => $seller2->id,
            'name' => 'Smartphone Samsung Galaxy S10',
            'description' => 'HP Samsung Galaxy S10 kondisi masih bagus, layar AMOLED, kamera jernih. Include charger dan case original.',
            'category' => 'Electronics',
            'condition' => 'fair',
            'price' => 1800000,
            'image_url' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        ]);

        // Additional products for variety
        $product5 = Product::create([
            'user_id' => $seller1->id,
            'name' => 'Novel Laskar Pelangi',
            'description' => 'Buku novel bestseller Laskar Pelangi oleh Andrea Hirata. Kondisi seperti baru, halaman lengkap.',
            'category' => 'Books',
            'condition' => 'excellent',
            'price' => 75000,
            'image_url' => 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
        ]);

        $product6 = Product::create([
            'user_id' => $seller2->id,
            'name' => 'Gitar Akustik Yamaha',
            'description' => 'Gitar akustik Yamaha F310, suara jernih dan nyaman dimainkan. Cocok untuk pemula yang belajar gitar.',
            'category' => 'Hobbies',
            'condition' => 'good',
            'price' => 600000,
            'image_url' => 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500',
        ]);

        // Create sample transactions
        $transaction = Transaction::create([
            'buyer_id' => $buyer1->id,
            'seller_id' => $seller1->id,
            'product_id' => $product1->id,
            'amount' => $product1->price,
            'status' => 'completed',
            'payment_method' => 'transfer',
        ]);

        // Create sample review
        Review::create([
            'reviewer_id' => $buyer1->id,
            'transaction_id' => $transaction->id,
            'rating' => 5,
            'comment' => 'Barang sesuai deskripsi, pengiriman cepat. Seller ramah dan terpercaya!',
        ]);

        $this->command->info('Database seeded successfully!');
        $this->command->info('Admin Login: admin@midasvault.com / password123');
        $this->command->info('Seller 1: budi@example.com / password123');
        $this->command->info('Seller 2: sari@example.com / password123');
        $this->command->info('Buyer 1: rina@example.com / password123');
        $this->command->info('Buyer 2: ahmad@example.com / password123');
    }
}