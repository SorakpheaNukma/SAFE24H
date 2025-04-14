<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BannerImage extends Model
{
    use HasFactory;

    // Nếu tên bảng không phải là 'banner_images', bạn có thể định nghĩa lại như sau:
    protected $table = 'banner_images';

    // Các cột trong bảng mà bạn muốn thao tác
    protected $fillable = ['image_path'];
}
