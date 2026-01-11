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
            'ratings' => 'required|array',
            'ratings.*.product_id' => 'required|exists:products,product_id',
            'ratings.*.rating' => 'required|integer|between:1,5',
            'ratings.*.comment' => 'required|string',
        ]);

        foreach ($request->ratings as $ratingData) {
            Review::create([
                'user_id' => Auth::id(),
                'product_id' => $ratingData['product_id'],
                'rating' => $ratingData['rating'],
                'comment' => $ratingData['comment'],
            ]);
        }

        return response()->json(['success' => true, 'message' => 'Đánh giá đã được lưu!']);
    }
}
