declare class SdkCommon {
    private platform;
    constructor(platform: string);
    private getDeviceCode;
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
    changePhone(params: any, callback: H5MethodParams): Promise<void>;
    changeEmail(params: any, callback: H5MethodParams): Promise<void>;
    UnbindEmail(params: H5unBindEmail, callback: H5MethodParams): Promise<void>;
    deregister(params: any, callback: H5MethodParams): Promise<void>;
    deregisterCancel(callback: H5MethodParams): Promise<void>;
    getInfo(callback: H5MethodParams): Promise<void>;
    getUserInfoByField(params: any, callback: H5MethodParams): Promise<void>;
    updateInfo(params: any, callback: H5MethodParams): Promise<void>;
    checkAppVersion(params: H5CheckAppVersion, callback: H5MethodParams): Promise<void>;
    checkVersion(params: H5CheckVersion, callback: H5MethodParams): Promise<void>;
    checkGameVersion(params: H5CheckGameVersion, callback: H5MethodParams): Promise<void>;
    checkActivityVersion(params: H5CheckActivityVersion, callback: H5MethodParams): Promise<void>;
    private calculateValueSizeWithEncoding;
    track(params: any, callback: any): Promise<void>;
    multipleTrack(): Promise<void>;
    getOperationScene(callback: H5MethodParams): Promise<void>;
    reportWindowExposure(properties: {
        [key: string]: any;
    }, callback: H5MethodParams): Promise<void>;
    getGameArea(params: {
        area_id: string;
    }, callback: H5MethodParams): Promise<void>;
    putGameArea(params: any, callback: H5MethodParams): Promise<void>;
    createGameArea(params: any, callback: H5MethodParams): Promise<void>;
    delGameArea(params: any, callback: H5MethodParams): Promise<void>;
    getGameAreaList(callback: H5MethodParams): Promise<void>;
    createGameCharacter(params: any, callback: H5MethodParams): Promise<void>;
    putGameCharacter(params: any, callback: H5MethodParams): Promise<void>;
    delGameCharacter(params: any, callback: H5MethodParams): Promise<void>;
    getGameCharacterAccount(params: any, callback: H5MethodParams): Promise<void>;
    getGameCharacter(params: any, callback: H5MethodParams): Promise<void>;
    getGameAccountAreaCharacter(params: any, callback: H5MethodParams): Promise<void>;
    exchangeItemProp(params: any, callback: H5MethodParams): Promise<void>;
    getDevicecode(): any;
    getEmailList(params: any, callback: IMethodParams): Promise<void>;
    getEmailDetail(params: any, callback: IMethodParams): Promise<void>;
    receiveEmail(params: any, callback: IMethodParams): Promise<void>;
    delEmail(params: any, callback: IMethodParams): Promise<void>;
    updateGameVersion(params: any, callback: IMethodParams): Promise<void>;
    private setCpOf;
    private getCpOf;
    setGameInfo(cp_role_id: string, region_tag: string): void;
    searchGameAccount(callback: IMethodParams): Promise<void>;
    getTempNotice(callback: IMethodParams): Promise<void>;
    getH5LoginConfig(callback: IMethodParams): Promise<void>;
    tradeQuery(params: any, callback: IMethodParams): Promise<void>;
    setLanguage(language?: string): void;
}

declare global {
    var qg: any;
}
declare class SdkH5Xiaomi extends SdkCommon {
    _hasAd: {
        ['rewarded']: boolean | undefined;
    };
    _ad: any | null;
    private _rewardedVideoAd;
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
    infoSync(callback: RpkMethodParams): Promise<void>;
    private login;
    pay(params: H5XiaomiPayParam, callback: H5MethodParams): Promise<void>;
    schedulingAction(params: any, callback: H5MethodParams): Promise<void>;
    getAdShareData(params: H5getShareData, callback?: H5MethodParams): Promise<any>;
    rewardedVideoAd(data: any, { complete, fail }: H5MethodParams): Promise<void>;
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
    getShareData(params: H5getShareData, callback: H5MethodParams, stopCallback?: boolean): Promise<any>;
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
    getAllBusinessData(callback: H5MethodParams): Promise<void>;
    getBusinessData(params: H5ReqBusinessData, callback: H5MethodParams): Promise<void>;
    refreshBusinessData(callback?: H5MethodParams, isRecord?: boolean): Promise<void>;
    private dispatchBusinessWindowsQueue;
    requestBusinessOrder(params: H5ReqBusinessOrder, callback: H5MethodParams): Promise<void>;
    private clearPromoterTimer;
    private startPromoterTimer;
    private getPromoDisplayKEY;
    private exchangePromoCDKEY;
    private checkIsPromoter;
    saveToDestop(message: string | null, callback: IMethodParams): void;
    exit(callback: IMethodParams): void;
}

export { SdkH5Xiaomi as default };
