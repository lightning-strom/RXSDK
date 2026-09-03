"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule_1 = require("../rule");
var utils_1 = require("../utils");
var number = function (rule, value, source) {
    // console.log('number rule: ', rule)
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
        if (value === '') {
            value = undefined;
        }
        // 值为空 并且 不是必填 直接返回
        if ((0, utils_1.isEmptyValue)(value) && !rule.required) {
            return true;
        }
        // 是必填 检验required
        rule_1.default.required(rule, value, source, errors);
        // 不是必填，但是值不为空，校验类型
        if (value !== undefined) {
            rule_1.default.type(rule, value, source, errors);
        }
    }
    return errors;
};
exports.default = number;
//# sourceMappingURL=number.js.map