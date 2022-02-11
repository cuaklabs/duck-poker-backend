import { TestEnv } from '../../..';
import { TestEnvDotEnvLoader } from './TestEnvDotEnvLoader';

describe(TestEnvDotEnvLoader.name, () => {
  describe('.load()', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        const testEnvDotEnvLoader: TestEnvDotEnvLoader = new TestEnvDotEnvLoader();

        testEnvDotEnvLoader.load();

        result = testEnvDotEnvLoader.index;
      });

      it('should set index property', () => {
        const expectedResult: TestEnv = {
          MONGODB_PASSWORD: 'SafestPasswordEver',
          MONGODB_URL: 'mongodb://testUsername:SafestPasswordEver@127.0.0.1:27017',
          MONGODB_USERNAME: 'testUsername',
          REDIS_HOST: '0.0.0.0',
          REDIS_PORT: 6379,
        };

        expect(result).toStrictEqual(expectedResult);
      });
    });
  });
});
