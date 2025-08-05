<?php

namespace App\Http\Controllers;

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
            'password' => ['required', 'string', 'min:8'],
        ]);

        // Update the user's SBAT credentials
        $user = Auth::user();
        $user->sbat_email = $validated['email'];
        $user->sbat_password = bcrypt($validated['password']);
        $user->save();

        return back()->with([
            'success' => 'SBAT instellingen zijn bijgewerkt!',
        ]);
    }
}
