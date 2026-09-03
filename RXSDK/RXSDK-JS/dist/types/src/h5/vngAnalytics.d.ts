/**
 * VNGGamesSDK Analytics API 封装
 */
/**
 * 设备信息参数（可选）
 */
export interface DeviceInfoParams {
    free_ram_size?: string;
    total_ram_size?: string;
    free_disk_size?: string;
    total_disk_size?: string;
    extra_data?: Record<string, any>;
}
/**
 * 游戏初始首屏参数
 */
export interface ShowFirstFrameLoadParams {
    extra_data?: string;
}
/**
 * 获取配置参数
 */
export interface RegGetConfigurationParams extends DeviceInfoParams {
}
/**
 * 检查配置开始参数
 */
export interface RegCheckConfigurationStartParams extends DeviceInfoParams {
}
/**
 * 检查配置结束参数
 */
export interface RegCheckConfigurationEndParams extends DeviceInfoParams {
}
/**
 * CDN 下载开始参数
 */
export interface RegCDNDownloadStartParams extends DeviceInfoParams {
    size?: string;
}
/**
 * CDN 下载进度参数
 */
export interface RegCDNDownloadProgressParams extends DeviceInfoParams {
    size?: string;
}
/**
 * CDN 下载完成参数
 */
export interface RegCDNDownloadFinishParams extends DeviceInfoParams {
    size?: string;
}
/**
 * 提取资源开始参数
 */
export interface RegExtractResourceStartParams extends DeviceInfoParams {
    size?: string;
}
/**
 * 提取资源结束参数
 */
export interface RegExtractResourceEndParams extends DeviceInfoParams {
    size?: string;
}
/**
 * 创建角色成功参数
 */
export interface NruCreateRoleSuccessParams {
    role_id: string;
    server_id: string;
    extra_data?: string;
}
/**
 * 教程开始参数
 */
export interface NruTutorialStartParams {
    role_id: string;
    server_id: string;
    extra_data?: string;
}
/**
 * 教程进度参数
 */
export interface NruTutorialProgressParams {
    role_id: string;
    server_id: string;
    step: string;
    extra_data?: string;
}
/**
 * 教程完成参数
 */
export interface NruTutorialProgressFinishParams {
    role_id: string;
    server_id: string;
    step: string;
    extra_data?: string;
}
/**
 * 玩家升级参数
 */
export interface MdaLevelUpParams {
    role_id: string;
    server_id: string;
    current_level: string;
    extra_data?: string;
}
/**
 * 游戏时长追踪参数
 */
export interface PlayingTimeTrackParams {
    minutes: string;
    role_id: string;
    server_id: string;
    extra_data?: string;
}
/**
 * 打开商店参数
 */
export interface IapOpenShopParams {
    role_id: string;
    server_id: string;
    extra_data?: string;
}
/**
 * 点击购买物品参数
 */
export interface IapClickToBuyItemParams {
    role_id: string;
    server_id: string;
    item_id: string;
    item_name: string;
    item_price: string;
    currency: string;
    extra_data?: string;
}
/**
 * 购买物品参数
 */
export interface IapPurchasedItemParams {
    role_id: string;
    server_id: string;
    item_id: string;
    item_name: string;
    item_price: string;
    currency: string;
    extra_data?: string;
}
/**
 * VIP 升级参数
 */
export interface IapVipLevelUpParams {
    role_id: string;
    server_id: string;
    current_vip_level: string;
    extra_data?: string;
}
/**
 * 购买 VIP 奖励参数
 */
export interface IapBuyVipRewardLevelParams {
    role_id: string;
    server_id: string;
    item_id: string;
    item_name: string;
    item_price: string;
    currency: string;
    item_vip_level: string;
    extra_data?: string;
}
/**
 * 登录领取奖励参数
 */
export interface ClaimRewardParams {
    role_id: string;
    server_id: string;
    day: string;
    extra_data?: string;
}
/**
 * 完成关卡参数
 */
