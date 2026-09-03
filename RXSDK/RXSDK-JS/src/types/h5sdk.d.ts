import { AxiosInstance } from 'axios';
export interface IPosition {
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
}
export interface IWebgameProps {
    urlParams?: any;
}
export interface IConfigData extends IResponse {
    data?: {
        isRMBPayEnable: 0 | 1;
        /** 当前渠道支持的支付方式：0-钻石支付、1-微信支付、2-支付宝支付，3-iap支付，4-微信公众号支付 */
        payChannels: (0 | 1 | 2 | 3 | 4)[];
        payChannelFromCmd?: 0 | 1 | 2 | 3 | 4 //大厅通知sdk 支付方式 (目前只有心悦会通知)
    };
}

export interface IGetData<T = number> extends IResponse {
  data: T
}

export interface IGetDialogNumberData extends IResponse {
    data: number;
}
declare global {
    interface Window {
        webgameWL: Webgame;
        cocosWebView: {
            requestToLua: Function;
        };
        vConsole: any;
        WeixinJSBridge: any;
        WLQueries: any;
    }
}
export declare class Webgame {
    static PREFIX: string;
    static PROTOCOL: string;
    static callbackList: object;
    static callbackName: string;
    static callbackId: number;
    static platform: string;
    /** 是否在客户端内 */
    static isInClient: boolean;
    static $http: AxiosInstance;
    static openId: string;
    static cfg: IConfigData;
    /** 客户端版本 */
    static clientVersion: number;
    /** 关闭组件 */
    componentClose: HTMLElement;
    /** 钻石组件 */
    componentDiamond: HTMLElement;
    /** 组件旋转角度 */
    private _componentAngle;
    private _urlParams;
    constructor(data?: IWebgameProps);
    /**
     * @name registerEvents
     * @desc 向客户端注册事件
     * @return {void}
     */
    static registerEvents(): void;
    /**
     * @name sendCmdToClient
     * @desc 生成jssdk跟客户端的协议
     * @param cmd 要生成的指令
     * @param callback 回调函数
     * @return {void}
     */
    static sendCmdToClient(cmd: string, callback?: Function, params?: object): void;
    /**
     * @name getCallbackId
     * @desc 生成并获取回调ID
     * @return {string} 回调ID
     */
    static getCallbackId(): string;
    static openIFrame(href: string, tag?: string): void;
    /**
     * @name payInDiamondWL
     * @desc 通过微乐钻石支付订单
     * @param {number} orderId 订单 ID
     * @param {function} callback 回调函数
     * @return {void}
     */
    payInDiamondWL(orderId: string, callback: (data: IResponse) => void): void;
    /**
     * @name payInRMBWL
     * @desc 通过调用支付宝微信等以人民币支付订单
     * @param {number} orderId 订单 ID
     * @param {function} callback 回调函数
     * @return {void}
     */
    payInRMBWL(orderId: string, callback: (data: IResponse) => void): void;
    /**
     * @name payInAppleWL
     * @desc 通过调用等以人民币支付订单
     * @param {number} orderId 订单 ID
     * @param {function} callback 回调函数
     * @return {void}
     */
    payInAppleWL(orderId: string, callback: Function): void;
    /**
     * @name doPayDiamondWL
     * @desc 通过调用游戏方购买钻石方法
     * @param {number} diamondCount 需要购买的钻石数量
     * @param {function} callback 回调函数
     * @return {void}
     */
    doPayDiamondWL(diamondCount: number, callback: Function): void;
    /**
     * @name showDiamondStoreWL
     * @desc 拉起微乐APP钻石商城
     * @param {function} callback 回调函数, 参数包含 diamondNum - 钻石数量
     * @return {void}
     */
    showDiamondStoreWL(callback: (data: IResponse) => void): void;
    /**
     * @name getDiamondNumberWL
     * @desc 获取钻石数量
     * @param {function} callback 回调函数, 参数包含 diamondNum - 钻石数量
     * @return {void}
     */
    getDiamondNumberWL(callback: (data: IGetDialogNumberData) => void): void;
    /**
     * @name getPlatformWL
     * @desc 获取客户端平台
     * @param {function} callback 回调函数, 参数包含平台字符串 - android, ios
     * @return {void}
     */
    getPlatformWL(callback: Function): void;
    /**
     * @name getConfigWL
     * @desc 获取客户端信息(支付方式等)
     * @param callback 回调函数, 参数包含客户端信息
     */
    getConfigWL(callback: (data: IConfigData) => void): void;
    /**
     * @desc 前往实名认证页面
     * @return {void}
     */
    getBeanNumberWL(callback: (data: IGetData) => void): void;
    /**
     * @desc 获取豆豆数量
     * @return {void}
     */
    getIsPlayingGameWL(callback: (data: IGetData<boolean>) => void): void;
    /**
     * @desc 获取是否正在游戏中
     * @return {void}
     */
    openCertification(callback: Function): void;
    /**
     * @name closeWL
     * @desc 关闭 Webview 退出游戏
     * @return {void}
     */
    closeWL(): void;
    /**
     * @name confirmPayResultWL
     * @desc 确认支付结果
     * @param {string} orderId 订单ID
     * @param {function} callback 回调函数
     * @return {void}
     */
    confirmPayResultWL(orderId: string, callback: Function): void;
    /**
     * @name clearWebCacheWL
     * @desc 清除 Webview 缓存
     * @return {void}
     */
    clearWebCacheWL(callback: Function): void;
    /**
     * @name eventDispatcher
     * @desc 触发监听的事件
     * @param eventName 时间名
     * @param data 触发事件时传入的参数
     * @return {void}
     */
    eventDispatcher(eventName: string, data?: any): void;
    /**
     * @name cbDispatcher
     * @desc 传入回调 ID 触发对应回调函数
     * @param {string} callbackId 回调 ID
     * @param {any} params 回调参数
     * @return {void}
     */
    cbDispatcher(callbackId: string, params?: any): void;
    /**
     * @name _createCloseComponent
     * @desc 初始化并显示关闭组件
     * @param position 组件位置
     */
    private _createCloseComponent;
    /**
     * @name _createDiamondComponent
     * @desc 初始化并显示钻石组件
     * @param position 组件位置
     */
    private _createDiamondComponent;
    /**
     * @name _toggleComponent
     * @desc 显示隐藏组件
     * @param name 组件名称
     * @param position 位置 / 显示隐藏
     */
    private _toggleComponent;
    /**
     * @name toggleComponentCloseWL
     * @desc 初始化或显示隐藏关闭组件
     * @param position 组件位置 / 显示隐藏
     */
    toggleComponentCloseWL(position?: IPosition | boolean): void;
    /**
     * @name toggleComponentDiamondWL
     * @desc 初始化或显示隐藏钻石组件
     * @param position 组件位置 / 显示隐藏
     */
    toggleComponentDiamondWL(position?: IPosition | boolean): void;
    /**
     * @name rotateComponentWL
     * @desc 旋转悬浮组件
     * @param angle 旋转角度
     */
    rotateComponentWL(angle: number): void;
    /**
     * @name checkIsClientWL
     * @desc 获取当前环境是否为客户端
     */
    checkIsClientWL(): boolean;
    /**
     * @name showShareWL
     * @desc 调起客户端分享
     * @param {Object} params 分享参数
     *  - {number} params.target 分享目标(0: 好友, 1: 朋友圈)
     *  - {string} params.gameId 当前 H5 游戏 ID
     * @param {Function} callback 回调
     */
    showShareWL(params: {
        target: number;
        gameId: string;
    }, callback: Function): void;
    /**
     * @name reloadWL
     * @desc 刷新当前页面
     * @param {Function} callback 回调
     */
    reloadWL(callback: Function): void;
    /**
     * @name openUrlByExtBrowserWL
     * @desc 用系统浏览器打开 URL
     * @param {string} url 目标地址
     * @param {Function} callback 回调
     */
    openUrlByExtBrowserWL(url: string, callback: Function): void;
    /**
     * getUrlParams
     * @desc 获取 url 参数
     * @return {Object} URL 参数对象
     */
    getUrlParams(): object;
}
declare const webgame: Webgame;
export default webgame;
