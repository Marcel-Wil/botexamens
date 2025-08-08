<?php

namespace App\Enums;

enum TypeVoorlopigRijbewijs: string
{
    case TWELVEMONTHS = '12 maand';
    case EIGHTHEENMONTHS = '18 maand';
    case THIRTYSIXMONTHS = '36 maand';
    case MODEL3 = 'Model 3';
    case STAGEATTEST = 'Stageattest';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}