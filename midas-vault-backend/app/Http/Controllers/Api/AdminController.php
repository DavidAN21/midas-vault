<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barter;
use App\Models\Product;
use App\Models\TradeIn;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function overview(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $overview = [
            'total_users' => User::count(),
            'total_products' => Product::count(),
            'total_transactions' => Transaction::count(),
            'total_barters' => Barter::count(),
            'total_trade_ins' => TradeIn::count(),
            'pending_verifications' => Product::whereNull('verified_at')->count(),
            'pending_transactions' => Transaction::where('status', 'pending')->count(),
            'pending_barters' => Barter::where('status', 'pending')->count(),
            'pending_trade_ins' => TradeIn::where('status', 'negotiation')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $overview
        ]);
    }
}