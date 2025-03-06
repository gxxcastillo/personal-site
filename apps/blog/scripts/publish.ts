#!/usr/bin/env node
import { NxS3Publisher } from '@gxxc-blog/tools';

const publisher = new NxS3Publisher({
  publishPath: 'dist/blog/.next',
  appProject: 'blog',
  contentProject: 'content',
  buildTarget: 'build',
  options: {
    contentFilter: /\.html$/,
    fileExtension: '',
  },
});

try {
  publisher.publish();
} catch (error) {
  console.error('Error during publish:', error);
  process.exit(1);
}
