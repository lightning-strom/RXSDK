"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wegamePayCheckParams = exports.mediaCheckAsyncCheck = exports.msgSecCheck = exports.getNearlyRediusCheckParams = exports.DeleteLoactionCheckParams2 = exports.ReportLoactionCheckParams = exports.compensateOrderCheckParams = exports.wegameShareCheckParams = exports.wegameLoginParamsCheck = void 0;
exports.wegameLoginParamsCheck = {
    desc: {
        type: 'string',
    },
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
                if (value == 'virtual' || value == 'minigame') {
                    resolve(true);
                }
                else {
                    reject("Login function method params Expecting  virtual or minigame ,but got ".concat(value, " "));
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
    reconnect_login: {
        type: 'boolean',
    }
};
exports.wegameShareCheckParams = {
    func: {
        type: 'string',
        required: true,
    },
};
exports.compensateOrderCheckParams = {
    notify_url: {
        type: 'string',
    },
    wx_openid: {
        type: 'string',
        required: true,
    },
    order_no: {
        type: 'string',
        required: true,
    },
    amount: {
        type: 'number',
        required: true,
    },
    env: {
        type: 'enum',
        enum: [0, 1],
    },
    zone_id: {
        type: 'string',
        required: true,
    },
    pf: {
        type: 'enum',
        required: true,
        enum: ['android'],
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
exports.msgSecCheck = {
    content: {
        type: 'string',
        required: true,
    },
    scene: {
        type: 'enum',
        required: true,
        enum: [1, 2, 3, 4],
    },
    title: {
        type: 'string',
    },
    nickname: {
        type: 'string',
    },
    signature: {
        type: 'string',
    },
};
exports.mediaCheckAsyncCheck = {
    urls: {
        type: 'array',
        required: true,
    },
    scenes: {
        type: 'array',
        required: true,
    },
};
exports.wegamePayCheckParams = {
    pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame', 'minigame_friend', 'wxpub', 'minigame_v2', 'midas_game_item', 'aums', 'jump_miniprogram', 'wechath5', 'minigame_meituan', 'midas_payment_game_item'],
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
    mode: {
        type: 'enum',
        enum: ['coins', 'goods'],
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
    sessionFromExt: {
        type: 'object',
    },
};
//# sourceMappingURL=wegame.js.map