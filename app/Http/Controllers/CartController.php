<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function index()
    {
        return view('client.pages.cart_page');
    }

    public function getAllCartItems()
    {
        try {
            //
            $cartItems = Cart::with(['product'])->get();
            return response()->json([
                'status' => 200,
                'data' => $cartItems
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while processing your request.'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,user_id',
                'product_id' => 'required|exists:products,product_id',
                'quantity' => 'required|integer',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $cartItem = Cart::create([
                'user_id' => $request->user_id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Item added to cart successfully.',
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
}
