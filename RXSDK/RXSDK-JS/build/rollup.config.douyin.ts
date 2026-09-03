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
import { resolve } from 'path'
import { existsSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'fs'
// @ts-ignore
import { generateTypesDefinitions } from './types-definitions.ts'

const isProd = process.env.NODE_ENV === 'production'

const stripDouyinSourceMap = (sdkOutput) => ({
  name: 'strip-douyin-sourcemap',
  writeBundle() {
    readdirSync(sdkOutput)
      .filter((file) => file.endsWith('.umd.js'))
      .forEach((file) => {
        const jsPath = resolve(sdkOutput, file)
        const mapPath = `${jsPath}.map`
        const code = readFileSync(jsPath, 'utf8').replace(/\n?\/\/# sourceMappingURL=.*?\.map\s*$/, '')

        writeFileSync(jsPath, code)

        if (existsSync(mapPath)) {
          unlinkSync(mapPath)
        }
      })
  }
})

// @ts-ignore
export default (argv) => {
  const type = 'douyin'
  process.env.TYPE = type
  const sdkOutput = resolve(buildOutput, type)

  return [
    mergeConfig({
      config: {
        input: isProd ? `src/index.${type}.ts` : `src/demo/${type}/index.ts`,
        plugins: [
          !isProd && copy({
            targets: [
              {
                src: `src/demo/${type}/*`,
                dest: 'dist'
              }
            ],
            verbose: true
          }),
          clear({
            targets: [sdkOutput],
            watch: false
          }),
          isProd && fixAxios(),
          !isProd && stripDouyinSourceMap(sdkOutput),
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
      type
    }),
    generateTypesDefinitions(type)
  ]
}
