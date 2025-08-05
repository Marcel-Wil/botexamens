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
        // Eager load the enrollmentAutoInschrijven relationship
        $user = Auth::user()->load('enrollmentAutoInschrijven');
        
        return Inertia::render('settings/abonnement', [
            'enrollmentStatus' => $user->enrollmentAutoInschrijven !== null
        ]);
    }
}