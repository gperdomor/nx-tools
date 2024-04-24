## 6.0.0-alpha.3 (2024-04-24)

### 🚀 Features

- **core:** added getInputList, cp, mv, rm, which, findInPath, mkdirP and rmRF functions ([0176741](https://github.com/gperdomor/nx-tools/commit/0176741))

- **ci-context:** migrating contexts from functions to classes ([3bf3ec3](https://github.com/gperdomor/nx-tools/commit/3bf3ec3))

- **core:** add support for trimWhitespace to getMultilineInput fn ([395ebbf](https://github.com/gperdomor/nx-tools/commit/395ebbf))

- **core:** added funtion to get temp dir ([665f993](https://github.com/gperdomor/nx-tools/commit/665f993))

- **container-metadata:** align with container-metadata-action 5.5.1 ([1c8187e](https://github.com/gperdomor/nx-tools/commit/1c8187e))

### 🩹 Fixes

- **deps:** bump ci-info from 3.8.0 to v3.9.0 ([80a6c5a](https://github.com/gperdomor/nx-tools/commit/80a6c5a))

- **deps:** bump csv-parse from 5.4.0 to v5.5.2 ([1bae187](https://github.com/gperdomor/nx-tools/commit/1bae187))

- **deps:** bump csv-parse from 5.5.2 to v5.5.5 ([db61460](https://github.com/gperdomor/nx-tools/commit/db61460))

- **deps:** bump ci-info from 3.9.0 to v4 ([958e958](https://github.com/gperdomor/nx-tools/commit/958e958))

- **core:** relaxed dependencies ranges ([273d968](https://github.com/gperdomor/nx-tools/commit/273d968))

### ❤️ Thank You

- Dan Iosif
- Gustavo Perdomo
- Lehoczky Zoltán @Lehoczky
- Nicolas Dubois
- Rene Bonilla

# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [3.0.1](https://github.com/gperdomor/nx-tools/compare/core@3.0.0...core@3.0.1) (2022-07-11)

### Bug Fixes

- **core:** move from chalk to colorette ([5a5e7fa](https://github.com/gperdomor/nx-tools/commit/5a5e7facf1d47fb8b547fc2f5bf7ea0a9bc914ab))

## [3.0.0](https://github.com/gperdomor/nx-tools/compare/core@3.0.0-alpha.3...core@3.0.0) (2022-06-14)

## [3.0.0-alpha.3](https://github.com/gperdomor/nx-tools/compare/core@3.0.0-alpha.2...core@3.0.0-alpha.3) (2022-06-14)

### Features

- several updates and nx bump ([e0ad550](https://github.com/gperdomor/nx-tools/commit/e0ad550db010d1710b6729911aae9d432aaf5ffb))

## [3.0.0-alpha.2](https://github.com/gperdomor/nx-tools/compare/core@3.0.0-alpha.1...core@3.0.0-alpha.2) (2022-04-29)

### Features

- chore: bump nx to 14.0.5
- other deps updates

## [3.0.0-alpha.1](https://github.com/nx-tools/nx-tools/compare/core@2.3.1...core@3.0.0-alpha.1) (2022-04-09)

### ⚠ BREAKING CHANGES

- **core:** Dropped support for Node 12

### Features

- **core:** move to swc ([78e4b4b](https://github.com/nx-tools/nx-tools/commit/78e4b4b1e83317a3f005fc6226f637699834d302))

## [2.3.1](https://github.com/gperdomor/nx-tools/compare/core@2.3.0...core@2.3.1) (2022-02-04)

### Bug Fixes

- **core:** expose getMultilineInput properly ([97d9c36](https://github.com/gperdomor/nx-tools/commit/97d9c36d2283141bf59931f7f94d4ddd83702eec))

# [2.3.0](https://github.com/gperdomor/nx-tools/compare/core@2.2.0...core@2.3.0) (2022-02-04)

### Features

- **core:** added multiline input support ([d06e0c1](https://github.com/gperdomor/nx-tools/commit/d06e0c1421cbf5c9dfdfe436fbf2edf3eb40bb69))

# [2.2.0](https://github.com/gperdomor/nx-tools/compare/core@2.1.0...core@2.2.0) (2022-01-02)

### Features

- **core:** switch from swc to tsc again ([4120750](https://github.com/gperdomor/nx-tools/commit/41207505aa09a8b0eb5a0ab73705d393fc082d2f))

# [2.1.0](https://github.com/gperdomor/nx-tools/compare/core@2.0.1...core@2.1.0) (2021-12-27)

### Features

- **core:** migrate to swc compiler ([6aa9ede](https://github.com/gperdomor/nx-tools/commit/6aa9ede9462ca01ef1b2062c81488b437db11e40))
- **docker-metadata:** migrate to swc compiler ([655bf20](https://github.com/gperdomor/nx-tools/commit/655bf202cc0661588b34f54357253fd290c4cabb))

# [2.0.1](https://github.com/gperdomor/nx-tools/compare/core@2.0.0...core@2.0.1) (2021-11-25)

- Set tslib@^2.1.0 as peerDependencies

# [2.0.0](https://github.com/gperdomor/nx-tools/compare/core@2.0.0-alpha.2...core@2.0.0) (2021-11-23)

- No changes from alpha.2

# [2.0.0-alpha.2](https://github.com/gperdomor/nx-tools/compare/core@2.0.0-alpha.1...core@2.0.0-alpha.2) (2021-11-05)

### Features

- **core:** added support for prefixed env variable names ([cb75f40](https://github.com/gperdomor/nx-tools/commit/cb75f40c47783cc7bd96896e7bdef27ee9f39ac5))
- update nx to 13 and minor packages ([5689f10](https://github.com/gperdomor/nx-tools/commit/5689f10271777520294a6958f65b8004726412ec))

## 2.0.0-alpha.1 (2021-10-06)

### Bug Fixes

- **core:** fix getInput to handle not POSIX compilant names

### Features

- **core:** new logging tools using devkit
- **core:** new load package function to load optional deps
- **core:** improved teststing suite with mocked-env
- **core:** releasing using @jscutlery/semver
- **core:** updated to nx 12.9.0
- **core:** updated dependencies

### BREAKING CHANGES

- **core:** Removed @actions/core dependency

## 1.0.0 (2021-06-14)

- Initial release
