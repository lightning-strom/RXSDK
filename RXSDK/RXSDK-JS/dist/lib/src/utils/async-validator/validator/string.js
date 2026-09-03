"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule_1 = require("../rule");
var utils_1 = require("../utils");
var string = function (rule, value, source) {
    // console.log('string rule: ', rule)
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
        // 值为空字符串 并且 不是必填 直接返回
        if ((0, utils_1.isEmptyValue)(value, 'string') && !rule.required) {
            return true;
        }
        // 是必填 检验required
        rule_1.default.required(rule, value, source, errors, 'string');
        // 不是必填，但是值不为空，校验类型
        if (!(0, utils_1.isEmptyValue)(value, 'string')) {
            rule_1.default.type(rule, value, source, errors);
        }
    }
    return errors;
};
exports.default = string;
//# sourceMappingURL=string.js.map