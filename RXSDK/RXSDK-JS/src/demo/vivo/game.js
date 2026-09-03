((global.__vivoRequire = require),
  Object.defineProperty(global, "GameGlobal", {
    get: () => global,
    set(e) {
      console.warn("微信环境下GameGlobal相当于global，不需要自定义修改");
    },
  }),
  require("./wxadapter/weixin-vivo-adapter.js"));


window.wx = {};
for (var key in qg) {
    if (key === "__proto__") continue;
    wx[key] = qg[key];
}

wx.exitMiniProgram = qg.exitApplication;
wx.openSetting = wx.getSetting = function (res) {
    res.fail();
};

// wx.authorize - vivo不支持，直接回调成功
wx.authorize = function (options) {
    options && options.success && options.success();
    options && options.complete && options.complete();
};

// wx.getSystemInfoSync - 适配返回格式
wx.getSystemInfoSync = function () {
    try {
        var obj = {};

        var infoSync = qg.getSystemInfoSync();
        for (var key in infoSync) {
            obj[key] = infoSync[key]
        }

        var windowInfo = qg.getWindowInfo();
        for (var key in windowInfo) {
            obj[key] = windowInfo[key]
        }

        if (!obj.devicePixelRatio) obj.devicePixelRatio = obj.pixelRatio;
        if (!obj.system) obj.system = obj.osType;
        if (!obj.platform) obj.platform = obj.osType;
        if (!obj.SDKVersion) obj.SDKVersion = obj.platformVersionCode;
        if (!obj.version) obj.version = obj.platformVersionCode;

        return obj;
    } catch (e) {
        console.warn("getSystemInfoSync error:", e);
    }

    return {};
};

wx.shareAppMessage = function(args) {
    if (args && !args.cancel && args.fail) {
        args.cancel = args.fail;
    }
    qg.share(args);
};

// wx.getFileSystemManager - 适配readFileSync返回值
var _qgGetFileSystemManager = qg.getFileSystemManager;
wx.getFileSystemManager = function () {
    var fs = _qgGetFileSystemManager.call(qg);
    var _origReadFileSync = fs.readFileSync.bind(fs);
    fs.readFileSync = function (filePath, encoding) {
        var result = _origReadFileSync(filePath, encoding);
        if (result && typeof result === 'object' && result.data !== undefined) {
            return result.data;
        }
        return result;
    };
    return fs;
};

window.channelSDK = require('sdk/index.js');
window.initMiniRxSdk = function(arg) {
    // console.log("initMiniRxSdk"+JSON.stringify(arg))
    window.rxSdk = new window.channelSDK(arg);
};

window._isVivoMiniGame = true

require("loading_info.js")
require('engine.js');
