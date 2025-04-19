<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductImages;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\ProductVariants;



use Illuminate\Support\Str;

class ProductController extends Controller
{

    public function getRecommendedProducts(Request $request)
    {
        try {
            // Find the current product
            $currentProduct = Product::with('category')->find($request->product_id);

            // If the product is not found, return a 404 response
            if (!$currentProduct) {
                return response()->json(['error' => 'Product not found'], 404);
            }

            $recommendedProducts = Product::with(['category', 'product_image'])
                ->where('category_id', $currentProduct->category_id)
                ->where('product_id', '!=', $request->product_id)
                ->orderBy('created_at', 'desc') // Optional: Sort by latest
                ->take(5) // Optional: Limit the number of recommendations
                ->get();

            // Map the products to the desired format
            $recommendations = $recommendedProducts->map(function ($p) {
                $descriptions = [];
                for ($i = 1; $i <= 11; $i++) {
                    $descriptionField = "des_$i";
                    if (!empty($p->$descriptionField)) {
                        $descriptions[$descriptionField] = $p->$descriptionField;
                    }
                }
                return [
                    'product_id' => $p->product_id,
                    'product_name' => $p->product_name,
                    'quantity' => $p->quantity ?? 0,
                    'sold' => $p->sold ?? 0,
                    'category_name' => $p->category->category_name,
                    'category_id' => $p->category->category_id,
                    'product_price' => number_format($p->product_price, 2),
                    'descriptions' => $descriptions,
                    'images' => $p->product_image->pluck('image_path')->toArray(),
                ];
            });

            return response()->json([
                'status' => 200,
                'data' => $recommendations
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'status' => 500,
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function getAll()
    {
        try {
            $products = Product::with(['category', 'product_image', 'product_variants'])
                ->orderBy('created_at', 'desc')
                ->get();

            $proDetail = $products->map(function ($p) {
                $descriptions = [];
                for ($i = 1; $i <= 11; $i++) {
                    $descriptionField = "des_$i";
                    if (!empty($p->$descriptionField)) {
                        $descriptions[$descriptionField] = $p->$descriptionField;
                    }
                }
                $totalQuantity = $p->product_variants->sum('quantity'); // ✅ Tính tổng số lượng

                return [
                    'product_id' => $p->product_id,
                    'product_name' => $p->product_name,
                    'category_name' => $p->category->category_name,
                    'category_id' => $p->category->category_id,
                    'product_price' => number_format($p->product_price, 2),
                    'descriptions' => $descriptions,
                    'images' => $p->product_image->pluck('image_path')->toArray(),
                    'quantity' => $totalQuantity, // ✅ Thêm vào đây
                    'variants' => $p->product_variants->map(function ($variant) {
                        return [
                            'size' => $variant->size,
                            'quantity' => $variant->quantity,
                            'sold' => $variant->sold
                        ];
                    }),
                ];
                
            });

            return response()->json([
                'status' => 200,
                'data' => $proDetail
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getById($id)
    {
        try {
            $product = Product::with(['category', 'product_image', 'product_variants'])->find($id);
            if (!$product) {
                return response()->json(['error' => 'Product not found'], 404);
            }

            $product->images = ProductImages::where('product_id', $id)->pluck('image_path');
            $product->variants = $product->product_variants->map(function ($variant) {
                return [
                    'size' => $variant->size,
                    'quantity' => $variant->quantity,
                    'sold' => $variant->sold
                ];
            });

            return response()->json($product, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function addProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_name' => 'required|string|max:255',
            'product_price' => 'required|numeric',
            'category_id' => 'required|exists:categories,category_id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $product = new Product();
            $product->product_name = $request->product_name;
            $product->product_price = number_format($request->product_price, 2);
            $product->category_id = $request->category_id;
    
            // Mô tả sản phẩm (tối đa 11 mô tả)
            for ($i = 1; $i <= 11; $i++) {
                $descriptionField = "des_$i";
                $product->$descriptionField = $request->$descriptionField ?? null;
            }
    
            $product->save();
    
            // Lưu thông tin size vào bảng product_variants
            $sizes = ['S', 'M', 'L', 'XL', '2XL'];
            foreach ($sizes as $size) {
                $quantityField = 'size_' . strtolower($size) . '_quantity';
                if ($request->has($quantityField)) {
                    $qty = (int) $request->$quantityField;
                    if ($qty > 0) {
                        ProductVariants::create([
                            'product_id' => $product->product_id,
                            'size'       => $size,
                            'quantity'   => $qty,
                            'sold'       => 0,
                        ]);
                    }
                }
            }
    
            return response()->json([
                'status' => 200,
                'data' => $product
            ], 200);
    
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function addImageProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,product_id',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $productImg = new ProductImages();
                    $productImg->product_id = $request->product_id;

                    $uniqueName = Str::uuid()->toString() . '.' . $image->getClientOriginalExtension();
                    $destinationPath = public_path('/uploads/products');

                    $image->move($destinationPath, $uniqueName);

                    $productImg->image_path = $uniqueName;

                    $productImg->save();
                }
            }

            return response()->json([
                'status' => 200,
                'message' => 'Product added successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,product_id',
            'product_price' => 'required|numeric',
            'product_name' => 'required|string',
            'category_id' => 'required|exists:categories,category_id',
            'variants' => 'required|array',
            'variants.*.size' => 'required|string|in:S,M,L,XL,2XL',
            'variants.*.quantity' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $product = Product::find($request->product_id);
            if (!$product) {
                return response()->json(['error' => 'Product not found'], 404);
            }

            $product->product_name = $request->product_name;
            $product->category_id = $request->category_id;
            $product->product_price = number_format($request->product_price, 2);
            
            for ($i = 1; $i <= 11; $i++) {
                $descriptionField = "des_$i";
                if ($request->has($descriptionField)) {
                    $product->$descriptionField = $request->$descriptionField;
                }
            }

            $product->save();
            // Cập nhật các biến thể kích thước
            $existingVariants = ProductVariants::where('product_id', $product->product_id)->get()->keyBy('size');

            foreach ($request->variants as $variantData) {
                $size = $variantData['size'];
                $quantity = $variantData['quantity'];

                if (isset($existingVariants[$size])) {
                    $variant = $existingVariants[$size];
                    if ($quantity > 0) {
                        $variant->quantity = $quantity;
                        $variant->save();
                    } else {
                        $variant->delete();
                    }
                } else {
                    if ($quantity > 0) {
                        ProductVariants::create([
                            'product_id' => $product->product_id,
                            'size' => $size,
                            'quantity' => $quantity,
                            'sold' => 0,
                        ]);
                    }
                }
            }
            return response()->json([
                'status' => 200,
                'data' => $product,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateImgProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,product_id',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            if ($request->hasFile('images') && count($request->file('images')) > 0) {
                $productImages = ProductImages::where('product_id', $request->product_id)->get();
                foreach ($productImages as $productImg) {
                    $oldImagePath = public_path($productImg->image_path);
                    if (file_exists($oldImagePath)) {
                        @unlink($oldImagePath);  // Xóa ảnh cũ
                    }
                    $productImg->delete();  // Xóa ảnh khỏi database
                }

                foreach ($request->file('images') as $image) {
                    $productImg = new ProductImages();
                    $productImg->product_id = $request->product_id;
    
                    $uniqueName = Str::uuid()->toString() . '.' . $image->getClientOriginalExtension();
                    $destinationPath = public_path('/uploads/products');
    
                    $image->move($destinationPath, $uniqueName);
                    $productImg->image_path = $uniqueName;
                    $productImg->save();
                }
            }
            return response()->json([
                'status' => 200,
                'message' => 'Product updated successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteProduct(Request $request)
    {
        try {
            $product = Product::find($request->product_id);
            if (!$product) {
                return response()->json(['error' => 'Product not found'], 404);
            }

            $product->delete();
            return response()->json([
                'status' => 200,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteProductImg(Request $request)
    {
        try {
            $productImg = ProductImages::find($request->product_id);

            if (!$productImg) {
                return response()->json([
                    'status' => 200,
                ], 200);
            }

            if ($productImg->image_path) {
                $imagePath = public_path($productImg->image_path);
                if (file_exists($imagePath)) {
                    @unlink($imagePath);
                }
            }
            $productImg->delete();

            return response()->json([
                'status' => 200,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
