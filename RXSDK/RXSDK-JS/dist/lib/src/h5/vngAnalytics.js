"use strict";
/**
 * VNGGamesSDK Analytics API 封装
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VNGAnalytics = exports.VNGAnalyticsEventType = void 0;
/**
 * Analytics 事件类型枚举
 */
var VNGAnalyticsEventType;
(function (VNGAnalyticsEventType) {
    // 游戏初始首屏
    VNGAnalyticsEventType["SHOW_FIRST_FRAME_LOAD"] = "showFirstFrameLoad";
    // 配置相关
    VNGAnalyticsEventType["REG_GET_CONFIGURATION"] = "regGetConfiguration";
    VNGAnalyticsEventType["REG_CHECK_CONFIGURATION_START"] = "regCheckConfigurationStart";
    VNGAnalyticsEventType["REG_CHECK_CONFIGURATION_END"] = "regCheckConfigurationEnd";
    // CDN 下载相关
    VNGAnalyticsEventType["REG_CDN_DOWNLOAD_START"] = "regCDNDownloadStart";
    VNGAnalyticsEventType["REG_CDN_DOWNLOAD_25"] = "regCDNDownload25";
    VNGAnalyticsEventType["REG_CDN_DOWNLOAD_50"] = "regCDNDownload50";
    VNGAnalyticsEventType["REG_CDN_DOWNLOAD_75"] = "regCDNDownload75";
    VNGAnalyticsEventType["REG_CDN_DOWNLOAD_FINISH"] = "regCDNDownloadFinish";
    // 资源提取相关
    VNGAnalyticsEventType["REG_EXTRACT_RESOURCE_START"] = "regExtractResourceStart";
    VNGAnalyticsEventType["REG_EXTRACT_RESOURCE_END"] = "regExtractResourceEnd";
    // 新用户相关
    VNGAnalyticsEventType["NRU_CREATE_ROLE_SUCCESS"] = "nruCreateRoleSuccess";
    VNGAnalyticsEventType["NRU_TUTORIAL_START"] = "nruTutorialStart";
    VNGAnalyticsEventType["NRU_TUTORIAL_PROGRESS"] = "nruTutorialProgress";
    VNGAnalyticsEventType["NRU_TUTORIAL_PROGRESS_FINISH"] = "nruTutorialProgressFinish";
    // 玩家相关
    VNGAnalyticsEventType["MDA_LEVEL_UP"] = "mdaLevelUp";
    VNGAnalyticsEventType["PLAYING_TIME_TRACK"] = "playingTimeTrack";
    // 内购相关
    VNGAnalyticsEventType["IAP_OPEN_SHOP"] = "iapOpenShop";
    VNGAnalyticsEventType["IAP_CLICK_TO_BUY_ITEM"] = "iapClickToBuyItem";
    VNGAnalyticsEventType["IAP_PURCHASED_ITEM"] = "iapPurchasedItem";
    VNGAnalyticsEventType["IAP_VIP_LEVEL_UP"] = "iapVipLevelUp";
    VNGAnalyticsEventType["IAP_BUY_VIP_REWARD_LEVEL"] = "iapBuyVipRewardLevel";
    // 登录奖励相关
    VNGAnalyticsEventType["CLAIM_REWARD_DAY_1"] = "claimRewardDay1";
    VNGAnalyticsEventType["CLAIM_REWARD_DAY_2"] = "claimRewardDay2";
    VNGAnalyticsEventType["CLAIM_REWARD_DAY_3"] = "claimRewardDay3";
    VNGAnalyticsEventType["CLAIM_REWARD_DAY_4"] = "claimRewardDay4";
    VNGAnalyticsEventType["CLAIM_REWARD_DAY_5"] = "claimRewardDay5";
    VNGAnalyticsEventType["CLAIM_REWARD_DAY_6"] = "claimRewardDay6";
    VNGAnalyticsEventType["CLAIM_REWARD_DAY_7"] = "claimRewardDay7";
    // 游戏关卡
    VNGAnalyticsEventType["COMPLETE_STAGE"] = "completeStage";
    // 自定义事件
    VNGAnalyticsEventType["TRACK_CUSTOM_EVENT"] = "trackCustomEvent";
})(VNGAnalyticsEventType = exports.VNGAnalyticsEventType || (exports.VNGAnalyticsEventType = {}));
/**
 * VNGGamesSDK Analytics API 封装类
 */
