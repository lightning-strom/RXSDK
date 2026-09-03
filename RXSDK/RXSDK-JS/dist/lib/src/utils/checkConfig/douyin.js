"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubCheck = exports.ThrowError = exports.checkTrackParams = exports.serviceCheckParams = exports.douyinPayCheckParams = exports.douyinLoginParamsCheck = exports.initParamsCheck = exports.PubCallBack = void 0;
var lodash_es_1 = require("lodash-es");
var lodash_es_2 = require("lodash-es");
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
                if ((0, lodash_es_2.isFunction)(value)) {
                    resolve(1);
                }
                else {
                    reject("callback complete property must be function type but got ".concat(TypeOfValue(value)));
                }
            });
        },
    },
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
                if ((0, lodash_es_2.isArray)(value)) {
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
exports.douyinLoginParamsCheck = {
    force: {
        required: true,
        type: 'boolean',
    },
    method: {
        type: 'enum',
        enum: ['douyinh5'],
    },
    login_openid: {
        type: 'string'
    }
};
exports.douyinPayCheckParams = {
    pay_type: {
        type: 'enum',
        enum: ['douyinh5'],
    },
    goods_tag: {
        type: 'string',
        required: true,
    },
    trade_no: {
        type: 'string',
        required: true,
    },
    notify_url: {
        type: 'string',
        required: true,
    },
    indulge_auth: {
        type: 'enum',
        enum: [0 | 1],
    },
    transmit_args: {
        type: 'string',
    },
    is_debug: {
        type: 'enum',
        enum: [0 | 1],
    },
    env: {
        type: 'enum',
        enum: [0 | 1],
    },
    callback_from: {
        type: 'enum',
        enum: [0 | 1],
    },
    ext: {
        type: 'object',
    },
};
exports.serviceCheckParams = {
    type: {
        required: true,
        type: 'enum',
        enum: ["image", "text"]
    },
    style: {
        required: true,
        asyncValidator: function (rule, value) {
            return new Promise(function (resolve, reject) {
                var arrNumber = ['left', 'top', 'width', 'height', 'borderWidth', 'borderRadius', 'fontSize', 'lineHeight'];
                var arrString = ['backgroundColor', 'borderColor', 'textAlign', 'textColor'];
                if ((0, lodash_es_2.isObject)(value)) {
                    for (var key in value) {
                        var item = value[key];
                        if (arrNumber.includes(key)) {
                            if (!(0, lodash_es_1.isNumber)(item)) {
                                reject("params ".concat(key, " Expecting number,but got ").concat(TypeOfValue(item)));
                            }
                        }
                        if (arrString.includes(key)) {
                            if (!(0, lodash_es_1.isString)(item)) {
                                reject("params ".concat(key, " Expecting string,but got ").concat(TypeOfValue(item)));
                            }
                        }
                    }
                    resolve();
                }
                else {
                    reject("params Expecting Object,but got ".concat(TypeOfValue(value)));
                }
            });
        }
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
    if ((0, lodash_es_2.isArray)(errors)) {
        (0, lodash_es_2.forEach)(errors, function (o) {
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
function pubCheck(paramsCheck, callback, params) {
    return new Promise(function (resolve, reject) {
        if (!(0, lodash_es_2.isObject)(callback) || !callback.hasOwnProperty('complete')) {
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
//# sourceMappingURL=douyin.js.map