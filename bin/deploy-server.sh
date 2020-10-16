#!/bin/bash

(
source "$(dirname $0)/_prod.sh"
docker-compose -f $COMPOSE/app.yml -f $COMPOSE/app.prod.yml run --no-deps server npm run build
docker-compose -f $COMPOSE/app.yml -f $COMPOSE/app.prod.yml down
cp -p $DIR/server/package.json $DIR/deploy/app
cp -pr $DIR/server/build/* $DIR/deploy/app
)
