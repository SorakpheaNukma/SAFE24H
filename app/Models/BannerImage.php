<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BannerImage extends Model
{
    use HasFactory;

    protected $table = 'banner_images';
        // 👇 Đây là phần quan trọng
        protected $primaryKey = 'banner_images_id';
        public $incrementing = true;
        protected $keyType = 'int';

    protected $fillable = ['image_path'];

    public $timestamps = false; 
}
