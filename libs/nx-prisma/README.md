# nx-prisma

This builder provides a wrapper around the [Prisma CLI](https://www.npmjs.com/package/@prisma/cli)

## Getting started

### Configuration

The first step is configure the builder in your `angular.json` or `workspace.json`.
You will need at least one project per each prisma schema you make. The prisma schemas can be in already existing backend/frontend projects OR in their own libraries.
Each CLI command uses it's own architect so add the ones you need from the examples bellow.

```json
"generate": {
  "builder": "@gperdomor/nx-prisma:generate",
  "options": {
    "schema": "apps/examples/prisma/data/schema.prisma"
  }
},
"migrations": {
  "builder": "@gperdomor/nx-prisma:migrations",
  "options": {
    "schema": "apps/examples/prisma/data/schema.prisma"
  }
},
"rollback": {
  "builder": "@gperdomor/nx-prisma:rollback",
  "options": {
    "schema": "apps/examples/prisma/data/schema.prisma"
  }
},
"seed": {
  "builder": "@gperdomor/nx-prisma:seed",
  "options": {
    "script": "apps/examples/prisma/data/seed.ts",
    "tsConfig": "apps/examples/prisma/tsconfig.tools.json"
  }
}
```

Note that the options use absolute paths to where your configuration files live in your repository.

### Usage

Once your `angular.json` or `workspace.json` is configured you can run the commands using the the Angular/NX CLI.

```sh
nx <architect> <project>
# OR
ng <architect> <project>
# ie
nx migrations prisma
```

## Example

An example project can be found in [apps/examples/prisma](/apps/examples/prisma) using the [workspace.json](/workspace.json) configuration.
