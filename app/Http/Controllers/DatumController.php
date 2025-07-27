<?php

namespace App\Http\Controllers;

use App\Mail\NewEarlierDateFound;
use Illuminate\Http\Request;
use App\Models\Datum;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class DatumController extends Controller
{
    public function compare(Request $request)
    {
        $request->validate([
            'newdatums' => 'array',
            'newdatums.*.date' => 'required|string',
            'newdatums.*.text' => 'required|string',
            'newdatums.*.times' => 'array',
        ]);
        $notification_response = $this->send_notifications($request);
        $auto_inschrijven_response = $this->auto_inschrijven($request);

        return response()->json([
            'notification_response' => $notification_response,
            'auto_inschrijven_response' => $auto_inschrijven_response,
        ]);
    }

    public function auto_inschrijven(Request $request)
    {
        //TODO: Implement auto inschrijven
        return response()->json(['message' => 'Auto inschrijven completed.']);
    }

    public function send_notifications(Request $request)
    {
        if (empty($request->input('newdatums'))) {
            return response()->json(['message' => 'No dates provided.'], 400);
        }

        $incomingDatums = collect($request->input('newdatums'))
            ->map(function ($item) {
                $date = \DateTime::createFromFormat('!d/m/Y', $item['date']);
                return $date ? [
                    'date' => $date->format('Y-m-d'),
                    'text' => $item['text'],
                    'times' => $item['times'] ?? [],
                ] : null;
            })
            ->filter();

        if ($incomingDatums->isEmpty()) {
            return response()->json(['message' => 'No valid dates provided.'], 400);
        }

        $datum = Datum::latest()->first();
        $existingDatums = collect($datum->olddatums ?? []);
        $earliestDatumInDb = $existingDatums->sortBy('date')->first();

        $user = User::first();

        $startDatum = $user?->startDatum;
        $endDatum = $user?->endDatum;
        $startUur = $user?->startUur;
        $endUur = $user?->endUur;

        $startDatum = $user?->startDatum
            ? \DateTime::createFromFormat('!d/m/Y', $user->startDatum)?->format('Y-m-d')
            : null;

        $endDatum = $user?->endDatum
            ? \DateTime::createFromFormat('!d/m/Y', $user->endDatum)?->format('Y-m-d')
            : null;

        $newlyFoundEarlierDatums = $incomingDatums
            ->filter(function ($item) use ($earliestDatumInDb, $startDatum, $endDatum, $startUur, $endUur) {

                $itemDate = \DateTime::createFromFormat('Y-m-d', $item['date']);

                if (!$itemDate) return false;

                if ($earliestDatumInDb && isset($earliestDatumInDb['date'])) {
                    $earliestDate = \DateTime::createFromFormat('Y-m-d', $earliestDatumInDb['date']);
                    if ($earliestDate && $itemDate >= $earliestDate) {
                        return false;
                    }
                }

                if ($startDatum) {
                    $start = \DateTime::createFromFormat('Y-m-d', $startDatum);
                    if ($start && $itemDate < $start) {
                        return false;
                    }
                }

                if ($endDatum) {
                    $end = \DateTime::createFromFormat('Y-m-d', $endDatum);
                    if ($end && $itemDate > $end) {
                        return false;
                    }
                }

                if (!empty($item['times']) && $startUur && $endUur) {
                    foreach ($item['times'] as $time) {
                        if ($time >= $startUur && $time <= $endUur) {
                            return true;
                        }
                    }
                    return false;
                }

                if ($startUur && $endUur && empty($item['times'])) {
                    return false;
                }

                return true;
            })

            ->sortBy('date');

        $newDatumsToStore = $incomingDatums->sortBy('date')->values();
        if ($datum) {
            $datum->update(['olddatums' => $newDatumsToStore->toArray()]);
        } else {
            Datum::create(['olddatums' => $newDatumsToStore->toArray()]);
        }

        if ($newlyFoundEarlierDatums->isNotEmpty()) {
            $users = \App\Models\User::where('notification', false)->get();

            foreach ($users as $user) {
                Mail::to($user->email)->queue(new NewEarlierDateFound($newlyFoundEarlierDatums->toArray()));
                // TODO: Send WhatsApp notification
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