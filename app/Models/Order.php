<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $primaryKey = 'order_id';

    protected $fillable = [
        'user_id',
        'total_amount',
        'status',
        'order_date',
    ];

    protected $casts = [
        'order_date' => 'datetime',
    ];

    /**
     * Define the relationship between Order and users models.
     * 
     * belongsTo mean current model is a child
     */
    public function users()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Define the relationship with the Payment model.
     * An order has one payment.
     * 
     * hasOne means that each order can have exactly one payment associated with it.
     */
    public function payment()
    {
        return $this->hasOne(Payment::class, 'order_id');
    }

    // Define relationship with OrderItem
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'order_id');
    }
}
