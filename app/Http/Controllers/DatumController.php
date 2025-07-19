<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Datum;
use Illuminate\Support\Facades\Redirect;

class DatumController extends Controller
{
    public function compare(Request $request)
    {
        $request->validate([
            'newdatums' => 'required|array',
            'newdatums.*.date' => 'required|string',
            'newdatums.*.text' => 'required|string',
        ]);

        $incomingDates = collect($request->input('newdatums'))
            ->map(fn($item) => \DateTime::createFromFormat('d/m/Y', $item['date']))
            ->filter()
            ->map(fn($date) => $date->format('Y-m-d'));

        $datum = Datum::latest()->first();

        $earliestDatum = null;

        if ($datum && is_array($datum->olddatums)) {
            $sorted = collect($datum->olddatums)->sort()->values();
            $earliestDatum = $sorted->first();
        }

        $earlierDate = $earliestDatum
            ? $incomingDates->first(fn($date) => $date < $earliestDatum)
            : null;

        $combined = collect($datum->olddatums ?? [])
            ->merge($incomingDates)
            ->unique()
            ->sort()
            ->values()
            ->toArray();

        if ($datum) {
            $datum->update(['olddatums' => $combined]);
        } else {
            Datum::create(['olddatums' => $combined]);
        }

        if ($earlierDate) {
            Mail::to('wilczynskimarceli@gmail.com')->send(new NewEarlierDateFound($earlierDate));

            return response()->json([
                'message' => 'Earlier date found and email sent.',
                'earlier_date' => $earlierDate,
            ]);
        }

        return response()->json([
            'message' => 'No earlier dates found.',
            'earliest_in_db' => $earliestDatum,
        ]);
    }
}
