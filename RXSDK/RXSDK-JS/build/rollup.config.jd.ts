import copy from 'rollup-plugin-copy-merge'
// @ts-ignore
import server from 'rollup-plugin-serve'
// @ts-ignore
import clear from 'rollup-plugin-clear'
import replace from 'rollup-plugin-replace'
import fixAxios from './rollup-pulgin-set-axios-browser-env.ts'
// @ts-ignore
import { mergeConfig } from './common.config.ts'
// @ts-ignore
import { buildOutput } from './path.ts'
// @ts-ignore
import { generateTypesDefinitions } from './types-definitions.ts'
import { resolve } from 'path'

const isProd = process.env.NODE_ENV === 'production'

// @ts-ignore
export default (argv) => {
  const type = 'jd'
  process.env.TYPE = type
  const sdkOutput = resolve(buildOutput, type)

  return [
    mergeConfig({
      config: {
        input: isProd ? `src/index.${type}.ts` : `src/demo/${type}/index.ts`,
        plugins: [
          isProd && fixAxios(),
          clear({
            targets: [sdkOutput],
            watch: false
          }),
          isProd && copy({
            targets: [
              {
                src: `src/types/rpk/interface.d.ts`,
                dest: `dist/${type}/channelSDK`,
                rename: () => `interface.d.ts`
              }
            ],
            verbose: true
          })
        ]
      },
      // @ts-ignore
      argv,
      type
    }),
    generateTypesDefinitions(type)
  ]
}
