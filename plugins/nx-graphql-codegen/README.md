# nx-graphql-codegen

The Nx Plugin for Graphql Code Generator contains executor and generator for managing Graphql applications within an Nx workspace.

## Setting up

Adding the Graphql Code Generator plugin to an existing Nx workspace.

```yarn
yarn add -D @nx-tools/nx-graphql-codegen
```

```npm
npm install -D @nx-tools/nx-graphql-codegen
```

## Using Plugin

We can use plugin with bash or Nx console.

```bash
nx g @nx-tools/nx-graphql-codegen:configuration appName
```

We can the call codegen generate with the followin command:

```
nx codegen-generate appName
```
