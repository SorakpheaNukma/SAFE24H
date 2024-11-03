<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvalidatedToken extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_tk';
    protected $fillable = [
        'access_tk',
        'expired_tk',
    ];

    protected $hidden = [];

    protected $casts = [
        'expired_tk' => 'datetime',
    ];
}
