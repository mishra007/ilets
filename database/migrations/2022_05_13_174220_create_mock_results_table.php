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
        Schema::create('mock_results', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();

            $table->bigInteger('users_id')->unsigned();
            $table->foreign('users_id')->references('id')->on('users');

            $table->bigInteger('mock_tests_id')->unsigned();
            $table->foreign('mock_tests_id')->references('id')->on('mock_tests');

            $table->string('audio');
            $table->string('audio_gcs')->nullable();
            $table->text('audio_to_text')->nullable();
            $table->integer('timer')->nullable();
            $table->integer('pause_count')->nullable();

            $table->enum('status', ['pending', 'progress', 'comparison', 'completed'])->default('pending');

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
        Schema::dropIfExists('mock_results');
    }
};
