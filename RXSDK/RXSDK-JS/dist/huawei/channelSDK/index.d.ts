import * as __config from '@/config';
import * as axios from 'axios';

declare class SdkFeedback {
    static instance: SdkFeedback;
    static get I(): SdkFeedback;
    getFeedbackKindList({ complete }: IMethodParams): Promise<void>;
    createFeedback(params: IReqCreateFeedback, { complete }: IMethodParams): Promise<void>;
    satisfactionEvaluation(params: IReqFeedbackEval, { complete }: IMethodParams): Promise<void>;
}

declare class SdkCommon {
    static get feedback(): SdkFeedback;
    constructor(initParams: ISdkInitParams);
    sendCaptcha(params: IsendCaptcha, callback: IMethodParams): Promise<void>;
    bindPhone(params: IBindPhone, callback: IMethodParams): Promise<void>;
    unBindPhone(params: IunBindPhone, callback: IMethodParams): Promise<void>;
    bindEmail(params: IBindEmail, callback: IMethodParams): Promise<void>;
    UnbindEmail(params: IunBindEmail, callback: IMethodParams): Promise<void>;
    deregister(params: any, callback: IMethodParams): Promise<void>;
    deregisterCancel(CPcallback: IMethodParams): Promise<void>;
    getInfo(CPcallback: IMethodParams): Promise<void>;
    getUserInfoByField(params: any, callback: IMethodParams): Promise<void>;
    updateInfo(params: any, callback: IMethodParams): Promise<void>;
    checkAppVersion(params: ICheckAppVersion, callback: IMethodParams): Promise<void>;
    checkVersion(params: ICheckVersion, callback: IMethodParams): Promise<void>;
    checkGameVersion(params: ICheckGameVersion, callback: IMethodParams): Promise<void>;
    checkActivityVersion(params: ICheckActivityVersion, callback: IMethodParams): Promise<void>;
    getFeedbackKindList(callback: IMethodParams): Promise<void>;
    createFeedback(params: IReqCreateFeedback, callback: IMethodParams): Promise<void>;
    satisfactionEvaluation(params: IReqFeedbackEval, callback: IMethodParams): Promise<void>;
    getTempNotice(callback: IMethodParams): Promise<void>;
    getH5LoginConfig(callback: IMethodParams): Promise<void>;
    tradeQuery(params: any, callback: IMethodParams): Promise<void>;
}

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
    request: axios.AxiosStatic;
    SYSTEM_INFO: __config.ISystemInfo;
}

export { SdkClass as default };
