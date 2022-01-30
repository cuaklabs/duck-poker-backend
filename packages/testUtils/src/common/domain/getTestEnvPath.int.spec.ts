import fs from 'fs';

import { getTestEnvPath } from './getTestEnvPath';

describe(getTestEnvPath.name, () => {
  describe('when called', () => {
    let result: string;

    beforeAll(() => {
      result = getTestEnvPath();
    });

    it('should return a path to a file', () => {
      expect(fs.existsSync(result)).toBe(true);
    });
  });
});
