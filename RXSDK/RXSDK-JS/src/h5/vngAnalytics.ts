/**
 * VNGGamesSDK Analytics API 封装
 */

// 这里使用类型断言来访问 Analytics
interface VNGAnalyticsSDK {
  Analytics: {
    showFirstFrameLoad: (params: Record<string, any>) => void
    regGetConfiguration: (params: Record<string, any>) => void
    regCheckConfigurationStart: (params: Record<string, any>) => void
    regCheckConfigurationEnd: (params: Record<string, any>) => void
    regCDNDownloadStart: (params: Record<string, any>) => void
    regCDNDownload25: (params: Record<string, any>) => void
    regCDNDownload50: (params: Record<string, any>) => void
    regCDNDownload75: (params: Record<string, any>) => void
    regCDNDownloadFinish: (params: Record<string, any>) => void
    regExtractResourceStart: (params: Record<string, any>) => void
    regExtractResourceEnd: (params: Record<string, any>) => void
    nruCreateRoleSuccess: (params: Record<string, any>) => void
    nruTutorialStart: (params: Record<string, any>) => void
    nruTutorialProgress: (params: Record<string, any>) => void
    nruTutorialProgressFinish: (params: Record<string, any>) => void
    mdaLevelUp: (params: Record<string, any>) => void
    playingTimeTrack: (params: Record<string, any>) => void
    iapOpenShop: (params: Record<string, any>) => void
    iapClickToBuyItem: (params: Record<string, any>) => void
    iapPurchasedItem: (params: Record<string, any>) => void
    iapVipLevelUp: (params: Record<string, any>) => void
    iapBuyVipRewardLevel: (params: Record<string, any>) => void
    claimRewardDay1: (params: Record<string, any>) => void
    claimRewardDay2: (params: Record<string, any>) => void
    claimRewardDay3: (params: Record<string, any>) => void
    claimRewardDay4: (params: Record<string, any>) => void
    claimRewardDay5: (params: Record<string, any>) => void
    claimRewardDay6: (params: Record<string, any>) => void
    claimRewardDay7: (params: Record<string, any>) => void
    completeStage: (params: Record<string, any>) => void
    trackCustomEvent: (event_name: string, params: Record<string, any>) => void
  }
}

/**
 * 设备信息参数（可选）
 */
export interface DeviceInfoParams {
  free_ram_size?: string // RAM that free on device (in MB)
  total_ram_size?: string // Total RAM of device (in MB)
  free_disk_size?: string // Storage space that free on device (in MB)
  total_disk_size?: string // Total Storage space (in MB)
  extra_data?: Record<string, any> // Additional game data
}

/**
 * 游戏初始首屏参数
 */
export interface ShowFirstFrameLoadParams {
  extra_data?: string // Additional game data
}

/**
 * 获取配置参数
 */
export interface RegGetConfigurationParams extends DeviceInfoParams {}

/**
 * 检查配置开始参数
 */
export interface RegCheckConfigurationStartParams extends DeviceInfoParams {}

/**
 * 检查配置结束参数
 */
export interface RegCheckConfigurationEndParams extends DeviceInfoParams {}

/**
 * CDN 下载开始参数
 */
export interface RegCDNDownloadStartParams extends DeviceInfoParams {
  size?: string // Total size need that need to be downloaded in (MB)
}

/**
 * CDN 下载进度参数
 */
export interface RegCDNDownloadProgressParams extends DeviceInfoParams {
  size?: string // Size that was already downloaded in MB
}

/**
 * CDN 下载完成参数
 */
export interface RegCDNDownloadFinishParams extends DeviceInfoParams {
  size?: string // Size that was already downloaded in MB (from 76% to 100% of total CDN's size)
}

/**
 * 提取资源开始参数
 */
export interface RegExtractResourceStartParams extends DeviceInfoParams {
  size?: string // Size of resources (in MB)
}

/**
 * 提取资源结束参数
 */
export interface RegExtractResourceEndParams extends DeviceInfoParams {
  size?: string // Size of resources (in MB)
}

/**
 * 创建角色成功参数
 */
export interface NruCreateRoleSuccessParams {
  role_id: string // Game role ID (required)
  server_id: string // Game server ID (required)
  extra_data?: string // Additional game data
}

/**
 * 教程开始参数
 */
export interface NruTutorialStartParams {
  role_id: string // Game role ID (required)
  server_id: string // Game server ID (required)
  extra_data?: string // Additional game data
}

