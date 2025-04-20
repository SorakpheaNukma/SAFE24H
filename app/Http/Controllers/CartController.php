<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ProductVariants;

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

            // Fetch cart items for the logged-in user
            $cartItems = Cart::with('variant.product')
                ->where('user_id', $user->user_id)
                ->get();

            return response()->json([
                'status' => 200,
                'data' => $cartItems
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
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
                ->where('product_id', $request->product_id)
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
            return response()->json(['message' => 'An error occurred while processing your request.'], 500);
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

        return response()->json([
            'status' => 200,
            'message' => 'Cart item updated successfully.',
            'cart_item' => $cartItem
        ], 200);
    }

    public function destroy(Request $request)
    {
        try {
            // Find the cart item
            $cartItem = Cart::find($request->id);

            if (!$cartItem) {
                return response()->json(['message' => 'Cart item not found.'], 404);
            }

            $cartItem->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Cart item removed successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while processing your request.'], 500);
        }
    }

    public function deleteMultiple(Request $request)
    {
        try {
            // Validate that 'ids' is an array and contains at least one ID
            $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'integer|exists:carts,id',
            ]);

            $deletedCount = Cart::whereIn('id', $request->ids)->delete();

            return response()->json([
                'status' => 200,
                'message' => "$deletedCount cart item(s) removed successfully."
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurre:' . $e->getMessage()], 500);
        }
    }
}
