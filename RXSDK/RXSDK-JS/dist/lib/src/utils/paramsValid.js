"use strict";
// use for check params is valid
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubCheck = exports.ThrowError = exports.invalidInitParams = exports.checkParamsValid = void 0;
// import Schema, { Rule, RuleItem, Rules, Values } from 'async-validator';
var async_validator_1 = require("@/utils/async-validator");
var is_1 = require("@/utils/is");
var const_1 = require("@/config/const");
var checkConfig_1 = require("./checkConfig");
function checkParamsValid(rules, checkValue) {
    var checkSchema = new async_validator_1.default(rules);
    return checkSchema.validate(checkValue);
}
exports.checkParamsValid = checkParamsValid;
function invalidInitParams(params, rules) {
    var entries = Object.entries(rules);
    var _loop_1 = function (key, rule) {
        if ((0, is_1.isArray)(rule)) {
            rule.forEach(function (ruleItem) { return checkRule(ruleItem, params[key], key); });
        }
        else {
            checkRule(rule, params[key], key);
        }
    };
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _a = entries_1[_i], key = _a[0], rule = _a[1];
        _loop_1(key, rule);
    }
    /**
     * 查找规则中的字段
     * 如果字段是必传的，看parmas中是否传, 传了校验类型是否正确, 校验是否有validaror，有执行
     * 如果不是必传的，看params中传的类型是否正确, 校验是否有validaror，有执行
     */
    function checkRule(rule, value, key) {
        if (rule === null || rule === void 0 ? void 0 : rule.required) {
            if ((0, is_1.isNil)(value)) {
                throw Error("".concat(key, " is required"));
            }
        }
        if ((rule === null || rule === void 0 ? void 0 : rule.type) && typeof value !== (rule === null || rule === void 0 ? void 0 : rule.type))
            throw Error("".concat(key, " is not a ").concat(rule.type));
        if (rule === null || rule === void 0 ? void 0 : rule.validator) {
            // const res = rule.validator(rule, value, () => {}, {}, {})
            var res = rule.validator(rule, value, {});
            if (res === true)
                return;
            throw res;
        }
    }
}
exports.invalidInitParams = invalidInitParams;
function ThrowError(errors, isJoin) {
    var str = '';
    if ((0, is_1.isArray)(errors)) {
        errors.forEach(function (o) {
            if (isJoin) {
                str += "".concat(o.message, "; \n");
            }
            else {
                console.error(o.message);
            }
        });
    }
    console.log(str);
    if (isJoin) {
        return str;
    }
}
exports.ThrowError = ThrowError;
function pubCheck(paramsCheck, callback, params) {
    // console.log('pubCheck rules: ', paramsCheck)
    return new Promise(function (resolve, reject) {
        if (!(0, is_1.isObject)(callback) || !callback.hasOwnProperty('complete')) {
            console.error('callback must be Object and had complete property');
            // reject()
            return;
        }
        if (!(0, is_1.isFunction)(callback.complete)) {
            console.error("callback complete property must be function type but got ".concat((0, checkConfig_1.TypeOfValue)(callback.complete)));
            return;
        }
        checkParamsValid(paramsCheck, params)
            .then(function () {
            console.log('sdk 参数检查通过');
            //passed check
            resolve(1);
        })
            .catch(function (_a) {
            var errors = _a.errors;
            console.error('sdk 参数检查报错：', errors);
            //params is invalid callback to cp
            callback === null || callback === void 0 ? void 0 : callback.complete({
                code: const_1.COMMON_ERROR_CODE.PARAMS_ERROR,
                data: null,
                errorMsg: ThrowError(errors, true),
            });
        });
    });
}
exports.pubCheck = pubCheck;
//# sourceMappingURL=paramsValid.js.map