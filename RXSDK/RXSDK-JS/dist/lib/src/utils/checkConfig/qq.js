"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNearlyRediusCheckParams = exports.DeleteLoactionCheckParams2 = exports.ReportLoactionCheckParams = exports.qqgamePayCheckParams = exports.qqgameShareCheckParams = exports.qqgameLoginParamsCheck = void 0;
exports.qqgameLoginParamsCheck = {
    version: {
        required: true,
        asyncValidator: function (rule, value) {
            return new Promise(function (resolve, reject) {
                if (value == 'base' || value == 'normal') {
                    resolve(true);
                }
                else {
                    reject("Login function version params Expecting  base or normal ,but got ".concat(value, " "));
                }
            });
        },
    },
    method: {
        required: true,
        asyncValidator: function (rule, value) {
            return new Promise(function (resolve, reject) {
                if (value == 'mobileqq') {
                    resolve(true);
                }
                else {
                    reject("Login function method params Expecting mobileqq ,but got ".concat(value, " "));
                }
            });
        },
    },
    login_openid: {
        type: 'string',
    },
    sign_fields: {
        type: 'array',
    },
    button: {
        type: 'object',
    },
    isCheck: {
        type: 'boolean',
    },
    reconnect_login: {
        type: 'boolean',
    }
};
exports.qqgameShareCheckParams = {
    func: {
        type: 'string',
        required: true,
    },
    shareAppType: {
        type: 'enum',
        enum: ['qq', 'qqFastShare', 'qqFastShareList', 'qzone', 'wechatFriends', 'wechatMoment'],
    },
};
exports.qqgamePayCheckParams = {
    pay_type: {
        type: 'enum',
        required: true,
        enum: ['qq_minigame'],
    },
    goods_tag: {
        type: 'string',
        required: true,
    },
    trade_no: {
        type: 'string',
        required: true,
    },
    is_debug: {
        type: 'enum',
        enum: [0, 1],
    },
    indulge_auth: {
        type: 'enum',
        enum: [0, 1],
    },
    env: {
        type: 'enum',
        enum: [0, 1],
    },
    callback_from: {
        type: 'enum',
        enum: [0, 1],
    },
    notify_url: {
        type: 'string',
    },
    noreply: {
        type: 'boolean',
    },
    ext: {
        type: 'object',
    },
};
exports.ReportLoactionCheckParams = {
    types: {
        type: 'array',
        required: true,
    },
    reportSpace: {
        //上报的时间间隔
        type: 'number',
        required: true,
    },
};
exports.DeleteLoactionCheckParams2 = {
    types: {
        type: 'array',
        required: true,
    },
};
exports.getNearlyRediusCheckParams = {
    radius: {
        type: 'number',
        required: true,
    },
    count: {
        type: 'number',
        required: true,
    },
    page: {
        type: 'number',
        required: true,
    },
    page_size: {
        type: 'number',
        required: true,
    },
    type: {
        type: 'string',
        required: true,
    },
    lon: {
        type: 'number',
    },
    lat: {
        type: 'number',
    }, //WGS84 纬度
};
//# sourceMappingURL=qq.js.map