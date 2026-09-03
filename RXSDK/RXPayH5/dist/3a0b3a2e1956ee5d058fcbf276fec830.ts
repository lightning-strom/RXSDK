declare class SdkCommon {
    constructor();
    setcustom(params: {
        custom: string;
    }, { complete }: H5MethodParams): Promise<void>;
    addRelation(params: H5addRelation, { complete }: H5MethodParams): Promise<void>;
    deleteRelation(params: H5deleteRelation, { complete }: H5MethodParams): Promise<void>;
    updateremarks(params: H5updateremarks, { complete }: H5MethodParams): Promise<void>;
    hasRelation(params: H5HasRelation, { complete }: H5MethodParams): Promise<void>;
    relationList(params: H5relationlists, { complete }: H5MethodParams): Promise<void>;
    addFriend(params: H5addFriend, { complete }: H5MethodParams): Promise<void>;
    delfriend(params: H5deleFriend, { complete }: H5MethodParams): Promise<void>;
    updatefriendremarks(params: H5updatefriendremarks, { complete }: H5MethodParams): Promise<void>;
    isfriend(params: H5isfriend, { complete }: H5MethodParams): Promise<void>;
    friends({ complete }: H5MethodParams): Promise<void>;
    /**
     * 排行榜相关接口
     */
    addscore(params: H5addscroe, { complete }: H5MethodParams): Promise<void>;
    setscore(params: H5addscroe, { complete }: H5MethodParams): Promise<void>;
    queryuserrank(params: queryuserrank, { complete }: H5MethodParams): Promise<void>;
    getranklist(params: H5getranklistLimit, { complete }: H5MethodParams): Promise<void>;
    friendsrank(params: H5getranklist, { complete }: H5MethodParams): Promise<void>;
    /**
     * 帮助中心
     */
    getHelpcenterMainLayout({ complete }: H5MethodParams): Promise<void>;
    getHelpcenterQuestionLayout(params: H5HelpcenterQuestionReq, { complete }: H5MethodParams): Promise<void>;
    getHelpcenterInfoLayout(params: H5HelpcenterQuestionReq, { complete }: H5MethodParams): Promise<void>;
    helpcenterResolution(params: HelpcenterResolution, { complete }: H5MethodParams): Promise<void>;
    /**
     * 玩家意见反馈
     */
    private addFeedback;
    private getFeedbackList;
    private getFeedbackDetail;
    private collectProps;
    private getAnnouncement;
    /**
     * 用于设置自定义返回错误 Msg
     */
    setErrorMsg(errMsg: [key: string]): void;
    /**
     * 清空返回错误 Msg
     */
    clearErrorMsg(): void;
    sendCaptcha(params: H5sendCaptcha, callback: H5MethodParams): Promise<void>;
    bindPhone(params: H5BindPhone, callback: H5MethodParams): Promise<void>;
    unBindPhone(params: H5unBindPhone, callback: H5MethodParams): Promise<void>;
    bindEmail(params: H5BindEmail, callback: H5MethodParams): Promise<void>;
    UnbindEmail(params: H5unBindEmail, callback: H5MethodParams): Promise<void>;
    deregister(params: any, callback: H5MethodParams): Promise<void>;
    deregisterCancel(callback: H5MethodParams): Promise<void>;
    getInfo(callback: H5MethodParams): Promise<void>;
    updateInfo(params: any, callback: H5MethodParams): Promise<void>;
    checkAppVersion(params: H5CheckAppVersion, callback: H5MethodParams): Promise<void>;
    checkVersion(params: H5CheckVersion, callback: H5MethodParams): Promise<void>;
    checkGameVersion(params: H5CheckGameVersion, callback: H5MethodParams): Promise<void>;
    checkActivityVersion(params: H5CheckActivityVersion, callback: H5MethodParams): Promise<void>;
}

declare global {
    var VNGGamesSDK: any;
}
declare class SdkH5Vng extends SdkCommon {
    private vng_userid;
    private businessRuleDefaultRefreshTime;
    private businessRulesInfo;
    private businessRuleInvoking;
    private businessWindowsQueue;
    private trackPublicPropsFailCount;
    private funcs;
    private initConfig;
    private scheduleInitMap;
    private scheuleReportProps;
    subChannelId: any;
    private is_promoter;
    private game_id;
    private promoInfo;
    constructor(initParams: InitH5Params);
    private login;
    pay(params: H5VngPayParam, callback: H5MethodParams): Promise<void>;
    private rewardedVideoAd;
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
    }): any;
    /**
     * 修改设置的公共数据。
     */
    updatePublicProperties(params: {
        [key: string]: any;
    }): any;
    /**
     * 删除公共属性
     */
    deletePublicProperties(params: string[]): any;
    getShareData(params: H5getShareData, callback: H5MethodParams, stopCallback?: boolean): Promise<any>;
    getShareScheduling(params: {
        funcs?: string[];
    }): any;
    shareSchedulingInit(params: H5ReqShareScheduleInit, callback: H5MethodParams): Promise<void>;
    shareSchedulingReport(params: H5ReqShareScheduleReport, callback: H5MethodParams): Promise<void>;
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
    private loadScript;
    getAllBusinessData(callback: H5MethodParams): Promise<void>;
    getBusinessData(params: H5ReqBusinessData, callback: H5MethodParams): Promise<void>;
    refreshBusinessData(callback?: H5MethodParams, isRecord?: boolean): Promise<void>;
    private dispatchBusinessWindowsQueue;
    requestBusinessOrder(params: H5ReqBusinessOrder, callback: H5MethodParams): Promise<void>;
    private track;
    private clearPromoterTimer;
    private startPromoterTimer;
    private getPromoDisplayKEY;
    private exchangePromoCDKEY;
    private checkIsPromoter;
}

export { SdkH5Vng as default };
