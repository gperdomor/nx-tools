# `@nx-tools/nx-container`

The Nx Plugin for Containers contains executors, generators, and utilities for build and push containers images from your applications. It provides:

- Easy way to build container images with three different engines:
  - [Buildx](https://github.com/docker/buildx) through [Moby BuildKit](https://github.com/moby/buildkit) builder toolkit.
  - [Podman](https://docs.podman.io/en/latest/).
  - [Kaniko](https://github.com/GoogleContainerTools/kaniko).
- Automatic tag management and [OCI Image Format Specification](https://github.com/opencontainers/image-spec/blob/master/annotations.md) for labels,
- Backward compatibility with `@nx-tools/nx-docker` api.
- Generators to help to setup your apps quickly.

This executor not handle registry login steps, so if you wanna push your container images to a remote registry, please setup the credentials using the `docker login` or `podman login`. For kaniko engine, you need to create the `/kaniko/.docker/config.json` according to this [documentation](https://github.com/GoogleContainerTools/kaniko#pushing-to-docker-hub).

> This is the succesor of `@nx-tools/nx-docker`. For docs about nx-docker please go check [this](https://github.com/gperdomor/nx-tools/tree/nx-docker%403.0.5)

## Setting up the Container plugin

Adding the Container plugin to an existing Nx workspace can be done with the following:

```bash
npm install -D @nx-tools/nx-container
```

```bash
yarn add -D @nx-tools/nx-container
```

If you want an "automatic" tag management and [OCI Image Format Specification](https://github.com/opencontainers/image-spec/blob/master/annotations.md) for labels, you need to install the optional `@nx-tools/container-metadata` package:

```bash
npm install -D @nx-tools/container-metadata
```

```bash
yarn add -D @nx-tools/container-metadata
```

> @nx-tools/container-metadata is the succesor of `@nx-tools/docker-metadata`.

## Using the Container Plugin

### Configuring an application

It's straightforward to setup your application:

```bash
nx g @nx-tools/nx-container:configuration appName
```

By default, the application will be configured with:

- A Dockerfile in the application root.
- A target to build your application using the Docker engine.

We can then build our application with the following command:

```bash
nx container appName
```

To use a different engine, you need to update the `options.engine` property of your project target or use the INPUT_ENGINE environment variable. All possible values are `docker` (the default), `podman` and `kaniko`

> Tip: You can set docker or podman engine in your project.json targets to use in your dev machine, and use INPUT_ENGINE env variable to use kaniko in your CI/CD pipelines.

### Migrate from @nx-tools/nx-docker

Just change `@nx-tools/nx-docker:build` to `@nx-tools/nx-container:build` in your project targets and you will continue building images using the [docker/buildx](https://github.com/docker/buildx) engine.

```json
"docker": {
  "executor": "@nx-tools/nx-container:build",
  "options": {
    ...
  }
}
```

## More Documentation

- Advanced usage:

  - [Multi-platform image](plugins/nx-container/docs/advanced/multi-platform.md)
  - [Isolated builders](plugins/nx-container/docs/advanced/isolated-builders.md)
  - [Push to multi-registries](plugins/nx-container/docs/advanced/push-multiple-registries.md)
  - [Cache](plugins/nx-container/docs/advanced/cache.md)
  - [Local registry](plugins/nx-container/docs/advanced/local-registry.md)
  - [Export image to Docker](plugins/nx-container/docs/advanced/export-docker.md)
  - [Handle tags and labels](plugins/nx-container/docs/advanced/tags-labels.md)

- Customizing

  - [inputs](plugins/nx-container/docs/inputs.md)

- Usage with CI

  - [GitLab CI](plugins/nx-container/docs/ci/gitlab-ci.md)
  - [GitHub Actions](plugins/nx-container/docs/ci/github-actions.md)

- [TROUBLESHOOTING.md](plugins/nx-container/TROUBLESHOOTING.md)

## Package reference

Here is a list of all the executors and generators available from this package:

### Executors

- build: Builds an image using instructions from the Dockerfile and a specified build context directory.

### Generators

- init: Setup required files to build your app.
