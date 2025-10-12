#!/bin/sh

# wait-for-db.sh
# Usage: ./wait-for-db.sh <host> <command...>

HOST="$1"
shift
CMD="$@"

echo "Waiting for database at $HOST..."

# Loop until the DB port is open
while ! nc -z "$HOST" 5432; do
  echo "Database is unavailable, sleeping 2 seconds..."
  sleep 2
done

echo "Database is up, starting backend..."
exec $CMD
