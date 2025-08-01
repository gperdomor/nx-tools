#!/usr/bin/env -S pnpm tsx --disable-warning=ExperimentalWarning

import { execute } from '@oclif/core';

await execute({ development: true, dir: import.meta.url });
