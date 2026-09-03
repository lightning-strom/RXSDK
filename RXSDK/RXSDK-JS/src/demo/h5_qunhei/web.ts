// @ts-ignore
import Vue from 'vue/dist/vue.esm.browser'
import SdkH5 from '@/index.h5_qunhei'

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
                A Demo for 群黑h5 SDK
              </h3>
              <h4 class='subtitle'>
                This is a test demo for 群黑h5 SDK.
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
              <button class='button is-primary is-inverted is-outlined' @click='wechatFollow'>
                关注微信
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='userVerify'>
                实名验证
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='reloadUrl'>
                刷新
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='checkWord'>
                敏感词
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='upRole'>
                角色上报
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='inputLeave'>
                拉起输入法窗口异常
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
          channelId: 'minigame_qunhei',
          cpid: '114',
          baseUrlList: ['https://cn-api-test.ruixuecloud.com'],
          complete(res: any) {
            console.log('初始化成功:', res)
          }
        })
      },

      login() {
        sdk.login({
          method: 'minigame_qunhei'
        }, {
          complete: (res: any) => {
            console.log('登录成功: ', res)
          }
        })
      },

      pay() {
        sdk.pay({
          pay_type: 'minigame_qunhei',
          goods_tag: 'bytest',
          trade_no: `${new Date().getTime()}`,
          currency: 'CNY'
        }, {
          complete: (res: any) => {
            console.log('拉起支付成功: ', res)
          }
        })
      },

      share() {
        sdk.share()
      },

      wechatFollow() {
        sdk.wechatFollow({
          complete: (res: any) => {
            console.log('关注微信：', res)
          }
        })
      },

      userVerify() {
        sdk.userVerify(3, {
          complete: (res: any) => {
            console.log('实名认证:', res)
          }
        })
      },

      reloadUrl() {
        sdk.reloadUrl()
      },

      checkWord() {
        sdk.checkWord('敏感词测试', {
          complete: (res: any) => {
            console.log('敏感词测试: ', res)
          }
        })
      },

      inputLeave() {
        sdk.inputLeave()
      },

      rewardedVideoAd() {
        sdk.rewardedVideoAd({
          complete(res: any) {
            console.log(res)
          }
        })
      },

      upRole() {
        sdk.upRole({
          act: '1',
          username: 'xxxssss',
          serverid: '123',
          rolename: '测试123',
          roleid: '111',
          level: '1',
          power: '1',
          rolecreatetime: 'xxxx',
          sign: 'xxxxx',
          ver: '2'
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
