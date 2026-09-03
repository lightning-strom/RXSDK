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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopTrackReportTimer = exports.updateTrackReportInterval = exports.startTrackReportTimer = exports.reportTrackDataOnce = exports.reportSimple = exports.decompressData = exports.compressData = exports.shouldTriggerImmediateReport = exports.triggerImmediateReport = exports.resetReportCooldown = exports.getCurrentMaxCacheCount = exports.updateMaxCacheCount = exports.getTotalCacheCount = exports.removeTrackData = exports.getValidLock = exports.unlockTrackKey = exports.lockTrackKey = exports.getTrackDataFromStorage = exports.saveTrackDataToStorage = exports.removeStorageByPrefix = exports.removeStorageSync = exports.customRemoveStorageSync = exports.customSetStorageSync = exports.customGetStorageSync = exports.formatTrackParams = exports.isExpiredCode = exports.isDropOrder = exports.handleSuccess = exports.handleError = exports.getConfigErrMsg = exports.asyncFunc = exports.qs = exports.printLog = void 0;
var const_1 = require("@/config/const");
var config_1 = require("@/config");
var lz_string_1 = require("lz-string");
var v4_1 = require("uuid/v4");
function printLog() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (config_1.SYSTEM_INFO.logSwitch) {
        console.info(args);
    }
}
exports.printLog = printLog;
exports.qs = {
    stringify: function (obj) {
        var str = '';
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                str += '&' + key + '=' + obj[key];
            }
        }
        return str.slice(1);
    },
    parse: function (params) {
        if (!params)
            return {};
        var query = params.split('&');
        var res = {};
        for (var key in query) {
            if (query.hasOwnProperty(key)) {
                var arr = query[key].split('=');
                res[arr[0]] = arr[1];
            }
        }
        return res;
    }
};
var asyncFunc = function (func, options, params) {
    return new Promise(function (resolve, reject) {
        func.apply(void 0, __spreadArray([Object.assign({}, options, {
                success: resolve,
                fail: reject,
                cancel: resolve
            })], (params || []), false));
    });
};
exports.asyncFunc = asyncFunc;
var getConfigErrMsg = function (code, thirdcode, thirdmsg) {
    var msg = config_1.SYSTEM_INFO.errMsg[code] || config_1.SYSTEM_INFO.errMsg.default || '';
    return msg.replace(/\$code\$/g, code || '').replace(/\$thirdcode\$/g, thirdcode || '').replace(/\$thirdmsg\$/g, thirdmsg || '');
};
exports.getConfigErrMsg = getConfigErrMsg;
var handleError = function (err, code) {
    err = err || {};
    var _code = code || err.code || err.errCode || err.errorCode || err.err_code || err.error || err.errNo || err.errno || const_1.ERROR_CODE;
    var _thirdcode = err.thirdcode || err.thirdCode || err.errCode || err.errorCode || err.err_code || err.errNo || err.errno || err.error || err.code;
    var _thirdmsg = err.message || err.errMsg || err.errorMsg || err.msg || err.errorMessage || err.errorDescription || err.data;
    if (_code == 2001) {
        return {
            isServerError: err.isServerError,
            thirdcode: _thirdcode || 9001,
            thirdmsg: _thirdmsg,
            code: err.isServerError ? _thirdcode : _code,
            msg: err.isServerError ? _thirdmsg : (0, exports.getConfigErrMsg)(_code, _thirdcode, _thirdmsg) || _thirdmsg || err || '初始化错误，或未初始化'
        };
    }
    if (err.isServerError) {
        console.log('handleError server error', err.code, err.msg, err.thirdcode, err.thirdmsg);
        return {
            isServerError: err.isServerError,
            thirdcode: err.thirdcode,
            thirdmsg: err.thirdmsg,
            code: err.code || 9001,
            msg: err.msg || err.message
        };
    }
    return {
        isServerError: err.isServerError || false,
        thirdcode: _thirdcode || 9001,
        thirdmsg: _thirdmsg,
        code: _code,
        msg: (0, exports.getConfigErrMsg)(_code, _thirdcode, _thirdmsg) || _thirdmsg || err
    };
};
exports.handleError = handleError;
var handleSuccess = function (result, tag) {
    console.info(tag);
    console.info('sdk handleSuccess:', [result]);
};
exports.handleSuccess = handleSuccess;
var isDropOrder = function (errCode) {
    return ([152407, 152401, 182001, 142601, 142602, 152403, 152404].includes(errCode) ||
        (errCode >= 1000 && errCode < 2000));
};
exports.isDropOrder = isDropOrder;
// 支付凭证已经使用过
var VOUCHERUSED = 302408;
// 支付凭证无效
var VOUCHEREXPIRED = 302409;
var isExpiredCode = function (errCode) {
    return [VOUCHERUSED, VOUCHEREXPIRED].includes(errCode);
};
exports.isExpiredCode = isExpiredCode;
/**
 * 编码 URI 及 base64 处理的字符串
 */
