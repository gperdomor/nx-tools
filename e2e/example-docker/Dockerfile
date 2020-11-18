ARG NODE_VERSION=14.15.1-alpine

FROM node:${NODE_VERSION} as development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run nx run example-docker:build -- --c=production
RUN npm prune --production

ARG NODE_VERSION
FROM node:${NODE_VERSION} as production
LABEL maintainer="Gustavo Perdomo <gperdomor@gmail.com>"
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
WORKDIR /app
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package*.json /app/dist/apps/example-docker ./
CMD ["node", "main"]
