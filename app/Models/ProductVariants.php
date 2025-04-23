<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariants extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'size',
        'quantity',
        'sold',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'variant_id');   
    }
    public function product_image()
    {
        return $this->hasMany(ProductImages::class, 'product_id', 'product_id')
        ->withDefault(); // Tránh lỗi nếu không có hình ảnh
    }
}
