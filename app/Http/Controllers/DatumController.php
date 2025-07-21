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
            $newlyFoundEarlierDatums = $incomingDatums
                ->filter(fn($item) => $item['date'] < $earliestDatumInDb['date'])
                ->sortBy('date');
        }

        $newDatumsToStore = $incomingDatums->sortBy('date')->values();

        if ($datum) {
            $datum->update(['olddatums' => $newDatumsToStore->toArray()]);
        } else {
            Datum::create(['olddatums' => $newDatumsToStore->toArray()]);
        }

        if ($newlyFoundEarlierDatums->isNotEmpty()) {
            Mail::to('wilczynskimarceli@gmail.com')->queue(new NewEarlierDateFound($newlyFoundEarlierDatums));

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