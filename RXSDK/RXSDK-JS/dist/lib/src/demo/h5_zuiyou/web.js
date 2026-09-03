"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var vue_esm_browser_1 = require("vue/dist/vue.esm.browser");
var index_h5_zuiyou_1 = require("@/index.h5_zuiyou");
var eruda_1 = require("eruda");
eruda_1.default.init();
eruda_1.default.show();
function default_1() {
    var sdk;
    vue_esm_browser_1.default.component('Demo', {
        template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for \u6700\u53F3 H5 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for \u6700\u53F3 H5 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button class='button is-primary is-inverted is-outlined' @click='init'>\n                \u521D\u59CB\u5316\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='login'>\n                \u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='pay'>\n                \u652F\u4ED8\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='playRewardAd'>\n                \u6FC0\u52B1\u89C6\u9891\n              </button>\n            </div>\n          </div>\n        </section>\n      </div>\n    ",
        data: function () {
            return {
                sdkLoaded: false
            };
        },
        methods: {
            init: function () {
                sdk = new index_h5_zuiyou_1.default({
                    productId: '1002',
                    channelId: 'minigame_zuiyou',
                    cpid: '114',
                    appkey: 'csbgj9c6597p1ulf0sng',
                    baseUrlList: ['https://cn-api-test.ruixuecloud.com'],
                    complete: function (res) {
                        console.log('初始化成功:', res);
                    }
                });
            },
            login: function () {
                sdk.login({
                    method: 'minigame_zuiyou'
                }, {
                    complete: function (res) {
                        console.log('登录成功: ', res);
                    }
                });
            },
            pay: function () {
                sdk.pay({
                    pay_type: 'minigame_zuiyou',
                    goods_tag: 'bytest',
                    trade_no: "".concat(new Date().getTime()),
                    currency: 'CNY'
                }, {
                    complete: function (res) {
                        console.log('拉起支付成功: ', res);
                    }
                });
            },
            playRewardAd: function () {
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
                        console.log('getPromoDisplayKEY: ', res);
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