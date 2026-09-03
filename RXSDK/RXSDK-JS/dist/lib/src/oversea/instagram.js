"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instagramAuthByCode = exports.checkInstagramRedirect = exports.instagramLogin = void 0;
function generateState() {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var state = '';
    for (var i = 0; i < 16; i++) {
        state += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return state;
}
var instagramLogin = function (params) {
    return new Promise(function (resolve, reject) {
        var state = generateState();
        // 存储 state 用于后续验证
        localStorage.setItem('instagram_state', state);
        // window.location.href = `https://api.instagram.com/oauth/authorize?client_id=${params.clientId}&redirect_uri=${params.redirectUri}&scope=instagram_business_basic,instagram_business_content_publish&response_type=code`
        window.location.href = "https://www.facebook.com/v22.0/dialog/oauth?client_id=".concat(params.clientId, "&display=page&extras={\"setup\":{\"channel\":\"IG_API_ONBOARDING\"}}&redirect_uri=").concat(params.redirectUri, "&response_type=token&scope=instagram_basic,instagram_content_publish");
    });
};
exports.instagramLogin = instagramLogin;
var checkInstagramRedirect = function () {
    var storedState = localStorage.getItem('instagram_state');
    var urlParams = new URLSearchParams(window.location.search);
    var code = urlParams.get('code');
    if (storedState && code) {
        return true;
    }
};
exports.checkInstagramRedirect = checkInstagramRedirect;
// 处理授权回调
var instagramAuthByCode = function () {
    return new Promise(function (resolve, reject) {
        var storedState = localStorage.getItem('instagram_state');
        if (!storedState) {
            resolve({
                code: -1
            });
        }
        var urlParams = new URLSearchParams(window.location.search);
        var code = urlParams.get('code');
        var error = urlParams.get('error');
        var error_reason = urlParams.get('error_reason');
        localStorage.removeItem('instagram_state');
        if (code) {
            resolve({
                code: code
            });
        }
        else if (error === 'access_denied') {
            reject({
                code: 3001,
                msg: '取消登录'
            });
        }
        else {
            reject({
                code: 3002,
                msg: error_reason
            });
        }
    });
};
exports.instagramAuthByCode = instagramAuthByCode;
//# sourceMappingURL=instagram.js.map