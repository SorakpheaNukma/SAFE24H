<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->increments('product_id');
            $table->string('product_name');
            $table->float('product_price', 10, 2);
            $table->integer('quantity')->nullable();
            $table->integer('sold')->default(0)->nullable();
            $table->string('des_1')->nullable();
            $table->string('des_2')->nullable();
            $table->string('des_3')->nullable();
            $table->string('des_4')->nullable();
            $table->string('des_5')->nullable();
            $table->string('des_6')->nullable();
            $table->string('des_7')->nullable();
            $table->string('des_8')->nullable();
            $table->string('des_9')->nullable();
            $table->string('des_10')->nullable();
            $table->string('des_11')->nullable();
            $table->unsignedInteger('category_id');
            $table->timestamps();

            $table->foreign('category_id')->references('category_id')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
};
