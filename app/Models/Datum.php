<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Datum extends Model
{
    use HasFactory;

    protected $table = 'datum';

    protected $fillable = [
        'city_id',
        'olddatums',
    ];

    protected $casts = [
        'olddatums' => 'array',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}