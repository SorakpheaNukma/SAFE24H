<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Events\MessageSent;

class OrderController extends Controller
{
    public function getAllOrders()
    {
        try { 
            $orders = Order::with([
                'users', 
                'payment', 
                'orderItems.product.product_images', 
                'orderItems.variant',
                'orderItems.product.category'
            ])->get();

            return response()->json([
                'status' => 200,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get orders: ' . $e->getMessage()], 500);
        }
    }

    public function getOrdersCurrentLogin()
    {
        try {
            $user = auth()->user();

            if (!$user) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            $orders = Order::with([
                'orderItems.variant',
                'orderItems.product.product_images',
                'users'
            ])->where('user_id', $user->user_id)->get();

            $orders = $orders->map(function ($order) {
                $orderItems = $order->orderItems->map(function ($item) {
                    $product = $item->product;
                    $productImage = $product && $product->product_images->isNotEmpty()
                        ? url('/uploads/products/' . $product->product_images->first()->image_path)
                        : url('/default.jpg');

                    return [
                        'product_name' => $product->product_name ?? 'No name',
                        'image_path' => $productImage,
                        'price' => $item->price,
                        'quantity' => $item->quantity,
                    ];
                });

                return [
                    'order_id' => $order->order_id,
                    'order_date' => $order->order_date,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'order_items' => $orderItems,
                ];
            });

            return response()->json([
                'status' => 200,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get orders: ' . $e->getMessage()], 500);
        }
    }

    public function getOrderDetails($orderId)
    {
        try {
            $order = Order::with(['orderItems.product.product_images'])
                ->where('order_id', $orderId)
                ->firstOrFail();

            $orderItems = $order->orderItems->map(function ($item) {
                $product = $item->product;
                $productImage = $product && $product->product_images->isNotEmpty()
                    ? url('/uploads/products/' . $product->product_images->first()->image_path)
                    : url('/default.jpg');

                return [
                    'product_name' => $product->product_name ?? 'No name',
                    'image_path' => $productImage,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                ];
            });

            return response()->json([
                'status' => 200,
                'data' => [
                    'order_id' => $order->order_id,
                    'order_date' => $order->order_date,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'order_items' => $orderItems,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get order details: ' . $e->getMessage()], 500);
        }
    }
}