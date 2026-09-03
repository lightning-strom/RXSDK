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
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAllQueuesAndCache = exports.doRequest = exports.generateMD5 = exports.AesDecryptBase64String = exports.AesEncryptBase64String = exports.cpkey = void 0;
var config_1 = require("@/config");
var v4_1 = require("uuid/v4");
var const_1 = require("@/config/const");
var utils_1 = require("@/utils/utils");
var api_1 = require("@/api/api");
var day_1 = require("@/utils/day");
var enum_1 = require("@/config/enum");
// @ts-ignore
// import { cryptoJS } from '../index.crypto.js'
exports.cpkey = '4ca7dacc9332d74e1292c83f0aa3b376';
// 请求队列 Map，用于管理相同参数的请求队列
var requestQueueMap = new Map();
// 缓存成功的结果
var successResultCache = new Map();
// 缓存配置
var CACHE_CONFIG = {
    MAX_CACHE_SIZE: 10,
    MAX_CACHE_AGE: 0.1 * 60 * 1000 // 缓存最大存活时间：6秒
};
// 清理过期的缓存
function cleanExpiredCache() {
    try {
        var now_1 = Date.now();
        var keysToDelete_1 = [];
        try {
            successResultCache.forEach(function (item, key) {
                try {
                    if (now_1 - item.timestamp > CACHE_CONFIG.MAX_CACHE_AGE) {
                        keysToDelete_1.push(key);
                    }
                }
                catch (error) {
                    // printLog(`[缓存清理] 检查缓存项失败，跳过，queueKey: ${key}`, error)
                }
            });
        }
        catch (error) {
            // printLog(`[缓存清理] 遍历缓存失败`, error)
        }
        keysToDelete_1.forEach(function (key) {
            try {
                successResultCache.delete(key);
                // printLog(`[缓存清理] 清理过期缓存，queueKey: ${key}`)
            }
            catch (error) {
                // printLog(`[缓存清理] 删除缓存项失败，queueKey: ${key}`, error)
            }
        });
        // 如果缓存数量超过限制，清理最旧的缓存
        try {
            if (successResultCache.size > CACHE_CONFIG.MAX_CACHE_SIZE) {
                var sortedEntries = Array.from(successResultCache.entries())
                    .sort(function (a, b) { return a[1].timestamp - b[1].timestamp; });
                var toDelete = sortedEntries.slice(0, successResultCache.size - CACHE_CONFIG.MAX_CACHE_SIZE);
                toDelete.forEach(function (_a) {
                    var key = _a[0];
                    try {
                        successResultCache.delete(key);
                        // printLog(`[缓存清理] 缓存数量超过限制，清理最旧缓存，queueKey: ${key}`)
                    }
                    catch (error) {
                        // printLog(`[缓存清理] 删除最旧缓存失败，queueKey: ${key}`, error)
                    }
                });
            }
        }
        catch (error) {
            // printLog(`[缓存清理] 清理超出限制的缓存失败`, error)
        }
    }
    catch (error) {
        // 清理缓存失败不影响其他功能
        // printLog(`[缓存清理] 清理缓存过程发生异常，但不影响其他功能`, error)
    }
}
// 生成请求的唯一标识
function generateRequestKey(path, data) {
    try {
        var dataStr = '';
        try {
            dataStr = JSON.stringify(data || {});
        }
        catch (error) {
            // JSON.stringify 失败时，使用 toString 作为后备
            // printLog(`[请求队列] JSON.stringify 失败，使用后备方案`, error)
            try {
                dataStr = String(data || '');
            }
            catch (stringError) {
                dataStr = '{}';
                // printLog(`[请求队列] 转换为字符串失败，使用默认值`, stringError)
            }
        }
        return "".concat(path || '', "_").concat(dataStr);
    }
    catch (error) {
        // 如果所有操作都失败，返回一个基于时间戳的唯一标识
        // printLog(`[请求队列] 生成 queueKey 完全失败，使用时间戳`, error)
        return "".concat(path || '', "_").concat(Date.now(), "_").concat(Math.random());
    }
}
// 检查结果是否应该被缓存（code === 0 status >  1 即可缓存）
function shouldCacheResult(result) {
    var _a, _b;
    try {
        if (!result) {
            // printLog(`[缓存检查] result 为空`)
            return false;
        }
        try {
            if (result.code === 0 && ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.status) && ((_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.status) > 1) {
                // printLog(`[缓存检查] 满足缓存条件，code: ${result.code}`)
                return true;
            }
            // printLog(`[缓存检查] code 不为 0, code: ${result.code}`)
            return false;
        }
        catch (error) {
            // printLog(`[缓存检查] 检查 code 失败`, error)
            return false;
        }
    }
    catch (error) {
        // 缓存检查失败，不缓存结果
        // printLog(`[缓存检查] 缓存检查过程异常，不缓存`, error)
        return false;
    }
}
// 缓存成功的结果
function cacheSuccessResult(queueKey, result) {
    try {
        if (shouldCacheResult(result)) {
            try {
                // 清理过期缓存，防止内存泄漏
                cleanExpiredCache();
            }
            catch (error) {
                // printLog(`[缓存设置] 清理过期缓存失败，但不影响当前缓存设置`, error)
            }
            try {
                // printLog(`[请求队列] 请求成功且 code === 0，缓存结果，queueKey: ${queueKey}, 当前缓存数量: ${successResultCache.size}`)
                successResultCache.set(queueKey, {
                    result: result,
                    timestamp: Date.now()
                });
            }
            catch (error) {
                // printLog(`[缓存设置] 设置缓存失败，queueKey: ${queueKey}`, error)
            }
        }
        else {
            // printLog(`[请求队列] 请求结果不符合缓存条件，不缓存，queueKey: ${queueKey}, code: ${result?.code}`)
        }
    }
    catch (error) {
        // 缓存设置失败不影响请求结果
        // printLog(`[缓存设置] 缓存结果过程发生异常，但不影响请求`, error)
    }
}
// 处理队列中的请求（添加异常处理和防止死循环机制）
var processQueueRetryCount = new Map(); // 记录每个队列的处理次数，防止死循环
var MAX_PROCESS_RETRY = 100; // 最大处理次数，防止死循环
function processQueue(queueKey) {
    return __awaiter(this, void 0, void 0, function () {
        var retryCount, queue, queue, item, cacheItem, now, cachedResponse, startTime, timeoutPromise, result, duration, error_1, duration, error_2, queue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    retryCount = processQueueRetryCount.get(queueKey) || 0;
                    if (retryCount > MAX_PROCESS_RETRY) {
                        // printLog(`[队列处理] 处理次数超过限制，强制清理队列，queueKey: ${queueKey}, 重试次数: ${retryCount}`)
                        try {
                            queue = requestQueueMap.get(queueKey);
                            if (queue) {
                                // 清理队列中的所有请求
                                queue.queue.forEach(function (item) {
                                    try {
                                        item.reject(new Error('队列处理次数超过限制，请求被取消'));
                                    }
                                    catch (error) {
                                        // printLog(`[队列处理] 清理队列项失败`, error)
                                    }
                                });
                            }
                            requestQueueMap.delete(queueKey);
                            successResultCache.delete(queueKey);
                            processQueueRetryCount.delete(queueKey);
                        }
                        catch (error) {
                            // printLog(`[队列处理] 强制清理队列失败`, error)
                        }
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    queue = requestQueueMap.get(queueKey);
                    if (!queue || queue.isProcessing || queue.queue.length === 0) {
                        // 重置重试计数
                        processQueueRetryCount.delete(queueKey);
                        return [2 /*return*/];
                    }
                    queue.isProcessing = true;
                    // 增加重试计数
                    processQueueRetryCount.set(queueKey, retryCount + 1);
                    item = queue.queue.shift();
                    if (!item) {
                        queue.isProcessing = false;
                        processQueueRetryCount.delete(queueKey);
                        // 如果队列为空，删除该队列并清空缓存
                        // 这是队列真正处理完成的标志（队列为空且没有正在处理的请求）
                        try {
                            if (queue.queue.length === 0) {
                                // printLog(`[队列处理] 队列项为空，队列处理完成，删除队列并清空缓存，queueKey: ${queueKey}`)
                                requestQueueMap.delete(queueKey);
                                successResultCache.delete(queueKey);
                            }
                        }
                        catch (error) {
                            // printLog(`[队列处理] 清理队列失败`, error)
                        }
                        return [2 /*return*/];
                    }
                    cacheItem = void 0;
                    try {
                        cacheItem = successResultCache.get(queueKey);
                        // printLog(`[队列处理] 检查缓存，queueKey: ${queueKey}, 缓存是否存在: ${!!cacheItem}`)
                    }
                    catch (error) {
                        // printLog(`[队列处理] 检查缓存失败，继续执行请求`, error)
                    }
                    if (cacheItem) {
                        try {
                            now = Date.now();
                            if (now - cacheItem.timestamp > CACHE_CONFIG.MAX_CACHE_AGE) {
                                // printLog(`[队列处理] 缓存已过期，清理缓存，queueKey: ${queueKey}`)
                                try {
                                    successResultCache.delete(queueKey);
                                }
                                catch (error) {
                                    // printLog(`[队列处理] 删除过期缓存失败`, error)
                                }
                            }
                            else {
                                cachedResponse = __assign(__assign({}, cacheItem.result), { code: 101 });
                                try {
                                    item.resolve(cachedResponse);
                                }
                                catch (error) {
                                    // printLog(`[队列处理] 返回缓存结果失败`, error)
                                }
                                queue.isProcessing = false;
                                // 重置重试计数
                                processQueueRetryCount.delete(queueKey);
                                // 处理队列中的下一个请求
                                try {
                                    if (queue.queue.length > 0) {
                                        // printLog(`[队列处理] 继续处理下一个请求，queueKey: ${queueKey}, 剩余队列长度: ${queue.queue.length}`)
                                        // 使用 setTimeout 防止调用栈溢出
                                        setTimeout(function () {
                                            processQueue(queueKey).catch(function (err) {
                                                // printLog(`[队列处理] 处理下一个请求失败`, err)
                                            });
                                        }, 0);
                                    }
                                    else {
                                        // 队列为空且没有正在处理的请求，删除该队列并清空缓存
                                        // 这是队列真正处理完成的标志
                                        // printLog(`[队列处理] 队列处理完成（队列为空且无正在处理的请求），删除队列并清空缓存，queueKey: ${queueKey}`)
                                        try {
                                            requestQueueMap.delete(queueKey);
                                            successResultCache.delete(queueKey);
                                        }
                                        catch (error) {
                                            // printLog(`[队列处理] 清理队列和缓存失败`, error)
                                        }
                                    }
                                }
                                catch (error) {
                                    // printLog(`[队列处理] 处理队列后续逻辑失败`, error)
                                    // 确保队列状态被重置
                                    try {
                                        queue.isProcessing = false;
                                        if (queue.queue.length === 0) {
                                            requestQueueMap.delete(queueKey);
                                            successResultCache.delete(queueKey);
                                        }
                                    }
                                    catch (cleanupError) {
                                        // printLog(`[队列处理] 清理队列状态失败`, cleanupError)
                                    }
                                }
                                return [2 /*return*/];
                            }
                        }
                        catch (error) {
                            // printLog(`[队列处理] 处理缓存逻辑失败，继续执行请求`, error)
                        }
                    }
                    startTime = Date.now();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, 5, 6]);
                    timeoutPromise = new Promise(function (_, reject) {
                        setTimeout(function () { return reject(new Error('队列请求超时')); }, 30000); // 30秒超时
                    });
                    return [4 /*yield*/, Promise.race([
                            doRequestOriginal(item.options, item.urlIndex, item.refreshNum, item.enableHttpDNS),
                            timeoutPromise
                        ])];
                case 3:
                    result = _a.sent();
                    duration = Date.now() - startTime;
                    // printLog(`[队列处理] 请求成功完成，queueKey: ${queueKey}, 耗时: ${duration}ms`)
                    // 如果请求成功且 data.status > 1，缓存结果
                    try {
                        cacheSuccessResult(queueKey, result);
                    }
                    catch (error) {
                        // printLog(`[队列处理] 缓存结果失败，但不影响请求结果`, error)
                    }
                    try {
                        item.resolve(result);
                    }
                    catch (error) {
                        // printLog(`[队列处理] 返回请求结果失败`, error)
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    duration = Date.now() - startTime;
                    // printLog(`[队列处理] 请求失败，queueKey: ${queueKey}, 耗时: ${duration}ms`, error)
                    try {
                        item.reject(error_1);
                    }
                    catch (rejectError) {
                        // printLog(`[队列处理] 拒绝请求失败`, rejectError)
                    }
                    return [3 /*break*/, 6];
                case 5:
                    try {
                        queue.isProcessing = false;
                        // 处理队列中的下一个请求
                        if (queue.queue.length > 0) {
                            // printLog(`[队列处理] 继续处理下一个请求，queueKey: ${queueKey}, 剩余队列长度: ${queue.queue.length}`)
                            // 使用 setTimeout 防止调用栈溢出
                            setTimeout(function () {
                                processQueue(queueKey).catch(function (err) {
                                    // printLog(`[队列处理] 处理下一个请求失败`, err)
                                    // 如果处理失败，确保队列状态被重置
                                    try {
                                        var failedQueue = requestQueueMap.get(queueKey);
                                        if (failedQueue) {
                                            failedQueue.isProcessing = false;
                                            if (failedQueue.queue.length === 0) {
                                                requestQueueMap.delete(queueKey);
                                                successResultCache.delete(queueKey);
                                                processQueueRetryCount.delete(queueKey);
                                            }
                                        }
                                    }
                                    catch (cleanupError) {
                                        // printLog(`[队列处理] 清理失败队列状态失败`, cleanupError)
                                    }
                                });
                            }, 0);
                        }
                        else {
                            // 队列为空且没有正在处理的请求，删除该队列并清空缓存
                            // 这是队列真正处理完成的标志
                            // printLog(`[队列处理] 队列处理完成（队列为空且无正在处理的请求），删除队列并清空缓存，queueKey: ${queueKey}`)
                            try {
                                requestQueueMap.delete(queueKey);
                                successResultCache.delete(queueKey);
                                processQueueRetryCount.delete(queueKey);
                            }
                            catch (error) {
                                // printLog(`[队列处理] 清理队列和缓存失败`, error)
                            }
                        }
                    }
                    catch (error) {
                        // printLog(`[队列处理] finally 块执行失败，强制清理`, error)
                        // 强制清理，防止队列卡死
                        try {
                            queue.isProcessing = false;
                            if (queue.queue.length === 0) {
                                requestQueueMap.delete(queueKey);
                                successResultCache.delete(queueKey);
                                processQueueRetryCount.delete(queueKey);
                            }
                        }
                        catch (cleanupError) {
                            // printLog(`[队列处理] 强制清理失败`, cleanupError)
                        }
                    }
                    return [7 /*endfinally*/];
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    // 外层异常捕获，确保不影响其他功能
                    // printLog(`[队列处理] processQueue 执行异常，强制清理队列，queueKey: ${queueKey}`, error)
                    try {
                        queue = requestQueueMap.get(queueKey);
                        if (queue) {
                            queue.isProcessing = false;
                            // 清理队列中的所有请求
                            queue.queue.forEach(function (queueItem) {
                                try {
                                    queueItem.reject(new Error('队列处理异常，请求被取消'));
                                }
                                catch (rejectError) {
                                    // printLog(`[队列处理] 清理队列项失败`, rejectError)
                                }
                            });
                        }
                        requestQueueMap.delete(queueKey);
                        successResultCache.delete(queueKey);
                        processQueueRetryCount.delete(queueKey);
                    }
                    catch (cleanupError) {
                        (0, utils_1.printLog)("[\u961F\u5217\u5904\u7406] \u5F02\u5E38\u6E05\u7406\u5931\u8D25", cleanupError);
                    }
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function crypto() {
    // @ts-ignore
    // return cryptoJS()
    return wx.crypto;
}
/**
 * AES-CBC 加密字符串
 * @param {string} data 需要加密的字符串
 * @param {string} key 加密密钥
 * @param {string} iv 初始化向量
 * @returns {string} 加密后的 Base64 编码字符串
 */
function AesEncryptBase64String(data, key, iv) {
    var CryptoJS = crypto();
    // 将密钥和初始化向量转换为 WordArray
    var keyWordArray = CryptoJS.enc.Utf8.parse(key);
    var ivWordArray = CryptoJS.enc.Utf8.parse(iv);
    // 使用 AES-CBC 加密
    var encrypted = CryptoJS.AES.encrypt(data, keyWordArray, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // 返回 Base64 编码的加密结果
    return encrypted.toString();
}
exports.AesEncryptBase64String = AesEncryptBase64String;
/**
 * AES-CBC 解密字符串
 * @param {string} encryptedData 加密后的 Base64 编码字符串
 * @param {string} key 加密密钥
 * @param {string} iv 初始化向量
 * @returns {string} 解密后的原始字符串
 */
function AesDecryptBase64String(encryptedData, key, iv) {
    var CryptoJS = crypto();
    // 将密钥和初始化向量转换为 WordArray
    var keyWordArray = CryptoJS.enc.Utf8.parse(key);
    var ivWordArray = CryptoJS.enc.Utf8.parse(iv);
    // 使用 AES-CBC 解密
    var decrypted = CryptoJS.AES.decrypt(encryptedData, keyWordArray, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // 将解密结果转换为 UTF-8 字符串
    return decrypted.toString(CryptoJS.enc.Utf8);
}
exports.AesDecryptBase64String = AesDecryptBase64String;
/**
 * 生成 MD5 加密字符串
 * @param {string} message - 需要加密的字符串
 * @returns {string} - 加密后的 MD5 字符串
 */
function generateMD5(message) {
    var CryptoJS = crypto();
    if (CryptoJS)
        return CryptoJS.MD5(message).toString();
    return '';
}
exports.generateMD5 = generateMD5;
var getDevicecode = function () {
    try {
        var devicecode = (0, utils_1.customGetStorageSync)('rx_devicecode');
        if (devicecode) {
            // @ts-ignore
            return devicecode.code;
        }
        else {
            var code = (0, v4_1.default)();
            (0, utils_1.customSetStorageSync)('rx_devicecode', { code: code, openIds: {} });
            return code;
        }
    }
    catch (err) {
        return (0, v4_1.default)();
    }
};
function checkNeedAesEncrypt(url) {
    if (!crypto()) {
        return false;
    }
    if (!config_1.SYSTEM_INFO.CP_OF) {
        return false;
    }
    return !url.includes('/v1/sdkconfig/init');
}
// 接口白名单：初始化未成功之前能走请求的接口
var apiWhiteList = ['/v1/sdkconfig/init', '/v1/vcapi/update', '/v1/vcapi/update_module_version'];
var refreshCode = [302206, 302207, 302002];
function moveToStart(arr, index) {
    // 移除指定索引的元素并获取它
    var element = arr.splice(index, 1)[0];
    // 在数组开始位置插入这个元素
    arr.unshift(element);
    return arr;
}
var refreshTokenReq = function () {
    return doRequest({
        method: 'POST',
        url: '/v1/passport/token/refresh'
    });
};
var getHeaders = function (path) {
    var _a, _b;
    var accessWhiteSpace = [
        '/v1/passport/account/login_by_credential',
        '/v1/passport/account/login_by_token'
    ];
    var getDevicecode = function () {
        try {
            var devicecode = (0, utils_1.customGetStorageSync)('rx_devicecode');
            if (devicecode) {
                // @ts-ignore
                return devicecode.code;
            }
            else {
                var code = (0, v4_1.default)();
                (0, utils_1.customSetStorageSync)('rx_devicecode', { code: code, openIds: {} });
                return code;
            }
        }
        catch (err) {
            return (0, v4_1.default)();
        }
    };
    var devicecode = getDevicecode();
    var headers = (_a = {},
        _a['ruixue-language'] = 'zh-CN',
        _a['ruixue-cpid'] = config_1.SYSTEM_INFO.cpid,
        _a['ruixue-productid'] = config_1.SYSTEM_INFO.productId,
        _a['ruixue-channelid'] = config_1.SYSTEM_INFO.channelId,
        _a['ruixue-platformid'] = '4',
        _a['ruixue-devicecode'] = devicecode,
        _a['ruixue-version'] = config_1.SYSTEM_INFO.__RX_SDK_VERSION,
        _a['ruixue-traceid'] = (0, v4_1.default)(),
        _a['ruixue-tzoffset'] = config_1.SYSTEM_INFO.timezone + '',
        _a);
    var rxToken = (0, utils_1.customGetStorageSync)('rxToken');
    if (!accessWhiteSpace.includes(path)) {
        // @ts-ignore
        Reflect.set(headers, 'ruixue-accesstoken', (rxToken === null || rxToken === void 0 ? void 0 : rxToken.access) || '');
    }
    if (path == '/v1/passport/token/refresh') {
        console.log('refresh');
        headers['ruixue-datacount'] = '1';
        // @ts-ignore
        headers['ruixue-refreshtoken'] = rxToken === null || rxToken === void 0 ? void 0 : rxToken.refresh;
    }
    if (path.includes('/v1/data/api/track')) {
        headers = (_b = {},
            _b['ruixue-datacount'] = '1',
            _b);
    }
    if (checkNeedAesEncrypt(path)) {
        headers['ruixue-encipher'] = '1';
        headers['ruixue-devicecode'] = devicecode;
        headers['ruixue-version'] = config_1.SYSTEM_INFO.__RX_SDK_VERSION;
        headers['ruixue-platformid'] = '4';
    }
    if (config_1.SYSTEM_INFO.region_tag) {
        headers['ruixue-region'] = "".concat(config_1.SYSTEM_INFO.region_tag);
    }
    if (config_1.SYSTEM_INFO.cp_role_id) {
        headers['ruixue-cp-role-id'] = "".concat(config_1.SYSTEM_INFO.cp_role_id);
    }
    if (config_1.SYSTEM_INFO.miniVersion) {
        headers['ruixue-appinfo'] = "version=".concat(config_1.SYSTEM_INFO.miniVersion);
    }
    return headers;
};
function removeKeyFromObject(obj) {
    return Object.fromEntries(Object.entries(obj).filter(function (_a) {
        var key = _a[0];
        return key !== 'ruixue-encipher';
    }));
}
function isJsonString(str) {
    try {
        var parsed = JSON.parse(str);
        return true;
    }
    catch (e) {
        return false;
    }
}
var retryRequest = function (options, resolve, reject) {
    var header = removeKeyFromObject(options.header);
    (0, utils_1.printLog)("".concat(options.url));
    (0, utils_1.printLog)("options", options);
    (0, utils_1.printLog)("timeout", config_1.SYSTEM_INFO.timeout || 7000);
    wx.request(__assign(__assign({}, options), { header: header, timeout: config_1.SYSTEM_INFO.timeout || 7000, data: options.data, success: function (res) {
            (0, utils_1.printLog)("".concat(options.url));
            (0, utils_1.printLog)("res", res.data);
            resolve(res.data);
        }, fail: function (res) {
            (0, utils_1.printLog)("".concat(options.url));
            (0, utils_1.printLog)("err", res);
            reject(res);
        } }));
};
function trackEncrypt(options, key) {
    (0, api_1.trackApi)([
        {
            event: '#rx_error',
            type: 'track',
            time: (0, day_1.formatDate)('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            uuid: (0, v4_1.default)(),
            sub_channel_id: config_1.USER_INFO.subchannelid,
            distinct_id: config_1.USER_INFO.openid,
            platform_id: 4,
            product_id: config_1.SYSTEM_INFO.productId,
            cpid: Number(config_1.SYSTEM_INFO.cpid),
            channel_id: config_1.SYSTEM_INFO.channelId,
            devicecode: getDevicecode(),
            properties: {
                error_action: 'encrypt',
                error_type: 'sdk',
                trace_id: (0, v4_1.default)(),
                rx_version: config_1.SYSTEM_INFO.__RX_SDK_VERSION,
                type_tripartite: enum_1.PLATFORM.WECHAT,
                request_address: options.url || '',
                request_header: options.header || '',
                request_body: options.data || '',
                key: key
            }
        }
    ]).catch(function (e) {
        console.log(e);
    });
}
function trackDecrypt(options, res, key) {
    if (options.url.includes('/v1/data/api/track')) {
        return;
    }
    (0, api_1.trackApi)([
        {
            event: '#rx_error',
            type: 'track',
            time: (0, day_1.formatDate)('YYYY-MM-DDTHH:mm:ss.SSSZ'),
            uuid: (0, v4_1.default)(),
            sub_channel_id: config_1.USER_INFO.subchannelid,
            distinct_id: config_1.USER_INFO.openid,
            platform_id: 4,
            product_id: config_1.SYSTEM_INFO.productId,
            cpid: Number(config_1.SYSTEM_INFO.cpid),
            channel_id: config_1.SYSTEM_INFO.channelId,
            devicecode: getDevicecode(),
            properties: {
                error_action: 'decrypt',
                error_type: 'sdk',
                trace_id: (0, v4_1.default)(),
                rx_version: config_1.SYSTEM_INFO.__RX_SDK_VERSION,
                type_tripartite: enum_1.PLATFORM.WECHAT,
                request_address: options.url || '',
                request_header: options.header || '',
                request_body: options.data || '',
                request_response: res === null || res === void 0 ? void 0 : res.data,
                key: key
            }
        }
    ]).catch(function (e) {
        console.log(e);
    });
}
var myRequest = function (options) {
    var devicecode = getDevicecode();
    var key = generateMD5(devicecode + exports.cpkey);
    (0, utils_1.printLog)("".concat(options.url));
    (0, utils_1.printLog)("options", options);
    return new Promise(function (resolve, reject) {
        var data = options.data;
        var isAes = checkNeedAesEncrypt(options.url);
        try {
            data = (isAes && options.method.toLowerCase() != 'get') ? AesEncryptBase64String(JSON.stringify(options.data), key, key.slice(0, 16)) : options.data;
            if (isAes && options.method.toLowerCase() != 'get') {
                (0, utils_1.printLog)('Encrypt Data:', data);
            }
        }
        catch (e) {
            trackEncrypt(options, key);
            retryRequest(options, resolve, reject);
            return;
        }
        (0, utils_1.printLog)("timeout", config_1.SYSTEM_INFO.timeout || 7000);
        wx.request(__assign(__assign({}, options), { data: data, timeout: config_1.SYSTEM_INFO.timeout || 7000, success: function (res) {
                var _a, _b, _c, _d;
                if ([302015, 302016].includes((_a = res.data) === null || _a === void 0 ? void 0 : _a.code)) {
                    (0, utils_1.printLog)('request 解密失败', options.url, (_b = res.data) === null || _b === void 0 ? void 0 : _b.code);
                    trackDecrypt(options, res, key);
                    retryRequest(options, resolve, reject);
                }
                else {
                    var data_1 = (_c = res.data) === null || _c === void 0 ? void 0 : _c.data;
                    if (isAes && data_1) {
                        try {
                            if (((_d = res.data) === null || _d === void 0 ? void 0 : _d.code) === 0) {
                                data_1 = AesDecryptBase64String(data_1, key, key.slice(0, 16));
                                (0, utils_1.printLog)('Decrypt Data:', data_1);
                                var result = __assign(__assign({}, res.data), { data: isJsonString(data_1) ? JSON.parse(data_1) : data_1 });
                                (0, utils_1.printLog)("".concat(options.url));
                                (0, utils_1.printLog)("res", result);
                                resolve(result);
                            }
                            else {
                                resolve(res.data);
                            }
                        }
                        catch (e) {
                            (0, utils_1.printLog)('response 解密失败', options.url, e);
                            trackDecrypt(options, res, key);
                            retryRequest(options, resolve, reject);
                        }
                    }
                    else {
                        (0, utils_1.printLog)("".concat(options.url));
                        (0, utils_1.printLog)("res", res.data);
                        resolve(res.data);
                    }
                }
            }, fail: function (res) {
                (0, utils_1.printLog)("".concat(options.url));
                (0, utils_1.printLog)("err", res);
                reject(res);
            } }));
    });
};
function isHttpOrHttps(url) {
    return /^(http:\/\/|https:\/\/)/.test(url);
}
function resetOptions(options) {
    return __awaiter(this, void 0, void 0, function () {
        var _options, code, e_1, code, e_2, code, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _options = JSON.parse(JSON.stringify(options));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    if (!(_options.url == '/v1/passport/account/login_by_credential')) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.login)];
                case 2:
                    code = (_a.sent()).code;
                    _options.data.ext.code = code;
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 5];
                case 5:
                    _a.trys.push([5, 8, , 9]);
                    if (!(_options.url == '/v1/passport/user/sync_info')) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.login)];
                case 6:
                    code = (_a.sent()).code;
                    _options.data.code = code;
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_2 = _a.sent();
                    console.log(e_2);
                    return [3 /*break*/, 9];
                case 9:
                    _a.trys.push([9, 12, , 13]);
                    if (!(_options.url == '/v1/passport/captcha/send_auth')) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, utils_1.asyncFunc)(wx.login)];
                case 10:
                    code = (_a.sent()).code;
                    _options.data.minigame_code = code;
                    _a.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    e_3 = _a.sent();
                    console.log(e_3);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/, _options];
            }
        });
    });
}
// 原有的 doRequest 逻辑（完全保持不变）
function doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS) {
    var _a, _b;
    if (urlIndex === void 0) { urlIndex = 0; }
    if (refreshNum === void 0) { refreshNum = 0; }
    if (enableHttpDNS === void 0) { enableHttpDNS = false; }
    return __awaiter(this, void 0, void 0, function () {
        var path, error, headers, useHttpDNS, enableHttpDNSOptions, url, res, msg, error, e_4, _options, _options, url;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    config_1.SYSTEM_INFO.reqUrlIndex = urlIndex;
                    path = options.url;
                    if (!apiWhiteList.find(function (item) { return options.url.startsWith(item); }) && !config_1.SYSTEM_INFO.SDK_INIT_FINISHED) {
                        (0, utils_1.printLog)('sdk doRequest options: ', JSON.stringify(options));
                        error = {
                            msg: '初始化错误，或未初始化',
                            code: const_1.COMMON_ERROR_CODE.INIT_PARAMS_ERROR,
                            thirdcode: const_1.COMMON_ERROR_CODE.INIT_PARAMS_ERROR,
                            thrdmsg: '初始化错误，或未初始化',
                            url: options.url
                        };
                        return [2 /*return*/, Promise.reject(error)];
                    }
                    headers = getHeaders(path);
                    useHttpDNS = !!config_1.SYSTEM_INFO.httpDNSServiceId && enableHttpDNS;
                    enableHttpDNSOptions = useHttpDNS ? {
                        enableHttpDNS: true,
                        httpDNSServiceId: config_1.SYSTEM_INFO.httpDNSServiceId
                    } : {};
                    if (useHttpDNS) {
                        (0, utils_1.printLog)('---useHttpDNS---');
                        (0, utils_1.printLog)(config_1.SYSTEM_INFO.httpDNSServiceId);
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 8]);
                    url = isHttpOrHttps(path) ? path : config_1.SYSTEM_INFO.baseUrlList[urlIndex] + path;
                    return [4 /*yield*/, myRequest(__assign({ url: url, method: options.method, data: options.data || options.params, header: __assign(__assign({}, headers), (options.header || {}) // 支持合并自定义 header
                            ), enableHttp2: true }, enableHttpDNSOptions))];
                case 2:
                    res = _c.sent();
                    if (res.code == 0) {
                        return [2 /*return*/, Promise.resolve(res)];
                    }
                    if (refreshCode.includes(res.code)) {
                        if (refreshNum === 5) {
                            refreshNum = 0;
                            return [2 /*return*/, Promise.reject({ code: 1000000, msg: 'refresh token failed,please login again' })];
                        }
                        else {
                            refreshNum++;
                            return [2 /*return*/, refreshTokenReq().then(function (refreshRes) { return __awaiter(_this, void 0, void 0, function () {
                                    var _options;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                (0, utils_1.customSetStorageSync)('rxToken', refreshRes.data);
                                                return [4 /*yield*/, resetOptions(options)];
                                            case 1:
                                                _options = _a.sent();
                                                return [2 /*return*/, doRequestOriginal(_options, urlIndex, refreshNum, enableHttpDNS)];
                                        }
                                    });
                                }); })];
                        }
                    }
                    else {
                        msg = res.msg || res.message || res.errorMsg || 'Error';
                        error = new Error(msg);
                        error.code = res.code || const_1.COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR;
                        error.data = res.data || res;
                        error.thirdcode = res.thirdcode;
                        error.thirdmsg = res.thirdmsg;
                        error.client_ip = res.client_ip || '';
                        error.isServerError = true;
                        return [2 /*return*/, Promise.reject(error)];
                    }
                    return [3 /*break*/, 8];
                case 3:
                    e_4 = _c.sent();
                    if (!(urlIndex < config_1.SYSTEM_INFO.baseUrlList.length - 1)) return [3 /*break*/, 5];
                    urlIndex++;
                    return [4 /*yield*/, resetOptions(options)];
                case 4:
                    _options = _c.sent();
                    return [2 /*return*/, doRequestOriginal(_options, urlIndex, refreshNum, enableHttpDNS)];
                case 5:
                    urlIndex = 0;
                    if (!(!enableHttpDNS && (((_a = e_4.errMsg) === null || _a === void 0 ? void 0 : _a.includes('ERR_NAME_NOT_RESOLVED')) || ((_b = e_4.errMsg) === null || _b === void 0 ? void 0 : _b.includes('ERR_CONNECTION_TIMED_OUT'))))) return [3 /*break*/, 7];
                    return [4 /*yield*/, resetOptions(options)];
                case 6:
                    _options = _c.sent();
                    return [2 /*return*/, doRequestOriginal(_options, urlIndex, refreshNum, true)];
                case 7:
                    url = isHttpOrHttps(path) ? path : config_1.SYSTEM_INFO.baseUrlList[urlIndex] + path;
                    return [2 /*return*/, Promise.reject(__assign({ url: url, request_header: headers, request_body: options.data || options.params, code: e_4.code || e_4.errno || const_1.COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR, msg: e_4.msg || e_4.message || e_4.errMsg || 'Error', thirdcode: e_4.thirdcode || e_4.errno || e_4.code || const_1.COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR, thirdmsg: e_4.thirdmsg || e_4.msg || e_4.message || e_4.errMsg || 'Error' }, e_4))];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// 新的 doRequest 函数，添加队列机制（仅在特定条件下）
