// @ts-ignore
import Vue from 'vue/dist/vue.esm.browser'
import SdkH5 from '@/index.h5_iqiyi'
// import eruda from 'eruda'

// eruda.init()
// eruda.show()

export default function() {
  let sdk: any
  Vue.component('Demo', {
    template: `
      <div>
        <section class='hero is-primary'>
          <div class='hero-body'>
            <div class='container'>
              <h3 class='title'>
                A Demo for 爱奇艺h5 SDK
              </h3>
              <h4 class='subtitle'>
                This is a test demo for 爱奇艺h5 SDK.
              </h4>
            </div>
          </div>
        </section>

        <section class='hero is-info actions'>
          <div class='hero-body'>
            <div class='container'>
              <button class='button is-primary is-inverted is-outlined' @click='init'>
                初始化并登录
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='login'>
                登录
              </button>
                <button class='button is-primary is-inverted is-outlined' @click='pay'>
                支付
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='share'>
                分享
              </button>
            </div>
          </div>
        </section>
      </div>
    `,
    data() {
      return {
        sdkLoaded: false,
        single_player_mode: true
      }
    },
    methods: {
      init() {
        sdk = new SdkH5({
          productId: '1002',
          channelId: 'minigame_iqiyi',
          cpid: '114',
          baseUrlList: ['https://cn-api-test.ruixueyun.com'],
          // @ts-ignore
          complete: (res: any) => {
            console.log('初始化成功:', res)
            this.login()
          }
        })
      },

      login() {
        sdk.login({
          method: 'minigame_iqiyi'
        }, {
          complete: (res: any) => {
            console.log('登录成功: ', res)
          }
        })
      },

      pay() {
        sdk.pay({
          pay_type: 'minigame_iqiyi',
          goods_tag: 'bytest',
          trade_no: `${new Date().getTime()}`,
          currency: 'CNY'
        }, {
          complete: (res: any) => {
            console.log('拉起支付: ', res)
          }
        })
      },

      share() {
        sdk.share({
          complete(res: any) {
            console.log('拉起分享: ', res)
          }
        })
      }
    }
  })

  new Vue({
    el: '#app'
  })
}
