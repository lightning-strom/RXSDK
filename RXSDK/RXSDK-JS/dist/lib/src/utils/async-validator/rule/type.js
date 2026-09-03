"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var messages_1 = require("../messages");
var utils_1 = require("../utils");
var required_1 = require("./required");
var pattern = {
    // http://emailregex.com/
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
};
var types = {
    array: function (value) {
        return Array.isArray(value);
    },
    number: function (value) {
        if (isNaN(value)) {
            return false;
        }
        return typeof value === 'number';
    },
    object: function (value) {
        return typeof value === 'object' && !types.array(value);
    },
    method: function (value) {
        return typeof value === 'function';
    },
    email: function (value) {
        return (typeof value === 'string' &&
            value.length <= 320 &&
            !!value.match(pattern.email));
    },
};
var type = function (rule, value, source, errors) {
    if (rule.required && value === undefined) {
        (0, required_1.default)(rule, value, source, errors);
        return;
    }
    var custom = [
        'array',
        'object',
        'method',
        'email',
        'number',
    ];
    var ruleType = rule.type;
    if (custom.indexOf(ruleType) > -1) {
        if (!types[ruleType](value)) {
            errors.push((0, utils_1.format)(messages_1.messages.types[ruleType], rule.field, rule.type));
        }
        // straight typeof check
    }
    else if (ruleType && typeof value !== rule.type) {
        errors.push((0, utils_1.format)(messages_1.messages.types[ruleType], rule.field, rule.type));
    }
};
exports.default = type;
//# sourceMappingURL=type.js.map