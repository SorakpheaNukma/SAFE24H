<?php

namespace App\Http\Controllers;

use App\Models\BannerImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BannerImageController extends Controller
{
    public function getAllBannerImages()
    {
        try {
            
            $bannerImages = BannerImage::all();
                    // Gắn thêm đường dẫn ảnh đầy đủ
            foreach ($bannerImages as $banner) {
                $banner->image_url = asset('upload/' . $banner->image_path);
            }

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
    public function createBannerImage(Request $request)
    {
        if ($request->hasFile('bannerImage')) {
            $request->validate([
                'bannerImage' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            $file = $request->file('bannerImage');

            // Tạo tên file ngẫu nhiên
            $filename = Str::random(10) . '.' . $file->getClientOriginalExtension();

            // Di chuyển file vào thư mục public/uploads/products
            $file->move(public_path('uploads/products'), $filename);

            // Lưu vào CSDL
            $banner = new BannerImage();
            $banner->image_path = $filename;
            $banner->save();

            return response()->json([
                'status' => 200,
                'message' => 'Upload banner thành công!',
                'image_path' => $filename
            ]);
        }

        return response()->json([
            'status' => 400,
            'message' => 'Không có file được gửi lên!'
        ]);
    }
    public function clear($id)
    {
        $banner = BannerImage::find($id);
        if (!$banner) {
            return response()->json(['status' => 404, 'message' => 'Không tìm thấy banner'], 404);
        }

        // Xoá file ảnh khỏi thư mục nếu cần
        $filePath = public_path('uploads/products/' . $banner->image_path);
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $banner->delete();
        return response()->json(['status' => 200, 'message' => 'Xoá banner thành công']);
    }


}
