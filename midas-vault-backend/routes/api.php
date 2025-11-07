<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BarterController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\TradeInController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\VerificationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::get('/reviews/{userId}', [ReviewController::class, 'userReviews']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::put('/user', [AuthController::class, 'updateUser']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Products
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
        Route::get('/my-products', [ProductController::class, 'myProducts']);

        // Transactions
        Route::apiResource('transactions', TransactionController::class)->only(['store', 'show']);
        Route::get('/my-transactions', [TransactionController::class, 'myTransactions']);
        Route::patch('/transactions/{transaction}/confirm', [TransactionController::class, 'confirm']);
        Route::patch('/transactions/{transaction}/refund', [TransactionController::class, 'refund']);

        // Barters
        Route::apiResource('barters', BarterController::class)->only(['store', 'show']);
        Route::get('/my-barters', [BarterController::class, 'myBarters']);
        Route::patch('/barters/{barter}/accept', [BarterController::class, 'accept']);
        Route::patch('/barters/{barter}/complete', [BarterController::class, 'complete']);

        // Trade-ins
        Route::apiResource('trade-ins', TradeInController::class)->only(['store', 'show']);
        Route::get('/my-trade-ins', [TradeInController::class, 'myTradeIns']);
        Route::patch('/trade-ins/{tradeIn}/agree', [TradeInController::class, 'agree']);
        Route::patch('/trade-ins/{tradeIn}/pay', [TradeInController::class, 'pay']);
        Route::patch('/trade-ins/{tradeIn}/complete', [TradeInController::class, 'complete']);

        // Reviews
        Route::apiResource('reviews', ReviewController::class)->only(['store']);

        // Admin routes
        Route::middleware('admin')->group(function () {
            Route::get('/admin/overview', [AdminController::class, 'overview']);
            Route::get('/verifications/pending', [VerificationController::class, 'pending']);
            Route::patch('/verifications/{product}', [VerificationController::class, 'update']);
        });
    });
});