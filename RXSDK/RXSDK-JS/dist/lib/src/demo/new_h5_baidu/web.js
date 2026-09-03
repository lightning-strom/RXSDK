"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var vue_esm_browser_1 = require("vue/dist/vue.esm.browser");
var index_new_h5_baidu_1 = require("@/index.new_h5_baidu");
// import eruda from 'eruda'
// eruda.init()
// eruda.show()
function default_1() {
    var sdk;
    vue_esm_browser_1.default.component('Demo', {
        template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for \u767E\u5EA6h5 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for \u7231\u5947\u827Ah5 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button class='button is-primary is-inverted is-outlined' @click='init'>\n                \u521D\u59CB\u5316\u5E76\u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='login'>\n                \u767B\u5F55\n              </button>\n                <button class='button is-primary is-inverted is-outlined' @click='pay'>\n                \u652F\u4ED8\n              </button>\n            </div>\n          </div>\n        </section>\n      </div>\n    ",
        data: function () {
            return {
                sdkLoaded: false,
                single_player_mode: true
            };
        },
        methods: {
            init: function () {
                var _this = this;
                sdk = new index_new_h5_baidu_1.default({
                    productId: '1002',
                    channelId: 'baiduh5',
                    cpid: '114',
                    baseUrlList: ['https://cn-api-test.ruixueyun.com'],
                    // @ts-ignore
                    complete: function (res) {
                        console.log('初始化成功:', res);
                        _this.login();
                    }
                });
            },
            login: function () {
                sdk.login({
                    method: 'baiduh5'
                }, {
                    complete: function (res) {
                        console.log('登录成功: ', res);
                    }
                });
            },
            pay: function () {
                sdk.pay({
                    pay_type: 'baiduh5',
                    goods_tag: 'bytest',
                    trade_no: "".concat(new Date().getTime()),
                    currency: 'CNY',
                    gameId: 119698319
                }, {
                    complete: function (res) {
                        console.log('拉起支付: ', res);
                    }
                });
            }
        }
    });
    new vue_esm_browser_1.default({
        el: '#app'
    });
}
exports.default = default_1;
//# sourceMappingURL=web.js.map