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

  console.log('channelSDkDist', channelSDkDist)
  console.log('channelSDkDist', `${distTypes}/index.${type}.d.ts`)
  return {
    input: [`src/index.${type}.ts`],
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
  const type = 'h5_remian'
  process.env.TYPE = type
  const sdkOutput = resolve(buildOutput, type)

  return [
    mergeConfig({
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
            host: '0.0.0.0'
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
                src: `src/types/h5/interface.d.ts`,
                dest: `dist/${type}/channelSDK`,
                rename: () => `interface.d.ts`
              }
            ],
            verbose: true
          })
        ]
      },
      argv,
      type
    }),
    generateTypesDefinitions(type)
  ]
}
