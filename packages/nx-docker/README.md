![Docker builder](https://github.com/gperdomor/nx-tools/workflows/Docker%20builder/badge.svg)

# nx-docker

Builds and pushes Docker images and will log in to a Docker registry if required.

[Options](#Options)

- [repository](#repository)
- [username](#username)
- [password](#password)
- [registry](#registry)
- [tags](#tags)
- [tagWithRef](#tagWithRef)
- [tagWithSha](#tagWithSha)
- [path](#path)
- [dockerfile](#dockerfile)
- [target](#target)
- [alwaysPull](#alwaysPull)
- [buildArgs](#buildArgs)
- [cacheFroms](#cacheFroms)
- [labels](#labels)
- [addGitLabels](#addGitLabels)
- [push](#push)

[Example usage](#Example-usage)

## Options

### `repository`

**Required** Docker repository to tag the image with.

### `username`

Username used to log in to a Docker registry. If not set then no login will occur.

### `password`

Password or personal access token used to log in to a Docker registry. If not set then no login will occur.

### `registry`

Server address of Docker registry. If not set then will default to Docker Hub.

### `tags`

Comma-delimited list of tags. These will be added to the registry/repository to form the image's tags.

Example:

```yaml
tags: tag1,tag2
```

### `tagWithRef`

Boolean value. Defaults to `false`.

Automatically tags the built image with the git reference. The format of the tag depends on the type of git reference with all forward slashes replaced with `-`.

For pushes to a branch the reference will be `refs/heads/{branch-name}` and the tag will be `{branch-name}`. If `{branch-name}` is master then the tag will be `latest`.

For pull requests the reference will be `refs/pull/{pull-request}` and the tag will be `pr-{pull-request}`.

For git tags the reference will be `refs/tags/{git-tag}` and the tag will be `{git-tag}`.

Examples:

| Git Reference          | Image tag    |
| ---------------------- | ------------ |
| `refs/heads/master`    | `latest`     |
| `refs/heads/mybranch`  | `mybranch`   |
| `refs/heads/my/branch` | `my-branch`  |
| `refs/pull/2/merge`    | `pr-2-merge` |
| `refs/tags/v1.0.0`     | `v1.0.0`     |

### `tagWithSha`

Boolean value. Defaults to `false`.

Automatically tags the built image with the git short SHA prefixed with `sha-`.

Example:

| Git SHA                                    | Image tag     |
| ------------------------------------------ | ------------- |
| `676cae2f85471aeff6776463c72881ebd902dcf9` | `sha-676cae2` |

### `path`

Path to the build context. Defaults to `.`

### `dockerfile`

Path to the Dockerfile. Defaults to `{path}/Dockerfile`

Note when set this path is **not** relative to the `path` input but is instead relative to the current working directory.

### `target`

Sets the target stage to build.

### `alwaysPull`

Boolean value. Defaults to `false`.

Always attempt to pull a newer version of the image.

### `buildArgs`

Comma-delimited list of build-time variables.

Example:

```yaml
buildArgs: arg1=value1,arg2=value2
```

### `cacheFroms`

Comma-delimited list of images to consider as cache sources.

Example:

```yaml
cacheFroms: myorg/baseimage:latest
```

### `labels`

Comma-delimited list of labels to add to the built image.

Example:

```yaml
labels: label_name_1=label_value_1,label_name_2=label_value_2
```

### `addGitLabels`

Boolean value. Defaults to `false`.

Adds labels with git repository information to the built image based on the standards set out in https://github.com/opencontainers/image-spec/blob/master/annotations.md.

The labels are:

| Label key                           | Example value                              | Description                                                                            |
| ----------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------- |
| `org.opencontainers.image.created`  | `2020-03-06T23:00:00Z`                     | Date and time on which the image was built (string, date-time as defined by RFC 3339). |
| `org.opencontainers.image.source`   | `https://github.com/myorg/myrepository`    | URL to the GitHub repository.                                                          |
| `org.opencontainers.image.revision` | `676cae2f85471aeff6776463c72881ebd902dcf9` | The full git SHA of this commit.                                                       |

### `push`

Boolean value. Defaults to `true`.

Whether to push the built image.

## Example usage

## Getting started

The first step is configure the builder in your `angular.json` or `workspace.json`, so add something like this to every project you need to dockerize:

```
"docker": {
 "builder": "@gperdomor/nx-docker:build",
 "options": {
   "repository": "gperdomor/api",
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
   - npm run nx affected -- --target=docker
```

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
         node-version: 14.x

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