/**
 * 教程进度参数
 */
export interface NruTutorialProgressParams {
  role_id: string // Game role ID (required)
  server_id: string // Game server ID (required)
  step: string // The tutorial steps completed by the user (required)
  extra_data?: string // Additional game data
}

/**
 * 教程完成参数
 */
export interface NruTutorialProgressFinishParams {
  role_id: string // Game role ID (required)
  server_id: string // Game server ID (required)
  step: string // The tutorial steps completed by the user (required)
  extra_data?: string // Additional game data
}

/**
 * 玩家升级参数
 */
export interface MdaLevelUpParams {
  role_id: string // Game role ID (required)
  server_id: string // Game server ID (required)
  current_level: string // Level of user at this time (required)
  extra_data?: string // Additional game data
}

/**
 * 游戏时长追踪参数
 */
export interface PlayingTimeTrackParams {
  minutes: string // The amount of time the user spends playing the game (unit: minutes) (required)
  role_id: string // Game role ID (required)
  server_id: string // Game server ID (required)
  extra_data?: string // Additional game data
}

/**
 * 打开商店参数
 */
export interface IapOpenShopParams {
  role_id: string // Game role ID (required)
  server_id: string // Game server ID (required)
  extra_data?: string // Additional game data
}

/**
 * 点击购买物品参数
 */
export interface IapClickToBuyItemParams {
  role_id: string // Game role ID (required)
  server_id: string // Game server ID (required)
  item_id: string // ID of item (required)
  item_name: string // Name of item (required)
  item_price: string // Price of item (required)
  currency: string // Currency of item (required)
  extra_data?: string // Additional game data
}

/**
 * 购买物品参数
 */
export interface IapPurchasedItemParams {
  role_id: string // Game role ID (required)
  server_id: string // Game server ID (required)
  item_id: string // ID of item (required)
  item_name: string // Name of item (required)
  item_price: string // Price of item (required)
  currency: string // Currency of item (required)
  extra_data?: string // Additional game data
}

/**
 * VIP 升级参数
 */
export interface IapVipLevelUpParams {
  role_id: string // Game role ID (required)
  server_id: string // Game server ID (required)
  current_vip_level: string // the VIP level of user at that moment (required)
  extra_data?: string // Additional game data
}

/**
 * 购买 VIP 奖励参数
 */
export interface IapBuyVipRewardLevelParams {
  role_id: string // Game role ID (required)
  server_id: string // Game server ID (required)
  item_id: string // ID of item (required)
  item_name: string // Name of item (required)
  item_price: string // Price of item (required)
  currency: string // Currency of item (required)
  item_vip_level: string // This item is from which VIP level (required)
  extra_data?: string // Additional game data
}

/**
 * 登录领取奖励参数
 */
export interface ClaimRewardParams {
  role_id: string // Game role ID (required)
  server_id: string // Game server ID (required)
  day: string // The date the user returned to the game (required)
  extra_data?: string // Additional game data
}

/**
 * 完成关卡参数
 */
export interface CompleteStageParams {
  role_id: string // Game role ID (required)
  server_id: string // Game server ID (required)
  stage: string // Game stage (required)
  extra_data?: string // Additional game data
}

/**
 * Analytics 事件类型枚举
 */
