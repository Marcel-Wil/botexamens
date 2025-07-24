<?php

namespace App\Http\Controllers;

use App\Mail\NewEarlierDateFound;
use Illuminate\Http\Request;
use App\Models\Datum;
use Illuminate\Support\Facades\Mail;

class DatumController extends Controller
{
    public function compare(Request $request)
    {
        $request->validate([
            'newdatums' => 'array',
            'newdatums.*.date' => 'required|string',
            'newdatums.*.text' => 'required|string',
        ]);

        if (empty($request->input('newdatums'))) {
            return response()->json(['message' => 'No dates provided.'], 400);
        }

        $incomingDatums = collect($request->input('newdatums'))
            ->map(function ($item) {
                $date = \DateTime::createFromFormat('!d/m/Y', $item['date']);
                return $date ? ['date' => $date->format('Y-m-d'), 'text' => $item['text']] : null;
            })
            ->filter();

        if ($incomingDatums->isEmpty()) {
            return response()->json(['message' => 'No valid dates provided.'], 400);
        }

        $datum = Datum::latest()->first();
        $existingDatums = collect($datum->olddatums ?? []);

        $earliestDatumInDb = $existingDatums->sortBy('date')->first();

        $newlyFoundEarlierDatums = collect();
        if ($earliestDatumInDb) {
            $earliestStillExists = $incomingDatums->firstWhere('date', $earliestDatumInDb['date']);

            if ($earliestStillExists) {
                $newlyFoundEarlierDatums = $incomingDatums
                    ->filter(fn($item) => $item['date'] < $earliestDatumInDb['date'])
                    ->sortBy('date');
            } else {
                $newlyFoundEarlierDatums = $incomingDatums->sortBy('date');
            }
        }

        $newDatumsToStore = $incomingDatums->sortBy('date')->values();

        if ($datum) {
            $datum->update(['olddatums' => $newDatumsToStore->toArray()]);
        } else {
            Datum::create(['olddatums' => $newDatumsToStore->toArray()]);
        }

        if ($newlyFoundEarlierDatums->isNotEmpty()) {
            $users = User::where('notification', true)->get();
            foreach ($users as $user) {
                Mail::to($user->email)->queue(new NewEarlierDateFound($newlyFoundEarlierDatums->toArray()));
                //TODO: Send notification to whatsapp
            }

            return response()->json([
                'message' => 'New earlier dates found and email sent.',
                'earlier_datums' => $newlyFoundEarlierDatums->values(),
            ]);
        }

        return response()->json([
            'message' => 'No earlier dates found.',
            'earliest_in_db' => $earliestDatumInDb,
        ]);
    }
}