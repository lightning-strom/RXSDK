/// <reference types="types" />
interface GetUserInfoParams {
    screenWidth: number;
    screenHeight: number;
    button?: ILoginQQ['button'];
    withCredentials?: boolean;
    lang?: 'en' | 'zh_CN' | 'zh_TW';
    autoClose?: boolean;
    isCheck?: boolean;
    setInstance: (instance: WechatMinigame.UserInfoButton | null) => WechatMinigame.UserInfoButton | null;
}
export declare const getSystemInfo: () => WechatMinigame.SystemInfo | {
    system: string;
};
export declare const getUserInfo: ({ screenWidth, screenHeight, button, withCredentials, lang, autoClose, isCheck, setInstance, }: GetUserInfoParams) => Promise<any>;
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
export {};
