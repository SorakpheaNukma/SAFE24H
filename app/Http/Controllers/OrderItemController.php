<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariants;

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

        foreach ($items as $index => $item) {
            $validatedData = Validator::make($item, [
                'order_id' => 'required|exists:orders,order_id',
                'product_id' => 'required|exists:products,product_id',
                'quantity' => 'required|integer|min:1',
                'price' => 'required',
                'variant_id' => 'nullable|exists:product_variants,variant_id', // Thêm validation cho variant_id
       
            ])->validate();

            $createdItem = OrderItem::create($validatedData);

            // Load the product relation and only get the product name
            $createdItem->load('product');
            $productName = $createdItem->product->product_name;

            $createdItems[] = [
                'order_item' => $createdItem,
                'product_name' => $productName,
            ];
            // Kiểm tra và gọi hàm MinusStockProduct
            $variant_id = $item['variant_id'] ?? null; // Lấy variant_id nếu có
            $this->MinusStockProduct($createdItem->product_id, $variant_id); // Truyền cả product_id và variant_id

            // Cập nhật số lượng đã bán cho sản phẩm chính
            $this->addSoldProduct($createdItem->product_id, $variant_id);

            // // MinusStockProduct and add sold for the first product only
            // if ($index == 0) {
            //     $this->MinusStockProduct($createdItem->product_id);
            //     $this->addSoldProduct($createdItem->product_id);
            // }
        }



        return response()->json([
            'status' => 200,
            'message' => 'Order items successfully added',
            'data' => $createdItems,
        ]);
    }


    public function MinusStockProduct($product_id, $variant_id)
{
    try {
        $product = Product::find($product_id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        $product->quantity = $product->quantity - 1;
        $product->save();

        return response()->json([
            'status' => 200,
            'message' => 'Stock updated successfully',
            'data' => $product
        ], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to update stock' . $e->getMessage()], 500);
    }
}

public function addSoldProduct($product_id, $variant_id)
{
    try {
        $product = Product::find($product_id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        // Nếu có `variant_id`, tìm biến thể sản phẩm
        if ($variant_id) {
            $productVariant = ProductVariants::find($variant_id);
            if ($productVariant) {
                $productVariant->sold += 1;
                $productVariant->save();
            }
        } else {
            // Nếu không có `variant_id`, cập nhật số lượng đã bán cho sản phẩm chính
            $product->sold += 1;
            $product->save();
        }

        $product->sold = $product->sold + 1;
        $product->save();

        return response()->json([
            'status' => 200,
            'message' => 'sold updated successfully',
            'data' => $product
        ], 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to update sold product:' . $e->getMessage()], 500);
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
