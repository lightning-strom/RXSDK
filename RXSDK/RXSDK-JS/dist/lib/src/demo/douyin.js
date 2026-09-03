"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var complete = function (data) {
    console.log('demo complete: ', data);
};
var divider = function (msg, end) {
    console.log("=== ".concat(msg).concat(end ? ' end' : '', " ==="));
};
var serviceBtn = null;
var recorder = null;
var recordVideoPath = '';
// //打开调试模式
// wx.setEnableDebug({
//   enableDebug: true,
// })
var Demo = /** @class */ (function () {
    function Demo(sdk) {
        var _this = this;
        this.login = function () {
            _this.sdk.login({
                force: true,
                method: 'douyinh5',
                //login_openid:
                //"2ycKc3sYQP9AxLcRWI7dov/Q9o+P85Dhy//jvm7QCXt6OqSApJjDqHhi5c6pcN771nS494Oi7wg/64a9iPMfv89uxPeuWc3prXHK9a7qmUlvQgafdl+/HO2ZajyKJd5Q7uqMd4FBz27VCdDg0GpYQ+MzalwTmgpcQEvhaZjUWcplBUMZ2wbB5iAaWrAXuRnqIpsa5rBUYbNMxoeEOwHYFtnAho8AeAieR2xyu8yryrwFY23AzXozDtEFhSqkefH/dSOTw77rIOurHp5/L+wZDglQjd5XFqSBkMcwmEx7FjzXEuvTZNvpwE7ORNEirZ7F",
            }, {
                complete: function (data) {
                    console.log(data);
                },
            });
        };
        this.pay = function () {
            _this.sdk.pay({
                pay_type: 'douyinh5',
                goods_tag: '19986',
                platform: 'ios',
                trade_no: '' + new Date().getTime(),
                indulge_auth: 0,
                transmit_args: 'a=1&b=2',
                notify_url: 'http://www.baidu.com',
                currency: 'CNY',
            }, {
                complete: function (data) {
                    console.log(data);
                },
            });
        };
        this.createContactButton = function () {
            _this.sdk.createContactButton({
                type: 'text',
                // image: "./test.jpg",
                text: '我是一个按钮',
                style: {
                    left: 20,
                    top: 200,
                    width: 200,
                    height: 150,
                    lineHeight: 40,
                    backgroundColor: 'red',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4,
                    borderColor: '#ffffff',
                    borderWidth: 1,
                    textColor: '#ffffff',
                },
            }, {
                complete: function (data) {
                    console.log(data);
                    serviceBtn = data;
                    serviceBtn.onTap(function () {
                        console.log('点击客服按钮');
                        _this.sdk.openCustomServiceForOs({
                            currencyType: "CNY",
                            buyQuantity: 600,
                            zoneId: "1",
                            customId: "QWERTYUIDFxxxxx111",
                            extraInfo: "",
                        }, { complete: function (data) {
                                console.log('我是一个测试log', data);
                            } });
                    });
                },
            });
        };
        this.track = function () {
            _this.sdk.track({
                complete: function (data) {
                    console.log(data);
                },
            }, {
                event: 'test',
                properties: {
                    test1: '1',
                    test2: '2',
                },
            });
        };
        this.share = function () {
            _this.sdk.share({
                title: '卧槽无情',
                channel: 'video',
                func: 'haoyou',
                imageUrl: 'https://oss.ruixuecloud.com/service/help_center_default_icon_230630_5.png',
                extra: {
                    videoTopics: ['test1 videoTopics', 'test2 videoTopics'],
                    videoPath: recordVideoPath,
                    withVideoId: true,
                },
            });
        };
        this.startScreenRecord = function () {
            _this.sdk.getGameRecorderManager({
                complete: function (res) {
                    console.log('getGameRecorderManager', res);
                    if ((res === null || res === void 0 ? void 0 : res.code) !== 0 || !(res === null || res === void 0 ? void 0 : res.data)) {
                        return;
                    }
                    recorder = res.data;
                    tt.getSystemInfo({
                        success: function (res) {
                            var screenWidth = res.screenWidth;
                            var screenHeight = res.screenHeight;
                            var maskInfo = recorder.getMark();
                            var x = (screenWidth - maskInfo.markWidth) / 2;
                            var y = (screenHeight - maskInfo.markHeight) / 2;
                            recorder.onStart(function (res) {
                                recordVideoPath = '';
                                console.log('录屏开始', res);
                            });
                            recorder.onStop(function (res) {
                                recordVideoPath = (res === null || res === void 0 ? void 0 : res.videoPath) || '';
                                console.log('屏幕录制结束', res);
                            });
                            recorder.onError(function (err) {
                                console.log('屏幕录制失败', err);
                            });
                            recorder.start({
                                duration: 30,
                                isMarkOpen: true,
                                locLeft: x,
                                locTop: y,
                            });
                        },
                    });
                },
            });
        };
        this.stopScreenRecord = function () {
            if (!recorder) {
                console.log('请先调用 startScreenRecord');
                return;
            }
            recorder.stop();
        };
        this.shareScreenRecord = function () {
            if (!recordVideoPath) {
                console.log('暂无录屏视频，请先调用 startScreenRecord/stopScreenRecord');
                return;
            }
            _this.share();
        };
        this.authenticateRealName = function (complete) {
            _this.sdk.authenticateRealName(complete);
        };
        this.rewardedVideoAd = function () {
            _this.sdk.rewardedVideoAd({ adUnitId: '21a3ftqaosr548eba2' }, { complete: function (res) {
                    console.log(res);
                } });
        };
        this.sdk = new sdk({
            productId: 'syzdx',
            channelId: 'syzdx',
            cpid: '1000357',
            baseUrlList: ['https://ap32gw.yzkdux.com'],
            // 回调函数
            complete: function (data) {
                console.log('测试参数', data);
            },
        });
        if (typeof window !== 'undefined') {
            window && (window.sdk = this.sdk);
        }
    }
    return Demo;
}());
exports.default = Demo;
//# sourceMappingURL=douyin.js.map