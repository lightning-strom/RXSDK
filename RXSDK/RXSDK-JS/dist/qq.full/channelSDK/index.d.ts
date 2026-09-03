declare class SdkSocial {
    static instance: SdkSocial;
    static get I(): SdkSocial;
    private refreshSession;
    setcustom(params: {
        custom: string;
    }, { complete }: IMethodParams): Promise<void>;
    addRelation(params: IaddRelation, { complete }: IMethodParams): Promise<void>;
    deleteRelation(params: IdeleteRelation, { complete }: IMethodParams): Promise<void>;
    updateremarks(params: Iupdateremarks, { complete }: IMethodParams): Promise<void>;
    hasRelation(params: IHasRelation, { complete }: IMethodParams): Promise<void>;
    relationList(params: Irelationlists, { complete }: IMethodParams): Promise<void>;
    addFriend(params: IaddFriend, { complete }: IMethodParams): Promise<void>;
    delfriend(params: IdeleFriend, { complete }: IMethodParams): Promise<void>;
    updatefriendremarks(params: Iupdatefriendremarks, { complete }: IMethodParams): Promise<void>;
    isfriend(params: Iisfriend, { complete }: IMethodParams): Promise<void>;
    friends({ complete }: IMethodParams): Promise<void>;
    /**
     * 排行榜相关接口
     */
    addscore(params: Iaddscroe, { complete }: IMethodParams): Promise<void>;
    setscore(params: Iaddscroe, { complete }: IMethodParams): Promise<void>;
    queryuserrank(params: queryuserrank, { complete }: IMethodParams): Promise<void>;
    getranklist(params: IgetranklistLimit, { complete }: IMethodParams): Promise<void>;
    friendsrank(params: Igetranklist, { complete }: IMethodParams): Promise<void>;
    /**
     * 开放数据相关接口
     */
    authorizeWxFriendInteraction(callback?: Partial<IMethodParams>): Promise<true | void>;
    getUserInteractiveStorage(params: FriendInteractionStorage, { complete }: IMethodParams): Promise<void>;
    authorizeWxGameClubData(callback?: Partial<IMethodParams>): Promise<true | void>;
    getGameClubData(params: GameClubDataParams, { complete }: IMethodParams): Promise<void>;
    setUserCloudStorage(params: {
        KVDataList: KVData[];
    }, { complete }: IMethodParams): Promise<void>;
    getUserCloudStorage(params: FriendInteractionStorage, { complete }: IMethodParams): Promise<void>;
    removeUserCloudStorage(params: FriendInteractionStorage, { complete }: IMethodParams): Promise<void>;
    getUserCloudStorageKeys({ complete }: IMethodParams): Promise<void>;
    getFriendCloudStorage(params: FriendInteractionStorage, { complete }: IMethodParams): Promise<void>;
    getPotentialFriendList({ complete }: IMethodParams): Promise<void>;
    refreshSessionFunc(): Promise<1 | -1>;
}

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
    validateUnbindCode(params: any, callback: IMethodParams): Promise<void>;
    changePhone(params: any, callback: IMethodParams): Promise<void>;
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
    updateGameVersion(params: any, callback: IMethodParams): Promise<void>;
    checkGameVersion(params: ICheckGameVersion, callback: IMethodParams): Promise<void>;
    checkActivityVersion(params: ICheckActivityVersion, callback: IMethodParams): Promise<void>;
    getFeedbackKindList(callback: IMethodParams): Promise<void>;
    createFeedback(params: IReqCreateFeedback, callback: IMethodParams): Promise<void>;
    satisfactionEvaluation(params: IReqFeedbackEval, callback: IMethodParams): Promise<void>;
    getShortUrl(params: any, callback: IMethodParams): Promise<void>;
    _getInfo(callback: IMethodParams): Promise<void>;
    getTempNotice(callback: IMethodParams): Promise<void>;
    getH5LoginConfig(callback: IMethodParams): Promise<void>;
    tradeQuery(params: any, callback: IMethodParams): Promise<void>;
}

