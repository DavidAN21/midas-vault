<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barter;
use App\Models\Product;
use Illuminate\Http\Request;

class BarterController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'receiver_product_id' => 'required|exists:products,id',
            'requester_product_id' => 'required|exists:products,id',
            'notes' => 'nullable|string',
        ]);

        $receiverProduct = Product::findOrFail($request->receiver_product_id);
        $requesterProduct = Product::findOrFail($request->requester_product_id);

        if ($requesterProduct->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only barter with your own products'
            ], 400);
        }

        if ($receiverProduct->user_id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot barter with your own product'
            ], 400);
        }

        if (!$receiverProduct->isAvailable() || !$requesterProduct->isAvailable()) {
            return response()->json([
                'success' => false,
                'message' => 'One or both products are not available'
            ], 400);
        }

        $barter = Barter::create([
            'requester_id' => $request->user()->id,
            'receiver_id' => $receiverProduct->user_id,
            'requester_product_id' => $requesterProduct->id,
            'receiver_product_id' => $receiverProduct->id,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'data' => $barter->load(['requester', 'receiver', 'requesterProduct', 'receiverProduct'])
        ], 201);
    }

    public function accept(Request $request, Barter $barter)
    {
        if ($barter->receiver_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $barter->update(['status' => 'accepted']);
        $barter->requesterProduct->update(['status' => 'bartered']);
        $barter->receiverProduct->update(['status' => 'bartered']);

        return response()->json([
            'success' => true,
            'data' => $barter
        ]);
    }

    public function complete(Request $request, Barter $barter)
    {
        if (!in_array($request->user()->id, [$barter->requester_id, $barter->receiver_id])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $barter->update(['status' => 'completed']);

        return response()->json([
            'success' => true,
            'data' => $barter
        ]);
    }

    public function myBarters(Request $request)
    {
        $barters = Barter::where('requester_id', $request->user()->id)
            ->orWhere('receiver_id', $request->user()->id)
            ->with(['requester', 'receiver', 'requesterProduct', 'receiverProduct'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $barters
        ]);
    }
}