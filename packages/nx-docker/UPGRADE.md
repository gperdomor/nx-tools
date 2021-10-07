# Upgrade notes

## v1 to v2

- Option `file` defaults to a Dockerfile inside the current target application folder
- Rename `meta` option TO `metadata`
- Option `metadata.enabled` is not required, the metadata extraction is enabled when `metadata.images` is present
- @nx-tools/docker-metadata is now an optional dependency so need to be installed to use the metadata extraction

### Simple workflow

```json
// v1
{
  "api": {
    ...
    "docker": {
      "executor": "@nx-tools/nx-docker:build",
      "options": {
        "file": "apps/api/Dockerfile",
        "load": true,
        "tags": ["your-org/api:latest", "your-org/api:v1"],
      }
    }
  }
}
```

```json
// v2
{
  "api": {
    ...
    "docker": {
      "executor": "@nx-tools/nx-docker:build",
      "options": {
        "load": true,
        "tags": ["your-org/api:latest", "your-org/api:v1"],
      }
    }
  }
}
```

### Tags with ref and Git labels

```json
// v1
{
  "api": {
    ...
    "docker": {
      "executor": "@nx-tools/nx-docker:build",
      "options": {
        "file": "apps/api/Dockerfile",
        "load": true,
        "meta": {
          "enabled": true,
          "images": ["your-org/api"],
          "tags": [
            "type=schedule",
            "type=ref,event=branch",
            "type=ref,event=tag",
            "type=ref,event=pr"
          ]
        }
      }
    }
  }
}
```

```json
// v2
{
  "api": {
    ...
    "docker": {
      "executor": "@nx-tools/nx-docker:build",
      "options": {
        "load": true,
        "metadata": {
          "images": ["your-org/api"],
          "tags": [
            "type=schedule",
            "type=ref,event=branch",
            "type=ref,event=tag",
            "type=ref,event=pr"
          ]
        }
      }
    }
  }
}
```
