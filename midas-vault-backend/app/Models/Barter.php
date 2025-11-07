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

    public function review()
    {
        return $this->hasOne(Review::class);
    }
}