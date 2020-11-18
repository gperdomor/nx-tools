# @nx-tools/nx-docker

> This docs refer to version 1.0.0@alpha.x

This builder provides the tools needed to build and push Docker images with Buildx.

## Getting started

The first step is install this package

```bash
npm i -D @nx-tools/nx-docker@next
```

Then configure the builder in your `angular.json` or `workspace.json`, so add something like this to every project you need to dockerize:

```json
"docker": {
  "builder": "@nx-tools/nx-docker:build",
  "options": {
    "push": true,
    "file": "apps/api/Dockerfile",
    "tags": ["your-org/api:latest"],
    "platforms": ["linux/amd64", "linux/arm64"],
  }
}
```

This build not handle registry login steps, so if you wanna push your docker images, please run `docker login` first.

## Advanced usage

### Push to multi-registries

The following config will connect you to [DockerHub](https://github.com/docker/login-action#dockerhub)
and [GitHub Container Registry](https://github.com/docker/login-action#github-container-registry) and push the
image to these registries.

<details>
  <summary><b>Show config</b></summary>

```json
"docker": {
  "builder": "@nx-tools/nx-docker:build",
  "options": {
    "file": "apps/api/Dockerfile",
    "push": true,
    "tags": [
      "user/app:latest",
      "user/app:1.0.0",
      "ghcr.io/user/app:latest",
      "ghcr.io/user/app:1.0.0"
    ]
  }
}
```

</details>

### Export image to Docker

You may want your build result to be available in the Docker client through `docker images` to be able to use it
in another step of your workflow:

<details>
  <summary><b>Show config</b></summary>

```json
"docker": {
  "builder": "@nx-tools/nx-docker:build",
  "options": {
    "file": "apps/api/Dockerfile",
    "load": true,
    "tags": ["user/app:latest"]
  }
}
```

</details>

### Multi-platform image

You can build your apps for multiple platform, like linux/amd64, linux/arm64, linux/386

<details>
  <summary><b>Show config</b></summary>

```json
"docker": {
  "builder": "@nx-tools/nx-docker:build",
  "options": {
    "file": "apps/api/Dockerfile",
    "push": true,
    "tags": ["user/app:latest"],
    "platforms": ["linux/amd64", "linux/arm64", "linux/386"],
  }
}
```

</details>

### Use automatic metadata

You can enable metadata extraction to extract metadata (tags, labels) for Docker. We have two modes to build labels and tags

Mode:

- prepend: take care of the extracted medatada and later append the labels/tags from the angular.json builder config ((or env vars))
- append: take care of your labels/tags from the angular.json builder config (or env vars) and then append the extracted medatada.

<details>
  <summary><b>Show config</b></summary>

```json
"docker": {
  "builder": "@nx-tools/nx-docker:build",
  "options": {
    "file": "apps/api/Dockerfile",
    "push": true,
    "tags": ["user/app:latest"],
    "meta": {
      "enabled": true,
      "mode": "prepend"
    }
  }
}
```

</details>

## Customizing

This builder can be customized using environment variables and values in your `angular.json/workspace.json` and always env variables takes precedence

> Note: all environmet values should be prefixed with `INPUT_` so `INPUT_PUSH=true` will replace the `"push": false` configuration of your `angular.json/workspace.json` file

> Note: For list values use a comma-delimited string, like `INPUT_TAGS=user/app:v1,user/app:latest`

Following inputs can be used as `step.with` keys

| Name           | Type           | Description                                                                                                                                                                       |
| -------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `builder`      | String         | Builder instance (see [setup-buildx](https://github.com/docker/setup-buildx-action) action)                                                                                       |
| `context`      | String         | Build's context is the set of files located in the specified [`PATH` or `URL`](https://docs.docker.com/engine/reference/commandline/build/) (default [Git context](#git-context)) |
| `file`         | String         | Path to the Dockerfile (default `./Dockerfile`)                                                                                                                                   |
| `build-args`   | List           | List of build-time variables                                                                                                                                                      |
| `labels`       | List           | List of metadata for an image                                                                                                                                                     |
| `tags`         | List/CSV       | List of tags                                                                                                                                                                      |
| `pull`         | Bool           | Always attempt to pull a newer version of the image (default `false`)                                                                                                             |
| `target`       | String         | Sets the target stage to build                                                                                                                                                    |
| `allow`        | List/CSV       | List of [extra privileged entitlement](https://github.com/docker/buildx#--allowentitlement) (eg. `network.host,security.insecure`)                                                |
| `no-cache`     | Bool           | Do not use cache when building the image (default `false`)                                                                                                                        |
| `platforms`    | List/CSV       | List of [target platforms](https://github.com/docker/buildx#---platformvaluevalue) for build                                                                                      |
| `load`         | Bool           | [Load](https://github.com/docker/buildx#--load) is a shorthand for `--output=type=docker` (default `false`)                                                                       |
| `push`         | Bool           | [Push](https://github.com/docker/buildx#--push) is a shorthand for `--output=type=registry` (default `false`)                                                                     |
| `outputs`      | List           | List of [output destinations](https://github.com/docker/buildx#-o---outputpath-typetypekeyvalue) (format: `type=local,dest=path`)                                                 |
| `cache-from`   | List           | List of [external cache sources](https://github.com/docker/buildx#--cache-fromnametypetypekeyvalue) (eg. `type=local,src=path/to/dir`)                                            |
| `cache-to`     | List           | List of [cache export destinations](https://github.com/docker/buildx#--cache-tonametypetypekeyvalue) (eg. `type=local,dest=path/to/dir`)                                          |
| `secrets`      | List           | List of secrets to expose to the build (eg. `key=value`, `GIT_AUTH_TOKEN=mytoken`)                                                                                                |
| `ssh`          | List           | List of SSH agent socket or keys to expose to the build                                                                                                                           |
| `meta.enabled` | Bool           | Enable metadata extraction from git context. (default `false`)                                                                                                                    |
| `meta.mode`    | prepend/append | MEtadata extraction mode. (default `prepend`)                                                                                                                                     |

To check all possible options please check this [schema.json](src/builders/nx-docker/schema.json) file

### Use with Gitlab CI

To use with Gitlab CI we provide a [custom node image](https://github.com/users/gperdomor/packages/container/package/nx-docker) with Docker and Buildx integrated. Just only need to use in your pipeline:

```yml
build:
  image: ghcr.io/gperdomor/nx-docker:14.15-alpine
  services:
    - docker:19.03.13-dind
  variables:
    GIT_DEPTH: 0
    DOCKER_TLS_CERTDIR: '/certs'
  script:
    - npm i
    - echo "$REGISTRY_PASSWORD" | docker login -u $REGISTRY_USER --password-stdin $CI_REGISTRY
    - npm run nx affected -- --target=docker --base=remotes/origin/master
```

> Note: Circle CI uses docker based pipelines so you can use this image as well

### Use with Github Actions

To use with Github Actions just only need add something like this to your workflow

```yml
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

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v1

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1

      - name: Login to DockerHub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: 'Install Dependencies'
        run: npm i

      - name: 'nx build'
        run: npm run nx affected -- --target=docker --all
```
