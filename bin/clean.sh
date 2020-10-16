#!/bin/bash

(
source "$(dirname $0)/_env.sh"
rm -rf $DIR/db/data
rm -rf $DIR/client/build
rm -rf $DIR/server/build
find $DIR/dist/* ! -name 'client' -type d -exec rm -rf {} +
find $DIR/dist/* ! -name 'Dockerfile' ! -name 'pm2.json' -type f -exec rm -f {} +
)
