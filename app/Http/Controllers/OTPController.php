<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use App\Mail\SendOtpMail;
use Illuminate\Support\Facades\Mail;
use App\Models\User;

class OTPController extends Controller
{
    public function showOTPForm()
    {
        return view("commons.otp_page");
    }

    public function sendOtp(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|exists:users,email',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            // Generate a 6-digit OTP
            $otp = $this->generateOtp();

            // Save or update OTP and expiration time in the user table
            User::where('email', $request->email)->update([
                'otp' => $otp,
                'otp_expired_time' => now()->addMinutes(10) // Set expiration time to 10 minutes from now
            ]);

            // Send OTP to user's email
            Mail::to($request->email)->send(new SendOtpMail($otp));

            return response()->json([
                'status' => 200,
                'message' => 'OTP sent to email successfully. Please check your email'
            ], 200);
        } catch (\Exception $e) {
            return response()->json('error' . $e->getMessage(), 500);
        }
    }

    public function verifyOTP(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|exists:users,email',
                'otp' => 'required|numeric|digits:6',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            $email = $request->email;
            $otp = $request->otp;

            $user = User::where('email', $email)->first();

            // Check if the user exists and the OTP matches
            if ($user) {
                // Check if the OTP is correct
                if ($user->otp == $otp) {
                    // Check if the OTP has expired
                    if ($user->otp_expired_time && now()->isBefore($user->otp_expired_time)) {

                        return response()->json([
                            'status' => 200,
                            'message' => 'OTP verified successfully'
                        ], 200);
                    } else {
                        return response()->json(['error' => 'OTP has expired. Please request a new one.'], 401);
                    }
                } else {
                    // If OTP doesn't match
                    return response()->json(['error' => 'Invalid OTP. Please try again.'], 401);
                }
            } else {
                // User not found
                return response()->json(['error' => 'User not found.'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }



    private function generateOtp()
    {
        return rand(100000, 999999);
    }

    private function storeOtp($email, $otp)
    {
        // OTP valid for 10 minutes
        Cache::put('otp_' . $email, $otp, now()->addMinutes(10));
    }
}
