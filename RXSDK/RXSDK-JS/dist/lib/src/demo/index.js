"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var complete = function (data) {
    console.log('demo complete: ', data);
};
var divider = function (msg, end) {
    console.log("=== ".concat(msg).concat(end ? ' end' : '', " ==="));
};
// //打开调试模式
wx.setEnableDebug({
    enableDebug: true
});
var Demo = /** @class */ (function () {
    function Demo(sdk) {
        var _this = this;
        this.getFeedbackList = function () {
            _this.sdk.getFeedbackList({
                page: 1,
                size: 100,
                status: 1
            });
        };
        this.getFeedbackDetail = function () {
            _this.sdk.getFeedbackDetail({
                id: 4
            });
        };
        this.addFeedback = function () {
            _this.sdk.addFeedback({
                content: '123',
                attachments: ['12312313'],
                phone: '13439093625',
                tags: ['11111']
            });
        };
        this.collectProps = function () {
            _this.sdk.collectProps({
                id: 1
            }, {
                complete: function (res) {
                    console.log(res);
                }
            });
        };
        this.getGameClubData = function () {
            _this.sdk.getGameClubData({
                dataTypeList: [
                    {
                        type: 1
                    }
                ]
            }, {
                complete: function (res) {
                    console.log(res);
                }
            });
        };
        this.setSubChannelId = function () {
            _this.sdk.setSubChannelId('22222');
        };
        this.getPromoDisplayKEY = function () {
            _this.sdk.getPromoDisplayKEY({
                complete: function (res) {
                    console.log(res);
                    console.log('getPromoDisplayKEY');
                    if (res.code == 0) {
                        console.log(res.data.promo_code);
                    }
                    else {
                        console.log(res.msg);
                    }
                    // this.exchangePromoCDKEY(res.data.promo_code)
                }
            }, true);
        };
        this.exchangePromoCDKEY = function () {
            _this.sdk.exchangePromoCDKEY('exchangePromoCDKEY', {
                complete: function (res) {
                    console.log(res);
                }
            });
        };
        this.getAnnouncement = function () {
            _this.sdk.getAnnouncement(20, {
                complete: function (res) {
                    console.log(res);
                }
            });
        };
        this.login = function () {
            _this.sdk.login({
                method: 'minigame',
                version: 'base',
                migrate_args: { a: 1, b: 2 }
            }, {
                complete: function (data) {
                    console.log('login complete:', data);
                    if (!data.code) {
                        //   // 测试商业化接口队列
                        //   this.getBusinessData()
                        _this.shareSchedulingInit();
                    }
                }
            });
        };
        this.getUserInfo = function () {
            // 通过 wx.getSetting 查询用户是否已授权头像昵称信息
            wx.getSetting({
                success: function (res) {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                        wx.getUserInfo({
                            withCredentials: true,
                            success: function (res) {
                                console.log(res);
                                wx.getPrivacySetting({
                                    success: function (res) {
                                        console.log(res); // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
                                    },
                                    fail: function () { },
                                    complete: function () { }
                                });
                            }
                        });
                    }
                    else {
                        // 否则，先通过 wx.createUserInfoButton 接口发起授权
                        var button = wx.createUserInfoButton({
                            type: 'text',
                            text: '获取用户信息',
                            style: {
                                left: 10,
                                top: 76,
                                width: 200,
                                height: 40,
                                lineHeight: 40,
                                backgroundColor: '#ff0000',
                                color: '#ffffff',
                                textAlign: 'center',
                                fontSize: 16,
                                borderRadius: 4
                            }
                        });
                        button.onTap(function (res) {
                            // 用户同意授权后回调，通过回调可获取用户头像昵称信息
                            console.log(res);
                            wx.getPrivacySetting({
                                success: function (res) {
                                    console.log(res); // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
                                },
                                fail: function () { },
                                complete: function () { }
                            });
                        });
                    }
                }
            });
        };
        this.getPhoneNumber = function () {
            wx.getPhoneNumber({
                phoneNumberNoQuotaToast: true,
                complete: function (res) {
                    console.log(res.code); // 动态令牌
                    console.log(res.errMsg); // 回调信息（成功失败都会返回）
                    console.log(res.errno); // 错误码（失败时返回）
                }
            });
        };
        this.getRelationFriendList = function () {
            _this.sdk.getRelationFriendList({}, {
                complete: function (data) {
                    console.log('getRelationFriendList complete: ', data);
                }
            });
        };
        this.shareSchedulingInit = function () {
            _this.sdk.shareSchedulingInit({
                funcs: []
            }, {
                complete: function (data) {
                    console.log('shareSchedulingInit: ', data);
                }
            });
        };
        this.getShareData = function () {
            _this.sdk.getShareData({
                func: 'maidian',
                transmits: 'a=1&b=2'
                // region: 'en'
            }, {
                complete: function (data) {
                    console.log('getShareData complete: ', data);
                }
            });
        };
        this.share = function () {
            // this.sdk.share(
            //   {
            //     func: 'syfx', // 'youdao' 'sdk'
            //     transmits: 'a=1&b=2',
            //     readCache: false
            //   },
            //   {
            //     complete: (data: any) => {
            //       console.log('share complete: ', data)
            //     }
            //   }
            // )
            _this.sdk.schedulingAction({
                func: 'maidian',
            }, {
                complete: function (data) {
                    console.log('schedulingAction complete: ', data);
                }
            });
        };
        this.getShareScheduling = function () {
            var data = _this.sdk.getShareScheduling();
            console.log('getShareScheduling res: ', data);
        };
        this.schedulingReport = function () {
            _this.sdk.shareSchedulingReport({
                func: 'syfx',
                scheduling_type: 'share',
                scheduling_event: true
            }, {
                complete: function (data) {
                    console.log('schedulingReport complete: ', data);
                    _this.getShareScheduling();
                }
            });
        };
        this.test2 = function () {
            _this.sdk._openCustomerServiceConversation({
                complete: function (data) {
                    console.log('测试1', data);
                }
            }, { sessionFrom: "{\"ruixue_openid\":\"xxx\"}" });
        };
        this.pay = function () {
            _this.sdk.pay({
                'goods_tag': 'bytest',
                'trade_no': '2409104055334559122',
                'indulge_auth': 0,
                'pay_type': 'minigame_v2',
                // 'preview_image': true,
                // 'pay_type': 'wechath5',
                // 'pay_type': 'wxpub',
                'envVersion': 'trial',
                // 'short_url': 's.ruixuecloud.com',
                // 'miniprogram_args': {
                //   a: 1,
                //   b: 2
                // },
                // 'direct_send': true,
                // 'title': '发送给用户的支付卡片标题',
                // 'desc': '发送给用户的支付卡片描述',
                // 'image': 'https://oss.ruixuecloud.com/material/station/1722306321550_%E5%9B%BE%E5%B1%82%20583%20(1).png',
                'miniprogram_name': '喵星旅行'
            }, {
                complete: function (data) {
                    console.log('pay complete', data);
                }
            });
        };
        this.payJump = function () {
            _this.sdk.pay({
                'goods_tag': 'bytest',
                'trade_no': '' + new Date().getTime(),
                'pay_type': 'jump_miniprogram',
                'envVersion': 'trial',
                'miniprogram_name': '喵星旅行'
            }, {
                complete: function (data) {
                    console.log('pay complete', data);
                }
            });
        };
        this.payPreviewImage = function () {
            _this.sdk.pay({
                'goods_tag': 'bytest',
                'trade_no': '' + new Date().getTime(),
                'pay_type': 'jump_miniprogram',
                'preview_image': true,
                'miniprogram_args': {
                    a: 1,
                    b: 2
                },
                'miniprogram_name': '喵星旅行'
            }, {
                complete: function (data) {
                    console.log('pay complete', data);
                }
            });
        };
        this.payIos = function () {
            _this.sdk.pay({
                'goods_tag': 'bytest',
                'trade_no': '' + new Date().getTime(),
                'pay_type': 'wxpub',
                'direct_send': true,
                'title': '发送给用户的支付卡片标题',
                'desc': '发送给用户的支付卡片描述',
                'image': 'https://oss.ruixuecloud.com/material/station/1722306321550_%E5%9B%BE%E5%B1%82%20583%20(1).png'
            }, {
                complete: function (data) {
                    console.log('pay complete', data);
                }
            });
        };
        this.payV3 = function () {
            _this.sdk.pay({
                pay_type: 'midas_game_item',
                goods_tag: 'paytest',
                trade_no: '1000200000000asd75',
                indulge_auth: 0,
                env: 1
            }, {
                complete: function (data) {
                    console.log('pay complete', data);
                }
            });
        };
        this.payV2 = function () {
            _this.sdk.pay({
                pay_type: 'wxpub',
                goods_tag: 'com.super.stars.ruixue.1',
                trade_no: '' + new Date().getTime(),
                transmit_args: 'a=1&b=2',
                callback_from: 0,
                indulge_auth: 0,
                notify_url: 'http://www.baidu.com'
            }, {
                complete: function (data) {
                    console.log('pay', data);
                },
                paySuccCallback: function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        console.log('pay success');
                        return [2 /*return*/, Promise.resolve().then(function () { return console.log(11111); })];
                    });
                }); }
            });
        };
        this.compensatePayOrder = function () {
            _this.sdk.compensatePayOrder({
                notify_url: 'https://anhvcpo.weilekuiming.com/v1/ke/callback/f_channel/142/818/minigame_v2',
                wx_openid: 'oaK5n5EWeUyCv3G4MFCZ5tIjYhkc',
                order_no: '2409105106948068v1',
                amount: 10,
                env: 0,
                zone_id: '1',
                pf: 'android'
            }, {
                complete: function (data) {
                    console.log('主动补单 complete: ', data);
                }
            });
        };
        this.track = function () {
            _this.sdk.track({
                complete: function (data) {
                    console.log(data);
                },
                businessCallback: function (data) {
                    console.log('track businessCallback:', data);
                }
            }, {
                event: '#test',
                properties: {
                    scenes_id: '1'
                },
                type: 'track'
            });
        };
        this.rewardedVideoAd = function () {
            _this.sdk.rewardedVideoAd({
                adUnitId: '81d0635de0cabb5dc47447a2cea353f3' //,'adunit-e55c963bab89ce7e',
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
        };
        this.getDirectAdStatusSync = function () {
            var data = _this.sdk.getDirectAdStatusSync();
            console.log('getDirectAdStatusSync:', data);
        };
        this.onDirectAdStatusChange = function () {
            _this.sdk.onDirectAdStatusChange(function (data) {
                console.log('onDirectAdStatusChange:', data);
            });
        };
        this.checkHasAd = function () {
            _this.sdk.rewardedVideoAd({
                adUnitId: '81d0635de0cabb5dc47447a2cea353f3',
                isCheck: true
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
        };
        this.bannerAd = function () {
            _this.sdk.bannerAd({
                adUnitId: '81d0635de0cabb5dc47447a2cea353f3'
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
        };
        this.interstitialAd = function () {
            _this.sdk.interstitialAd({
                adUnitId: 'adunit-4de541945b96f1fb'
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
        };
        this.deregister = function () {
            _this.sdk.deregister({
                idcard: '220181198905050039',
                realname: '徐继超',
                cpdata: 'abc'
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
        };
        this.deregisterCancel = function () {
            _this.sdk.deregisterCancel({
                complete: function (data) {
                    console.log(data);
                }
            });
        };
        this.sendCaptcha = function () {
            _this.sdk.sendCaptcha({
                // email: '1296546349@qq.com',
                phone: '18626656376',
                purpose: 'bindphone'
            }, {
                complete: function (data) {
                    console.log('sendCaptcha complete: ', data);
                }
            });
        };
        this.infoSync = function () {
            _this.sdk.infoSync({
                complete: function (data) {
                    console.log('infoSync complete: ', data);
                }
            });
            // this.updateInfo()
        };
        this.getInfo = function () {
            _this.sdk.getInfo({
                complete: function (data) {
                    console.log('getInfo complete: ', data);
                }
            });
        };
        this.userInfoSilentSync = function () {
            _this.sdk.userInfoSilentSync({
                desc: ''
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
        };
        this.updateInfo = function () {
            _this.sdk.updateInfo({
                nickname: '我的狼',
                avatarurl: 'xxx',
                region: 'xxx',
                sex: 0
            }, {
                complete: function (data) {
                    console.log('updateInfo: ', data);
                }
            });
        };
        this.refreshToken = function () {
            _this.sdk.refreshSessionFunc();
        };
        this.startReportLoaction = function () {
            _this.sdk.startReportLoaction({
                types: ['test1'],
                reportSpace: 3000
            }, {
                complete: function (data) {
                    console.log('startReportLoaction complete:', data);
                }
            });
        };
        this.stopReportLocation = function () {
            _this.sdk.stopReportLocation();
        };
        this.deleteReportLocation = function () {
            _this.sdk.deleteReportLocation({
                types: ['test1']
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
        };
        this.authorizeLocation = function () {
            _this.sdk.authorizeLocation({
                complete: function (data) {
                    console.log('authorizeLocation complete:', data);
                }
            });
        };
        this.getNearlyPeasonByRadius = function () {
            _this.sdk.getNearlyPeasonByRadius({
                type: 'test',
                lon: 14.2079746,
                lat: 14.2079746,
                radius: 1000.0,
                count: 0,
                page: 1,
                page_size: 100
            }, {
                complete: function (data) {
                    console.log('getNearlyPeasonByRadius complete:', data);
                }
            });
        };
        /** 社交关系 start */
        this.setcustom = function () {
            _this.sdk.setcustom({
                custom: 'abc'
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
        };
        this.addRelation = function () {
            _this.sdk.addRelation({
                target: 'rxuLylN9pM1Kq9zUP719Somjqo3vnOQ4',
                types: {
                    test: true
                },
                target_remarks: '无情',
                user_remarks: '卧槽'
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
            // this.sdk.deleteRelation(
            //   {
            //     target: 'rxuLylN9pM1Kq9zUP719Somjqo3vnOQ4',
            //     types: {
            //       test: true,
            //     },
            //   },
            //   {
            //     complete: (data: any) => {
            //       console.log(data)
            //     },
            //   }
            // )
            // this.sdk.hasRelation(
            //   {
            //     type: "test",
            //     target: "",
            //   },
            //   {
            //     complete: (data) => {
            //       console.log(data);
            //     },
            //   }
            // )
        };
        this.updateremarks = function () {
            // this.sdk.updateremarks(
            //   {
            //     target: 'rxuLylN9pM1Kq9zUP719Somjqo3vnOQ4',
            //     type: 'test',
            //     // target_remarks: true,
            //   },
            //   {
            //     complete: (data: any) => {
            //       console.log(data)
            //     },
            //   }
            // )
            _this.sdk.relationList({
                target: 'rxuLylN9pM1Kq9zUP719Somjqo3vnOQ4',
                type: 'test'
                // target_remarks: true,
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
        };
        this.addFriend = function () {
            _this.sdk.addFriend({
                target: 'rxuLylN9pM1Kq9zUP719Somjqo3vnOQ4',
                target_remarks: 'xxxxx',
                user_remarks: ''
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
            _this.sdk.delfriend({
                target: ''
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
            _this.sdk.updatefriendremarks({
                target: 'rxuLylN9pM1Kq9zUP719Somjqo3vnOQ4',
                target_remarks: 'xxxxx'
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
            _this.sdk.isfriend({
                target: 'rxuLylN9pM1Kq9zUP719Somjqo3vnOQ4'
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
        };
        this.getranklist = function () {
            _this.sdk.getranklist({
                rank_id: '0_100_168_weekly',
                start_rank: 1,
                end_rank: 2
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
        };
        /** 社交关系 end */
        this.msgSecCheck = function () {
            // this.sdk.msgSecCheck(
            //   { content: '卧槽', scene: 1, openid: 'oSy7j5azhPvHA70f99TxtXsugC0A', version: 2 },
            //   {
            //     complete: (data: any) => {
            //       console.log(data)
            //     },
            //   }
            // )
            _this.sdk.mediaCheckAsync({
                urls: ['https://td-assets.weile.com/local/beta/message/115029627_115029628_682.png'],
                scenes: ['porn']
            }, {
                complete: function (data) {
                    console.log(data);
                }
            });
        };
        this.authorize = function () {
            _this.sdk.authorize({
                version: 'normal',
                method: 'mobileqq'
                // login_openid:
                //   'aFJLEmPDGg9ipyhoXiGsJqN3ZGcy2ujeM6+l1LMS6i/pIbWd7y/IZkFAh7rvNX/upXdxqVFs8Q7OAjr/6VYv28BGezUWM6lDBvipWJXVafNQShjK3ru54mQMm4lNoNvDg24CPYrGmrdmUltpapyYShWdCObxsKQdZttYozUq2HlCUyH5tTYqSnme6Zl3CJbKpYJjcoIxQ01m7os2leYKtbJxgtkzac9nvQmSkCk1PqWD/8cQ/4omc/wvcqryPWNDtAcj+FDXN/UY39AniAllxFjMlRZ11YnaipPjqr+dv3EtxkwRx97u1SVPgAevdYy+',
                // sign_fields: ['age'],
            }, {
                complete: function (data) {
                    console.log('authorize complete: ', data);
                }
            });
        };
        this.isAuthorizeUserInfo = function () {
            _this.sdk.isAuthorizeUserInfo({
                complete: function (data) {
                    console.log('isAuthorizeUserInfo complete: ', data);
                }
            });
        };
        this.checkVersionAPP = function () {
            _this.sdk.checkAppVersion({
                type: 'u3d',
                format: 'json',
                devicecode: '0000',
                clientversion: '1.0.0.0',
                region: 0
            }, {
                complete: function (data) {
                    console.log('checkVersionAPP complete: ', data);
                }
            });
            // this.sdk.checkVersion(
            //   {
            //     type: 'js',
            //     format: 'json',
            //     devicecode: 'test',
            //     clientversion: '1.0.1.0',
            //     region: 150000,
            //     games: { '5157686': 0 },
            //     activities: null,
            //   },
            //   {
            //     complete: (data: any) => {
            //       console.log('checkVersionAPP complete: ', data)
            //     },
            //   }
            // )
        };
        this.checkVersionGame = function () {
            _this.sdk.checkGameVersion({
                type: 'js',
                format: 'json',
                gameid: 1041697,
                gameversion: 0
            }, {
                complete: function (data) {
                    console.log('checkVersionGame complete: ', data);
                }
            });
        };
        this.checkVersionActivity = function () {
            _this.sdk.checkActivityVersion({
                type: 'js',
                format: 'json',
                activityshortname: 'xxx',
                activityversion: 1
            }, {
                complete: function (data) {
                    console.log('checkVersionGame complete: ', data);
                }
            });
        };
        this.getBusinessData = function () {
            _this.sdk.getBusinessData({
                // window_key : "0",
                // event : "谪守巴陵郡。越明年，政通人和，百废具兴，",
                // before_event : "ltv"
                window_key: 'nmlyd',
                event: '#share_get_data'
            }, {
                complete: function (data) {
                    console.log('getBusinessData1 complete: ', data);
                }
            });
            _this.sdk.getBusinessData({
                // window_key: 'sfnj',
                // event: 'dwt',
                // before_event : "#share_get_data",
                window_key: 'sfnj',
                event: '#share_get_data'
            }, {
                complete: function (data) {
                    console.log('getBusinessData2 complete: ', data);
                }
            });
            _this.sdk.getBusinessData({
                window_key: 'sfnj',
                event: 'dwt',
                before_event: '#share_get_data'
            }, {
                complete: function (data) {
                    console.log('getBusinessData3 complete: ', data);
                }
            });
        };
        this.getAllBusinessData = function () {
            _this.sdk.getAllBusinessData({
                complete: function (data) {
                    console.log('getAllBusinessData complete: ', data);
                }
            });
        };
        this.refreshBusinessData = function () {
            _this.sdk.refreshBusinessData({
                complete: function (data) {
                    console.log('refreshBusinessData complete: ', data);
                }
            }, true);
            // 测试商业化接口队列 true
            _this.getBusinessData();
        };
        this.setPublicProperties = function () {
            var result = _this.sdk.setPublicProperties({ a: 1, b: 2, scenes_id: 'new' });
            console.log('setPublicProperties: ', result);
        };
        this.updatePublicProperties = function () {
            _this.sdk.updatePublicProperties({ a: 'update', c: 4, b: 6, scenes_id: 'update' });
        };
        this.deletePublicProperties = function () {
            var result = _this.sdk.deletePublicProperties('a');
            console.log('deletePublicProperties: ', result);
        };
        this.getPublicProperties = function () {
            var result = _this.sdk.getPublicProperties();
            console.log('getPublicProperties: ', result);
        };
        this.getFeedbackKindList = function () {
            _this.sdk.getFeedbackKindList({
                complete: function (data) {
                    console.log('getFeedbackKindList:', data);
                }
            });
        };
        this.createFeedback = function () {
            _this.sdk.createFeedback({
                game_id: 100,
                kind_id: 1,
                kind_name: '意见反馈类型',
                priority: 1,
                content: '说明',
                picture: '图片url',
                player_gameid: '玩家游戏id',
                send_voided_mails: 1
            }, {
                complete: function (data) {
                    console.log('createFeedback:', data);
                }
            });
        };
        this.satisfactionEvaluation = function () {
            _this.sdk.satisfactionEvaluation({
                key_number: 10,
                pleased_status: 1,
                reason: 'good'
            }, {
                complete: function (data) {
                    console.log('createFeedback:', data);
                }
            });
        };
        this.getUserInteractiveStorage = function () {
            _this.sdk.getUserInteractiveStorage({
                keyList: ['1', '2', '3']
            }, {
                complete: function (data) {
                    console.log('getUserInteractiveStorage:', data);
                }
            });
            // this.sdk.removeUserCloudStorage(
            //   {
            //     keyList: ['1'],
            //   },
            //   {
            //     complete: (data: any) => {
            //       console.log('removeUserCloudStorage:', data)
            //     },
            //   }
            // )
            _this.setUserCloudStorage();
        };
        this.setUserCloudStorage = function () {
            var gameScoreData = {
                wxgame: {
                    score: 16,
                    update_time: new Date().getTime()
                },
                cost_ms: 36500
            };
            var userKVData = {
                key: 'score',
                value: JSON.stringify(gameScoreData)
            };
            var userKVData2 = { key: 'gold', value: '3000' };
            var KVDataListReq = [userKVData, userKVData2];
            console.log('wx.setUserCloudStorage KVDataList: ', KVDataListReq);
            _this.sdk.setUserCloudStorage({
                KVDataList: KVDataListReq
            }, {
                complete: function (data) {
                    console.log('setUserCloudStorage:', data);
                }
            });
        };
        this.getHelpcenterMainLayout = function () {
            // this.sdk.getHelpcenterMainLayout(
            //   {
            //     complete: (data: any) => {
            //       console.log('getHelpcenterMainLayout:', data)
            //     }
            //   }
            // )
            _this.sdk.getHelpcenterQuestionLayout({
                id: 1
            }, {
                complete: function (data) {
                    console.log('getHelpcenterMainLayout:', data);
                }
            });
        };
        this.decryptionDate = function () {
            wx.getUserProfile({
                lang: 'zh_CN',
                desc: '用于获取昵称和头像'
            }).then(function (res) {
                console.log(res);
                var encryptedData = res.encryptedData, iv = res.iv;
                _this.sdk.decryptionDate({ encrypted_data: encryptedData, iv: iv }, {
                    complete: function (res) {
                        console.log(res);
                    }
                });
            });
        };
        this.getUserDeviceCode = function () {
            console.log(_this.sdk.getUserDeviceCode());
        };
        this.testParallel = function () {
            _this.refreshBusinessData();
            _this.getShareData();
            _this.payV2();
            _this.track();
            _this.checkVersionAPP();
            _this.checkVersionGame();
            _this.checkVersionActivity();
        };
        this.sdk = new sdk({
            // 家乡 wxa27ca98aa5ed1a87
            // productId: '1002',
            // channelId: '818',
            // cpid: '1000101',
            // baseUrlList: ['https://anhvcpo.weilekuiming.com', 'https://cxhoiw.jiaxiangyx.com'],
            // 微乐爱消除
            // productId: '109',
            // channelId: '818',
            // cpid: '1000198',
            // baseUrlList: ['https://vidwfm.jiaxiangcheers.com'],
            // 光年计划  wx1aea9a8772bcb307
            // productId: 'syzwx',
            // channelId: 'syzwx',
            // cpid: '1000357',
            // baseUrlList: ['https://ap32gw.yzkdux.com'],
            // 喵星旅行  wx48da2139bf3ecdbe
            productId: '1002',
            channelId: '818',
            cpid: '114',
            baseUrlList: ['https://cn-api-test.ruixueyun.com/'],
            short_domain: 's.ruixuecloud.com',
            complete: function (data) {
                console.log('init complete: ', data);
                _this.sdk.login({
                    method: 'minigame',
                    version: 'base',
                    migrate_args: { a: 1, b: 2 }
                }, {
                    complete: function (data) {
                        console.log('login complete:', data);
                        if (!data.code) {
                            //   // 测试商业化接口队列
                            //   this.getBusinessData()
                            _this.shareSchedulingInit();
                        }
                    }
                });
            }
        });
        this.sdk.setErrorMsg({
            2001: '初始化失败',
            default: 'default $code$ $thirdcode$ $thirdmsg$'
        });
        if (typeof window !== 'undefined') {
            window && (window.sdk = this.sdk);
        }
    }
    return Demo;
}());
exports.default = Demo;
//# sourceMappingURL=index.js.map