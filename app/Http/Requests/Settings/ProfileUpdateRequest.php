<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'voornaam' => ['string', 'max:255'],
            'achternaam' => ['string', 'max:255'],
            'email' => ['email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'whatsapp' => ['nullable', 'string', 'max:255'],
            'cities' => ['sometimes', 'array'],
            'cities.*' => ['integer', 'exists:cities,id'],
            'rrn' => ['nullable', 'string', 'max:11', 'min:11'],
            'gbdatum' => ['nullable', 'date_format:d/m/Y'],
            'tel' => ['nullable', 'string', 'max:255'],
            'adres' => ['nullable', 'string', 'max:255'],
            'postcode' => ['nullable', 'string', 'max:255'],
            'zeersteVRijbewijsDatum' => ['nullable', 'date_format:d/m/Y'],
            'zhuidigVRijbewijsDatum' => ['nullable', 'date_format:d/m/Y'],
            'zhuidigVRijbewijsGeldigTot' => ['nullable', 'date_format:d/m/Y'],
        ];
    }

}