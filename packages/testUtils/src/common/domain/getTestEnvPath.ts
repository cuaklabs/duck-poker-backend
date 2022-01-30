import path from 'path';

export function getTestEnvPath(): string {
  return path.resolve(__dirname, '..', '..', '..', 'config', 'test.env');
}
