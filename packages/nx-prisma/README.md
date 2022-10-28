# `@nx-tools/nx-prisma`

This builder provides a wrapper around the [Prisma CLI](https://www.npmjs.com/package/@prisma/cli)

## Getting started

### Configuration

The first step to use this plugin is configure your projects and create new targets.

You will need at least one project per each prisma schema you make. The prisma schemas can be in already existing backend/frontend projects OR in their own libraries.
Each CLI command uses it's own architect so add the ones you need from the examples bellow.

```json
"prisma-deploy": {
  "builder": "@nx-tools/nx-prisma:generate",
  "options": {
    "schema": "apps/api/schema.prisma"
  }
},
"prisma-generate": {
  "builder": "@nx-tools/nx-prisma:generate",
  "options": {
    "schema": "apps/api/schema.prisma"
  }
},
"prisma-migrate": {
  "builder": "@nx-tools/nx-prisma:migrate",
  "options": {
    "schema": "apps/api/schema.prisma"
  }
},
"prisma-pull": {
  "builder": "@nx-tools/nx-prisma:pull",
  "options": {
    "schema": "apps/api/schema.prisma"
  }
},
"prisma-push": {
  "builder": "@nx-tools/nx-prisma:push",
  "options": {
    "schema": "apps/api/schema.prisma"
  }
},
"prisma-reset": {
  "builder": "@nx-tools/nx-prisma:reset",
  "options": {
    "schema": "apps/api/schema.prisma"
  }
},
"prisma-seed": {
  "builder": "@nx-tools/nx-prisma:seed",
  "options": {
    "script": "apps/examples/prisma/data/seed.ts",
    "tsConfig": "apps/examples/prisma/tsconfig.tools.json"
  }
},
"prisma-status": {
  "builder": "@nx-tools/nx-prisma:status",
  "options": {
    "schema": "apps/api/schema.prisma"
  }
}
```

Note that the options use absolute paths to where your configuration files live in your repository.

### Usage

Once your project is configured and taking the previous configuration as example, you can run the commands using the the nx command:

```sh
nx run project-name:prisma-generate
```
