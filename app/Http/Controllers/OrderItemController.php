<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariants;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderItemController extends Controller
{

    //sua
    public function getAllOrderItems()
    {
        $orderItems = OrderItem::with([
            'variant.product.product_image',
            'variant.product.category'
        ])->get();

        return response()->json([
            'status' => 200,
            'data' => $orderItems // ← Dùng đúng tên biến
        ]);
    }
    public function getAllOrderUser()
    {
        $OrderItem = OrderItem::with(['variant.product.product_image', 'order',])->get();

        return response()->json([
            'status' => 200,
            'data' => $OrderItem
        ]);
    }

    public function getItemsByOrderId($orderId)
    {
        $orderItems = OrderItem::where('order_id', $orderId)->with('variant.product')->get();

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

        foreach ($items as $index => $item) { //sua 
            $validatedData = Validator::make($item, [
                'order_id' => 'required|exists:orders,order_id',
                'variant_id' => 'required|exists:product_variants,id',
                'quantity' => 'required|integer|min:1',
                'price' => 'required',
                //'variant_id' => 'nullable|exists:product_variants,variant_id', // Thêm validation cho variant_id
       
            ])->validate();

            $createdItem = OrderItem::create($validatedData);

            // Load the product relation and only get the product name (sua)
            $createdItem->load('variant.product');
            $productName = optional($createdItem->variant->product)->product_name;

            $createdItems[] = [
                'order_item' => $createdItem,
                'product_name' => $productName,
            ];
                $variant_id = $item['variant_id'];
                $variant = ProductVariants::find($variant_id);
                $product_id = $variant ? $variant->product_id : null;

                $this->MinusStockProduct($product_id, $variant_id);
                $this->addSoldProduct($product_id, $variant_id);

        }



        return response()->json([
            'status' => 200,
            'message' => 'Order items successfully added',
            'data' => $createdItems,
        ]);
    }


    public function MinusStockProduct($product_id, $variant_id, $quantity)
{
    try {
        $product = Product::find($product_id);
        if ($variant_id) {
            $variant = ProductVariants::find($variant_id);
            if ($variant) {
                $variant->quantity -= $quantity;
                $variant->save();
            }
        } else {
            $product = Product::find($product_id);
            if ($product) {
                $product->quantity -= $quantity;
                $product->save();
            }
        }
        
        // if (!$product) {
        //     return response()->json(['error' => 'Product not found'], 404);
        // }
        // $product->quantity = $product->quantity - 1;
        // $product->save();

        return response()->json([
            'status' => 200,
            'message' => 'Stock updated successfully',
            'data' => $product
        ], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to update stock' . $e->getMessage()], 500);
    }
}
//sua
public function addSoldProduct($product_id, $variant_id, $quantity)
{
    try {
        $product = Product::find($product_id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        if ($variant_id) {
            $productVariant = ProductVariants::find($variant_id);
            if ($productVariant) {
                $productVariant->sold += $quantity;
                $productVariant->save();
            }
        }

        $product->sold += $quantity;
        $product->save();

        return response()->json([
            'status' => 200,
            'message' => 'Sold updated successfully',
            'data' => $product
        ], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to update sold product: ' . $e->getMessage()], 500);
    }
}



    // Update quantity or price of an order item
    public function updateOrderItem(Request $request)
    {
        $validatedData = $request->validate([
            'quantity' => 'nullable|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'variant_id' => 'nullable|exists:product_variants,id',
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
