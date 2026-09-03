"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var vue_esm_browser_1 = require("vue/dist/vue.esm.browser");
var index_h5_gank_1 = require("@/index.h5_gank");
// import eruda from 'eruda'
// eruda.init()
// eruda.show()
var rotate = 1;
function default_1() {
    var sdk;
    vue_esm_browser_1.default.component('Demo', {
        template: "\n      <div>\n        <section class='hero is-primary'>\n          <div class='hero-body'>\n            <div class='container'>\n              <h3 class='title'>\n                A Demo for gank h5 SDK\n              </h3>\n              <h4 class='subtitle'>\n                This is a test demo for gank h5 SDK.\n              </h4>\n            </div>\n          </div>\n        </section>\n\n        <section class='hero is-info actions'>\n          <div class='hero-body'>\n            <div class='container'>\n              <button class='button is-primary is-inverted is-outlined' @click='init'>\n                \u521D\u59CB\u5316\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='reportData'>\n                \u521B\u89D2\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='login'>\n                \u767B\u5F55\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='pay'>\n                \u652F\u4ED8\n              </button>\n               <button class='button is-primary is-inverted is-outlined' @click='logout'>\n                \u9000\u51FA\u767B\u5F55\n              </button>\n               <button class='button is-primary is-inverted is-outlined' @click='setGameInfo'>\n                setGameInfo\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='getThirdChannelData'>\n                \u83B7\u53D6\u6E20\u9053\u4FE1\u606F\n              </button>\n              <button class='button is-primary is-inverted is-outlined' @click='roleReport'>\n                \u4E0A\u62A5\u4FE1\u606F\n              </button>\n            </div>\n          </div>\n        </section>\n      </div>\n    ",
        data: function () {
            return {
                sdkLoaded: false
            };
        },
        methods: {
            init: function () {
                sdk = new index_h5_gank_1.default({
                    productId: '1002',
                    channelId: 'unicorn',
                    gameid: 'J9J4bFZQHrtoY',
                    cpid: '114',
                    baseUrlList: ['https://cn-api-test.ruixueyun.com'],
                    complete: function (res) {
                        console.log('初始化成功:', res);
                        if ((res === null || res === void 0 ? void 0 : res.code) == 0) {
                            alert('初始化成功');
                        }
                        else {
                            alert('初始化失败');
                        }
                    }
                });
            },
            login: function () {
                sdk.login({
                    gameid: 'J9J4bFZQHrtoY',
                    method: 'unicornh5',
                }, {
                    complete: function (res) {
                        console.log('登录成功:', res);
                        if ((res === null || res === void 0 ? void 0 : res.code) == 0) {
                            alert('登录成功');
                        }
                        else {
                            alert('登录失败');
                        }
                    }
                });
            },
            logout: function () {
                sdk.logout();
            },
            pay: function () {
                sdk.pay({
                    pay_type: 'unicornh5',
                    goods_tag: 'test',
                    trade_no: "".concat(new Date().getTime()),
                    serverid: '区服ID',
                    username: 'username' // 角色名称
                }, {
                    complete: function (res) {
                        console.log('拉起支付成功: ', res);
                        if ((res === null || res === void 0 ? void 0 : res.code) == 0) {
                            alert('拉起支付成功');
                        }
                        else {
                            alert('拉起支付失败');
                        }
                    }
                });
            },
            getThirdChannelData: function () {
                sdk.getThirdChannelData({
                    complete: function (res) {
                        console.log('获取三方渠道数据成功: ', res);
                    }
                });
            },
            setGameInfo: function () {
                sdk.setGameInfo('1234567890', 'abcdefg');
            },
            reportData: function () {
                sdk.reportData({
                    action: 'register',
                    data: {
                        who: 'who',
                        serverid: 'serverid',
                        level: 'level',
                        system: 'system',
                        rolename: 'rolename',
                        power: 'power',
                        server_name: 'server_name',
                        vip: 'vip',
                        ip: 'ip'
                    }
                }, {
                    complete: function (res) {
                        console.log(res);
                        if ((res === null || res === void 0 ? void 0 : res.code) == 0) {
                            alert('创角成功');
                        }
                        else {
                            alert('创角失败');
                        }
                    }
                });
            },
            roleReport: function () {
                sdk.roleReport({
                    type: "上报类型",
                    isCreateRole: true,
                    roleCreateTime: 1732326024,
                    serverId: '1',
                    serverName: '内测1区',
                    userRoleId: 'roleId1',
                    userRoleName: '小朋友',
                    userRoleBalance: 1000,
                    vipLevel: 1,
                    userRoleLevel: '1',
                    partyId: 1,
                    partyName: '行会名称',
                    gameRoleGender: '男',
                    gameRolePower: 100,
                    partyRoleId: 1,
                    partyRoleName: '会长',
                    professionId: '1',
                    profession: '武士',
                    gameType: 'xx',
                    createRole: 1,
                    friendlist: '',
                }, {
                    complete: function (res) {
                        console.log(res);
                        if ((res === null || res === void 0 ? void 0 : res.code) == 0) {
                            alert('上报成功');
                        }
                        else {
                            alert('上报失败');
                        }
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