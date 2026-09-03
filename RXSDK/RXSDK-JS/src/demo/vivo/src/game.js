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

// wx.getFileSystemManager - vivo 会把 readFile/readFileSync 结果包在 data 中，Cocos 读取 JSON 时需要拿到字符串
function normalizeFileData(result) {
    while (result && typeof result === 'object' && result.data !== undefined) {
        result = result.data;
    }
    if (typeof result === 'string') return result;

    var bytes = null;
    if (typeof ArrayBuffer !== 'undefined' && result instanceof ArrayBuffer) {
        bytes = new Uint8Array(result);
    } else if (result && result.buffer && typeof ArrayBuffer !== 'undefined' && result.buffer instanceof ArrayBuffer) {
        bytes = new Uint8Array(result.buffer, result.byteOffset || 0, result.byteLength);
    }

    if (!bytes) {
        if (result && typeof result === 'object') {
            try {
                return JSON.stringify(result);
            } catch (e) {
                return String(result);
            }
        }
        return result;
    }
    if (typeof TextDecoder !== 'undefined') {
        return new TextDecoder('utf-8').decode(bytes);
    }

    var text = '';
    for (var i = 0; i < bytes.length; i++) {
        text += String.fromCharCode(bytes[i]);
    }
    try {
        return decodeURIComponent(escape(text));
    } catch (e) {
        return text;
    }
}

var _qgGetFileSystemManager = qg.getFileSystemManager;
function wrapFileSystemManager(fs) {
    if (!fs || fs.__rxVivoWrapped) return fs;
    fs.__rxVivoWrapped = true;

    if (fs.readFileSync) {
        var _origReadFileSync = fs.readFileSync.bind(fs);
        fs.readFileSync = function (filePath, encoding) {
            return normalizeFileData(_origReadFileSync(filePath, encoding));
        };
    }

    if (fs.readFile) {
        var _origReadFile = fs.readFile.bind(fs);
        fs.readFile = function (options) {
            if (!options || typeof options !== 'object') {
                return _origReadFile.apply(fs, arguments);
            }
            var success = options.success;
            return _origReadFile(Object.assign({}, options, {
                success: function (res) {
                    if (res && typeof res === 'object') {
                        res.data = normalizeFileData(res);
                    }
                    success && success(res);
                }
            }));
        };
    }

    return fs;
}

qg.getFileSystemManager = function () {
    return wrapFileSystemManager(_qgGetFileSystemManager.call(qg));
};
wx.getFileSystemManager = qg.getFileSystemManager;

window.channelSDK = require('sdk/index.js');
window.initMiniRxSdk = function(arg) {
    // console.log("initMiniRxSdk"+JSON.stringify(arg))
    window.rxSdk = new window.channelSDK(arg);
};

window._isVivoMiniGame = true

require("loading_info.js")
require('engine.js');
