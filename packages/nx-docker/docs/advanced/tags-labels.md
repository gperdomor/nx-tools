# Handle tags and labels

If you want an "automatic" tag management and [OCI Image Format Specification](https://github.com/opencontainers/image-spec/blob/master/annotations.md) for labels, you can do it with a dedicated configuration option.
The following config will use the [Docker metadata package](https://github.com/gperdomor/nx-tools/tree/main/packages/docker-metadata)
to handle tags and labels based on CI events and Git metadata.

> 💡 First you need to install the [@nx-tools/docker-metadata](https://www.npmjs.com/package/@nx-tools/docker-metadata) package.

```json
"docker": {
  "executor": "@nx-tools/nx-docker:build",
  "options": {
    "push": true,
    "metadata": {
      "images": ["name/app", "ghcr.io/username/app"],
      "tags": [
        "type=schedule",
        "type=ref,event=branch",
        "type=ref,event=tag",
        "type=ref,event=pr",
        "type=semver,pattern={{version}}",
        "type=semver,pattern={{major}}.{{minor}}",
        "type=semver,pattern={{major}}",
        "type=sha"
      ]
    }
  }
}
```