export interface CompleteStageParams {
    role_id: string;
    server_id: string;
    stage: string;
    extra_data?: string;
}
/**
 * Analytics 事件类型枚举
 */
export declare enum VNGAnalyticsEventType {
    SHOW_FIRST_FRAME_LOAD = "showFirstFrameLoad",
    REG_GET_CONFIGURATION = "regGetConfiguration",
    REG_CHECK_CONFIGURATION_START = "regCheckConfigurationStart",
    REG_CHECK_CONFIGURATION_END = "regCheckConfigurationEnd",
    REG_CDN_DOWNLOAD_START = "regCDNDownloadStart",
    REG_CDN_DOWNLOAD_25 = "regCDNDownload25",
    REG_CDN_DOWNLOAD_50 = "regCDNDownload50",
    REG_CDN_DOWNLOAD_75 = "regCDNDownload75",
    REG_CDN_DOWNLOAD_FINISH = "regCDNDownloadFinish",
    REG_EXTRACT_RESOURCE_START = "regExtractResourceStart",
    REG_EXTRACT_RESOURCE_END = "regExtractResourceEnd",
    NRU_CREATE_ROLE_SUCCESS = "nruCreateRoleSuccess",
    NRU_TUTORIAL_START = "nruTutorialStart",
    NRU_TUTORIAL_PROGRESS = "nruTutorialProgress",
    NRU_TUTORIAL_PROGRESS_FINISH = "nruTutorialProgressFinish",
    MDA_LEVEL_UP = "mdaLevelUp",
    PLAYING_TIME_TRACK = "playingTimeTrack",
    IAP_OPEN_SHOP = "iapOpenShop",
    IAP_CLICK_TO_BUY_ITEM = "iapClickToBuyItem",
    IAP_PURCHASED_ITEM = "iapPurchasedItem",
    IAP_VIP_LEVEL_UP = "iapVipLevelUp",
    IAP_BUY_VIP_REWARD_LEVEL = "iapBuyVipRewardLevel",
    CLAIM_REWARD_DAY_1 = "claimRewardDay1",
    CLAIM_REWARD_DAY_2 = "claimRewardDay2",
    CLAIM_REWARD_DAY_3 = "claimRewardDay3",
    CLAIM_REWARD_DAY_4 = "claimRewardDay4",
    CLAIM_REWARD_DAY_5 = "claimRewardDay5",
    CLAIM_REWARD_DAY_6 = "claimRewardDay6",
    CLAIM_REWARD_DAY_7 = "claimRewardDay7",
    COMPLETE_STAGE = "completeStage",
    TRACK_CUSTOM_EVENT = "trackCustomEvent"
}
/**
 * 统一的事件参数类型
 */
