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
        with:
          fetch-depth: 0
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - uses: actions/setup-node@v3
        with:
          cache: 'npm'
          node-version-file: '.nvmrc'
      - name: 'Install Dependencies'
        run: npm install
      - name: Derive appropriate SHAs for base and head for `nx affected` commands
        uses: nrwl/nx-set-shas@v3
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
        with:
          fetch-depth: 0
      - name: Login to DockerHub
        run: echo "$DOCKERHUB_TOKEN" | podman login -u $DOCKERHUB_USERNAME --password-stdin
        env:
          DOCKERHUB_TOKEN: ${{ secrets.DOCKERHUB_TOKEN }}
          DOCKERHUB_USERNAME: ${{ secrets.DOCKERHUB_TOKEN }}
      - uses: actions/setup-node@v3
        with:
          cache: 'npm'
          node-version-file: '.nvmrc'
      - name: 'Install Dependencies'
        run: npm install
      - name: Derive appropriate SHAs for base and head for `nx affected` commands
        uses: nrwl/nx-set-shas@v3
      - name: 'Build images'
        run: npx nx affected --base=$NX_BASE --head=$NX_HEAD --target=container --parallel=2
```
