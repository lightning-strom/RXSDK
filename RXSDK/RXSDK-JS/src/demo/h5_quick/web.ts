// @ts-ignore
import Vue from 'vue/dist/vue.esm.browser'
import SdkH5 from '@/index.h5_quick'

// import eruda from 'eruda'

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
                A Demo for Quick h5 SDK
              </h3>
              <h4 class='subtitle'>
                This is a test demo for Quick h5 SDK.
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
              <button class='button is-primary is-inverted is-outlined' @click='track'>
                上报
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='getQuickChannelCode'>
                获取quick channelCode
              </button>
<!--              <button class='button is-primary is-inverted is-outlined' @click='userVerify'>-->
<!--                实名认证-->
<!--              </button>-->
<!--              <button class='button is-primary is-inverted is-outlined' @click='logoff'>-->
<!--                注销quick-->
<!--              </button>-->
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
          productId: '266',
          channelId: '226',
          cpid: '1000336',
          productCode: '72622917469818620363440519084952',
          productKey: '21451625',
          baseUrlList: ['https://ghmf2.weileyurtr.com'],
          complete(res: any) {
            console.log('初始化成功:', res)
          }
        })
      },

      login() {
        sdk.login({
          method: 'minigame_quick'
        }, {
          complete: (res: any) => {
            console.log('登录成功: ', res)
          }
        })
      },

      getQuickChannelCode() {
        console.log('获取quick channelCode：', sdk.getQuickChannelCode())
      },

      pay() {
        sdk.pay({
          pay_type: 'minigame_quick',
          goods_tag: '11000060',
          trade_no: `${new Date().getTime()}`,
          currency: 'CNY',
          userRoleId: '1',
          userRoleName: '测试角色',
          serverId: 1,
          userServer: '测试区服',
          userLevel: 1,
          quantifier: '个'
        }, {
          complete: (res: any) => {
            console.log('拉起支付成功: ', res)
          }
        })
      },

      rewardedVideoAd() {
        sdk.rewardedVideoAd({
          complete(res: any) {
            console.log(res)
          }
        })
      },

      userVerify() {
        sdk.userVerify({}, {
          complete(res: any) {
            console.log(res)
          }
        })
      },

      logoff() {
        sdk.logoff({
          complete(res: any) {
            console.log(res)
          }
        })
      },

      roleReport() {
        sdk.roleReport({
          isCreateRole: true,
          roleCreateTime: 1732326024,
          serverId: 1,
          serverName: '内测1区',
          userRoleId: 'roleId1',
          userRoleName: '小朋友',
          userRoleBalance: 1000,
          vipLevel: 1,
          userRoleLevel: 1,
          partyId: 1,
          partyName: '行会名称',
          gameRoleGender: '男',
          gameRolePower: 100,
          partyRoleId: 1,
          partyRoleName: '会长',
          professionId: '1',
          profession: '武士',
          friendlist: '',
        }, {
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
      },

      track() {
        sdk.track(
          {
            complete: (data: any) => {
              console.log(data);
            },
          },
          {
            event: "test",
            properties: {
              test1: "1",
              test2: "2",
            },
          }
        );
      }
    }
  })

  new Vue({
    el: '#app'
  })
}
