#!/usr/bin/env node

const { run } = require('@nx-tools/nx-docker');

const build = async () => {
  await run({
    file: './docker/Dockerfile',
    context: './docker',
    push: process.env.CI_COMMIT_BRANCH === process.env.CI_DEFAULT_BRANCH,
    load: true,
    buildArgs: [`NODE_VERSION=${process.env.NODE_VERSION}`, `ALPINE_VERSION=${process.env.ALPINE_VERSION}`],
    meta: {
      enabled: true,
      images: ['gperdomor/nx-docker', 'ghcr.io/gperdomor/nx-docker'],
      tags: [
        `type=semver,pattern={{version}},value=${process.env.NODE_VERSION}`,
        `type=semver,pattern={{major}}.{{minor}},value=${process.env.NODE_VERSION}`,
        `type=semver,pattern={{major}},value=${process.env.NODE_VERSION}`,
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
