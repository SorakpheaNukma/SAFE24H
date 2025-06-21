<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Order; // Order model

class PaymentController extends Controller
{
    public function initiatePayment(Request $request)
    {
        $orderId = $request->input('order_id');
        $paymentMethodType = $request->input('payment_method_type');
        $amount = $request->input('amount');

        $merchantId = env('PAYWAY_MERCHANT_ID');
        $apiKey = env('PAYWAY_API_KEY');
        $paywayPurchaseUrl = env('PAYWAY_API_URL');

        $reqTime = now()->format('YmdHis');
        $currency = 'USD';

        $paymentOption = '';
        $returnDeeplink = '';
        $viewType = 'popup';

        switch ($paymentMethodType) {
            case 'abapay':
                $paymentOption = 'abapay';
                break;
            case 'khqr':
                $paymentOption = 'abapay_khqr';
                break;
            default:
                $paymentOption = '';
                break;
        }

        $returnUrl = route('payway.callback');
        $cancelUrl = route('checkout.cancel', ['order_id' => $orderId]);
        $continueSuccessUrl = route('checkout.success', ['order_id' => $orderId]);

        $items = ''; // base64_encode(json_encode([...]))
        $shipping = 0;
        $firstname = '';
        $lastname = '';
        $email = '';
        $phone = '';
        $type = 'purchase';
        $customFields = '';
        $returnParams = '';
        $payout = '';
        $lifetime = '';
        $additionalParams = '';
        $googlePayToken = '';

        $stringToHash = $reqTime . $merchantId . $orderId . $amount .
            $items . $shipping . $firstname . $lastname . $email . $phone . $type .
            $paymentOption . $returnUrl . $cancelUrl . $continueSuccessUrl . $returnDeeplink .
            $currency . $customFields . $returnParams . $payout . $lifetime . $additionalParams . $googlePayToken;

        $hash = base64_encode(hash_hmac('sha512', $stringToHash, $apiKey, true));

        // Payload
        $payload = [
            ['name' => 'merchant_id', 'contents' => $merchantId],
            ['name' => 'tran_id', 'contents' => $orderId],
            ['name' => 'amount', 'contents' => $amount],
            ['name' => 'currency', 'contents' => $currency],
            ['name' => 'payment_option', 'contents' => $paymentOption],
            ['name' => 'items', 'contents' => $items],
            ['name' => 'shipping', 'contents' => $shipping],
            ['name' => 'firstname', 'contents' => $firstname],
            ['name' => 'lastname', 'contents' => $lastname],
            ['name' => 'email', 'contents' => $email],
            ['name' => 'phone', 'contents' => $phone],
            ['name' => 'type', 'contents' => $type],
            ['name' => 'return_url', 'contents' => $returnUrl],
            ['name' => 'cancel_url', 'contents' => $cancelUrl],
            ['name' => 'continue_success_url', 'contents' => $continueSuccessUrl],
            ['name' => 'return_deeplink_url', 'contents' => $returnDeeplink],
            ['name' => 'custom_fields', 'contents' => $customFields],
            ['name' => 'return_params', 'contents' => $returnParams],
            ['name' => 'payout', 'contents' => $payout],
            ['name' => 'additional_params', 'contents' => $additionalParams],
            ['name' => 'lifetime', 'contents' => $lifetime],
            ['name' => 'google_pay_token', 'contents' => $googlePayToken],
            ['name' => 'hash', 'contents' => $hash],
        ];

        // Filter out empty values except shipping = 0
        $payload = array_filter($payload, function ($item) {
            if ($item['name'] === 'shipping' && $item['contents'] === 0) {
                return true;
            }
            return $item['contents'] !== '' && $item['contents'] !== null;
        });

        try {
            $response = Http::asMultipart()->post($paywayPurchaseUrl, $payload);

            if ($response->successful()) {
                $responseData = $response->json();
                $contentType = $response->header('Content-Type');

                if (str_contains($contentType, 'text/html')) {
                    return response()->json(['status' => 200, 'redirect_url' => $response->effectiveUri()]);
                } elseif (str_contains($contentType, 'application/json')) {
                    if (isset($responseData['qr_image_url'])) {
                        return response()->json(['status' => 200, 'qr_image_url' => $responseData['qr_image_url']]);
                    } elseif (isset($responseData['deeplink'])) {
                        return response()->json(['status' => 200, 'deeplink' => $responseData['deeplink']]);
                    }
                    return response()->json(['status' => 200, 'data' => $responseData]);
                } else {
                    return response()->json(['status' => 500, 'message' => 'Unexpected Payway response type.']);
                }
            } else {
                Log::error('Payway API Error: ' . $response->status() . ' - ' . $response->body());
                return response()->json(['status' => $response->status(), 'message' => 'Failed to initiate payment with Payway. Error: ' . $response->body()]);
            }
        } catch (\Exception $e) {
            Log::error('Payway Integration Exception: ' . $e->getMessage());
            return response()->json(['status' => 500, 'message' => 'An error occurred during payment initiation. Exception: ' . $e->getMessage()]);
        }
    }

    public function handleWebhook(Request $request)
    {
        Log::info('Payway Webhook Received:', $request->all());

        $data = $request->json()->all();

        $paywayStatus = $data['status'] ?? null;
        $paywayTranId = $data['tran_id'] ?? null;
        $merchantRef = $data['merchant_ref'] ?? null;

        if ($paywayStatus === 0 && $merchantRef) {
            $order = Order::where('id', $merchantRef)->first();

            if ($order) {
                $order->status = 'completed';
                $order->payment_transaction_id = $paywayTranId;
                $order->payment_details = json_encode($data);
                $order->save();

                Log::info("Order {$order->id} payment confirmed via Payway webhook.");
                return response()->json(['status' => 'success', 'message' => 'Webhook processed.']);
            } else {
                Log::warning("Payway Webhook: Order ID {$merchantRef} not found.");
                return response()->json(['status' => 'error', 'message' => 'Order not found.'], 404);
            }
        } else {
            Log::warning("Payway Webhook: Payment status not successful for tran_id {$paywayTranId}.", $data);
            $order = Order::where('id', $merchantRef)->first();
            if ($order) {
                $order->status = 'failed_payment';
                $order->payment_details = json_encode($data);
                $order->save();
            }
            return response()->json(['status' => 'ignored', 'message' => 'Payment not successful or already handled.']);
        }
    }
}
