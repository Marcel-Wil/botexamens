#!/bin/bash
# Stop all started services using PID files

stop_service() {
  local name=$1
  local pidfile=script/${name}.pid
  if [ -f "$pidfile" ]; then
    pid=$(cat "$pidfile")
    if kill -0 $pid 2>/dev/null; then
      echo "Stopping $name (PID $pid)..."
      kill $pid
      rm "$pidfile"
    else
      echo "$name not running (PID $pid not found)."
      rm "$pidfile"
    fi
  else
    echo "$name PID file not found."
  fi
}

stop_service laravel_server
stop_service npm_dev
stop_service queue_worker

echo "All services stopped."
