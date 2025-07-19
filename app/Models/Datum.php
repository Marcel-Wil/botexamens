<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Datum extends Model
{
    protected $fillable = ['datums'];

    protected $casts = [
        'datums' => 'array',
    ];
}