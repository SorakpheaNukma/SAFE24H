<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;


class ProfileController extends Controller
{
    public function updateInfo(Request $request)
    {
        $user = Auth::user();
        if (!Auth::check()) {
            return response()->json(['message' => 'Not logged in'], 401);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'user_profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->username = $request->input('name');
        $user->phone_number = $request->input('phone');
        $user->email = $request->input('email');

        if ($request->hasFile('user_profile')) {
            $image = $request->file('user_profile');
            $imageName = time().'_'.$image->getClientOriginalName();
            $image->move(public_path('uploads/profile'), $imageName);

            $user->user_profile = 'uploads/profile/' . $imageName;

        }

        $user->save();

            return response()->json([
            'message' => 'Cập nhật thành công!',
            'username' => $user->username,
            'phone_number' => $user->phone_number,
            'email' => $user->email,
            'profile_image' => $user->user_profile, // nếu cần dùng
        ]);

    }
    public function getUserInfo()
    {
        $user = Auth::user(); // Middleware đã đảm bảo user đã đăng nhập
    
        return response()->json([
            'username' => $user->username,
            'user_profile' => $user->user_profile,
        ]);
    }
    
}
