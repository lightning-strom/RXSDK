/// <reference types="types" />
export declare const getSystemInfo: () => WechatMinigame.SystemInfo | {
    system: string;
} | {
    system?: undefined;
};
/**
 * @name getSearchQueries
 * @desc 解析并存储 URL 参数
 */
export declare function getSearchQueries(ifStringify: true): string;
export declare function getSearchQueries(): object;
/**
 * @name listenVisibilityChange
 * @desc 监听显示/隐藏
 */
export declare const listenVisibilityChange: (callbak: (show?: boolean) => void) => void;
/**
 * @name removeStorageByPrefix
 * @desc 删除指定前缀的storage缓存
 */
export declare const removeStorageByPrefix: (prefix: string, predict?: Function) => void;
