// @ts-ignore
import Vue from 'vue/dist/vue.esm.browser'
import SdkH5 from '@/index.h5_lenovo'
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
                A Demo for 联想 SDK
              </h3>
              <h4 class='subtitle'>
                This is a test demo for 联想 SDK.
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
              <button class='button is-primary is-inverted is-outlined' @click='pay'>
                支付
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='share'>
                分享
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='postGameInfo'>
                上报游戏基础信息
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='chooseSDWIdentify'>
                实名认证
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
          channelId: 'minigame_lenovo',
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
          method: 'minigame_lenovo'
        }, {
          complete: (res: any) => {
            console.log('登录成功: ', res)
          }
        })
      },

      pay() {
        sdk.pay({
          pay_type: 'minigame_lenovo',
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
        sdk.share({
          title: "联想分享标题",
          desc: "联想分享描述",
          link: "http://www.baidu.com",
          imgUrl: "http://www.lenovo.com/pc/images/icons.png",
        }, {
          complete: (res: any) => {
            console.log('分享: ', res)
          }
        })
      },

      postGameInfo() {
        sdk.postGameInfo({
          id: '1234567890',
          sid: '1',
          sname: '区服名称',
          nick: '玩家昵称',
          level: 1,
          type: '角色类型',
          vip: 1,
          power: 100,
          new: 1,
          complete: (res: any) => {
            console.log('上报基础数据: ', res)
          }
        }, {
          complete: (res: any) => {
            console.log('上报基础数据: ', res)
          }
        })
      },

      chooseSDWIdentify() {
        sdk.chooseSDWIdentify({
          complete: (res: any) => {
            console.log('实名认证: ', res)
          }
        }, {
          complete: (res: any) => {
            console.log('上报基础数据: ', res)
          }
        })
      },

    }
  })

  new Vue({
    el: '#app'
  })
}
