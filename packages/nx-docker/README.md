## About

This builder provides the tools needed to build and push Docker images with [Buildx](https://github.com/docker/buildx) with full support of the
features provided by [Moby BuildKit](https://github.com/moby/buildkit) builder toolkit. This includes multi-platform
build, secrets, remote cache, etc. and different builder deployment/namespacing options.

---

- [Usage](#usage)
- [Advanced usage](#advanced-usage)
  - [Multi-platform image](docs/advanced/multi-platform.md)
  - [Isolated builders](docs/advanced/isolated-builders.md)
  - [Push to multi-registries](docs/advanced/push-multi-registries.md)
  - [Cache](docs/advanced/cache.md)
  - [Local registry](docs/advanced/local-registry.md)
  - [Export image to Docker](docs/advanced/export-docker.md)
  - [Handle tags and labels](docs/advanced/tags-labels.md)
- [Customizing](#customizing)
  - [inputs](#inputs)
- [Usage with CI](#usage-with-ci)
  - [GitLab CI](#gitlab-ci)
  - [GitHub Actions](#github-actions)
- [Troubleshooting](#troubleshooting)

## Usage

The first step is install this package

```bash
npm i -D @nx-tools/nx-docker
```

Then configure the builder in your `angular.json` or `workspace.json`, so add something like this to every project you need to dockerize:

```json
  "docker": {
    "executor": "@nx-tools/nx-docker:build",
    "options": {
      "push": true,
      "tags": ["your-org/api:latest", "your-org/api:v1"],
    }
  }
```

By default, this builder uses the `Dockerfile` file inside the app folder which are tried to build.

This build not handle registry login steps, so if you wanna push your docker images, please run `docker login` first.

## Advanced usage

- [Multi-platform image](docs/advanced/multi-platform.md)
- [Isolated builders](docs/advanced/isolated-builders.md)
- [Push to multi-registries](docs/advanced/push-multi-registries.md)
- [Cache](docs/advanced/cache.md)
- [Local registry](docs/advanced/local-registry.md)
- [Export image to Docker](docs/advanced/export-docker.md)
- [Handle tags and labels](docs/advanced/tags-labels.md)

## Customizing

### inputs

This builder can be customized using environment variables and values in your `angular.json/workspace.json` and always env variables takes precedence

> Note: all environmet values should be prefixed with `INPUT_` so `INPUT_PUSH=true` will replace the `"push": false` configuration of your `angular.json/workspace.json` file

> Note: For list values use a comma-delimited string, like `INPUT_TAGS=user/app:v1,user/app:latest`

Following inputs can be used as `step.with` keys

| Name                  | Type     | Description                                                                                                                                                                       |
| --------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allow`               | List/CSV | List of [extra privileged entitlement](https://github.com/docker/buildx#--allowentitlement) (eg. `network.host,security.insecure`)                                                |
| `build-args`          | List     | List of build-time variables                                                                                                                                                      |
| `builder`             | String   | Builder instance (see [setup-buildx](https://github.com/docker/setup-buildx-action) action)                                                                                       |
| `cache-from`          | List     | List of [external cache sources](https://github.com/docker/buildx#--cache-fromnametypetypekeyvalue) (eg. `type=local,src=path/to/dir`)                                            |
| `cache-to`            | List     | List of [cache export destinations](https://github.com/docker/buildx#--cache-tonametypetypekeyvalue) (eg. `type=local,dest=path/to/dir`)                                          |
| `context`             | String   | Build's context is the set of files located in the specified [`PATH` or `URL`](https://docs.docker.com/engine/reference/commandline/build/) (default [Git context](#git-context)) |
| `file`                | String   | Path to the Dockerfile (default `./Dockerfile`)                                                                                                                                   |
| `labels`              | List     | List of metadata for an image                                                                                                                                                     |
| `load`                | Bool     | [Load](https://github.com/docker/buildx#--load) is a shorthand for `--output=type=docker` (default `false`)                                                                       |
| `no-cache`            | Bool     | Do not use cache when building the image (default `false`)                                                                                                                        |
| `outputs`             | List     | List of [output destinations](https://github.com/docker/buildx#-o---outputpath-typetypekeyvalue) (format: `type=local,dest=path`)                                                 |
| `platforms`           | List/CSV | List of [target platforms](https://github.com/docker/buildx#---platformvaluevalue) for build                                                                                      |
| `pull`                | Bool     | Always attempt to pull a newer version of the image (default `false`)                                                                                                             |
| `push`                | Bool     | [Push](https://github.com/docker/buildx#--push) is a shorthand for `--output=type=registry` (default `false`)                                                                     |
| `secret-files`        | List     | List of secret files to expose to the build (eg. key=filename, MY_SECRET=./secret.txt)                                                                                            |
| `secrets`             | List     | List of secrets to expose to the build (eg. `key=value`, `GIT_AUTH_TOKEN=mytoken`)                                                                                                |
| `ssh`                 | List     | List of SSH agent socket or keys to expose to the build                                                                                                                           |
| `tags`                | List/CSV | List of tags                                                                                                                                                                      |
| `target`              | String   | Sets the target stage to build                                                                                                                                                    |
| `metadata.images`     | List     | List of Docker images to use as base name for tags                                                                                                                                |
| `metadata.tags`       | List     | List of tags as key-value pair attributes                                                                                                                                         |
| `metadata.flavor`     | List     | Flavor to apply                                                                                                                                                                   |
| `metadata.labels`     | List     | List of custom labels                                                                                                                                                             |
| `metadata.sep-tags`   | String   | Separator to use for tags output (default \n)                                                                                                                                     |
| `metadata.sep-labels` | String   | Separator to use for labels output (default \n)                                                                                                                                   |

To check all possible options please check this [schema.json](src/builders/nx-docker/schema.json) file

> For deep explanation about metadata extraction, how the options works and see some config examples, please check [this](https://github.com/crazy-max/ghaction-docker-meta)

## Usage with CI

### Gitlab CI

To use with Gitlab CI we provide a [custom node image](https://github.com/users/gperdomor/packages/container/package/nx-docker) with Docker and Buildx integrated. Just only need to use in your pipeline:

```yml
build:
  image: ghcr.io/gperdomor/nx-docker:16.10-alpine
  services:
    - docker:20.10.8-dind
  variables:
    GIT_DEPTH: 0
    DOCKER_HOST: tcp://docker:2375/
    DOCKER_DRIVER: overlay2
  script:
    - npm i
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
    - docker run --privileged --rm tonistiigi/binfmt --install all # required for multi-platform build
    - docker buildx create --use
    - npx nx affected --target=docker
```

> Note: Circle CI uses docker based pipelines so you can use this image as well

### GitHub Actions

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
        run: npx nx affected --target=docker
```

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
