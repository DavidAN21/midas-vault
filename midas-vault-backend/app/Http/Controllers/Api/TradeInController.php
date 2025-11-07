<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\TradeIn;
use Illuminate\Http\Request;

class TradeInController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'new_product_id' => 'required|exists:products,id',
            'old_product_id' => 'required|exists:products,id',
        ]);

        $newProduct = Product::findOrFail($request->new_product_id);
        $oldProduct = Product::findOrFail($request->old_product_id);

        if ($oldProduct->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only trade-in your own products'
            ], 400);
        }

        if ($newProduct->user_id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot trade-in with your own product'
            ], 400);
        }

        if (!$newProduct->isAvailable() || !$oldProduct->isAvailable()) {
            return response()->json([
                'success' => false,
                'message' => 'One or both products are not available'
            ], 400);
        }

        $priceDifference = $newProduct->price - $oldProduct->price;

        $tradeIn = TradeIn::create([
            'buyer_id' => $request->user()->id,
            'seller_id' => $newProduct->user_id,
            'old_product_id' => $oldProduct->id,
            'new_product_id' => $newProduct->id,
            'price_difference' => $priceDifference,
            'status' => 'negotiation',
        ]);

        return response()->json([
            'success' => true,
            'data' => $tradeIn->load(['buyer', 'seller', 'oldProduct', 'newProduct'])
        ], 201);
    }

    public function agree(Request $request, TradeIn $tradeIn)
    {
        if ($tradeIn->seller_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $tradeIn->update(['status' => 'agreed']);

        return response()->json([
            'success' => true,
            'data' => $tradeIn
        ]);
    }

    public function pay(Request $request, TradeIn $tradeIn)
    {
        if ($tradeIn->buyer_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $tradeIn->update([
            'payment_status' => 'paid',
            'status' => 'completed',
        ]);

        $tradeIn->oldProduct->update(['status' => 'traded']);
        $tradeIn->newProduct->update(['status' => 'traded']);

        return response()->json([
            'success' => true,
            'data' => $tradeIn
        ]);
    }

    public function complete(Request $request, TradeIn $tradeIn)
    {
        if (!in_array($request->user()->id, [$tradeIn->buyer_id, $tradeIn->seller_id])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $tradeIn->update(['status' => 'completed']);

        return response()->json([
            'success' => true,
            'data' => $tradeIn
        ]);
    }

    public function myTradeIns(Request $request)
    {
        $tradeIns = TradeIn::where('buyer_id', $request->user()->id)
            ->orWhere('seller_id', $request->user()->id)
            ->with(['buyer', 'seller', 'oldProduct', 'newProduct'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $tradeIns
        ]);
    }
}