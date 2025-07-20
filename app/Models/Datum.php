<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Datum extends Model
{
    protected $table = 'datum';

    protected $fillable = ['olddatums'];

    protected $casts = [
        'olddatums' => 'array',
    ];
}