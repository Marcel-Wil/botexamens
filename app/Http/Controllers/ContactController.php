<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function show()
    {
        return Inertia::render('contact');
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        // Send email to admin

        Mail::to("satumbusiness@gmail.com")->queue(new ContactFormMail($validated));

        return response()->json([
            'message' => 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.'
        ]);
    }
}