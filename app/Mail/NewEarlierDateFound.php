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

    public function __construct(array $earlierDatums)
    {
        $this->earlierDatums = $earlierDatums;
    }

    public function build()
    {
        return $this->subject('New Earlier Date Detected')
            ->view('emails.new_earlier_date')
            ->with([
                'earlierDatums' => $this->earlierDatums,
            ]);
    }
}