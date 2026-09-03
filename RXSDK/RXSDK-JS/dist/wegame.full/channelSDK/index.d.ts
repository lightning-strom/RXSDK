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

declare function doRequest(options: any, urlIndex?: number, refreshNum?: number, enableHttpDNS?: boolean): Promise<any>;

declare class SdkWegame extends SdkCommon {
    private _ad;
    private _bannerAd;
    private _interstitialAd;
    private _hasAd;
    private locationInfomation;
    private reportLocationTimer;
    private refreshSession;
    private trackPublicPropsFailCount;
    private funcs;
    private back_flow_day;
    private directAdStatus;
    private directAdGdtReportQueue;
    private initConfig;
    private scheduleInitMap;
    private scheuleReportProps;
    requestInstance: typeof doRequest;
    private queryPoster;
    private isSupportGDTReport;
    subChannelId: any;
    private dataTrackType;
    private deviceInfo;
    /**
     * 是否登录
     * 使用场景：登录后不允许通过SDK设置子渠道id
     */
    private isLogin;
    private isPromoter;
    private game_id;
    private promoInfo;
    private saveDeviceInfo;
    constructor(initParams: ISdkInitParams);
    private addFeedback;
    private getPhoneNumber;
    private changePhoneNumber;
    private getFeedbackList;
    private getFeedbackDetail;
    private collectProps;
    private getAnnouncement;
    private clearPromoterTimer;
    private startPromoterTimer;
    private getPromoDisplayKEY;
    private exchangePromoCDKEY;
    private checkIsPromoter;
    private publicSubchannelCheck;
    getDirectAdStatusSync(): any;
    onDirectAdStatusChange(listener: (res: any) => void): void;
    private normalizeDirectAdStatus;
    private getDirectAdStatusParams;
    private withDirectAdStatus;
    private withDirectAdBigdataExt;
    private trackDirectAdStatus;
    private reportOrQueueDirectAdGdtEvent;
    private flushDirectAdGdtReportQueue;
    private handleDirectAdStatus;
    private setupDirectAdStatus;
    private getInitConfig;
    private setCpOf;
    private getCpOf;
    private getAttributionData;
    private checkNeedActivate;
    private getLoginQsAndGenerateStruct;
    private ActivePrefix;
    /**
     * 用于设置子渠道，通行证记录来源（分包）、子渠道参数
     */
    setSubChannelId(subChannelId: string): {
        thirdexception: any;
        thirdmsg?: any;
        thirdcode?: any;
        code: any;
        msg: any;
    } | {
        code: number;
        msg: string;
    } | {
        code: number;
        msg?: undefined;
    };
    /**
     * 用于设置自定义返回错误 Msg
     */
    setErrorMsg(errMsg: any): void;
    /**
     * 清空返回错误 Msg
     */
    clearErrorMsg(): void;
    login(params: WegameLogin, callback: IMethodParams): Promise<any>;
    authorize(params: WegameLogin, callback: IMethodParams): Promise<any>;
    setScheuleReportProps(data: any): void;
    getQueryPoster(callback: IMethodParams): void;
    getShareData(params: IgetShareData, callback: IMethodParams, stopCallback?: boolean): Promise<any>;
    isImageUrl(url: any): boolean;
    downloadImage(imageUrl: string): Promise<unknown>;
    getMessageToFriendQuery(): {
        query: any;
        shareMessageToFriendScene: any;
    };
    fetchMessageToFriendQuery(callback: IMethodParams): Promise<void>;
    shareMessageToFriend(params: IgetShareData & {
        openId?: string;
        shareMessageToFriendScene: number;
    }, callback: IMethodParams): Promise<void>;
    showShareImageMenu(params: IgetShareData & {
        needShowEntrance: boolean;
        style: 'default' | 'v2';
    }, callback: IMethodParams): Promise<void>;
    share(params: IgetShareData, callback: IMethodParams): Promise<void>;
    sharePoster(params: IgetShareData, callback: IMethodParams): Promise<void>;
    handleShareImageMenu(imageUrl: any, needShowEntrance: boolean | undefined, callback: IMethodParams): void;
    compensatePayOrder(params: any, callback: IMethodParams): Promise<void>;
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
    exchangeItemProp(params: any, callback: IMethodParams): Promise<void>;
    requestMerchantTransfer(params: any, callback: IMethodParams): void;
    getRelationFriendList(params: {
        guideAuthWhenDeny?: boolean | undefined;
        authModalTitle?: string | undefined;
        authModalContent?: string | undefined;
        cp_user_id?: string | undefined;
        raw_data?: string | undefined;
    } | undefined, callback: IMethodParams): void;
    pay(params: Ipay, callback: IMethodParams): Promise<void>;
    _openCustomerServiceConversation({ complete }: Partial<IMethodParams>, { params, desc, func, title, image, reconfirm, sessionFrom }: ConversationParams, showMessageCard?: boolean): Promise<{}>;
    schedulingAction(params: any, callback: RpkMethodParams): Promise<void>;
    getAdShareData(params: IgetShareData, callback?: IMethodParams): Promise<any>;
    createCustomAd(data: any, { complete, fail: failCallback }: IMethodParams): Promise<void>;
    rewardedVideoAd(data: IRequestAdData, { complete, fail: failCallback }: IMethodParams): Promise<void>;
    interstitialAd(data: any, { complete }: IMethodParams): Promise<void>;
    bannerAd(data: IRequestBannerAd, { complete }: IMethodParams): Promise<void>;
    shareSchedulingInit(params: IReqShareScheduleInit, callback: IMethodParams): Promise<void>;
    getShareScheduling(params: {
        funcs?: string[];
    }): {
        thirdexception: any;
        thirdmsg?: any;
        thirdcode?: any;
        code: any;
        msg: any;
    } | {
        code: number;
        data: any;
    };
    shareSchedulingReport(params: IReqShareScheduleReport, callback: IMethodParams): Promise<void>;
    refreshSessionFunc(): Promise<1 | -1>;
    infoSync(CPcallback: IMethodParams, info: any): Promise<void>;
    userInfoSilentSync(CPcallback: IMethodParams, info: any): Promise<void>;
    _userInfoSilentSync(callback: IMethodParams, info: any): Promise<void>;
    handleLoacation(): Promise<any>;
    authorizeLocation(callback?: Partial<IMethodParams>): Promise<any>;
    reportLocationHttpFun(params: IreportLoaction, callback?: Partial<IMethodParams>): Promise<any>;
    startReportLoaction(params: IreportLoaction, { complete }: IMethodParams): Promise<void>;
    stopReportLocation(): void;
    deleteReportLocation(params: IreqdeleteReportLocation, { complete }: IMethodParams): Promise<void>;
    getNearlyPeasonByRadius(params: IreqNearlyPeason, { complete }: IMethodParams): Promise<void>;
    track(callback: IMethodParams, params: trackParams): Promise<void>;
    dataTrack(callback: IMethodParams, params: trackParams): Promise<void>;
    msgSecCheck(params: OmitMegSecCheck, callback: IMethodParams): Promise<void>;
    mediaCheckAsync(params: IReqMediaCheckAsync, callback: IMethodParams): Promise<void>;
    /**
     * 设置公共属性
     * 设置后CP无需每次上报都传，由SDK填入properties中。
     */
    setPublicProperties(params: {
        [key: string]: any;
    }): {
        thirdexception: any;
        thirdmsg?: any;
        thirdcode?: any;
        code: any;
        msg: any;
    } | {
        code: number;
    };
    /**
     * 修改设置的公共数据。
     */
    updatePublicProperties(params: {
        [key: string]: any;
    }): {
        thirdexception: any;
        thirdmsg?: any;
        thirdcode?: any;
        code: any;
        msg: any;
    } | {
        code: number;
    };
    /**
     * 删除公共属性
     */
    deletePublicProperties(params: string[]): {
        thirdexception: any;
        thirdmsg?: any;
        thirdcode?: any;
        code: any;
        msg: any;
    } | {
        code: number;
    };
    getPublicProperties(): {
        code: number;
        data: any;
    };
    decryptionDate(params: {
        encrypted_data: string;
        iv: string;
    }, { complete }: IMethodParams): Promise<void>;
    getUserDeviceCode(): string | {
        code: number;
        data: any;
    };
    tencent_sdk: any;
    private getHeaders;
    private initTencentSdk;
    private reportAddToFavorites;
    private reportShareAppMessage;
    private reportPurchase;
    private _reportPurchase;
    private compareVersions;
    private getOrderStatus;
    private reportPurchaseByCache;
    private reportRegister;
    private reportGdtLogin;
    private reportGdt;
    private reportCreateRole;
    private reportTutorialFinish;
    private reportReActive;
    private reportUpdateLevel;
    private reportViewContent;
    create_conn: boolean;
    socket_task: any;
    HEARTBEAT_INTERVAL: number;
    heartbeat_timer: any;
    MAX_CONNECT_NUMBER: number;
    socket_connect_number: number;
    RECONNECT_INTERVAL: number;
    socket_index: number;
    socket_ws_list: string[];
    reconnecting: boolean;
    no_more_reconnection: boolean;
    private initWebSocket;
    private connectWebSocket;
    private startHeartbeat;
    private disconnectWebSocket;
    private activeWebSocket;
    private reconnectWebSocket;
    private socketTaskSend;
    private requestSubscribeMessage;
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
    getDynamicShareActivityId(callback: IMethodParams): any;
    setDynamicShareMsg(params: {
        activity_id: string;
        target_state: 0 | 1;
        isPrivateMessage: boolean;
        withShareTicket: boolean;
        member_count: number;
        room_limit: number;
        path: string;
        version_type: 'develop' | 'trial' | 'release';
    }, callback: IMethodParams): Promise<void>;
    createActivityId(params: {
        isPrivateMessage: boolean;
    }, callback: IMethodParams): Promise<void>;
    dynamicShare(params: IgetShareData & {
        activity_id: string;
        withShareTicket: boolean;
        member_count: number;
        room_limit: number;
    }, callback: IMethodParams): Promise<void>;
    setGameInfo(cp_role_id: string, region_tag: string): void;
    searchGameAccount(callback: IMethodParams): Promise<void>;
    private openChatTool;
    private isChatTool;
    private exitChatTool;
    chatToolShare(params: IgetShareData & {
        activity_id: string;
        title?: string;
        imageUrl?: string;
        path?: string;
        withShareTicket?: boolean;
        chooseType?: number;
        members?: any[];
        templateId?: '';
    }, callback: IMethodParams): Promise<void>;
    private selectGroupMembers;
    checkIsChatToolEnter(callback: IMethodParams): boolean;
    private getGroupEnterInfo;
    private getChatToolInfo;
    private chatToolMsgSend;
}

