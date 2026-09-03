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
// const type = 'wegame'

export default async (argv) => {
  const type = argv.type || 'wegame.full'
  /** `/dist/wegame` */
  const sdkOutput = resolve(buildOutput, type)

  const prodPlugins = !isProd ? [] :  [
    fixAxios(),
    clear({
      // required, point out which directories should be clear.
      targets: [sdkOutput],
      // optional, whether clear the directores when rollup recompile on --watch mode.
      watch: false, // default: false
    }),
    copyFiles(type),
    // visualizer({
    //   gzipSize: true,
    //   brotliSize: true,
    //   emitFile: false,
    //   filename: "report.html", //分析图生成的文件名
    //   open:true //如果存在本地服务端口，将在打包后自动展示
    // }),
  ]
  return [mergeConfig({
    config: {
      input: isProd ? `src/index.${type}.ts` : `src/demo/wegame/index.ts`,
      plugins: [
        !isProd && copy({
          targets: [
            { src: 'src/demo/wegame/*', dest: 'dist' },
          ],
          verbose: true,
        }),
        ...prodPlugins,
      ],
    },
    argv,
    type,
  }),
    generateTypesDefinitions(type)
  ]
}
