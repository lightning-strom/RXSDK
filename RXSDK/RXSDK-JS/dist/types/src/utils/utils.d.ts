export declare function printLog(...args: any): void;
export declare const qs: {
    stringify: (obj: any) => string;
    parse: (params: string) => object;
};
export declare const asyncFunc: <F extends (...args: any) => any>(func: F, options?: Parameters<F>[0] | undefined, params?: Parameters<F>[] | undefined) => Promise<any>;
export declare const getConfigErrMsg: (code: any, thirdcode: any, thirdmsg: any) => any;
export declare const handleError: (err: any, code?: any) => any;
export declare const handleSuccess: (result: any, tag: string) => void;
export declare const isDropOrder: (errCode: number) => boolean;
export declare const isExpiredCode: (errCode: number) => boolean;
/**
 * 编码 URI 及 base64 处理的字符串
 */
/**
 * 反编码 URI 及 base64 处理的字符串
 */
export declare const formatTrackParams: ({ eventName, apiName, reqParams, errorInfo, loginInfo, ...otherParams }: any) => {
    event: string;
    properties: any;
};
export declare const customGetStorageSync: (key: string) => any;
export declare const customSetStorageSync: (key: string, value: any, expire?: number) => void;
export declare const customRemoveStorageSync: (key: string) => void;
export declare const removeStorageSync: (key: string) => void;
export declare const removeStorageByPrefix: (prefix: string, predict?: ((key: string) => boolean) | undefined) => void;
/**
 * 将上报数据存入storage
 * key为时间戳，每个key最多存100条数据，严格控制最多5个时间戳
 * 如果当前key被锁定（正在上报中），则创建新的时间戳继续写入
 * 如果已达到5个上限且无法删除，则丢弃新数据
 * 注意：此函数内部已做完善的异常处理，不会抛出错误
 */
export declare const saveTrackDataToStorage: (data: any) => void;
/**
 * 获取存储的上报数据（按时间戳顺序）
 * @returns 最旧的一批数据及其对应的时间戳key
 */
export declare const getTrackDataFromStorage: () => {
    key: string;
    data: any[];
} | null;
/**
 * 锁定指定的时间戳key，防止继续写入
 * 存储结构：{ key: string, lockedAt: number }
 */
export declare const lockTrackKey: (key: string) => void;
/**
 * 解锁时间戳key
 */
export declare const unlockTrackKey: () => void;
/**
 * 获取有效的锁（如果锁已超时，自动解锁并返回 null）
 * @returns 锁定的 key，如果无锁或锁已超时返回 null
 */
export declare const getValidLock: () => string | null;
/**
 * 删除已上报的数据（单个时间戳）
 */
export declare const removeTrackData: (key: string) => void;
/**
 * 获取当前缓存数据总量
 * @returns 所有时间戳中的数据总条数
 */
export declare const getTotalCacheCount: () => number;
/**
 * 更新缓存数据上限
 * @param maxCount 新的缓存上限，必须是100-1000之间的正整数
 */
export declare const updateMaxCacheCount: (maxCount: number) => void;
/**
 * 获取当前缓存数据上限
 */
export declare const getCurrentMaxCacheCount: () => number;
/**
 * 重置上报失败冷却时间（用于测试或手动恢复）
 */
export declare const resetReportCooldown: () => void;
/**
 * 触发立即上报（当缓存数据达到上限时调用）
 * 暂停定时上报，执行一次完整上报，完成后重启定时器
 * 注意：此函数内部已做完善的异常处理，不会抛出错误
 */
export declare const triggerImmediateReport: () => Promise<void>;
/**
 * 检查是否需要立即上报（缓存数据量达到上限）
 * @returns 是否需要立即上报
 */
export declare const shouldTriggerImmediateReport: () => boolean;
/**
 * 压缩数据
 * @param data 要压缩的数据
 * @returns 压缩后的 base64 字符串，失败返回空字符串
 */
export declare const compressData: (data: any) => string;
/**
 * 解压数据
 * @param compressed 压缩后的 base64 字符串
 * @returns 解压后的数据
 */
export declare const decompressData: (compressed: string) => any;
/**
 * 简单上报（忽略锁、缓存等逻辑，直接上报）
 * 用于记录执行日志，无论成功失败都不影响主流程
 * @param trackApiFunc 上报API函数
 * @param data 要上报的数据
 */
export declare const reportSimple: (trackApiFunc: ((data: any) => Promise<any>) | null, data: any) => Promise<void>;
/**
 * 执行分批上报（按时间戳顺序逐个上报，每轮最多5个）
 * 每次触发时，按先后顺序逐个上报时间戳数据，每轮最多上报5个时间戳
 * 注意：此函数内部已做完善的异常处理，不会抛出错误
 * @param trackApiFunc 上报API函数
 */
export declare const reportTrackDataOnce: (trackApiFunc: (data: any) => Promise<any>) => Promise<void>;
/**
 * 启动定时上报定时器
 * @param trackApiFunc 上报API函数（接收压缩后的字符串）
 * @param interval 上报间隔，默认1分钟（60000毫秒）
 */
export declare const startTrackReportTimer: (trackApiFunc: (data: any) => Promise<any>, interval?: number) => void;
/**
 * 动态更新上报间隔
 * @param interval 新的上报间隔（毫秒），最小值为200毫秒
 */
export declare const updateTrackReportInterval: (interval: number) => void;
/**
 * 停止定时上报定时器
 */
export declare const stopTrackReportTimer: () => void;
