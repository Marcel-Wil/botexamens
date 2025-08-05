<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\EnrollmentAutoInschrijven;
use App\Models\User;

class ManageEnrollment extends Command
{
    // Define the command signature with required arguments and descriptions
    protected $signature = 'enrollment:manage 
                            {action : enroll|unenroll} 
                            {center : autoveiligheid|sbat} 
                            {user_id : The ID of the user}';

    protected $description = 'Enroll or unenroll a user in Autoveiligheid or SBAT';

    public function handle(): int
    {
        $action = strtolower($this->argument('action'));
        $centerInput = strtolower($this->argument('center'));
        $userId = $this->argument('user_id');

        // Normalize center name to match database value format
        $validCenters = [
            'autoveiligheid' => 'Autoveiligheid',
            'sbat' => 'SBAT',
        ];

        if (!array_key_exists($centerInput, $validCenters)) {
            $this->error("Invalid exam center. Allowed values: autoveiligheid, sbat.");
            return self::FAILURE;
        }

        $center = $validCenters[$centerInput];

        $user = User::find($userId);
        if (!$user) {
            $this->error("User with ID {$userId} not found.");
            return self::FAILURE;
        }

        if ($action === 'enroll') {
            EnrollmentAutoInschrijven::firstOrCreate([
                'user_id' => $user->id,
                'examencentrum' => $center,
            ]);
            $this->info("{$user->name} has been enrolled in {$center}.");
        } elseif ($action === 'unenroll') {
            EnrollmentAutoInschrijven::where('user_id', $user->id)
                ->where('examencentrum', $center)
                ->delete();
            $this->info("{$user->name} has been unenrolled from {$center}.");
        } else {
            $this->error("Invalid action. Allowed values: enroll, unenroll.");
            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}