export enum VNGAnalyticsEventType {
  // 游戏初始首屏
  SHOW_FIRST_FRAME_LOAD = 'showFirstFrameLoad',
  // 配置相关
  REG_GET_CONFIGURATION = 'regGetConfiguration',
  REG_CHECK_CONFIGURATION_START = 'regCheckConfigurationStart',
  REG_CHECK_CONFIGURATION_END = 'regCheckConfigurationEnd',
  // CDN 下载相关
  REG_CDN_DOWNLOAD_START = 'regCDNDownloadStart',
  REG_CDN_DOWNLOAD_25 = 'regCDNDownload25',
  REG_CDN_DOWNLOAD_50 = 'regCDNDownload50',
  REG_CDN_DOWNLOAD_75 = 'regCDNDownload75',
  REG_CDN_DOWNLOAD_FINISH = 'regCDNDownloadFinish',
  // 资源提取相关
  REG_EXTRACT_RESOURCE_START = 'regExtractResourceStart',
  REG_EXTRACT_RESOURCE_END = 'regExtractResourceEnd',
  // 新用户相关
  NRU_CREATE_ROLE_SUCCESS = 'nruCreateRoleSuccess',
  NRU_TUTORIAL_START = 'nruTutorialStart',
  NRU_TUTORIAL_PROGRESS = 'nruTutorialProgress',
  NRU_TUTORIAL_PROGRESS_FINISH = 'nruTutorialProgressFinish',
  // 玩家相关
  MDA_LEVEL_UP = 'mdaLevelUp',
  PLAYING_TIME_TRACK = 'playingTimeTrack',
  // 内购相关
  IAP_OPEN_SHOP = 'iapOpenShop',
  IAP_CLICK_TO_BUY_ITEM = 'iapClickToBuyItem',
  IAP_PURCHASED_ITEM = 'iapPurchasedItem',
  IAP_VIP_LEVEL_UP = 'iapVipLevelUp',
  IAP_BUY_VIP_REWARD_LEVEL = 'iapBuyVipRewardLevel',
  // 登录奖励相关
  CLAIM_REWARD_DAY_1 = 'claimRewardDay1',
  CLAIM_REWARD_DAY_2 = 'claimRewardDay2',
  CLAIM_REWARD_DAY_3 = 'claimRewardDay3',
  CLAIM_REWARD_DAY_4 = 'claimRewardDay4',
  CLAIM_REWARD_DAY_5 = 'claimRewardDay5',
  CLAIM_REWARD_DAY_6 = 'claimRewardDay6',
  CLAIM_REWARD_DAY_7 = 'claimRewardDay7',
  // 游戏关卡
  COMPLETE_STAGE = 'completeStage',
  // 自定义事件
  TRACK_CUSTOM_EVENT = 'trackCustomEvent',
}

/**
 * 统一的事件参数类型
 */
export type VNGAnalyticsEventParams =
  | { type: VNGAnalyticsEventType.SHOW_FIRST_FRAME_LOAD; params: ShowFirstFrameLoadParams }
  | { type: VNGAnalyticsEventType.REG_GET_CONFIGURATION; params: RegGetConfigurationParams }
  | { type: VNGAnalyticsEventType.REG_CHECK_CONFIGURATION_START; params: RegCheckConfigurationStartParams }
  | { type: VNGAnalyticsEventType.REG_CHECK_CONFIGURATION_END; params: RegCheckConfigurationEndParams }
  | { type: VNGAnalyticsEventType.REG_CDN_DOWNLOAD_START; params: RegCDNDownloadStartParams }
  | { type: VNGAnalyticsEventType.REG_CDN_DOWNLOAD_25; params: RegCDNDownloadProgressParams }
  | { type: VNGAnalyticsEventType.REG_CDN_DOWNLOAD_50; params: RegCDNDownloadProgressParams }
  | { type: VNGAnalyticsEventType.REG_CDN_DOWNLOAD_75; params: RegCDNDownloadProgressParams }
  | { type: VNGAnalyticsEventType.REG_CDN_DOWNLOAD_FINISH; params: RegCDNDownloadFinishParams }
  | { type: VNGAnalyticsEventType.REG_EXTRACT_RESOURCE_START; params: RegExtractResourceStartParams }
  | { type: VNGAnalyticsEventType.REG_EXTRACT_RESOURCE_END; params: RegExtractResourceEndParams }
  | { type: VNGAnalyticsEventType.NRU_CREATE_ROLE_SUCCESS; params: NruCreateRoleSuccessParams }
  | { type: VNGAnalyticsEventType.NRU_TUTORIAL_START; params: NruTutorialStartParams }
  | { type: VNGAnalyticsEventType.NRU_TUTORIAL_PROGRESS; params: NruTutorialProgressParams }
  | { type: VNGAnalyticsEventType.NRU_TUTORIAL_PROGRESS_FINISH; params: NruTutorialProgressFinishParams }
  | { type: VNGAnalyticsEventType.MDA_LEVEL_UP; params: MdaLevelUpParams }
  | { type: VNGAnalyticsEventType.PLAYING_TIME_TRACK; params: PlayingTimeTrackParams }
  | { type: VNGAnalyticsEventType.IAP_OPEN_SHOP; params: IapOpenShopParams }
  | { type: VNGAnalyticsEventType.IAP_CLICK_TO_BUY_ITEM; params: IapClickToBuyItemParams }
  | { type: VNGAnalyticsEventType.IAP_PURCHASED_ITEM; params: IapPurchasedItemParams }
  | { type: VNGAnalyticsEventType.IAP_VIP_LEVEL_UP; params: IapVipLevelUpParams }
  | { type: VNGAnalyticsEventType.IAP_BUY_VIP_REWARD_LEVEL; params: IapBuyVipRewardLevelParams }
  | { type: VNGAnalyticsEventType.CLAIM_REWARD_DAY_1; params: ClaimRewardParams }
  | { type: VNGAnalyticsEventType.CLAIM_REWARD_DAY_2; params: ClaimRewardParams }
  | { type: VNGAnalyticsEventType.CLAIM_REWARD_DAY_3; params: ClaimRewardParams }
  | { type: VNGAnalyticsEventType.CLAIM_REWARD_DAY_4; params: ClaimRewardParams }
  | { type: VNGAnalyticsEventType.CLAIM_REWARD_DAY_5; params: ClaimRewardParams }
  | { type: VNGAnalyticsEventType.CLAIM_REWARD_DAY_6; params: ClaimRewardParams }
  | { type: VNGAnalyticsEventType.CLAIM_REWARD_DAY_7; params: ClaimRewardParams }
  | { type: VNGAnalyticsEventType.COMPLETE_STAGE; params: CompleteStageParams }
  | { type: VNGAnalyticsEventType.TRACK_CUSTOM_EVENT; params: { event_name: string; [key: string]: any } }