// export const encodeURIBase64 = (str?: string) => {
//   if (!str) return ''
//   try {
//     return btoa(encodeURIComponent(str))
//   } catch (error) {
//     console.error(error)
//     return str
//   }
// }
/**
 * 反编码 URI 及 base64 处理的字符串
 */
// export const decodeURIBase64 = (str?: string) => {
//   if (!str) return ''
//   try {
//     return decodeURIComponent(atob(str))
//   } catch (error) {
//     console.error(error)
//     return str
//   }
// }
// export const loadScript = function (url: string) {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement('script')
//     const params = url.indexOf('?') > -1 ? '&timestamp=' : '?timestamp='
//     script.src = `${/^(https?:)?\/\//.test(url) ? '' : '//'}${url}${params}${Date.now()}`
//     script.onload = resolve
//     script.onerror = reject
//     document.body.appendChild(script)
//   })
// }
var formatTrackParams = function (_a) {
    var eventName = _a.eventName, apiName = _a.apiName, _b = _a.reqParams, reqParams = _b === void 0 ? {} : _b, _c = _a.errorInfo, errorInfo = _c === void 0 ? {} : _c, _d = _a.loginInfo, loginInfo = _d === void 0 ? {} : _d, otherParams = __rest(_a, ["eventName", "apiName", "reqParams", "errorInfo", "loginInfo"]);
    var eventNamePrefix = '#rxsdk_';
    return {
        event: eventNamePrefix + eventName,
        properties: __assign({ api_name: apiName, systemInfo: config_1.SYSTEM_INFO, req_params: __assign({}, reqParams), error_info: __assign({}, errorInfo), login_info: __assign({}, loginInfo) }, otherParams)
    };
};
exports.formatTrackParams = formatTrackParams;
// 内存存储对象
var memoryStore = {};
// 过期时间映射
var expireMap = {};
// 检查wx存储方法是否可用
// 辅助函数：判断是否为函数
function isFunction(fn) {
    return typeof fn === 'function';
}
// 获取存储
var customGetStorageSync = function (key) {
    // 检查是否过期
    if (expireMap[key] && Date.now() > expireMap[key]) {
        (0, exports.customRemoveStorageSync)(key);
        return null;
    }
    try {
        if (config_1.SYSTEM_INFO.isWxAvailable) {
            return wx.getStorageSync(key);
        }
        else {
            printLog('memoryStore', memoryStore);
            return memoryStore[key] || null;
        }
    }
    catch (error) {
        return memoryStore[key] || null;
    }
};
exports.customGetStorageSync = customGetStorageSync;
// 设置存储
var customSetStorageSync = function (key, value, expire) {
    try {
        if (config_1.SYSTEM_INFO.isWxAvailable) {
            wx.setStorageSync(key, value);
        }
        else {
            memoryStore[key] = value;
            // printLog('memoryStore', memoryStore)
        }
    }
    catch (error) {
        // 降级到内存存储
        memoryStore[key] = value;
        // printLog('memoryStore', memoryStore)
    }
    // 设置过期时间
    if (expire && typeof expire === 'number') {
        expireMap[key] = Date.now() + expire * 1000;
    }
};
exports.customSetStorageSync = customSetStorageSync;
// 删除存储
var customRemoveStorageSync = function (key) {
    try {
        if (config_1.SYSTEM_INFO.isWxAvailable) {
            wx.removeStorageSync(key);
        }
    }
    catch (error) {
        // 忽略错误
    }
    // 同时删除内存中的数据
    delete memoryStore[key];
    delete expireMap[key];
};
exports.customRemoveStorageSync = customRemoveStorageSync;
// 删除存储（别名方法，保持与wx API一致）
var removeStorageSync = function (key) {
    (0, exports.customRemoveStorageSync)(key);
};
exports.removeStorageSync = removeStorageSync;
// 根据前缀删除存储
var removeStorageByPrefix = function (prefix, predict) {
    var targetKeys = [];
    try {
        if (config_1.SYSTEM_INFO.isWxAvailable) {
            var info = wx.getStorageInfoSync();
            targetKeys = info.keys.filter(function (key) {
                return isFunction(predict) ? predict(key) : key.startsWith(prefix);
            });
            targetKeys.forEach(function (key) { return wx.removeStorageSync(key); });
        }
    }
    catch (error) {
        // 忽略错误
    }
    // 同时删除内存中的数据
    var memoryKeys = Object.keys(memoryStore);
    targetKeys = memoryKeys.filter(function (key) {
        return isFunction(predict) ? predict(key) : key.startsWith(prefix);
    });
    targetKeys.forEach(function (key) {
        delete memoryStore[key];
        delete expireMap[key];
    });
};
exports.removeStorageByPrefix = removeStorageByPrefix;
// 上报数据存储相关常量
var TRACK_KEYS_STORAGE_KEY = 'rx_track_collect_keys'; // 存储所有时间戳key的列表
var TRACK_DATA_PREFIX = 'rx_track_collect_'; // 数据存储key前缀
var TRACK_LOCK_KEY = 'rx_track_collect_lock'; // 当前被锁定的时间戳key（单个）
var MAX_ITEMS_PER_KEY = 100; // 每个key最多存储的数据条数
var MAX_KEYS = 5; // 最多存储的时间戳数量（严格控制）
// 定时器ID
var trackReportTimerId = null;
// 当前定时器间隔
var currentTrackInterval = 60000;
// 最小上报间隔（毫秒）
var MIN_FLUSH_INTERVAL = 100;
// 默认上报间隔（1分钟）
var DEFAULT_FLUSH_INTERVAL = 60000;
// 上报API函数引用
var currentTrackApiFunc = null;
// 默认缓存数据上限
var DEFAULT_MAX_CACHE_COUNT = 100;
// 最小缓存数据上限
var MIN_MAX_CACHE_COUNT = 100;
// 最大缓存数据上限
var MAX_MAX_CACHE_COUNT = 1000;
// 当前缓存数据上限
var currentMaxCacheCount = DEFAULT_MAX_CACHE_COUNT;
// 是否正在执行立即上报（用于暂停定时上报）
var isImmediateReporting = false;
// 上报失败冷却时间（毫秒），防止失败后频繁重试
var REPORT_FAIL_COOLDOWN = 10000;
// 上次上报失败时间
var lastReportFailTime = 0;
// 锁超时时间（毫秒），超过此时间的锁自动失效
var LOCK_TIMEOUT = 30000;
/**
 * 将上报数据存入storage
 * key为时间戳，每个key最多存100条数据，严格控制最多5个时间戳
 * 如果当前key被锁定（正在上报中），则创建新的时间戳继续写入
 * 如果已达到5个上限且无法删除，则丢弃新数据
 * 注意：此函数内部已做完善的异常处理，不会抛出错误
 */
