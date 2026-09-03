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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var index_1 = require("./validator/index");
__exportStar(require("./interface"), exports);
var Schema = /** @class */ (function () {
    function Schema(descriptor) {
        this.rules = {};
        this.define(descriptor);
    }
    Schema.prototype.define = function (rules) {
        if (!rules) {
            throw new Error('Cannot configure a schema with no rules');
        }
        if (typeof rules !== 'object' || Array.isArray(rules)) {
            throw new Error('Rules must be an object');
        }
        this.rules = rules;
    };
    Schema.prototype.validate = function (source) {
        var _this = this;
        if (!this.rules || Object.keys(this.rules).length === 0) {
            return Promise.resolve(source);
        }
        var series = {};
        var keys = Object.keys(this.rules);
        var total = 0;
        var length = keys.length;
        var results = [];
        keys.forEach(function (z) {
            var rule = _this.rules[z];
            var value = source[z];
            rule = __assign({}, rule);
            rule.validator = _this.getValidationMethod(rule);
            if (!rule.validator) {
                return;
            }
            rule.field = z;
            rule.type = _this.getType(rule);
            series[z] = __assign(__assign({}, series[z]), { rule: rule, value: value, source: source, field: z });
        });
        // console.log('series: ', series)
        return new Promise(function (resolve, reject) {
            keys.forEach(function (key) {
                var _a;
                var res;
                var data = series[key];
                var rule = data.rule;
                function cb(e) {
                    if (e === void 0) { e = []; }
                    total++;
                    var errorList = Array.isArray(e) ? e : [e];
                    // console.log('cb:', total, data, errorList)
                    results = results.concat(errorList.map(function (error) {
                        return {
                            message: error,
                            field: data.field,
                            fieldValue: data.value,
                        };
                    }));
                    if (total === length) {
                        console.log('validate finished: ', results, source);
                        return results.length ? reject(new utils_1.AsyncValidationError(results)) : resolve(source);
                    }
                }
                if (rule.asyncValidator) {
                    res = rule.asyncValidator(rule, data.value, data.source);
                }
                else if (rule.validator) {
                    try {
                        res = rule.validator(rule, data.value, data.source);
                    }
                    catch (error) {
                        (_a = console.error) === null || _a === void 0 ? void 0 : _a.call(console, 'validator error:', error);
                        throw error;
                    }
                    if (res === true) {
                        cb();
                    }
                    else if (res === false) {
                        cb("".concat(rule.field, " fails"));
                    }
                    else if (res instanceof Array) {
                        cb(res);
                    }
                    else if (res instanceof Error) {
                        cb(res.message);
                    }
                }
                if (res && res.then) {
                    ;
                    res.then(function () { return cb(); }, function (e) { return cb(e); });
                }
            });
        });
    };
    Schema.prototype.getType = function (rule) {
        if (typeof rule.validator !== 'function' &&
            rule.type &&
            !index_1.default.hasOwnProperty(rule.type)) {
            throw new Error("Unknown rule type ".concat(rule.type));
        }
        return rule.type || 'string';
    };
    Schema.prototype.getValidationMethod = function (rule) {
        if (typeof rule.validator === 'function') {
            return rule.validator;
        }
        var keys = Object.keys(rule);
        if (keys.length === 1 && keys[0] === 'required') {
            return index_1.default.required;
        }
        // @ts-ignore
        return index_1.default[this.getType(rule)] || undefined;
    };
    Schema.validators = index_1.default;
    return Schema;
}());
exports.default = Schema;
//# sourceMappingURL=index.js.map