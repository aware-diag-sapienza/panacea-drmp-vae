#!/bin/bash

(
source "$(dirname $0)/_env.sh"
source "$(dirname $0)/stop.sh"
rm -rf $DIR/client/node_modules
rm -rf $DIR/server/node_modules
rm -rf $DIR/server/logs
rm -rf $DIR/dist/node_modules
rm -rf $DIR/dist/logs
rm -rf $DIR/deploy/node_modules
rm -rf $DIR/deploy/logs
docker image rm "${COMPOSE_PROJECT_NAME}_client" "${COMPOSE_PROJECT_NAME}_server" "${COMPOSE_PROJECT_NAME}_dist_server"
)