var VNGAnalytics = /** @class */ (function () {
    function VNGAnalytics() {
    }
    /**
     * 检查 VNGGamesSDK 是否可用
     */
    VNGAnalytics.checkSDKAvailable = function () {
        if (typeof window === 'undefined') {
            return false;
        }
        var sdk = window.top.VNGGamesSDK;
        // 确保返回布尔值，而不是 undefined
        var result = !!(sdk && sdk.Analytics);
        return result;
    };
    /**
     * 打印方法调用信息（公共方法）
     */
    VNGAnalytics.logMethodCall = function (methodName, params, analytics) {
        var _a;
        try {
            var fullMethodPath = "window.VNGGamesSDK.Analytics.".concat(methodName);
            var windowAnalytics = (_a = window.top.VNGGamesSDK) === null || _a === void 0 ? void 0 : _a.Analytics;
            var methodExists = windowAnalytics && typeof windowAnalytics[methodName] === 'function';
            var methodReference = windowAnalytics === null || windowAnalytics === void 0 ? void 0 : windowAnalytics[methodName];
            var analyticsMethod = analytics[methodName];
            console.log("[VNGAnalytics] \u5B8C\u6574\u65B9\u6CD5\u8DEF\u5F84: ".concat(fullMethodPath));
            console.log("[VNGAnalytics] \u65B9\u6CD5\u662F\u5426\u5B58\u5728:", methodExists);
            console.log("[VNGAnalytics] \u65B9\u6CD5\u5F15\u7528:", methodReference);
            console.log("[VNGAnalytics] analytics.".concat(methodName, " \u5F15\u7528:"), analyticsMethod);
            console.log("[VNGAnalytics] \u65B9\u6CD5\u5F15\u7528\u662F\u5426\u5339\u914D:", analyticsMethod === methodReference);
            console.log("[VNGAnalytics] \u2713 \u65B9\u6CD5\u8C03\u7528\u6210\u529F: ".concat(fullMethodPath));
            console.log("[VNGAnalytics] \u2713 \u8C03\u7528\u53C2\u6570:", params);
        }
        catch (error) {
            console.error("[logMethodCall] Error logging method call:", error);
        }
    };
    /**
     * 安全调用 SDK 方法
     */
    VNGAnalytics.safeCall = function (methodName, callback, params) {
        var _a;
        var isAvailable = this.checkSDKAvailable();
        if (!isAvailable) {
            console.warn("[safeCall] VNGGamesSDK.Analytics is not available. Method: ".concat(methodName));
            return null;
        }
        try {
            var analytics = (_a = window.top.VNGGamesSDK) === null || _a === void 0 ? void 0 : _a.Analytics;
            if (!analytics) {
                console.warn("[safeCall] VNGGamesSDK.Analytics is not available. Method: ".concat(methodName));
                return null;
            }
            var result = callback(analytics);
            // 调用完成后打印方法名称和参数
            if (params !== undefined) {
                this.logMethodCall(methodName, params, analytics);
            }
            return result;
        }
        catch (error) {
            console.error("[safeCall] Error calling VNGGamesSDK.Analytics.".concat(methodName, ":"), error);
            return null;
        }
    };
    /**
     * Game initial first screen
     * 游戏初始首屏
     */
    VNGAnalytics.showFirstFrameLoad = function (params) {
        try {
            var callParams_1 = {
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('showFirstFrameLoad', function (analytics) {
                analytics.showFirstFrameLoad(callParams_1);
            }, callParams_1);
        }
        catch (error) {
            console.error('Error in showFirstFrameLoad:', error);
        }
    };
    /**
     * Get Config
     * 获取配置
     */
    VNGAnalytics.regGetConfiguration = function (params) {
        try {
            var callParams_2 = {
                free_ram_size: params === null || params === void 0 ? void 0 : params.free_ram_size,
                total_ram_size: params === null || params === void 0 ? void 0 : params.total_ram_size,
                free_disk_size: params === null || params === void 0 ? void 0 : params.free_disk_size,
                total_disk_size: params === null || params === void 0 ? void 0 : params.total_disk_size,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('regGetConfiguration', function (analytics) {
                analytics.regGetConfiguration(callParams_2);
            }, callParams_2);
        }
        catch (error) {
            console.error('Error in regGetConfiguration:', error);
        }
    };
    /**
     * Check Config Start
     * 检查配置开始
     */
    VNGAnalytics.regCheckConfigurationStart = function (params) {
        try {
            var callParams_3 = {
                free_ram_size: params === null || params === void 0 ? void 0 : params.free_ram_size,
                total_ram_size: params === null || params === void 0 ? void 0 : params.total_ram_size,
                free_disk_size: params === null || params === void 0 ? void 0 : params.free_disk_size,
                total_disk_size: params === null || params === void 0 ? void 0 : params.total_disk_size,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('regCheckConfigurationStart', function (analytics) {
                analytics.regCheckConfigurationStart(callParams_3);
            }, callParams_3);
        }
        catch (error) {
            console.error('Error in regCheckConfigurationStart:', error);
        }
    };
    /**
     * Check Config Finish
     * 检查配置完成
     */
    VNGAnalytics.regCheckConfigurationEnd = function (params) {
        try {
            var callParams_4 = {
                free_ram_size: params === null || params === void 0 ? void 0 : params.free_ram_size,
                total_ram_size: params === null || params === void 0 ? void 0 : params.total_ram_size,
                free_disk_size: params === null || params === void 0 ? void 0 : params.free_disk_size,
                total_disk_size: params === null || params === void 0 ? void 0 : params.total_disk_size,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('regCheckConfigurationEnd', function (analytics) {
                analytics.regCheckConfigurationEnd(callParams_4);
            }, callParams_4);
        }
        catch (error) {
            console.error('Error in regCheckConfigurationEnd:', error);
        }
    };
    /**
     * CDN Download Start
     * CDN 下载开始
     */
    VNGAnalytics.regCDNDownloadStart = function (params) {
        try {
            var callParams_5 = {
                free_ram_size: params === null || params === void 0 ? void 0 : params.free_ram_size,
                total_ram_size: params === null || params === void 0 ? void 0 : params.total_ram_size,
                free_disk_size: params === null || params === void 0 ? void 0 : params.free_disk_size,
                total_disk_size: params === null || params === void 0 ? void 0 : params.total_disk_size,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
                size: params === null || params === void 0 ? void 0 : params.size,
            };
            this.safeCall('regCDNDownloadStart', function (analytics) {
                analytics.regCDNDownloadStart(callParams_5);
            }, callParams_5);
        }
        catch (error) {
            console.error('Error in regCDNDownloadStart:', error);
        }
    };
    /**
     * CDN Download Progress 25%
     * CDN 下载进度 25%
     */
    VNGAnalytics.regCDNDownload25 = function (params) {
        try {
            var callParams_6 = {
                free_ram_size: params === null || params === void 0 ? void 0 : params.free_ram_size,
                total_ram_size: params === null || params === void 0 ? void 0 : params.total_ram_size,
                free_disk_size: params === null || params === void 0 ? void 0 : params.free_disk_size,
                total_disk_size: params === null || params === void 0 ? void 0 : params.total_disk_size,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
                size: params === null || params === void 0 ? void 0 : params.size,
            };
            this.safeCall('regCDNDownload25', function (analytics) {
                analytics.regCDNDownload25(callParams_6);
            }, callParams_6);
        }
        catch (error) {
            console.error('Error in regCDNDownload25:', error);
        }
    };
    /**
     * CDN Download Progress 50%
     * CDN 下载进度 50%
     */
    VNGAnalytics.regCDNDownload50 = function (params) {
        try {
            var callParams_7 = {
                free_ram_size: params === null || params === void 0 ? void 0 : params.free_ram_size,
                total_ram_size: params === null || params === void 0 ? void 0 : params.total_ram_size,
                free_disk_size: params === null || params === void 0 ? void 0 : params.free_disk_size,
                total_disk_size: params === null || params === void 0 ? void 0 : params.total_disk_size,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
                size: params === null || params === void 0 ? void 0 : params.size,
            };
            this.safeCall('regCDNDownload50', function (analytics) {
                analytics.regCDNDownload50(callParams_7);
            }, callParams_7);
        }
        catch (error) {
            console.error('Error in regCDNDownload50:', error);
        }
    };
    /**
     * CDN Download Progress 75%
     * CDN 下载进度 75%
     */
    VNGAnalytics.regCDNDownload75 = function (params) {
        try {
            var callParams_8 = {
                free_ram_size: params === null || params === void 0 ? void 0 : params.free_ram_size,
                total_ram_size: params === null || params === void 0 ? void 0 : params.total_ram_size,
                free_disk_size: params === null || params === void 0 ? void 0 : params.free_disk_size,
                total_disk_size: params === null || params === void 0 ? void 0 : params.total_disk_size,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
                size: params === null || params === void 0 ? void 0 : params.size,
            };
            this.safeCall('regCDNDownload75', function (analytics) {
                analytics.regCDNDownload75(callParams_8);
            }, callParams_8);
        }
        catch (error) {
            console.error('Error in regCDNDownload75:', error);
        }
    };
    /**
     * CDN Download Finish
     * CDN 下载完成
     */
    VNGAnalytics.regCDNDownloadFinish = function (params) {
        try {
            var callParams_9 = {
                free_ram_size: params === null || params === void 0 ? void 0 : params.free_ram_size,
                total_ram_size: params === null || params === void 0 ? void 0 : params.total_ram_size,
                free_disk_size: params === null || params === void 0 ? void 0 : params.free_disk_size,
                total_disk_size: params === null || params === void 0 ? void 0 : params.total_disk_size,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
                size: params === null || params === void 0 ? void 0 : params.size,
            };
            this.safeCall('regCDNDownloadFinish', function (analytics) {
                analytics.regCDNDownloadFinish(callParams_9);
            }, callParams_9);
        }
        catch (error) {
            console.error('Error in regCDNDownloadFinish:', error);
        }
    };
    /**
     * Extract Resources Start
     * 提取资源开始
     */
    VNGAnalytics.regExtractResourceStart = function (params) {
        try {
            var callParams_10 = {
                free_ram_size: params === null || params === void 0 ? void 0 : params.free_ram_size,
                total_ram_size: params === null || params === void 0 ? void 0 : params.total_ram_size,
                free_disk_size: params === null || params === void 0 ? void 0 : params.free_disk_size,
                total_disk_size: params === null || params === void 0 ? void 0 : params.total_disk_size,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
                size: params === null || params === void 0 ? void 0 : params.size,
            };
            this.safeCall('regExtractResourceStart', function (analytics) {
                analytics.regExtractResourceStart(callParams_10);
            }, callParams_10);
        }
        catch (error) {
            console.error('Error in regExtractResourceStart:', error);
        }
    };
    /**
     * Extract Resources Finish
     * 提取资源完成
     */
    VNGAnalytics.regExtractResourceEnd = function (params) {
        try {
            var callParams_11 = {
                free_ram_size: params === null || params === void 0 ? void 0 : params.free_ram_size,
                total_ram_size: params === null || params === void 0 ? void 0 : params.total_ram_size,
                free_disk_size: params === null || params === void 0 ? void 0 : params.free_disk_size,
                total_disk_size: params === null || params === void 0 ? void 0 : params.total_disk_size,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
                size: params === null || params === void 0 ? void 0 : params.size,
            };
            this.safeCall('regExtractResourceEnd', function (analytics) {
                analytics.regExtractResourceEnd(callParams_11);
            }, callParams_11);
        }
        catch (error) {
            console.error('Error in regExtractResourceEnd:', error);
        }
    };
    /**
     * Create Role Success
     * 创建角色成功
     */
    VNGAnalytics.nruCreateRoleSuccess = function (params) {
        try {
            var callParams_12 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('nruCreateRoleSuccess', function (analytics) {
                analytics.nruCreateRoleSuccess(callParams_12);
            }, callParams_12);
        }
        catch (error) {
            console.error('Error in nruCreateRoleSuccess:', error);
        }
    };
    /**
     * Tutorial Start
     * 教程开始
     */
    VNGAnalytics.nruTutorialStart = function (params) {
        try {
            var callParams_13 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('nruTutorialStart', function (analytics) {
                analytics.nruTutorialStart(callParams_13);
            }, callParams_13);
        }
        catch (error) {
            console.error('Error in nruTutorialStart:', error);
        }
    };
    /**
     * Tutorial Progress
     * 教程进度
     */
    VNGAnalytics.nruTutorialProgress = function (params) {
        try {
            var callParams_14 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                step: params === null || params === void 0 ? void 0 : params.step,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('nruTutorialProgress', function (analytics) {
                analytics.nruTutorialProgress(callParams_14);
            }, callParams_14);
        }
        catch (error) {
            console.error('Error in nruTutorialProgress:', error);
        }
    };
    /**
     * Tutorial Finish
     * 教程完成
     */
    VNGAnalytics.nruTutorialProgressFinish = function (params) {
        try {
            var callParams_15 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                step: params === null || params === void 0 ? void 0 : params.step,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('nruTutorialProgressFinish', function (analytics) {
                analytics.nruTutorialProgressFinish(callParams_15);
            }, callParams_15);
        }
        catch (error) {
            console.error('Error in nruTutorialProgressFinish:', error);
        }
    };
    /**
     * Player level up
     * 玩家升级
     */
    VNGAnalytics.mdaLevelUp = function (params) {
        try {
            var callParams_16 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                current_level: params === null || params === void 0 ? void 0 : params.current_level,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('mdaLevelUp', function (analytics) {
                analytics.mdaLevelUp(callParams_16);
            }, callParams_16);
        }
        catch (error) {
            console.error('Error in mdaLevelUp:', error);
        }
    };
    /**
     * Game Playing Time
     * 游戏时长追踪
     */
    VNGAnalytics.playingTimeTrack = function (params) {
        try {
            var callParams_17 = {
                minutes: params === null || params === void 0 ? void 0 : params.minutes,
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('playingTimeTrack', function (analytics) {
                analytics.playingTimeTrack(callParams_17);
            }, callParams_17);
        }
        catch (error) {
            console.error('Error in playingTimeTrack:', error);
        }
    };
    /**
     * Open shop
     * 打开商店
     */
    VNGAnalytics.iapOpenShop = function (params) {
        try {
            var callParams_18 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('iapOpenShop', function (analytics) {
                analytics.iapOpenShop(callParams_18);
            }, callParams_18);
        }
        catch (error) {
            console.error('Error in iapOpenShop:', error);
        }
    };
    /**
     * Click on item to buy
     * 点击购买物品
     */
    VNGAnalytics.iapClickToBuyItem = function (params) {
        try {
            var callParams_19 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                item_id: params === null || params === void 0 ? void 0 : params.item_id,
                item_name: params === null || params === void 0 ? void 0 : params.item_name,
                item_price: params === null || params === void 0 ? void 0 : params.item_price,
                currency: params === null || params === void 0 ? void 0 : params.currency,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('iapClickToBuyItem', function (analytics) {
                analytics.iapClickToBuyItem(callParams_19);
            }, callParams_19);
        }
        catch (error) {
            console.error('Error in iapClickToBuyItem:', error);
        }
    };
    /**
     * Purchased
     * 购买物品
     */
    VNGAnalytics.iapPurchasedItem = function (params) {
        try {
            var callParams_20 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                item_id: params === null || params === void 0 ? void 0 : params.item_id,
                item_name: params === null || params === void 0 ? void 0 : params.item_name,
                item_price: params === null || params === void 0 ? void 0 : params.item_price,
                currency: params === null || params === void 0 ? void 0 : params.currency,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('iapPurchasedItem', function (analytics) {
                analytics.iapPurchasedItem(callParams_20);
            }, callParams_20);
        }
        catch (error) {
            console.error('Error in iapPurchasedItem:', error);
        }
    };
    /**
     * VIP level up
     * VIP 升级
     */
    VNGAnalytics.iapVipLevelUp = function (params) {
        try {
            var callParams_21 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                current_vip_level: params === null || params === void 0 ? void 0 : params.current_vip_level,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('iapVipLevelUp', function (analytics) {
                analytics.iapVipLevelUp(callParams_21);
            }, callParams_21);
        }
        catch (error) {
            console.error('Error in iapVipLevelUp:', error);
        }
    };
    /**
     * Buy VIP reward
     * 购买 VIP 奖励
     */
    VNGAnalytics.iapBuyVipRewardLevel = function (params) {
        try {
            var callParams_22 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                item_id: params === null || params === void 0 ? void 0 : params.item_id,
                item_name: params === null || params === void 0 ? void 0 : params.item_name,
                item_price: params === null || params === void 0 ? void 0 : params.item_price,
                currency: params === null || params === void 0 ? void 0 : params.currency,
                item_vip_level: params === null || params === void 0 ? void 0 : params.item_vip_level,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('iapBuyVipRewardLevel', function (analytics) {
                analytics.iapBuyVipRewardLevel(callParams_22);
            }, callParams_22);
        }
        catch (error) {
            console.error('Error in iapBuyVipRewardLevel:', error);
        }
    };
    /**
     * Login Claim Reward Day 1
     * 登录领取奖励第 1 天
     */
    VNGAnalytics.claimRewardDay1 = function (params) {
        try {
            var callParams_23 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                day: params === null || params === void 0 ? void 0 : params.day,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('claimRewardDay1', function (analytics) {
                analytics.claimRewardDay1(callParams_23);
            }, callParams_23);
        }
        catch (error) {
            console.error('Error in claimRewardDay1:', error);
        }
    };
    /**
     * Login Claim Reward Day 2
     * 登录领取奖励第 2 天
     */
    VNGAnalytics.claimRewardDay2 = function (params) {
        try {
            var callParams_24 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                day: params === null || params === void 0 ? void 0 : params.day,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('claimRewardDay2', function (analytics) {
                analytics.claimRewardDay2(callParams_24);
            }, callParams_24);
        }
        catch (error) {
            console.error('Error in claimRewardDay2:', error);
        }
    };
    /**
     * Login Claim Reward Day 3
     * 登录领取奖励第 3 天
     */
    VNGAnalytics.claimRewardDay3 = function (params) {
        try {
            var callParams_25 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                day: params === null || params === void 0 ? void 0 : params.day,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('claimRewardDay3', function (analytics) {
                analytics.claimRewardDay3(callParams_25);
            }, callParams_25);
        }
        catch (error) {
            console.error('Error in claimRewardDay3:', error);
        }
    };
    /**
     * Login Claim Reward Day 4
     * 登录领取奖励第 4 天
     */
    VNGAnalytics.claimRewardDay4 = function (params) {
        try {
            var callParams_26 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                day: params === null || params === void 0 ? void 0 : params.day,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('claimRewardDay4', function (analytics) {
                analytics.claimRewardDay4(callParams_26);
            }, callParams_26);
        }
        catch (error) {
            console.error('Error in claimRewardDay4:', error);
        }
    };
    /**
     * Login Claim Reward Day 5
     * 登录领取奖励第 5 天
     */
    VNGAnalytics.claimRewardDay5 = function (params) {
        try {
            var callParams_27 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                day: params === null || params === void 0 ? void 0 : params.day,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('claimRewardDay5', function (analytics) {
                analytics.claimRewardDay5(callParams_27);
            }, callParams_27);
        }
        catch (error) {
            console.error('Error in claimRewardDay5:', error);
        }
    };
    /**
     * Login Claim Reward Day 6
     * 登录领取奖励第 6 天
     */
    VNGAnalytics.claimRewardDay6 = function (params) {
        try {
            var callParams_28 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                day: params === null || params === void 0 ? void 0 : params.day,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('claimRewardDay6', function (analytics) {
                analytics.claimRewardDay6(callParams_28);
            }, callParams_28);
        }
        catch (error) {
            console.error('Error in claimRewardDay6:', error);
        }
    };
    /**
     * Login Claim Reward Day 7
     * 登录领取奖励第 7 天
     */
    VNGAnalytics.claimRewardDay7 = function (params) {
        try {
            var callParams_29 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                day: params === null || params === void 0 ? void 0 : params.day,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('claimRewardDay7', function (analytics) {
                analytics.claimRewardDay7(callParams_29);
            }, callParams_29);
        }
        catch (error) {
            console.error('Error in claimRewardDay7:', error);
        }
    };
    /**
     * Game Stage
     * 完成关卡
     */
    VNGAnalytics.completeStage = function (params) {
        try {
            var callParams_30 = {
                role_id: params === null || params === void 0 ? void 0 : params.role_id,
                server_id: params === null || params === void 0 ? void 0 : params.server_id,
                stage: params === null || params === void 0 ? void 0 : params.stage,
                extra_data: (params === null || params === void 0 ? void 0 : params.extra_data) || '',
            };
            this.safeCall('completeStage', function (analytics) {
                analytics.completeStage(callParams_30);
            }, callParams_30);
        }
        catch (error) {
            console.error('Error in completeStage:', error);
        }
    };
    /**
     * Send event custom
     * 发送自定义事件
     */
    VNGAnalytics.trackCustomEvent = function (event_name, params) {
        try {
            var callParams = __assign({ event_name: event_name }, params);
            this.safeCall('trackCustomEvent', function (analytics) {
                analytics.trackCustomEvent(event_name, params);
            }, callParams);
        }
        catch (error) {
            console.error('Error in trackCustomEvent:', error);
        }
    };
    /**
     * 统一的事件追踪方法
     * 根据事件类型自动匹配对应的分析方法
     *
     * @example
     * ```typescript
     * // 创建角色成功
     * VNGAnalytics.track({
     *   type: VNGAnalyticsEventType.NRU_CREATE_ROLE_SUCCESS,
     *   params: {
     *     role_id: '123456',
     *     server_id: '1',
     *     extra_data: ''
     *   }
     * })
     *
     * ```
     */
    VNGAnalytics.track = function (event) {
        try {
            switch (event.type) {
                case VNGAnalyticsEventType.SHOW_FIRST_FRAME_LOAD:
                    this.showFirstFrameLoad(event.params);
                    break;
                case VNGAnalyticsEventType.REG_GET_CONFIGURATION:
                    this.regGetConfiguration(event.params);
                    break;
                case VNGAnalyticsEventType.REG_CHECK_CONFIGURATION_START:
                    this.regCheckConfigurationStart(event.params);
                    break;
                case VNGAnalyticsEventType.REG_CHECK_CONFIGURATION_END:
                    this.regCheckConfigurationEnd(event.params);
                    break;
                case VNGAnalyticsEventType.REG_CDN_DOWNLOAD_START:
                    this.regCDNDownloadStart(event.params);
                    break;
                case VNGAnalyticsEventType.REG_CDN_DOWNLOAD_25:
                    this.regCDNDownload25(event.params);
                    break;
                case VNGAnalyticsEventType.REG_CDN_DOWNLOAD_50:
                    this.regCDNDownload50(event.params);
                    break;
                case VNGAnalyticsEventType.REG_CDN_DOWNLOAD_75:
                    this.regCDNDownload75(event.params);
                    break;
                case VNGAnalyticsEventType.REG_CDN_DOWNLOAD_FINISH:
                    this.regCDNDownloadFinish(event.params);
                    break;
                case VNGAnalyticsEventType.REG_EXTRACT_RESOURCE_START:
                    this.regExtractResourceStart(event.params);
                    break;
                case VNGAnalyticsEventType.REG_EXTRACT_RESOURCE_END:
                    this.regExtractResourceEnd(event.params);
                    break;
                case VNGAnalyticsEventType.NRU_CREATE_ROLE_SUCCESS:
                    this.nruCreateRoleSuccess(event.params);
                    break;
                case VNGAnalyticsEventType.NRU_TUTORIAL_START:
                    this.nruTutorialStart(event.params);
                    break;
                case VNGAnalyticsEventType.NRU_TUTORIAL_PROGRESS:
                    this.nruTutorialProgress(event.params);
                    break;
                case VNGAnalyticsEventType.NRU_TUTORIAL_PROGRESS_FINISH:
                    this.nruTutorialProgressFinish(event.params);
                    break;
                case VNGAnalyticsEventType.MDA_LEVEL_UP:
                    this.mdaLevelUp(event.params);
                    break;
                case VNGAnalyticsEventType.PLAYING_TIME_TRACK:
                    this.playingTimeTrack(event.params);
                    break;
                case VNGAnalyticsEventType.IAP_OPEN_SHOP:
                    this.iapOpenShop(event.params);
                    break;
                case VNGAnalyticsEventType.IAP_CLICK_TO_BUY_ITEM:
                    this.iapClickToBuyItem(event.params);
                    break;
                case VNGAnalyticsEventType.IAP_PURCHASED_ITEM:
                    this.iapPurchasedItem(event.params);
                    break;
                case VNGAnalyticsEventType.IAP_VIP_LEVEL_UP:
                    this.iapVipLevelUp(event.params);
                    break;
                case VNGAnalyticsEventType.IAP_BUY_VIP_REWARD_LEVEL:
                    this.iapBuyVipRewardLevel(event.params);
                    break;
                case VNGAnalyticsEventType.CLAIM_REWARD_DAY_1:
                    this.claimRewardDay1(event.params);
                    break;
                case VNGAnalyticsEventType.CLAIM_REWARD_DAY_2:
                    this.claimRewardDay2(event.params);
                    break;
                case VNGAnalyticsEventType.CLAIM_REWARD_DAY_3:
                    this.claimRewardDay3(event.params);
                    break;
                case VNGAnalyticsEventType.CLAIM_REWARD_DAY_4:
                    this.claimRewardDay4(event.params);
                    break;
                case VNGAnalyticsEventType.CLAIM_REWARD_DAY_5:
                    this.claimRewardDay5(event.params);
                    break;
                case VNGAnalyticsEventType.CLAIM_REWARD_DAY_6:
                    this.claimRewardDay6(event.params);
                    break;
                case VNGAnalyticsEventType.CLAIM_REWARD_DAY_7:
                    this.claimRewardDay7(event.params);
                    break;
                case VNGAnalyticsEventType.COMPLETE_STAGE:
                    this.completeStage(event.params);
                    break;
                case VNGAnalyticsEventType.TRACK_CUSTOM_EVENT:
                    var _a = event.params, event_name = _a.event_name, customParams = __rest(_a, ["event_name"]);
                    this.trackCustomEvent(event_name, customParams);
                    break;
                default:
                    console.warn("Unknown analytics event type: ".concat(event.type));
            }
        }
        catch (error) {
            console.error('Error in track:', error);
        }
    };
    return VNGAnalytics;
}());
exports.VNGAnalytics = VNGAnalytics;
exports.default = VNGAnalytics;
//# sourceMappingURL=vngAnalytics.js.map