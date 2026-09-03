"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var douyin_1 = require("@/demo/douyin");
// @ts-ignore
var index_douyin_1 = require("@/index.douyin");
// import SdkLingjing from '@/index.lingjing'
var sdkName = index_douyin_1.default;
switch (process.env.TYPE) {
    case 'douyin':
        sdkName = index_douyin_1.default;
        break;
}
var sdk = new douyin_1.default(sdkName);
console.log(sdkName);
exports.default = sdk;
//# sourceMappingURL=index.js.map