function doRequest(options, urlIndex, refreshNum, enableHttpDNS) {
    if (urlIndex === void 0) { urlIndex = 0; }
    if (refreshNum === void 0) { refreshNum = 0; }
    if (enableHttpDNS === void 0) { enableHttpDNS = false; }
    return __awaiter(this, void 0, void 0, function () {
        var apiFilter, path_1, needQueue, requestData, queueKey_1, cacheItem, now, cachedResponse, queue_1;
        return __generator(this, function (_a) {
            try {
                apiFilter = ['/v1/ke/user_get_order_info'];
                path_1 = options === null || options === void 0 ? void 0 : options.url;
                needQueue = false;
                try {
                    needQueue = apiFilter.some(function (filter) { var _a; return path_1 && ((_a = path_1 === null || path_1 === void 0 ? void 0 : path_1.includes) === null || _a === void 0 ? void 0 : _a.call(path_1, filter)); });
                }
                catch (error) {
                    // printLog(`[请求队列] 检查是否需要队列管理失败，直接执行原逻辑`, error)
                    return [2 /*return*/, doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)];
                }
                if (needQueue) {
                    try {
                        requestData = options.data || options.params || {};
                        try {
                            queueKey_1 = generateRequestKey(path_1, requestData);
                        }
                        catch (error) {
                            // printLog(`[请求队列] 生成 queueKey 失败，直接执行原逻辑`, error)
                            return [2 /*return*/, doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)];
                        }
                        cacheItem = void 0;
                        try {
                            cacheItem = successResultCache.get(queueKey_1);
                            // printLog(`[请求队列] 检查缓存，queueKey: ${queueKey}, 缓存是否存在: ${!!cacheItem}`)
                        }
                        catch (error) {
                            // printLog(`[请求队列] 检查缓存失败，继续执行队列逻辑`, error)
                        }
                        if (cacheItem) {
                            try {
                                now = Date.now();
                                if (now - cacheItem.timestamp > CACHE_CONFIG.MAX_CACHE_AGE) {
                                    // printLog(`[请求队列] 缓存已过期，清理缓存，queueKey: ${queueKey}`)
                                    try {
                                        successResultCache.delete(queueKey_1);
                                    }
                                    catch (error) {
                                        // printLog(`[请求队列] 删除过期缓存失败`, error)
                                    }
                                }
                                else {
                                    // printLog(`[请求队列] 使用缓存结果，直接返回 code 101（跳过所有队列逻辑），queueKey: ${queueKey}`)
                                    // 直接返回缓存的响应，但 code 改为 101
                                    try {
                                        cachedResponse = __assign(__assign({}, cacheItem.result), { code: 101 });
                                        return [2 /*return*/, Promise.resolve(cachedResponse)];
                                    }
                                    catch (error) {
                                        // printLog(`[请求队列] 构建缓存响应失败，继续执行队列逻辑`, error)
                                    }
                                }
                            }
                            catch (error) {
                                // printLog(`[请求队列] 处理缓存逻辑失败，继续执行队列逻辑`, error)
                            }
                        }
                        try {
                            queue_1 = requestQueueMap.get(queueKey_1);
                            if (!queue_1) {
                                queue_1 = {
                                    isProcessing: false,
                                    queue: []
                                };
                                try {
                                    requestQueueMap.set(queueKey_1, queue_1);
                                    // printLog(`[请求队列] 创建新队列，queueKey: ${queueKey}`)
                                }
                                catch (error) {
                                    //  printLog(`[请求队列] 创建队列失败，直接执行原逻辑`, error)
                                    return [2 /*return*/, doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)];
                                }
                            }
                        }
                        catch (error) {
                            // printLog(`[请求队列] 获取或创建队列失败，直接执行原逻辑`, error)
                            return [2 /*return*/, doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)];
                        }
                        // 如果当前没有正在处理的请求，直接执行
                        if (!queue_1.isProcessing && queue_1.queue.length === 0) {
                            // printLog(`[请求队列] 队列为空，立即执行请求，queueKey: ${queueKey}`)
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    try {
                                        // 立即开始处理
                                        queue_1.isProcessing = true;
                                        var startTime_1 = Date.now();
                                        // 添加超时控制，防止请求卡死
                                        var timeoutPromise = new Promise(function (_, timeoutReject) {
                                            setTimeout(function () { return timeoutReject(new Error('队列请求超时')); }, 30000); // 30秒超时
                                        });
                                        // 调用原有的 doRequest 逻辑
                                        Promise.race([
                                            doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS),
                                            timeoutPromise
                                        ])
                                            .then(function (result) {
                                            try {
                                                var duration = Date.now() - startTime_1;
                                                // printLog(`[请求队列] 请求成功完成，queueKey: ${queueKey}, 耗时: ${duration}ms`)
                                                // 如果请求成功且 data.status > 1，缓存结果
                                                try {
                                                    cacheSuccessResult(queueKey_1, result);
                                                }
                                                catch (error) {
                                                    // printLog(`[请求队列] 缓存结果失败，但不影响请求结果`, error)
                                                }
                                                // 验证缓存是否已设置
                                                try {
                                                    var hasCache = successResultCache.has(queueKey_1);
                                                    // printLog(`[请求队列] 缓存设置完成，queueKey: ${queueKey}, 缓存是否存在: ${hasCache}`)
                                                }
                                                catch (error) {
                                                    // printLog(`[请求队列] 验证缓存失败`, error)
                                                }
                                                resolve(result);
                                                // 在 resolve 之后，确保缓存已设置完成，再处理队列中的下一个请求
                                                try {
                                                    queue_1.isProcessing = false;
                                                    if (queue_1.queue.length > 0) {
                                                        // printLog(`[请求队列] 请求完成，开始处理队列中的下一个请求，queueKey: ${queueKey}, 队列长度: ${queue!.queue.length}`)
                                                        // 处理队列中的下一个请求（缓存已设置，应该能检查到）
                                                        // 使用 setTimeout 防止调用栈溢出
                                                        setTimeout(function () {
                                                            processQueue(queueKey_1).catch(function (err) {
                                                                // printLog(`[请求队列] 处理下一个请求失败`, err)
                                                            });
                                                        }, 0);
                                                    }
                                                    else {
                                                        // 队列为空，删除队列
                                                        // 注意：这里不清空缓存，因为后续可能还有相同参数的请求，缓存会在 processQueue 中所有请求处理完成时清空
                                                        // printLog(`[请求队列] 队列为空，删除队列（保留缓存供后续请求使用），queueKey: ${queueKey}`)
                                                        try {
                                                            requestQueueMap.delete(queueKey_1);
                                                        }
                                                        catch (error) {
                                                            // printLog(`[请求队列] 删除队列失败`, error)
                                                        }
                                                    }
                                                }
                                                catch (error) {
                                                    // printLog(`[请求队列] 处理队列后续逻辑失败`, error)
                                                    // 确保队列状态被重置
                                                    try {
                                                        queue_1.isProcessing = false;
                                                        if (queue_1.queue.length === 0) {
                                                            requestQueueMap.delete(queueKey_1);
                                                        }
                                                    }
                                                    catch (cleanupError) {
                                                        // printLog(`[请求队列] 清理队列状态失败`, cleanupError)
                                                    }
                                                }
                                            }
                                            catch (error) {
                                                // printLog(`[请求队列] 处理请求成功回调失败`, error)
                                                // 确保 reject 被调用
                                                try {
                                                    reject(error);
                                                }
                                                catch (rejectError) {
                                                    // printLog(`[请求队列] reject 失败`, rejectError)
                                                }
                                            }
                                        })
                                            .catch(function (error) {
                                            try {
                                                var duration = Date.now() - startTime_1;
                                                // printLog(`[请求队列] 请求失败，queueKey: ${queueKey}, 耗时: ${duration}ms`, error)
                                                reject(error);
                                                queue_1.isProcessing = false;
                                                // 处理队列中的下一个请求
                                                try {
                                                    if (queue_1.queue.length > 0) {
                                                        // printLog(`[请求队列] 请求失败，继续处理队列中的下一个请求，queueKey: ${queueKey}, 队列长度: ${queue!.queue.length}`)
                                                        // 使用 setTimeout 防止调用栈溢出
                                                        setTimeout(function () {
                                                            processQueue(queueKey_1).catch(function (err) {
                                                                // printLog(`[请求队列] 处理下一个请求失败`, err)
                                                            });
                                                        }, 0);
                                                    }
                                                    else {
                                                        // 队列为空，删除队列
                                                        // 注意：这里不清空缓存，因为后续可能还有相同参数的请求，缓存会在 processQueue 中所有请求处理完成时清空
                                                        // printLog(`[请求队列] 队列为空，删除队列（保留缓存供后续请求使用），queueKey: ${queueKey}`)
                                                        try {
                                                            requestQueueMap.delete(queueKey_1);
                                                        }
                                                        catch (error) {
                                                            // printLog(`[请求队列] 删除队列失败`, error)
                                                        }
                                                    }
                                                }
                                                catch (error) {
                                                    // printLog(`[请求队列] 处理队列后续逻辑失败`, error)
                                                    // 确保队列状态被重置
                                                    try {
                                                        queue_1.isProcessing = false;
                                                        if (queue_1.queue.length === 0) {
                                                            requestQueueMap.delete(queueKey_1);
                                                        }
                                                    }
                                                    catch (cleanupError) {
                                                        // printLog(`[请求队列] 清理队列状态失败`, cleanupError)
                                                    }
                                                }
                                            }
                                            catch (error) {
                                                // printLog(`[请求队列] 处理请求失败回调失败`, error)
                                            }
                                        });
                                    }
                                    catch (error) {
                                        // printLog(`[请求队列] 创建 Promise 失败，直接执行原逻辑`, error)
                                        // 确保队列状态被重置
                                        try {
                                            queue_1.isProcessing = false;
                                        }
                                        catch (cleanupError) {
                                            // printLog(`[请求队列] 重置队列状态失败`, cleanupError)
                                        }
                                        return doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS);
                                    }
                                })];
                        }
                        else {
                            // 有正在处理的请求或队列中有请求，加入队列
                            // 注意：这里不需要再检查缓存，因为已经在上面检查过了
                            // printLog(`[请求队列] 请求加入队列，queueKey: ${queueKey}, 当前队列长度: ${queue.queue.length}, 是否正在处理: ${queue.isProcessing}`)
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    try {
                                        queue_1.queue.push({
                                            resolve: resolve,
                                            reject: reject,
                                            options: options,
                                            urlIndex: urlIndex,
                                            refreshNum: refreshNum,
                                            enableHttpDNS: enableHttpDNS
                                        });
                                        // printLog(`[请求队列] 请求已加入队列，queueKey: ${queueKey}, 队列长度: ${queue!.queue.length}`)
                                        // 如果当前没有正在处理，开始处理队列
                                        if (!queue_1.isProcessing) {
                                            // printLog(`[请求队列] 开始处理队列，queueKey: ${queueKey}`)
                                            // 使用 setTimeout 防止调用栈溢出
                                            setTimeout(function () {
                                                processQueue(queueKey_1).catch(function (err) {
                                                    // printLog(`[请求队列] 处理队列失败`, err)
                                                    // 如果处理失败，确保队列状态被重置
                                                    try {
                                                        var failedQueue = requestQueueMap.get(queueKey_1);
                                                        if (failedQueue) {
                                                            failedQueue.isProcessing = false;
                                                        }
                                                    }
                                                    catch (cleanupError) {
                                                        // printLog(`[请求队列] 清理失败队列状态失败`, cleanupError)
                                                    }
                                                });
                                            }, 0);
                                        }
                                    }
                                    catch (error) {
                                        // printLog(`[请求队列] 加入队列失败，直接执行原逻辑`, error)
                                        // 如果加入队列失败，直接执行原逻辑
                                        doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)
                                            .then(resolve)
                                            .catch(reject);
                                    }
                                })];
                        }
                    }
                    catch (error) {
                        // 队列处理逻辑发生异常，直接执行原逻辑，不影响其他功能
                        // printLog(`[请求队列] 队列处理逻辑异常，直接执行原逻辑`, error)
                        return [2 /*return*/, doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)];
                    }
                }
            }
            catch (error) {
                // 最外层异常捕获，确保不影响其他功能
                // printLog(`[请求队列] doRequest 执行异常，直接执行原逻辑`, error)
                return [2 /*return*/, doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)];
            }
            // 不在 apiFilter 中的请求，直接执行原有逻辑（完全不受影响）
            return [2 /*return*/, doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)];
        });
    });
}
exports.doRequest = doRequest;
// 清理所有残留的队列和缓存（用于调试和清理）
function clearAllQueuesAndCache() {
    try {
        var queueCount = requestQueueMap.size;
        var cacheCount = successResultCache.size;
        requestQueueMap.clear();
        successResultCache.clear();
        // printLog(`[请求队列] 清理所有队列和缓存，队列数量: ${queueCount}, 缓存数量: ${cacheCount}`)
    }
    catch (error) {
    }
}
exports.clearAllQueuesAndCache = clearAllQueuesAndCache;
//# sourceMappingURL=request.js.map