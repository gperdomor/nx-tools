# Gitlab CI

To build your container images with Gitlab CI we provide a set of custom builder images to build your app:

- [gperdomor/nx-docker](https://hub.docker.com/r/gperdomor/nx-docker) with Node, Docker and Buildx integrated. Required to use `docker` engine.
- [gperdomor/nx-podman](https://hub.docker.com/r/gperdomor/nx-podman) with Node and Podman integrated. Required to use `podman` engine.
- [gperdomor/nx-kaniko](https://hub.docker.com/r/gperdomor/nx-kaniko) with Node and Kaniko integrated. Required to use `kaniko` engine.

## Example with Docker:

```yml
build-with-docker-engine:
  image: gperdomor/nx-docker:18.12.0-alpine
  services:
    - docker:20.10.21-dind
  variables:
    # Docker config
    DOCKER_BUILDKIT: 1
    DOCKER_DRIVER: overlay2
    # Nx Container
    INPUT_PUSH: 'true' # To push your image to the registry
  before_script:
    - npm i
    - NX_HEAD=$CI_COMMIT_SHA
    - NX_BASE=${CI_MERGE_REQUEST_DIFF_BASE_SHA:-$CI_COMMIT_BEFORE_SHA}
    # Login to registry
    - echo "$CI_REGISTRY_PASSWORD" | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
  script:
    - docker run --privileged --rm tonistiigi/binfmt --install all # required only for multi-platform build
    - npx nx affected --base=$NX_BASE --head=$NX_HEAD --target=container --parallel=2
```

## Example with Podman:

```yml
build-with-podman-engine:
  image: gperdomor/nx-podman:18.12.0
  variables:
    # Nx Container
    INPUT_PUSH: 'true' # To push your image to the registry
  before_script:
    - npm i
    - NX_HEAD=$CI_COMMIT_SHA
    - NX_BASE=${CI_MERGE_REQUEST_DIFF_BASE_SHA:-$CI_COMMIT_BEFORE_SHA}
    # Login to registry
    - echo "$CI_REGISTRY_PASSWORD" | podman login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
  script:
    - npx nx affected --base=$NX_BASE --head=$NX_HEAD --target=container --parallel=2
```

## Example with Kaniko:

```yml
build-with-kaniko:
  image:
    name: gperdomor/nx-kaniko:18.12.0-alpine
    entrypoint: ['']
  variables:
    # Nx Container
    INPUT_PUSH: 'true' # To push your image to the registry
  before_script:
    - npm i
    - NX_HEAD=$CI_COMMIT_SHA
    - NX_BASE=${CI_MERGE_REQUEST_DIFF_BASE_SHA:-$CI_COMMIT_BEFORE_SHA}
    # Login to registry
    - echo "{\"auths\":{\"$CI_REGISTRY\":{\"auth\":\"$(echo -n $CI_REGISTRY_USER:$CI_REGISTRY_PASSWORD | base64)\"}}}" > /kaniko/.docker/config.json
  script:
    - npx nx affected --base=$NX_BASE --head=$NX_HEAD --target=container --parallel=1
```

> Tip: kaniko don't support parallel builds, so we need to build one application at time with `--parallel=1`
