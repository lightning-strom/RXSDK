// @ts-ignore
import Vue from 'vue/dist/vue.esm.browser'
import SdkH5 from '@/index.h5_gametok'
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
                A Demo for GameTok h5 SDK
              </h3>
              <h4 class='subtitle'>
                This is a test demo for GameTok h5 SDK.
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
              <button class='button is-primary is-inverted is-outlined' @click='roleReport'>
                上报分数
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
          channelId: 'gametok',
          cpid: '119',
          baseUrlList: ['https://os-api-test.ruixueyun.com'],
          // @ts-ignore
          complete: (res: any) => {
            console.log('初始化:', res)
          }
        })
      },

      login() {
        sdk.login({
          method: 'gametokh5'
        }, {
          complete: (res: any) => {
            console.log('登录: ', res)
          }
        })
      },

      pay() {
        sdk.pay({
          pay_type: 'gametokh5',
          productId: 'HAB.WATER.10.COINS', // GameTok需要的productId
          goods_tag: 'bytest',
          trade_no: `${new Date().getTime()}`,
        }, {
          complete: (res: any) => {
            console.log('拉起支付: ', res)
          }
        })
      },

      roleReport() {
        sdk.roleReport({
          score: 10,
          scoreType: 'scoreType',
          remark: 'remark'
        }, {
          complete: (res: any) => {
            console.log('上报分数: ', res)
          }
        })
      },

      share() {
        sdk.roleReport({
          gameShareUrl: 'https://www.baidu.com'
        }, {
          complete: (res: any) => {
            console.log('分享: ', res)
          }
        })
      },

      eventReport() {
        sdk.eventReport({
          eventName: 'REGISTER',
          eventInfo: {
            roleId: '角色ID',
            gameZoneId: '区服ID',
            gameZoneName: '区服名称',
            roleName: '角色名称',
            level: 1,
            score: 100
          }
        }, {
          complete: (res: any) => {
            console.log('事件上报: ', res)
          }
        })
      },

      getchannelInfo() {
        sdk.getchannelInfo({
          complete: (res: any) => {
            console.log('用户来源信息: ', res)
          }
        })
      },

      getEnv() {
        sdk.getEnv({
          complete: (res: any) => {
            console.log('获取当前环境信息: ', res)
          }
        })
      }
    }
  })

  new Vue({
    el: '#app'
  })
}

