"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSupplementOrder = void 0;
var api_1 = require("@/api/api");
var index_1 = require("@/config/index");
var utils_1 = require("@/utils/utils");
// 支付凭证已经使用过
var VOUCHERUSED = 302408;
// 支付凭证无效
var VOUCHEREXPIRED = 302409;
function fibonacci(n) {
    var _a;
    if (n === 1)
        return 1;
    var first = 1, second = 1;
    for (var i = 3; i <= n; i++) {
        ;
        _a = [second, first + second], first = _a[0], second = _a[1];
    }
    return second;
}
var useSupplementOrder = function () {
    var timeoutId = null;
    var start = 0;
    // 自动补单五次
    var max = 5;
    // 是否正处于自动补单中
    var isSupplying = false;
    // 无效的支付凭证错误码
    var expiredVoucherCode = [VOUCHERUSED, VOUCHEREXPIRED];
    var toggleSupplyStatus = function (bool) { return isSupplying = bool; };
    var isDropOrder = function (errCode) {
        return ([152407, 152401, 182001, 142601, 142602, 152403, 152404].includes(errCode) ||
            (errCode >= 1000 && errCode < 2000));
    };
    var dynamicSupplementOrder = function () { return __awaiter(void 0, void 0, void 0, function () {
        var isHasCompensateOrder, notify_url, wx_openid, order_no, amount, env, zone_id, pf, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isHasCompensateOrder = (0, utils_1.customGetStorageSync)("rx_".concat(index_1.USER_INFO.tid));
                    if (!isHasCompensateOrder) return [3 /*break*/, 5];
                    console.info('sdk 进入自动补单', start);
                    toggleSupplyStatus(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    notify_url = isHasCompensateOrder.notify_url, wx_openid = isHasCompensateOrder.wx_openid, order_no = isHasCompensateOrder.order_no, amount = isHasCompensateOrder.amount, env = isHasCompensateOrder.env, zone_id = isHasCompensateOrder.zone_id, pf = isHasCompensateOrder.pf;
                    return [4 /*yield*/, (0, api_1.payCallback)(notify_url, {
                            wx_openid: wx_openid,
                            order_no: order_no,
                            amount: amount,
                            env: env,
                            zone_id: zone_id,
                            pf: pf,
                        })
                        // 补单成功后删除补单凭证，清除补单状态和定时器
                    ];
                case 2:
                    _a.sent();
                    // 补单成功后删除补单凭证，清除补单状态和定时器
                    (0, utils_1.removeStorageSync)("rx_".concat(index_1.USER_INFO.tid));
                    reset();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    if (expiredVoucherCode.includes(err_1 === null || err_1 === void 0 ? void 0 : err_1.code)) {
                        // 如果支付回调接口失败的原因是支付凭证已经用过或者是失效，清除补单支付凭证
                        (0, utils_1.removeStorageSync)("rx_".concat(index_1.USER_INFO.tid));
                        reset();
                        return [2 /*return*/];
                    }
                    // console.log('res: ')
                    repeat(fibonacci(start));
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    /**
                     * 进入场景
                     * 自动补单轮训中，手动调用支付接口，触发补单，成功后删除补单凭证，自动补单轮训下次找不到补单凭证，需要清除补单状态和定时器
                     */
                    reset();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var repeat = function (ms) {
        timeoutId && clearTimeout(timeoutId);
        start++;
        if (start > max) {
            toggleSupplyStatus(false);
            return;
        }
        timeoutId = setTimeout(function () { return dynamicSupplementOrder(); }, ms * 5000);
    };
    var handleDynamicSupplementOrder = function () {
        if (isSupplying) {
            console.info('sdk 自动补单进行中，请勿cue');
            return;
        }
        // dynamicSupplementOrder()
        repeat(fibonacci(start));
    };
    var reset = function () {
        start = 1;
        timeoutId && clearTimeout(timeoutId);
        toggleSupplyStatus(false);
    };
    return {
        expiredVoucherCode: expiredVoucherCode,
        isDropOrder: isDropOrder,
        handleDynamicSupplementOrder: handleDynamicSupplementOrder,
        dynamicSupplementOrder: dynamicSupplementOrder,
    };
};
exports.useSupplementOrder = useSupplementOrder;
//# sourceMappingURL=order.js.map