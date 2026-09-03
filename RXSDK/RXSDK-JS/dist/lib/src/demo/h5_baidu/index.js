"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var web_1 = require("./web");
var index_h5_baidu_1 = require("../../../copy/index.h5_baidu");
var sdk = new index_h5_baidu_1.default({
    productId: '1002',
    channelId: '818',
    cpid: '114',
    baseUrlList: ['http://cn-api-test.ruixuecloud.com/'],
    complete: function (res) {
        console.log(res);
    }
});
(0, web_1.default)(sdk);
//# sourceMappingURL=index.js.map