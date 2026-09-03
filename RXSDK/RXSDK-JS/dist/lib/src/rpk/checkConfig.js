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
exports.ShareCheckParams = exports.haoyoukuaibaoLoginParamsCheck = exports.douyinLoginParamsCheck = exports.jdUserInfoCheckParams = exports.jdLoginParamsCheck = exports.baiduUserInfoCheckParams = exports.baiduLoginParamsCheck = exports.mgtvLoginParamsCheck = exports.bilibiliLoginParamsCheck = exports.ksLoginParamsCheck = exports.taobaoLoginParamsCheck = exports.alipayLoginParamsCheck = exports.douyinServiceCheckParams = exports.haoyoukuaibaoPayCheckParams = exports.douyinPayCheckParams = exports.jdPayCheckParams = exports.baiduPayCheckParams = exports.mgtvPayCheckParams = exports.bilibiliPayCheckParams = exports.ksPayCheckParams = exports.taobaoPayCheckParams = exports.alipayPayCheckParams = exports.checkIReqBusinessOrder = exports.checkIReqBusinessData = exports.shareScheduleReportParams = exports.shareScheduleInitParams = exports.compensateOrderCheckParams = exports.ThrowError = exports.checkTrackParams = exports.initParamsCheck = void 0;
var lodash_es_1 = require("lodash-es");
function TypeOfValue(value) {
    var type = Object.prototype.toString.call(value);
    return type.substring(8, type.length - 1).toLowerCase();
}
exports.initParamsCheck = {
    productId: {
        type: 'string',
        required: true
    },
    channelId: {
        type: 'string',
        required: true
    },
    cpid: {
        type: 'string',
        required: true
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
        type: 'string'
    },
    wx_openid: {
        type: 'string',
        required: true
    },
    order_no: {
        type: 'string',
        required: true
    },
    amount: {
        type: 'number',
        required: true
    },
    env: {
        type: 'enum',
        enum: [0, 1]
    },
    zone_id: {
        type: 'string',
        required: true
    },
    pf: {
        type: 'enum',
        required: true,
        enum: ['android']
    }
};
exports.shareScheduleInitParams = {
    funcs: {
        type: 'array'
    }
};
exports.shareScheduleReportParams = {
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
exports.checkIReqBusinessData = {
    window_key: {
        type: 'string',
        required: true
    },
    event: {
        type: 'string',
        required: true
    },
    before_event: {
        type: 'string'
    }
};
exports.checkIReqBusinessOrder = {
    trade_no: {
        type: 'string',
        required: true
    },
    sign: {
        type: 'string',
        required: true
    }
};
var PayCheckParams = {
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
exports.alipayPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_alipay', 'minigame_alipay_virtual']
    } }, PayCheckParams);
exports.taobaoPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_taobao']
    } }, PayCheckParams);
exports.ksPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_kuaishou']
    } }, PayCheckParams);
exports.bilibiliPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_bilibili']
    } }, PayCheckParams);
exports.mgtvPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_mgtv']
    } }, PayCheckParams);
exports.baiduPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_baidu']
    } }, PayCheckParams);
exports.jdPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_jd']
    } }, PayCheckParams);
exports.douyinPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['douyinh5']
    } }, PayCheckParams);
exports.haoyoukuaibaoPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_haoyou']
    } }, PayCheckParams);
exports.douyinServiceCheckParams = {
    type: {
        required: true,
        type: 'enum',
        enum: ['image', 'text']
    },
    style: {
        required: true,
        asyncValidator: function (rule, value) {
            return new Promise(function (resolve, reject) {
                var arrNumber = ['left', 'top', 'width', 'height', 'borderWidth', 'borderRadius', 'fontSize', 'lineHeight'];
                var arrString = ['backgroundColor', 'borderColor', 'textAlign', 'textColor'];
                if ((0, lodash_es_1.isObject)(value)) {
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
exports.alipayLoginParamsCheck = {
    method: {
        type: 'enum',
        enum: ['minigame_alipay']
    },
    login_openid: {
        type: 'string'
    }
};
exports.taobaoLoginParamsCheck = {
    method: {
        type: 'enum',
        enum: ['minigame_taobao']
    },
    login_openid: {
        type: 'string'
    }
};
exports.ksLoginParamsCheck = {
    method: {
        type: 'enum',
        enum: ['minigame_kuaishou']
    },
    login_openid: {
        type: 'string'
    }
};
exports.bilibiliLoginParamsCheck = {
    method: {
        type: 'enum',
        enum: ['minigame_bilibili']
    },
    login_openid: {
        type: 'string'
    }
};
exports.mgtvLoginParamsCheck = {
    method: {
        type: 'enum',
        enum: ['minigame_mgtv']
    },
    login_openid: {
        type: 'string'
    }
};
exports.baiduLoginParamsCheck = {
    method: {
        type: 'enum',
        enum: ['minigame_baidu']
    },
    login_openid: {
        type: 'string'
    }
};
exports.baiduUserInfoCheckParams = {
    type: {
        required: true,
        type: 'enum',
        enum: ['image', 'text']
    },
    style: {
        required: true,
        asyncValidator: function (rule, value) {
            return new Promise(function (resolve, reject) {
                var arrNumber = ['left', 'top', 'width', 'height', 'borderWidth', 'borderRadius', 'fontSize', 'lineHeight'];
                var arrString = ['backgroundColor', 'borderColor', 'textAlign', 'textColor'];
                if ((0, lodash_es_1.isObject)(value)) {
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
exports.jdLoginParamsCheck = {
    method: {
        type: 'enum',
        enum: ['minigame_jd']
    },
    login_openid: {
        type: 'string'
    }
};
exports.jdUserInfoCheckParams = {
    type: {
        required: true,
        type: 'enum',
        enum: ['image', 'text']
    },
    style: {
        required: true,
        asyncValidator: function (rule, value) {
            return new Promise(function (resolve, reject) {
                var arrNumber = ['left', 'top', 'width', 'height', 'borderWidth', 'borderRadius', 'fontSize', 'lineHeight'];
                var arrString = ['backgroundColor', 'borderColor', 'textAlign', 'textColor'];
                if ((0, lodash_es_1.isObject)(value)) {
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
exports.douyinLoginParamsCheck = {
    method: {
        type: 'enum',
        enum: ['douyinh5']
    },
    login_openid: {
        type: 'string'
    }
};
exports.haoyoukuaibaoLoginParamsCheck = {
    method: {
        type: 'enum',
        enum: ['minigame_haoyou']
    },
    login_openid: {
        type: 'string'
    }
};
exports.ShareCheckParams = {
    func: {
        type: 'string',
        required: true
    }
};
//# sourceMappingURL=checkConfig.js.map