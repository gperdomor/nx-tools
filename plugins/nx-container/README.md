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
nx add @nx-tools/nx-container
```

## Using the Container Plugin

### Configuring an application

It's straightforward to setup your application:

#### Using Inferred target (Project Crystal):

It's straightforward to setup your application with 2 simple steps

1. Run this command `nx g @nx-tools/nx-container:init` or add nx-container manually to the plugins array in your `nx.json` file, like is showed below:

```
    {
      "plugin": "@nx-tools/nx-container",
      "options": {
        "defaultEngine": "docker",
        "defaultRegistry": "docker.io"
      }
    }
```

2. Add a`Dockerfile` to your application

> Note: This requires `@nx-tools/nx-container`verion `6.2.0` or above.

#### Manual configuration

To setup a `container` task, or override inferred task, you can use this command:

```bash
nx g @nx-tools/nx-container:configuration appName
```

By default, the application will be configured with:

- A Dockerfile in the application root (Will be created if no Dockerfile is present in app directory)
- A target to build your application using the Docker engine.

We can then build our application with the following command:

### Build your application

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

  - [Multi-platform image](https://github.com/gperdomor/nx-tools/blob/main/plugins/nx-container/docs/advanced/multi-platform.md)
  - [Isolated builders](https://github.com/gperdomor/nx-tools/blob/main/plugins/nx-container/docs/advanced/isolated-builders.md)
  - [Push to multi-registries](https://github.com/gperdomor/nx-tools/blob/main/plugins/nx-container/docs/advanced/push-multiple-registries.md)
  - [Cache](https://github.com/gperdomor/nx-tools/blob/main/plugins/nx-container/docs/advanced/cache.md)
  - [Local registry](https://github.com/gperdomor/nx-tools/blob/main/plugins/nx-container/docs/advanced/local-registry.md)
  - [Export image to Docker](https://github.com/gperdomor/nx-tools/blob/main/plugins/nx-container/docs/advanced/export-docker.md)
  - [Handle tags and labels](https://github.com/gperdomor/nx-tools/blob/main/plugins/nx-container/docs/advanced/tags-labels.md)

- Customizing

  - [inputs](https://github.com/gperdomor/nx-tools/blob/main/plugins/nx-container/docs/inputs.md)

- Usage with CI

  - [GitLab CI](https://github.com/gperdomor/nx-tools/blob/main/plugins/nx-container/docs/ci/gitlab-ci.md)
  - [GitHub Actions](https://github.com/gperdomor/nx-tools/blob/main/plugins/nx-container/docs/ci/github-actions.md)

- [TROUBLESHOOTING.md](https://github.com/gperdomor/nx-tools/blob/main/plugins/nx-container/TROUBLESHOOTING.md)

## Package reference

Here is a list of all the executors and generators available from this package:

### Executors

- build: Builds an image using instructions from the Dockerfile and a specified build context directory.

### Generators

- init: Setup required files to build your app.
