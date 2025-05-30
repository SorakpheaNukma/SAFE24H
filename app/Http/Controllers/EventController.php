<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class EventController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
            'discount' => 'required|integer|min:1|max:100',
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,product_id',
        ]);

        DB::beginTransaction();
        try {
            $event = Event::create([
                'title' => $validated['title'],
                'from_date' => $validated['from_date'],
                'to_date' => $validated['to_date'],
                'discount' => $validated['discount'],
            ]);

            $event->products()->attach($validated['product_ids']);

            DB::commit();
            return response()->json(['message' => 'Event created successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create event', 'error' => $e->getMessage()], 500);
        }
    }

    public function getAllEvents()
    {
        $events = Event::withCount('products')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'events' => $events
        ]);
    }
    public function show($id)
    {
        $event = Event::with(['products.category', 'products.product_images', 'products.product_variants'])
            ->findOrFail($id);

        $products = $event->products->map(function ($p) use ($event) {
            return [
                'product_id' => $p->product_id,
                'product_name' => $p->product_name,
                'product_price' => $p->product_price,
                'category_name' => $p->category->category_name ?? '',
                'images' => $p->product_images ? $p->product_images->pluck('image_path')->toArray() : [],
                'discount_percent' => $event->discount,  // Lấy discount từ event, không dùng pivot
            ];
        });

        return response()->json([
            'status' => true,
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'from_date' => $event->from_date,
                'to_date' => $event->to_date,
                'discount' => $event->discount,
                'products' => $products,
            ]
        ]);
    }

// Cập nhật sự kiện
    public function update(Request $request, $id)
    {
        $event = Event::find($id);
        if (!$event) {
            return response()->json(['status' => false, 'message' => 'Event not found'], 404);
        }

        $event->update([
            'title' => $request->title,
            'from_date' => $request->from_date,
            'to_date' => $request->to_date,
            'discount' => $request->discount,
        ]);
            if ($request->has('product_ids')) {
                $event->products()->sync($request->product_ids);
            }

        return response()->json(['status' => true, 'message' => 'Event updated successfully']);
    }

    // Xóa sự kiện
    public function destroy($id)
    {
        $event = Event::find($id);
        if (!$event) {
            return response()->json(['status' => false, 'message' => 'Event not found'], 404);
        }

        $event->delete();
        return response()->json(['status' => true, 'message' => 'Event deleted successfully']);
    }

    public function getActiveEventProducts(Request $request)
    {
        $productId = $request->query('product_id');
        $today = now()->toDateString();
    
        $product = DB::table('events')
            ->join('event_product', 'events.id', '=', 'event_product.event_id')
            ->where('event_product.product_id', $productId)
            ->whereDate('from_date', '<=', $today)
            ->whereDate('to_date', '>=', $today)
            ->select('event_product.product_id', 'events.discount')
            ->first();
    
        if ($product) {
            return response()->json([
                'data' => [
                    'product_id' => $product->product_id,
                    'discount' => $product->discount
                ]
            ]);
        }
    
        return response()->json([
            'data' => [
                'product_id' => $productId,
                'discount' => 'none'
            ]
        ]);
    }
    

}
