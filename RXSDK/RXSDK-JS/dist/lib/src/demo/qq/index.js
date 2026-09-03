"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("@/demo/index");
var index_qq_1 = require("@/index.qq");
// @ts-ignore
// 调试包
// import Sdk from './channel-sdk.qq.v2.umd.js'
var sdkName = index_qq_1.default;
var sdk = new index_1.default(sdkName);
console.log(sdk);
exports.default = sdk;
//# sourceMappingURL=index.js.map