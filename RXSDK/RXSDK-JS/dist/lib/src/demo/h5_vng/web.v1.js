"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var vue_esm_browser_1 = require("vue/dist/vue.esm.browser");
var index_h5_vng_1 = require("@/index.h5_vng");
// import eruda from 'eruda'
//
// eruda.init()
// eruda.show()
var rotate = 1;
function default_1() {
    var sdk;
    vue_esm_browser_1.default.component('Demo', {
        template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for VNG h5 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for VNG h5 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button class='button is-primary is-inverted is-outlined' @click='init'>\n                \u521D\u59CB\u5316\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='login'>\n                \u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='pay'>\n                \u652F\u4ED8\n              </button>\n            </div>\n          </div>\n        </section>\n      </div>\n    ",
        data: function () {
            return {
                sdkLoaded: false
            };
        },
        methods: {
            init: function () {
                sdk = new index_h5_vng_1.default({
                    productId: '264',
                    channelId: '10011',
                    cpid: '1000112',
                    baseUrlList: ['https://wygzt.homelandfishingarcade.com'],
                    // @ts-ignore
                    logSwitch: false,
                    // productId: '1002',
                    // channelId: 'minigame_vng',
                    // cpid: '119',
                    // baseUrlList: ['https://os-api-test.ruixueyun.com'],
                    complete: function (res) {
                        console.log('初始化成功:', res);
                    }
                });
            },
            login: function () {
                sdk.login({
                    method: 'minigame_vng'
                }, {
                    complete: function (res) {
                        console.log('登录成功: ', res);
                    }
                });
            },
            pay: function () {
                sdk.pay({
                    pay_type: 'minigame_vng',
                    goods_tag: 'bytest',
                    trade_no: "".concat(new Date().getTime()),
                    currency: 'CNY',
                    serverId: 'server',
                    roleId: 'role1',
                    roleName: 'test role',
                    addInfo: ''
                }, {
                    complete: function (res) {
                        console.log('拉起支付成功: ', res);
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
//# sourceMappingURL=web.v1.js.map