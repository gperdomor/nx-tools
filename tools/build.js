#!/usr/bin/env node

const { run } = require('@nx-tools/nx-docker');

const build = async () => {
  const { CI_COMMIT_BRANCH, CI_DEFAULT_BRANCH, NODE_VERSION, ALPINE_VERSION } = process.env;

  await run({
    file: './docker/Dockerfile',
    context: './docker',
    // push: CI_COMMIT_BRANCH === CI_DEFAULT_BRANCH,
    push: false,
    buildArgs: [`NODE_VERSION=${NODE_VERSION}`, `ALPINE_VERSION=${ALPINE_VERSION}`],
    meta: {
      enabled: true,
      images: ['gperdomor/nx-docker', 'ghcr.io/gperdomor/nx-docker'],
      tags: [
        `type=semver,pattern={{version}},value=${NODE_VERSION}`,
        `type=semver,pattern={{major}}.{{minor}},value=${NODE_VERSION}`,
        `type=semver,pattern={{major}},value=${NODE_VERSION}`,
      ],
      flavor: ['latest=false', 'suffix=-alpine'],
      labels: [
        'org.opencontainers.image.authors=Gustavo Perdomo <gperdomor@gmail.com>',
        'org.opencontainers.image.description=Builder companion for @nx-tools/nx-docker npm package',
      ],
    },
  });
};

build();
