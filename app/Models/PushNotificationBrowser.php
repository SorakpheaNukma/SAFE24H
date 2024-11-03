<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PushNotificationBrowser extends Model
{
    use HasFactory;
    protected $fillable = [
        'subscriptions' => 'array',
    ];
}
