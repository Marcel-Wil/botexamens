<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        City::truncate();

        $cities = [
            ['name' => 'Deurne', 'code' => '1004'],
            ['name' => 'Alken', 'code' => '1005'],
            ['name' => 'Kontich', 'code' => '1022'],
            ['name' => 'Geel', 'code' => '1023'],
            ['name' => 'Haasrode', 'code' => '1024'],
            ['name' => 'Bree', 'code' => '1033'],

            // SBAT exam centers
            ['name' => 'Sint-Denijs-Westrem', 'code' => '1'],
            ['name' => 'Brakel', 'code' => '7'],
            ['name' => 'Eeklo', 'code' => '8'],
            ['name' => 'Erembodegem', 'code' => '9'],
            ['name' => 'Sint-Niklaas', 'code' => '10'],
        ];

        foreach ($cities as $city) {
            City::create($city);
        }
    }
}