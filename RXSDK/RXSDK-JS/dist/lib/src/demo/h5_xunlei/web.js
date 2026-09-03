"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var vue_esm_browser_1 = require("vue/dist/vue.esm.browser");
var index_h5_xunlei_1 = require("@/index.h5_xunlei");
// @ts-ignore
console.log(window.msCrypto);
// import eruda from 'eruda'
// eruda.init()
// eruda.show()
var rotate = 1;
function generateRandomString() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function default_1() {
    var sdk;
    vue_esm_browser_1.default.component('Demo', {
        template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for \u8FC5\u96F7h5 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for \u8FC5\u96F7h5 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button class='button is-primary is-inverted is-outlined' @click='init'>\n                \u521D\u59CB\u5316\u5E76\u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='checkversion'>\n                \u7248\u672C\u68C0\u67E5\n              </button>\n              <!--              <button class='button is-primary is-inverted is-outlined' @click='pay'>-->\n              <!--                \u652F\u4ED8-->\n              <!--              </button>-->\n              <!--              <button class='button is-primary is-inverted is-outlined' @click='rewardedVideoAd'>-->\n              <!--                \u6FC0\u52B1\u5E7F\u544A-->\n              <!--              </button>-->\n              <!--              <button class='button is-primary is-inverted is-outlined' @click='changeRotate'>-->\n              <!--                \u6E38\u620F\u6A2A\u5C4F-->\n              <!--              </button>-->\n              <!--              <button class='button is-primary is-inverted is-outlined' @click='actionReport'>-->\n              <!--                \u6E38\u620F\u884C\u4E3A\u4E0A\u62A5-->\n              <!--              </button>-->\n              <!--              <button class='button is-primary is-inverted is-outlined'-->\n              <!--                      @click='switchIsSinglePlayer'>-->\n              <!--                \u5207\u6362\u6A21\u5F0F \u5F53\u524D\u6A21\u5F0F\uFF1A{{ single_player_mode ? '\u5355\u673A\u6A21\u5F0F' : '\u7F51\u7EDC\u6A21\u5F0F' }}-->\n              <!--              </button>-->\n\n              <button class='button is-primary is-inverted is-outlined'\n                      @click='track'>\n                \u4E0A\u62A5\n              </button>\n            </div>\n          </div>\n        </section>\n      </div>\n    ",
        data: function () {
            return {
                sdkLoaded: false,
                single_player_mode: true
            };
        },
        methods: {
            init: function () {
                sdk = new index_h5_xunlei_1.default({
                    productId: '1002',
                    channelId: '818',
                    cpid: '114',
                    baseUrlList: ['https://cn-api-test.ruixueyun.com'],
                    // @ts-ignore
                    single_player_mode: this.single_player_mode,
                    complete: function (res) {
                        console.log('初始化成功:', res);
                        // this.login()
                        var cpOf = sdk.getCpOf();
                        console.log(cpOf ? '开启加密' : '关闭加密');
                    }
                });
            },
            setCpOf: function () {
                var cpOf = sdk.getCpOf();
                sdk.setCpOf(!cpOf);
                console.log(cpOf ? '关闭加密' : '开启加密');
            },
            checkversion: function () {
                sdk.checkVersion({
                    type: "js",
                    format: "json",
                    devicecode: "c4cc8249-89b9-4b13-b15c-db42addcea07",
                    clientversion: "1.1.1.1",
                    region: 11,
                    games: {},
                    activities: {},
                }, {
                    complete: function (data) {
                        console.log(data);
                    },
                });
            },
            login: function () {
                sdk.login({
                    method: 'minigame_xunlei'
                }, {
                    complete: function (res) {
                        console.log('登录成功: ', res);
                    }
                });
            },
            track: function () {
                var _a;
                sdk.track({
                    event: '#window_exposure',
                    properties: (_a = {},
                        _a["".concat(generateRandomString())] = "".concat(generateRandomString()),
                        _a)
                }, {
                    complete: function (data) {
                        console.log(data);
                    }
                });
            },
            switchIsSinglePlayer: function () {
                // @ts-ignore
                this.single_player_mode = !this.single_player_mode;
                // @ts-ignore
                sdk === null || sdk === void 0 ? void 0 : sdk.switchIsSinglePlayer(this.single_player_mode);
            },
            pay: function () {
                sdk.pay({
                    pay_type: 'minigame_xunlei',
                    goods_tag: 'bytest',
                    trade_no: "".concat(new Date().getTime()),
                    currency: 'CNY'
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
            changeRotate: function () {
                if (rotate == 1) {
                    rotate = 0;
                }
                else {
                    rotate = 1;
                }
                sdk.changeRotate(rotate);
            },
            actionReport: function () {
                sdk.actionReport({
                    gameId: 'cs8c1k5icet9qniupcrg',
                    event: 1,
                    roleId: '1',
                    roleName: '角色名称',
                    serverId: '2',
                    serverName: '区服名称'
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