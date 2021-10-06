# Export image to Docker

You may want your build result to be available in the Docker client through `docker images` to be able to use it
in another step of your workflow:

```json
"docker": {
  "executor": "@nx-tools/nx-docker:build",
  "options": {
    "load": true,
    "tags": ["myimage:latest"],
  }
}
```
