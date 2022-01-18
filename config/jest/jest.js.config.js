const { getJestJsProjectConfig } = require('./jest.config.base');

const envJsUnitProject = getJestJsProjectConfig('env-Unit', ['/node_modules', '.int.spec.js'], 'env', '.spec.js');

const envJsIntegrationProject = getJestJsProjectConfig('env-Integration', ['/node_modules'], 'env', '.int.spec.js');

const redisJsUnitProject = getJestJsProjectConfig('redis-Unit', ['/node_modules', '.int.spec.js'], 'redis', '.spec.js');

const redisJsIntegrationProject = getJestJsProjectConfig(
  'redis-Integration',
  ['/node_modules'],
  'redis',
  '.int.spec.js',
);

const jsUnitProject = getJestJsProjectConfig('Unit', ['/node_modules', '.int.spec.js'], undefined, '.spec.js');

const jsIntegrationProject = getJestJsProjectConfig('Integration', ['/node_modules'], undefined, '.int.spec.js');

module.exports = {
  projects: [
    envJsUnitProject,
    envJsIntegrationProject,
    redisJsIntegrationProject,
    redisJsUnitProject,
    jsIntegrationProject,
    jsUnitProject,
  ],
};
