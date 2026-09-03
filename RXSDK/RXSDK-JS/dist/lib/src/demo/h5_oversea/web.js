"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var vue_esm_browser_1 = require("vue/dist/vue.esm.browser");
var index_h5_oversea_1 = require("@/index.h5_oversea");
var eruda_1 = require("eruda");
eruda_1.default.init();
// eruda.show()
function default_1() {
    var sdk;
    vue_esm_browser_1.default.component('Demo', {
        template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for \u6D77\u5916h5 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for \u6D77\u5916h5 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button  class='my-simple-google-btn' @click='init'>\n                \u521D\u59CB\u5316\n              </button>\n\n              <button class='my-simple-google-btn' @click='zaloLogin'>\n                zalo \u767B\u5F55\n              </button>\n\n              <button  class='my-simple-google-btn' @click='appleLogin'>\n                \u82F9\u679C\u767B\u5F55\n              </button>\n\n              <button id='triggerGoogleBtn' class='my-simple-google-btn'>\n                <img src='https://www.google.com/favicon.ico' alt='Google'>\n                Google\u767B\u5F55\n              </button>\n\n              <button class='my-simple-google-btn' @click='facebookLogin'>\n                facebook\u767B\u5F55\n              </button>\n\n              <button  class='my-simple-google-btn' @click='insLogin'>\n                Instagram \u767B\u5F55\n              </button>\n\n              <button  class='my-simple-google-btn' @click='whatsappShare'>\n                whatsapp \u5206\u4EAB\n              </button>\n\n              <button  class='my-simple-google-btn' @click='lineShare'>\n                line \u5206\u4EAB\n              </button>\n\n              <button  class='my-simple-google-btn' @click='zaloShare'>\n                zalo \u5206\u4EAB\n              </button>\n\n              <button  class='my-simple-google-btn' @click='facebookShare'>\n                facebook\u5206\u4EAB\n              </button>\n            </div>\n          </div>\n        </section>\n      </div>\n    ",
        data: function () {
            return {
                sdkLoaded: false
            };
        },
        methods: {
            init: function () {
                var _this = this;
                sdk = new index_h5_oversea_1.default({
                    productId: 'SDKOS',
                    channelId: 'h5sdk',
                    cpid: '119',
                    baseUrlList: ['https://os-api-test.ruixueyun.com'],
                    complete: function (res) {
                        console.log('初始化成功:', res);
                        sdk.facebookInit({
                            appId: '7472805502731255',
                            cookie: true,
                            xfbml: true,
                            version: 'v18.0'
                        });
                        sdk.googleInit({
                            client_id: '728854069094-3gtcp2jbnhq5rmptrkj24vn45s96uqgq.apps.googleusercontent.com',
                            triggerGoogleBtnId: 'triggerGoogleBtn',
                            callback: {
                                initCallback: function () {
                                    console.log('google 初始化成功');
                                },
                                loginCallback: function (response) {
                                    console.log(response);
                                    sdk.login({
                                        method: 'google',
                                        idToken: response.credential
                                    }, {
                                        complete: function (res) {
                                            console.log(res);
                                        }
                                    });
                                }
                            },
                            // attrs: {
                            //   hidden: false
                            // }
                        });
                        // sdk.checkInstagramRedirect({
                        //   complete: (res: any) => {
                        //     if (res.code === 0) {
                        //       _this.insLogin()
                        //     }
                        //   }
                        // })
                    }
                });
            },
            zaloLogin: function () {
                sdk.login({
                    method: 'zalo',
                    zalo_config: {
                        appId: 'YOUR_ZALO_SERVICE_ID'
                    }
                }, {
                    complete: function (res) {
                        console.log('登录: ', res);
                    }
                });
            },
            appleLogin: function () {
                sdk.login({
                    method: 'apple',
                    apple_config: {
                        clientId: 'com.ruixue.h5sdk',
                        scope: 'email name',
                        redirectURI: 'https://os-api-test.ruixueyun.com/static/pay',
                        usePopup: true // 使用弹窗模式
                    }
                }, {
                    complete: function (res) {
                        console.log('登录: ', res);
                    }
                });
            },
            googleLogin: function () {
                sdk.triggerGoogleLogin();
            },
            facebookLogin: function () {
                sdk.login({
                    method: 'facebook',
                    facebook_config: {
                        app_associated_business: false,
                        scope: 'public_profile,email'
                    }
                }, {
                    complete: function (res) {
                        console.log('登录: ', res);
                        if (res.code === 3001) {
                            console.log('取消登录');
                        }
                    }
                });
            },
            insLogin: function () {
                sdk.login({
                    method: 'instagram',
                    instagram_config: {
                        clientId: '1301924134366276',
                        redirectUri: window.location.href
                    }
                }, {
                    complete: function (res) {
                        console.log('登录: ', res);
                    }
                });
            },
            tiktokLogin: function () {
                sdk.login({
                    method: 'tiktok',
                    tiktok_config: {
                        clientKey: 'YOUR_TIKTOK_CLIENT_ID'
                    }
                }, {
                    complete: function (res) {
                        console.log('登录: ', res);
                    }
                });
            },
            zaloShare: function () {
                sdk.share({
                    // func: 'sunurl',
                    platform: 'zalo',
                    href: 'https://developers.facebook.com/docs/'
                }, {
                    complete: function (res) {
                        console.log('分享: ', res);
                    }
                });
            },
            lineShare: function () {
                sdk.share({
                    func: 'sunurl',
                    platform: 'line',
                    href: 'https://developers.facebook.com/docs/'
                }, {
                    complete: function (res) {
                        console.log('分享: ', res);
                    }
                });
            },
            whatsappShare: function () {
                sdk.share({
                    func: 'sunurl',
                    platform: 'whatsapp',
                    href: 'https://developers.facebook.com/docs/'
                }, {
                    complete: function (res) {
                        console.log('分享: ', res);
                    }
                });
            },
            facebookShare: function () {
                sdk.share({
                    // func: 'sunurl',
                    platform: 'facebook',
                    href: 'https://rxfile-test.ruixueyun.com/landing/local/TX4UPfE3MGPtVDyp5xYsnj/1743586512/dist/index.html?type=rx&user_source=share&transmits=&landing_id=276&trigger_id=41&trigger_tag=fish_landing_activity&trigger_type=5&material_type=link&material_id=54&strategy_type=5&strategy_id=88&material_name=Let&trigger_name=捕鱼落地页活动&strategy_name=1&share_time=1743589310&share_type=app&inviter_region=EN&inviter_openid=&inviter_productid=1002&inviter_channelid=h5game&inviter_subchannelid=&api=http%3A%2F%2Fos-api-test.ruixueyun.com&report_ext_params=%7B%22inviter_activity_id%22%3A%22wht_test%22%2C%22inviter_activity_area%22%3A%22EN%22%7D&identity=drHa8CTHR&region=-1&fbclid=6226ccba-9829-4f35-b730-c38ec2b98eac',
                    title: 'title',
                    needNotFuncQuery: true
                }, {
                    complete: function (res) {
                        console.log('分享: ', res);
                    }
                });
            },
            facebookShare1: function () {
                sdk.share({
                    // func: 'sunurl',
                    platform: 'facebook',
                    href: 'https://rxfile-test.ruixueyun.com/landing/local/TX4UPfE3MGPtVDyp5xYsnj/1743586512/dist/index.html?type=rx&user_source=share&transmits=&landing_id=276&trigger_id=41&trigger_tag=fish_landing_activity&trigger_type=5&material_type=link&material_id=54&strategy_type=5&strategy_id=88&material_name=Let&trigger_name=捕鱼落地页活动&strategy_name=1&share_time=1743589310&share_type=app&inviter_region=EN&inviter_openid=&inviter_productid=1002&inviter_channelid=h5game&inviter_subchannelid=&report_ext_params=%7B%22inviter_activity_id%22%3A%22wht_test%22%2C%22inviter_activity_area%22%3A%22EN%22%7D&identity=drHa8CTHR&region=-1&fbclid=6226ccba-9829-4f35-b730-c38ec2b98eac',
                    title: 'title',
                    needNotFuncQuery: true
                }, {
                    complete: function (res) {
                        console.log('分享: ', res);
                    }
                });
            },
            facebookShare2: function () {
                sdk.share({
                    // func: 'sunurl',
                    platform: 'facebook',
                    href: 'https://rxfile-test.ruixueyun.com/landing/local/TX4UPfE3MGPtVDyp5xYsnj/1743586512/dist/index.html?api=http%3A%2F%2Fos-api-test.ruixueyun.com&report_ext_params=%7B%22inviter_activity_id%22%3A%22wht_test%22%2C%22inviter_activity_area%22%3A%22EN%22%7D&identity=drHa8CTHR&region=-1&fbclid=6226ccba-9829-4f35-b730-c38ec2b98eac',
                    title: 'title',
                    needNotFuncQuery: true
                }, {
                    complete: function (res) {
                        console.log('分享: ', res);
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