<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Review;


class ReviewController extends Controller
{
    // Lấy đánh giá
    public function getReviewsByQuery(Request $request)
    {
        $product_id = $request->query('product_id');
        $reviews = Review::with(['user:user_id,username,user_profile'])
            ->where('product_id', $product_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }

    // Gửi đánh giá
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,product_id',
            'rating' => 'required|integer|between:1,5',
            'comment' => 'required|string',
        ]);

        Review::create([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json(['success' => true, 'message' => 'Đánh giá đã được lưu!']);
    }
}
