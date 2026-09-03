"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule_1 = require("../rule");
var required = function (rule, value, source) {
    var errors = [];
    var type = Array.isArray(value) ? 'array' : typeof value;
    rule_1.default.required(rule, value, source, errors, type);
    return errors;
};
exports.default = required;
//# sourceMappingURL=required.js.map