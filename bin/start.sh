#!/bin/bash

(
source "$(dirname $0)/_dev.sh"
docker-compose -f $COMPOSE/app.yml -f $COMPOSE/app.dev.yml -f $COMPOSE/start.yml up
)
