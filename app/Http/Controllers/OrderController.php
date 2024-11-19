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
            // Fetch all orders with related data
            $orders = Order::with(['users', 'payment', 'orderItems.product.product_image', 'orderItems.product.category'])->get();

            return response()->json([
                'status' => 200,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get orders' . $e->getMessage()], 500);
        }
    }

    public function getOrdersCurrentLogin()
    {
        try {
            $user = auth()->user();

            if (!$user) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            // Fetch all orders related to the authenticated user
            $orders = Order::with(['payment', 'orderItems.product.product_image'])
                ->where('user_id', $user->user_id)
                ->get();

            return response()->json([
                'status' => 200,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get orders: ' . $e->getMessage()], 500);
        }
    }


    public function createOrders(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,user_id',
            'total_amount' => 'required|numeric',
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
}
