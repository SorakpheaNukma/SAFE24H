<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

use Illuminate\Support\Facades\Route;

class MyMiddleWareNavigation
{
    public function handle(Request $request, Closure $next)
    {
        // Fetch the token from session
        $token = session('token');

        // If token is empty, redirect to commons.welcome
        if ($token == null) {
            // Check if the current route is not 'commons.welcome'
            if (!Route::is('commons.welcome')) {
                return redirect()->route('commons.welcome');
            }
        } else {
            try {
                $user = JWTAuth::setToken($token)->authenticate();
                $payload = JWTAuth::getPayload($token);
                $expiration = $payload->get('exp');
                $expiredTime = Carbon::createFromTimestamp($expiration);
                $now = Carbon::now();

                // Check if user exists and token is valid
                if ($user) {
                    if ($now->greaterThan($expiredTime)) {
                        // Redirect to commons.welcome if token has expired
                        return redirect()->route('commons.welcome');
                    }

                    // Redirect based on user role
                    if ($user->user_role === 'admin') {
                        return redirect()->route('admin.home_dashboard');
                    } elseif ($user->user_role === 'user') {
                        return redirect()->route('client.home_page');
                    }
                }
            } catch (\Exception $e) {
                if (!Route::is('commons.welcome')) {
                    return redirect()->route('commons.welcome');
                }
            }
        }

        // Allow the request to proceed if no redirects are necessary
        return $next($request);
    }
}
