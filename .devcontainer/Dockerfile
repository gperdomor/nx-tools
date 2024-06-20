FROM mcr.microsoft.com/devcontainers/typescript-node:20-bullseye@sha256:93eed3b668199cd1ed1b00181014024a94d3596f29410e4775effe61c93bdac8

# Update the underlying (Debian) OS, to make sure we have the latest security patches and libraries like 'GLIBC'
RUN sudo apt-get update && sudo apt-get -y upgrade

# Remove pnpm and use corepack
RUN npm -g i npm && \
  npm -g uninstall yarn pnpm && \
  corepack enable
