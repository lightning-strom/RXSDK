// @ts-ignore
import Vue from 'vue/dist/vue.esm.browser'
import SdkH5 from '@/index.h5_vng'

// import eruda from 'eruda'
//
// eruda.init()
// eruda.show()

let rotate = 1

export default function() {
  let sdk: any
  Vue.component('Demo', {
    template: `
      <div>
        <section class='hero is-primary'>
          <div class='hero-body'>
            <div class='container'>
              <h3 class='title'>
                A Demo for VNG h5 SDK
              </h3>
              <h4 class='subtitle'>
                This is a test demo for VNG h5 SDK.
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
              <button class='button is-primary is-inverted is-outlined' @click='payWeb'>
                支付web
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='analyticsTrack'>
                上报
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='analyticsTrack2'>
                上报2
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='analyticsTrack3'>
                上报3
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='analyticsTrackCustomEvent'>
                上报自定义
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
          // productId: '264',
          // channelId: '10011',
          // cpid: '1000112',
          // baseUrlList: ['https://wygzt.homelandfishingarcade.com'],
          // // @ts-ignore
          // logSwitch: false,
          productId: '1002',
          channelId: 'minigame_vng',
          cpid: '114',
          baseUrlList: ['https://cn-api-test.ruixueyun.com'],
          complete(res: any) {
            console.log('初始化成功:', res)
          }
        })
        console.log(sdk)
        sdk.setLanguage('vi')
      },

      login() {
        sdk.login({
          method: 'minigame_vng'
        }, {
          complete: (res: any) => {
            console.log('登录成功: ', res)
          }
        })
      },

      pay() {
        sdk.pay({
          pay_type: 'minigame_vng',
          goods_tag: 'bytest',
          trade_no: `${new Date().getTime()}`,
          currency: 'CNY',
          serverId: 'server',
          roleId: 'role1',
          roleName: 'test role',
          addInfo: ''
        }, {
          complete: (res: any) => {
            console.log('拉起支付成功: ', res)
          }
        })
      },
      payWeb() {
        sdk.pay({
          ext: {
            hq_type: 'webshop'
          }
        }, {
          complete: (res: any) => {
            console.log('拉起支付成功: ', res)
          }
        })
      },
      analyticsTrack() {
        sdk.analyticsTrack({
          type: 'nruCreateRoleSuccess',
          params: {
            role_id: '123456',
            server_id: 'abcdeefg',
            extra_data: '!@###$$',
          }
        })
      },
      analyticsTrackCustomEvent() {
        sdk.analyticsTrack({
          type: 'trackCustomEvent',
          params: {
            event_name: 'custom_event_name',
            game_id: '1',
            role_id: '123456',
          }
        })
      },
      analyticsTrack2() {
        sdk.analyticsTrack({
          type: 'mdaLevelUp',
          params: {
            extra_data: '!@###$$', // Additional game data
          }
        }, {
          complete: (res: any) => {
            console.log('上报成功: ', res)
          }
        })
      },
      analyticsTrack3() {
        window.VNGGamesSDK.Analytics.nruCreateRoleSuccess({
          role_id: "123456",
          server_id: "1",
          extra_data: "",
        });
      }
    }
  })

  new Vue({
    el: '#app'
  })
}
