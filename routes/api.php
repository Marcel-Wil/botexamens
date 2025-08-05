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
            'preferences' => [
                'startDatum' => $user->startDatum,
                'endDatum' => $user->endDatum,
                'startUur' => $user->startUur,
                'endUur' => $user->endUur,
            ],
        ]);
    });

    Route::post('autoveiligheid/enroll', [EnrollmentController::class, 'enroll_autoveiligheid'])->name('api.enroll.autoveiligheid');
    Route::post('autoveiligheid/unenroll', [EnrollmentController::class, 'unenroll_autoveilgheid'])->name('api.unenroll.autoveiligheid');

    Route::post('sbat/enroll', [EnrollmentController::class, 'enroll_sbat'])->name('api.enroll.sbat');
    Route::post('sbat/unenroll', [EnrollmentController::class, 'unenroll_sbat'])->name('api.unenroll.sbat');


    Route::post('compare-datums', [DatumController::class, 'compare']);

    Route::post('compare-datums-sbat', [DatumController::class, 'compare_sbat']);
});

Route::get('/cities', function () {
    return \App\Models\City::all();
})->middleware('allow-only-local-requests');

// Route::post('/whatsapp', [ContactController::class, 'sendWhatsapp'])->name('whatsapp.send');