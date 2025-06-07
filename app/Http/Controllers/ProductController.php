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
        $currentProduct = Product::with('category')->find($request->product_id);
        if (!$currentProduct) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $todayStart = now()->startOfDay();
        $todayEnd = now()->endOfDay();
        $recommendedProducts = Product::with([
            'category',
            'product_images',
            'product_variants',
            'events' => function ($query) use ($todayStart, $todayEnd) {
                $query->where('from_date', '<=', $todayEnd)
                      ->where('to_date', '>=', $todayStart);
            }
        ])
        ->where('category_id', $currentProduct->category_id)
        ->where('product_id', '!=', $request->product_id)
        ->orderBy('created_at', 'desc')
        ->get();

        $recommendations = $recommendedProducts->map(function ($p) {
            $descriptions = [];
            for ($i = 1; $i <= 11; $i++) {
                $descriptionField = "des_$i";
                if (!empty($p->$descriptionField)) {
                    $descriptions[$descriptionField] = $p->$descriptionField;
                }
            }

            $images = $p->product_images ? $p->product_images->pluck('image_path')->toArray() : [];

            $variants = $p->product_variants ? $p->product_variants->map(function ($v) {
                return [
                    'size' => $v->size,
                    'quantity' => $v->quantity,
                    'sold' => $v->sold,
                ];
            }) : [];

            $discount = $p->events->count() > 0 ? $p->events->max('discount') : 0;
            $originalPrice = $p->product_price;
            $discountedPrice = $discount > 0 ? $originalPrice * (1 - $discount / 100) : $originalPrice;

            return [
                'product_id' => $p->product_id,
                'product_name' => $p->product_name,
                'category_name' => $p->category->category_name ?? 'N/A',
                'category_id' => $p->category->category_id ?? null,
                'product_price' => number_format($originalPrice, 2),
                'discount_percent' => $discount,
                'discounted_price' => number_format($discountedPrice, 2),
                'descriptions' => $descriptions,
                'images' => $images,
                'variants' => $variants,
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
        $now = now();

        $products = Product::with([
            'category',
            'product_images',
            'product_variants',
            'events' => function ($query) use ($now) {
                $query->whereDate('from_date', '<=', $now)
                      ->whereDate('to_date', '>=', $now);
            }
        ])
        ->orderBy('created_at', 'desc')
        ->get();

        $proDetail = $products->map(function ($p) {
            $descriptions = [];
            for ($i = 1; $i <= 11; $i++) {
                $field = "des_$i";
                if (!empty($p->$field)) {
                    $descriptions[$field] = $p->$field;
                }
            }

            $totalQuantity = $p->product_variants ? $p->product_variants->sum('quantity') : 0;
            $images = $p->product_images ? $p->product_images->pluck('image_path')->toArray() : [];
            $variants = $p->product_variants ? $p->product_variants->map(function ($variant) {
                return [
                    'variant_id' => $variant->id,
                    'size' => $variant->size,
                    'quantity' => $variant->quantity,
                    'sold' => $variant->sold
                ];
            }) : [];

            $originalPrice = $p->product_price;
            $discount = $p->events->max('discount') ?? 0;
            $discountedPrice = $discount > 0 ? $originalPrice * (1 - $discount / 100) : $originalPrice;

            return [
                'product_id' => $p->product_id,
                'product_name' => $p->product_name,
                'category_name' => $p->category->category_name ?? 'N/A',
                'category_id' => $p->category->category_id ?? null,
                'product_price' => number_format($originalPrice, 2),
                'discount_percent' => $discount,
                'discounted_price' => number_format($discountedPrice, 2),
                'descriptions' => $descriptions,
                'images' => $images,
                'quantity' => $totalQuantity,
                'variants' => $variants,
            ];
        });

        return response()->json([
            'status' => 200,
            'data' => $proDetail
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 500,
            'error' => $e->getMessage()
        ]);
    }
}

public function getById($id)
{
    try {
        $product = Product::with(['category', 'product_images', 'product_variants', 'events'])->find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $product->images = $product->product_images->pluck('image_path');
        $product->variants = $product->product_variants->map(function ($variant) {
            return [
                'size' => $variant->size,
                'quantity' => $variant->quantity,
                'sold' => $variant->sold
            ];
        });

        $now = now();
        $activeEvent = $product->events()
            ->where('from_date', '<=', $now)
            ->where('to_date', '>=', $now)
            ->orderByDesc('discount')
            ->first();

        $discount = $activeEvent ? $activeEvent->discount : 0;
        $product->discount_percent = $discount;

        $originalPrice = $product->product_price;
        $discountedPrice = $discount > 0 ? $originalPrice * (1 - $discount / 100) : $originalPrice;
        $product->discounted_price = number_format($discountedPrice, 2);
        $product->product_price = number_format($originalPrice, 2);

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
