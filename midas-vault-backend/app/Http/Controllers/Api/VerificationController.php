<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Verification;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function pending(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $products = Product::whereNull('verified_at')
            ->with('user')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    public function update(Request $request, Product $product)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'status' => 'required|in:approved,rejected',
            'notes' => 'nullable|string',
        ]);

        if ($request->status === 'approved') {
            $product->update([
                'verified_by' => $request->user()->id,
                'verified_at' => now(),
            ]);
        }

        Verification::create([
            'product_id' => $product->id,
            'verifier_id' => $request->user()->id,
            'status' => $request->status,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'data' => $product->load('verifier')
        ]);
    }
}