<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['user', 'verifier'])
            ->where('verification_status', 'approved') // ✅ hanya tampil produk yang sudah disetujui admin
            ->where('status', 'available');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('condition') && $request->condition !== 'all') {
            $query->where('condition', $request->condition);
        }

        if ($request->has('verified') && $request->verified === 'true') {
            $query->whereNotNull('verified_at');
        }

        $products = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    public function store(ProductRequest $request)
    {
        // ✅ Upload gambar
        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('products', $imageName, 'public');
        }

        // ✅ Simpan produk dengan status verifikasi "pending"
        $product = Product::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'description' => $request->description,
            'category' => $request->category,
            'condition' => $request->condition,
            'price' => $request->price,
            'image_url' => $imagePath ? Storage::url($imagePath) : '/images/default-product.jpg',
            'verification_status' => 'pending', // Tambahan: produk baru menunggu verifikasi
        ]);

        return response()->json([
            'success' => true,
            'data' => $product->load('user'),
            'message' => 'Produk berhasil diupload! Menunggu verifikasi admin.'
        ], 201);
    }

    public function show(Product $product)
    {
        return response()->json([
            'success' => true,
            'data' => $product->load(['user', 'verifier'])
        ]);
    }

    public function update(ProductRequest $request, Product $product)
    {
        if ($product->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $product->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    public function destroy(Request $request, Product $product)
    {
        if ($product->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }

    public function myProducts(Request $request)
    {
        $products = Product::where('user_id', $request->user()->id)
            ->with(['user', 'verifier'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }
}
