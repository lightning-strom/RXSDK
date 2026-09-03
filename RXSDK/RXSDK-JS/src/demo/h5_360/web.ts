// @ts-ignore
import Vue from 'vue/dist/vue.esm.browser'
import SdkH5 from '@/index.h5_360'

export default function() {
  let sdk: any
  Vue.component('Demo', {
    template: `
      <div>
        <section class='hero is-primary'>
          <div class='hero-body'>
            <div class='container'>
              <h3 class='title'>
                A Demo for 360h5 SDK
              </h3>
              <h4 class='subtitle'>
                This is a test demo for 360h5 SDK.
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
              <button class='button is-primary is-inverted is-outlined' @click='share'>
                分享
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='rewardedVideoAd'>
                激励广告
              </button>
            </div>
          </div>
        </section>

        <template v-if='pay_url'>
          <div style='padding-top: 20px; padding-bottom: 10px'>
            扫码支付：
          </div>
          <iframe
            :src='pay_url'
            width='660' height='430' frameborder='0'
          />
        </template>
      </div>
    `,
    data() {
      return {
        sdkLoaded: false,
        pay_url: 'https://iap.g.360-api.cn/iap.html?uid=xxx&platform=wan&gkey=xxx&skey=xx&amount=x'
      }
    },
    methods: {
      init() {
        sdk = new SdkH5({
          productId: '1002',
          channelId: 'minigame_360',
          cpid: '114',
          logSwitch: false,
          baseUrlList: ['https://cn-api-test.ruixuecloud.com'],
          complete(res: any) {
            console.log('初始化成功: ', res)
          }
        })
      },

      login() {
        sdk.login({
          pay_type: 'minigame_360'
        }, {
          complete: (res: any) => {
            console.log('登录成功: ', res)
          }
        })
      },

      pay() {
        sdk.pay({
          pay_type: 'minigame_360',
          goods_tag: 'bytest',
          trade_no: `${new Date().getTime()}`,
          currency: 'CNY'
        }, {
          complete: (res: any) => {
            console.log('pay: ', res)
            // @ts-ignore
            this.pay_url = res.pay_url
          }
        })
      },

      share() {
        sdk.share()
      },

      rewardedVideoAd() {
        sdk.rewardedVideoAd({
          complete(res: any) {
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
            console.log(res)
            if (res.code == 0) {
              console.log(res.data.promo_code)
            } else {
              console.log(res)
            }
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
