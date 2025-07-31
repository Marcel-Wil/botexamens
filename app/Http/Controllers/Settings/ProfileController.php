<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\City;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        // Seed cities if they don't exist
        $this->seedCities();

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'cities' => City::all(),
            'userCities' => $request->user()->cities()->pluck('cities.id'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        if ($request->has('cities')) {
            $request->user()->cities()->sync($request->input('cities', []));
        }

        $request->user()->save();

        return back();
    }

    /**
     * Seed the cities table if it's empty.
     */
    private function seedCities(): void
    {
        if (City::count() === 0) {
            $cities = [
                ['name' => 'Deurne', 'code' => 'ec1004'],
                ['name' => 'Alken', 'code' => 'ec1005'],
                ['name' => 'Kontich', 'code' => 'ec1022'],
                ['name' => 'Geel', 'code' => 'ec1023'],
                ['name' => 'Haasrode', 'code' => 'ec1024'],
                ['name' => 'Bree', 'code' => 'ec1033'],
            ];

            City::insert($cities);
        }
    }
}