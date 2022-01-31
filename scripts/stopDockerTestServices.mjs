import { getTestEnvPath } from '@cuaklabs/duck-poker-backend-test-utils';
import shell from 'shelljs';

shell.exec(`docker compose --env-file ${getTestEnvPath()} down`);
