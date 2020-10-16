#!/bin/bash

(
source "$(dirname $0)/uninstall.sh"
source "$(dirname $0)/_dev.sh"
docker-compose -f $COMPOSE/app.yml build --no-cache
source "$(dirname $0)/_prod.sh"
docker-compose -f $COMPOSE/dist.yml build --no-cache
)
