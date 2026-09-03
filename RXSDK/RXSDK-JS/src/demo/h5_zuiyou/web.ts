// @ts-ignore
import Vue from 'vue/dist/vue.esm.browser'
import SdkH5 from '@/index.h5_zuiyou'

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
                A Demo for 最右 H5 SDK
              </h3>
              <h4 class='subtitle'>
                This is a test demo for 最右 H5 SDK.
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
              <button class='button is-primary is-inverted is-outlined' @click='pay'>
                支付
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='playRewardAd'>
                激励视频
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
          channelId: 'minigame_zuiyou',
          cpid: '114',
          appkey: 'csbgj9c6597p1ulf0sng',
          baseUrlList: ['https://cn-api-test.ruixuecloud.com'],
          complete(res: any) {
            console.log('初始化成功:', res)
          }
        })
      },

      login() {
        sdk.login({
          method: 'minigame_zuiyou'
        }, {
          complete: (res: any) => {
            console.log('登录成功: ', res)
          }
        })
      },

      pay() {
        sdk.pay({
          pay_type: 'minigame_zuiyou',
          goods_tag: 'bytest',
          trade_no: `${new Date().getTime()}`,
          currency: 'CNY'
        }, {
          complete: (res: any) => {
            console.log('拉起支付成功: ', res)
          }
        })
      },

      playRewardAd() {
        sdk.rewardedVideoAd({
          complete: (res: any) => {
            console.log(res)
          }
        })
      },

      sendCaptcha() {
        sdk.sendCaptcha(
          {
            phone: '13439093625',
            purpose: 'bindphone'
          },
          {
            complete: (res: any) => {
              console.log('sendCaptcha complete: ', res)
            }
          }
        )
      },

      getPromoDisplayKEY() {
        sdk.getPromoDisplayKEY({
          complete: (res: any) => {
            console.log('getPromoDisplayKEY: ', res)
          }
        }, true)
      },

      exchangePromoCDKEY() {
        sdk.exchangePromoCDKEY('123', {
          complete(res: any) {
            console.log(res)
          }
        })
      },

      getAnnouncement() {
        sdk.getAnnouncement(20, {
          complete(res: any) {
            console.log(res)
          }
        })
      }
    }
  })

  new Vue({
    el: '#app'
  })
}
