import dts from 'rollup-plugin-dts'
import { resolve } from 'path'
// @ts-ignore
import { buildOutput, distTypes } from './path.ts'

export const generateTypesDefinitions = (type) => {
  const sdkOutput = resolve(buildOutput, type)
  const channelSDkDist = resolve(sdkOutput, 'channelSDK')

  // 从 src 目录读取类型定义文件，而不是 dist
  return {
    input: `src/index.${type}.ts`,
    plugins: [dts()],
    output: {
      format: 'esm',
      file: `${channelSDkDist}/index.d.ts`,
    },
  }
}
