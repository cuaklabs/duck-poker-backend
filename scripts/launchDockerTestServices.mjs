import { getTestEnvPath } from '@cuaklabs/duck-poker-backend-test-utils';
import { Command } from 'commander/esm.mjs';
import shell from 'shelljs';

const program = new Command();

program
  .option('-d, --dettach');

program.parse(process.argv);

const options = program.opts();

const dettachStringOption = options.dettach ? ' -d' : '';

shell.exec(`docker compose --env-file ${getTestEnvPath()} up${dettachStringOption}`);
