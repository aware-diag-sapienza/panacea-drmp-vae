#!/bin/bash

(
source "$(dirname $0)/_prod.sh"
docker-compose -f $COMPOSE/dist.yml up
)
