![Docker builder](https://github.com/gperdomor/nx-tools/workflows/Docker%20builder/badge.svg)

# nx-docker

This builder provides a wrapper around github [docker action](https://github.com/docker/build-push-action)

## Getting started

The first step is configure the builder in your `angular.json` or `workspace.json`, so add something like this to every project you need to dockerize:

```
"docker": {
  "builder": "@gperdomor/nx-docker:build",
  "options": {
    "repository": "gperdomor/api",
    "socket": "/var/run/docker.sock" // required to run local builds in your machine, make sure docker is running
  }
}
```

You can customize your ci using environment variables

```
"docker": {
  "builder": "@gperdomor/nx-docker:build",
  "options": {
    "repository": "$PROJECT_PATH/api",
    "dockerfile": "apps/api/Dockerfile",
    "registry": "$CI_REGISTRY",
    "username": "$CI_REGISTRY_USER",
    "password": "$CI_REGISTRY_PASSWORD",
    "tags": "latest",
    "push": true,
    "socket": "/var/run/docker.sock"
  }
}
```

To check all posible options please check the official [docker action](https://github.com/docker/build-push-action) or this [schema.json](src/builders/nx-docker/schema.json) file

### Use with Gitlab CI

To use with Gitlab CI just only need add something like this to your pipeline:

```
build:
  image: gperdomor/nx-docker:19.03.12-node-14.8-alpine
  services:
    - docker:19.03.12-dind
  variables:
    GIT_DEPTH: 0
    DOCKER_TLS_CERTDIR: '/certs'
  script:
    - npm i
    - npm run nx affected -- --target=docker --base=remotes/origin/master
```

Because this is a wrapper of the Github Action, you need set `GITHUB_SHA` and `GITHUB_REF` if `tag_with_sha: true` and `tag_with_ref: true`

Also you need configure other enviroment variables depending on your builder options,

### Use with Github Actions

To use with Github Actions just only need add something like this to your workflow

```
name: Build
# This workflow is triggered on pushes to the repository.
on: [push]

jobs:
  build:
    name: Docker build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v1
        with:
          node-version: 13.x

      - name: Install dependencies
        run: npm ci

      - name: 'nx build'
        run: npm run nx affected -- --target=docker --all
        env: # Add custom variables needed
          CI_REGISTRY: docker.pkg.github.com
          CI_PROJECT_PATH: ${{ github.repository }}
          CI_REGISTRY_USER: gperdomor
          CI_REGISTRY_PASSWORD: ${{ github.token }}

```
