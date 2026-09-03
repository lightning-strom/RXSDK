"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule_1 = require("../rule");
var utils_1 = require("../utils");
var type = function (rule, value, source) {
    var ruleType = rule.type;
    var errors = [];
    var validate = rule.required || (!rule.required && source.hasOwnProperty(rule.field));
    if (validate) {
        if ((0, utils_1.isEmptyValue)(value, ruleType) && !rule.required) {
            return true;
        }
        rule_1.default.required(rule, value, source, errors, ruleType);
        if (!(0, utils_1.isEmptyValue)(value, ruleType)) {
            rule_1.default.type(rule, value, source, errors);
        }
    }
    return errors;
};
exports.default = type;
//# sourceMappingURL=type.js.map