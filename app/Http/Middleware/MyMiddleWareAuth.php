<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Route;

class MyMiddleWareAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = session('token');

        // call jwt authentication
        $this->jwtValidate($token);

        // just check if user is logged in or not 
        // if logged in ok otherwise redirect
        if (Auth::check()) {
            return $next($request);
        } else {
            // Redirect to other page
            return redirect()->route('commons.welcome');
        }
    }

    public function jwtValidate($token)
    {
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
            // If token is invalid or missing
            return redirect()->route('commons.welcome');
        }
    }
}
