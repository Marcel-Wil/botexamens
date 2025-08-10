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
                'sbat_email' => $user->sbat_email,
                'sbat_password' => $user->sbat_password,
                'datum_slagen_theorieB' => $user->datum_slagen_theorieB,
                'type_voorlopig_rijbewijs' => $user->type_voorlopig_rijbewijs,
                'afgiftedatum_voorlopig_rijbewijsB' => $user->afgiftedatum_voorlopig_rijbewijsB,
                'hoeveelste_poging' => $user->hoeveelste_poging,
            ],
            'license_info' => [
                'zeersteVRijbewijsDatum' => $user->zeersteVRijbewijsDatum,
                'zhuidigVRijbewijsDatum' => $user->zhuidigVRijbewijsDatum,
                'zhuidigVRijbewijsGeldigTot' => $user->zhuidigVRijbewijsGeldigTot,
            ],
            'preferences' => [
                'startDatum' => $user->startDatum,
                'endDatum' => $user->endDatum,
                'startUur' => $user->startUur,
                'endUur' => $user->endUur,
            ],
        ]);
    });
    Route::post('compare-datums', [DatumController::class, 'compare']);

    Route::post('compare-datums-sbat', [DatumController::class, 'compare_sbat']);
});

Route::get('/cities', function () {
    return \App\Models\City::all();
})->middleware('allow-only-local-requests');

// Route::post('/whatsapp', [ContactController::class, 'sendWhatsapp'])->name('whatsapp.send');