"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appleLogin = void 0;
var appleLogin = function (params) {
    return new Promise(function (resolve, reject) {
        // @ts-ignore
        AppleID.auth.init(params);
        // @ts-ignore
        AppleID.auth.signIn()
            .then(function (response) {
            console.log(response);
            resolve({
                identityToken: response.authorization.id_token
                // nickname: response.user?.name ? (response.user.name.firstName + ' ' + response.user.name.lastName) : ''
            });
        }).catch(function (err) {
            console.log(err);
            reject({
                code: 3002,
                msg: err.error
            });
        });
    });
};
exports.appleLogin = appleLogin;
//# sourceMappingURL=apple.js.map