var saveTrackDataToStorage = function (data) {
    try {
        // 数据验证，防止存储无效数据
        if (data === undefined || data === null) {
            console.warn('存储数据为空，跳过');
            return;
        }
        // 获取当前所有时间戳key列表
        var trackKeys = [];
        try {
            trackKeys = (0, exports.customGetStorageSync)(TRACK_KEYS_STORAGE_KEY) || [];
            // 确保是数组
            if (!Array.isArray(trackKeys)) {
                trackKeys = [];
            }
        }
        catch (e) {
            console.error('获取时间戳列表失败，使用空数组:', e);
            trackKeys = [];
        }
        // 获取被锁定的时间戳key（单个，正在上报中的），使用超时机制
        var lockedKey_1 = (0, exports.getValidLock)() || '';
        // 获取最新的时间戳key
        var currentKey = trackKeys.length > 0 ? trackKeys[trackKeys.length - 1] : null;
        var currentData = [];
        if (currentKey) {
            try {
                currentData = (0, exports.customGetStorageSync)("".concat(TRACK_DATA_PREFIX).concat(currentKey)) || [];
                // 确保是数组
                if (!Array.isArray(currentData)) {
                    currentData = [];
                }
            }
            catch (e) {
                console.error('获取当前时间戳数据失败，使用空数组:', e);
                currentData = [];
            }
        }
        // 判断是否需要创建新的时间戳key：
        // 1. 当前key不存在
        // 2. 当前key已满100条
        // 3. 当前key被锁定（正在上报中）
        var isCurrentKeyLocked = currentKey === lockedKey_1;
        var needNewKey = !currentKey || currentData.length >= MAX_ITEMS_PER_KEY || isCurrentKeyLocked;
        if (needNewKey) {
            // 严格控制5个上限
            if (trackKeys.length >= MAX_KEYS) {
                // 找到最旧的未被锁定的key删除
                var oldestKeyIndex = trackKeys.findIndex(function (key) { return key !== lockedKey_1; });
                if (oldestKeyIndex !== -1) {
                    var oldestKey = trackKeys.splice(oldestKeyIndex, 1)[0];
                    try {
                        (0, exports.customRemoveStorageSync)("".concat(TRACK_DATA_PREFIX).concat(oldestKey));
                    }
                    catch (e) {
                        // 忽略删除错误
                    }
                    console.log('删除最旧的未锁定时间戳:', oldestKey);
                }
                else {
                    // 所有key都被锁定（理论上最多只有1个被锁定），丢弃新数据
                    console.warn('已达到5个时间戳上限且无法删除，丢弃新数据');
                    return;
                }
            }
            var newKey = String(Date.now());
            // 添加新的时间戳key
            trackKeys.push(newKey);
            try {
                (0, exports.customSetStorageSync)(TRACK_KEYS_STORAGE_KEY, trackKeys);
            }
            catch (e) {
                console.error('保存时间戳列表失败:', e);
                return;
            }
            // 存储数据到新的key
            try {
                (0, exports.customSetStorageSync)("".concat(TRACK_DATA_PREFIX).concat(newKey), [data]);
            }
            catch (e) {
                console.error('保存数据失败:', e);
                return;
            }
        }
        else {
            // 当前key未满且未被锁定，追加数据
            currentData.push(data);
            try {
                (0, exports.customSetStorageSync)("".concat(TRACK_DATA_PREFIX).concat(currentKey), currentData);
            }
            catch (e) {
                console.error('保存数据失败:', e);
                return;
            }
        }
        console.log('数据已存储, 当前时间戳数量:', trackKeys.length);
    }
    catch (error) {
        console.error('存储数据失败:', error);
    }
};
exports.saveTrackDataToStorage = saveTrackDataToStorage;
/**
 * 获取存储的上报数据（按时间戳顺序）
 * @returns 最旧的一批数据及其对应的时间戳key
 */
