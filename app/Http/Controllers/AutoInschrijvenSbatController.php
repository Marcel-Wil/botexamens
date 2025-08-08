<?php

namespace App\Http\Controllers;

use App\Enums\HoeveelstePoging;
use App\Enums\TypeVoorlopigRijbewijs;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AutoInschrijvenSbatController extends Controller
{
    /**
     * Show the form for editing the user's SBAT auto-inscription settings.
     */
    public function edit(): Response
    {
        return Inertia::render('settings/autoinschrijvensbat');
    }

    /**
     * Update the user's SBAT auto-inscription information.
     */
    public function update(Request $request)
    {

        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string'],
            'datum_slagen_theorieB' => ['required', 'string'],
            'type_voorlopig_rijbewijs' => ['required', 'string'],
            'afgiftedatum_voorlopig_rijbewijsB' => ['required', 'string'],
            'hoeveelste_poging' => ['required', 'string'],
        ]);


        // Update the user's SBAT credentials
        $user = Auth::user();
        $user->sbat_email = $validated['email'];
        $user->sbat_password = bcrypt($validated['password']);
        $user->datum_slagen_theorieB = $validated['datum_slagen_theorieB'];
        $user->type_voorlopig_rijbewijs = $validated['type_voorlopig_rijbewijs'];
        $user->afgiftedatum_voorlopig_rijbewijsB = $validated['afgiftedatum_voorlopig_rijbewijsB'];
        $user->hoeveelste_poging = $validated['hoeveelste_poging'];
        $user->save();

        return back()->with([
            'success' => 'SBAT instellingen zijn bijgewerkt!',
        ]);
    }
}