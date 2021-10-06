# Multi-platform image

You can build multi-platform images using the [`platforms` input](../../README.md#inputs) as described below.

> 💡 List of available platforms will be displayed and available through our [setup-buildx](https://github.com/docker/setup-buildx-action#about) action.

> 💡 If you want support for more platforms, you can use QEMU with our [setup-qemu](https://github.com/docker/setup-qemu-action) action.

```json
"docker": {
  "executor": "@nx-tools/nx-docker:build",
  "options": {
    "file": "apps/api/Dockerfile",
    "platforms": ["linux/amd64", "linux/arm64"],
    "push": true,
    "tags": ["your-org/api:latest", "your-org/api:v1"],
  }
}
```
