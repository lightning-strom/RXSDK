"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var vue_esm_browser_1 = require("vue/dist/vue.esm.browser");
var index_h5_haluo_1 = require("@/index.h5_haluo");
var eruda_1 = require("eruda");
eruda_1.default.init();
eruda_1.default.show();
function default_1() {
    var sdk;
    vue_esm_browser_1.default.component('Demo', {
        template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for \u54C8\u5570h5 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for \u54C8\u5570h5 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button class='button is-primary is-inverted is-outlined' @click='init'>\n                \u521D\u59CB\u5316\u5E76\u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='login'>\n                \u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='pay'>\n                \u652F\u4ED8\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='share'>\n                \u5206\u4EAB\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='startRewardVideo'>\n                \u6FC0\u52B1\u5E7F\u544A\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='eventReport'>\n                \u4E8B\u4EF6\u4E0A\u62A5\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='getchannelInfo'>\n                \u7528\u6237\u6765\u6E90\u4FE1\u606F\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='getEnv'>\n                \u83B7\u53D6\u5F53\u524D\u73AF\u5883\u4FE1\u606F\n              </button>\n            </div>\n          </div>\n        </section>\n      </div>\n    ",
        data: function () {
            return {
                sdkLoaded: false,
                single_player_mode: true
            };
        },
        methods: {
            init: function () {
                var _this = this;
                sdk = new index_h5_haluo_1.default({
                    productId: '1002',
                    channelId: 'minigame_haluo',
                    cpid: '114',
                    gameId: '1257891009193361408',
                    baseUrlList: ['https://cn-api-test.ruixueyun.com'],
                    // @ts-ignore
                    complete: function (res) {
                        console.log('初始化:', res);
                        _this.login();
                    }
                });
            },
            login: function () {
                sdk.login({
                    method: 'minigame_haluo'
                }, {
                    complete: function (res) {
                        console.log('登录: ', res);
                    }
                });
            },
            pay: function () {
                sdk.pay({
                    pay_type: 'minigame_haluo',
                    goods_tag: 'bytest',
                    trade_no: "".concat(new Date().getTime()),
                }, {
                    complete: function (res) {
                        console.log('拉起支付: ', res);
                    }
                });
            },
            share: function () {
                sdk.share({
                    gameShareUrl: 'https://www.baidu.com'
                }, {
                    complete: function (res) {
                        console.log('分享: ', res);
                    }
                });
            },
            startRewardVideo: function () {
                sdk.startRewardVideo({
                    complete: function (res) {
                        console.log('激励广告: ', res);
                    }
                });
            },
            eventReport: function () {
                sdk.eventReport({
                    eventName: 'REGISTER',
                    eventInfo: {
                        roleId: '角色ID',
                        gameZoneId: '区服ID',
                        gameZoneName: '区服名称',
                        roleName: '角色名称',
                    }
                }, {
                    complete: function (res) {
                        console.log('事件上报: ', res);
                    }
                });
            },
            getchannelInfo: function () {
                sdk.getchannelInfo({
                    complete: function (res) {
                        console.log('用户来源信息: ', res);
                    }
                });
            },
            getEnv: function () {
                sdk.getEnv({
                    complete: function (res) {
                        console.log('获取当前环境信息: ', res);
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