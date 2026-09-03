"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubCheck = exports.vivoShareScheduleReportParams = exports.vivoShareScheduleInitParams = exports.compensateOrderCheckParams = exports.ThrowError = exports.checkTrackParams = exports.vivoLoginParamsCheck = exports.initParamsCheck = exports.vivoPayCheckParams = exports.PubCallBack = void 0;
var lodash_es_1 = require("lodash-es");
var paramsValid_1 = require("../paramsValid");
function TypeOfValue(value) {
    var type = Object.prototype.toString.call(value);
    return type.substring(8, type.length - 1).toLowerCase();
}
exports.PubCallBack = {
    complete: {
        require: true,
        asyncValidator: function (rule, value) {
            return new Promise(function (resolve, reject) {
                if ((0, lodash_es_1.isFunction)(value)) {
                    resolve(1);
                }
                else {
                    reject("callback complete property must be function type but got ".concat(TypeOfValue(value)));
                }
            });
        },
    },
};
exports.vivoPayCheckParams = {
    pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_vivo']
    },
    goods_tag: {
        type: 'string',
        required: true
    },
    age: {
        type: 'number'
    },
    trade_no: {
        type: 'string',
        required: true
    },
    is_debug: {
        type: 'enum',
        enum: [0, 1]
    },
    indulge_auth: {
        type: 'enum',
        enum: [0, 1]
    },
    env: {
        type: 'enum',
        enum: [0, 1]
    }
};
exports.initParamsCheck = {
    productId: {
        type: 'string',
        required: true,
    },
    channelId: {
        type: 'string',
        required: true,
    },
    cpid: {
        type: 'string',
        required: true,
    },
    baseUrlList: {
        asyncValidator: function (rule, value) {
            return new Promise(function (resolve, reject) {
                if ((0, lodash_es_1.isArray)(value)) {
                    if (value.length == 0) {
                        reject(" params can not an empty Array");
                    }
                    else {
                        resolve();
                    }
                }
                else {
                    reject(" params Expecting string[],but got ".concat(TypeOfValue(value)));
                }
            });
        },
    },
};
exports.vivoLoginParamsCheck = {
    method: {
        type: 'enum',
        enum: ['minigame_vivo'],
    },
    login_openid: {
        type: 'string'
    }
};
exports.checkTrackParams = {
    event: {
        type: 'string',
        required: true
    },
    properties: {
        type: 'object'
    }
};
function ThrowError(errors, isJoin) {
    var str = '';
    if ((0, lodash_es_1.isArray)(errors)) {
        (0, lodash_es_1.forEach)(errors, function (o) {
            if (isJoin) {
                str += "".concat(o.message, "; \n");
            }
            else {
                console.error(o.message);
            }
        });
    }
    if (isJoin) {
        return str;
    }
}
exports.ThrowError = ThrowError;
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
exports.vivoShareScheduleInitParams = {
    funcs: {
        type: 'array'
    }
};
exports.vivoShareScheduleReportParams = {
    func: {
        type: 'string',
        required: true
    },
    scheduling_type: {
        type: 'enum',
        enum: ['share', 'ad'],
        required: true
    },
    scheduling_event: {
        type: 'boolean',
        required: true
    },
    properties: {
        type: 'object'
    }
};
function pubCheck(paramsCheck, callback, params) {
    return new Promise(function (resolve, reject) {
        if (!(0, lodash_es_1.isObject)(callback) || !callback.hasOwnProperty('complete')) {
            console.error('callback must be Object and had complete property');
            reject();
            return;
        }
        (0, paramsValid_1.checkParamsValid)(exports.PubCallBack, callback)
            .then(function () {
            (0, paramsValid_1.checkParamsValid)(paramsCheck, params)
                .then(function () {
                //passed check
                resolve(1);
            })
                .catch(function (_a) {
                var errors = _a.errors;
                console.log(errors);
                //params is invalid callback to cp
                callback === null || callback === void 0 ? void 0 : callback.complete({ code: -1, data: null, errorMsg: ThrowError(errors, true) });
            });
        })
            .catch(function (_a) {
            var errors = _a.errors;
            //callback is not function or struct passed is wrong
            ThrowError(errors);
        });
    });
}
exports.pubCheck = pubCheck;
//# sourceMappingURL=vivo.js.map