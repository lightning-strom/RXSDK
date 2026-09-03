import copy from 'rollup-plugin-copy'
// @ts-ignore
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

// @ts-ignore
export default async (argv) => {
  const type = 'oppo'
  const sdkOutput = resolve(buildOutput, type)

  const prodPlugins = !isProd ? [] : [
    fixAxios(),
    clear({
      targets: [sdkOutput],
      watch: false // default: false
    }),
    copyFiles(type)
  ]

  return [mergeConfig({
    config: {
      input: isProd ? `src/index.${type}.ts` : `src/demo/oppo/index.ts`,
      plugins: [
        !isProd && copy({
          targets: [
            { src: 'src/demo/oppo/*', dest: 'dist' }
          ],
          verbose: true
        }),
        ...prodPlugins
      ]
    },
    argv,
    type
  }),
    generateTypesDefinitions(type)
  ]
}
