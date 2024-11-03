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
        Schema::table('users', function (Blueprint $table) {
            $table->string('otp')->nullable()->after('user_role');
            $table->timestamp('otp_expired_time')->nullable()->after('otp'); // Add the new otp_expired_time column
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'otp')) {
                $table->dropColumn('otp');
            }

            if (Schema::hasColumn('users', 'otp_expired_time')) {
                $table->dropColumn('otp_expired_time');
            }
        });
    }
};
