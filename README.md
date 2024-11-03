# Clear the contents of the Laravel log file
Clear-Content -Path "storage/logs/laravel.log"

# Tail the log file to continuously read it as new content is added
Get-Content -Path "storage/logs/laravel.log" -Wait

# Remove the log file
Remove-Item -Path "storage/logs/*.log"

# How To Custom for clear the log file
1. First, create a new artisan command:
=> cmd: php artisan make:command ClearLogs

2. In the generated file located at app/Console/Commands/ClearLogs.php, modify the handle method like this:

php code:
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use File;

class ClearLogs extends Command
{
    protected $signature = 'log:clear';

    protected $description = 'Clear the log files';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        File::put(storage_path('logs/laravel.log'), '');
        $this->info('Logs have been cleared!');
    }
}

Now you can clear log by cmd:
=> cmd: php artisan log:clear

# step to create send OTP to email 
+ cmd: php artisan make:mail SendOtpMail





################################################################
## web-push configuration: 








