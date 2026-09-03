"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var vue_esm_browser_1 = require("vue/dist/vue.esm.browser");
var index_h5_gametok_1 = require("@/index.h5_gametok");
// import eruda from 'eruda'
// eruda.init()
// eruda.show()
function default_1() {
    var sdk;
    vue_esm_browser_1.default.component('Demo', {
        template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for GameTok h5 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for GameTok h5 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button class='button is-primary is-inverted is-outlined' @click='init'>\n                \u521D\u59CB\u5316\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='login'>\n                \u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='pay'>\n                \u652F\u4ED8\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='roleReport'>\n                \u4E0A\u62A5\u5206\u6570\n              </button>\n            </div>\n          </div>\n        </section>\n      </div>\n    ",
        data: function () {
            return {
                sdkLoaded: false,
                single_player_mode: true
            };
        },
        methods: {
            init: function () {
                sdk = new index_h5_gametok_1.default({
                    productId: '1002',
                    channelId: 'gametok',
                    cpid: '119',
                    baseUrlList: ['https://os-api-test.ruixueyun.com'],
                    // @ts-ignore
                    complete: function (res) {
                        console.log('初始化:', res);
                    }
                });
            },
            login: function () {
                sdk.login({
                    method: 'gametokh5'
                }, {
                    complete: function (res) {
                        console.log('登录: ', res);
                    }
                });
            },
            pay: function () {
                sdk.pay({
                    pay_type: 'gametokh5',
                    productId: 'HAB.WATER.10.COINS',
                    goods_tag: 'bytest',
                    trade_no: "".concat(new Date().getTime()),
                }, {
                    complete: function (res) {
                        console.log('拉起支付: ', res);
                    }
                });
            },
            roleReport: function () {
                sdk.roleReport({
                    score: 10,
                    scoreType: 'scoreType',
                    remark: 'remark'
                }, {
                    complete: function (res) {
                        console.log('上报分数: ', res);
                    }
                });
            },
            share: function () {
                sdk.roleReport({
                    gameShareUrl: 'https://www.baidu.com'
                }, {
                    complete: function (res) {
                        console.log('分享: ', res);
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
                        level: 1,
                        score: 100
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