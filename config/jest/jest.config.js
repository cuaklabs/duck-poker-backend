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
  'testUtils-Unit',
  ['/node_modules', '.int.spec.ts'],
  'testUtils',
  '.spec.ts',
);

const testUtilsTsIntegrationProject = getJestTsProjectConfig(
  'testUtils-Integration',
  ['/node_modules'],
  'testUtils',
  '.int.spec.ts',
);

const wsTsUnitProject = getJestTsProjectConfig('ws-Unit', ['/node_modules', '.int.spec.ts'], 'ws', '.spec.ts');

const wsTsIntegrationProject = getJestTsProjectConfig('ws-Integration', ['/node_modules'], 'ws', '.int.spec.ts');

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
    wsTsIntegrationProject,
    wsTsUnitProject,
  ],
};
