// @ts-ignore
import Vue from 'vue/dist/vue.esm.browser'
import channelSDK from '@/index.h5_ruixueh5'
// @ts-ignore
// import SdkH5 from './sdk.js'
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
                初始化aums
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='pay("aums")'>
                aums qrcode支付
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='pay("checkstand")'>
                收银台
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='pay2("aums")'>
                aums minih5支付
              </button>
              <br />
              <button class='button is-primary is-inverted is-outlined' @click='initLakala'>
                初始化lakala
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='pay("lakala")'>
                lakala支付
              </button>
              <br />
              <button class='button is-primary is-inverted is-outlined' @click='login'>
                短信登录
              </button>
               <button class='button is-primary is-inverted is-outlined' @click='login2'>
                普通登录
              </button>
               <button class='button is-primary is-inverted is-outlined' @click='login3'>
                游客登录
              </button>
               <button class='button is-primary is-inverted is-outlined' @click='login4'>
                瑞雪登录
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='loginByOpenid'>
                二次登录
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='closePay'>
                关闭支付窗口
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='forgetPassword'>
                忘记密码
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='resetPassword'>
                修改密码
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='logoff'>
                注销
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='realName'>
                实名
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='openHelpCenter'>
                帮助中心
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='openService'>
                客服中心
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='getDeviceCode'>
                获取设备码
              </button>
<!--              <button class='button is-primary is-inverted is-outlined' @click='openAgreement'>-->
<!--                打开协议-->
<!--              </button>-->
              <button class='button is-primary is-inverted is-outlined' @click='openProtocol'>
                打开协议
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
        // @ts-ignore
        sdk = new channelSDK({
          productId: '1002',
          channelId: 'test_h5',
          cpid: '119',
          baseUrlList: ['https://os-api-test.ruixueyun.com'],
          // productId: '266',
          // channelId: '9999',
          // cpid: '1000336',
          // baseUrlList: ['https://ghmf2.weileyurtr.com'],
          // logSwitch: false,
          complete(res: any) {
            console.log('初始化:', res)
            console.error(sdk)
          }
        })

        sdk.setLanguage('zh')
      },
      initLakala() {
        // @ts-ignore
        sdk = new channelSDK({
          productId: '266',
          channelId: '191',
          cpid: '1000336',
          baseUrlList: ['https://ghmf2.weileyurtr.com'],
          // productId: '266',
          // channelId: '9999',
          // cpid: '1000336',
          // baseUrlList: ['https://ghmf2.weileyurtr.com'],
          // logSwitch: false,
          complete(res: any) {
            console.log('初始化:', res)
            console.error(sdk)
          }
        })

        sdk.setLanguage('zh')
      },

      login() {
        sdk.login({
          method: 'guest',
          username: '18616076467',
          captcha_code: '123456',
          ext: {
            a:1
          }
        }, {
          complete: (res: any) => {
            console.log('登录: ', res)
            if (res.code === 0) {
              localStorage.setItem('login_openid', res.data.login_openid)
            }
          }
        })
      },

      login2() {
        sdk.login({
          method: 'captchacode',
        }, {
          complete: (res: any) => {
            console.log('登录: ', res)
            if (res.code === 0) {
              localStorage.setItem('login_openid', res.data.login_openid)
            }
          }
        })
      },

      login3() {
        sdk.login({
          method: 'guest',
        }, {
          complete: (res: any) => {
            console.log('登录: ', res)
            if (res.code === 0) {
              localStorage.setItem('login_openid', res.data.login_openid)
            }
          }
        })
      },

      login4() {
        sdk.login({
          method: 'ruixue',
        }, {
          complete: (res: any) => {
            console.log('登录: ', res)
            if (res.code === 0) {
              localStorage.setItem('login_openid', res.data.login_openid)
            }
          }
        })
      },

      forgetPassword() {
        sdk.forgetPassword({
          complete: (res: any) => {
            console.log('忘记密码: ', res)
          }
        })
      },

      resetPassword() {
        sdk.resetPassword({
          complete: (res: any) => {
            console.log('修改密码: ', res)
          }
        })
      },

      loginByOpenid() {
        let _this = this
        sdk.login({
          method: 'ruixue',
          login_openid: localStorage.getItem('login_openid')
        }, {
          complete: (res: any) => {
            console.log('二次登录: ', res)
            if (res.code === 0) {
              localStorage.setItem('login_openid', res.data.login_openid)
            }
          }
        })
      },

      logoff() {
        sdk.logoffH5Preview({
          complete: (res: any) => {
            console.log('注销: ', res)
          }
        })
      },

      realName() {
        sdk.realName({
          complete: (res: any) => {
            console.log('实名: ', res)
          }
        })
      },

      openHelpCenter() {
        sdk.openHelpCenter({
          theme: 'light'
        })
      },

      openService() {
        sdk.openService({
          theme: 'light'
        })
      },

      openAgreement() {
        sdk.openAgreement({
          agreementKey: '00002',
          agreementTitle: '隐私政策'
        })
      },

      openProtocol() {
        sdk.openProtocol({
          protocol: {
            key: '00002',
            key_list: ['00002']
          }
        })
      },

      pay(pay_type: string) {
        // window.location.href = 'weixin://wap/pay?prepayid%3Dwx1118081596715331f03d0780c7c6090001&package=2521238103&noncestr=1773223696&sign=5d7bb4ace7f502f8e192d93b95bb52fa'
        sdk.pay({
          pay_type: 'lakala',
          goods_tag: '830060015',
          trade_no: `${new Date().getTime()}`,
          currency: 'CNY',
          // webview: 1,
          ext: {
             hq_type: 'qrcode'
          }
        }, {
          complete: (res: any) => {
            console.log('支付: ', res)
          }
        })
      },

      pay2(pay_type: string) {
        sdk.pay({
          pay_type: pay_type,
          goods_tag: 'ios_tag2',
          trade_no: `${new Date().getTime()}`,
          currency: 'CNY',
          ext: {
             hq_type: 'minih5'
          }
        }, {
          complete: (res: any) => {
            console.log('支付: ', res)
          }
        })
      },

      getDeviceCode() {
        console.log('获取设备码: ', sdk.getDeviceCode())
      },

      closePay() {
        sdk.closePay()
      }
    }
  })

  new Vue({
    el: '#app'
  })
}
