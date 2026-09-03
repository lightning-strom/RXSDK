/**
 * 根据服务器时间字符串计算并刷新 st_offset
 */
export declare const updateStOffsetWithServerTime: (serverTime: any) => void;
/**
 * 调用 /v1/sdkconfig/detection 接口刷新 st_offset
 * 各入口按需注入自己的 api 函数（普通包 / 华为包）
 */
export declare const refreshStOffset: (getServerTimeApi: (data?: any) => Promise<any>) => Promise<void>;
/**
 * H5：初始化成功后注册页面可见性监听
 * 切到前台（visibilitychange 且可见）时调用接口刷新 st_offset
 */
export declare const setupStOffsetRefreshForH5: (getServerTimeApi: (data?: any) => Promise<any>) => void;
/**
 * 小游戏：初始化成功后注册 onShow 监听
 * 切到前台时调用接口刷新 st_offset
 */
export declare const setupStOffsetRefreshForMiniGame: (platformGlobal: any, getServerTimeApi: (data?: any) => Promise<any>) => void;
