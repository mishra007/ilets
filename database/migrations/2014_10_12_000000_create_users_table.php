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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('role')->default('user');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();

            $table->string('status')->default('active');

            $table->timestamps();
        });

        ///insert admin
        DB::table('users')->insert([
            'role' => 'admin',
            'first_name' => 'Jhon',
            'last_name' => 'Wick',
            'email' => 'admin@yopmail.com',
            'email_verified_at' => date('Y-m-d H:i:s'),
            'password' => Hash::make('12345678')
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