var getTrackDataFromStorage = function () {
    try {
        var trackKeys = (0, exports.customGetStorageSync)(TRACK_KEYS_STORAGE_KEY) || [];
        if (trackKeys.length === 0) {
            return null;
        }
        // 获取最旧的时间戳key（第一个）
        var oldestKey = trackKeys[0];
        var data = (0, exports.customGetStorageSync)("".concat(TRACK_DATA_PREFIX).concat(oldestKey)) || [];
        return { key: oldestKey, data: data };
    }
    catch (error) {
        console.error('Failed to get track data from storage:', error);
        return null;
    }
};
exports.getTrackDataFromStorage = getTrackDataFromStorage;
/**
 * 锁定指定的时间戳key，防止继续写入
 * 存储结构：{ key: string, lockedAt: number }
 */
var lockTrackKey = function (key) {
    (0, exports.customSetStorageSync)(TRACK_LOCK_KEY, {
        key: key,
        lockedAt: Date.now()
    });
};
exports.lockTrackKey = lockTrackKey;
/**
 * 解锁时间戳key
 */
var unlockTrackKey = function () {
    (0, exports.customRemoveStorageSync)(TRACK_LOCK_KEY);
};
exports.unlockTrackKey = unlockTrackKey;
/**
 * 获取有效的锁（如果锁已超时，自动解锁并返回 null）
 * @returns 锁定的 key，如果无锁或锁已超时返回 null
 */
var getValidLock = function () {
    try {
        var lock = (0, exports.customGetStorageSync)(TRACK_LOCK_KEY);
        // 没有锁
        if (!lock) {
            return null;
        }
        // 兼容旧数据：如果是字符串格式（旧版本的锁），当作已超时处理
        if (typeof lock === 'string') {
            console.warn('检测到旧版本锁格式，自动清除:', lock);
            (0, exports.unlockTrackKey)();
            return null;
        }
        // 检查锁是否超时
        var lockAge = Date.now() - lock.lockedAt;
        if (lockAge > LOCK_TIMEOUT) {
            console.warn("\u9501\u5DF2\u8D85\u65F6 (".concat(Math.round(lockAge / 1000), "\u79D2)\uFF0C\u81EA\u52A8\u89E3\u9501:"), lock.key);
            (0, exports.unlockTrackKey)();
            return null;
        }
        // 锁有效
        return lock.key;
    }
    catch (e) {
        console.error('获取锁失败:', e);
        return null;
    }
};
exports.getValidLock = getValidLock;
/**
 * 删除已上报的数据（单个时间戳）
 */
