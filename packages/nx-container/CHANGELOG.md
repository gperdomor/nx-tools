## 7.0.0-alpha.2 (2025-08-05)

This was a version bump only for nx-container to align it with other projects, there were no code changes.

## 7.0.0-alpha.1 (2025-08-05)

### 🚀 Features

- ⚠️ **nx-container:** remove kaniko suport ([e6bceca](https://github.com/gperdomor/nx-tools/commit/e6bceca))
- **nx-container:** support for sbom attestations ([0782daf](https://github.com/gperdomor/nx-tools/commit/0782daf))
- **core:** migrate from @action/exec to tinyexec ([#1284](https://github.com/gperdomor/nx-tools/pull/1284))

### 🏡 Chore

- ⚠️ bump min Node.js version to 20.19 ([c8412d2](https://github.com/gperdomor/nx-tools/commit/c8412d2))
- ⚠️ bump required tslib version ranges ([dc121be](https://github.com/gperdomor/nx-tools/commit/dc121be))
- ⚠️ bump required nx version ranges ([7d0dbea](https://github.com/gperdomor/nx-tools/commit/7d0dbea))
- bump nx and tslib version requirements ([#1280](https://github.com/gperdomor/nx-tools/pull/1280))

### ⚠️ Breaking Changes

- **nx-container:** kaniko engine is no longer supported
- update supported Node.js versions to 20.19.x and later
- update supported tslib versions to 2.6.x and later
- removed support of Nx 16.x and 17.x

### ❤️ Thank You

- Gustavo Perdomo
- Karl-E. Kiel @kekielst

## 6.8.0 (2025-06-17)

### 🚀 Features

- **website:** improve nx-container docs ([#1252](https://github.com/gperdomor/nx-tools/pull/1252))
- **website:** added initial app for docs ([#1250](https://github.com/gperdomor/nx-tools/pull/1250))
- **nx-container:** updated config files to align with new plugin generators ([#1235](https://github.com/gperdomor/nx-tools/pull/1235))

### 🏡 Chore

- move to pnpm as package manager ([#1242](https://github.com/gperdomor/nx-tools/pull/1242))
- update eslint configuration to ESM files ([#1228](https://github.com/gperdomor/nx-tools/pull/1228))

### ❤️ Thank You

- Gustavo Perdomo

## 6.7.1 (2025-05-17)

This was a version bump only for nx-container to align it with other projects, there were no code changes.

## 6.7.0 (2025-05-17)

### 🚀 Features

- added provenance support ([732184f](https://github.com/gperdomor/nx-tools/commit/732184f))

### ❤️ Thank You

- Gustavo Perdomo

## 6.3.0 (2025-05-15)

### 🏡 Chore

- update readme files ([9b6b74c](https://github.com/gperdomor/nx-tools/commit/9b6b74c))

### 🧱 Updated Dependencies

- Updated container-metadata to 6.2.0
- Updated ci-context to 6.2.0
- Updated core to 6.2.0

### ❤️ Thank You

- Gustavo Perdomo

## 6.3.0-beta.0 (2025-05-15)

### 🚀 Features

- added Nx 21 support ([#1197](https://github.com/gperdomor/nx-tools/pull/1197))
- move workspace to use typescript solution ([#1168](https://github.com/gperdomor/nx-tools/pull/1168))

### 🩹 Fixes

- fix ci ([#1201](https://github.com/gperdomor/nx-tools/pull/1201))
- **nx-container:** fix nx-container packaging info ([efb34d2](https://github.com/gperdomor/nx-tools/commit/efb34d2))

### 🧱 Updated Dependencies

- Updated container-metadata to 6.2.0-beta.0
- Updated ci-context to 6.2.0-beta.0
- Updated core to 6.2.0-beta.0

### ❤️ Thank You

- Gustavo Perdomo

## 6.2.0 (2024-12-08)

### 🚀 Features

- **nx-container:** add init generator ([150024b](https://github.com/gperdomor/nx-tools/commit/150024b))

- **nx-container:** add inferred targets ([6d53fa5](https://github.com/gperdomor/nx-tools/commit/6d53fa5))

- **nx-container:** improvements in inferred task ([#1164](https://github.com/gperdomor/nx-tools/pull/1164))

### 🩹 Fixes

- **nx-container:** fix lint errors ([09b4517](https://github.com/gperdomor/nx-tools/commit/09b4517))

### ❤️ Thank You

- Badeau, Jose
- Gustavo Perdomo

## 6.1.1 (2024-11-08)

### 🧱 Updated Dependencies

- Updated container-metadata to 6.1.1
- Updated core to 6.1.1

## 6.1.0 (2024-10-16)

### 🧱 Updated Dependencies

- Updated container-metadata to 6.1.0
- Updated core to 6.1.0

## 6.0.4 (2024-10-06)

### 🩹 Fixes

- **nx-container:** fix secret-files interpolation ([08b8f10](https://github.com/gperdomor/nx-tools/commit/08b8f10))

### ❤️ Thank You

- Gustavo Perdomo

## 6.0.3 (2024-10-03)

### 🩹 Fixes

- **docs:** update doc links to point to correct plugin doc location ([40ea7ba](https://github.com/gperdomor/nx-tools/commit/40ea7ba))

### ❤️ Thank You

- WTPascoe @WTPascoe

## 6.0.2 (2024-08-19)

### 🚀 Features

- **nx-container:** move project to plugins directory ([e76e956](https://github.com/gperdomor/nx-tools/commit/e76e956))

- **nx-container:** compiled using swc ([462f575](https://github.com/gperdomor/nx-tools/commit/462f575))

- **nx-container:** compiled using swc ([aeac6aa](https://github.com/gperdomor/nx-tools/commit/aeac6aa))

- **nx-container:** improvements in docker templates ([2a5b1ac](https://github.com/gperdomor/nx-tools/commit/2a5b1ac))

- **nx-container:** forward quiet option to metadata generation for quiet logs ([12acea1](https://github.com/gperdomor/nx-tools/commit/12acea1))

- **nx-container:** update package versions ([7ec6b6f](https://github.com/gperdomor/nx-tools/commit/7ec6b6f))

### 🧱 Updated Dependencies

- Updated container-metadata to 6.0.2

### ❤️ Thank You

- Gustavo Perdomo

## 6.0.1 (2024-05-22)

### 🚀 Features

- nx 19 support ([3922496](https://github.com/gperdomor/nx-tools/commit/3922496))

### ❤️ Thank You

- Gustavo Perdomo
- Kaden Wilkinson @kdawgwilk
- meehawk @meehawk

# 6.0.0 (2024-05-07)

### 🚀 Features

- nx 19 support ([3922496](https://github.com/gperdomor/nx-tools/commit/3922496))

### ❤️ Thank You

- Gustavo Perdomo
- Kaden Wilkinson @kdawgwilk
- meehawk @meehawk

## 6.0.0-alpha.3 (2024-04-24)

### 🚀 Features

- add option to configure provenance ([914b361](https://github.com/gperdomor/nx-tools/commit/914b361))

- **ci-context:** migrating contexts from functions to classes ([3bf3ec3](https://github.com/gperdomor/nx-tools/commit/3bf3ec3))

- **nx-container:** revamped configuration generator ([7c98412](https://github.com/gperdomor/nx-tools/commit/7c98412))

- **nx-container:** improved configuration generator ([eb88944](https://github.com/gperdomor/nx-tools/commit/eb88944))

- **nx-container:** fix generator ([15eaea1](https://github.com/gperdomor/nx-tools/commit/15eaea1))

- **nx-container:** fix generator ([27a1267](https://github.com/gperdomor/nx-tools/commit/27a1267))

### 🩹 Fixes

- **deps:** bump csv-parse from 5.4.0 to v5.5.2 ([1bae187](https://github.com/gperdomor/nx-tools/commit/1bae187))

- **deps:** bump handlebars from 4.7.7 to v4.7.8 ([d56bf1a](https://github.com/gperdomor/nx-tools/commit/d56bf1a))

- **deps:** bump semver from 7.5.4 to v7.6.0 ([8a9a0cd](https://github.com/gperdomor/nx-tools/commit/8a9a0cd))

- **deps:** bump csv-parse from 5.5.2 to v5.5.5 ([db61460](https://github.com/gperdomor/nx-tools/commit/db61460))

- **deps:** bump tmp from 0.2.1 to v0.2.3 ([e9b5b95](https://github.com/gperdomor/nx-tools/commit/e9b5b95))

- **nx-container:** provenance 'false' ignored ([6868733](https://github.com/gperdomor/nx-tools/commit/6868733))

- **nx-container:** relaxed dependencies ranges ([6f24d36](https://github.com/gperdomor/nx-tools/commit/6f24d36))

### ❤️ Thank You

- Dan Iosif
- Gustavo Perdomo
- Lehoczky Zoltán @Lehoczky
- Nicolas Dubois
- Rene Bonilla

# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [3.0.3](https://github.com/gperdomor/nx-tools/compare/nx-docker@3.0.1...nx-docker@3.0.3) (2022-08-03)

### Features

- **nx-docker:** A new INPUT_CREATE_BUILDER env variable is handled, when is true, a new builder context is created for each app and removed after build execution. This is neccesary to run `npx nx affected --base=$NX_BASE --head=$NX_HEAD --target=docker` inside GitLab Runner to avoid errors related to the build context

## [3.0.1](https://github.com/gperdomor/nx-tools/compare/nx-docker@3.0.0...nx-docker@3.0.1) (2022-07-11)

### Bug Fixes

- **nx-docker:** write metadata to folder .nx-docker on CI environments ([12d56c3](https://github.com/gperdomor/nx-tools/commit/12d56c36d4f578b2a92d9e87126479959c371c13))

## [3.0.0](https://github.com/gperdomor/nx-tools/compare/nx-docker@3.0.0-alpha.3...nx-docker@3.0.0) (2022-06-14)

## [3.0.0-alpha.3](https://github.com/gperdomor/nx-tools/compare/nx-docker@3.0.0-alpha.2...nx-docker@3.0.0-alpha.3) (2022-06-14)

### Features

- several updates and nx bump ([e0ad550](https://github.com/gperdomor/nx-tools/commit/e0ad550db010d1710b6729911aae9d432aaf5ffb))

## [3.0.0-alpha.2](https://github.com/gperdomor/nx-tools/compare/nx-docker@3.0.0-alpha.1...nx-docker@3.0.0-alpha.2) (2022-04-29)

### Features

- chore: bump nx to 14.0.5
- other deps updates

## [3.0.0-alpha.1](https://github.com/nx-tools/nx-tools/compare/nx-docker@2.3.0...nx-docker@3.0.0-alpha.1) (2022-04-09)

### ⚠ BREAKING CHANGES

- **nx-docker:** Dropped support for Node 12

### Features

- **nx-docker:** move to swc ([dc1fd5d](https://github.com/nx-tools/nx-tools/commit/dc1fd5daa57e0ad2f57f62d9aba2cb7822c2f95d))

# [2.3.0](https://github.com/gperdomor/nx-tools/compare/nx-docker@2.2.0...nx-docker@2.3.0) (2022-02-04)

### Features

- **nx-docker:** add add-hosts, cgroup-parent, shm-size, ulimit inputs ([59a0dd2](https://github.com/gperdomor/nx-tools/commit/59a0dd295e3c0e6c709df53dc3f47995d4549a51))

# [2.2.0](https://github.com/gperdomor/nx-tools/compare/nx-docker@2.1.0...nx-docker@2.2.0) (2022-01-02)

### Features

- update versions ([950dc36](https://github.com/gperdomor/nx-tools/commit/950dc36612a94df3f5d87422ee7e38a25c806eec))

## [2.1.0](https://github.com/gperdomor/nx-tools/compare/nx-docker@2.0.2...nx-docker@2.1.0) (2022-01-02)

### Bug Fixes

- **nx-docker:** fix core version ([6a8f96b](https://github.com/gperdomor/nx-tools/commit/6a8f96b1060c1affd1f7e5532009b27c84fa2f5d))

# [2.0.2](https://github.com/gperdomor/nx-tools/compare/nx-docker@2.0.1...nx-docker@2.0.2) (2021-11-25)

- Set tslib@^2.1.0 as peerDependencies

# [2.0.1](https://github.com/gperdomor/nx-tools/compare/nx-docker@2.0.0...nx-docker@2.0.1) (2021-11-25)

- Removed tslib from peerDependencies

# [2.0.0](https://github.com/gperdomor/nx-tools/compare/nx-docker@2.0.0-alpha.3...nx-docker@2.0.0) (2021-11-23)

- No changes from alpha.3

# [2.0.0-alpha.3](https://github.com/gperdomor/nx-tools/compare/nx-docker@2.0.0-alpha.2...nx-docker@2.0.0-alpha.3) (2021-11-08)

- bump @nx-tools/docker-metadata to 2.0.0-alpha.3

# [2.0.0-alpha.2](https://github.com/gperdomor/nx-tools/compare/nx-docker@2.0.0-alpha.1...nx-docker@2.0.0-alpha.2) (2021-11-05)

### Features

- **nx-docker:** added support for prefixed env variable names ([cc32071](https://github.com/gperdomor/nx-tools/commit/cc32071fecb796d2801652dd8d711463871805a9))
- bump @nx-tools/core to 2.0.0-alpha.2
- bump @nx-tools/docker-metadata to 2.0.0-alpha.2

## 2.0.0-alpha.1 (2021-10-06)

### Bug Fixes

- **nx-docker:** handle not POSIX compilant names

### Features

- **nx-docker:** general improvements
- **nx-docker:** releasing using @jscutlery/semver
- **nx-docker:** updated to nx 12.9.0
- **nx-docker:** updated dependencies

### BREAKING CHANGES

- **nx-docker:** Changes in configuration schema
- **@nx-tools/docker-metadata:** is now an optional dependency

## 1.0.0 (2021-06-14)

- Initial release
