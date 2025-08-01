<?php

namespace App\Jobs;

use App\Mail\EnrollmentSuccess;
use App\Models\City;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Process;

class ProcessAutoEnrollment implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $user;
    public $city;
    public $tries = 3;
    public $timeout = 600;
    public $failOnTimeout = true;

    public function __construct(User $user, City $city)
    {
        $this->user = $user;
        $this->city = $city;
    }

    public function uniqueId(): string
    {
        return $this->user->id;
    }

    /**
     * Execute the job.
     *
     * @return bool
     */
    public function handle(): bool
    {

        $pythonPath = env('PYTHON_PATH', base_path('.venv/bin/python3'));
        $scriptPath = base_path('script/auto_inschrijven.py');

        $command = [$pythonPath, $scriptPath, $this->user->id, $this->city->code];
        $process = Process::timeout(300)->run($command);

        if ($process->successful()) {
            $output = $process->output();
            if (str_contains($output, 'ENROLLMENT_SUCCESS')) {
                $enrollment = \App\Models\EnrollmentAutoInschrijven::where('user_id', $this->user->id)->first();
                if ($enrollment) {
                    $enrollment->delete();
                    Mail::to($this->user->email)->queue(new EnrollmentSuccess($this->user));
                }
                return true;
            } else {
                throw new \Exception("Failed to enroll user {$this->user->id}: Python script did not return ENROLLMENT_SUCCESS. Output: " . $output);
            }
        } else {
            throw new \Exception("Failed to enroll user {$this->user->id}: Python script execution failed.");
        }
    }
}