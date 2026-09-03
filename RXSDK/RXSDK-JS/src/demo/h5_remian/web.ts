// @ts-ignore
import Vue from 'vue/dist/vue.esm.browser'
import SdkH5 from '@/index.h5_remian'
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
                A Demo for 热面h5 SDK
              </h3>
              <h4 class='subtitle'>
                This is a test demo for 热面h5 SDK.
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
              <button class='button is-primary is-inverted is-outlined' @click='deregister'>
                注销账号
              </button>
              <button class='button is-primary is-inverted is-outlined' @click='deregisterCancel'>
                撤销注销
              </button>
            </div>
          </div>
        </section>

        <!-- 弹窗遮罩层 -->
        <div v-if='showModal' class='modal-overlay' @click='closeModal'>
          <div class='modal-content' @click.stop>
            <div class='modal-header'>
              <h3 class='modal-title'>结果展示</h3>
              <button class='modal-close' @click='closeModal'>&times;</button>
            </div>
            <div class='modal-body'>
              <p><strong>结果:</strong></p>
              <pre class='modal-info'>{{ modalMessage }}</pre>
            </div>
            <div class='modal-footer'>
              <button class='button is-primary' @click='closeModal'>确定</button>
            </div>
          </div>
        </div>
      </div>
    `,
    data() {
      return {
        sdkLoaded: false,
        single_player_mode: true,
        showModal: false,
        modalMessage: ''
      }
    },
    methods: {
      init() {
        sdk = new SdkH5({
          productId: '1002',
          channelId: 'remianh5',
          cpid: '114',
          baseUrlList: ['https://cn-api-test.ruixueyun.com'],
          // @ts-ignore
          complete: (res: any) => {
            console.log('初始化成功:', res, window.location)
            // 弹窗展示结果
            this.showSuccessModal(res)
          }
        })
      },

      login() {
        sdk.login({
          method: 'remianh5',
          ext:{
            env: 1, // 1 测试 0 正式
          }
        }, {
          complete: (res: any) => {
            console.log('登录成功: ', res)
            // 弹窗展示结果
            this.showSuccessModal(res)
          }
        })
      },

      pay() {
        sdk.pay({
          pay_type: 'remianh5',
          goods_tag: 'bytest',
          trade_no: `${new Date().getTime()}`,
          currency: 'CNY',
          env: 1
        }, {
          complete: (res: any) => {
            console.log('拉起支付: ', res)
            // 弹窗展示结果
            this.showSuccessModal(res)
          }
        })
      },

      deregister() {
        sdk.deregister({}, {
          complete: (res: any) => {
            console.log('注销账号: ', res)
            this.showSuccessModal(res)
          }
        })
      },

      deregisterCancel() {
        sdk.deregisterCancel({
          complete: (res: any) => {
            console.log('撤销注销: ', res)
            this.showSuccessModal(res)
          }
        })
      },

      showSuccessModal(res: any) {
        const message = JSON.stringify({
          result: res,
        }, null, 2)
        // @ts-ignore
        this.modalMessage = message
        // @ts-ignore
        this.showModal = true
      },

      closeModal() {
        // @ts-ignore
        this.showModal = false
        // @ts-ignore
        this.modalMessage = ''
      },
    }
  })

  new Vue({
    el: '#app'
  })
}
