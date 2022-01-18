const { getJestTsProjectConfig } = require('./jest.config.base');

const duckBackendEnvTsUnitProject = getJestTsProjectConfig(
  'duck-backend-env-Unit',
  ['/node_modules', '.int.spec.ts'],
  'duck-backend-env',
  '.spec.ts',
);

const duckBackendEnvTsIntegrationProject = getJestTsProjectConfig(
  'duck-backend-env-Integration',
  ['/node_modules'],
  'duck-backend-env',
  '.int.spec.ts',
);

const duckBackendRedisTsUnitProject = getJestTsProjectConfig(
  'duck-backend-redis-Unit',
  ['/node_modules', '.int.spec.ts'],
  'duck-backend-redis',
  '.spec.ts',
);

const duckBackendRedisTsIntegrationProject = getJestTsProjectConfig(
  'duck-backend-redis-Integration',
  ['/node_modules'],
  'duck-backend-redis',
  '.int.spec.ts',
);

const tsUnitProject = getJestTsProjectConfig('Unit', ['/node_modules', '.int.spec.ts'], undefined, '.spec.ts');

const tsIntegrationProject = getJestTsProjectConfig('Integration', ['/node_modules'], undefined, '.int.spec.ts');

module.exports = {
  projects: [
    duckBackendEnvTsUnitProject,
    duckBackendEnvTsIntegrationProject,
    duckBackendRedisTsUnitProject,
    duckBackendRedisTsIntegrationProject,
    tsIntegrationProject,
    tsUnitProject,
  ],
};
