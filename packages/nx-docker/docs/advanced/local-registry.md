# Local registry

For testing purposes you may need to create a [local registry](https://hub.docker.com/_/registry) to push images into:

```json
"docker": {
  "executor": "@nx-tools/nx-docker:build",
  "options": {
    "push": true,
    "tags": ["localhost:5000/name/app:latest"],
  }
}
```
