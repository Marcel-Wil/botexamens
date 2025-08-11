<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewEarlierDateFound extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public array $earlierDatums;
    public string $city;

    public function __construct(array $earlierDatums, string $city)
    {
        $this->earlierDatums = $earlierDatums;
        $this->city = $city;
    }

    public function build()
    {
        $subject = 'New Earlier Date Detected';
        if (!empty($this->city)) {
            $subject .= ' in ' . $this->city;
        }

        return $this->subject($subject)
            ->view('emails.new_earlier_date')
            ->with([
                'earlierDatums' => $this->earlierDatums,
                'city' => $this->city
            ]);
    }
}