/**
 * VNGGamesSDK Analytics API 封装类
 */
export class VNGAnalytics {
  /**
   * 检查 VNGGamesSDK 是否可用
   */
  private static checkSDKAvailable(): boolean {
    if (typeof window === 'undefined') {
      return false
    }
    const sdk = (window as any).top.VNGGamesSDK
    // 确保返回布尔值，而不是 undefined
    const result = !!(sdk && sdk.Analytics)
    return result
  }

  /**
   * 打印方法调用信息（公共方法）
   */
  private static logMethodCall(
    methodName: string,
    params: any,
    analytics: VNGAnalyticsSDK['Analytics']
  ): void {
    try {
      const fullMethodPath = `window.VNGGamesSDK.Analytics.${methodName}`
      const windowAnalytics = (window as any).top.VNGGamesSDK?.Analytics
      const methodExists = windowAnalytics && typeof windowAnalytics[methodName] === 'function'
      const methodReference = windowAnalytics?.[methodName]
      const analyticsMethod = (analytics as any)[methodName]
      
      console.log(`[VNGAnalytics] 完整方法路径: ${fullMethodPath}`)
      console.log(`[VNGAnalytics] 方法是否存在:`, methodExists)
      console.log(`[VNGAnalytics] 方法引用:`, methodReference)
      console.log(`[VNGAnalytics] analytics.${methodName} 引用:`, analyticsMethod)
      console.log(`[VNGAnalytics] 方法引用是否匹配:`, analyticsMethod === methodReference)
      console.log(`[VNGAnalytics] ✓ 方法调用成功: ${fullMethodPath}`)
      console.log(`[VNGAnalytics] ✓ 调用参数:`, params)
    } catch (error) {
      console.error(`[logMethodCall] Error logging method call:`, error)
    }
  }

  /**
   * 安全调用 SDK 方法
   */
  private static safeCall<T>(
    methodName: string,
    callback: (analytics: VNGAnalyticsSDK['Analytics']) => T,
    params?: any
  ): T | null {
    const isAvailable = this.checkSDKAvailable()
    if (!isAvailable) {
      console.warn(`[safeCall] VNGGamesSDK.Analytics is not available. Method: ${methodName}`)
      return null
    }
    try {
      const analytics = (window as any).top.VNGGamesSDK?.Analytics as VNGAnalyticsSDK['Analytics']
      if (!analytics) {
        console.warn(`[safeCall] VNGGamesSDK.Analytics is not available. Method: ${methodName}`)
        return null
      }
      const result = callback(analytics)
      
      // 调用完成后打印方法名称和参数
      if (params !== undefined) {
        this.logMethodCall(methodName, params, analytics)
      }
      
      return result
    } catch (error) {
      console.error(`[safeCall] Error calling VNGGamesSDK.Analytics.${methodName}:`, error)
      return null
    }
  }