var removeTrackData = function (key) {
    try {
        var trackKeys = (0, exports.customGetStorageSync)(TRACK_KEYS_STORAGE_KEY) || [];
        // 从列表中移除该key
        trackKeys = trackKeys.filter(function (k) { return k !== key; });
        (0, exports.customSetStorageSync)(TRACK_KEYS_STORAGE_KEY, trackKeys);
        // 删除对应的数据
        (0, exports.customRemoveStorageSync)("".concat(TRACK_DATA_PREFIX).concat(key));
        // 解锁
        (0, exports.unlockTrackKey)();
        console.log('数据已删除, 剩余时间戳数量:', trackKeys.length);
    }
    catch (error) {
        console.error('删除数据失败:', error);
    }
};
exports.removeTrackData = removeTrackData;
/**
 * 获取当前缓存数据总量
 * @returns 所有时间戳中的数据总条数
 */
var getTotalCacheCount = function () {
    try {
        var trackKeys = (0, exports.customGetStorageSync)(TRACK_KEYS_STORAGE_KEY) || [];
        var totalCount = 0;
        for (var _i = 0, trackKeys_1 = trackKeys; _i < trackKeys_1.length; _i++) {
            var key = trackKeys_1[_i];
            var data = (0, exports.customGetStorageSync)("".concat(TRACK_DATA_PREFIX).concat(key)) || [];
            if (Array.isArray(data)) {
                totalCount += data.length;
            }
        }
        return totalCount;
    }
    catch (error) {
        console.error('获取缓存数据总量失败:', error);
        return 0;
    }
};
exports.getTotalCacheCount = getTotalCacheCount;
/**
 * 更新缓存数据上限
 * @param maxCount 新的缓存上限，必须是100-1000之间的正整数
 */
var updateMaxCacheCount = function (maxCount) {
    // 确保在有效范围内
    var validCount = Math.min(Math.max(Math.round(maxCount), MIN_MAX_CACHE_COUNT), MAX_MAX_CACHE_COUNT);
    if (validCount !== currentMaxCacheCount) {
        currentMaxCacheCount = validCount;
    }
};
exports.updateMaxCacheCount = updateMaxCacheCount;
/**
 * 获取当前缓存数据上限
 */
var getCurrentMaxCacheCount = function () {
    return currentMaxCacheCount;
};
exports.getCurrentMaxCacheCount = getCurrentMaxCacheCount;
/**
 * 重置上报失败冷却时间（用于测试或手动恢复）
 */
var resetReportCooldown = function () {
    lastReportFailTime = 0;
};
exports.resetReportCooldown = resetReportCooldown;
/**
 * 触发立即上报（当缓存数据达到上限时调用）
 * 暂停定时上报，执行一次完整上报，完成后重启定时器
 * 注意：此函数内部已做完善的异常处理，不会抛出错误
 */
var triggerImmediateReport = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // 前置检查，快速返回
                if (!currentTrackApiFunc) {
                    console.warn('无法触发立即上报：定时器未初始化');
                    return [2 /*return*/];
                }
                if (isImmediateReporting) {
                    console.log('正在执行立即上报，跳过');
                    return [2 /*return*/];
                }
                // 设置标志位要在 try 外面，确保即使后续代码出错也能正确设置
                isImmediateReporting = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                // 暂停定时上报
                if (trackReportTimerId) {
                    try {
                        clearInterval(trackReportTimerId);
                    }
                    catch (e) {
                        // 忽略清除定时器的错误
                    }
                    trackReportTimerId = null;
                    console.log('暂停定时上报，开始立即上报');
                }
                // 执行上报（已有内部异常处理）
                return [4 /*yield*/, (0, exports.reportTrackDataOnce)(currentTrackApiFunc)];
            case 2:
                // 执行上报（已有内部异常处理）
                _a.sent();
                console.log('立即上报完成，重启定时器');
                return [3 /*break*/, 5];
            case 3:
                error_1 = _a.sent();
                console.error('立即上报异常:', error_1);
                // 记录失败时间，防止频繁重试
                lastReportFailTime = Date.now();
                return [3 /*break*/, 5];
            case 4:
                // 确保标志位被重置
                isImmediateReporting = false;
                // 重启定时器（使用 try-catch 保护）
                try {
                    if (currentTrackApiFunc && !trackReportTimerId) {
                        trackReportTimerId = setInterval(function () {
                            try {
                                if (!isImmediateReporting) {
                                    console.log('定时上报数据');
                                    (0, exports.reportTrackDataOnce)(currentTrackApiFunc);
                                }
                            }
                            catch (e) {
                                console.error('定时上报回调异常:', e);
                            }
                        }, currentTrackInterval);
                        console.log('定时上报已重启，间隔:', currentTrackInterval, '毫秒');
                    }
                }
                catch (e) {
                    console.error('重启定时器失败:', e);
                }
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.triggerImmediateReport = triggerImmediateReport;
/**
 * 检查是否需要立即上报（缓存数据量达到上限）
 * @returns 是否需要立即上报
 */
