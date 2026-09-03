import copy from 'rollup-plugin-copy'
// @ts-ignore
import server from 'rollup-plugin-serve'
import replace from 'rollup-plugin-replace'

// @ts-ignore
import { mergeConfig } from './common.config.ts'

const isProd = process.env.NODE_ENV === 'production'

// @ts-ignore
export default (argv) => {
  const type = 'adjust'
  return mergeConfig({
    config: {
      input: isProd ? `src/index.${type}.ts` : 'src/demo/adjust/index.ts',
      plugins: [
        !isProd && server({
          port: 2000,
          contentBase: ['dist', `dist/${type}`],
          host: '127.0.0.1',
          historyApiFallback: true,
        }),
        !isProd && replace({
          'process.env.NODE_ENV': JSON.stringify('development'),
          'process.env.VUE_ENV': JSON.stringify('browser'),
        }),
        !isProd && copy({
          targets: [
            {
              src: 'src/demo/adjust/index.html',
              dest: `dist/${type}`,
              transform: (contents) => contents.toString().replace('__TYPE__.umd.js', `${type}.umd.js?${new Date().getTime()}`),
            },
          ],
          verbose: true,
        }),
      ],
    },
    argv,
    type,
  })
}
