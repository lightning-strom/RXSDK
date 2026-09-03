export interface ISystemInfo {
    [key: string]: any;
    /** 登录类型 - 1:app; 2:小游戏; 3:公众号） */
    type: 1 | 2 | 3;
    /** 平台标识 - 0:未知; 1:Android; 2:IOS */
    platformid: 0 | 1 | 2;
    appid: string;
    /** 游戏名称 */
    appName?: string;
    channelid: string;
    deviceCode: string;
    /** 来源
     * weile: 微信/APP
     * wxpub: 公众号
     * minigame: 小游戏
     * qq: QQ
     * */
    fromChannel?: ChannelKeys;
    /** 第三方渠道 APP ID */
    channelAppId: string;
    productCode?: string;
    productKey?: string;
    /** 千禧游戏提供的分包id */
    appChannelId?: number;
    /** 服务端与设备时间差（毫秒） */
    st_offset: string;
}
export declare const SYSTEM_INFO: ISystemInfo;
export declare const USER_INFO: any;
