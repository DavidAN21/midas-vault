<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barter extends Model
{
    use HasFactory;

    protected $fillable = [
        'requester_id',
        'receiver_id',
        'requester_product_id',
        'receiver_product_id',
        'status',
        'notes',
        'requester_confirmed',
        'receiver_confirmed',
    ];

    protected $casts = [
        'requester_confirmed' => 'boolean',
        'receiver_confirmed' => 'boolean',
    ];

    public function requester()
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function requesterProduct()
    {
        return $this->belongsTo(Product::class, 'requester_product_id');
    }

    public function receiverProduct()
    {
        return $this->belongsTo(Product::class, 'receiver_product_id');
    }

    // ✅ TAMBAHKAN METHOD INI
    public function isCompleted()
    {
        return $this->requester_confirmed && $this->receiver_confirmed;
    }

    // ✅ Method helper untuk cek status
    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isAccepted()
    {
        return $this->status === 'accepted';
    }

    public function isRejected()
    {
        return $this->status === 'rejected';
    }

    public function isCancelled()
    {
        return $this->status === 'cancelled';
    }

    // ✅ Method untuk cek konfirmasi user
    public function isConfirmedByUser($userId)
    {
        if ($this->requester_id === $userId) {
            return $this->requester_confirmed;
        }
        if ($this->receiver_id === $userId) {
            return $this->receiver_confirmed;
        }
        return false;
    }

    // ✅ Method untuk konfirmasi oleh user
    public function confirmByUser($userId)
    {
        if ($this->requester_id === $userId) {
            $this->update(['requester_confirmed' => true]);
        } elseif ($this->receiver_id === $userId) {
            $this->update(['receiver_confirmed' => true]);
        }
        
        return $this->refresh();
    }
}