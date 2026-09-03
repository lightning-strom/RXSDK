import dts from 'rollup-plugin-dts'
// @ts-ignore
import clear from 'rollup-plugin-clear'
// @ts-ignore
import { mergeConfig } from './common.config.ts'
// @ts-ignore
import { buildOutput, distTypes } from './path.ts'
import { resolve } from 'path'

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
  const type = 'open_data'
  process.env.TYPE = type
  const sdkOutput = resolve(buildOutput, type)

  return [
    mergeConfig({
      config: {
        input: `src/index.${type}.js`,
        plugins: [
          clear({
            targets: [sdkOutput],
            watch: false
          })
        ]
      },
      argv,
      type
    })
  ]
}
