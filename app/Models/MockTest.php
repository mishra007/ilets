<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MockTest extends Model
{
    use HasFactory;

    protected $appends = [
        'desc'
    ];

    public function getDescAttribute(){
        return strip_tags($this->description);
    }

}
