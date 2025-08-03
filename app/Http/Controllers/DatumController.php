<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessAutoEnrollment;
use App\Mail\NewEarlierDateFound;
use App\Models\City;
use App\Models\EnrollmentAutoInschrijven;
use Illuminate\Http\Request;
use App\Models\Datum;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Collection;

class DatumController extends Controller
{
    public function compare(Request $request)
    {
        $request->validate([
            'newdatums' => 'array',
            'newdatums.*.date' => 'required|string',
            'newdatums.*.text' => 'required|string',
            'newdatums.*.times' => 'array',
            'city' => 'required|string',
        ]);

        $notification_response = $this->send_notifications($request);

        return response()->json([
            'notification_response' => $notification_response,
        ]);
    }

    public function compare_sbat(Request $request)
    {
        $request->validate([
            'newdatums' => 'array',
            'newdatums.*.date' => 'required|string',
            'newdatums.*.text' => 'required|string',
            'newdatums.*.times' => 'array',
            'city' => 'required|string',
        ]);

        $notification_response = $this->send_notifications_sbat($request);

        return response()->json([
            'notification_response' => $notification_response,
        ]);
    }

    public function send_notifications_sbat(Request $request)
    {
        $incomingDatums = $this->parseAndValidateDatums($request);
        $city = City::where('name', $request->city)->firstOrFail();
        $datum = Datum::where('city_id', $city->id)->latest()->first();

        $usersSubscribedToCity = $city->users;
        $existingDatums = collect($datum->olddatums ?? []);
        $earliestDatumInDb = $existingDatums->sortBy('date')->first();
        $foundNewerDatums = false;
        $allNewlyFoundDatums = collect();

        foreach ($usersSubscribedToCity as $user) {
            if (!$user->send_notifications) {
                continue;
            }
            $filters = $this->getFilterParameters($user);
            $newlyFoundEarlierDatums = $this->findNewlyFoundEarlierDatums($incomingDatums, $earliestDatumInDb, $filters);
            if ($newlyFoundEarlierDatums->isNotEmpty()) {
                $this->sendNotifications($newlyFoundEarlierDatums, $user);
                //TODO: Autoinschrijven voor SBAT
                $foundNewerDatums = true;
                $allNewlyFoundDatums = $allNewlyFoundDatums->merge($newlyFoundEarlierDatums);
            }
        }
        $this->updateDatums($datum, $incomingDatums, $city->id);

        if ($foundNewerDatums) {
            return response()->json([
                'message' => "New earlier dates found for {$city->name} and notifications sent.",
                'earlier_datums' => $allNewlyFoundDatums->unique('date')->values(),
            ]);
        }

        return response()->json([
            'message' => "No new earlier dates found for {$city->name}.",
            'earliest_in_db' => $earliestDatumInDb,
        ]);
    }


    public function send_notifications(Request $request)
    {
        $incomingDatums = $this->parseAndValidateDatums($request);
        $city = City::where('name', $request->city)->firstOrFail();
        $datum = Datum::where('city_id', $city->id)->latest()->first();

        $usersSubscribedToCity = $city->users;
        $existingDatums = collect($datum->olddatums ?? []);
        $earliestDatumInDb = $existingDatums->sortBy('date')->first();
        $foundNewerDatums = false;
        $allNewlyFoundDatums = collect();

        foreach ($usersSubscribedToCity as $user) {
            if (!$user->send_notifications) {
                continue;
            }
            $filters = $this->getFilterParameters($user);
            $newlyFoundEarlierDatums = $this->findNewlyFoundEarlierDatums($incomingDatums, $earliestDatumInDb, $filters);

            if ($newlyFoundEarlierDatums->isNotEmpty()) {
                $this->sendNotifications($newlyFoundEarlierDatums, $user);
                if ($user->enrollment_auto_inschrijven) {
                    ProcessAutoEnrollment::dispatch($user, $city);
                }
                $foundNewerDatums = true;
                $allNewlyFoundDatums = $allNewlyFoundDatums->merge($newlyFoundEarlierDatums);
            }
        }

        $this->updateDatums($datum, $incomingDatums, $city->id);

        if ($foundNewerDatums) {
            return response()->json([
                'message' => "New earlier dates found for {$city->name} and notifications sent.",
                'earlier_datums' => $allNewlyFoundDatums->unique('date')->values(),
            ]);
        }

        return response()->json([
            'message' => "No new earlier dates found for {$city->name}.",
            'earliest_in_db' => $earliestDatumInDb,
        ]);
    }

