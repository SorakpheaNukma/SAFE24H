<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Route;

class MyAdminMiddleware
{
    public function handle($request, Closure $next)
{
    $token = session('token');

    if (!$token) {
        return redirect()->route('commons.welcome');
    }

    try {
        // Nếu payload đã có trong session thì dùng lại
        if (!session()->has('user_payload')) {
            $user = JWTAuth::setToken($token)->authenticate();
            $payload = JWTAuth::getPayload($token);
            session([
                'user_payload' => $payload,
                'user_id' => $user->id,
                'user_role' => $user->user_role
            ]);
        } else {
            // Lấy thông tin từ session
            $payload = session('user_payload');
        }

        $expiration = $payload->get('exp');
        $expiredTime = Carbon::createFromTimestamp($expiration);
        $now = Carbon::now();
        $diffInHours = $now->diffInHours($expiredTime, false);

        if ($diffInHours <= 0) {
            session()->forget(['token', 'user_payload', 'user_id', 'user_role']);
            return redirect()->route('commons.welcome');
        }

    } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
        session()->forget(['token', 'user_payload', 'user_id', 'user_role']);
        return redirect()->route('commons.welcome');
    }

    // Dùng session thay cho Auth::check() để tránh gọi DB nữa
    if (session('user_role') === 'admin') {
        return $next($request);
    } else {
        session()->forget(['token', 'user_payload', 'user_id', 'user_role']);
        return redirect()->route('commons.welcome');
    }
}

}
