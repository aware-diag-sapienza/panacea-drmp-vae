#!/bin/bash

(
if [ $# -eq 0 ]; then
  source "$(dirname $0)/_dev.sh"
  docker-compose -f $COMPOSE/app.yml down --remove-orphans
  source "$(dirname $0)/_prod.sh"
  docker-compose -f $COMPOSE/dist.yml down --remove-orphans
else
  for serv in "$@"; do
    if [[ " client server db redis " =~ .*\ $serv\ .* ]]; then
      source "$(dirname $0)/_dev.sh"
      docker-compose -f $COMPOSE/app.yml stop "${COMPOSE_PROJECT_NAME}_${serv}"
    fi
    if [[ " dist_server dist_db dist_redis " =~ .*\ $serv\ .* ]]; then
      source "$(dirname $0)/_prod.sh"
      docker-compose -f $COMPOSE/dist.yml stop "${COMPOSE_PROJECT_NAME}_${serv}"
    fi
  done
fi  
  )
