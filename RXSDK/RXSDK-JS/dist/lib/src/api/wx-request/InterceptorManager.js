"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var InterceptorManager = /** @class */ (function () {
    function InterceptorManager() {
        this.handlers = [];
    }
    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function (fulfilled, rejected) {
        this.handlers.push({
            fulfilled: fulfilled,
            rejected: rejected,
        });
        return this.handlers.length - 1;
    };
    ;
    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function (fn) {
        (0, utils_1.forEach)(this.handlers, function forEachHandler(h) {
            if (h !== null) {
                fn(h);
            }
        });
    };
    ;
    return InterceptorManager;
}());
exports.default = InterceptorManager;
//# sourceMappingURL=InterceptorManager.js.map