#!/bin/bash

(
source "$(dirname $0)/_prod.sh"
docker-compose -f $COMPOSE/app.yml -f $COMPOSE/app.prod.yml run --no-deps server npm run build
docker-compose -f $COMPOSE/app.yml -f $COMPOSE/app.prod.yml run --no-deps client npm run build
docker-compose -f $COMPOSE/app.yml -f $COMPOSE/app.prod.yml down
cp -p $DIR/server/package.json $DIR/dist
cp -pr $DIR/server/build/* $DIR/dist
mkdir -p $DIR/dist/client && cp -pr $DIR/client/build/* $DIR/dist/client
docker-compose -f $COMPOSE/dist.yml run dist_server npm install
docker-compose -f $COMPOSE/dist.yml down
)
