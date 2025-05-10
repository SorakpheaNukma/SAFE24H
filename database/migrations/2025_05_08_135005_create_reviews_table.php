<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewsTable extends Migration
{
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id(); // reviews.id => BIGINT UNSIGNED
            
            // Phải dùng unsignedBigInteger nếu khóa chính ở bảng users/products là BIGINT
            $table->unsignedInteger('user_id');

            $table->unsignedInteger('product_id');

            $table->tinyInteger('rating')->check('rating BETWEEN 1 AND 5');
            $table->text('comment');
            $table->timestamps();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('reviews');
    }
}