export type VNGAnalyticsEventParams = {
    type: VNGAnalyticsEventType.SHOW_FIRST_FRAME_LOAD;
    params: ShowFirstFrameLoadParams;
} | {
    type: VNGAnalyticsEventType.REG_GET_CONFIGURATION;
    params: RegGetConfigurationParams;
} | {
    type: VNGAnalyticsEventType.REG_CHECK_CONFIGURATION_START;
    params: RegCheckConfigurationStartParams;
} | {
    type: VNGAnalyticsEventType.REG_CHECK_CONFIGURATION_END;
    params: RegCheckConfigurationEndParams;
} | {
    type: VNGAnalyticsEventType.REG_CDN_DOWNLOAD_START;
    params: RegCDNDownloadStartParams;
} | {
    type: VNGAnalyticsEventType.REG_CDN_DOWNLOAD_25;
    params: RegCDNDownloadProgressParams;
} | {
    type: VNGAnalyticsEventType.REG_CDN_DOWNLOAD_50;
    params: RegCDNDownloadProgressParams;
} | {
    type: VNGAnalyticsEventType.REG_CDN_DOWNLOAD_75;
    params: RegCDNDownloadProgressParams;
} | {
    type: VNGAnalyticsEventType.REG_CDN_DOWNLOAD_FINISH;
    params: RegCDNDownloadFinishParams;
} | {
    type: VNGAnalyticsEventType.REG_EXTRACT_RESOURCE_START;
    params: RegExtractResourceStartParams;
} | {
    type: VNGAnalyticsEventType.REG_EXTRACT_RESOURCE_END;
    params: RegExtractResourceEndParams;
} | {
    type: VNGAnalyticsEventType.NRU_CREATE_ROLE_SUCCESS;
    params: NruCreateRoleSuccessParams;
} | {
    type: VNGAnalyticsEventType.NRU_TUTORIAL_START;
    params: NruTutorialStartParams;
} | {
    type: VNGAnalyticsEventType.NRU_TUTORIAL_PROGRESS;
    params: NruTutorialProgressParams;
} | {
    type: VNGAnalyticsEventType.NRU_TUTORIAL_PROGRESS_FINISH;
    params: NruTutorialProgressFinishParams;
} | {
    type: VNGAnalyticsEventType.MDA_LEVEL_UP;
    params: MdaLevelUpParams;
} | {
    type: VNGAnalyticsEventType.PLAYING_TIME_TRACK;
    params: PlayingTimeTrackParams;
} | {
    type: VNGAnalyticsEventType.IAP_OPEN_SHOP;
    params: IapOpenShopParams;
} | {
    type: VNGAnalyticsEventType.IAP_CLICK_TO_BUY_ITEM;
    params: IapClickToBuyItemParams;
} | {
    type: VNGAnalyticsEventType.IAP_PURCHASED_ITEM;
    params: IapPurchasedItemParams;
} | {
    type: VNGAnalyticsEventType.IAP_VIP_LEVEL_UP;
    params: IapVipLevelUpParams;
} | {
    type: VNGAnalyticsEventType.IAP_BUY_VIP_REWARD_LEVEL;
    params: IapBuyVipRewardLevelParams;
} | {
    type: VNGAnalyticsEventType.CLAIM_REWARD_DAY_1;
    params: ClaimRewardParams;
} | {
    type: VNGAnalyticsEventType.CLAIM_REWARD_DAY_2;
    params: ClaimRewardParams;
} | {
    type: VNGAnalyticsEventType.CLAIM_REWARD_DAY_3;
    params: ClaimRewardParams;
} | {
    type: VNGAnalyticsEventType.CLAIM_REWARD_DAY_4;
    params: ClaimRewardParams;
} | {
    type: VNGAnalyticsEventType.CLAIM_REWARD_DAY_5;
    params: ClaimRewardParams;
} | {
    type: VNGAnalyticsEventType.CLAIM_REWARD_DAY_6;
    params: ClaimRewardParams;
} | {
    type: VNGAnalyticsEventType.CLAIM_REWARD_DAY_7;
    params: ClaimRewardParams;
} | {
    type: VNGAnalyticsEventType.COMPLETE_STAGE;
    params: CompleteStageParams;
} | {
    type: VNGAnalyticsEventType.TRACK_CUSTOM_EVENT;
    params: {
        event_name: string;
        [key: string]: any;
    };
};
/**
 * VNGGamesSDK Analytics API 封装类
 */
