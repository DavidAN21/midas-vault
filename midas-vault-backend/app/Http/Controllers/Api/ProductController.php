<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // ========================================
    // UPDATE (Full Modified Version)
    // ========================================
    public function update(ProductRequest $request, Product $product)
    {
        if ($product->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // DEBUG: Log request data
        \Log::info('Product Update Request:', $request->all());
        \Log::info('Product ID:', ['id' => $product->id]);

        // Validated data
        $updateData = $request->validated();

        // Handle image upload jika ada file baru
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $path = $image->storeAs('products', $imageName, 'public');

            // simpan path
            $updateData['image_url'] = Storage::url($path);
        }

        // Field `image` harus dihapus karena tidak ada di database
        unset($updateData['image']);

        // DEBUG: Log data yang akan diupdate
        \Log::info('Update Data:', $updateData);

        // Update product
        $product->update($updateData);

        // DEBUG: Log setelah update
        \Log::info('Product After Update:', $product->toArray());

        return response()->json([
            'success' => true,
            'data' => $product->fresh(),
            'message' => 'Produk berhasil diupdate!'
        ]);
    }


    // ========================================
    // INDEX
    // ========================================
    public function index(Request $request)
    {
        $query = Product::with(['user', 'verifier'])
            ->where('verification_status', 'approved')
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

        return response()->json([
            'success' => true,
            'data' => $query->latest()->get()
        ]);
    }


    // ========================================
    // STORE (Sudah termasuk barter & trade-in)
    // ========================================
    public function store(ProductRequest $request)
    {
        // Upload image
        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $imagePath = $file->storeAs('products', $fileName, 'public');
        }

        $product = Product::create([
            'user_id'               => $request->user()->id,
            'name'                  => $request->name,
            'description'           => $request->description,
            'category'              => $request->category,
            'condition'             => $request->condition,
            'price'                 => $request->price,
            'image_url'             => $imagePath ? Storage::url($imagePath) : '/images/default-product.jpg',
            'verification_status'   => 'pending',

            // Barter fields
            'allow_barter'          => (bool) $request->allow_barter,
            'barter_preferences'    => $request->barter_preferences,

            // Trade-in fields
            'allow_trade_in'        => (bool) $request->allow_trade_in,
            'trade_in_value'        => $request->trade_in_value ?: null,
            'trade_in_preferences'  => $request->trade_in_preferences,
        ]);

        return response()->json([
            'success' => true,
            'data'    => $product->load('user'),
            'message' => 'Produk berhasil diupload! Menunggu verifikasi admin.'
        ], 201);
    }


    // ========================================
    // SHOW
    // ========================================
    public function show(Product $product)
    {
        return response()->json([
            'success' => true,
            'data'    => $product->load(['user', 'verifier'])
        ]);
    }


    // ========================================
    // DELETE
    // ========================================
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


    // ========================================
    // GET USER PRODUCTS
    // ========================================
    public function myProducts(Request $request)
    {
        return response()->json([
            'success' => true,
            'data'    => Product::where('user_id', $request->user()->id)
                                ->with(['user', 'verifier'])
                                ->latest()
                                ->get()
        ]);
    }
}