  /**
   * Game initial first screen
   * 游戏初始首屏
   */
  static showFirstFrameLoad(params: ShowFirstFrameLoadParams): void {
    try {
      const callParams = {
        extra_data: params?.extra_data || '',
      }
      this.safeCall('showFirstFrameLoad', (analytics) => {
        analytics.showFirstFrameLoad(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in showFirstFrameLoad:', error)
    }
  }

  /**
   * Get Config
   * 获取配置
   */
  static regGetConfiguration(params: RegGetConfigurationParams): void {
    try {
      const callParams = {
        free_ram_size: params?.free_ram_size,
        total_ram_size: params?.total_ram_size,
        free_disk_size: params?.free_disk_size,
        total_disk_size: params?.total_disk_size,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('regGetConfiguration', (analytics) => {
        analytics.regGetConfiguration(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in regGetConfiguration:', error)
    }
  }

  /**
   * Check Config Start
   * 检查配置开始
   */
  static regCheckConfigurationStart(params: RegCheckConfigurationStartParams): void {
    try {
      const callParams = {
        free_ram_size: params?.free_ram_size,
        total_ram_size: params?.total_ram_size,
        free_disk_size: params?.free_disk_size,
        total_disk_size: params?.total_disk_size,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('regCheckConfigurationStart', (analytics) => {
        analytics.regCheckConfigurationStart(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in regCheckConfigurationStart:', error)
    }
  }

  /**
   * Check Config Finish
   * 检查配置完成
   */
  static regCheckConfigurationEnd(params: RegCheckConfigurationEndParams): void {
    try {
      const callParams = {
        free_ram_size: params?.free_ram_size,
        total_ram_size: params?.total_ram_size,
        free_disk_size: params?.free_disk_size,
        total_disk_size: params?.total_disk_size,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('regCheckConfigurationEnd', (analytics) => {
        analytics.regCheckConfigurationEnd(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in regCheckConfigurationEnd:', error)
    }
  }

  /**
   * CDN Download Start
   * CDN 下载开始
   */
  static regCDNDownloadStart(params: RegCDNDownloadStartParams): void {
    try {
      const callParams = {
        free_ram_size: params?.free_ram_size,
        total_ram_size: params?.total_ram_size,
        free_disk_size: params?.free_disk_size,
        total_disk_size: params?.total_disk_size,
        extra_data: params?.extra_data || '',
        size: params?.size,
      }
      this.safeCall('regCDNDownloadStart', (analytics) => {
        analytics.regCDNDownloadStart(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in regCDNDownloadStart:', error)
    }
  }

  /**
   * CDN Download Progress 25%
   * CDN 下载进度 25%
   */
  static regCDNDownload25(params: RegCDNDownloadProgressParams): void {
    try {
      const callParams = {
        free_ram_size: params?.free_ram_size,
        total_ram_size: params?.total_ram_size,
        free_disk_size: params?.free_disk_size,
        total_disk_size: params?.total_disk_size,
        extra_data: params?.extra_data || '',
        size: params?.size,
      }
      this.safeCall('regCDNDownload25', (analytics) => {
        analytics.regCDNDownload25(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in regCDNDownload25:', error)
    }
  }

  /**
   * CDN Download Progress 50%
   * CDN 下载进度 50%
   */
  static regCDNDownload50(params: RegCDNDownloadProgressParams): void {
    try {
      const callParams = {
        free_ram_size: params?.free_ram_size,
        total_ram_size: params?.total_ram_size,
        free_disk_size: params?.free_disk_size,
        total_disk_size: params?.total_disk_size,
        extra_data: params?.extra_data || '',
        size: params?.size,
      }
      this.safeCall('regCDNDownload50', (analytics) => {
        analytics.regCDNDownload50(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in regCDNDownload50:', error)
    }
  }

  /**
   * CDN Download Progress 75%
   * CDN 下载进度 75%
   */
  static regCDNDownload75(params: RegCDNDownloadProgressParams): void {
    try {
      const callParams = {
        free_ram_size: params?.free_ram_size,
        total_ram_size: params?.total_ram_size,
        free_disk_size: params?.free_disk_size,
        total_disk_size: params?.total_disk_size,
        extra_data: params?.extra_data || '',
        size: params?.size,
      }
      this.safeCall('regCDNDownload75', (analytics) => {
        analytics.regCDNDownload75(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in regCDNDownload75:', error)
    }
  }

  /**
   * CDN Download Finish
   * CDN 下载完成
   */
  static regCDNDownloadFinish(params: RegCDNDownloadFinishParams): void {
    try {
      const callParams = {
        free_ram_size: params?.free_ram_size,
        total_ram_size: params?.total_ram_size,
        free_disk_size: params?.free_disk_size,
        total_disk_size: params?.total_disk_size,
        extra_data: params?.extra_data || '',
        size: params?.size,
      }
      this.safeCall('regCDNDownloadFinish', (analytics) => {
        analytics.regCDNDownloadFinish(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in regCDNDownloadFinish:', error)
    }
  }

  /**
   * Extract Resources Start
   * 提取资源开始
   */
  static regExtractResourceStart(params: RegExtractResourceStartParams): void {
    try {
      const callParams = {
        free_ram_size: params?.free_ram_size,
        total_ram_size: params?.total_ram_size,
        free_disk_size: params?.free_disk_size,
        total_disk_size: params?.total_disk_size,
        extra_data: params?.extra_data || '',
        size: params?.size,
      }
      this.safeCall('regExtractResourceStart', (analytics) => {
        analytics.regExtractResourceStart(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in regExtractResourceStart:', error)
    }
  }

  /**
   * Extract Resources Finish
   * 提取资源完成
   */
  static regExtractResourceEnd(params: RegExtractResourceEndParams): void {
    try {
      const callParams = {
        free_ram_size: params?.free_ram_size,
        total_ram_size: params?.total_ram_size,
        free_disk_size: params?.free_disk_size,
        total_disk_size: params?.total_disk_size,
        extra_data: params?.extra_data || '',
        size: params?.size,
      }
      this.safeCall('regExtractResourceEnd', (analytics) => {
        analytics.regExtractResourceEnd(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in regExtractResourceEnd:', error)
    }
  }

  /**
   * Create Role Success
   * 创建角色成功
   */
  static nruCreateRoleSuccess(params: NruCreateRoleSuccessParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('nruCreateRoleSuccess', (analytics) => {
        analytics.nruCreateRoleSuccess(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in nruCreateRoleSuccess:', error)
    }
  }

  /**
   * Tutorial Start
   * 教程开始
   */
  static nruTutorialStart(params: NruTutorialStartParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('nruTutorialStart', (analytics) => {
        analytics.nruTutorialStart(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in nruTutorialStart:', error)
    }
  }

  /**
   * Tutorial Progress
   * 教程进度
   */
  static nruTutorialProgress(params: NruTutorialProgressParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        step: params?.step,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('nruTutorialProgress', (analytics) => {
        analytics.nruTutorialProgress(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in nruTutorialProgress:', error)
    }
  }

  /**
   * Tutorial Finish
   * 教程完成
   */
  static nruTutorialProgressFinish(params: NruTutorialProgressFinishParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        step: params?.step,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('nruTutorialProgressFinish', (analytics) => {
        analytics.nruTutorialProgressFinish(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in nruTutorialProgressFinish:', error)
    }
  }

  /**
   * Player level up
   * 玩家升级
   */
  static mdaLevelUp(params: MdaLevelUpParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        current_level: params?.current_level,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('mdaLevelUp', (analytics) => {
        analytics.mdaLevelUp(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in mdaLevelUp:', error)
    }
  }

  /**
   * Game Playing Time
   * 游戏时长追踪
   */
  static playingTimeTrack(params: PlayingTimeTrackParams): void {
    try {
      const callParams = {
        minutes: params?.minutes,
        role_id: params?.role_id,
        server_id: params?.server_id,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('playingTimeTrack', (analytics) => {
        analytics.playingTimeTrack(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in playingTimeTrack:', error)
    }
  }

  /**
   * Open shop
   * 打开商店
   */
  static iapOpenShop(params: IapOpenShopParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('iapOpenShop', (analytics) => {
        analytics.iapOpenShop(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in iapOpenShop:', error)
    }
  }

  /**
   * Click on item to buy
   * 点击购买物品
   */
  static iapClickToBuyItem(params: IapClickToBuyItemParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        item_id: params?.item_id,
        item_name: params?.item_name,
        item_price: params?.item_price,
        currency: params?.currency,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('iapClickToBuyItem', (analytics) => {
        analytics.iapClickToBuyItem(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in iapClickToBuyItem:', error)
    }
  }

  /**
   * Purchased
   * 购买物品
   */
  static iapPurchasedItem(params: IapPurchasedItemParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        item_id: params?.item_id,
        item_name: params?.item_name,
        item_price: params?.item_price,
        currency: params?.currency,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('iapPurchasedItem', (analytics) => {
        analytics.iapPurchasedItem(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in iapPurchasedItem:', error)
    }
  }

  /**
   * VIP level up
   * VIP 升级
   */
  static iapVipLevelUp(params: IapVipLevelUpParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        current_vip_level: params?.current_vip_level,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('iapVipLevelUp', (analytics) => {
        analytics.iapVipLevelUp(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in iapVipLevelUp:', error)
    }
  }

  /**
   * Buy VIP reward
   * 购买 VIP 奖励
   */
  static iapBuyVipRewardLevel(params: IapBuyVipRewardLevelParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        item_id: params?.item_id,
        item_name: params?.item_name,
        item_price: params?.item_price,
        currency: params?.currency,
        item_vip_level: params?.item_vip_level,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('iapBuyVipRewardLevel', (analytics) => {
        analytics.iapBuyVipRewardLevel(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in iapBuyVipRewardLevel:', error)
    }
  }

  /**
   * Login Claim Reward Day 1
   * 登录领取奖励第 1 天
   */
  static claimRewardDay1(params: ClaimRewardParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        day: params?.day,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('claimRewardDay1', (analytics) => {
        analytics.claimRewardDay1(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in claimRewardDay1:', error)
    }
  }

  /**
   * Login Claim Reward Day 2
   * 登录领取奖励第 2 天
   */
  static claimRewardDay2(params: ClaimRewardParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        day: params?.day,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('claimRewardDay2', (analytics) => {
        analytics.claimRewardDay2(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in claimRewardDay2:', error)
    }
  }

  /**
   * Login Claim Reward Day 3
   * 登录领取奖励第 3 天
   */
  static claimRewardDay3(params: ClaimRewardParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        day: params?.day,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('claimRewardDay3', (analytics) => {
        analytics.claimRewardDay3(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in claimRewardDay3:', error)
    }
  }

  /**
   * Login Claim Reward Day 4
   * 登录领取奖励第 4 天
   */
  static claimRewardDay4(params: ClaimRewardParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        day: params?.day,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('claimRewardDay4', (analytics) => {
        analytics.claimRewardDay4(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in claimRewardDay4:', error)
    }
  }

  /**
   * Login Claim Reward Day 5
   * 登录领取奖励第 5 天
   */
  static claimRewardDay5(params: ClaimRewardParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        day: params?.day,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('claimRewardDay5', (analytics) => {
        analytics.claimRewardDay5(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in claimRewardDay5:', error)
    }
  }

  /**
   * Login Claim Reward Day 6
   * 登录领取奖励第 6 天
   */
  static claimRewardDay6(params: ClaimRewardParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        day: params?.day,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('claimRewardDay6', (analytics) => {
        analytics.claimRewardDay6(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in claimRewardDay6:', error)
    }
  }

  /**
   * Login Claim Reward Day 7
   * 登录领取奖励第 7 天
   */
  static claimRewardDay7(params: ClaimRewardParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        day: params?.day,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('claimRewardDay7', (analytics) => {
        analytics.claimRewardDay7(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in claimRewardDay7:', error)
    }
  }

  /**
   * Game Stage
   * 完成关卡
   */
  static completeStage(params: CompleteStageParams): void {
    try {
      const callParams = {
        role_id: params?.role_id,
        server_id: params?.server_id,
        stage: params?.stage,
        extra_data: params?.extra_data || '',
      }
      this.safeCall('completeStage', (analytics) => {
        analytics.completeStage(callParams)
      }, callParams)
    } catch (error) {
      console.error('Error in completeStage:', error)
    }
    
  }

  /**
   * Send event custom
   * 发送自定义事件
   */
  static trackCustomEvent(event_name: string, params: Record<string, any>): void {
    try {
      const callParams = {
        event_name,
        ...params
      }
      this.safeCall('trackCustomEvent', (analytics) => {
        analytics.trackCustomEvent(event_name, params)
      }, callParams)
    } catch (error) {
      console.error('Error in trackCustomEvent:', error)
    }
  }

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
  static track(event: VNGAnalyticsEventParams): void {
    try {
      switch (event.type) {
        case VNGAnalyticsEventType.SHOW_FIRST_FRAME_LOAD:
          this.showFirstFrameLoad(event.params)
          break
        case VNGAnalyticsEventType.REG_GET_CONFIGURATION:
          this.regGetConfiguration(event.params)
          break
        case VNGAnalyticsEventType.REG_CHECK_CONFIGURATION_START:
          this.regCheckConfigurationStart(event.params)
          break
        case VNGAnalyticsEventType.REG_CHECK_CONFIGURATION_END:
          this.regCheckConfigurationEnd(event.params)
          break
        case VNGAnalyticsEventType.REG_CDN_DOWNLOAD_START:
          this.regCDNDownloadStart(event.params)
          break
        case VNGAnalyticsEventType.REG_CDN_DOWNLOAD_25:
          this.regCDNDownload25(event.params)
          break
        case VNGAnalyticsEventType.REG_CDN_DOWNLOAD_50:
          this.regCDNDownload50(event.params)
          break
        case VNGAnalyticsEventType.REG_CDN_DOWNLOAD_75:
          this.regCDNDownload75(event.params)
          break
        case VNGAnalyticsEventType.REG_CDN_DOWNLOAD_FINISH:
          this.regCDNDownloadFinish(event.params)
          break
        case VNGAnalyticsEventType.REG_EXTRACT_RESOURCE_START:
          this.regExtractResourceStart(event.params)
          break
        case VNGAnalyticsEventType.REG_EXTRACT_RESOURCE_END:
          this.regExtractResourceEnd(event.params)
          break
        case VNGAnalyticsEventType.NRU_CREATE_ROLE_SUCCESS:
          this.nruCreateRoleSuccess(event.params)
          break
        case VNGAnalyticsEventType.NRU_TUTORIAL_START:
          this.nruTutorialStart(event.params)
          break
        case VNGAnalyticsEventType.NRU_TUTORIAL_PROGRESS:
          this.nruTutorialProgress(event.params)
          break
        case VNGAnalyticsEventType.NRU_TUTORIAL_PROGRESS_FINISH:
          this.nruTutorialProgressFinish(event.params)
          break
        case VNGAnalyticsEventType.MDA_LEVEL_UP:
          this.mdaLevelUp(event.params)
          break
        case VNGAnalyticsEventType.PLAYING_TIME_TRACK:
          this.playingTimeTrack(event.params)
          break
        case VNGAnalyticsEventType.IAP_OPEN_SHOP:
          this.iapOpenShop(event.params)
          break
        case VNGAnalyticsEventType.IAP_CLICK_TO_BUY_ITEM:
          this.iapClickToBuyItem(event.params)
          break
        case VNGAnalyticsEventType.IAP_PURCHASED_ITEM:
          this.iapPurchasedItem(event.params)
          break
        case VNGAnalyticsEventType.IAP_VIP_LEVEL_UP:
          this.iapVipLevelUp(event.params)
          break
        case VNGAnalyticsEventType.IAP_BUY_VIP_REWARD_LEVEL:
          this.iapBuyVipRewardLevel(event.params)
          break
        case VNGAnalyticsEventType.CLAIM_REWARD_DAY_1:
          this.claimRewardDay1(event.params)
          break
        case VNGAnalyticsEventType.CLAIM_REWARD_DAY_2:
          this.claimRewardDay2(event.params)
          break
        case VNGAnalyticsEventType.CLAIM_REWARD_DAY_3:
          this.claimRewardDay3(event.params)
          break
        case VNGAnalyticsEventType.CLAIM_REWARD_DAY_4:
          this.claimRewardDay4(event.params)
          break
        case VNGAnalyticsEventType.CLAIM_REWARD_DAY_5:
          this.claimRewardDay5(event.params)
          break
        case VNGAnalyticsEventType.CLAIM_REWARD_DAY_6:
          this.claimRewardDay6(event.params)
          break
        case VNGAnalyticsEventType.CLAIM_REWARD_DAY_7:
          this.claimRewardDay7(event.params)
          break
        case VNGAnalyticsEventType.COMPLETE_STAGE:
          this.completeStage(event.params)
          break
        case VNGAnalyticsEventType.TRACK_CUSTOM_EVENT:
          const { event_name, ...customParams } = event.params
          this.trackCustomEvent(event_name, customParams)
          break
        default:
          console.warn(`Unknown analytics event type: ${(event as any).type}`)
      }
    } catch (error) {
      console.error('Error in track:', error)
    }
  }
}

export default VNGAnalytics
