import { getTestEnvPath } from '@cuaklabs/duck-poker-backend-testUtils';
import shell from 'shelljs';

shell.exec(`docker compose --env-file ${getTestEnvPath()} down`);
