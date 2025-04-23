<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $table = 'order_items';
    protected $primaryKey = 'item_id';
    protected $fillable = [
        'order_id',
        'product_id',
        'variant_id',
        'quantity',
        'price',
    ];

    // Define relationships
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
    
    public function variant()
    {
        return $this->belongsTo(ProductVariants::class, 'variant_id', 'id');
    }
}
