# GitHub Actions

To build your container images with Github Actions, you have two different options, you can use the preinstalled software provided by the hosted runners or you can go with a container based job using one of the provided custom builder images:

- [gperdomor/nx-docker](https://hub.docker.com/r/gperdomor/nx-docker) with Node, Docker and Buildx integrated. Required to use `docker` engine.
- [gperdomor/nx-podman](https://hub.docker.com/r/gperdomor/nx-podman) with Node and Podman integrated. Required to use `podman` engine.
- [gperdomor/nx-kaniko](https://hub.docker.com/r/gperdomor/nx-kaniko) with Node and Kaniko integrated. Required to use `kaniko` engine.

## Example with Docker:

```yml
jobs:
  build-with-docker-engine:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
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
      - name: 'Build images'
        run: npx nx affected --base=$NX_BASE --head=$NX_HEAD --target=container --parallel=2
```

## Example with Podman:

```yml
jobs:
  build-with-podman-engine:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Login to DockerHub
        run: echo "$DOCKERHUB_TOKEN" | podman login -u $DOCKERHUB_USERNAME --password-stdin
        env:
          DOCKERHUB_TOKEN: ${{ secrets.DOCKERHUB_TOKEN }}
          DOCKERHUB_USERNAME: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: 'Install Dependencies'
        run: npm i
      - name: 'Build images'
        run: npx nx affected --base=$NX_BASE --head=$NX_HEAD --target=container --parallel=2
```

## Example with Kaniko:

Github shared runners not included the kaniko command, so in this case we will use a container based job using the provided [gperdomor/nx-kaniko](https://hub.docker.com/r/gperdomor/nx-kaniko) image:

```yml
jobs:
  build-with-kaniko-engine:
    runs-on: ubuntu-latest
    container:
      image: gperdomor/nx-kaniko:18.12.0-alpine
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Login to DockerHub
        run: echo "{\"auths\":{\"docker.io\":{\"auth\":\"$(echo -n $DOCKERHUB_USERNAME:$DOCKERHUB_TOKEN | base64)\"}}}" > /kaniko/.docker/config.json
      - name: 'Install Dependencies'
        run: npm i
      - name: 'Build images'
        run: npx nx affected --base=$NX_BASE --head=$NX_HEAD --target=container --parallel=1
```

> Tip: kaniko don't support parallel builds, so we need to build one application at time with `--parallel=1`
