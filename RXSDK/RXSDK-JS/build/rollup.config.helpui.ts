import copy from 'rollup-plugin-copy-merge'
import dts from 'rollup-plugin-dts'
// @ts-ignore
import server from 'rollup-plugin-serve'
// @ts-ignore
import clear from 'rollup-plugin-clear'
import replace from 'rollup-plugin-replace'
// @ts-ignore
import { mergeConfig } from './common.config.ts'
// @ts-ignore
import { buildOutput, distTypes } from './path.ts'
import { resolve } from 'path'

const isProd = process.env.NODE_ENV === 'production'

// @ts-ignore
export const generateTypesDefinitions = (type) => {
  const sdkOutput = resolve(buildOutput, type)
  const channelSDkDist = resolve(sdkOutput, 'channelSDK')

  return {
    input: [`${distTypes}/index.${type}.d.ts`],
    plugins: [
      dts()
    ],
    output: {
      format: 'esm',
      file: `${channelSDkDist}/index.d.ts`
    }
  }
}

// @ts-ignore
export default (argv) => {
  const type = 'helpui'
  process.env.TYPE = type
  const sdkOutput = resolve(buildOutput, type)

  return [
    mergeConfig({
      config: {
        input: isProd ? `src/index.${type}.js` : `src/demo/${type}/index.js`,
        plugins: [
          clear({
            targets: [sdkOutput],
            watch: false
          })
        ]
      },
      argv,
      type
    }),
  ]
}
