#!/bin/sh

sudo chown node node_modules
sudo chown node .pnpm-store

# Install dependencies
corepack install
pnpm install --frozen-lockfile
