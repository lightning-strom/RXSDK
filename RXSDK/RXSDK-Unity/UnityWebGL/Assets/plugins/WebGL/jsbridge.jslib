var RxJsBridgeLib = {
    $CallJs: function () {
        if (typeof globalUnityInstance !== 'undefined') {
            return globalUnityInstance.CallJsRX;
        } else if (typeof GameGlobal !== 'undefined') {
            return GameGlobal.CallJsRX;
        }
        return null;
    },

    rx_jsLogEnable: function (enable) {
        CallJsRX().jsrx_setLogEnable(enable);
    },

    rx_jsLog: function (tag, log_str) {
        CallJsRX().jsrx_log(UTF8ToString(tag), UTF8ToString(log_str));
    },

    rx_init: function (json_str) {
        CallJsRX().jsrx_init(UTF8ToString(json_str));
    },

    rx_login: function (json_str) {
        CallJsRX().jsrx_login(UTF8ToString(json_str));
    },

    rx_deregister: function (json_str) {
        CallJsRX().jsrx_deregister(UTF8ToString(json_str));
    },

    rx_deregisterCancel: function () {
        CallJsRX().jsrx_deregisterCancel();
    },

    rx_sendCaptcha: function (json_str) {
        CallJsRX().jsrx_sendCaptcha(UTF8ToString(json_str));
    },

    rx_getUserInfo: function () {
        CallJsRX().jsrx_getUserInfo();
    },

    rx_updateUserInfo: function (json_str) {
        CallJsRX().jsrx_updateUserInfo(UTF8ToString(json_str));
    },

    rx_pay: function (json_str) {
        CallJsRX().jsrx_pay(UTF8ToString(json_str));
    },
};

autoAddDeps(jsbridge, '$CallJs');
mergeInto(LibraryManager.library, jsbridge);