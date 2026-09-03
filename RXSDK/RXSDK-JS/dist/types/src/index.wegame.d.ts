import SdkCommon from './index.common';
import { doRequest } from './api/request';
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
export default SdkWegame;