var shouldTriggerImmediateReport = function () {
    try {
        // 如果正在上报中，不触发
        if (isImmediateReporting) {
            return false;
        }
        // 如果上次上报失败且在冷却时间内，不触发
        if (lastReportFailTime > 0 && (Date.now() - lastReportFailTime) < REPORT_FAIL_COOLDOWN) {
            return false;
        }
        var totalCount = (0, exports.getTotalCacheCount)();
        return totalCount >= currentMaxCacheCount;
    }
    catch (error) {
        console.error('检查是否需要立即上报失败:', error);
        return false;
    }
};
exports.shouldTriggerImmediateReport = shouldTriggerImmediateReport;
/**
 * 压缩数据
 * @param data 要压缩的数据
 * @returns 压缩后的 base64 字符串，失败返回空字符串
 */
var compressData = function (data) {
    try {
        var jsonStr = JSON.stringify(data);
        return lz_string_1.default.compressToBase64(jsonStr) || '';
    }
    catch (error) {
        console.error('压缩数据失败:', error);
        return '';
    }
};
exports.compressData = compressData;
/**
 * 解压数据
 * @param compressed 压缩后的 base64 字符串
 * @returns 解压后的数据
 */
var decompressData = function (compressed) {
    var jsonStr = lz_string_1.default.decompressFromBase64(compressed);
    if (!jsonStr)
        return null;
    return JSON.parse(jsonStr);
};
exports.decompressData = decompressData;
/**
 * 上报单个时间戳的数据
 * @param trackApiFunc 上报API函数
 * @param key 时间戳key
 * @returns 是否上报成功
 */
