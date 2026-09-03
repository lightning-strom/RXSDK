import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
// 自动导入vue中hook reactive ref等
import AutoImport from 'unplugin-auto-import/vite'

import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  resolve: {
    // 设置路径别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '#': path.resolve(__dirname, 'src/types') // 全局类型
    }
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/types/auto-import.d.ts',
      // // element-ui
      // resolvers: [RxCompoResolver()]
      resolvers: [VantResolver()]
    }),
    Components({
      resolvers: [VantResolver()]
    }),
    legacy({
      targets: ['chrome 52'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      polyfills: [
        'es.symbol',
        'es.promise',
        'es.promise.finally',
        'es/map',
        'es/set',
        'es.array.filter',
        'es.array.for-each',
        'es.array.flat-map',
        'es.object.define-properties',
        'es.object.define-property',
        'es.object.get-own-property-descriptor',
        'es.object.get-own-property-descriptors',
        'es.object.keys',
        'es.object.to-string',
        'web.dom-collections.for-each',
        'esnext.global-this',
        'esnext.string.match-all'
      ]
    })
  ],
  base: '/static/pay/',
  server: {
    host: '0.0.0.0',
    port: 666,
    headers: {
      // 'Access-Control-Allow-Origin': '*'
      // cookie: 'sessionid=sid_54bb5c29-f116-4fad-b610-aafd3a7e7cfa'
    },
    proxy: {
      //api是自行设置的请求前缀，任何请求路径以/api开头的请求将被代理到对应的target目标
      '/v1': {
        // target: 'http://cn-api-test.ruixueyun.com/', //目标域名
        target: 'https://os-api-test.ruixueyun.com/', //目标域名
        changeOrigin: true, //需要代理跨域
        rewrite: (path) => path.replace(/^\/v1/, '/v1')
      }
    }
  }
}))

