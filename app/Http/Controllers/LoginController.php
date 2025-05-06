<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\InvalidatedToken;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

use Illuminate\Support\Str;

use Carbon\Carbon;

class LoginController extends Controller
{
    public function showLoginForm()
    {
        return view('commons.login');
    }

    public function getAllUsers()
    {
        try {
            $users = User::all();

            return response()->json([
                'status' => 200,
                'data' => $users,
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['errors' => 'Error occurred while getting users' . $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['errors' => 'Invalid email or password!'], 402);
            }

            $user = Auth::user();
            Auth::login($user);
            session()->forget('token');
            session(['token' => $token]);

            // $sessionLifetime = config('session.lifetime');
            // $sessionLifetimeInHours = $sessionLifetime / 60;
            // $sessionLifetimeInDays = $sessionLifetimeInHours / 24;

            // Log::info('Session lifetime is ' . $sessionLifetime . ' minutes (' . $sessionLifetimeInDays . ' days)');

            $responseData = [
                'token' => $token,
                'user_role' => $user->user_role,
                'redirect_url' => $user->user_role === 'admin'
                    ? route('admin.home_dashboard')
                    : route('client.home_page'),
                'username' => $user->username,
                'user_id' => $user->user_id
            ];

            return response()->json($responseData, 200);

        } catch (JWTException $e) {
            // Log::error('Login failed: ' . $e->getMessage());
            return response()->json(['errors' => 'Could not create token'], 500);
        }
    }

    public function updateUserProfile(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Get the authenticated user
            $user = Auth::user();

            if ($request->hasFile('image')) {
                if ($user->user_profile) {
                    $oldImagePath = public_path($user->user_profile);
                    if (file_exists($oldImagePath)) {
                        @unlink($oldImagePath);
                    }
                }

                $image = $request->file('image');
                $uniqueName = Str::uuid()->toString() . '.' . $image->getClientOriginalExtension();
                $destinationPath = public_path('/uploads/users');
                $image->move($destinationPath, $uniqueName);

                $user->user_profile = 'uploads/users/' . $uniqueName;
            }

            $user->save();

            return response()->json(['user' => $user], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred', 'message' => $e->getMessage()], 500);
        }
    }

    //
    public function me()
    {
        try {
            $token = session('token');

            if (!$token) {
                return response()->json(['error' => 'unauthorized'], 401);
            }

            $user = JWTAuth::setToken($token)->authenticate();

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            return response()->json([
                'status' => 200,
                'data' => $user,
            ], 200);
        } catch (TokenExpiredException $e) {
            return response()->json(['error' => 'Token has expired', 'message' => $e->getMessage()], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['error' => 'Token is invalid', 'message' => $e->getMessage()], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Logout failed', 'message' => $e->getMessage()], 500);
        }
    }

    public function logout()
    {
        try {
            $token = session('token');
            session()->forget('token');

            if (!$token) {
                return response()->json(['error' => 'unauthorized'], 401);
            }

            $user = JWTAuth::setToken($token)->authenticate();
            $payload = JWTAuth::getPayload($token);
            $expiration = $payload->get('exp');
            $expiredTime = Carbon::createFromTimestamp($expiration);

            InvalidatedToken::where('expired_tk', '<', Carbon::now())->delete();

            if (InvalidatedToken::where('access_tk', $token)->exists()) {
                return response()->json(['error' => 'Token has already been invalidated'], 401);
            }

            if (Carbon::now()->greaterThan($expiredTime)) {
                return response()->json(['error' => 'Token has already expired'], 401);
            }

            InvalidatedToken::create([
                'access_tk' => $token,
                'expired_tk' => $expiredTime,
            ]);

            return response()->json([
                'redirect_url' => route('commons.welcome'),
                'message' => 'Successfully logged out'
            ], 200);
        } catch (TokenExpiredException $e) {
            return response()->json(['error' => 'Token has expired', 'message' => $e->getMessage()], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['error' => 'Token is invalid', 'message' => $e->getMessage()], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Logout failed', 'message' => $e->getMessage()], 500);
        }
    }


    // public function refresh()
    // {
    //     try {
    //         // current token
    //         $token = JWTAuth::getToken();
    //         $payload = JWTAuth::getPayload($token);

    //         // Convert Unix timestamp to Carbon datetime
    //         $expiredTime = Carbon::createFromTimestamp($payload->get('exp'));

    //         InvalidatedToken::create([
    //             'access_tk' => $token,
    //             'expired_tk' => $expiredTime,
    //         ]);

    //         $newToken = Auth::refresh();
    //         return response()->json(['token' => $newToken]);
    //     } catch (JWTException $e) {
    //         return response()->json(['error' => 'Could not refresh token', 'message' => $e->getMessage()], 500);
    //     }
    // }


    //
    public function tokenExpiry()
    {
        try {
            $token = session('token');

            if (!$token) {
                return response()->json(['errors' => 'unauthorized'], 401);
            }

            $user = JWTAuth::setToken($token)->authenticate();

            $payload = JWTAuth::getPayload($token);
            $expiration = $payload->get('exp');
            $expiredTime = Carbon::createFromTimestamp($expiration);
            $now = Carbon::now();
            $diffInHours = $now->diffInHours($expiredTime, false);

            if ($diffInHours > 24) {
                return response()->json([
                    'status' => true,
                    'message' => 'Token is valid for more than 24 hours',
                    'user' => $user,
                    'expires_in' => $diffInHours . ' hours'
                ], 200);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Token is valid for less than 24 hours',
                    'user' => $user,
                    'expires_in' => $diffInHours . ' hours'
                ], 200);
            }
        } catch (TokenExpiredException $e) {
            return response()->json(['errors' => 'Token has expired', 'message' => $e->getMessage()], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['errors' => 'Token is invalid', 'message' => $e->getMessage()], 401);
        } catch (\Exception $e) {
            return response()->json(['errors' => 'An error occurred', 'message' => $e->getMessage()], 500);
        }
    }



    // reset password
    public function resetPassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|exists:users,email',
                'new_password' => 'required|min:5',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json(['errors' => 'User not found'], 404);
            }

            $user->password = bcrypt($request->new_password);
            $user->save();

            return response()->json([
                'status' => 200,
                'message' => 'Password reset successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateUserAddress(Request $request)
    {
        try {
            $token = session('token');

            if (!$token) {
                return response()->json(['error' => 'unauthorized'], 401);
            }

            $user = JWTAuth::setToken($token)->authenticate();

            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            $validator = Validator::make($request->all(), [
                'address' => 'required|string|max:255',
                'country' => 'nullable|string',
                'more_address' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => 'Validation failed', 'message' => $validator->errors()], 422);
            }

            $user->address = $request->address;
            $user->country = $request->country;
            $user->more_address = $request->more_address;
            $user->save();


            return response()->json([
                'status' => 200,
                'data' => $user,
            ], 200);
        } catch (TokenExpiredException $e) {
            return response()->json(['error' => 'Token has expired', 'message' => $e->getMessage()], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['error' => 'Token is invalid', 'message' => $e->getMessage()], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Logout failed', 'message' => $e->getMessage()], 500);
        }
    }
}
