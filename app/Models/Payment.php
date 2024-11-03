<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $primaryKey = 'payment_id';

    protected $fillable = [
        'order_id',
        'cash_on_delivery',
        'total_amount_paid',
    ];

    /**
     * Define the relationship between Payment and Order model.
     * A payment belongs to an order.
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
