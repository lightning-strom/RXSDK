import copy from 'rollup-plugin-copy'
import { resolve } from 'path'
// @ts-ignore
import { buildOutput, distTypes, srcTypes } from './path.ts'

export const copyFiles = (type) => {
  /** `/dist/wegame` */
  const sdkOutput = resolve(buildOutput, type)
  /** `/dist/wegame/channelSDk` */
  const channelSDkDist = resolve(sdkOutput, 'channelSDK')

  /**
   *
  const isFullPck = type.includes('.full')
  const basePckTypes = [
    resolve(distTypes, './index.common.d.ts'),
    resolve(distTypes, './index.social.d.ts'),
    resolve(distTypes, './index.feedback.d.ts'),
  ]

  const fullPckTypes = [
    ...basePckTypes,
    resolve(distTypes, './index.helpcenter.d.ts'),
    resolve(distTypes, `./index.${type.replace('.full', '')}.d.ts`),
  ]

  const alliasPckTypes = isFullPck ? fullPckTypes : basePckTypes
   */

  return copy({
    targets: [
      // 将目标文件命名为index.js
      {
        src: resolve(sdkOutput, `./channel-sdk.${type}.v2.umd.js`),
        dest: channelSDkDist,
        rename: (name, extension) => `index.${extension}`,
      },
      // 将本身模块的.d.ts文件命名为index.d.ts，必须和目标文件同名，解决ts直接引用没有@types(ts声明文件)的js文件包报错
      {
        src: resolve(distTypes, `./index.${type}.d.ts`),
        dest: channelSDkDist,
        rename: () => `index.d.ts`,
      },
      // 自定义的 .d.ts 文件
      {
        src: [
          resolve(srcTypes, './api.d.ts'),
          resolve(srcTypes, `./${type.replace('.full', '')}.d.ts`),
        ],
        dest: channelSDkDist,
      },
      // 包含的模块功能
      // {
      //   src: alliasPckTypes,
      //   dest: channelSDkDist,
      // },
    ],
    verbose: true,
    hook: 'writeBundle',
  })
}
