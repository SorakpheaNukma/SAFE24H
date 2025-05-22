<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class ABAController extends Controller
{
public function redirectToAba(Request $request)
{
    $orderId = $request->query('order_id');
    $order = Order::find($orderId);

    if (!$order) {
        return redirect()->back()->with('error', 'Đơn hàng không tồn tại.');
    }

    $merchantId  = config('services.aba.merchant_id');
    $apiUrl      = config('services.aba.api_url'); // URL ABA sandbox/live
    $privateKey = file_get_contents(storage_path('app/private.pem'));
    $returnUrl   = config('services.aba.return_url');
    $cancelUrl   = config('services.aba.cancel_url');
    $clientIp    = $request->ip();

    $transactionId = 'TXN' . $order->id . time();
    $timestamp = now()->format('YmdHis');

    $data = [
        'merchant_id'    => $merchantId,
        'order_id'       => $order->id,
        'amount'         => number_format($order->total_price, 2, '.', ''),
        'description'    => "Thanh toán đơn hàng #" . $order->id,
        'transaction_id' => $transactionId,
        'timestamp'      => $timestamp,
        'return_url'     => $returnUrl,
        'cancel_url'     => $cancelUrl,
        'client_ip'      => $clientIp,
    ];

    // Tạo chuỗi ký
    $signatureString = implode('', [
        $data['merchant_id'],
        $data['order_id'],
        $data['amount'],
        $data['description'],
        $data['transaction_id'],
        $data['timestamp'],
        $data['return_url'],
        $data['cancel_url'],
        $data['client_ip'],
    ]);

    openssl_sign($signatureString, $signature, $privateKey, OPENSSL_ALGO_SHA256);
    $data['hash'] = base64_encode($signature);

    return view('aba.redirect', [
        'data'   => $data,
        'apiUrl' => $apiUrl,
    ]);
}


    public function callback(Request $request)
    {
        $data = $request->all();

        if (!isset($data['hash'])) {
            return response('Hash missing', 400);
        }

        $publicKey = file_get_contents(storage_path('app/aba_public.pem'));
        $hash = base64_decode($data['hash']);
        unset($data['hash']);

        // Tạo lại chuỗi ký theo đúng thứ tự như ABA yêu cầu
        $signatureString = $data['merchant_id']
                         . $data['order_id']
                         . $data['amount']
                         . $data['description']
                         . $data['transaction_id']
                         . $data['timestamp']
                         . $data['status']
                         . $data['message']
                         . $data['approval_code']
                         . $data['rrn']
                         . $data['client_ip'];

        $verified = openssl_verify($signatureString, $hash, $publicKey, OPENSSL_ALGO_SHA256);

        if ($verified === 1) {
            // Lưu thông tin giao dịch thành công
            return response('OK', 200);
        }

        return response('Invalid signature', 400);
    }

    public function paymentSuccess()
    {
        return view('aba.success');
    }

    public function paymentCancel()
    {
        return view('aba.cancel');
    }
}
