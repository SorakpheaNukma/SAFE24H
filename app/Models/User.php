<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'username',
        'email',
        'password',
        'user_profile',
        'phone_number',
        'user_role',
    ];

    protected $hidden = [
        'password',
    ];

    // Define the relationship with the Cart model
    public function carts()
    {
        return $this->hasMany(Cart::class, 'user_id', 'user_id');
    }

    // Define the relationship with the Order model
    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id', 'user_id');
    }


    /**
     * Get the identifier that will be stored in the JWT subject claim.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey(); // Return the primary key
    }

    /**
     * Return a key-value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return []; // No custom claims, return an empty array
    }
}
