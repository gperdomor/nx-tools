import { composePlugins, withNx } from '@nx/next';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: '/docs',
        destination: '/docs/nx-container',
        permanent: false,
      },
    ];
  },
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {
    svgr: false,
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withMDX,
];

export default composePlugins(...plugins)(nextConfig);
