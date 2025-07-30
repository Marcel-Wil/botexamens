<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessAutoEnrollment;
use App\Models\EnrollmentAutoInschrijven;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EnrollmentController extends Controller
{
    public function enroll(Request $request)
    {
        $user = User::findOrFail($request->user_id);
        EnrollmentAutoInschrijven::create([
            'user_id' => $user->id,
        ]);

        return response()->json(['message' => "{$user->name}, you have been added to the enrollment queue."]);
    }
}