import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { readJSON, writeJSON, writeFile, createReadStream } = fs;
const mediaJSON = join(
	dirname(fileURLToPath(import.meta.url)),
	'../src/data/media.json',
);
