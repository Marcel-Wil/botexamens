<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewEarlierDateFound extends Mailable
{
    use Queueable, SerializesModels;

    public $earlierDate;

    public function __construct($earlierDate)
    {
        $this->earlierDate = $earlierDate;
    }

    public function build()
    {
        return $this->subject('New Earlier Date Detected')
            ->view('emails.new_earlier_date')
            ->with([
                'earlierDate' => $this->earlierDate,
            ]);
    }
}
