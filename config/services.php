<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],
    'aba' => [
        'merchant_id' => env('ec460301'),
        'api_key' => env('dc189a49ddb3194366f7b25a2163ab5e1c946550'),
        'api_url' => env('https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase'),
        'private_key_path' => env('ABA_PRIVATE_KEY_PATH', 'storage/app/private.pem'),
        'public_key_path' => env('ABA_PUBLIC_KEY_PATH', 'storage/app/aba_public.pem'),
        'return_url' => env('ABA_RETURN_URL'),
        'cancel_url' => env('ABA_CANCEL_URL'),
    ],
];
