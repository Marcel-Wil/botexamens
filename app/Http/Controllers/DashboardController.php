<?php

namespace App\Http\Controllers;

use App\Models\Datum;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $latestDatumEntry = Datum::latest()->first();
        $earliestDate = null;

        if ($latestDatumEntry && !empty($latestDatumEntry->olddatums)) {
            $dates = $latestDatumEntry->olddatums;

            $carbonDates = array_map(function ($dateObject) {
                try {
                    return Carbon::parse($dateObject['date']);
                } catch (\Exception $e) {
                    return null;
                }
            }, $dates);

            $futureDates = array_filter($carbonDates, function ($date) {
                return $date && ($date->isFuture() || $date->isToday());
            });

            if (!empty($futureDates)) {
                $earliestDate = min($futureDates);
            }
        }

        return Inertia::render('dashboard', [
            'latestDate' => $earliestDate ? $earliestDate->toIso8601String() : null,
        ]);
    }
}

