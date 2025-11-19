<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'category',
        'condition',
        'price',
        'image_url',
        'verified_by',
        'verified_at',
        'status',
        'verification_status',

        // Tambahan baru
        'allow_barter',
        'barter_preferences',
        'allow_trade_in',
        'trade_in_value',
        'trade_in_preferences',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'verified_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function bartersAsRequester()
    {
        return $this->hasMany(Barter::class, 'requester_product_id');
    }

    public function bartersAsReceiver()
    {
        return $this->hasMany(Barter::class, 'receiver_product_id');
    }

    public function tradeInsAsOld()
    {
        return $this->hasMany(TradeIn::class, 'old_product_id');
    }

    public function tradeInsAsNew()
    {
        return $this->hasMany(TradeIn::class, 'new_product_id');
    }

    public function verifications()
    {
        return $this->hasMany(Verification::class);
    }

    public function isVerified()
    {
        return $this->verification_status === self::STATUS_APPROVED;
    }

    public function makeAvailable()
    {
        $this->update(['status' => 'available']);
    }

    public function makeSold()
    {
        $this->update(['status' => 'sold']);
    }

    public function isPending()
    {
        return $this->verification_status === self::STATUS_PENDING;
    }

    public function isRejected()
    {
        return $this->verification_status === self::STATUS_REJECTED;
    }

    public function isAvailable()
    {
        return $this->status === 'available' && $this->isVerified();
    }

    // ===============================
    // Tambahan method baru
    // ===============================

    public function allowsBarter()
    {
        return $this->allow_barter && $this->isVerified() && $this->isAvailable();
    }

    public function allowsTradeIn()
    {
        return $this->allow_trade_in && $this->isVerified() && $this->isAvailable();
    }

    public function getTradeInValue()
    {
        return $this->trade_in_value ?? ($this->price * 0.7); // Default 70%
    }
}
