<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderItemController extends Controller
{

    public function getAllOrderItems()
    {
        $OrderItem = OrderItem::with(['product', 'order', 'product.product_image'])->get();

        return response()->json([
            'status' => 200,
            'data' => $OrderItem
        ]);
    }

    public function getAllOrderUser()
    {
        $OrderItem = OrderItem::with(['product', 'order',])->get();

        return response()->json([
            'status' => 200,
            'data' => $OrderItem
        ]);
    }

    public function getItemsByOrderId($orderId)
    {
        $orderItems = OrderItem::where('order_id', $orderId)->with('product')->get();

        return response()->json([
            'status' => 200,
            'data' => $orderItems
        ]);
    }

    // Add a new order item
    public function addOrderItem(Request $request)
    {
        $items = $request->input('items');
        $createdItems = [];

        foreach ($items as $item) {
            $validatedData = Validator::make($item, [
                'order_id' => 'required|exists:orders,order_id',
                'product_id' => 'required|exists:products,product_id',
                'quantity' => 'required|integer|min:1',
                'price' => 'required',
            ])->validate();

            $createdItem = OrderItem::create($validatedData);

            // Load the product relation and only get the product name
            $createdItem->load('product');
            $productName = $createdItem->product->product_name;

            $createdItems[] = [
                'order_item' => $createdItem,
                'product_name' => $productName,
            ];
        }

        return response()->json([
            'status' => 200,
            'message' => 'Order items successfully added',
            'data' => $createdItems,
        ]);
    }


    // Update quantity or price of an order item
    public function updateOrderItem(Request $request)
    {
        $validatedData = $request->validate([
            'quantity' => 'nullable|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'id' => 'required',
        ]);

        $orderItem = OrderItem::findOrFail($request->id);
        $orderItem->update($validatedData);

        return response()->json([
            'status' => 200,
            'data' => $orderItem
        ]);
    }

    // Delete an order item
    public function deleteOrderItem(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 400, 'message' => 'Invalid ID']);
        }

        $orderItem = OrderItem::findOrFail($request->id);
        $orderItem->delete();

        return response()->json(['status' => 204, 'message' => 'Order item deleted']);
    }
}
