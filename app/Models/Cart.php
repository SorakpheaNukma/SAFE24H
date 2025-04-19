<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'product_id', 'quantity'];

    // Define the relationship back to the User model
    // belongsTO means current model is child of parent
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // Optionally, you might want to define a relationship to Product model as well
    public function product()
    {
        // return $this->belongsTo(Product::class, foreignKey: 'product_id', 'product_id')
        return $this->belongsTo(Product::class, 'product_id')->with('product_image');
    }
    public function variant()
    {
        return $this->belongsTo(ProductVariants::class, 'variant_id');
    }

}
