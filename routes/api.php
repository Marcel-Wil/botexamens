<?php

use App\Http\Controllers\DatumController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('compare-datums', [DatumController::class, 'compare'])->middleware('allow-only-local-requests');