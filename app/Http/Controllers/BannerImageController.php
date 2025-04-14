<?php

namespace App\Http\Controllers;

use App\Models\BannerImage;
use Illuminate\Http\Request;

class BannerImageController extends Controller
{
    public function getAllBannerImages()
    {
        try {
            // Giả sử bạn lấy các banner images từ bảng `banner_images`
            $bannerImages = BannerImage::all();

            // Chuyển dữ liệu thành mảng và trả về response JSON
            return response()->json([
                'status' => 200,
                'data' => $bannerImages
            ], 200);
        } catch (\Exception $e) {
            // Nếu có lỗi, trả về thông báo lỗi
            return response()->json([
                'status' => 500,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
