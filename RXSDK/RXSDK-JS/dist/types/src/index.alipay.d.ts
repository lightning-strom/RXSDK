import SdkCommon from '@/rpk/SdkCommon';
declare global {
    var my: any;
}
declare class SdkAlipay extends SdkCommon {
    private funcs;
    private isPromoter;
    private businessRuleDefaultRefreshTime;
    private businessRulesInfo;
    private businessRuleInvoking;
    private businessWindowsQueue;
    private trackPublicPropsFailCount;
    private initConfig;
    private scheduleInitMap;
    private scheuleReportProps;
    subChannelId: any;
    private is_promoter;
    private game_id;
    private promoInfo;
    constructor(initParams: InitRpkParams);
    infoSync(callback: RpkMethodParams): Promise<void>;
    login(params: RpkAlipayLogin, callback: RpkMethodParams): Promise<void>;
    compensatePayOrder(params: any, callback: RpkMethodParams): Promise<void>;
    checkHasCompensatePayOrder(): {
        code: number;
        msg: string;
        data: null;
        check?: undefined;
    } | {
        code: number;
        msg: string;
        check: never;
        data?: undefined;
    };
    pay(params: RpkAlipayPayParam, callback: RpkMethodParams): Promise<void>;
    share(params: RpkAlipayShareParams, callback: IMethodParams): Promise<void>;
    schedulingAction(params: any, callback: RpkMethodParams): Promise<void>;
    getAdShareData(params: RpkgetShareData, callback?: RpkMethodParams): Promise<any>;
    rewardedVideoAd(data: RpkRewardedAdParams, { complete, fail: failCallback }: RpkMethodParams): Promise<void>;
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
    private requestSubscribeMessage;
}
export default SdkAlipay;
