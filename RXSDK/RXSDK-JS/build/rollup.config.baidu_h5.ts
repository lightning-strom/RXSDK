import copy from 'rollup-plugin-copy'
// @ts-ignore
import server from 'rollup-plugin-serve'
// @ts-ignore
import clear from 'rollup-plugin-clear'
import replace from 'rollup-plugin-replace'
// @ts-ignore
import { mergeConfig } from './common.config.ts'
// @ts-ignore
import { buildOutput } from './path.ts'
import { resolve } from 'path'

const isProd = process.env.NODE_ENV === 'production'

// @ts-ignore
export default (argv) => {
  const type = 'h5_baidu'
  process.env.TYPE = type
  const sdkOutput = resolve(buildOutput, type)

  return mergeConfig({
    config: {
      input: isProd ? `src/index.${type}.ts` : `src/demo/${type}/index.ts`,
      plugins: [
        clear({
          targets: [sdkOutput],
          watch: false
        }),
        !isProd && server({
          port: 2000,
          contentBase: ['dist', `dist/${type}`],
          host: '127.0.0.1',
          historyApiFallback: true
        }),
        !isProd && replace({
          'process.env.NODE_ENV': JSON.stringify('development'),
          'process.env.VUE_ENV': JSON.stringify('browser')
        }),
        !isProd && copy({
          targets: [
            {
              src: `src/demo/${type}/index.html`,
              dest: `dist/${type}`,
              transform: (contents) => contents.toString().replace('__TYPE__.umd.js', `${type}.umd.js?${new Date().getTime()}`)
            }
          ],
          verbose: true
        }),
        isProd && copy({
          targets: [
            {
              src: `src/types/h5/${type}.d.ts`,
              dest: `dist/${type}`,
              rename: () => `index.d.ts`
            }
          ],
          verbose: true
        }),
        isProd && copy({
          targets: [
            {
              src: `src/types/h5/common_h5.d.ts`,
              dest: `dist/${type}`,
              rename: () => `common.d.ts`
            }
          ],
          verbose: true
        })
      ]
    },
    argv,
    type
  })
}
