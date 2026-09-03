"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var messages_1 = require("../messages");
var ENUM = 'enum';
var enumerable = function (rule, value, source, errors) {
    var _a, _b;
    rule[ENUM] = Array.isArray(rule[ENUM]) ? rule[ENUM] : [];
    if (((_a = rule[ENUM]) === null || _a === void 0 ? void 0 : _a.indexOf(value)) === -1) {
        errors.push((0, utils_1.format)(messages_1.messages[ENUM], rule === null || rule === void 0 ? void 0 : rule.field, (_b = rule[ENUM]) === null || _b === void 0 ? void 0 : _b.join(', ')));
    }
};
exports.default = enumerable;
//# sourceMappingURL=enum.js.map