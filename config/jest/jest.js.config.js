const { getJestJsProjectConfig } = require('./jest.config.base');

const duckBackendEnvJsUnitProject = getJestJsProjectConfig(
  'duck-backend-env-Unit',
  ['/node_modules', '.int.spec.js'],
  'duck-backend-env',
  '.spec.js',
);

const duckBackendEnvJsIntegrationProject = getJestJsProjectConfig(
  'duck-backend-env-Integration',
  ['/node_modules'],
  'duck-backend-env',
  '.int.spec.js',
);

const duckBackendRedisJsUnitProject = getJestJsProjectConfig(
  'duck-backend-redis-Unit',
  ['/node_modules', '.int.spec.js'],
  'duck-backend-redis',
  '.spec.js',
);

const duckBackendRedisJsIntegrationProject = getJestJsProjectConfig(
  'duck-backend-redis-Integration',
  ['/node_modules'],
  'duck-backend-redis',
  '.int.spec.js',
);

const jsUnitProject = getJestJsProjectConfig('Unit', ['/node_modules', '.int.spec.js'], undefined, '.spec.js');

const jsIntegrationProject = getJestJsProjectConfig('Integration', ['/node_modules'], undefined, '.int.spec.js');

module.exports = {
  projects: [
    duckBackendEnvJsUnitProject,
    duckBackendEnvJsIntegrationProject,
    duckBackendRedisJsIntegrationProject,
    duckBackendRedisJsUnitProject,
    jsIntegrationProject,
    jsUnitProject,
  ],
};
