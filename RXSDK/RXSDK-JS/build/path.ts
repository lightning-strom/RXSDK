
import { resolve } from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const projRoot = resolve(__dirname, '..')

/** `/src` */
export const srcRoot = resolve(projRoot, 'src')
/** `/src/types` */
export const srcTypes = resolve(srcRoot, 'types')

/** `/dist` */
export const buildOutput = resolve(projRoot, 'dist')
/** `/dist/types` */
export const distTypes = resolve(buildOutput, 'types')

