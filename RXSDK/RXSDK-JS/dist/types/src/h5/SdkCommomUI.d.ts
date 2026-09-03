declare class SdkCommonUI {
    private platform;
    constructor(platform: string);
    initConfig: any;
    private getDeviceCode;
    /**
     * 检测是否是微信浏览器
     */
    isWeChatBrowser(): boolean;
    isMobileWechat(): boolean;
    private orientation;
    private isMobile;
    private checkOrientation;
    private getIframeSrc;
    private getInitParams;
    createModalIframe(params: {
        path: string;
        base?: string;
        initParams?: any;
        loginParams?: any;
        backgroundColor?: string;
        theme?: string;
        game_user_id?: string;
        protocol?: any;
    }): Promise<any>;
    openAgreement(params: {
        agreementKey: string;
        agreementTitle: string;
    }): Promise<any>;
    openProtocol(params: {
        protocol: any;
    }): Promise<any>;
    openPay(params: {
        url: string;
        hq_type?: string;
        pay_type?: string;
    }): Promise<any>;
    private game_user_id;
    private theme;
    openHelpCenter(params: {
        theme?: string;
        game_user_id?: string;
    }): Promise<any>;
    openService(params: {
        from_application?: string;
        theme?: string;
        game_user_id?: string;
        default_lang?: string;
    }): Promise<any>;
    h5Login(loginParams: any): Promise<any>;
    realName(callback?: H5MethodParams): Promise<any>;
    forgetPassword(callback?: H5MethodParams): Promise<any>;
    resetPassword(callback?: H5MethodParams): Promise<any>;
    logoffH5Preview(callback?: H5MethodParams): Promise<any>;
    logoff(callback?: H5MethodParams): Promise<any>;
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
export default SdkCommonUI;
