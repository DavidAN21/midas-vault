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
            'payment_method' => 'required|string',
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($product->user_id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot buy your own product'
            ], 400);
        }

        if (!$product->isAvailable()) {
            return response()->json([
                'success' => false,
                'message' => 'Product is not available'
            ], 400);
        }

        $transaction = Transaction::create([
            'buyer_id' => $request->user()->id,
            'seller_id' => $product->user_id,
            'product_id' => $product->id,
            'amount' => $product->price,
            'payment_method' => $request->payment_method,
            'status' => 'pending',
        ]);

        $product->update(['status' => 'sold']);

        return response()->json([
            'success' => true,
            'data' => $transaction->load(['buyer', 'seller', 'product'])
        ], 201);
    }

    public function confirm(Request $request, Transaction $transaction)
    {
        if ($transaction->seller_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $transaction->update(['status' => 'completed']);

        return response()->json([
            'success' => true,
            'data' => $transaction
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
            'data' => $transaction
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