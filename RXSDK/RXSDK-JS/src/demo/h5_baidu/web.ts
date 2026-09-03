// @ts-ignore
import Vue from 'vue/dist/vue.esm.browser'

export default function(sdk: any) {
  Vue.component('Demo', {
    template: `
      <div>
        <section class='hero is-primary'>
          <div class='hero-body'>
            <div class='container'>
              <h3 class='title'>
                A Demo for BaiduH5 SDK
              </h3>
              <h4 class='subtitle'>
                This is a test demo for BaiduH5 SDK.
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
              <button class='button is-primary is-inverted is-outlined' @click='share'>
                分享
              </button>
            </div>
          </div>
        </section>
      </div>
    `,
    methods: {
      init() {
        sdk.init()
      },

      login() {
        sdk.login()
      },

      share() {
        sdk.share()
      }
    }
  })

  new Vue({
    el: '#app'
  })
}
