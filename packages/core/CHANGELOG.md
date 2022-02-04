# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

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
