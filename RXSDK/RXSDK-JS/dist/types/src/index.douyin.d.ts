import SdkCommon from '@/rpk/SdkCommon';
declare global {
    var tt: any;
}
declare class SdkDouyin extends SdkCommon {
    private _hasAd;
    private _rewardedVideoAd;
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
    private deviceInfo;
    subChannelId: any;
    private is_promoter;
    private game_id;
    private promoInfo;
    private saveDeviceInfo;
    constructor(initParams: InitRpkParams);
    private needTrackFeedLogin;
    private cacheLoginParams;
    offFeedStatusChange(callback: any): void;
    trackLogin(): void;
    login(params: RpkDouyinLogin, callback: RpkMethodParams): Promise<void>;
    infoSync(callback: RpkMethodParams): Promise<void>;
    pay(params: RpkDouyinPayParam, callback: RpkMethodParams): Promise<void>;
    share(params: RpkDouyinShareParams, callback: RpkMethodParams): Promise<void>;
    schedulingAction(params: any, callback: RpkMethodParams): Promise<void>;
    getAdShareData(params: RpkgetShareData, callback?: RpkMethodParams): Promise<any>;
    rewardedVideoAd(data: RpkDouyinRewardedAdParams, { complete, fail: failCallback }: RpkMethodParams): Promise<void>;
    openCustomServiceForOs(params: RpkDouyinOpenCustomServiceParams, callback: RpkMethodParams): Promise<void>;
    createContactButton(params: RpkDouyinCustomType, callback: RpkMethodParams): Promise<void>;
    openCustomService(params: RpkDouyinOpenCustomServiceParams, callback: RpkMethodParams): Promise<void>;
    authenticateRealName({ complete }: RpkMethodParams): Promise<void>;
    getGameRecorderManager({ complete }: RpkMethodParams): Promise<void>;
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
    private chooseVideo;
    private openAwemeUserProfile;
    private checkFollowAwemeState;
    private setImRankData;
    private getImRankData;
    private getImRankList;
    private createGridGamePanel;
    private requestSubscribeMessage;
    private getUnionGroupInfo;
    private bindUnionGroup;
    private unbindUnionGroup;
    private joinUnionGroup;
    payGift(params: any, callback: RpkMethodParams): Promise<void>;
    private onBuyGift;
    private checkFeedSubscribeStatus;
    private requestFeedSubscribe;
    private reportScene;
}
export default SdkDouyin;
