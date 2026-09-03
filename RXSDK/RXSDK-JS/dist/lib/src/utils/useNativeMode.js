"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNativeMode = exports.isHarmony = exports.isiPad = exports.isIos = exports.isAndroid = void 0;
exports.isAndroid = ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.userAgent) === null || _a === void 0 ? void 0 : _a.indexOf('Android')) > -1 || ((_b = navigator === null || navigator === void 0 ? void 0 : navigator.userAgent) === null || _b === void 0 ? void 0 : _b.indexOf('Adr')) > -1 || navigator.userAgent.toLocaleLowerCase().indexOf('harmony') > -1;
exports.isIos = !!(navigator === null || navigator === void 0 ? void 0 : navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/));
exports.isiPad = (navigator === null || navigator === void 0 ? void 0 : navigator.userAgent.match(/(iPad)/)) ||
    ((navigator === null || navigator === void 0 ? void 0 : navigator.platform) === 'MacIntel' && (navigator === null || navigator === void 0 ? void 0 : navigator.maxTouchPoints) > 1);
exports.isHarmony = navigator.userAgent.toLocaleLowerCase().indexOf('harmony') > -1;
// 当前是否允许注入Js 只有不允许注入js时才可以使用urlscheme的方式交互
var jsdisable = window.localStorage.getItem('jsdisable');
function useNativeMode() {
    var handleScheme = function (eventName, eventParams) {
        var url = "rx://".concat(eventName);
        if (eventParams) {
            url += "?data=".concat(encodeURIComponent(eventParams));
        }
        console.log(url, 'url');
        window.location.href = url;
    };
    var handleJsBridge = function (eventName, eventParams) {
        var _a;
        console.log('handleJsBridge');
        try {
            if (exports.isAndroid) {
                console.log('进来了把');
                if (window.JsBridgeH5) {
                    console.log('有bridge', eventName, eventParams);
                    window.JsBridgeH5[eventName](eventParams);
                }
                else {
                    console.log('没有bridge');
                }
            }
            else if (exports.isHarmony && window.JSBridgeHandle) {
                console.log('isHarmony');
                // @ts-ignore
                (_a = window.JSBridgeHandle).call.apply(_a, __spreadArray([eventName], args, false));
            }
            if (exports.isIos || exports.isiPad) {
                if (window.webkit) {
                    window.webkit.messageHandlers[eventName].postMessage(eventParams);
                }
            }
        }
        catch (error) {
            console.log('error', error);
        }
    };
    var handleCallback = function (_a) {
        var eventName = _a.eventName, eventParams = _a.eventParams;
        return new Promise(function (resolve, reject) {
            console.log('进入啊');
            try {
                // 如果是安卓并且禁用js 注入  使用url scheme方式
                if (jsdisable === 'true' && exports.isAndroid) {
                    console.log(eventName, 123444);
                    handleScheme(eventName, eventParams);
                    // @ts-ignore
                    window["".concat(eventName, "Callback")] = function (params) {
                        console.log(params, '客户端安卓传递的参数', typeof params);
                        resolve(decodeURIComponent(params));
                    };
                }
                else {
                    handleJsBridge(eventName, eventParams);
                    console.log(eventName, 'eventName');
                    // @ts-ignore
                    window[eventName] = function (params) {
                        console.log(123213);
                        console.log(params, 'ios的参数');
                        resolve(params);
                    };
                }
            }
            catch (error) {
                reject(error);
            }
        });
    };
    var handleInteractive = function (_a) {
        var eventName = _a.eventName, eventParams = _a.eventParams;
        console.log(jsdisable);
        console.log(exports.isAndroid);
        jsdisable === 'true' && exports.isAndroid
            ? handleScheme(eventName, eventParams)
            : handleJsBridge(eventName, eventParams);
    };
    return {
        handleCallback: handleCallback,
        handleInteractive: handleInteractive,
    };
}
exports.useNativeMode = useNativeMode;
//# sourceMappingURL=useNativeMode.js.map