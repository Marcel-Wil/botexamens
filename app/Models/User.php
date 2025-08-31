<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\HoeveelstePoging;
use App\Enums\TypeVoorlopigRijbewijs;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /** @var list<string> */
    protected $fillable = [
        'voornaam',
        'achternaam',
        'email',
        'password',
        'whatsapp',
        'startDatum',
        'endDatum',
        'startUur',
        'endUur',
        'rrn',
        'gbdatum',
        'tel',
        'adres',
        'postcode',
        'zeersteVRijbewijsDatum',
        'zhuidigVRijbewijsDatum',
        'zhuidigVRijbewijsGeldigTot',
        'sbat_email',
        'sbat_password',
        'datum_slagen_theorieB',
        'type_voorlopig_rijbewijs',
        'afgiftedatum_voorlopig_rijbewijsB',
        'hoeveelste_poging',
        'send_notifications',
    ];

    /** @var list<string> */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'type_voorlopig_rijbewijs' => TypeVoorlopigRijbewijs::class,
            'hoeveelste_poging' => HoeveelstePoging::class,
        ];
    }

    public function enrollmentAutoInschrijven(): HasMany
    {
        return $this->hasMany(EnrollmentAutoInschrijven::class);
    }

    public function cities(): BelongsToMany
    {
        return $this->belongsToMany(City::class);
    }
}
