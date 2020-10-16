#!/bin/bash

# See https://github.com/docker-library/mongo/pull/63

(
docker-compose -f $COMPOSE/app.yml run --rm --volumes-from db mongo unlink "/data/db/mongod.lock"
docker-compose -f $COMPOSE/app.yml run --rm --volumes-from db mongo --repair
)