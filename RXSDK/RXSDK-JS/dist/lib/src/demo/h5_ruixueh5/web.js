"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var vue_esm_browser_1 = require("vue/dist/vue.esm.browser");
var index_h5_ruixueh5_1 = require("@/index.h5_ruixueh5");
// @ts-ignore
// import SdkH5 from './sdk.js'
// import eruda from 'eruda'
// eruda.init()
// eruda.show()
function default_1() {
    var sdk;
    vue_esm_browser_1.default.component('Demo', {
        template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for \u745E\u96EAh5 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for \u745E\u96EAh5 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button class='button is-primary is-inverted is-outlined' @click='init'>\n                \u521D\u59CB\u5316aums\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='pay(\"aums\")'>\n                aums qrcode\u652F\u4ED8\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='pay(\"checkstand\")'>\n                \u6536\u94F6\u53F0\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='pay2(\"aums\")'>\n                aums minih5\u652F\u4ED8\n              </button>\n              <br />\n              <button class='button is-primary is-inverted is-outlined' @click='initLakala'>\n                \u521D\u59CB\u5316lakala\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='pay(\"lakala\")'>\n                lakala\u652F\u4ED8\n              </button>\n              <br />\n              <button class='button is-primary is-inverted is-outlined' @click='login'>\n                \u77ED\u4FE1\u767B\u5F55\n              </button>\n               <button class='button is-primary is-inverted is-outlined' @click='login2'>\n                \u666E\u901A\u767B\u5F55\n              </button>\n               <button class='button is-primary is-inverted is-outlined' @click='login3'>\n                \u6E38\u5BA2\u767B\u5F55\n              </button>\n               <button class='button is-primary is-inverted is-outlined' @click='login4'>\n                \u745E\u96EA\u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='loginByOpenid'>\n                \u4E8C\u6B21\u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='closePay'>\n                \u5173\u95ED\u652F\u4ED8\u7A97\u53E3\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='forgetPassword'>\n                \u5FD8\u8BB0\u5BC6\u7801\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='resetPassword'>\n                \u4FEE\u6539\u5BC6\u7801\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='logoff'>\n                \u6CE8\u9500\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='realName'>\n                \u5B9E\u540D\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='openHelpCenter'>\n                \u5E2E\u52A9\u4E2D\u5FC3\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='openService'>\n                \u5BA2\u670D\u4E2D\u5FC3\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='getDeviceCode'>\n                \u83B7\u53D6\u8BBE\u5907\u7801\n              </button>\n<!--              <button class='button is-primary is-inverted is-outlined' @click='openAgreement'>-->\n<!--                \u6253\u5F00\u534F\u8BAE-->\n<!--              </button>-->\n              <button class='button is-primary is-inverted is-outlined' @click='openProtocol'>\n                \u6253\u5F00\u534F\u8BAE\n              </button>\n            </div>\n          </div>\n        </section>\n      </div>\n    ",
        data: function () {
            return {
                sdkLoaded: false
            };
        },
        methods: {
            init: function () {
                // @ts-ignore
                sdk = new index_h5_ruixueh5_1.default({
                    productId: '1002',
                    channelId: 'test_h5',
                    cpid: '119',
                    baseUrlList: ['https://os-api-test.ruixueyun.com'],
                    // productId: '266',
                    // channelId: '9999',
                    // cpid: '1000336',
                    // baseUrlList: ['https://ghmf2.weileyurtr.com'],
                    // logSwitch: false,
                    complete: function (res) {
                        console.log('初始化:', res);
                        console.error(sdk);
                    }
                });
                sdk.setLanguage('zh');
            },
            initLakala: function () {
                // @ts-ignore
                sdk = new index_h5_ruixueh5_1.default({
                    productId: '266',
                    channelId: '191',
                    cpid: '1000336',
                    baseUrlList: ['https://ghmf2.weileyurtr.com'],
                    // productId: '266',
                    // channelId: '9999',
                    // cpid: '1000336',
                    // baseUrlList: ['https://ghmf2.weileyurtr.com'],
                    // logSwitch: false,
                    complete: function (res) {
                        console.log('初始化:', res);
                        console.error(sdk);
                    }
                });
                sdk.setLanguage('zh');
            },
            login: function () {
                sdk.login({
                    method: 'guest',
                    username: '18616076467',
                    captcha_code: '123456',
                    ext: {
                        a: 1
                    }
                }, {
                    complete: function (res) {
                        console.log('登录: ', res);
                        if (res.code === 0) {
                            localStorage.setItem('login_openid', res.data.login_openid);
                        }
                    }
                });
            },
            login2: function () {
                sdk.login({
                    method: 'captchacode',
                }, {
                    complete: function (res) {
                        console.log('登录: ', res);
                        if (res.code === 0) {
                            localStorage.setItem('login_openid', res.data.login_openid);
                        }
                    }
                });
            },
            login3: function () {
                sdk.login({
                    method: 'guest',
                }, {
                    complete: function (res) {
                        console.log('登录: ', res);
                        if (res.code === 0) {
                            localStorage.setItem('login_openid', res.data.login_openid);
                        }
                    }
                });
            },
            login4: function () {
                sdk.login({
                    method: 'ruixue',
                }, {
                    complete: function (res) {
                        console.log('登录: ', res);
                        if (res.code === 0) {
                            localStorage.setItem('login_openid', res.data.login_openid);
                        }
                    }
                });
            },
            forgetPassword: function () {
                sdk.forgetPassword({
                    complete: function (res) {
                        console.log('忘记密码: ', res);
                    }
                });
            },
            resetPassword: function () {
                sdk.resetPassword({
                    complete: function (res) {
                        console.log('修改密码: ', res);
                    }
                });
            },
            loginByOpenid: function () {
                var _this = this;
                sdk.login({
                    method: 'ruixue',
                    login_openid: localStorage.getItem('login_openid')
                }, {
                    complete: function (res) {
                        console.log('二次登录: ', res);
                        if (res.code === 0) {
                            localStorage.setItem('login_openid', res.data.login_openid);
                        }
                    }
                });
            },
            logoff: function () {
                sdk.logoffH5Preview({
                    complete: function (res) {
                        console.log('注销: ', res);
                    }
                });
            },
            realName: function () {
                sdk.realName({
                    complete: function (res) {
                        console.log('实名: ', res);
                    }
                });
            },
            openHelpCenter: function () {
                sdk.openHelpCenter({
                    theme: 'light'
                });
            },
            openService: function () {
                sdk.openService({
                    theme: 'light'
                });
            },
            openAgreement: function () {
                sdk.openAgreement({
                    agreementKey: '00002',
                    agreementTitle: '隐私政策'
                });
            },
            openProtocol: function () {
                sdk.openProtocol({
                    protocol: {
                        key: '00002',
                        key_list: ['00002']
                    }
                });
            },
            pay: function (pay_type) {
                // window.location.href = 'weixin://wap/pay?prepayid%3Dwx1118081596715331f03d0780c7c6090001&package=2521238103&noncestr=1773223696&sign=5d7bb4ace7f502f8e192d93b95bb52fa'
                sdk.pay({
                    pay_type: 'lakala',
                    goods_tag: '830060015',
                    trade_no: "".concat(new Date().getTime()),
                    currency: 'CNY',
                    // webview: 1,
                    ext: {
                        hq_type: 'qrcode'
                    }
                }, {
                    complete: function (res) {
                        console.log('支付: ', res);
                    }
                });
            },
            pay2: function (pay_type) {
                sdk.pay({
                    pay_type: pay_type,
                    goods_tag: 'ios_tag2',
                    trade_no: "".concat(new Date().getTime()),
                    currency: 'CNY',
                    ext: {
                        hq_type: 'minih5'
                    }
                }, {
                    complete: function (res) {
                        console.log('支付: ', res);
                    }
                });
            },
            getDeviceCode: function () {
                console.log('获取设备码: ', sdk.getDeviceCode());
            },
            closePay: function () {
                sdk.closePay();
            }
        }
    });
    new vue_esm_browser_1.default({
        el: '#app'
    });
}
exports.default = default_1;
//# sourceMappingURL=web.js.map