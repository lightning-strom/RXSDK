"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var vue_esm_browser_1 = require("vue/dist/vue.esm.browser");
var index_h5_qunhei_1 = require("@/index.h5_qunhei");
var eruda_1 = require("eruda");
eruda_1.default.init();
eruda_1.default.show();
function default_1() {
    var sdk;
    vue_esm_browser_1.default.component('Demo', {
        template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for \u7FA4\u9ED1h5 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for \u7FA4\u9ED1h5 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button class='button is-primary is-inverted is-outlined' @click='init'>\n                \u521D\u59CB\u5316\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='login'>\n                \u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='pay'>\n                \u652F\u4ED8\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='share'>\n                \u5206\u4EAB\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='rewardedVideoAd'>\n                \u6FC0\u52B1\u5E7F\u544A\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='wechatFollow'>\n                \u5173\u6CE8\u5FAE\u4FE1\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='userVerify'>\n                \u5B9E\u540D\u9A8C\u8BC1\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='reloadUrl'>\n                \u5237\u65B0\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='checkWord'>\n                \u654F\u611F\u8BCD\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='upRole'>\n                \u89D2\u8272\u4E0A\u62A5\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='inputLeave'>\n                \u62C9\u8D77\u8F93\u5165\u6CD5\u7A97\u53E3\u5F02\u5E38\n              </button>\n            </div>\n          </div>\n        </section>\n      </div>\n    ",
        data: function () {
            return {
                sdkLoaded: false
            };
        },
        methods: {
            init: function () {
                sdk = new index_h5_qunhei_1.default({
                    productId: '1002',
                    channelId: 'minigame_qunhei',
                    cpid: '114',
                    baseUrlList: ['https://cn-api-test.ruixuecloud.com'],
                    complete: function (res) {
                        console.log('初始化成功:', res);
                    }
                });
            },
            login: function () {
                sdk.login({
                    method: 'minigame_qunhei'
                }, {
                    complete: function (res) {
                        console.log('登录成功: ', res);
                    }
                });
            },
            pay: function () {
                sdk.pay({
                    pay_type: 'minigame_qunhei',
                    goods_tag: 'bytest',
                    trade_no: "".concat(new Date().getTime()),
                    currency: 'CNY'
                }, {
                    complete: function (res) {
                        console.log('拉起支付成功: ', res);
                    }
                });
            },
            share: function () {
                sdk.share();
            },
            wechatFollow: function () {
                sdk.wechatFollow({
                    complete: function (res) {
                        console.log('关注微信：', res);
                    }
                });
            },
            userVerify: function () {
                sdk.userVerify(3, {
                    complete: function (res) {
                        console.log('实名认证:', res);
                    }
                });
            },
            reloadUrl: function () {
                sdk.reloadUrl();
            },
            checkWord: function () {
                sdk.checkWord('敏感词测试', {
                    complete: function (res) {
                        console.log('敏感词测试: ', res);
                    }
                });
            },
            inputLeave: function () {
                sdk.inputLeave();
            },
            rewardedVideoAd: function () {
                sdk.rewardedVideoAd({
                    complete: function (res) {
                        console.log(res);
                    }
                });
            },
            upRole: function () {
                sdk.upRole({
                    act: '1',
                    username: 'xxxssss',
                    serverid: '123',
                    rolename: '测试123',
                    roleid: '111',
                    level: '1',
                    power: '1',
                    rolecreatetime: 'xxxx',
                    sign: 'xxxxx',
                    ver: '2'
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