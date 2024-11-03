<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Category;

class CategoryController extends Controller
{
    public function getAllCategory()
    {
        try {
            $categories = Category::all();
            return response()->json([
                'status' => 200,
                'data' => $categories
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getCategoryById(Request $request)
    {
        $validator = Validator::make(request()->all(), [
            'id' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            $category = Category::find($request->category_id);
            if (!$category) {
                return response()->json(['error' => 'Category not found'], 404);
            }
            return response()->json([
                'status' => 200,
                'data' => $category
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function createCategory(Request $request)
    {
        try {
            $category = new Category();
            $category->category_name = $request->category_name;
            $category->save();
            return response()->json([
                'status' => 200,
                'data' => $category
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateCategory(Request $request)
    {
        try {
            $validator = Validator::make(request()->all(), [
                'category_id' => 'required|integer',
                'category_name' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            $category = Category::find($request->category_id);
            if (!$category) {
                return response()->json(['error' => 'Category not found'], 404);
            }

            $category->category_name = $request->category_name;
            $category->save();
            return response()->json([
                'status' => 200,
                'data' => $category,
                'msg' => 'Category updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteCategory(Request $request)
    {
        try {
            $category = Category::find($request->category_id);
            if (!$category) {
                return response()->json(['error' => 'Category not found'], 404);
            }

            $category->delete();
            return response()->json([
                'status' => 200,
                'data' => $category,
                'msg' => 'Category deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
