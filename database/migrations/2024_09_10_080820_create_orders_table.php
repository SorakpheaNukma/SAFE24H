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
        Schema::create('orders', function (Blueprint $table) {
            $table->increments('order_id');
            $table->unsignedInteger('user_id');
            $table->float('total_amount');
            $table->string('status'); // (processing, shipped, delivered)
            $table->timestamp('order_date');
            $table->timestamps();

            //Cascade on Delete: The onDelete('cascade') rule only applies to deletions 
            // in the parent table (in this case, the users table). If a user is deleted, 
            // any associated orders in the orders table will be deleted automatically.
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
