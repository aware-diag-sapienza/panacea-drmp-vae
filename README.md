# DRMP VAE &middot; [![GitHub license](https://img.shields.io/badge/license-LGPLv3-blue.svg)](./LICENSE)

The Visual Analytics Environment for the Dynamic Risk Management Platform of the EU H2020 [PANACEA](https://www.panacearesearch.eu/) research project.

The environment requires [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/) and some modules of the platform (more information coming soon) to work properly.

A set of scripts (available at [bin/](./bin/)) are provided to develop and deploy the environment.

## Installation

Create the configuration files for production in [conf/](./conf/) copying all the `*dev*` files, renaming the copies to `*prod*` and updating their content (e.g., duplicate `db.dev.env`, rename the copy to `db.prod.env` and update its content).

Available scripts:
- [bin/pull.sh](./bin/pull.sh) - pulls the needed Docker images
- [bin/build.sh](./bin/build.sh) - builds the Docker containers
- [bin/install.sh](./bin/install.sh) - installs the Node dependencies of the two main containers (required every time that their dependencies are updated); the first installation can take a long time

## Development

- [bin/start.sh](./bin/start.sh) - runs the environment in development mode

## Production

### Standalone (it still needs the Storage Gateway to work)

Available scripts:
- [bin/pack.sh](./bin/pack.sh) - packs the environment for production in standalone mode into the `dist` folder
- [bin/serve.sh](./bin/serve.sh) - runs the environment in production mode in standalone mode

### Integrated in the PANACEA DRMP

Create `Dockerfile` and `run.sh` files duplicating [deploy/Dockerfile](./deploy/Dockerfile) and [deploy/run.sh](./deploy/run.sh) and update their environment variables (this mode doesn't use Docker Compose).

Available scripts:
- [bin/deploy.sh](./bin/deploy.sh) - packs the environment for production in integrated mode into the `deploy` folder
- [deploy/run.sh](./deploy/run.sh) - runs the environment in production mode in integrated mode

## Utils

Available scripts:
- [bin/stop.sh](./bin/stop.sh) - stops and removes all the containers of the environment (both for development and production modes)
- [bin/uninstall.sh](./bin/uninstall.sh) - uninstalls the environment and remove the generated Docker images
