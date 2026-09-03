import SdkCommon from './utils/huawei/index.common';
declare global {
    var qg: any;
}
declare class SdkClass extends SdkCommon {
    private initConfig;
    private businessRuleDefaultRefreshTime;
    private trackPublicPropsFailCount;
    private _hasAd;
    private _rewardedVideoAd;
    subChannelId: any;
    private _ad;
    private scheduleInitMap;
    private scheuleReportProps;
    private GameRecorderManager;
    private isPromoter;
    private game_id;
    private promoInfo;
    constructor(initParams: ISdkInitParams & {
        publicKey: string;
        appid: string;
    });
    private addFeedback;
    private getFeedbackList;
    private getFeedbackDetail;
    private collectProps;
    private getAnnouncement;
    private clearPromoterTimer;
    private startPromoterTimer;
    private getPromoDisplayKEY;
    private exchangePromoCDKEY;
    private checkIsPromoter;
    /**
     * 用于设置自定义返回错误 Msg
     */
    setErrorMsg(errMsg: any): void;
    /**
     * 清空返回错误 Msg
     */
    clearErrorMsg(): void;
    /**
     * 轮训获取公共属性
     *
     */
    private loopGetPublicProps;
    private getAttributionData;
    private checkNeedActivate;
    private ActivePrefix;
    private publicSubchannelCheck;
    private handleSdkInitCallback;
    switchIsSinglePlayer(status: boolean): Promise<void>;
    multipleTrack(): Promise<void>;
    getInitConfig(callback: IMethodParams): Promise<void>;
    private calculateValueSizeWithEncoding;
    getRxDevicecode(): any;
    infoSync(callback: RpkMethodParams): Promise<void>;
    login(loginParams: huaweiQuickLogin, callback: IMethodParams): Promise<void>;
    getIsAgree(): Promise<any>;
    setIsAgree(flag: boolean): Promise<void>;
    getLoginQsAndGenerateStruct(): any;
    track(params: any, callback: IMethodParams): Promise<void>;
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
    setScheuleReportProps(data: any): void;
    getPublicProperties(): {
        code: number;
        data: any;
    };
    exchangeItemProp(params: any, callback: IMethodParams): Promise<void>;
    pay(params: IpayForHuawei, callback: IMethodParams): Promise<void>;
    supplementaryOrder(productId: string, params: any): Promise<any>;
    private obtainOwnedPurchases;
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
    compensatePayOrder(params: any, callback: {
        complete: (data: any) => void;
    }): Promise<void>;
    schedulingAction(params: any, callback: IMethodParams): Promise<void>;
    getAdShareData(params: IgetShareData, callback?: IMethodParams): Promise<any>;
    rewardedVideoAd(params: {
        adUnitId: string;
        destroyAd?: boolean;
        func?: string;
        custom_ext?: any;
    }, callback: {
        complete?: (data: any) => void;
        fail?: (err: any) => void;
    }): Promise<void>;
    getShareData(params: IgetShareData, callback: IMethodParams, stopCallback?: boolean): Promise<any>;
    shareSchedulingReport(params: IReqShareScheduleReport, callback: IMethodParams): Promise<void>;
    shareSchedulingInit(params: IReqShareScheduleInit, callback: IMethodParams): Promise<void>;
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
    getOperationScene(callback: IMethodParams): Promise<void>;
    reportWindowExposure(properties: {
        [key: string]: any;
    }, callback: IMethodParams): Promise<void>;
    getGameArea(params: {
        area_id: string;
    }, callback: IMethodParams): Promise<void>;
    putGameArea(params: any, callback: IMethodParams): Promise<void>;
    createGameArea(params: any, callback: IMethodParams): Promise<void>;
    delGameArea(params: any, callback: IMethodParams): Promise<void>;
    getGameAreaList(callback: IMethodParams): Promise<void>;
    createGameCharacter(params: any, callback: IMethodParams): Promise<void>;
    putGameCharacter(params: any, callback: IMethodParams): Promise<void>;
    delGameCharacter(params: any, callback: IMethodParams): Promise<void>;
    getGameCharacterAccount(params: any, callback: IMethodParams): Promise<void>;
    getGameCharacter(params: any, callback: IMethodParams): Promise<void>;
    getGameAccountAreaCharacter(params: any, callback: IMethodParams): Promise<void>;
    getEmailList(params: any, callback: IMethodParams): Promise<void>;
    getEmailDetail(params: any, callback: IMethodParams): Promise<void>;
    receiveEmail(params: any, callback: IMethodParams): Promise<void>;
    delEmail(params: any, callback: IMethodParams): Promise<void>;
    setGameInfo(cp_role_id: string, region_tag: string): void;
    searchGameAccount(callback: IMethodParams): Promise<void>;
    request: import("axios").AxiosStatic;
    SYSTEM_INFO: import("@/config").ISystemInfo;
}
export default SdkClass;
