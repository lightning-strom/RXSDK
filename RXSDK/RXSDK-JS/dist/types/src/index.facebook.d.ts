import SdkCommon from '@/rpk/SdkCommon';
declare global {
    var FBInstant: any;
}
declare class SdkFacebook extends SdkCommon {
    private funcs;
    private isPromoter;
    private businessRuleDefaultRefreshTime;
    private businessRulesInfo;
    private businessRuleInvoking;
    private businessWindowsQueue;
    private trackPublicPropsFailCount;
    private initConfig;
    private scheduleInitMap;
    private getShareDataFunc;
    private scheuleReportProps;
    subChannelId: any;
    private is_promoter;
    private game_id;
    private playerId;
    private promoInfo;
    constructor(initParams: InitRpkParams);
    infoSync(callback: RpkMethodParams): Promise<void>;
    private login;
    pay(params: any, callback: RpkMethodParams): Promise<void>;
    share(params: any, callback: RpkMethodParams): Promise<void>;
    /**
     * 版本号比较函数
     * @param currentVersion 当前版本号，如 '12.37.200'
     * @param minVersion 最低要求版本号，如 '12.37.200'
     * @returns 如果当前版本小于最低要求版本，返回 true；否则返回 false
     */
    private versionCheck;
    supportedAdvertisingVideo(callback: RpkMethodParams): void;
    advertisingVideo(params: any, callback: RpkMethodParams): Promise<void>;
    schedulingAction(params: any, callback: RpkMethodParams): Promise<void>;
    getAdShareData(params: RpkgetShareData, callback?: RpkMethodParams): Promise<any>;
    rewardedVideoAd(data: IRequestAdData, { complete }: IMethodParams): Promise<void>;
    setScheuleReportProps(data: any): void;
    getPublicProperties(): {
        code: number;
        data: any;
    };
    /**
     * 设置公共属性
     * 设置后CP无需每次上报都传，由SDK填入properties中。
     */
    setPublicProperties(params: {
        [key: string]: any;
    }): {
        code: any;
        msg: any;
        thirdcode: any;
        thirdmsg: any;
    } | {
        code: number;
    };
    /**
     * 修改设置的公共数据。
     */
    updatePublicProperties(params: {
        [key: string]: any;
    }): {
        code: any;
        msg: any;
        thirdcode: any;
        thirdmsg: any;
    } | {
        code: number;
    };
    /**
     * 删除公共属性
     */
    deletePublicProperties(params: string[]): {
        code: any;
        msg: any;
        thirdcode: any;
        thirdmsg: any;
    } | {
        code: number;
    };
    getShareData(params: RpkgetShareData, callback: RpkMethodParams, stopCallback?: boolean): Promise<any>;
    getShareScheduling(params: {
        funcs?: string[];
    }): {
        code: any;
        msg: any;
        thirdcode: any;
        thirdmsg: any;
    } | {
        code: number;
        data: any;
    };
    shareSchedulingInit(params: RpkReqShareScheduleInit, callback: RpkMethodParams): Promise<void>;
    shareSchedulingReport(params: RpkReqShareScheduleReport, callback: RpkMethodParams): Promise<void>;
    private getInitConfig;
    private publicSubchannelCheck;
    private getAttributionData;
    private checkNeedActivate;
    /**
     * 轮训获取公共属性
     *
     */
    private loopGetPublicProps;
    private getLoginQsAndGenerateStruct;
    private ActivePrefix;
    /**
     * 用于设置子渠道，通行证记录来源（分包）、子渠道参数
     */
    private setSubChannelId;
    getAllBusinessData(callback: RpkMethodParams): Promise<void>;
    getBusinessData(params: RpkReqBusinessData, callback: RpkMethodParams): Promise<void>;
    refreshBusinessData(callback?: RpkMethodParams, isRecord?: boolean): Promise<void>;
    private dispatchBusinessWindowsQueue;
    requestBusinessOrder(params: RpkReqBusinessOrder, callback: RpkMethodParams): Promise<void>;
    private clearPromoterTimer;
    private startPromoterTimer;
    private getPromoDisplayKEY;
    private exchangePromoCDKEY;
    private checkIsPromoter;
    getUserDeviceCode(): string | {
        code: number;
        data: any;
    };
    /**
     * 添加到桌面
     * @param params 说明如下
     * shortcutType 快捷方式类型 1: 动态快捷方式,Android版本大于24才支持,对应iOS的3D touch 2: 常规桌面快捷方式，会新增一个图标 3: 桌面小插件,常见墨迹天气的桌面插件
     * id 快捷方式唯一标识
     * label 快捷方式显示的名称（shortcutType=1 或 2时必填）
     * icon 快捷方式图片网络路径
     * target 快捷方式跳转目标页面（shortcutType=1 或 2时必填）
     * widgetProviderId 桌面小插件唯一标识
     * interceptSuccess 拦截添加快捷方式成功提示（目前只有addShortcut生效）
     * */
    addShortcut(params: any, callback: IMethodParams): Promise<void>;
}
export default SdkFacebook;
