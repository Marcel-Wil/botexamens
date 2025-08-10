<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class EnrollNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:enroll-notifications {user_id} {status}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Enable or disable send_notifications for a user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('user_id');
        $status = strtolower($this->argument('status'));

        // Validate the status input
        if (!in_array($status, ['true', 'false', '1', '0'], true)) {
            $this->error("Invalid status. Use true/false or 1/0.");
            return 1;
        }

        $booleanStatus = filter_var($status, FILTER_VALIDATE_BOOLEAN);

        $user = User::find($userId);

        if (!$user) {
            $this->error("User with ID {$userId} not found.");
            return 1;
        }

        $user->send_notifications = $booleanStatus;
        $user->save();

        $this->info("User ID {$userId} send_notifications set to " . ($booleanStatus ? 'true' : 'false') . ".");
        return 0;
    }
}