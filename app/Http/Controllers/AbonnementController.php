<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AbonnementController extends Controller
{
    //
    public function edit()
    {
        $user = Auth::user()->load('enrollmentAutoInschrijven');
        $enrollmentsUser = $user->enrollmentAutoInschrijven;

        return Inertia::render('settings/abonnement', [
            'enrollmentStatus' => $enrollmentsUser->isNotEmpty()
        ]);
    }
}