FROM mcr.microsoft.com/devcontainers/typescript-node:20-bullseye

# Update the underlying (Debian) OS, to make sure we have the latest security patches and libraries like 'GLIBC'
RUN sudo apt-get update && sudo apt-get -y upgrade

# Remove pnpm and use corepack
RUN npm -g i npm && \
  npm -g uninstall yarn pnpm && \
  corepack enable
