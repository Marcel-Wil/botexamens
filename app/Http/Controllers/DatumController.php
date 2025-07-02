<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Datum;

class DatumController extends Controller
{
    public function compare(Request $request)
    {
        $request->validate([
            'newdatums' => 'required|array',
        ]);

        $new = array_values($request->input('newdatums'));

        $datum = Datum::latest()->first();

        if (!$datum) {
            return response()->json([
                'message' => 'No old data found.',
                'new_items' => $new,
                'has_changes' => true
            ]);
        }

        $old = array_values($datum->olddatums);

        $diff = array_diff($new, $old);

        return response()->json([
            'new_items' => array_values($diff),
            'has_changes' => !empty($diff)
        ]);
    }
}
