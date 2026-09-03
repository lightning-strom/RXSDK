
import { rollup } from 'rollup'
import dts from 'rollup-plugin-dts';
import { buildOutput, distTypes } from './path'
import { resolve } from 'path'

const sdkOutput = resolve(buildOutput, 'test')

const config = {
  input: `${distTypes}/index.wegame.full.d.ts`,
  plugins: [dts()],
  output: {
    format: 'esm',
    file: `${sdkOutput}/index.d.ts`,
  },
}

async function build(option) {
  const bundle = await rollup(option)
  await bundle.write(option.output)
}

(async () => {
  try {
    await build(config)

    // await promisify(ncp)('./types/', './')

  } catch (e) {
    console.error(111, e) // eslint-disable-line no-console
  }
})()
