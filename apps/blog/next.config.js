//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  images: {
    // SSG does not support image optimization
    // https://nextjs.org/docs/pages/api-reference/components/image#unoptimized
    unoptimized: true,
    domains: ['webpack.js.org'],
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@gxxc-blog/images': `${process.env.NX_WORKSPACE_ROOT}/libs/blog/assets/img`,
      '@gxxc-blog/styles': `${process.env.NX_WORKSPACE_ROOT}/libs/blog/styles/src/index.css`,
    };

    config.module.parser.javascript.commonjsMagicComments = true;

    return config;
  },

  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: true,
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
