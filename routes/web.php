<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DatumController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('homepage');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
});


Route::get('/contact', [ContactController::class, 'show'])->name('contact.show');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send')->middleware('throttle:2,60');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';