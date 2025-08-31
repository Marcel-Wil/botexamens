<?php

namespace App\Enums;

enum HoeveelstePoging: string
{
    case ONE_OR_TWO = 'oneOrTwo';
    case THREE_OR_MORE = 'threeOrMore';

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /** @return list<string> */
    public static function labels(): array
    {
        return [
            self::ONE_OR_TWO->value => '1e of 2e poging',
            self::THREE_OR_MORE->value => '3e poging of meer',
        ];
    }

    public function label(): string
    {
        return match ($this) {
            self::ONE_OR_TWO => '1e of 2e poging',
            self::THREE_OR_MORE => '3e poging of meer',
        };
    }

    public static function fromValue(string $value): ?self
    {
        return collect(self::cases())->first(fn ($case) => $case->value === $value);
    }
}
