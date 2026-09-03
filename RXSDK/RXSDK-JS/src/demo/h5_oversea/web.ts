// @ts-ignore
import Vue from 'vue/dist/vue.esm.browser'
import SdkH5 from '@/index.h5_oversea'

import eruda from 'eruda'

eruda.init()
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
                A Demo for 海外h5 SDK
              </h3>
              <h4 class='subtitle'>
                This is a test demo for 海外h5 SDK.
              </h4>
            </div>
          </div>
        </section>

        <section class='hero is-info actions'>
          <div class='hero-body'>
            <div class='container'>
              <button  class='my-simple-google-btn' @click='init'>
                初始化
              </button>

              <button class='my-simple-google-btn' @click='zaloLogin'>
                zalo 登录
              </button>

              <button  class='my-simple-google-btn' @click='appleLogin'>
                苹果登录
              </button>

              <button id='triggerGoogleBtn' class='my-simple-google-btn'>
                <img src='https://www.google.com/favicon.ico' alt='Google'>
                Google登录
              </button>

              <button class='my-simple-google-btn' @click='facebookLogin'>
                facebook登录
              </button>

              <button  class='my-simple-google-btn' @click='insLogin'>
                Instagram 登录
              </button>

              <button  class='my-simple-google-btn' @click='whatsappShare'>
                whatsapp 分享
              </button>

              <button  class='my-simple-google-btn' @click='lineShare'>
                line 分享
              </button>

              <button  class='my-simple-google-btn' @click='zaloShare'>
                zalo 分享
              </button>

              <button  class='my-simple-google-btn' @click='facebookShare'>
                facebook分享
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
        let _this = this
        sdk = new SdkH5({
          productId: 'SDKOS',
          channelId: 'h5sdk',
          cpid: '119',
          baseUrlList: ['https://os-api-test.ruixueyun.com'],
          complete(res: any) {
            console.log('初始化成功:', res)

            sdk.facebookInit({
              appId: '7472805502731255',
              cookie: true,
              xfbml: true,
              version: 'v18.0'
            })
            sdk.googleInit({
              client_id: '728854069094-3gtcp2jbnhq5rmptrkj24vn45s96uqgq.apps.googleusercontent.com',
              triggerGoogleBtnId: 'triggerGoogleBtn',
              callback: {
                initCallback() {
                  console.log('google 初始化成功')
                },
                loginCallback(response: any) {
                  console.log(response)
                  sdk.login({
                    method: 'google',
                    idToken: response.credential
                  }, {
                    complete(res: any) {
                      console.log(res)
                    }
                  })
                }
              },
              // attrs: {
              //   hidden: false
              // }
            })
            // sdk.checkInstagramRedirect({
            //   complete: (res: any) => {
            //     if (res.code === 0) {
            //       _this.insLogin()
            //     }
            //   }
            // })
          }
        })
      },

      zaloLogin() {
        sdk.login({
          method: 'zalo',
          zalo_config: {
            appId: 'YOUR_ZALO_SERVICE_ID'
          }
        }, {
          complete: (res: any) => {
            console.log('登录: ', res)
          }
        })
      },

      appleLogin() {
        sdk.login({
          method: 'apple',
          apple_config: {
            clientId: 'com.ruixue.h5sdk', // 你的 Apple 服务 ID
            scope: 'email name',
            redirectURI: 'https://os-api-test.ruixueyun.com/static/pay', // 你的回调地址
            usePopup: true // 使用弹窗模式
          }
        }, {
          complete: (res: any) => {
            console.log('登录: ', res)
          }
        })
      },

      googleLogin() {
        sdk.triggerGoogleLogin()
      },

      facebookLogin() {
        sdk.login({
          method: 'facebook',
          facebook_config: {
            app_associated_business: false,
            scope: 'public_profile,email'
          }
        }, {
          complete: (res: any) => {
            console.log('登录: ', res)

            if (res.code === 3001) {
              console.log('取消登录')
            }
          }
        })
      },

      insLogin() {
        sdk.login({
          method: 'instagram',
          instagram_config: {
            clientId: '1301924134366276',
            redirectUri: window.location.href
          }
        }, {
          complete: (res: any) => {
            console.log('登录: ', res)
          }
        })
      },

      tiktokLogin() {
        sdk.login({
          method: 'tiktok',
          tiktok_config: {
            clientKey: 'YOUR_TIKTOK_CLIENT_ID'
          }
        }, {
          complete: (res: any) => {
            console.log('登录: ', res)
          }
        })
      },

      zaloShare() {
        sdk.share({
          // func: 'sunurl',
          platform: 'zalo',
          href: 'https://developers.facebook.com/docs/'
        }, {
          complete: (res: any) => {
            console.log('分享: ', res)
          }
        })
      },

      lineShare() {
        sdk.share({
          func: 'sunurl',
          platform: 'line',
          href: 'https://developers.facebook.com/docs/'
        }, {
          complete: (res: any) => {
            console.log('分享: ', res)
          }
        })
      },

      whatsappShare() {
        sdk.share({
          func: 'sunurl',
          platform: 'whatsapp',
          href: 'https://developers.facebook.com/docs/'
        }, {
          complete: (res: any) => {
            console.log('分享: ', res)
          }
        })
      },

      facebookShare() {
        sdk.share({
          // func: 'sunurl',
          platform: 'facebook',
          href: 'https://rxfile-test.ruixueyun.com/landing/local/TX4UPfE3MGPtVDyp5xYsnj/1743586512/dist/index.html?type=rx&user_source=share&transmits=&landing_id=276&trigger_id=41&trigger_tag=fish_landing_activity&trigger_type=5&material_type=link&material_id=54&strategy_type=5&strategy_id=88&material_name=Let&trigger_name=捕鱼落地页活动&strategy_name=1&share_time=1743589310&share_type=app&inviter_region=EN&inviter_openid=&inviter_productid=1002&inviter_channelid=h5game&inviter_subchannelid=&api=http%3A%2F%2Fos-api-test.ruixueyun.com&report_ext_params=%7B%22inviter_activity_id%22%3A%22wht_test%22%2C%22inviter_activity_area%22%3A%22EN%22%7D&identity=drHa8CTHR&region=-1&fbclid=6226ccba-9829-4f35-b730-c38ec2b98eac',
          title: 'title',
          needNotFuncQuery: true
        }, {
          complete: (res: any) => {
            console.log('分享: ', res)
          }
        })
      },

      facebookShare1() {
        sdk.share({
          // func: 'sunurl',
          platform: 'facebook',
          href: 'https://rxfile-test.ruixueyun.com/landing/local/TX4UPfE3MGPtVDyp5xYsnj/1743586512/dist/index.html?type=rx&user_source=share&transmits=&landing_id=276&trigger_id=41&trigger_tag=fish_landing_activity&trigger_type=5&material_type=link&material_id=54&strategy_type=5&strategy_id=88&material_name=Let&trigger_name=捕鱼落地页活动&strategy_name=1&share_time=1743589310&share_type=app&inviter_region=EN&inviter_openid=&inviter_productid=1002&inviter_channelid=h5game&inviter_subchannelid=&report_ext_params=%7B%22inviter_activity_id%22%3A%22wht_test%22%2C%22inviter_activity_area%22%3A%22EN%22%7D&identity=drHa8CTHR&region=-1&fbclid=6226ccba-9829-4f35-b730-c38ec2b98eac',
          title: 'title',
          needNotFuncQuery: true
        }, {
          complete: (res: any) => {
            console.log('分享: ', res)
          }
        })
      },

      facebookShare2() {
        sdk.share({
          // func: 'sunurl',
          platform: 'facebook',
          href: 'https://rxfile-test.ruixueyun.com/landing/local/TX4UPfE3MGPtVDyp5xYsnj/1743586512/dist/index.html?api=http%3A%2F%2Fos-api-test.ruixueyun.com&report_ext_params=%7B%22inviter_activity_id%22%3A%22wht_test%22%2C%22inviter_activity_area%22%3A%22EN%22%7D&identity=drHa8CTHR&region=-1&fbclid=6226ccba-9829-4f35-b730-c38ec2b98eac',
          title: 'title',
          needNotFuncQuery: true
        }, {
          complete: (res: any) => {
            console.log('分享: ', res)
          }
        })
      }
    }
  })

  new Vue({
    el: '#app'
  })
}
