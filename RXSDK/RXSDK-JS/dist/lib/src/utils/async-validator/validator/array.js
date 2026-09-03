"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule_1 = require("../rule");
var array = function (rule, value, source) {
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
        // 值为null/undefined 并且 不是必填 直接返回
        if ((value === undefined || value === null) && !rule.required) {
            return true;
        }
        // 是必填 检验required
        rule_1.default.required(rule, value, source, errors, 'array');
        // 不是必填，但是值不为空，校验类型
        if (value !== undefined && value !== null) {
            rule_1.default.type(rule, value, source, errors);
        }
    }
    // console.log('string: ', errors)
    return errors;
};
exports.default = array;
//# sourceMappingURL=array.js.map