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
exports.getranklistCheck = exports.getranklimitlistCheck = exports.queryuserrankCheck = exports.addscoreCheck = exports.updatefriendremarksCheck = exports.delfriendCheck = exports.addFriendCheck = exports.relationListCheck = exports.hasRelationCheck = exports.updateremarksCheck = exports.deleteRelationCheck = exports.addRelationCheck = exports.setcustomCheck = void 0;
var is_1 = require("@/utils/is");
exports.setcustomCheck = {
    custom: {
        type: 'string',
        required: true,
    },
};
var relationTypesCheck = function (rule, value) {
    return new Promise(function (resolve, reject) {
        if (!(0, is_1.isObject)(value)) {
            reject('types must be Object');
        }
        for (var key in value) {
            var item = value[key];
            if (!(0, is_1.isBoolean)(item)) {
                reject('types member value must be boolean');
            }
        }
        resolve(true);
    });
};
var relationCommonRule = {
    //对方 OpenID
    target: {
        type: 'string',
        required: true,
    },
    // CP 自定义关系类型
    type: {
        type: 'string',
        required: true,
    },
    //用户给Target设置的备注信息（最长512字符）
    target_remarks: {
        type: 'string',
    },
    //Target给用户设置的备注信息（最长512字符）
    user_remarks: {
        type: 'string',
    },
};
exports.addRelationCheck = __assign({ types: {
        //CP 自定义关系类型列表，其值是一个 map 简直对列表，格式为：
        required: true,
        asyncValidator: relationTypesCheck,
    } }, (0, is_1.omit)(relationCommonRule, 'type'));
exports.deleteRelationCheck = __assign({ types: {
        //CP 自定义关系类型列表，其值是一个 map 简直对列表，格式为：
        required: true,
        asyncValidator: relationTypesCheck,
    } }, (0, is_1.pick)(relationCommonRule, 'target'));
exports.updateremarksCheck = (0, is_1.omit)(relationCommonRule, 'user_remarks');
exports.hasRelationCheck = (0, is_1.pick)(relationCommonRule, ['target', 'type']);
exports.relationListCheck = (0, is_1.pick)(relationCommonRule, 'type');
exports.addFriendCheck = (0, is_1.omit)(relationCommonRule, 'type');
exports.delfriendCheck = (0, is_1.pick)(relationCommonRule, 'target');
exports.updatefriendremarksCheck = (0, is_1.pick)(relationCommonRule, ['target', 'target_remarks']);
exports.addscoreCheck = {
    rank_id: {
        type: 'string',
        required: true,
    },
    score: {
        type: 'number',
        required: true,
    },
};
exports.queryuserrankCheck = {
    rank_id: {
        type: 'string',
        required: true,
    },
    open_id: {
        type: 'string',
        required: true,
    },
};
exports.getranklimitlistCheck = {
    rank_id: {
        type: 'string',
        required: true,
    },
    start_rank: {
        type: 'number',
        required: true,
    },
    end_rank: {
        type: 'number',
        required: true,
    },
};
exports.getranklistCheck = {
    rank_id: {
        type: 'string',
        required: true,
    },
};
//# sourceMappingURL=social.js.map