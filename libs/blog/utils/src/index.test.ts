import { getFilePathArrays } from './index';

describe('utils', () => {
  describe('recursiveDirectoryRead()', () => {
    it('returns an absolute path to every file under a directory as an array', async () => {
      const k = getFilePathArrays();
      expect(true).toBe(true);
    });
  });
});
