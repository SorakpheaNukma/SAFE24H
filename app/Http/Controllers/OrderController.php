<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Events\MessageSent;
use App\Models\ProductVariants;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function getAllOrders()
    {
        try {
            $orders = Order::with([
                'users', 
                'orderItems.variant.product.product_images',
                'orderItems.variant.product.category'
            ])->get();

            $orders->each(function ($order) {
                // Kiểm tra nếu có order_items
                if ($order->order_items) {
                    $order->order_items->each(function ($item) {
                        // Lấy thông tin sản phẩm và ảnh của sản phẩm
                        $variant = $item->variant;
                        $product = $variant && $variant->product ? $variant->product : null;
    
                        // Thêm trường product_name và product_image vào mỗi item
                        $item->product_name = $product ? $product->product_name : null;
                        $item->product_image = $product && $product->product_images->isNotEmpty()
                            ? $product->product_images->first()->image_path
                            : null;
                        
                        
                        $item->category_name = $product && $product->category ? $product->category->category_name : null;
                        // Loại bỏ quan hệ 'product' khỏi biến variant
                        if ($variant) {
                            $variant->setRelation('product', null);
                        }
                    });
                }
            });
            return response()->json([
                'status' => 200,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to get orders: ' . $e->getMessage()
            ], 500);
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
                // 'orderItems.variant',
                'orderItems.variant.product.product_images',
                'users'
            ])->where('user_id', $user->user_id)->get();

            $orders = $orders->map(function ($order) {
                $orderItems = $order->orderItems->map(function ($item) {
                    $variant = $item->variant; // ✅ trước tiên lấy variant
                    $product = $variant ? $variant->product : null; // ✅ sau đó lấy product từ variant
                    $productImage = $product && $product->product_images->isNotEmpty()
                            ? url('/uploads/products/' . $product->product_images->first()->image_path)
                            : url('/default.jpg');

                    return [
                        'product_id' => $product->product_id ?? null, // ✅ Thêm dòng này
                        'product_name' => $product->product_name ?? 'No name',
                        'image_path' => $productImage,
                        'price' => $item->price,
                        'quantity' => $item->quantity,
                        'size' => $variant->size ?? '', // 👈 thêm size vào đây luôn
                    ];
                });

                return [
                    'order_id' => $order->order_id,
                    'order_date' => $order->order_date,
                    'total_amount' => $order->total_amount,
                    'shipping_fee' => $order->shipping_fee ?? 0,
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

    public function createOrders(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,user_id',
            'total_amount' => 'required|numeric',
            'shipping_fee' => 'required|numeric',
            'status' => 'required|string|in:processing,shipped,delivered',
            'order_date' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $order = new Order();
            $order->user_id = $request->user_id;
            $order->total_amount = $request->total_amount;
            $order->shipping_fee = $request->shipping_fee;
            $order->status = $request->status;
            $order->order_date = $request->order_date;
            $order->save();

            $user = User::find($request->user_id);
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            $msg = [
                'users' => $user,
                'order' => $order,
            ];

            // Broadcast the message to Pusher
            broadcast(new MessageSent($msg));

            return response()->json([
                'status' => 200,
                'message' => 'Order created successfully',
                'users' => $user,
                'data' => $order,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create order' . $e->getMessage()], 500);
        }
    }

    public function getOrderById($id)
    {
        try {
            $order = Order::findOrFail($id);
            return response()->json([
                'status' => 200,
                'data' => $order
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Order not found'], 404);
        }
    }

    // Update an existing order
    public function updateOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'nullable|string',
            'order_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $order = Order::findOrFail($request->order_id);
            $order->total_amount = $request->total_amount ?? $order->total_amount;
            $order->status = $request->status ?? $order->status;
            $order->order_date = $request->order_date ?? $order->order_date;
            $order->save();

            return response()->json([
                'status' => 200,
                'message' => 'Order updated successfully',
                'data' => $order
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update order' . $e->getMessage()], 500);
        }
    }

    // Delete an order
    public function deleteOrder(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'order_id' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $order = Order::findOrFail($request->order_id);
            $order->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Order deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete order' . $e->getMessage()], 500);
        }
    }

    public function cancel($id)
    {
        $order = Order::with('orderItems')->find($id);

        if (!$order) {
            return response()->json(['message' => 'Đơn hàng không tồn tại.'], 404);
        }

        if ($order->status === 'cancelled' || $order->status === 'delivered') {
            return response()->json(['message' => 'Đơn hàng không thể huỷ.'], 400);
        }

        // Hoàn lại số lượng vào kho
        foreach ($order->orderItems as $item) {
            $variant = ProductVariants::find($item->variant_id); // hoặc $item->variant nếu bạn dùng quan hệ
            if ($variant) {
                $variant->quantity += $item->quantity;
                $variant->sold -= $item->quantity;
                $variant->save();
            }
        }

        $order->status = 'cancelled';
        $order->save();

        return response()->json(['message' => 'Đơn hàng đã được huỷ.']);
}







    
}