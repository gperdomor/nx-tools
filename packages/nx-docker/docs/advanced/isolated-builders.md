# Isolated builders

```json
"api": {
  "docker": {
    "executor": "@nx-tools/nx-docker:build",
    "options": {
      "push": true,
      "tags": ["your-org/api:latest", "your-org/api:v1"],
      "builder": "some-docker-builder"
    }
  }
},
"web": {
  "docker": {
    "executor": "@nx-tools/nx-docker:build",
    "options": {
      "push": true,
      "tags": ["your-org/web:latest", "your-org/web:v1"],
      "builder": "other-docker-builder"
    }
  }
}
```
