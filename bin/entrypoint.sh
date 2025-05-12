#!/bin/sh
if test -z "$ENVIRONMENT"; then
    # If ENVIRONMENT not set, assume local development
    export ENVIRONMENT=dev
fi

# if [ "$OFFLINE" = "1" ]
# then
#     exec bundle exec "$@"
# else
    # Use Chamber to inject secrets via environment variables.
echo "Running chamber env export..."
chamber_vars=$(chamber exec idseq-sandbox-web -- env) || {
  echo "❌ chamber failed"; exit 1;
}

echo "$chamber_vars" | while IFS='=' read -r k v; do
  export "$k=$v"
done

env | grep -E 'RAILS|REDIS|AWS'

exec bundle exec "$@"
# fi