declare class SdkQQ extends SdkCommon {
    private _rewardAd;
    private _bannerAd;
    private _interstitialAd;
    private _hasAd;
    private _userInfoButton;
    private locationInfomation;
    private reportLocationTimer;
    private refreshSession;
    private businessRuleDefaultRefreshTime;
    private businessRulesInfo;
    private businessRuleInvoking;
    private businessWindowsQueue;
    private trackPublicPropsFailCount;
    /**
      * initConfig: SDK初始化配置
      * {
      *    [configKey]: 后端配置结构
      * }
      *
      * 例如：sdkconfig/init
      * {
      * "event_public_attr": {
             "public_attr": {
               "pay_over": ["property1", "scenes_id", "a"],
               "event2": ["property1", "property2"],
               "event3": ["property1", "property2"]
             },
             "refresh": 6000,
             "version": "string"
         }
      *
      * */
    private initConfig;
    private scheduleInitMap;
    private scheuleReportProps;
    subChannelId: any;
    private isPromoter;
    private game_id;
    private promoInfo;
    constructor(initParams: ISdkInitParams);
    private addFeedback;
    private getFeedbackList;
    private getFeedbackDetail;
    private collectProps;
    private getAnnouncement;
    private clearPromoterTimer;
    private startPromoterTimer;
    private getPromoDisplayKEY;
    private exchangePromoCDKEY;
    private publicSubchannelCheck;
    private getInitConfig;
    private getAttributionData;
    private checkNeedActivate;
    private getLoginQsAndGenerateStruct;
    private ActivePrefix;
    /**
     * 用于设置子渠道，通行证记录来源（分包）、子渠道参数
     */
    setSubChannelId(subChannelId: string): any;
    /**
     * 用于设置自定义返回错误 Msg
     */
    setErrorMsg(errMsg: any): void;
    /**
     * 清空返回错误 Msg
     */
    clearErrorMsg(): void;
    login(params: ILoginQQ, callback: IMethodParams): Promise<void>;
    authorize(params: ILoginQQ, callback: IMethodParams): Promise<any>;
    private _login;
    pay(params: IPayQQ, callback: IMethodParams): Promise<void>;
    order(params: IPayQQ, { complete }: IMethodParams): Promise<void>;
    refreshSessionFunc(): Promise<any>;
    setScheuleReportProps(data: any): void;
    getShareData(params: IGetShareData, callback: IMethodParams, stopCallback?: boolean): Promise<any>;
    share(params: IGetShareData, { complete }: IMethodParams): Promise<void>;
    track(callback: IMethodParams, params: trackParams): Promise<void>;
    getAllBusinessData(callback: IMethodParams): Promise<void>;
    getBusinessData(params: IReqBusinessData, callback: IMethodParams): Promise<void>;
    refreshBusinessData(callback?: IMethodParams, isRecord?: boolean): Promise<void>;
    private dispatchBusinessWindowsQueue;
    requestBusinessOrder(params: IReqBusinessOrder, callback: IMethodParams): Promise<void>;
    infoSync({ complete }: IMethodParams, params: ISyncUserInfo): Promise<void>;
    isAuthorizeUserInfo({ complete }: IMethodParams): Promise<void>;
    cancelUserInfoAuthorize(): Promise<void>;
    /**
     * 广告相关接口
     */
    rewardedVideoAd(data: IRequestAdData, { complete }: IMethodParams): Promise<void>;
    bannerAd(data: IRequestBannerAd, { complete }: IMethodParams): Promise<void>;
    hasAd(type?: AdTypes): boolean | undefined;
    getAd(type?: AdTypes): WechatMinigame.RewardedVideoAd | WechatMinigame.BannerAd | WechatMinigame.InterstitialAd | null;
    shareSchedulingInit(params: IReqShareScheduleInit, callback: IMethodParams): Promise<void>;
    getShareScheduling(params: {
        funcs?: string[];
    }): any;
    shareSchedulingReport(params: IReqShareScheduleReport, callback: IMethodParams): Promise<void>;
    /**
     * 地理位置相关接口
     */
    handleLocation(): Promise<any>;
    authorizeLocation(callback?: Partial<IMethodParams>): Promise<any>;
    reportLocationHttpFun(params: IReportLocation, callback?: Partial<IMethodParams>): Promise<any>;
    startReportLoaction(params: IReportLocation, { complete }: IMethodParams): Promise<void>;
    stopReportLocation(): void;
    deleteReportLocation(params: IReqDelReportLocation, { complete }: IMethodParams): Promise<void>;
    getNearlyPeasonByRadius(params: IReqNearlyPeason, { complete }: IMethodParams): Promise<void>;
    /**
     * 轮训获取公共属性
     *
     */
    private loopGetPublicProps;
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
    getPublicProperties(): {
        code: number;
        data: any;
    };
}

declare class SdkQQFull extends SdkQQ {
    constructor(initParams: ISdkInitParams);
    static get social(): SdkSocial;
    setcustom(params: {
        custom: string;
    }, callback: IMethodParams): Promise<void>;
    addRelation(params: IaddRelation, callback: IMethodParams): Promise<void>;
    deleteRelation(params: IdeleteRelation, callback: IMethodParams): Promise<void>;
    updateremarks(params: Iupdateremarks, callback: IMethodParams): Promise<void>;
    hasRelation(params: IHasRelation, callback: IMethodParams): Promise<void>;
    relationList(params: Irelationlists, callback: IMethodParams): Promise<void>;
    addFriend(params: IaddFriend, callback: IMethodParams): Promise<void>;
    delfriend(params: IdeleFriend, callback: IMethodParams): Promise<void>;
    updatefriendremarks(params: Iupdatefriendremarks, callback: IMethodParams): Promise<void>;
    isfriend(params: Iisfriend, callback: IMethodParams): Promise<void>;
    friends(callback: IMethodParams): Promise<void>;
    addscore(params: Iaddscroe, callback: IMethodParams): Promise<void>;
    setscore(params: Iaddscroe, callback: IMethodParams): Promise<void>;
    queryuserrank(params: queryuserrank, callback: IMethodParams): Promise<void>;
    getranklist(params: IgetranklistLimit, callback: IMethodParams): Promise<void>;
    friendsrank(params: Igetranklist, callback: IMethodParams): Promise<void>;
}

export { SdkQQFull as default };
