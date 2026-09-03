"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleInit = void 0;
// 处理登录响应
// @ts-ignore
window.handleCredentialResponse = function (response) {
    handleLoginCallback(response);
};
var handleLoginCallback;
// 动态加载Google登录相关元素和脚本
function initGoogleSignIn(client_id, triggerGoogleBtnId, callback, attrs) {
    var _attrs = {
        type: 'standard',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        theme: 'filled_blue',
        logo_alignment: 'center',
        width: 300,
        locale: 'zh-CN',
        hidden: true
    };
    if (attrs) {
        _attrs = __assign(__assign({}, _attrs), attrs);
    }
    handleLoginCallback = callback.loginCallback;
    // 创建并添加g_id_onload div
    var onloadDiv = document.createElement('div');
    onloadDiv.id = 'g_id_onload';
    onloadDiv.setAttribute('data-client_id', client_id);
    onloadDiv.setAttribute('data-callback', 'handleCredentialResponse');
    onloadDiv.setAttribute('data-auto_prompt', 'false');
    document.body.appendChild(onloadDiv);
    // 创建并添加g_id_signin div
    var triggerGoogleBtn = document.getElementById(triggerGoogleBtnId);
    triggerGoogleBtn.style.position = 'relative';
    var signinDiv = document.createElement('div');
    signinDiv.className = 'g_id_signin';
    console.log(_attrs);
    if (_attrs.hidden) {
        signinDiv.style.opacity = '0';
        signinDiv.style.overflow = 'hidden';
    }
    signinDiv.setAttribute('data-width', _attrs.width);
    signinDiv.setAttribute('data-size', _attrs.size);
    signinDiv.setAttribute('data-theme', _attrs.theme);
    signinDiv.setAttribute('data-text', _attrs.text);
    signinDiv.setAttribute('data-shape', _attrs.shape);
    signinDiv.setAttribute('data-logo_alignment', _attrs.logo_alignment);
    signinDiv.setAttribute('data-locale', _attrs.locale);
    // @ts-ignore
    document.getElementById(triggerGoogleBtnId).appendChild(signinDiv);
    // 动态加载Google客户端脚本
    var script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = function () {
        console.log('Google Sign-In script loaded');
        callback.initCallback();
    };
    document.head.appendChild(script);
}
var googleInit = function (params) {
    initGoogleSignIn(params.client_id, params.triggerGoogleBtnId, params.callback, params.attrs);
};
exports.googleInit = googleInit;
//# sourceMappingURL=google.js.map