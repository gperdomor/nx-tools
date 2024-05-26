# Push to multi-registries

- [Docker Hub and GHCR](#docker-hub-and-ghcr)

## Docker Hub and GHCR

The following config will connect you to [DockerHub](https://github.com/docker/login-action#dockerhub)
and [GitHub Container Registry](https://github.com/docker/login-action#github-container-registry) and push the
image to these registries.

```json
"docker": {
  "executor": "@nx-tools/nx-container:build",
  "options": {
    "push": true,
    "tags": [
      "your-org/api:latest",
      "your-org/api:v1",
      "ghcr.io/your-org/api:latest",
      "ghcr.io/your-org/api:v1"
    ],
  }
}
```
