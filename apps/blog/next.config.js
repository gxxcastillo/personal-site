//@ts-check
import { composePlugins, withNx } from '@nx/next';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  /**
   * NextJS will generate a new buildId on each build - which breaks caching when
   * file contents have not changed.
   *
   * If we don't change the buildId the file cache will only invalidate when the
   * content has changed.
   *
   * Since the buildId can not work to invalidate the cache, it will need to be
   * manually invalidated by updating the file's hash in .publish/state.yml
   */
  generateBuildId: () => 'static-build-id',
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

export default composePlugins(...plugins)(nextConfig);
