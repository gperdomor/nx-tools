# Troubleshooting

- [INPUT_BUILD_ARGS is not working](#INPUT_BUILD_ARGS-is-not-working)
- [INPUT_TAGS is not working with docker-metadata](#INPUT_TAGS-is-not-working-with-docker-metadata)

## INPUT_BUILD_ARGS is not working

It's a common use case to pass build arguments to the docker command using environment variables, so the first thing you would run is something like this

```bash
INPUT_BUILD_ARGS=NODE_VERSION=14.17.5,NGINX_VERSION=1.21.3 npx nx run angular-app:docker
```

But as you can notice, it do not work as you expect 😢

The problem is because both variables should be separated by a new line instead a comma and you have two ways to do it

### Using dotenv

Create a `.env` file in the root of the workspace with this content

```
INPUT_BUILD_ARGS="NODE_VERSION=14.17.5-alpine\nNGINX_VERSION=1.21.3"
```

Take a look of the `\n` between both variables, then run `nx run angular:docker`

### Inline execution

Sadly, the string of the first option not work if you try to run `INPUT_BUILD_ARGS="NODE_VERSION=14.17.5-alpine\nNGINX_VERSION=1.21.3" nx run angular:docker`, in this case you need to use a new line instead of `\n` like the below image

<img width="682" alt="Screen Shot 2021-10-02 at 1 01 11 PM" src="https://user-images.githubusercontent.com/371939/135723980-2b474eb8-0e4b-4900-b86d-e3f3c52c96c0.png">

## INPUT_TAGS is not working with docker-metadata

This specific case is for the docker-metadata tags, and is the same issue of [INPUT_BUILD_ARGS](#INPUT_BUILD_ARGS-is-not-working), please apply the same solutions described above
