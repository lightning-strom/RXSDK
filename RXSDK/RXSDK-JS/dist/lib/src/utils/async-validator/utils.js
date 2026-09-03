"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyValue = exports.AsyncValidationError = exports.format = void 0;
var formatRegExp = /%[sdj%]/g;
function format(template) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var i = 0;
    if (typeof template === 'function') {
        return template.apply(null, args);
    }
    if (typeof template === 'string') {
        var str = template.replace(formatRegExp, function (x) {
            switch (x) {
                case '%s':
                    return String(args[i++]);
                default:
                    return x;
            }
        });
        return str;
    }
    return template;
}
exports.format = format;
var AsyncValidationError = /** @class */ (function (_super) {
    __extends(AsyncValidationError, _super);
    // fields: Record<string, ValidateError[]>
    function AsyncValidationError(errors) {
        var _this = _super.call(this, 'Async Validation Error') || this;
        _this.errors = errors;
        return _this;
        // this.fields = fields
    }
    return AsyncValidationError;
}(Error));
exports.AsyncValidationError = AsyncValidationError;
function isNativeStringType(type) {
    return type === 'string' || type === 'email';
}
function isEmptyValue(val, type) {
    if (val == null) {
        return true;
    }
    if (type === 'array' && Array.isArray(val) && !val.length) {
        return true;
    }
    if (type && isNativeStringType(type) && typeof val === 'string' && !val) {
        return true;
    }
    return false;
}
exports.isEmptyValue = isEmptyValue;
//# sourceMappingURL=utils.js.map