"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var vue_esm_browser_1 = require("vue/dist/vue.esm.browser");
var index_h5_remian_1 = require("@/index.h5_remian");
// import eruda from 'eruda'
// eruda.init()
// eruda.show()
function default_1() {
    var sdk;
    vue_esm_browser_1.default.component('Demo', {
        template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for \u70ED\u9762h5 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for \u70ED\u9762h5 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button class='button is-primary is-inverted is-outlined' @click='init'>\n                \u521D\u59CB\u5316\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='login'>\n                \u767B\u5F55\n              </button>\n                <button class='button is-primary is-inverted is-outlined' @click='pay'>\n                \u652F\u4ED8\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='deregister'>\n                \u6CE8\u9500\u8D26\u53F7\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='deregisterCancel'>\n                \u64A4\u9500\u6CE8\u9500\n              </button>\n            </div>\n          </div>\n        </section>\n\n        <!-- \u5F39\u7A97\u906E\u7F69\u5C42 -->\n        <div v-if='showModal' class='modal-overlay' @click='closeModal'>\n          <div class='modal-content' @click.stop>\n            <div class='modal-header'>\n              <h3 class='modal-title'>\u7ED3\u679C\u5C55\u793A</h3>\n              <button class='modal-close' @click='closeModal'>&times;</button>\n            </div>\n            <div class='modal-body'>\n              <p><strong>\u7ED3\u679C:</strong></p>\n              <pre class='modal-info'>{{ modalMessage }}</pre>\n            </div>\n            <div class='modal-footer'>\n              <button class='button is-primary' @click='closeModal'>\u786E\u5B9A</button>\n            </div>\n          </div>\n        </div>\n      </div>\n    ",
        data: function () {
            return {
                sdkLoaded: false,
                single_player_mode: true,
                showModal: false,
                modalMessage: ''
            };
        },
        methods: {
            init: function () {
                var _this = this;
                sdk = new index_h5_remian_1.default({
                    productId: '1002',
                    channelId: 'remianh5',
                    cpid: '114',
                    baseUrlList: ['https://cn-api-test.ruixueyun.com'],
                    // @ts-ignore
                    complete: function (res) {
                        console.log('初始化成功:', res, window.location);
                        // 弹窗展示结果
                        _this.showSuccessModal(res);
                    }
                });
            },
            login: function () {
                var _this = this;
                sdk.login({
                    method: 'remianh5',
                    ext: {
                        env: 1, // 1 测试 0 正式
                    }
                }, {
                    complete: function (res) {
                        console.log('登录成功: ', res);
                        // 弹窗展示结果
                        _this.showSuccessModal(res);
                    }
                });
            },
            pay: function () {
                var _this = this;
                sdk.pay({
                    pay_type: 'remianh5',
                    goods_tag: 'bytest',
                    trade_no: "".concat(new Date().getTime()),
                    currency: 'CNY',
                    env: 1
                }, {
                    complete: function (res) {
                        console.log('拉起支付: ', res);
                        // 弹窗展示结果
                        _this.showSuccessModal(res);
                    }
                });
            },
            deregister: function () {
                var _this = this;
                sdk.deregister({}, {
                    complete: function (res) {
                        console.log('注销账号: ', res);
                        _this.showSuccessModal(res);
                    }
                });
            },
            deregisterCancel: function () {
                var _this = this;
                sdk.deregisterCancel({
                    complete: function (res) {
                        console.log('撤销注销: ', res);
                        _this.showSuccessModal(res);
                    }
                });
            },
            showSuccessModal: function (res) {
                var message = JSON.stringify({
                    result: res,
                }, null, 2);
                // @ts-ignore
                this.modalMessage = message;
                // @ts-ignore
                this.showModal = true;
            },
            closeModal: function () {
                // @ts-ignore
                this.showModal = false;
                // @ts-ignore
                this.modalMessage = '';
            },
        }
    });
    new vue_esm_browser_1.default({
        el: '#app'
    });
}
exports.default = default_1;
//# sourceMappingURL=web.js.map