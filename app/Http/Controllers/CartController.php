<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ProductVariants;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index()
    {
        return view('client.pages.cart_page');
    }

    public function getAllCartItems()
    {
        try {
            $user = auth()->user();


            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            // Lấy danh sách các item trong giỏ hàng
            $cartItems = Cart::with('variant.product.product_images')
                ->where('user_id', $user->user_id)
                ->get();

            if ($cartItems->isEmpty()) {
                return response()->json([
                    'status' => 204,
                    'message' => 'Cart is empty.',
                    'data' => []
                    
                ], 200); // HTTP 200 OK nhưng thông điệp rõ ràng là không có dữ liệu
            }

            // Xử lý dữ liệu và kiểm tra null
            $cartDetails = $cartItems->map(function ($item) {
            $variant = $item->variant;
            $product = $variant ? $variant->product : null;
            $images = $product ? $product->product_images : collect([]);
            $imagePath = $images->isNotEmpty()
                ? url('/uploads/products/' . $images->first()->image_path)
                : url('/uploads/products/default.jpg');

            $originalPrice = $product->product_price ?? 0;
            $discount = 0;
            $finalPrice = $originalPrice;

            // 👉 Lấy giảm giá nếu có trong bảng event_product (KHÔNG kiểm tra thời gian)
            if ($product) {
                $today = now()->toDateString();
                $event = DB::table('events')
                    ->join('event_product', 'events.id', '=', 'event_product.event_id')
                    ->where('event_product.product_id', $product->product_id)
                    ->whereDate('events.from_date', '<=', $today)
                    ->whereDate('events.to_date', '>=', $today)
                    ->orderByDesc('events.discount')
                    ->first();

                if ($event) {
                    $discount = $event->discount;
                    $finalPrice = $originalPrice - ($originalPrice * $discount / 100);
                }
            }

            return [
                'cart_id' => $item->id,
                'variant_id' => $item->variant_id,
                'product_name' => $product->product_name ?? 'N/A',
                'quantity' => $item->quantity,
                'price' => round($finalPrice, 2),
                'original_price' => round($originalPrice, 2),
                'discount' => $discount,
                'size' => $variant ? $variant->size : 'N/A',
                'images' => $imagePath,
                'stock_quantity' => $variant ? $variant->quantity : 0,
            ];
        });

            return response()->json([
                'status' => 200,
                'data' => $cartDetails
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,user_id',
                'product_id' => 'required|exists:products,product_id',
                'size' => 'required|string',
                'quantity' => 'required|integer',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $variant = ProductVariants::where('product_id', $request->product_id)
                                             ->where('size', $request->size)
                                             ->first();

            if (!$variant) {
                return response()->json([
                    'error' => ['size' => ['Sản phẩm với kích cỡ này không tồn tại.']]
                ], 422);
            }

            // Check if the product is already in the cart for the same user
            $existingCartItem = Cart::where('user_id', $request->user_id)
                ->where('variant_id', $variant->id)
                ->first();
        
            if ($existingCartItem) {
                return response()->json([
                    'status' => 200,
                    'message' => 'This item have already in cart !!'
                ], 200);
            }

            $cartItem = Cart::create([
                'user_id' => $request->user_id,
                'variant_id' => $variant->id,
                'quantity' => $request->quantity,
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Item added to cart successfully 🎉',
                'cart_item' => $cartItem
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Find the cart item
        $cartItem = Cart::find($request->id);

        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found.'], 404);
        }

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);
        // if ($request->quantity <= 0) {
        //     return response()->json(['message' => 'Quantity must be greater than 0.'], 422);
        // }

        return response()->json([
            'status' => 200,
            'message' => 'Cart item updated successfully.',
            'cart_item' => $cartItem
        ], 200);
    }

    public function destroy(Request $request)
{
    try {
        // Tìm sản phẩm trong giỏ hàng và kiểm tra quyền sở hữu
        $cartItem = Cart::where('id', $request->input('id'))
                        ->where('user_id', auth()->id()) // Kiểm tra quyền sở hữu
                        ->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found or unauthorized.'], 404);
        }

        // Xóa sản phẩm
        $cartItem->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Cart item removed successfully.'
        ], 200);
    } catch (\Exception $e) {
        // Ghi log lỗi để debug
        \Log::error('Error removing cart item:', [
            'error' => $e->getMessage(),
            'request' => $request->all()
        ]);

        return response()->json([
            'message' => 'An error occurred while processing your request.',
            'error' => $e->getMessage()
        ], 500);
    }
    }

}
