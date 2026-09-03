import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
import replace from 'rollup-plugin-replace'
import { terser } from 'rollup-plugin-terser'
import { string } from 'rollup-plugin-string'
import copy from 'rollup-plugin-copy'
import { camelCase } from 'lodash'
import buildDocument from './build-document.js'

const pkg = require('../package.json')
const isProd = process.env.NODE_ENV === 'production'
const libraryName = pkg.name
const version = pkg.version
const replaceName = isProd ? null : libraryName
/**
 * SDK_VERSION 为瑞雪sdk 版本，每次发版前需要更新，跟更新日志最新版本保持一致
 */
const SDK_VERSION = '4.0.5'
const requestAxiosModule = '/src/rpk/requestAxios'

const getFileName = (name, type, isDev = false) => {
  return (
    name
      // libraryName.channel.vN[.dev].js
      .replace(
        libraryName,
        `${type}/${libraryName}.${type}${isProd ? `.v${version.split('.')[0]}` : ''}${
          isDev ? '.dev' : ``
        }`
      )
      .replace(replaceName, 'index')
  )
}

export const mergeConfig = ({ config, type }) => {
  const output = {
    file: getFileName(pkg.main, type),
    name: camelCase(libraryName).replace('Sdk', 'SDK'),
    format: 'umd',
    sourcemap: true,
    banner: undefined,
  }
  const terserConfig = {
    compress: {
      pure_funcs: ['console.log'],
    },
    output: {
      comments: false,
    },
  }
  const plugins = [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve({
      browser: true,
    }),

    // Resolve source maps to the original source
    !isProd && sourceMaps(),

    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VERSION': JSON.stringify(version),
      'process.env.TYPE': JSON.stringify(String(type)),
      __SDK_VERSION: SDK_VERSION,
    }),
    // 引用文件为字符串
    string({
      include: '**/*.html',
    }),

    isProd &&
      copy({
        targets: [
          { src: 'public/*', dest: 'dist' },
          { src: 'documents', dest: 'dist' },
          { src: 'src/keleSdk', dest: 'dist' },
        ],
        verbose: true,
      }),

    isProd && buildDocument(),
  ]
  const outputArray = [
    {
      ...output,
      plugins: isProd && terser(terserConfig),
    },
  ]
  if (isProd) {
    outputArray.push({
      ...output,
      plugins: undefined,
      file: getFileName(pkg.main, type, true),
      // @ts-ignore
      banner: `;;;console.warn("%c${output.name}: Your are using Dev version!!!", "font-size: 20px;");;;`,
    })
  }
  const defaultConfig = {
    input: isProd ? `src/index.${type}.ts` : `src/demo/${type}/index.ts`,
    output: outputArray,
    treeshake: {
      moduleSideEffects: (id) => !id.includes(requestAxiosModule),
    },
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
      include: 'src/**',
    },
  }

  return Object.assign(defaultConfig, config, {
    plugins: plugins.concat(config.plugins || []),
  })
}
