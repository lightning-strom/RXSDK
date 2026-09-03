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
exports.H5ShareCheckParams = exports.H5ShandwPayCheckParams = exports.H5TestPayCheckParams = exports.H5RemianPayCheckParams = exports.H5IQiYiPayCheckParams = exports.H5NewBaiduPayCheckParams = exports.H5BaiduPayCheckParams = exports.H5LenovoPayCheckParams = exports.H5HaluoPayCheckParams = exports.H5ZuiyouPayCheckParams = exports.H5SimoPayCheckParams = exports.H5AwyPayCheckParams = exports.H5GametokPayCheckParams = exports.H5QiqiPayCheckParams = exports.H5GankPayCheckParams = exports.H5QuickPayCheckParams = exports.H5VngPayCheckParams = exports.H5XunleiPayCheckParams = exports.H5QunheiPayCheckParams = exports.H54399PayCheckParams = exports.H5UCPayCheckParams = exports.checkIReqBusinessOrder = exports.checkIReqBusinessData = exports.shareScheduleReportParams = exports.shareScheduleInitParams = exports.compensateOrderCheckParams = exports.ThrowError = exports.checkTrackParams = exports.H5UCLoginParamsCheck = exports.initParamsCheck = void 0;
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
exports.H5UCLoginParamsCheck = {
    method: {
        type: 'enum',
        enum: ['minigame_uc']
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
var H5PayCheckParams = {
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
exports.H5UCPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_uc']
    } }, H5PayCheckParams);
exports.H54399PayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_4399h5']
    } }, H5PayCheckParams);
exports.H5QunheiPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_qunhei']
    } }, H5PayCheckParams);
exports.H5XunleiPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_xunlei']
    } }, H5PayCheckParams);
exports.H5VngPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_vng']
    } }, H5PayCheckParams);
exports.H5QuickPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_quick']
    } }, H5PayCheckParams);
exports.H5GankPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['unicornh5']
    } }, H5PayCheckParams);
exports.H5QiqiPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_77']
    } }, H5PayCheckParams);
exports.H5GametokPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['gametokh5']
    } }, H5PayCheckParams);
exports.H5AwyPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_aiweiyou']
    } }, H5PayCheckParams);
exports.H5SimoPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_007']
    }, server_id: {
        type: 'string',
        required: true
    }, server_name: {
        type: 'string',
        required: true
    }, role_id: {
        type: 'string',
        required: true
    }, role_name: {
        type: 'string',
        required: true
    }, role_level: {
        type: 'number',
        required: true
    } }, H5PayCheckParams);
exports.H5ZuiyouPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_zuiyou']
    } }, H5PayCheckParams);
exports.H5HaluoPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_haluo']
    } }, H5PayCheckParams);
exports.H5LenovoPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_lenovo']
    } }, H5PayCheckParams);
exports.H5BaiduPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_baiduh5']
    } }, H5PayCheckParams);
exports.H5NewBaiduPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['baiduh5']
    } }, H5PayCheckParams);
exports.H5IQiYiPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_iqiyi']
    } }, H5PayCheckParams);
exports.H5RemianPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['remianh5']
    } }, H5PayCheckParams);
exports.H5TestPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['h5_test']
    } }, H5PayCheckParams);
exports.H5ShandwPayCheckParams = __assign({ pay_type: {
        type: 'enum',
        required: true,
        enum: ['minigame_shandw']
    } }, H5PayCheckParams);
exports.H5ShareCheckParams = {
    func: {
        type: 'string',
        required: true
    }
};
//# sourceMappingURL=checkConfig.js.map