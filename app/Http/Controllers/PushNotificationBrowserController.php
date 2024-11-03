<?php

namespace App\Http\Controllers;

use App\Models\PushNotificationBrowser;
use Illuminate\Http\Request;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class PushNotificationBrowserController extends Controller
{
    public function sendNotification(Request $request)
    {
        try {
            $auth = [
                'VAPID' => [
                    'subject' => 'https://honeydew-herring-622934.hostingersite.com/', // can be a mailto: or your website address
                    'publicKey' => env('PUSH_NOTIFICATION_PUBLIC_KEY'),
                    'privateKey' => env('PUSH_NOTIFICATION_PRIVATE_KEY'),
                ],
            ];
            $webPush = new WebPush($auth);

            $payload = json_encode([
                'title' => $request->title,
                'body' => $request->body,
                'url' => $request->url, // this url you want when click on navigation to what you want!
            ]);

            // Fetch all stored notifications
            $notifications = PushNotificationBrowser::all();

            foreach ($notifications as $notification) {
                // Decode the stored subscription JSON string
                $subscriptionData = json_decode($notification->subscriptions, true);

                if (is_array($subscriptionData)) {
                    $webPush->sendOneNotification(
                        Subscription::create($subscriptionData),
                        $payload,
                        ['TTL' => 5000]
                    );
                } else {
                    return response()->json(['error' => 'Invalid subscription format'], 400);
                }
            }

            return response()->json(['message' => 'Notification sent successfully'], 200);
        } catch (\Exception $e) {
            // Handle exception here
            return response()->json(['error' => 'Failed to send notification' + $e->getMessage()], 500);
        }
    }


    public function saveSubscription(Request $request)
    {
        $items = new PushNotificationBrowser();
        $items->subscriptions = $request->sub; // Store raw JSON
        $items->save();

        return response()->json(['message' => 'added successfully'], 200);
    }
}
