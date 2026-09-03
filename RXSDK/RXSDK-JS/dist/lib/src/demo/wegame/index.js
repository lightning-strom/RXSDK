"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("@/demo/index");
// import SdkWegame from '@/index.wegame'
var index_wegame_1 = require("@/index.wegame");
// @ts-ignore
var tencent_sdk_js_1 = require("@/tencent-sdk.js");
// import SdkLingjing from '@/index.lingjing'
// @ts-ignore
wx.TencentSDK = tencent_sdk_js_1.SDK;
// const SdkWegame = require('../test.js')
var sdkName = index_wegame_1.default;
switch (process.env.TYPE) {
    case 'wegame':
        sdkName = index_wegame_1.default;
        break;
    // case 'lingjing':
    //   sdkName = SdkLingjing
    //   break
}
var sdk = new index_1.default(sdkName);
// sdk.start()
console.log('demo sdk instance: ', sdk);
exports.default = sdk;
//# sourceMappingURL=index.js.map