export declare class VNGAnalytics {
    /**
     * 检查 VNGGamesSDK 是否可用
     */
    private static checkSDKAvailable;
    /**
     * 打印方法调用信息（公共方法）
     */
    private static logMethodCall;
    /**
     * 安全调用 SDK 方法
     */
    private static safeCall;
    /**
     * Game initial first screen
     * 游戏初始首屏
     */
    static showFirstFrameLoad(params: ShowFirstFrameLoadParams): void;
    /**
     * Get Config
     * 获取配置
     */
    static regGetConfiguration(params: RegGetConfigurationParams): void;
    /**
     * Check Config Start
     * 检查配置开始
     */
    static regCheckConfigurationStart(params: RegCheckConfigurationStartParams): void;
    /**
     * Check Config Finish
     * 检查配置完成
     */
    static regCheckConfigurationEnd(params: RegCheckConfigurationEndParams): void;
    /**
     * CDN Download Start
     * CDN 下载开始
     */
    static regCDNDownloadStart(params: RegCDNDownloadStartParams): void;
    /**
     * CDN Download Progress 25%
     * CDN 下载进度 25%
     */
    static regCDNDownload25(params: RegCDNDownloadProgressParams): void;
    /**
     * CDN Download Progress 50%
     * CDN 下载进度 50%
     */
    static regCDNDownload50(params: RegCDNDownloadProgressParams): void;
    /**
     * CDN Download Progress 75%
     * CDN 下载进度 75%
     */
    static regCDNDownload75(params: RegCDNDownloadProgressParams): void;
    /**
     * CDN Download Finish
     * CDN 下载完成
     */
    static regCDNDownloadFinish(params: RegCDNDownloadFinishParams): void;
    /**
     * Extract Resources Start
     * 提取资源开始
     */
    static regExtractResourceStart(params: RegExtractResourceStartParams): void;
    /**
     * Extract Resources Finish
     * 提取资源完成
     */
    static regExtractResourceEnd(params: RegExtractResourceEndParams): void;
    /**
     * Create Role Success
     * 创建角色成功
     */
    static nruCreateRoleSuccess(params: NruCreateRoleSuccessParams): void;
    /**
     * Tutorial Start
     * 教程开始
     */
    static nruTutorialStart(params: NruTutorialStartParams): void;
    /**
     * Tutorial Progress
     * 教程进度
     */
    static nruTutorialProgress(params: NruTutorialProgressParams): void;
    /**
     * Tutorial Finish
     * 教程完成
     */
    static nruTutorialProgressFinish(params: NruTutorialProgressFinishParams): void;
    /**
     * Player level up
     * 玩家升级
     */
    static mdaLevelUp(params: MdaLevelUpParams): void;
    /**
     * Game Playing Time
     * 游戏时长追踪
     */
    static playingTimeTrack(params: PlayingTimeTrackParams): void;
    /**
     * Open shop
     * 打开商店
     */
    static iapOpenShop(params: IapOpenShopParams): void;
    /**
     * Click on item to buy
     * 点击购买物品
     */
    static iapClickToBuyItem(params: IapClickToBuyItemParams): void;
    /**
     * Purchased
     * 购买物品
     */
    static iapPurchasedItem(params: IapPurchasedItemParams): void;
    /**
     * VIP level up
     * VIP 升级
     */
    static iapVipLevelUp(params: IapVipLevelUpParams): void;
    /**
     * Buy VIP reward
     * 购买 VIP 奖励
     */
    static iapBuyVipRewardLevel(params: IapBuyVipRewardLevelParams): void;
    /**
     * Login Claim Reward Day 1
     * 登录领取奖励第 1 天
     */
    static claimRewardDay1(params: ClaimRewardParams): void;
    /**
     * Login Claim Reward Day 2
     * 登录领取奖励第 2 天
     */
    static claimRewardDay2(params: ClaimRewardParams): void;
    /**
     * Login Claim Reward Day 3
     * 登录领取奖励第 3 天
     */
    static claimRewardDay3(params: ClaimRewardParams): void;
    /**
     * Login Claim Reward Day 4
     * 登录领取奖励第 4 天
     */
    static claimRewardDay4(params: ClaimRewardParams): void;
    /**
     * Login Claim Reward Day 5
     * 登录领取奖励第 5 天
     */
    static claimRewardDay5(params: ClaimRewardParams): void;
    /**
     * Login Claim Reward Day 6
     * 登录领取奖励第 6 天
     */
    static claimRewardDay6(params: ClaimRewardParams): void;
    /**
     * Login Claim Reward Day 7
     * 登录领取奖励第 7 天
     */
    static claimRewardDay7(params: ClaimRewardParams): void;
    /**
     * Game Stage
     * 完成关卡
     */
    static completeStage(params: CompleteStageParams): void;
    /**
     * Send event custom
     * 发送自定义事件
     */
    static trackCustomEvent(event_name: string, params: Record<string, any>): void;
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
    static track(event: VNGAnalyticsEventParams): void;
}
export default VNGAnalytics;
