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
echo "running chamber"
eval $(chamber exec idseq-sandbox-web -- env | sed 's/^/export /')
env
bundle exec "$@"
echo "chamber completed"
# fi
