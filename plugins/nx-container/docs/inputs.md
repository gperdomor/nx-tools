## Customizing

### inputs

This builder can be customized using environment variables or values in your `project.json`. Environment variables takes precedence over harcoded values.

> Tip: all environmet values needs to be prefixed with `INPUT_` so `INPUT_PUSH=true` will replace the `options.push` value of your `project.json` file
>
> Note: For list values use a comma-delimited string, like `INPUT_PLATFORMS=linux/amd64,linux/arm64`. For `INPUT_BUILD_ARGS` and `INPUT_TAGS` use a newline-delimited string. See [TROUBLESHOOTING.md](../TROUBLESHOOTING.md#) for more information.
> Note: Replace a dash (-) with an underscore in environment variables, like `INPUT_CACHE_FROM='type=gha'`

Following inputs can be used as `step.with` keys

| Name                  | Type     | Description                                                                                                                                                                       |
| --------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `add-hosts`           | List/CSV | List of [customs host-to-IP mapping](https://docs.docker.com/engine/reference/commandline/build/#add-entries-to-container-hosts-file---add-host) (e.g., `docker:10.180.0.1`)      |
| `allow`               | List/CSV | List of [extra privileged entitlement](https://github.com/docker/buildx#--allowentitlement) (eg. `network.host,security.insecure`)                                                |
| `build-args`          | List     | List of build-time variables                                                                                                                                                      |
| `builder`             | String   | Builder instance (see [setup-buildx](https://github.com/docker/setup-buildx-action) action)                                                                                       |
| `cache-from`          | List     | List of [external cache sources](https://github.com/docker/buildx#--cache-fromnametypetypekeyvalue) (eg. `type=local,src=path/to/dir`)                                            |
| `cache-to`            | List     | List of [cache export destinations](https://github.com/docker/buildx#--cache-tonametypetypekeyvalue) (eg. `type=local,dest=path/to/dir`)                                          |
| `cgroup-parent`¹      | String   | Optional [parent cgroup](https://docs.docker.com/engine/reference/commandline/build/#use-a-custom-parent-cgroup---cgroup-parent) for the container used in the build              |
| `context`             | String   | Build's context is the set of files located in the specified [`PATH` or `URL`](https://docs.docker.com/engine/reference/commandline/build/) (default [Git context](#git-context)) |
| `file`                | String   | Path to the Dockerfile (default `./Dockerfile`)                                                                                                                                   |
| `labels`              | List     | List of metadata for an image                                                                                                                                                     |
| `load`                | Bool     | [Load](https://github.com/docker/buildx#--load) is a shorthand for `--output=type=docker` (default `false`)                                                                       |
| `no-cache`            | Bool     | Do not use cache when building the image (default `false`)                                                                                                                        |
| `outputs`             | List     | List of [output destinations](https://github.com/docker/buildx#-o---outputpath-typetypekeyvalue) (format: `type=local,dest=path`)                                                 |
| `platforms`           | List/CSV | List of [target platforms](https://github.com/docker/buildx#---platformvaluevalue) for build                                                                                      |
| `pull`                | Bool     | Always attempt to pull a newer version of the image (default `false`)                                                                                                             |
| `push`                | Bool     | [Push](https://github.com/docker/buildx#--push) is a shorthand for `--output=type=registry` (default `false`)                                                                     |
| `quiet`               | Bool     | Run executor without printing engine info                                                                                                                                         |
| `secret-files`        | List     | List of secret files to expose to the build (eg. key=filename, MY_SECRET=./secret.txt)                                                                                            |
| `secrets`             | List     | List of secrets to expose to the build (eg. `key=value`, `GIT_AUTH_TOKEN=mytoken`, `NPM_TOKEN=${NPM_TOKEN}` will use the environment variable)                                    |
| `shm-size`¹           | String   | Size of [`/dev/shm`](https://github.com/docker/buildx/blob/master/docs/reference/buildx_build.md#-size-of-devshm---shm-size) (e.g., `2g`)                                         |
| `ssh`                 | List     | List of SSH agent socket or keys to expose to the build                                                                                                                           |
| `tags`                | List/CSV | List of tags                                                                                                                                                                      |
| `target`              | String   | Sets the target stage to build                                                                                                                                                    |
| `ulimit`¹             | List     | [Ulimit](https://github.com/docker/buildx/blob/master/docs/reference/buildx_build.md#-set-ulimits---ulimit) options (e.g., `nofile=1024:1024`)                                    |
| `metadata.images`     | List     | List of Docker images to use as base name for tags                                                                                                                                |
| `metadata.tags`       | List     | List of tags as key-value pair attributes                                                                                                                                         |
| `metadata.flavor`     | List     | Flavor to apply                                                                                                                                                                   |
| `metadata.labels`     | List     | List of custom labels                                                                                                                                                             |
| `metadata.sep-tags`   | String   | Separator to use for tags output (default \n)                                                                                                                                     |
| `metadata.sep-labels` | String   | Separator to use for labels output (default \n)                                                                                                                                   |

> ¹ `cgroup-parent`, `shm-size` and `ulimit` are only available using `moby/buildkit:master`
> as builder image atm:
>
> ```yaml
> - name: Set up Docker Buildx
>   uses: docker/setup-buildx-action@v1
>   with:
>   driver-opts: |
>     image=moby/buildkit:master
> ```

To check all possible options please check this [schema.json](../src/executors/build/schema.json) file

> For deep explanation about metadata extraction, how the options works and see some config examples, please check [this](https://github.com/crazy-max/ghaction-docker-meta)
