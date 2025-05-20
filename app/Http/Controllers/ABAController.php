<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class ABAController extends Controller
{
    public function createPayment()
    {
        $merchantId = config('services.aba.merchant_id');
        $apiUrl = config('services.aba.api_url');
        $privateKey = file_get_contents(config('services.aba.private_key_path'));

        $orderId = 'ORDER-' . time(); // Tạo mã đơn hàng ngẫu nhiên
        $amount = 10.00; // Đơn giá, có thể lấy từ giỏ hàng
        $description = "Thanh toán đơn hàng $orderId";
        $timestamp = now()->format('YmdHis');

        $data = [
            'merchant_id' => $merchantId,
            'order_id' => $orderId,
            'amount' => number_format($amount, 2, '.', ''),
            'description' => $description,
            'transaction_id' => uniqid(),
            'timestamp' => $timestamp,
        ];

        // Tạo chuỗi dữ liệu để ký
        $rawData = implode('', $data);

        // Ký bằng private key
        openssl_sign($rawData, $signature, $privateKey, OPENSSL_ALGO_SHA256);
        $data['hash'] = base64_encode($signature);

        // Gửi request đến ABA (có thể redirect hoặc dùng cURL nếu cần form)
        return view('aba.redirect', ['data' => $data, 'apiUrl' => $apiUrl]);
    }
    public function callback(Request $request)
{
    $data = $request->all();
    $publicKey = file_get_contents(config('services.aba.public_key_path'));

    $hash = base64_decode($data['hash']);
    unset($data['hash']);

    $rawData = implode('', $data);

    $verified = openssl_verify($rawData, $hash, $publicKey, OPENSSL_ALGO_SHA256);

    if ($verified === 1) {
        // ✅ Thành công
        return response('OK', 200);
    } else {
        // ❌ Sai chữ ký
        return response('Invalid signature', 400);
    }
}

}
