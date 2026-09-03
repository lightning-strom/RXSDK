"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var messages_1 = require("../messages");
var required = function (rule, value, source, errors, type) {
    if (rule.required &&
        (!source.hasOwnProperty(rule === null || rule === void 0 ? void 0 : rule.field) ||
            (0, utils_1.isEmptyValue)(value, type || rule.type))) {
        errors.push((0, utils_1.format)(messages_1.messages.required, rule === null || rule === void 0 ? void 0 : rule.field));
    }
};
exports.default = required;
//# sourceMappingURL=required.js.map