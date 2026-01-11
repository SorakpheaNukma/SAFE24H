<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
public function up()
{
    Schema::create('event_product', function (Blueprint $table) {
        $table->id();

        // Khóa ngoại trỏ tới bảng events
        $table->unsignedBigInteger('event_id');
        $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');

        // Khóa ngoại trỏ tới bảng products
        $table->unsignedInteger('product_id');
        $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');

        // Không cho phép trùng lặp giữa event_id và product_id
        $table->unique(['event_id', 'product_id']);

        $table->timestamps();
    });
}




    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('event_product');
    }
};
