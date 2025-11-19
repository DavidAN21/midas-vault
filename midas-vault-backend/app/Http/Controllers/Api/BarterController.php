<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barter;
use App\Models\Product;
use Illuminate\Http\Request;

class BarterController extends Controller
{
    // ===============================
    // STORE (Tidak diubah)
    // ===============================

    public function store(Request $request)
    {
        $request->validate([
            'receiver_product_id' => 'required|exists:products,id',
            'requester_product_id' => 'required|exists:products,id',
            'notes' => 'nullable|string|max:500',
        ]);

        $receiverProduct = Product::with('user')->findOrFail($request->receiver_product_id);
        $requesterProduct = Product::with('user')->findOrFail($request->requester_product_id);

        // Debug info
        \Log::info('Barter Attempt:', [
            'requester_user_id' => $request->user()->id,
            'requester_product_user_id' => $requesterProduct->user_id,
            'receiver_product_user_id' => $receiverProduct->user_id,
            'receiver_allows_barter' => $receiverProduct->allow_barter,
            'requester_product_status' => $requesterProduct->status,
            'receiver_product_status' => $receiverProduct->status,
            'requester_verified' => $requesterProduct->isVerified(),
            'receiver_verified' => $receiverProduct->isVerified(),
        ]);

        // Validasi 1: Cek apakah produk requester milik user
        if ($requesterProduct->user_id !== $request->user()->id) {
            \Log::warning('Barter Failed: Requester product not owned by user');
            return response()->json([
                'success' => false,
                'message' => 'Anda hanya bisa menawarkan produk sendiri untuk barter'
            ], 400);
        }

        // Validasi 2: Cek tidak barter dengan diri sendiri
        if ($receiverProduct->user_id === $request->user()->id) {
            \Log::warning('Barter Failed: Cannot barter with own product');
            return response()->json([
                'success' => false,
                'message' => 'Tidak bisa barter dengan produk sendiri'
            ], 400);
        }

        // Validasi 3: Cek apakah receiver product menerima barter
        if (!$receiverProduct->allow_barter) {
            \Log::warning('Barter Failed: Receiver product does not allow barter');
            return response()->json([
                'success' => false,
                'message' => 'Produk ini tidak menerima penawaran barter'
            ], 400);
        }

        // Validasi 4: Cek status verification kedua produk
        if (!$requesterProduct->isVerified()) {
            \Log::warning('Barter Failed: Requester product not verified');
            return response()->json([
                'success' => false,
                'message' => 'Produk Anda belum terverifikasi'
            ], 400);
        }

        if (!$receiverProduct->isVerified()) {
            \Log::warning('Barter Failed: Receiver product not verified');
            return response()->json([
                'success' => false,
                'message' => 'Produk target belum terverifikasi'
            ], 400);
        }

        // Validasi 5: Cek ketersediaan produk
        if (!$requesterProduct->isAvailable()) {
            \Log::warning('Barter Failed: Requester product not available');
            return response()->json([
                'success' => false,
                'message' => 'Produk Anda sudah tidak tersedia'
            ], 400);
        }

        if (!$receiverProduct->isAvailable()) {
            \Log::warning('Barter Failed: Receiver product not available');
            return response()->json([
                'success' => false,
                'message' => 'Produk target sudah tidak tersedia'
            ], 400);
        }

        // Validasi 6: Cek apakah sudah ada barter pending
        $existingBarter = Barter::where(function($query) use ($requesterProduct, $receiverProduct) {
            $query->where('requester_product_id', $requesterProduct->id)
                ->where('receiver_product_id', $receiverProduct->id);
        })->orWhere(function($query) use ($requesterProduct, $receiverProduct) {
            $query->where('requester_product_id', $receiverProduct->id)
                ->where('receiver_product_id', $requesterProduct->id);
        })->whereIn('status', ['pending', 'accepted'])->first();

        if ($existingBarter) {
            \Log::warning('Barter Failed: Existing barter found');
            return response()->json([
                'success' => false,
                'message' => 'Sudah ada penawaran barter antara produk ini'
            ], 400);
        }

        // SEMUA VALIDASI LULUS - BUAT BARTER
        $barter = Barter::create([
            'requester_id' => $request->user()->id,
            'receiver_id' => $receiverProduct->user_id,
            'requester_product_id' => $requesterProduct->id,
            'receiver_product_id' => $receiverProduct->id,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        \Log::info('Barter Created Successfully:', ['barter_id' => $barter->id]);

        return response()->json([
            'success' => true,
            'data' => $barter->load(['requester', 'receiver', 'requesterProduct', 'receiverProduct']),
            'message' => 'Penawaran barter berhasil dikirim!'
        ], 201);
    }

    // ===============================
    // ACCEPT (Tidak diubah)
    // ===============================

    public function accept(Request $request, Barter $barter)
    {
        if ($barter->receiver_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        if ($barter->status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'Penawaran barter sudah diproses'], 400);
        }

        $barter->update(['status' => 'accepted']);

        // Update status produk agar tidak bisa dibeli pengguna lain
        $barter->requesterProduct->update(['status' => 'bartered']);
        $barter->receiverProduct->update(['status' => 'bartered']);

        return response()->json([
            'success' => true,
            'data' => $barter,
            'message' => 'Penawaran barter diterima!'
        ]);
    }

    // ===============================
    // REJECT (Tidak diubah)
    // ===============================

    public function reject(Request $request, Barter $barter)
    {
        if ($barter->receiver_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $barter->update(['status' => 'rejected']);

        return response()->json([
            'success' => true,
            'data' => $barter,
            'message' => 'Penawaran barter ditolak!'
        ]);
    }

    // ===============================
    // COMPLETE (MODIFIKASI LENGKAP)
    // ===============================

    public function complete(Request $request, Barter $barter)
    {
        if (!in_array($request->user()->id, [$barter->requester_id, $barter->receiver_id])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Cek apakah barter sudah accepted
        if (!$barter->isAccepted()) {
            return response()->json([
                'success' => false,
                'message' => 'Barter belum diterima'
            ], 400);
        }

        // Cek apakah user sudah konfirmasi sebelumnya
        if ($barter->isConfirmedByUser($request->user()->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah mengkonfirmasi barter ini'
            ], 400);
        }

        try {
            // Konfirmasi oleh user
            $barter->confirmByUser($request->user()->id);
            
            $message = 'Konfirmasi berhasil! ';

            // Cek apakah kedua belah pihak sudah konfirmasi
            if ($barter->isCompleted()) {
                $barter->update(['status' => 'completed']);
                
                // Update status produk
                $barter->requesterProduct->update(['status' => 'bartered']);
                $barter->receiverProduct->update(['status' => 'bartered']);

                $message .= 'Barter selesai! Kedua pihak telah mengkonfirmasi.';
            } else {
                $message .= 'Menunggu konfirmasi dari pihak lain.';
            }

            return response()->json([
                'success' => true,
                'data' => $barter->load(['requester', 'receiver', 'requesterProduct', 'receiverProduct']),
                'message' => $message
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    // ===============================
    // CANCEL (MODIFIKASI LENGKAP)
    // ===============================

    public function cancel(Request $request, Barter $barter)
    {
        if (!in_array($request->user()->id, [$barter->requester_id, $barter->receiver_id])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $barter->update([
            'status' => 'cancelled',
            'requester_confirmed' => false,
            'receiver_confirmed' => false,
        ]);

        // Kembalikan status produk ke available
        if ($barter->status === 'accepted') {
            $barter->requesterProduct->makeAvailable();
            $barter->receiverProduct->makeAvailable();
        }

        return response()->json([
            'success' => true,
            'data' => $barter,
            'message' => 'Barter dibatalkan! Produk kembali tersedia di marketplace.'
        ]);
    }
    // ===============================
    // MY BARTERS (Tidak diubah)
    // ===============================

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
