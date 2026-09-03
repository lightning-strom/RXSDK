"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var vue_esm_browser_1 = require("vue/dist/vue.esm.browser");
var index_h5_360_1 = require("@/index.h5_360");
function default_1() {
    var sdk;
    vue_esm_browser_1.default.component('Demo', {
        template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for 360h5 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for 360h5 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button class='button is-primary is-inverted is-outlined' @click='init'>\n                \u521D\u59CB\u5316\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='login'>\n                \u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='pay'>\n                \u652F\u4ED8\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='share'>\n                \u5206\u4EAB\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='rewardedVideoAd'>\n                \u6FC0\u52B1\u5E7F\u544A\n              </button>\n            </div>\n          </div>\n        </section>\n\n        <template v-if='pay_url'>\n          <div style='padding-top: 20px; padding-bottom: 10px'>\n            \u626B\u7801\u652F\u4ED8\uFF1A\n          </div>\n          <iframe\n            :src='pay_url'\n            width='660' height='430' frameborder='0'\n          />\n        </template>\n      </div>\n    ",
        data: function () {
            return {
                sdkLoaded: false,
                pay_url: 'https://iap.g.360-api.cn/iap.html?uid=xxx&platform=wan&gkey=xxx&skey=xx&amount=x'
            };
        },
        methods: {
            init: function () {
                sdk = new index_h5_360_1.default({
                    productId: '1002',
                    channelId: 'minigame_360',
                    cpid: '114',
                    logSwitch: false,
                    baseUrlList: ['https://cn-api-test.ruixuecloud.com'],
                    complete: function (res) {
                        console.log('初始化成功: ', res);
                    }
                });
            },
            login: function () {
                sdk.login({
                    pay_type: 'minigame_360'
                }, {
                    complete: function (res) {
                        console.log('登录成功: ', res);
                    }
                });
            },
            pay: function () {
                var _this = this;
                sdk.pay({
                    pay_type: 'minigame_360',
                    goods_tag: 'bytest',
                    trade_no: "".concat(new Date().getTime()),
                    currency: 'CNY'
                }, {
                    complete: function (res) {
                        console.log('pay: ', res);
                        // @ts-ignore
                        _this.pay_url = res.pay_url;
                    }
                });
            },
            share: function () {
                sdk.share();
            },
            rewardedVideoAd: function () {
                sdk.rewardedVideoAd({
                    complete: function (res) {
                        console.log(res);
                    }
                });
            },
            sendCaptcha: function () {
                sdk.sendCaptcha({
                    phone: '13439093625',
                    purpose: 'bindphone'
                }, {
                    complete: function (res) {
                        console.log('sendCaptcha complete: ', res);
                    }
                });
            },
            getPromoDisplayKEY: function () {
                sdk.getPromoDisplayKEY({
                    complete: function (res) {
                        console.log(res);
                        if (res.code == 0) {
                            console.log(res.data.promo_code);
                        }
                        else {
                            console.log(res);
                        }
                    }
                }, true);
            },
            exchangePromoCDKEY: function () {
                sdk.exchangePromoCDKEY('123', {
                    complete: function (res) {
                        console.log(res);
                    }
                });
            },
            getAnnouncement: function () {
                sdk.getAnnouncement(20, {
                    complete: function (res) {
                        console.log(res);
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