var reportSingleTimestamp = function (trackApiFunc, key) { return __awaiter(void 0, void 0, void 0, function () {
    var data, compressedData, originalSize, compressedSize, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = (0, exports.customGetStorageSync)("".concat(TRACK_DATA_PREFIX).concat(key)) || [];
                if (data.length === 0) {
                    // 数据为空，直接删除该key
                    (0, exports.removeTrackData)(key);
                    return [2 /*return*/, true];
                }
                // 锁定当前时间戳
                (0, exports.lockTrackKey)(key);
                compressedData = (0, exports.compressData)(data);
                // 压缩失败，跳过本次上报，解锁并返回失败
                if (!compressedData) {
                    console.error('压缩数据为空，跳过上报:', key);
                    (0, exports.unlockTrackKey)();
                    lastReportFailTime = Date.now();
                    return [2 /*return*/, false];
                }
                originalSize = 0;
                try {
                    originalSize = JSON.stringify(data).length;
                }
                catch (e) {
                    // 忽略统计错误
                }
                compressedSize = compressedData.length;
                if (originalSize > 0) {
                    console.log("\u4E0A\u62A5\u6570\u636E, \u65F6\u95F4\u6233: ".concat(key, ", \u6570\u636E\u6761\u6570: ").concat(data.length, ", \u539F\u59CB\u5927\u5C0F: ").concat(originalSize, " \u5B57\u8282, \u538B\u7F29\u540E: ").concat(compressedSize, " \u5B57\u8282, \u538B\u7F29\u7387: ").concat(((1 - compressedSize / originalSize) * 100).toFixed(1), "%"));
                }
                else {
                    console.log("\u4E0A\u62A5\u6570\u636E, \u65F6\u95F4\u6233: ".concat(key, ", \u6570\u636E\u6761\u6570: ").concat(data.length, ", \u538B\u7F29\u540E: ").concat(compressedSize, " \u5B57\u8282"));
                }
                // 调用上报API
                return [4 /*yield*/, trackApiFunc(compressedData)
                    // 上报成功，删除已上报的数据（会自动解锁）
                ];
            case 1:
                // 调用上报API
                _a.sent();
                // 上报成功，删除已上报的数据（会自动解锁）
                (0, exports.removeTrackData)(key);
                // 上报成功，重置失败冷却时间
                lastReportFailTime = 0;
                console.log('时间戳上报成功:', key);
                return [2 /*return*/, true];
            case 2:
                error_2 = _a.sent();
                console.error('时间戳上报失败:', key, error_2);
                // 上报失败，解锁，记录失败时间
                (0, exports.unlockTrackKey)();
                lastReportFailTime = Date.now();
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
// 每次上报的最大时间戳数量
var MAX_REPORT_KEYS_PER_ROUND = 5;
/**
 * 简单上报（忽略锁、缓存等逻辑，直接上报）
 * 用于记录执行日志，无论成功失败都不影响主流程
 * @param trackApiFunc 上报API函数
 * @param data 要上报的数据
 */
var reportSimple = function (trackApiFunc, data) { return __awaiter(void 0, void 0, void 0, function () {
    var compressedData, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!trackApiFunc || !data)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                compressedData = (0, exports.compressData)(Array.isArray(data) ? data : [data]);
                if (!compressedData) return [3 /*break*/, 3];
                return [4 /*yield*/, trackApiFunc(compressedData)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.reportSimple = reportSimple;
/**
 * 执行分批上报（按时间戳顺序逐个上报，每轮最多5个）
 * 每次触发时，按先后顺序逐个上报时间戳数据，每轮最多上报5个时间戳
 * 注意：此函数内部已做完善的异常处理，不会抛出错误
 * @param trackApiFunc 上报API函数
 */
var reportTrackDataOnce = function (trackApiFunc) { return __awaiter(void 0, void 0, void 0, function () {
    var reportStatus, reportedCount, errorMsg, lockedKey, trackKeys, keysToReport, remainingCount, _i, keysToReport_1, key, success, e_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reportStatus = 'started';
                reportedCount = 0;
                errorMsg = '';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, 9, 10]);
                lockedKey = (0, exports.getValidLock)();
                if (lockedKey) {
                    console.log('有正在上报中的时间戳，跳过本次:', lockedKey);
                    reportStatus = 'skipped_locked';
                    return [2 /*return*/];
                }
                trackKeys = [];
                try {
                    trackKeys = (0, exports.customGetStorageSync)(TRACK_KEYS_STORAGE_KEY) || [];
                }
                catch (e) {
                    console.error('获取时间戳列表失败:', e);
                    reportStatus = 'error_get_keys';
                    return [2 /*return*/];
                }
                if (!Array.isArray(trackKeys) || trackKeys.length === 0) {
                    console.log('没有需要上报的数据');
                    reportStatus = 'no_data';
                    return [2 /*return*/];
                }
                keysToReport = trackKeys.slice(0, MAX_REPORT_KEYS_PER_ROUND);
                remainingCount = trackKeys.length - keysToReport.length;
                console.log("\u5F00\u59CB\u5206\u6279\u4E0A\u62A5, \u672C\u8F6E\u4E0A\u62A5 ".concat(keysToReport.length, " \u4E2A\u65F6\u95F4\u6233").concat(remainingCount > 0 ? ", \u5269\u4F59 ".concat(remainingCount, " \u4E2A\u7B49\u5F85\u4E0B\u8F6E\u4E0A\u62A5") : ''));
                _i = 0, keysToReport_1 = keysToReport;
                _a.label = 2;
            case 2:
                if (!(_i < keysToReport_1.length)) return [3 /*break*/, 7];
                key = keysToReport_1[_i];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, reportSingleTimestamp(trackApiFunc, key)];
            case 4:
                success = _a.sent();
                if (!success) {
                    // 上报失败，停止本次上报任务，等待下次触发
                    console.log('上报失败，停止本次上报任务');
                    reportStatus = 'partial_fail';
                    return [3 /*break*/, 7];
                }
                reportedCount++;
                return [3 /*break*/, 6];
            case 5:
                e_2 = _a.sent();
                console.error('单个时间戳上报异常:', key, e_2);
                errorMsg = String(e_2);
                reportStatus = 'error_single';
                // 尝试解锁，防止锁死
                try {
                    (0, exports.unlockTrackKey)();
                }
                catch (unlockError) {
                    // 忽略解锁错误
                }
                return [3 /*break*/, 7];
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7:
                if (reportStatus === 'started') {
                    reportStatus = 'success';
                }
                console.log("\u672C\u8F6E\u4E0A\u62A5\u5B8C\u6210, \u6210\u529F\u4E0A\u62A5 ".concat(reportedCount, " \u4E2A\u65F6\u95F4\u6233"));
                return [3 /*break*/, 10];
            case 8:
                error_3 = _a.sent();
                console.error('上报任务异常:', error_3);
                reportStatus = 'error';
                errorMsg = String(error_3);
                // 尝试解锁，防止锁死
                try {
                    (0, exports.unlockTrackKey)();
                }
                catch (unlockError) {
                    // 忽略解锁错误
                }
                return [3 /*break*/, 10];
            case 9:
                // 只有在有数据的情况下才记录执行日志（没有数据时不上报）
                if (reportStatus !== 'no_data') {
                    try {
                        (0, exports.reportSimple)(currentTrackApiFunc, {
                            type: 'track',
                            event: '#rxsdk_report_log',
                            uuid: (0, v4_1.default)(),
                            distinct_id: config_1.USER_INFO.openid,
                            platform_id: 4,
                            product_id: config_1.SYSTEM_INFO.productId,
                            cpid: Number(config_1.SYSTEM_INFO.cpid),
                            channel_id: config_1.SYSTEM_INFO.channelId,
                            devicecode: config_1.SYSTEM_INFO.deviceCode || '',
                            properties: {
                                status: reportStatus,
                                count: reportedCount,
                                error: errorMsg || undefined
                            }
                        });
                    }
                    catch (error) {
                        // 忽略日志上报错误
                    }
                }
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.reportTrackDataOnce = reportTrackDataOnce;
/**
 * 启动定时上报定时器
 * @param trackApiFunc 上报API函数（接收压缩后的字符串）
 * @param interval 上报间隔，默认1分钟（60000毫秒）
 */
var startTrackReportTimer = function (trackApiFunc, interval) {
    if (interval === void 0) { interval = DEFAULT_FLUSH_INTERVAL; }
    // 保存API函数引用，用于后续动态更新间隔
    currentTrackApiFunc = trackApiFunc;
    // 确保间隔不小于最小值
    var validInterval = Math.max(interval, MIN_FLUSH_INTERVAL);
    currentTrackInterval = validInterval;
    // 如果已有定时器，先清除
    if (trackReportTimerId) {
        clearInterval(trackReportTimerId);
        trackReportTimerId = null;
    }
    // 初始化时先清除可能残留的锁（防止上次异常退出导致锁未释放）
    try {
        (0, exports.unlockTrackKey)();
        console.log('初始化时清除残留锁');
    }
    catch (e) {
        // 忽略清除锁的错误
    }
    console.log('启动定时上报定时器, 间隔:', validInterval, '毫秒');
    // 启动定时器
    trackReportTimerId = setInterval(function () {
        try {
            // 如果正在执行立即上报，跳过本次定时上报
            if (isImmediateReporting) {
                console.log('正在执行立即上报，跳过定时上报');
                return;
            }
            console.log('定时上报数据');
            (0, exports.reportTrackDataOnce)(trackApiFunc);
        }
        catch (error) {
            console.error('定时上报回调异常:', error);
        }
    }, validInterval);
};
exports.startTrackReportTimer = startTrackReportTimer;
/**
 * 动态更新上报间隔
 * @param interval 新的上报间隔（毫秒），最小值为200毫秒
 */
var updateTrackReportInterval = function (interval) {
    // 确保间隔不小于最小值
    var validInterval = Math.max(interval, MIN_FLUSH_INTERVAL);
    // 如果间隔没有变化，不需要重启定时器
    if (validInterval === currentTrackInterval) {
        return;
    }
    // 如果没有API函数引用，无法重启定时器
    if (!currentTrackApiFunc) {
        console.warn('无法更新上报间隔：定时器未初始化');
        return;
    }
    console.log('更新上报间隔:', currentTrackInterval, '->', validInterval, '毫秒');
    // 重启定时器
    (0, exports.startTrackReportTimer)(currentTrackApiFunc, validInterval);
};
exports.updateTrackReportInterval = updateTrackReportInterval;
/**
 * 停止定时上报定时器
 */
var stopTrackReportTimer = function () {
    if (trackReportTimerId) {
        clearInterval(trackReportTimerId);
        trackReportTimerId = null;
        console.log('Track report timer stopped');
    }
};
exports.stopTrackReportTimer = stopTrackReportTimer;
//# sourceMappingURL=utils.js.map