"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiktokAuthByCode = exports.tiktokLogin = void 0;
function generateState() {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var state = '';
    for (var i = 0; i < 16; i++) {
        state += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return state;
}
var tiktokLogin = function (params) {
    return new Promise(function (resolve, reject) {
        var state = generateState();
        // 存储 state 用于后续验证
        localStorage.setItem('tiktok_state', state);
        var authUrl = "https://www.tiktok.com/v2/auth/authorize/" +
            "?client_key=".concat(params.clientKey) +
            "&scope=".concat(params.scope || 'user.info.basic') +
            "&redirect_uri=".concat(params.redirectUri || window.location.href) +
            "&response_type=code" +
            "&state=".concat(state);
        window.location.href = authUrl;
    });
};
exports.tiktokLogin = tiktokLogin;
// 处理授权回调
var tiktokAuthByCode = function () {
    return new Promise(function (resolve, reject) {
        var storedState = localStorage.getItem('tiktok_state');
        if (!storedState) {
            resolve({
                code: -1
            });
        }
        var urlParams = new URLSearchParams(window.location.search);
        var code = urlParams.get('code');
        var state = urlParams.get('state');
        localStorage.removeItem('tiktok_state');
        if (code && state) {
            if (state === storedState) {
                resolve({
                    auth_code: code
                });
            }
            else {
                reject({
                    code: 3002,
                    msg: 'State mismatch'
                });
            }
        }
    });
};
exports.tiktokAuthByCode = tiktokAuthByCode;
//# sourceMappingURL=tiktok.js.map