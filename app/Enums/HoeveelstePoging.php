<?php

namespace App\Enums;

enum HoeveelstePoging: string
{
    case ONEORTWO = 'oneOrTwo';
    case THREEORMORE = 'threeOrMore';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}