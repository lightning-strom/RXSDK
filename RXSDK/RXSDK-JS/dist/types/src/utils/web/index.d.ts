import { ISystemInfo } from "@/config";
export declare const setSystemInfo: (info: Partial<ISystemInfo>) => void;
/**
 * @name getSearchQueries
 * @desc 解析并存储 URL 参数
 */
export declare const getSearchQueries: <T extends Object>(isString?: boolean) => T;
/**
 * @name listenVisibilityChange
 * @desc 监听显示/隐藏
 */
export declare const listenVisibilityChange: (callbak: (show?: boolean) => void) => void;
