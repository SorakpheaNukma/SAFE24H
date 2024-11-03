<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class SignUpController extends Controller
{
    public function showSignUpForm()
    {
        return view('commons.sign_up');
    }

    public function signUp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:5',
            'password_confirmation' => 'required|string|same:password',
            'phone' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone_number' => $request->phone,
                'user_role' => "user",
            ]);

            return response()->json(['message' => 'Sign up successful🎉'], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['errors' => ['error' => 'Could not create user']], 500);
        }
    }

}
