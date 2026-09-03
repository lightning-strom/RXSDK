"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zaloLogin = void 0;
var zaloLogin = function (params) {
    return new Promise(function (resolve, reject) {
        // @ts-ignore
        ZaloSocialSDK.init({
            appId: params.appId,
            version: '2.0'
        });
        // @ts-ignore
        ZaloSocialSDK.login(function (response) {
            if (response.authResponse) {
                // 登录成功，获取 access token
                var accessToken = response.authResponse.access_token;
                console.log('Access Token:', accessToken);
                resolve({
                    access_token: accessToken
                });
            }
            else {
                console.log('Login failed:', response);
                reject({
                    code: 3001,
                    msg: '取消登录'
                });
            }
        });
    });
};
exports.zaloLogin = zaloLogin;
//# sourceMappingURL=zalo.js.map