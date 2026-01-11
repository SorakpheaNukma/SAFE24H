<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Event extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'from_date', 'to_date', 'discount'];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'event_product', 'event_id', 'product_id');
    }
    public function getIsActiveAttribute()
    {
        $now = Carbon::now();
        return $this->from_date <= $now && $now <= $this->to_date;
    }
}
