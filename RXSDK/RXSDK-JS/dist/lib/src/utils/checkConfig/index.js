"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareScheduleInitParams = exports.shareScheduleReportParams = exports.checkIReqBusinessOrder = exports.checkIReqBusinessData = exports.checkActivityVersionParams = exports.checkGameVersionParams = exports.checkAppVersionParams = exports.checkTrackParams = exports.taobaoInitParamsCheck = exports.huaweiInitParamsCheck = exports.initParamsCheck = exports.TypeOfValue = void 0;
var is_1 = require("@/utils/is");
function TypeOfValue(value) {
    var type = Object.prototype.toString.call(value);
    return type.substring(8, type.length - 1).toLowerCase();
}
exports.TypeOfValue = TypeOfValue;
// export const PubCallBack = {
//   complete: {
//     require: true,
//     asyncValidator: (rule: InternalRuleItem, value: any): Promise<any> => {
//       return new Promise((resolve, reject) => {
//         if (isFunction(value)) {
//           resolve(1)
//         } else {
//           reject(`callback complete property must be function type but got ${TypeOfValue(value)}`)
//         }
//       })
//     },
//   },
// }
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
        validator: function (_, value) {
            if ((0, is_1.isArray)(value)) {
                if (value.length == 0) {
                    return new Error("baseUrlList params can not an empty Array");
                }
                else if (value.length > 2) {
                    return new Error("baseUrlList params maxLength is 2");
                }
                else {
                    return true;
                }
            }
            else {
                return new Error("baseUrlList params Expecting string[],but got ".concat(TypeOfValue(value)));
            }
        },
    },
    complete: {
        required: true,
        validator: function (_, value) {
            if ((0, is_1.isFunction)(value)) {
                return true;
            }
            else {
                return new Error("callback complete property must be function type but got ".concat(TypeOfValue(value)));
            }
        },
    }
};
exports.huaweiInitParamsCheck = {
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
    appid: {
        type: 'string',
        required: true,
    },
    publicKey: {
        type: 'string',
        required: true,
    },
    baseUrlList: {
        validator: function (_, value) {
            if ((0, is_1.isArray)(value)) {
                if (value.length == 0) {
                    return new Error("baseUrlList params can not an empty Array");
                }
                else if (value.length > 2) {
                    return new Error("baseUrlList params maxLength is 2");
                }
                else {
                    return true;
                }
            }
            else {
                return new Error("baseUrlList params Expecting string[],but got ".concat(TypeOfValue(value)));
            }
        },
    },
    complete: {
        required: true,
        validator: function (_, value) {
            if ((0, is_1.isFunction)(value)) {
                return true;
            }
            else {
                return new Error("callback complete property must be function type but got ".concat(TypeOfValue(value)));
            }
        },
    }
};
exports.taobaoInitParamsCheck = {
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
        validator: function (_, value) {
            if ((0, is_1.isArray)(value)) {
                if (value.length == 0) {
                    return new Error("baseUrlList params can not an empty Array");
                }
                else if (value.length > 2) {
                    return new Error("baseUrlList params maxLength is 2");
                }
                else {
                    return true;
                }
            }
            else {
                return new Error("baseUrlList params Expecting string[],but got ".concat(TypeOfValue(value)));
            }
        },
    },
    complete: {
        required: true,
        validator: function (_, value) {
            if ((0, is_1.isFunction)(value)) {
                return true;
            }
            else {
                return new Error("callback complete property must be function type but got ".concat(TypeOfValue(value)));
            }
        },
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
exports.checkAppVersionParams = {
    clientversion: {
        type: 'string',
        required: true,
    },
    devicecode: {
        type: 'string',
        required: true,
    },
    region: {
        type: 'number',
    },
    type: {
        type: 'enum',
        enum: ['js', 'lua', 'u3d'],
    },
    format: {
        type: 'enum',
        enum: ['json', 'lua'],
    },
    games: {
        type: 'object',
    },
    activities: {
        type: 'object',
    },
};
exports.checkGameVersionParams = {
    gameid: {
        type: 'number',
        required: true,
    },
    gameversion: {
        type: 'number',
        required: true,
    },
    gamecheckversion: {
        type: 'number',
    },
    type: {
        type: 'enum',
        enum: ['js', 'lua', 'u3d'],
    },
    format: {
        type: 'enum',
        enum: ['json', 'lua'],
    },
};
exports.checkActivityVersionParams = {
    activityshortname: {
        type: 'string',
        required: true,
    },
    activityversion: {
        type: 'number',
        required: true,
    },
    activitycheckversion: {
        type: 'number',
    },
    type: {
        type: 'enum',
        enum: ['js', 'lua', 'u3d'],
    },
    format: {
        type: 'enum',
        enum: ['json', 'lua'],
    },
};
exports.checkIReqBusinessData = {
    window_key: {
        type: 'string',
        required: true,
    },
    event: {
        type: 'string',
        required: true,
    },
    before_event: {
        type: 'string',
    }
};
exports.checkIReqBusinessOrder = {
    trade_no: {
        type: 'string',
        required: true,
    },
    sign: {
        type: 'string',
        required: true,
    },
};
exports.shareScheduleReportParams = {
    func: {
        type: 'string',
        required: true,
    },
    scheduling_type: {
        type: 'enum',
        enum: ['share', 'ad'],
        required: true,
    },
    scheduling_event: {
        type: 'boolean',
        required: true,
    },
    // scheduling_strategy_id: {
    //   type: 'string',
    //   required: true,
    // },
    properties: {
        type: 'object',
    }
};
exports.shareScheduleInitParams = {
    funcs: {
        type: 'array',
    },
};
//# sourceMappingURL=index.js.map