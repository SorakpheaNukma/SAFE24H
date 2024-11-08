<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Route;

class MyUserMiddleware
{
    public function handle($request, Closure $next)
    {
        // Retrieve token from session
        $token = session('token');

        // If no token, redirect to welcome page
        if (!$token) {
            return redirect()->route('commons.welcome');
        }

        try {
            // Attempt to authenticate using the token
            JWTAuth::setToken($token)->authenticate();
            $payload = JWTAuth::getPayload($token);
            $expiration = $payload->get('exp');
            $expiredTime = Carbon::createFromTimestamp($expiration);
            $now = Carbon::now();
            $diffInHours = $now->diffInHours($expiredTime, false);

            // If the token expires in less than 24 hours,
            if ($diffInHours <= 24) {
                return redirect()->route('commons.welcome');
            }
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            // remove old session
            session()->forget('token');
            // If token is invalid or missing
            return redirect()->route('commons.welcome');
        }

        // Check if the user is authenticated and has a valid role
        if (Auth::check()) {
            if (Auth::user()->user_role == 'user') {
                return $next($request);
            } else {
                // remove old session
                session()->forget('token');
                return redirect()->route('commons.welcome');
            }
        } else {
            // If not authenticated, logout and redirect to welcome page
            Auth::logout();
            // remove old session
            session()->forget('token');
            return redirect()->route('commons.welcome');
        }
    }
}
