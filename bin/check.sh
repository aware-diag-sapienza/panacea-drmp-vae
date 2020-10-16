#!/bin/bash

(
source "$(dirname $0)/_env.sh"
docker-compose -f $COMPOSE/common.yml -f $COMPOSE/services.yml -f $COMPOSE/dev.yml -f $COMPOSE/start.yml config
)
