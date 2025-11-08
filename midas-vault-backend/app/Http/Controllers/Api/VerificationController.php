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
            ->with(['user', 'verifications'])
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
            'notes' => 'nullable|string|max:500',
        ]);

        if ($request->status === 'approved') {
            $product->update([
                'verified_by' => $request->user()->id,
                'verified_at' => now(),
            ]);
        } else {
            $product->update([
                'verified_by' => null,
                'verified_at' => null,
            ]);
        }

        // Catat verifikasi
        Verification::create([
            'product_id' => $product->id,
            'verifier_id' => $request->user()->id,
            'status' => $request->status,
            'notes' => $request->notes,
        ]);

        $message = $request->status === 'approved' 
            ? 'Produk berhasil diverifikasi!' 
            : 'Produk ditolak verifikasi.';

        return response()->json([
            'success' => true,
            'data' => $product->load(['user', 'verifier']),
            'message' => $message
        ]);
    }

    public function verifiedProducts(Request $request)
    {
        $products = Product::whereNotNull('verified_at')
            ->with(['user', 'verifier'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }
}