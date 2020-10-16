#!/bin/bash

(
if [[ " client server db redis " =~ .*\ $1\ .* ]]; then
  echo "ao"
  source "$(dirname $0)/_dev.sh"
  docker-compose -f $COMPOSE/app.yml run "${1}"
fi
if [[ " dist_server dist_db dist_redis " =~ .*\ $1\ .* ]]; then
  source "$(dirname $0)/_prod.sh"
  docker-compose -f $COMPOSE/dist.yml run "${1}"
fi
)
