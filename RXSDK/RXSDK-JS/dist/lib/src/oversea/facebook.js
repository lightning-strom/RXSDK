"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookShare = exports.facebookLogin = exports.facebookInit = void 0;
var facebook_inited = false;
var facebookInit = function (params) {
    return new Promise(function (resolve, reject) {
        if (facebook_inited) {
            resolve(true);
        }
        else {
            // @ts-ignore
            FB.init(params);
            facebook_inited = true;
            resolve(true);
        }
    });
};
exports.facebookInit = facebookInit;
var facebookLogin = function (params) {
    return new Promise(function (resolve, reject) {
        // @ts-ignore
        FB.login(function (response) {
            console.log('FB login response', response);
            if (response.authResponse) {
                var accessToken = response.authResponse.accessToken;
                resolve({
                    access_token: accessToken,
                    app_associated_business: params.app_associated_business
                });
            }
            else {
                reject({
                    code: 3001,
                    msg: '取消登录'
                });
            }
        }, { scope: params.scope });
    });
};
exports.facebookLogin = facebookLogin;
var facebookShare = function (shareData) {
    return new Promise(function (resolve, reject) {
        // 动态创建并添加 meta 标签到 head
        var head = document.head;
        var metaTags = [
            { property: 'og:title', content: shareData.title || '' },
            { property: 'og:description', content: shareData.description || '' },
            { property: 'og:image', content: shareData.image || '' },
            { property: 'og:url', content: shareData.href || '' },
            { property: 'og:type', content: 'website' }
        ];
        metaTags.forEach(function (metaTag) {
            var meta = document.querySelector("meta[property=\"".concat(metaTag.property, "\"]"));
            if (meta) {
                meta.setAttribute('content', metaTag.content);
            }
            else {
                var _meta = document.createElement('meta');
                _meta.setAttribute('property', metaTag.property);
                _meta.setAttribute('content', metaTag.content);
                head.appendChild(_meta);
            }
        });
        // const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.href)}`;
        // window.open(shareUrl, '_blank')
        // @ts-ignore
        FB.ui({
            method: 'share',
            href: shareData.href
        }, function (response) {
            console.log('FB share:', response);
            if (response && !response.error_message) {
                resolve({
                    code: 0
                });
            }
            else {
                resolve({
                    code: 5002,
                    msg: response.error_message
                });
            }
        });
    });
};
exports.facebookShare = facebookShare;
//# sourceMappingURL=facebook.js.map