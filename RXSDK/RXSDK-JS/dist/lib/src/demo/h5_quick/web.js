"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var vue_esm_browser_1 = require("vue/dist/vue.esm.browser");
var index_h5_quick_1 = require("@/index.h5_quick");
// import eruda from 'eruda'
// eruda.init()
// eruda.show()
var rotate = 1;
function default_1() {
    var sdk;
    vue_esm_browser_1.default.component('Demo', {
        template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for Quick h5 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for Quick h5 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button class='button is-primary is-inverted is-outlined' @click='init'>\n                \u521D\u59CB\u5316\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='login'>\n                \u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='track'>\n                \u4E0A\u62A5\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='getQuickChannelCode'>\n                \u83B7\u53D6quick channelCode\n              </button>\n<!--              <button class='button is-primary is-inverted is-outlined' @click='userVerify'>-->\n<!--                \u5B9E\u540D\u8BA4\u8BC1-->\n<!--              </button>-->\n<!--              <button class='button is-primary is-inverted is-outlined' @click='logoff'>-->\n<!--                \u6CE8\u9500quick-->\n<!--              </button>-->\n            </div>\n          </div>\n        </section>\n      </div>\n    ",
        data: function () {
            return {
                sdkLoaded: false
            };
        },
        methods: {
            init: function () {
                sdk = new index_h5_quick_1.default({
                    productId: '266',
                    channelId: '226',
                    cpid: '1000336',
                    productCode: '72622917469818620363440519084952',
                    productKey: '21451625',
                    baseUrlList: ['https://ghmf2.weileyurtr.com'],
                    complete: function (res) {
                        console.log('初始化成功:', res);
                    }
                });
            },
            login: function () {
                sdk.login({
                    method: 'minigame_quick'
                }, {
                    complete: function (res) {
                        console.log('登录成功: ', res);
                    }
                });
            },
            getQuickChannelCode: function () {
                console.log('获取quick channelCode：', sdk.getQuickChannelCode());
            },
            pay: function () {
                sdk.pay({
                    pay_type: 'minigame_quick',
                    goods_tag: '11000060',
                    trade_no: "".concat(new Date().getTime()),
                    currency: 'CNY',
                    userRoleId: '1',
                    userRoleName: '测试角色',
                    serverId: 1,
                    userServer: '测试区服',
                    userLevel: 1,
                    quantifier: '个'
                }, {
                    complete: function (res) {
                        console.log('拉起支付成功: ', res);
                    }
                });
            },
            rewardedVideoAd: function () {
                sdk.rewardedVideoAd({
                    complete: function (res) {
                        console.log(res);
                    }
                });
            },
            userVerify: function () {
                sdk.userVerify({}, {
                    complete: function (res) {
                        console.log(res);
                    }
                });
            },
            logoff: function () {
                sdk.logoff({
                    complete: function (res) {
                        console.log(res);
                    }
                });
            },
            roleReport: function () {
                sdk.roleReport({
                    isCreateRole: true,
                    roleCreateTime: 1732326024,
                    serverId: 1,
                    serverName: '内测1区',
                    userRoleId: 'roleId1',
                    userRoleName: '小朋友',
                    userRoleBalance: 1000,
                    vipLevel: 1,
                    userRoleLevel: 1,
                    partyId: 1,
                    partyName: '行会名称',
                    gameRoleGender: '男',
                    gameRolePower: 100,
                    partyRoleId: 1,
                    partyRoleName: '会长',
                    professionId: '1',
                    profession: '武士',
                    friendlist: '',
                }, {
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
            },
            track: function () {
                sdk.track({
                    complete: function (data) {
                        console.log(data);
                    },
                }, {
                    event: "test",
                    properties: {
                        test1: "1",
                        test2: "2",
                    },
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