import { Hook } from '@oclif/core';
import { colorize } from '@oclif/core/ux';
import { lt } from 'semver';

const MIN_NODE_VERSION = '20.19.0';

const hook: Hook.Init = async function (options) {
  if (lt(process.version, MIN_NODE_VERSION)) {
    options.context.error(
      colorize(
        'red',
        `This tool requires a Node version compatible. Please make sure that your installed Node version is v${MIN_NODE_VERSION} or greater!`,
      ),
    );
  }
};

export default hook;
