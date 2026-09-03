// @ts-ignore
import Vue from 'vue/dist/vue.esm.browser'
import SdkH5 from '@/index.h5_ruixue'

import eruda from 'eruda'

eruda.init()
eruda.show()

export default function() {
  let sdk: any
  Vue.component('Demo', {
    template: `
      <div>
        <section class='hero is-primary'>
          <div class='hero-body'>
            <div class='container'>
              <h3 class='title'>
                A Demo for 瑞雪h5 SDK
              </h3>
              <h4 class='subtitle'>
                This is a test demo for 瑞雪h5 SDK.
              </h4>
            </div>
          </div>
        </section>

        <section class='hero is-info actions'>
          <div class='hero-body'>
            <div class='container'>
              <button class='button is-primary is-inverted is-outlined' @click='init'>
                初始化
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='login'>
                登录
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='openHelpCenter'>
                帮助中心
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='openCustomerService'>
                客服中心
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='openUserCenter'>
                用户中心
              </button>
            </div>
          </div>
        </section>
      </div>
    `,
    data() {
      return {
        sdkLoaded: false
      }
    },
    methods: {
      init() {
        sdk = new SdkH5({
          productId: '1002',
          channelId: '100',
          cpid: '114',
          baseUrlList: ['https://cn-api-test.ruixuecloud.com'],
          complete(res: any) {
            console.log('初始化成功:', res)
          }
        })
      },

      login() {
        sdk.login({
          method: 'ruixue'
        }, {
          complete: (res: any) => {
            console.log('登录成功: ', res)
          }
        })
      },

      openHelpCenter() {
        sdk.openHelpCenter()
      },

      openCustomerService() {
        sdk.openCustomerService()
      },

      openUserCenter() {
        sdk.openUserCenter()
      }
    }
  })

  new Vue({
    el: '#app'
  })
}
