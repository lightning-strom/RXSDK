// @ts-ignore
import Vue from 'vue/dist/vue.esm.browser'
import SdkH5 from '@/index.h5_xunlei'

// @ts-ignore
console.log(window.msCrypto)
// import eruda from 'eruda'

// eruda.init()
// eruda.show()

let rotate = 1

function generateRandomString() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default function() {
  let sdk: any
  Vue.component('Demo', {
    template: `
      <div>
        <section class='hero is-primary'>
          <div class='hero-body'>
            <div class='container'>
              <h3 class='title'>
                A Demo for 迅雷h5 SDK
              </h3>
              <h4 class='subtitle'>
                This is a test demo for 迅雷h5 SDK.
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
              <button class='button is-primary is-inverted is-outlined' @click='checkversion'>
                版本检查
              </button>
              <!--              <button class='button is-primary is-inverted is-outlined' @click='pay'>-->
              <!--                支付-->
              <!--              </button>-->
              <!--              <button class='button is-primary is-inverted is-outlined' @click='rewardedVideoAd'>-->
              <!--                激励广告-->
              <!--              </button>-->
              <!--              <button class='button is-primary is-inverted is-outlined' @click='changeRotate'>-->
              <!--                游戏横屏-->
              <!--              </button>-->
              <!--              <button class='button is-primary is-inverted is-outlined' @click='actionReport'>-->
              <!--                游戏行为上报-->
              <!--              </button>-->
              <!--              <button class='button is-primary is-inverted is-outlined'-->
              <!--                      @click='switchIsSinglePlayer'>-->
              <!--                切换模式 当前模式：{{ single_player_mode ? '单机模式' : '网络模式' }}-->
              <!--              </button>-->

              <button class='button is-primary is-inverted is-outlined'
                      @click='track'>
                上报
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
          channelId: '818',
          cpid: '114',
          baseUrlList: ['https://cn-api-test.ruixueyun.com'],
          // @ts-ignore
          single_player_mode: this.single_player_mode,
          complete: (res: any) => {
            console.log('初始化成功:', res)
            // this.login()
            const cpOf = sdk.getCpOf()
            console.log(cpOf ? '开启加密' : '关闭加密')
          }
        })
      },

      setCpOf() {
        const cpOf = sdk.getCpOf()
        sdk.setCpOf(!cpOf)
        console.log(cpOf ? '关闭加密' : '开启加密')
      },

      checkversion(){
        sdk.checkVersion(
          {
            type: "js",
            format: "json",
            devicecode: "c4cc8249-89b9-4b13-b15c-db42addcea07",
            clientversion: "1.1.1.1",
            region: 11,
            games: {},
            activities: {},
          },
          {
            complete: (data: any) => {
              console.log(data);
            },
          }
        )
      },

      login() {
        sdk.login({
          method: 'minigame_xunlei'
        }, {
          complete: (res: any) => {
            console.log('登录成功: ', res)
          }
        })
      },

      track() {
        sdk.track(
          {
            event: '#window_exposure',
            properties: {
              [`${generateRandomString()}`]: `${generateRandomString()}`
            }
          },
          {
            complete: (data: any) => {
              console.log(data)
            }
          }
        )
      },

      switchIsSinglePlayer() {
        // @ts-ignore
        this.single_player_mode = !this.single_player_mode
        // @ts-ignore
        sdk?.switchIsSinglePlayer(this.single_player_mode)
      },

      pay() {
        sdk.pay({
          pay_type: 'minigame_xunlei',
          goods_tag: 'bytest',
          trade_no: `${new Date().getTime()}`,
          currency: 'CNY'
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

      changeRotate() {
        if (rotate == 1) {
          rotate = 0
        } else {
          rotate = 1
        }
        sdk.changeRotate(rotate)
      },

      actionReport() {
        sdk.actionReport({
          gameId: 'cs8c1k5icet9qniupcrg',
          event: 1,
          roleId: '1',
          roleName: '角色名称',
          serverId: '2',
          serverName: '区服名称'
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
