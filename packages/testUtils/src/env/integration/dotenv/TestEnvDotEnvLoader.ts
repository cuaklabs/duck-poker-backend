import { env } from 'process';

import { DotEnvLoader } from '@cuaklabs/duck-poker-backend-env';

import { getTestEnvPath } from '../../../common/domain/getTestEnvPath';
import { TestEnv } from '../../../common/domain/model/TestEnv';

export class TestEnvDotEnvLoader extends DotEnvLoader<TestEnv> {
  constructor() {
    super(getTestEnvPath());
  }

  protected parseIndex(): TestEnv {
    return {
      MONGODB_PASSWORD: env['MONGODB_PASSWORD'] as string,
      MONGODB_URL: env['MONGODB_URL'] as string,
      MONGODB_USERNAME: env['MONGODB_USERNAME'] as string,
      REDIS_HOST: env['REDIS_HOST'] as string,
      REDIS_PORT: parseInt(env['REDIS_PORT'] as string),
    };
  }
}
