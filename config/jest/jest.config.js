const { getJestTsProjectConfig } = require('./jest.config.base');

const envTsUnitProject = getJestTsProjectConfig('env-Unit', ['/node_modules', '.int.spec.ts'], 'env', '.spec.ts');

const envTsIntegrationProject = getJestTsProjectConfig('env-Integration', ['/node_modules'], 'env', '.int.spec.ts');

const redisTsUnitProject = getJestTsProjectConfig('redis-Unit', ['/node_modules', '.int.spec.ts'], 'redis', '.spec.ts');

const redisTsIntegrationProject = getJestTsProjectConfig(
  'redis-Integration',
  ['/node_modules'],
  'redis',
  '.int.spec.ts',
);

const testUtilsTsUnitProject = getJestTsProjectConfig(
  'test-utils-Unit',
  ['/node_modules', '.int.spec.ts'],
  'test-utils',
  '.spec.ts',
);

const testUtilsTsIntegrationProject = getJestTsProjectConfig(
  'test-utils-Integration',
  ['/node_modules'],
  'test-utils',
  '.int.spec.ts',
);

const tsUnitProject = getJestTsProjectConfig('Unit', ['/node_modules', '.int.spec.ts'], undefined, '.spec.ts');

const tsIntegrationProject = getJestTsProjectConfig('Integration', ['/node_modules'], undefined, '.int.spec.ts');

module.exports = {
  projects: [
    envTsUnitProject,
    envTsIntegrationProject,
    redisTsUnitProject,
    redisTsIntegrationProject,
    testUtilsTsUnitProject,
    testUtilsTsIntegrationProject,
    tsIntegrationProject,
    tsUnitProject,
  ],
};
