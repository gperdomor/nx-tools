## 6.9.0 (2025-10-10)

### 🚀 Features

- add support for Nx 22 ([a17ee0e](https://github.com/gperdomor/nx-tools/commit/a17ee0e))

### 🩹 Fixes

- **deps:** bump nx monorepo from 21.1.2 to v21.6.4 ([174af44](https://github.com/gperdomor/nx-tools/commit/174af44))

### 🏡 Chore

- move from husky to lefthook ([09efc13](https://github.com/gperdomor/nx-tools/commit/09efc13))
- dependency and config sync with main branch ([c2b07ec](https://github.com/gperdomor/nx-tools/commit/c2b07ec))
- move plugins to packages directory ([59ecd12](https://github.com/gperdomor/nx-tools/commit/59ecd12))

### ❤️ Thank You

- Gustavo Perdomo

## 6.8.4 (2025-10-10)

This was a version bump only, there were no code changes.

## 6.8.3 (2025-10-10)

### 🩹 Fixes

- **nx-container:** fix provenance ([#1314](https://github.com/gperdomor/nx-tools/issues/1314))

### ❤️ Thank You

- Gustavo Perdomo

## 6.8.2 (2025-08-02)

### 🚀 Features

- **nx-container:** support for sbom attestations ([d3ff31d](https://github.com/gperdomor/nx-tools/commit/d3ff31d))

### ❤️ Thank You

- Karl-E. Kiel @kekielst

## 6.8.1 (2025-07-30)

### 🩹 Fixes

- **nx-set-shas:** fix bin package field ([a43309e](https://github.com/gperdomor/nx-tools/commit/a43309e))

### ❤️ Thank You

- Gustavo Perdomo

## 6.8.0 (2025-06-17)

### 🚀 Features

- **ci-context:** updated config files to align with new library generators ([#1232](https://github.com/gperdomor/nx-tools/pull/1232))
- **container-metadata:** updated config files to align with new library generators ([#1233](https://github.com/gperdomor/nx-tools/pull/1233))
- **core:** updated config files to align with new library generators ([#1231](https://github.com/gperdomor/nx-tools/pull/1231))
- **nx-container:** updated config files to align with new plugin generators ([#1235](https://github.com/gperdomor/nx-tools/pull/1235))
- **nx-graphql-codegen:** updated config files to align with new plugin generators ([#1236](https://github.com/gperdomor/nx-tools/pull/1236))
- **nx-graphql-codegen:** add logging options to configuration ([#1246](https://github.com/gperdomor/nx-tools/pull/1246))
- **nx-prisma:** updated config files to align with new plugin generators ([#1237](https://github.com/gperdomor/nx-tools/pull/1237))
- **nx-set-shas:** updated config files to align with new library generators ([#1234](https://github.com/gperdomor/nx-tools/pull/1234))
- **source:** updated config files to align with new ts workspaces ([#1238](https://github.com/gperdomor/nx-tools/pull/1238))
- **website:** added initial app for docs ([#1250](https://github.com/gperdomor/nx-tools/pull/1250))
- **website:** improve nx-container docs ([#1252](https://github.com/gperdomor/nx-tools/pull/1252))
- **website:** initial nx-prisma docs ([#1254](https://github.com/gperdomor/nx-tools/pull/1254))
- **website:** initial nx-graphql-codegen docs ([#1255](https://github.com/gperdomor/nx-tools/pull/1255))

### 🩹 Fixes

- **deps:** bump semver from 7.7.1 to v7.7.2 ([#1220](https://github.com/gperdomor/nx-tools/pull/1220))

### 🏡 Chore

- update eslint configuration to ESM files ([#1228](https://github.com/gperdomor/nx-tools/pull/1228))
- remove jest related dependencies ([#1229](https://github.com/gperdomor/nx-tools/pull/1229))
- move to pnpm as package manager ([#1242](https://github.com/gperdomor/nx-tools/pull/1242))
- update git hooks scripts ([#1248](https://github.com/gperdomor/nx-tools/pull/1248))
- added dev container configuration ([021010b](https://github.com/gperdomor/nx-tools/commit/021010b))
- bump nx monorepo from 21.0.3 to v21.1.2 ([099566c](https://github.com/gperdomor/nx-tools/commit/099566c))
- **deps:** bump lint-staged from 15.5.2 to v16 ([#1241](https://github.com/gperdomor/nx-tools/pull/1241))
- **deps:** bump vitest monorepo from 3.1.3 to v3.2.3 ([#1245](https://github.com/gperdomor/nx-tools/pull/1245))
- **deps:** bump memfs from 4.17.1 to v4.17.2 ([#1240](https://github.com/gperdomor/nx-tools/pull/1240))
- **deps:** bump pnpm from 10.11.0+sha512.6540583f41cc5f628eb3d9773ecee802f4f9ef9923cc45b69890fb47991d4b092964694ec3a4f738a420c918a333062c8b925d312f42e4f0c263eb603551f977 to v10.12.1 ([#1259](https://github.com/gperdomor/nx-tools/pull/1259))
- **source:** improved commitlint config and validation scripts ([#1239](https://github.com/gperdomor/nx-tools/pull/1239))

### ❤️ Thank You

- Daniel Schuba @DaSchTour
- Gustavo Perdomo

## 6.7.1 (2025-05-17)

### 🩹 Fixes

- fix missing dist folder in relese ([81f63ac](https://github.com/gperdomor/nx-tools/commit/81f63ac))

### 🏡 Chore

- **source:** added changelog notice about new versioning approach ([c0448b5](https://github.com/gperdomor/nx-tools/commit/c0448b5))

### ❤️ Thank You

- Gustavo Perdomo

## 6.7.0 (2025-05-17)

> [!IMPORTANT]
> From now, the releases will follow a fixed versioning approach across all packages. All packages have been aligned to version 6.7.0. For details on previous releases, please refer to the specific changelog files in the respective package or plugin directories.

### 🚀 Features

- added provenance support ([732184f](https://github.com/gperdomor/nx-tools/commit/732184f))

### 🏡 Chore

- **source:** move to fixed releases ([6b096a7](https://github.com/gperdomor/nx-tools/commit/6b096a7))

### ❤️ Thank You

- Gustavo Perdomo
