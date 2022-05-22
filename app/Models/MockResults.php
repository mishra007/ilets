<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MockResults extends Model
{
    use HasFactory;

    protected $appends = [
        'status_name', 'audio_src'
    ];

    public function getStatusNameAttribute(){
        return ucFirst($this->status);
    }

    public function getAudioSrcAttribute(){
        return env('APP_URL').'/uploads/audio/'.$this->audio;
    }

    public function mock()
    {
        return $this->belongsTo(MockTest::class, 'mock_tests_id');
    }

}
