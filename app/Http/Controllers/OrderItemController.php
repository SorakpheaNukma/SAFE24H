<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariants;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Order;


class OrderItemController extends Controller
{

    //sua
    public function getAllOrderItems()
    {
        $orderItems = OrderItem::with([
            'variant.product.product_images',
            'variant.product.category'
        ])->get();

        return response()->json([
            'status' => 200,
            'data' => $orderItems // ← Dùng đúng tên biến
        ]);
    }
    public function getAllOrderUser()
    {
        $OrderItem = OrderItem::with(['variant.product.product_images', 'order',])->get();

        return response()->json([
            'status' => 200,
            'data' => $OrderItem
        ]);
    }

    public function getItemsByOrderId($orderId)
    {
        $orderItems = OrderItem::where('order_id', $orderId)
            ->with([
                'variant:id,product_id,size,quantity',
                'variant.product:product_id,product_name', // hoặc các trường bạn cần
                'order:order_id'
            ])
            ->get();
    
        $result = $orderItems->map(function ($item) {
            return [
                'variant_id' => $item->variant_id ?? null,
                'size' => $item->variant->size ?? null,
                'quantity_ordered' => $item->quantity,
                'variant_stock_quantity' => $item->variant->quantity ?? null,
            ];
        });
    
        return response()->json([
            'status' => 200,
            'data' => $result
        ]);
    }
    

    // Add a new order item
    public function addOrderItem(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.order_id' => 'required|exists:orders,order_id',
            'items.*.variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
        ]);
        $items = $request->input('items');
        $createdItems = [];
    
        foreach ($items as $item) {
            // No need to re-validate inside loop; already done above ✅
    
            // Create the order item
            $createdItem = OrderItem::create([
                'order_id' => $item['order_id'],
                'variant_id' => $item['variant_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price']
            ]);
    
            // Load related product name
            $createdItem->load('variant.product');
            $productName = optional($createdItem->variant->product)->product_name;
    
            $createdItems[] = [
                'order_item' => $createdItem,
                'product_name' => $productName,
            ];
    
            // Fix: use the correct product_id from variant
            $variant = ProductVariants::find($item['variant_id']);
            $product_id = $variant ? $variant->product_id : null;
    
            if ($product_id) {
                $this->MinusStockProduct($product_id, $item['variant_id'], $item['quantity']);
                $this->addSoldProduct($product_id, $item['variant_id'], $item['quantity']);
            }
        }


        return response()->json([
            'status' => 200,
            'message' => 'Order items successfully added',
            'data' => $createdItems,
        ]);
    }


    public function MinusStockProduct($product_id, $variant_id, $quantity=1 )
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
    public function addSoldProduct($product_id, $variant_id, $quantity=1 )
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
    public function update(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.order_item_id' => 'required|exists:order_items,id',
            'items.*.variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        foreach ($validated['items'] as $item) {
            $orderItem = OrderItem::find($item['order_item_id']);
            if ($orderItem) {
                $orderItem->variant_id = $item['variant_id'];
                $orderItem->quantity = $item['quantity'];
                $orderItem->save();
            }
        }

        return response()->json(['message' => 'Cập nhật thành công']);
    }

    public function userUpdateOrder(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,order_id',
            'items' => 'required|array',
            'items.*.order_item_id' => 'required|exists:order_items,id',
            'items.*.variant_id' => 'required|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);
    
        $orderId = $validated['order_id'];
    
        // Nếu hệ thống có auth: kiểm tra user hiện tại có quyền với order này không
        $order = Order::findOrFail($orderId);
        if ($order->user_id !== Auth::id()) {
            return response()->json(['message' => 'Bạn không có quyền sửa đơn hàng này'], 403);
        }
    
        DB::beginTransaction();
    
        try {
            foreach ($validated['items'] as $item) {
                $orderItem = OrderItem::findOrFail($item['order_item_id']);
    
                // Cập nhật thông tin
                $orderItem->variant_id = $item['variant_id'];
                $orderItem->quantity = $item['quantity'];
                $orderItem->save();
            }
    
            DB::commit();
            return response()->json(['message' => 'Cập nhật thành công']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Đã xảy ra lỗi khi cập nhật', 'error' => $e->getMessage()], 500);
        }
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