declare class SdkHelpcenter {
    static instance: SdkHelpcenter;
    static get I(): SdkHelpcenter;
    getHelpcenterMainLayout({ complete }: IMethodParams): Promise<void>;
    getHelpcenterQuestionLayout(params: HelpcenterQuestionReq, { complete }: IMethodParams): Promise<void>;
    getHelpcenterInfoLayout(params: HelpcenterQuestionReq, { complete }: IMethodParams): Promise<void>;
    helpcenterResolution(params: HelpcenterResolution, { complete }: IMethodParams): Promise<void>;
}

declare class SdkWegameFull extends SdkWegame {
    constructor(initParams: ISdkInitParams);
    static get social(): SdkSocial;
    static get helpcenter(): SdkHelpcenter;
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
    getUserInteractiveStorage(params: FriendInteractionStorage, callback: IMethodParams): Promise<void>;
    getGameClubData(params: GameClubDataParams, callback: IMethodParams): Promise<void>;
    setUserCloudStorage(params: {
        KVDataList: KVData[];
    }, callback: IMethodParams): Promise<void>;
    getUserCloudStorage(params: FriendInteractionStorage, callback: IMethodParams): Promise<void>;
    removeUserCloudStorage(params: FriendInteractionStorage, callback: IMethodParams): Promise<void>;
    getUserCloudStorageKeys(callback: IMethodParams): Promise<void>;
    getFriendCloudStorage(params: FriendInteractionStorage, callback: IMethodParams): Promise<void>;
    getPotentialFriendList(callback: IMethodParams): Promise<void>;
    getHelpcenterMainLayout(callback: IMethodParams): Promise<void>;
    getHelpcenterQuestionLayout(params: HelpcenterQuestionReq, callback: IMethodParams): Promise<void>;
    getHelpcenterInfoLayout(params: HelpcenterQuestionReq, callback: IMethodParams): Promise<void>;
    helpcenterResolution(params: HelpcenterResolution, callback: IMethodParams): Promise<void>;
}

export { SdkWegameFull as default };
