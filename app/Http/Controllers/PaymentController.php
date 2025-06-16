<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function createPayment(Request $request)
    {
        $tranId = $request->input('tran_id');
        $amount = $request->input('amount');

        $payload = [
            'merchant_id'  => env('ABA_MERCHANT_ID'),
            'tran_id'      => $tranId,
            'amount'       => $amount,
            'currency'     => 'USD',
            'order'        => 'Order #' . $tranId,
            'return_url'   => url('/payment-success'),
            'cancel_url'   => url('/payment-cancel'),
            'callback_url' => url('/payment-callback'),
            'req_time'     => now()->timestamp,
        ];

        ksort($payload); // 🔐 ABA yêu cầu sắp xếp alphabetically

        $dataToSign = json_encode($payload, JSON_UNESCAPED_SLASHES);
        $privateKeyPath = base_path(env('ABA_PRIVATE_KEY_PATH'));
        $privateKey     = openssl_pkey_get_private(file_get_contents($privateKeyPath));
        if (!$privateKey) {
            Log::error("❌ Không thể đọc khóa riêng tư từ: $privateKeyPath");
            return response()->json(['success' => false, 'message' => 'Không thể đọc khóa riêng tư']);
        }

        openssl_sign($dataToSign, $signature, $privateKey, OPENSSL_ALGO_SHA256);
        $base64Signature = base64_encode($signature);

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-Signature' => $base64Signature,
        ])->post(env('ABA_API_URL'), $payload);

        if ($response->successful()) {
            $data = $response->json();

            $qrImage = $data['data']['qrCode']
                ?? $data['data']['qr_code']
                ?? $data['data']['qr_url']
                ?? $data['data']['invoice_url']
                ?? null;


            return response()->json([
                'success'   => true,
                'qr_image'  => $qrImage,
                'message'   => 'ABA QR Generated Successfully',
            ]);
        } else {
            Log::error('ABA Error:', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'ABA response error: ' . $response->body(),
            ], 500);
        }
    }

}
