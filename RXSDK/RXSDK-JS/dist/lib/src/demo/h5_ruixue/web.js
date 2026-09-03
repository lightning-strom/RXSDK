"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var vue_esm_browser_1 = require("vue/dist/vue.esm.browser");
var index_h5_ruixue_1 = require("@/index.h5_ruixue");
var eruda_1 = require("eruda");
eruda_1.default.init();
eruda_1.default.show();
function default_1() {
    var sdk;
    vue_esm_browser_1.default.component('Demo', {
        template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for \u745E\u96EAh5 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for \u745E\u96EAh5 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button class='button is-primary is-inverted is-outlined' @click='init'>\n                \u521D\u59CB\u5316\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='login'>\n                \u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='openHelpCenter'>\n                \u5E2E\u52A9\u4E2D\u5FC3\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='openCustomerService'>\n                \u5BA2\u670D\u4E2D\u5FC3\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='openUserCenter'>\n                \u7528\u6237\u4E2D\u5FC3\n              </button>\n            </div>\n          </div>\n        </section>\n      </div>\n    ",
        data: function () {
            return {
                sdkLoaded: false
            };
        },
        methods: {
            init: function () {
                sdk = new index_h5_ruixue_1.default({
                    productId: '1002',
                    channelId: '100',
                    cpid: '114',
                    baseUrlList: ['https://cn-api-test.ruixuecloud.com'],
                    complete: function (res) {
                        console.log('初始化成功:', res);
                    }
                });
            },
            login: function () {
                sdk.login({
                    method: 'ruixue'
                }, {
                    complete: function (res) {
                        console.log('登录成功: ', res);
                    }
                });
            },
            openHelpCenter: function () {
                sdk.openHelpCenter();
            },
            openCustomerService: function () {
                sdk.openCustomerService();
            },
            openUserCenter: function () {
                sdk.openUserCenter();
            }
        }
    });
    new vue_esm_browser_1.default({
        el: '#app'
    });
}
exports.default = default_1;
//# sourceMappingURL=web.js.map