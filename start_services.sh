#!/bin/bash
# Start Laravel server, npm dev, and queue worker in background, logging PIDs

# Start php artisan serve
echo "Starting Laravel server..."
php artisan serve > script/laravel_server.log 2>&1 &
echo $! > script/laravel_server.pid

# Start npm run dev
echo "Starting npm dev..."
npm run dev > script/npm_dev.log 2>&1 &
echo $! > script/npm_dev.pid

# Start queue worker
echo "Starting Laravel queue worker..."
php artisan queue:work > script/queue_worker.log 2>&1 &
echo $! > script/queue_worker.pid

echo "All services started."
