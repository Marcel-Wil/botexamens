<?php

namespace App\Traits;

use App\Jobs\ProcessAutoEnrollment;
use App\Mail\NewEarlierDateFound;
use App\Models\City;
use App\Models\Datum;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;

trait ProcessesDatums
{
    protected function processNotifications(Request $request, string $type): array
    {
        $incomingDatums = $type === 'sbat'
            ? $this->parseAndValidateSbatDatums($request)
            : $this->parseAndValidateDatums($request);

        $city = City::where('name', $request->city)->firstOrFail();
        $datum = Datum::where('city_id', $city->id)->latest()->first();

        $usersSubscribedToCity = $city->users;
        $existingDatums = collect($datum->olddatums ?? []);
        $earliestDatumInDb = $existingDatums->sortBy('date')->first();

        $allNewlyFoundDatums = $this->processUsersForEarlierDatums(
            $usersSubscribedToCity,
            $incomingDatums,
            $earliestDatumInDb,
            $city,
            $type
        );

        $foundNewerDatums = $allNewlyFoundDatums->isNotEmpty();
        $this->updateDatums($datum, $incomingDatums, $city->id);

        if ($foundNewerDatums) {
            return [
                'message' => "New earlier dates found for {$city->name} and notifications sent.",
                'earlier_datums' => $allNewlyFoundDatums->unique('date')->values(),
            ];
        }

        return [
            'message' => "No new earlier dates found for {$city->name}.",
            'earliest_in_db' => $earliestDatumInDb,
        ];
    }

    protected function processUsersForEarlierDatums(
        Collection $users,
        Collection $incomingDatums,
        ?array $earliestDatumInDb,
        City $city,
        string $type
    ): Collection {
        return $users
            ->map(function (User $user) use ($incomingDatums, $earliestDatumInDb, $city, $type) {
                $filters = $this->getFilterParameters($user);
                $newlyFoundEarlierDatums = $this->findNewlyFoundEarlierDatums(
                    $incomingDatums,
                    $earliestDatumInDb,
                    $filters
                );

                if ($newlyFoundEarlierDatums->isEmpty()) {
                    return collect();
                }

                $this->processUserNotificationsAndEnrollments($user, $city, $type, $newlyFoundEarlierDatums);

                return $newlyFoundEarlierDatums;
            })
            ->flatten(1);
    }

    protected function processUserNotificationsAndEnrollments(
        User $user,
        City $city,
        string $type,
        Collection $newlyFoundEarlierDatums
    ): void {
        if ($user->send_notifications) {
            $this->sendNotifications($newlyFoundEarlierDatums, $user, $city->name);
        }

        $this->processEnrollments($user, $city, $type, $newlyFoundEarlierDatums);
    }

    protected function processEnrollments(
        User $user,
        City $city,
        string $type,
        Collection $newlyFoundEarlierDatums
    ): void {
        $enrollments = $user->enrollmentAutoInschrijven;

        if ($enrollments->isEmpty()) {
            return;
        }

        foreach ($enrollments as $enrollment) {
            if ($type === 'autoveiligheid' && $enrollment->examencentrum === 'Autoveiligheid') {
                ProcessAutoEnrollment::dispatch($user, $city);
            }
            // TODO: SBAT processing can be added here when implemented
        }
    }

    protected function handleEmptyDatums(Request $request): void
    {
        $city = City::where('name', $request->city)->firstOrFail();
        $datum = Datum::where('city_id', $city->id)->latest()->first();
        $this->updateDatums($datum, collect(), $city->id);
        abort(response()->json(['message' => 'No dates provided.'], 400));
    }

    protected function getFilterParameters(?User $user): array
    {
        $startDatum = $user?->startDatum
            ? DateTime::createFromFormat('!d/m/Y', $user->startDatum)?->format('Y-m-d')
            : null;

        $endDatum = $user?->endDatum
            ? DateTime::createFromFormat('!d/m/Y', $user->endDatum)?->format('Y-m-d')
            : null;

        return [
            'startDatum' => $startDatum,
            'endDatum' => $endDatum,
            'startUur' => $user?->startUur,
            'endUur' => $user?->endUur,
        ];
    }

    protected function findNewlyFoundEarlierDatums(
        Collection $incomingDatums,
        ?array $earliestDatumInDb,
        array $filters
    ): Collection {
        return $incomingDatums->filter(function ($item) use ($earliestDatumInDb, $filters) {
            $itemDate = DateTime::createFromFormat('Y-m-d', $item['date']);

            if (!$itemDate) {
                return false;
            }

            if (!$this->isEarlierThanExisting($itemDate, $earliestDatumInDb)) {
                return false;
            }

            if (!$this->isWithinDateRange($itemDate, $filters)) {
                return false;
            }

            return $this->isWithinTimeRange($item, $filters);
        })->sortBy('date');
    }

    private function isEarlierThanExisting(DateTime $itemDate, ?array $earliestDatumInDb): bool
    {
        if (!$earliestDatumInDb || !isset($earliestDatumInDb['date'])) {
            return true;
        }

        $earliestDate = DateTime::createFromFormat('Y-m-d', $earliestDatumInDb['date']);

        return $earliestDate ? $itemDate < $earliestDate : true;
    }

    private function isWithinDateRange(DateTime $itemDate, array $filters): bool
    {
        if ($filters['startDatum']) {
            $startDate = DateTime::createFromFormat('Y-m-d', $filters['startDatum']);
            if ($startDate && $itemDate < $startDate) {
                return false;
            }
        }

        if ($filters['endDatum']) {
            $endDate = DateTime::createFromFormat('Y-m-d', $filters['endDatum']);
            if ($endDate && $itemDate > $endDate) {
                return false;
            }
        }

        return true;
    }

    private function isWithinTimeRange(array $item, array $filters): bool
    {
        if (!$filters['startUur'] || !$filters['endUur']) {
            return true;
        }

        if (empty($item['times'])) {
            return false;
        }

        return collect($item['times'])->contains(
            fn($time) => $time >= $filters['startUur'] && $time <= $filters['endUur']
        );
    }

    protected function updateDatums(?Datum $datum, Collection $incomingDatums, int $cityId): void
    {
        $newDatumsToStore = $incomingDatums->sortBy('date')->values()->toArray();

        if ($datum) {
            $datum->update(['olddatums' => $newDatumsToStore]);
            return;
        }

        Datum::create([
            'city_id' => $cityId,
            'olddatums' => $newDatumsToStore,
        ]);
    }

    protected function sendNotifications(Collection $newlyFoundEarlierDatums, User $user, string $cityName): void
    {
        Mail::to($user->email)->queue(new NewEarlierDateFound(
            $newlyFoundEarlierDatums->toArray(),
            $cityName
        ));
    }

}