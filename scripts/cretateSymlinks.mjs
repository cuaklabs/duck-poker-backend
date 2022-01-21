import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cuaklabsModulesDirectory = path.resolve(__dirname, '..', 'node_modules', '@cuaklabs');
const packagesDirectory = path.resolve(__dirname, '..', 'packages');

const packageDirectoryNames = fs.readdirSync(packagesDirectory);

if (!fs.existsSync(cuaklabsModulesDirectory)) {
  fs.mkdirSync(cuaklabsModulesDirectory, { recursive: true });
}

for (const packageDirectoryName of packageDirectoryNames) {
  const packageDirectory = path.resolve(packagesDirectory, packageDirectoryName);
  const moduleDirectory = path.resolve(cuaklabsModulesDirectory, packageDirectoryName);

  if (fs.existsSync(moduleDirectory)) {
    fs.rmSync(moduleDirectory, { recursive: true, force: true });
  }

  fs.symlinkSync(packageDirectory, moduleDirectory, 'dir');
}
