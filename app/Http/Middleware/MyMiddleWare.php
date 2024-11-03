<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

class MyMiddleWare
{
    public function handle($request, Closure $next)
    {
        $token = session('token');

        if ($token != null) {
            try {
                $user = JWTAuth::setToken($token)->authenticate();

                $payload = JWTAuth::getPayload($token);
                $expiration = $payload->get('exp');
                $expiredTime = Carbon::createFromTimestamp($expiration);
                $now = Carbon::now();
                $diffInHours = $now->diffInHours($expiredTime, false);

                if ($user && $user->user_role === 'admin') {
                    if ($diffInHours > 24) {
                        return $next($request);
                    } else {
                        return redirect()->route('commons.welcome');
                    }
                } else if ($user && $user->user_role === 'user') {
                    if ($diffInHours > 24) {
                        return $next($request);
                    } else {
                        return redirect()->route('commons.welcome');
                    }
                } else {
                    return redirect()->route('commons.welcome');
                }
            } catch (\Exception $e) {
                return redirect()->route('commons.welcome');
            }
        }

        return redirect()->route('commons.welcome');
    }

}
