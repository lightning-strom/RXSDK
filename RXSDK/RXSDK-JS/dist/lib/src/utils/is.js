"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareVersions = exports.omit = exports.pick = exports.compact = exports.isEmpty = exports.isNil = exports.isArray = exports.isObject = exports.isFunction = exports.isBoolean = exports.isString = exports.isNumber = exports.is = void 0;
var toString = Object.prototype.toString;
function is(val, type) {
    return toString.call(val) === "[object ".concat(type, "]");
}
exports.is = is;
function isNumber(val) {
    return is(val, 'Number');
}
exports.isNumber = isNumber;
function isString(val) {
    return is(val, 'String');
}
exports.isString = isString;
function isBoolean(val) {
    return is(val, 'Boolean');
}
exports.isBoolean = isBoolean;
function isFunction(val) {
    return typeof val === 'function';
}
exports.isFunction = isFunction;
function isObject(val) {
    return val !== null && is(val, 'Object');
}
exports.isObject = isObject;
function isArray(val) {
    return val && Array.isArray(val);
}
exports.isArray = isArray;
/**
 * Checks if `value` is `null` or `undefined`.
 */
function isNil(val) {
    return val == null;
}
exports.isNil = isNil;
function isEmpty(val) {
    if (val == null) {
        return true;
    }
    if (isArray(val) || isString(val)) {
        return val.length === 0;
    }
    if (val instanceof Map || val instanceof Set) {
        return val.size === 0;
    }
    if (isObject(val)) {
        return Object.keys(val).length === 0;
    }
    return false;
}
exports.isEmpty = isEmpty;
/**
 * Array
 */
/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * compact([0, 1, false, 2, '', 3])
 * // => [1, 2, 3]
 */
function compact(val) {
    if (!val)
        return [];
    return val.filter(function (item) { return item; });
}
exports.compact = compact;
/**
 * Object
 */
function pick(obj) {
    var props = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        props[_i - 1] = arguments[_i];
    }
    var flattenProps = props.flat();
    return obj == null
        ? {}
        : flattenProps.reduce(function (iter, prop) { return (prop in obj && (iter[prop] = obj[prop]), iter); }, {});
}
exports.pick = pick;
function omit(obj) {
    var props = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        props[_i - 1] = arguments[_i];
    }
    // console.log('omit: ', obj, props.flat())
    var flattenProps = props.flat();
    var result = {};
    if (obj == null)
        return result;
    for (var key in obj) {
        if (!flattenProps.includes(key)) {
            result[key] = obj[key];
        }
    }
    return result;
}
exports.omit = omit;
function compareVersions(version1, version2) {
    // 将版本号字符串按 . 分割成数组
    var v1Parts = version1.split('.').map(Number);
    var v2Parts = version2.split('.').map(Number);
    // 获取两个版本号数组的最大长度
    var maxLength = Math.max(v1Parts.length, v2Parts.length);
    // 逐位比较版本号
    for (var i = 0; i < maxLength; i++) {
        // 如果某个版本号数组已经遍历完，对应位置的值视为 0
        var num1 = i < v1Parts.length ? v1Parts[i] : 0;
        var num2 = i < v2Parts.length ? v2Parts[i] : 0;
        if (num1 > num2) {
            return 1; // version1 大于 version2
        }
        else if (num1 < num2) {
            return -1; // version1 小于 version2
        }
        // 如果当前位相等，继续比较下一位
    }
    return 0; // 两个版本号相等
}
exports.compareVersions = compareVersions;
//# sourceMappingURL=is.js.map