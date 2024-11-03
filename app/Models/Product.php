<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $primaryKey = 'product_id';
    protected $fillable = [
        'product_name',
        'product_price',
        'quantity',
        'des_1',
        'des_2',
        'des_3',
        'des_4',
        'des_5',
        'des_6',
        'des_7',
        'des_8',
        'des_9',
        'des_10',
        'des_11',
        'category_id',
    ];

    /**
     * Define a relationship between Product and Category.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }


    /**
     * Define a relationship between Product and Product images.
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function product_image()
    {
        return $this->hasMany(ProductImages::class, 'product_id');
    }

    // Define relationship with OrderItem
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'product_id', 'product_id');
    }
}