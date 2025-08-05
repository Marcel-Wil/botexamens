<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\EnrollmentAutoInschrijven;
use App\Models\User;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function enroll_autoveiligheid(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $user = User::findOrFail($request->user_id);
        EnrollmentAutoInschrijven::create([
            'user_id' => $user->id,
            'examencentrum' => 'Autoveiligheid',
        ]);

        return response()->json(['message' => "{$user->name}, you have been added to the enrollment queue."]);
    }

    public function enroll_sbat(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $user = User::findOrFail($request->user_id);
        EnrollmentAutoInschrijven::create([
            'user_id' => $user->id,
            'examencentrum' => 'SBAT',
        ]);

        return response()->json(['message' => "{$user->name}, you have been added to the enrollment queue."]);
    }

    public function unenroll_autoveilgheid(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $user = User::findOrFail($request->user_id);
        EnrollmentAutoInschrijven::where('user_id', $user->id)->where('examencentrum', 'Autoveiligheid')->delete();

        return response()->json(['message' => "{$user->name}, you have been removed from the enrollment queue."]);
    }

    public function unenroll_sbat(Request $request)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $user = User::findOrFail($request->user_id);
        EnrollmentAutoInschrijven::where('user_id', $user->id)->where('examencentrum', 'SBAT')->delete();

        return response()->json(['message' => "{$user->name}, you have been removed from the enrollment queue."]);
    }


}