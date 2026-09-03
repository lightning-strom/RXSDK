"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var vue_esm_browser_1 = require("vue/dist/vue.esm.browser");
var index_h5_lenovo_1 = require("@/index.h5_lenovo");
var eruda_1 = require("eruda");
eruda_1.default.init();
eruda_1.default.show();
function default_1() {
    var sdk;
    vue_esm_browser_1.default.component('Demo', {
        template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for \u8054\u60F3 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for \u8054\u60F3 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button class='button is-primary is-inverted is-outlined' @click='init'>\n                \u521D\u59CB\u5316\u5E76\u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='pay'>\n                \u652F\u4ED8\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='share'>\n                \u5206\u4EAB\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='postGameInfo'>\n                \u4E0A\u62A5\u6E38\u620F\u57FA\u7840\u4FE1\u606F\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='chooseSDWIdentify'>\n                \u5B9E\u540D\u8BA4\u8BC1\n              </button>\n            </div>\n          </div>\n        </section>\n      </div>\n    ",
        data: function () {
            return {
                sdkLoaded: false,
                single_player_mode: true
            };
        },
        methods: {
            init: function () {
                var _this = this;
                sdk = new index_h5_lenovo_1.default({
                    productId: '1002',
                    channelId: 'minigame_lenovo',
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
                    method: 'minigame_lenovo'
                }, {
                    complete: function (res) {
                        console.log('登录成功: ', res);
                    }
                });
            },
            pay: function () {
                sdk.pay({
                    pay_type: 'minigame_lenovo',
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
                sdk.share({
                    title: "联想分享标题",
                    desc: "联想分享描述",
                    link: "http://www.baidu.com",
                    imgUrl: "http://www.lenovo.com/pc/images/icons.png",
                }, {
                    complete: function (res) {
                        console.log('分享: ', res);
                    }
                });
            },
            postGameInfo: function () {
                sdk.postGameInfo({
                    id: '1234567890',
                    sid: '1',
                    sname: '区服名称',
                    nick: '玩家昵称',
                    level: 1,
                    type: '角色类型',
                    vip: 1,
                    power: 100,
                    new: 1,
                    complete: function (res) {
                        console.log('上报基础数据: ', res);
                    }
                }, {
                    complete: function (res) {
                        console.log('上报基础数据: ', res);
                    }
                });
            },
            chooseSDWIdentify: function () {
                sdk.chooseSDWIdentify({
                    complete: function (res) {
                        console.log('实名认证: ', res);
                    }
                }, {
                    complete: function (res) {
                        console.log('上报基础数据: ', res);
                    }
                });
            },
        }
    });
    new vue_esm_browser_1.default({
        el: '#app'
    });
}
exports.default = default_1;
//# sourceMappingURL=web.js.map