    private function findNewlyFoundEarlierDatumsSBAT(Collection $incomingDatums, ?array $earliestDatumInDb, array $filters)
    {

    }

    private function parseAndValidateDatums(Request $request): Collection
    {
        if (empty($request->input('newdatums'))) {
            $city = City::where('name', $request->city)->firstOrFail();
            $datum = Datum::where('city_id', $city->id)->latest()->first();
            $this->updateDatums($datum, collect(), $city->id);
            abort(response()->json(['message' => 'No dates provided.'], 400));
        }

        return collect($request->input('newdatums'))
            ->map(function ($item) {
                $date = \DateTime::createFromFormat('!d/m/Y', $item['date']);
                return $date ? ['date' => $date->format('Y-m-d'), 'text' => $item['text'], 'times' => $item['times'] ?? []] : null;
            })
            ->filter();
    }

    private function getFilterParameters(?User $user): array
    {
        $startDatum = $user?->startDatum ? \DateTime::createFromFormat('!d/m/Y', $user->startDatum)?->format('Y-m-d') : null;
        $endDatum = $user?->endDatum ? \DateTime::createFromFormat('!d/m/Y', $user->endDatum)?->format('Y-m-d') : null;

        return ['startDatum' => $startDatum, 'endDatum' => $endDatum, 'startUur' => $user?->startUur, 'endUur' => $user?->endUur];
    }

    private function findNewlyFoundEarlierDatums(Collection $incomingDatums, ?array $earliestDatumInDb, array $filters): Collection
    {
        return $incomingDatums->filter(function ($item) use ($earliestDatumInDb, $filters) {
            $itemDate = \DateTime::createFromFormat('Y-m-d', $item['date']);
            if (!$itemDate)
                return false;

            if ($earliestDatumInDb && isset($earliestDatumInDb['date'])) {
                $earliestDate = \DateTime::createFromFormat('Y-m-d', $earliestDatumInDb['date']);
                if ($earliestDate && $itemDate >= $earliestDate)
                    return false;
            }

            if ($filters['startDatum'] && $itemDate < \DateTime::createFromFormat('Y-m-d', $filters['startDatum']))
                return false;
            if ($filters['endDatum'] && $itemDate > \DateTime::createFromFormat('Y-m-d', $filters['endDatum']))
                return false;

            if (!empty($item['times']) && $filters['startUur'] && $filters['endUur']) {
                return collect($item['times'])->contains(fn($time) => $time >= $filters['startUur'] && $time <= $filters['endUur']);
            }

            return !($filters['startUur'] && $filters['endUur'] && empty($item['times']));
        })->sortBy('date');
    }

    private function updateDatums(?Datum $datum, Collection $incomingDatums, int $cityId): void
    {
        $newDatumsToStore = $incomingDatums->sortBy('date')->values()->toArray();
        if ($datum) {
            $datum->update(['olddatums' => $newDatumsToStore]);
        } else {
            Datum::create(['city_id' => $cityId, 'olddatums' => $newDatumsToStore]);
        }
    }

    private function sendNotifications(Collection $newlyFoundEarlierDatums, User $user): void
    {
        Mail::to($user->email)->queue(new NewEarlierDateFound($newlyFoundEarlierDatums->toArray()));
        // TODO: Send WhatsApp notification
    }
}