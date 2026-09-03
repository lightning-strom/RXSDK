import copy from 'rollup-plugin-copy'
import clear from 'rollup-plugin-clear'
import { resolve } from 'path'

// @ts-ignore
import fixAxios from './rollup-pulgin-set-axios-browser-env.ts'

// @ts-ignore
import { mergeConfig } from './common.config.ts'
// @ts-ignore
import { buildOutput } from './path.ts'
// @ts-ignore
import { copyFiles } from './copy-full-files.ts'
// @ts-ignore
import { generateTypesDefinitions } from './types-definitions.ts'

const isProd = process.env.NODE_ENV === 'production'
const type = 'huawei'

export default async (argv) => {
  const type = argv.type || 'huawei'

  /** `/dist/qq` */
  const sdkOutput = resolve(buildOutput, type)
  // const channelSDkDist = resolve(sdkOutput, 'channelSDk')

  const prodPlugins = !isProd
    ? []
    : [
        fixAxios(),
        clear({
          // required, point out which directories should be clear.
          targets: [sdkOutput],
          // optional, whether clear the directores when rollup recompile on --watch mode.
          watch: false, // default: false
        }),
        copyFiles(type),
      ]

  return [
    mergeConfig({
      config: {
        input: isProd ? `src/index.${type}.ts` : `src/demo/huawei/index.ts`,
        plugins: [
          !isProd &&
            copy({
              targets: [{ src: 'src/demo/huawei/*', dest: 'dist' }],
              verbose: true,
            }),
          ...prodPlugins,
        ],
      },
      argv,
      type,
      external: ['qg'],
    }),
    generateTypesDefinitions(type),
  ]
}
