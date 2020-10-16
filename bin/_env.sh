#!/bin/bash

set -a
DIR="$( dirname $( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd ))"
COMPOSE="$DIR/compose"
source $DIR/conf/common.env
source $DIR/conf/hosts.env
