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

    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'phone' => 'required|string|max:20',
        'email' => 'required|email|max:255',
        'profile-image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $user->username = $request->input('name');
    $user->phone_number = $request->input('phone');
    $user->email = $request->input('email');

    if ($request->hasFile('profile-image')) {
        $image = $request->file('profile-image');
        $imageName = time().'_'.$image->getClientOriginalName();
        $image->move(public_path('uploads/profile'), $imageName);

        $user->profile_image = 'uploads/profile/' . $imageName;
    }

    $user->save();

    return response()->json(['message' => 'Cập nhật thành công!']);
}
}
