FROM node:14.8-alpine as development
WORKDIR /app
COPY package*.json ./
RUN CYPRESS_INSTALL_BINARY=0 npm install --quiet
COPY . .
RUN npm run nx run example-app:build -- --c=production

FROM node:14.8-alpine as production
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN CYPRESS_INSTALL_BINARY=0 npm install --quiet --only=production
COPY --from=development /app/dist/packages/example-app .
CMD ["node", "main"]
