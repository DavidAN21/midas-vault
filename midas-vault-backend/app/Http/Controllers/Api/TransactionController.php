<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{   
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'payment_method' => 'required|string|in:transfer,cash,other',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Cegah beli produk sendiri
        if ($product->user_id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak bisa membeli produk sendiri'
            ], 400);
        }

        // Pastikan produk masih tersedia
        if (!$product->isAvailable()) {
            return response()->json([
                'success' => false,
                'message' => 'Produk sudah tidak tersedia'
            ], 400);
        }

        // Buat transaksi baru
        $transaction = Transaction::create([
            'buyer_id' => $request->user()->id,
            'seller_id' => $product->user_id,
            'product_id' => $product->id,
            'amount' => $product->price,
            'payment_method' => $request->payment_method,
            'status' => 'pending',
            'payment_reference' => 'TRX-' . time() . '-' . $request->user()->id,
        ]);

        // Update status produk
        $product->update(['status' => 'sold']);

        return response()->json([
            'success' => true,
            'data' => $transaction->load(['buyer', 'seller', 'product']),
            'message' => 'Transaksi berhasil dibuat! Silakan lanjutkan pembayaran.'
        ], 201);
    }

    public function confirm(Request $request, Transaction $transaction)
    {
        if ($transaction->seller_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $transaction->update(['status' => 'completed']);

        return response()->json([
            'success' => true,
            'data' => $transaction,
            'message' => 'Transaksi dikonfirmasi selesai!'
        ]);
    }

    public function refund(Request $request, Transaction $transaction)
    {
        if ($transaction->seller_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $transaction->update(['status' => 'refunded']);
        $transaction->product->update(['status' => 'available']);

        return response()->json([
            'success' => true,
            'data' => $transaction,
            'message' => 'Transaksi berhasil direfund dan produk tersedia kembali.'
        ]);
    }

    public function myTransactions(Request $request)
    {
        $transactions = Transaction::where('buyer_id', $request->user()->id)
            ->orWhere('seller_id', $request->user()->id)
            ->with(['buyer', 'seller', 'product'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }
}
