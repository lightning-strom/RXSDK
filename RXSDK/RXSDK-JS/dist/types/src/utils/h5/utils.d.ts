export interface IH5Queries {
    [key: string]: string;
    openId: string;
    accessToken: string;
    nonceStr: string;
    apiSvr: string;
    iconShow: 'false' | 'true';
    timestamp: string;
    jssdkVersion: string;
}
/**
 * @name getSearchQueries
 * @desc 解析并存储 URL 参数
 */
export declare const getSearchQueries: () => IH5Queries;
/**
 * @name listenVisibilityChange
 * @desc 监听显示/隐藏
 */
export declare const listenVisibilityChange: (callbak: (show?: boolean) => void) => void;
export declare const setStyles: (el: HTMLElement, styles: Partial<CSSStyleDeclaration> & Record<string, string>) => void;
export declare const getLayer: () => HTMLDivElement;
export declare const showShareGuide: (cancelFn?: () => void, showGuide?: boolean) => () => void;
export declare const showConfirm: (params: {
    title: string;
    message: string;
    cancel?: (() => void | Promise<void>) | undefined;
    confirm?: (() => void | Promise<void>) | undefined;
    autoClose?: boolean | undefined;
    cancelText?: string | undefined;
    confirmText?: string | undefined;
    dangerouslyUseHTMLString?: boolean | undefined;
}) => void;
