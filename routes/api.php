<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\DatumController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\EnrollmentController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::middleware('allow-only-local-requests')->group(function () {
    Route::get('user/{id}', function ($id) {
        $user = User::findOrFail($id);

        return response()->json([
            'personal_info' => [
                'achternaam' => $user->achternaam,
                'voornaam' => $user->voornaam,
                'rrn' => $user->rrn,
                'gbdatum' => $user->gbdatum,
                'tel' => $user->tel,
                'email' => $user->email,
                'adres' => $user->adres,
                'postcode' => $user->postcode,
            ],
            'license_info' => [
                'zeersteVRijbewijsDatum' => $user->zeersteVRijbewijsDatum,
                'zhuidigVRijbewijsDatum' => $user->zhuidigVRijbewijsDatum,
                'zhuidigVRijbewijsGeldigTot' => $user->zhuidigVRijbewijsGeldigTot,
            ],
        ]);
    });

    Route::post('enroll', [EnrollmentController::class, 'enroll'])->name('api.enroll');

    Route::post('compare-datums', [DatumController::class, 'compare']);

    Route::post('whatsapp', [ContactController::class, 'sendWhatsapp'])->name('whatsapp.send');
});