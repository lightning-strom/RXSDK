declare class SdkCommon {
    private platform;
    constructor(platform: string);
    setcustom(params: {
        custom: string;
    }, { complete }: RpkMethodParams): Promise<void>;
    addRelation(params: RpkaddRelation, { complete }: RpkMethodParams): Promise<void>;
    deleteRelation(params: RpkdeleteRelation, { complete }: RpkMethodParams): Promise<void>;
    updateremarks(params: Rpkupdateremarks, { complete }: RpkMethodParams): Promise<void>;
    hasRelation(params: RpkHasRelation, { complete }: RpkMethodParams): Promise<void>;
    relationList(params: Rpkrelationlists, { complete }: RpkMethodParams): Promise<void>;
    addFriend(params: RpkaddFriend, { complete }: RpkMethodParams): Promise<void>;
    delfriend(params: RpkdeleFriend, { complete }: RpkMethodParams): Promise<void>;
    updatefriendremarks(params: Rpkupdatefriendremarks, { complete }: RpkMethodParams): Promise<void>;
    isfriend(params: Rpkisfriend, { complete }: RpkMethodParams): Promise<void>;
    friends({ complete }: RpkMethodParams): Promise<void>;
    /**
     * 排行榜相关接口
     */
    addscore(params: Rpkaddscroe, { complete }: RpkMethodParams): Promise<void>;
    setscore(params: Rpkaddscroe, { complete }: RpkMethodParams): Promise<void>;
    queryuserrank(params: queryuserrank, { complete }: RpkMethodParams): Promise<void>;
    getranklist(params: RpkgetranklistLimit, { complete }: RpkMethodParams): Promise<void>;
    friendsrank(params: Rpkgetranklist, { complete }: RpkMethodParams): Promise<void>;
    /**
     * 帮助中心
     */
    getHelpcenterMainLayout({ complete }: RpkMethodParams): Promise<void>;
    getHelpcenterQuestionLayout(params: RpkHelpcenterQuestionReq, { complete }: RpkMethodParams): Promise<void>;
    getHelpcenterInfoLayout(params: RpkHelpcenterQuestionReq, { complete }: RpkMethodParams): Promise<void>;
    helpcenterResolution(params: HelpcenterResolution, { complete }: RpkMethodParams): Promise<void>;
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
    sendCaptcha(params: RpksendCaptcha, callback: RpkMethodParams): Promise<void>;
    bindPhone(params: RpkBindPhone, callback: RpkMethodParams): Promise<void>;
    unBindPhone(params: RpkunBindPhone, callback: RpkMethodParams): Promise<void>;
    bindEmail(params: RpkBindEmail, callback: RpkMethodParams): Promise<void>;
    UnbindEmail(params: RpkunBindEmail, callback: RpkMethodParams): Promise<void>;
    deregister(params: any, callback: RpkMethodParams): Promise<void>;
    deregisterCancel(callback: RpkMethodParams): Promise<void>;
    getInfo(callback: RpkMethodParams): Promise<void>;
    updateInfo(params: any, callback: RpkMethodParams): Promise<void>;
    checkAppVersion(params: RpkCheckAppVersion, callback: RpkMethodParams): Promise<void>;
    checkVersion(params: RpkCheckVersion, callback: RpkMethodParams): Promise<void>;
    checkGameVersion(params: RpkCheckGameVersion, callback: RpkMethodParams): Promise<void>;
    checkActivityVersion(params: RpkCheckActivityVersion, callback: RpkMethodParams): Promise<void>;
    track(params: any, callback: any): Promise<void>;
    getOperationScene(callback: RpkMethodParams): Promise<void>;
    reportWindowExposure(properties: {
        [key: string]: any;
    }, callback: RpkMethodParams): Promise<void>;
    getGameArea(params: {
        area_id: string;
    }, callback: RpkMethodParams): Promise<void>;
    putGameArea(params: any, callback: RpkMethodParams): Promise<void>;
    createGameArea(params: any, callback: RpkMethodParams): Promise<void>;
    delGameArea(params: any, callback: RpkMethodParams): Promise<void>;
    getGameAreaList(callback: RpkMethodParams): Promise<void>;
    createGameCharacter(params: any, callback: RpkMethodParams): Promise<void>;
    putGameCharacter(params: any, callback: RpkMethodParams): Promise<void>;
    delGameCharacter(params: any, callback: RpkMethodParams): Promise<void>;
    getGameCharacterAccount(params: any, callback: RpkMethodParams): Promise<void>;
    getGameCharacter(params: any, callback: RpkMethodParams): Promise<void>;
    getGameAccountAreaCharacter(params: any, callback: RpkMethodParams): Promise<void>;
    exchangeItemProp(params: any, callback: RpkMethodParams): Promise<void>;
    getEmailList(params: any, callback: IMethodParams): Promise<void>;
    getEmailDetail(params: any, callback: IMethodParams): Promise<void>;
    receiveEmail(params: any, callback: IMethodParams): Promise<void>;
    delEmail(params: any, callback: IMethodParams): Promise<void>;
    getShortUrl(params: any, callback: IMethodParams): Promise<void>;
    _getInfo(callback: IMethodParams): Promise<void>;
    getUserInfoByField(params: any, callback: IMethodParams): Promise<void>;
    updateGameVersion(params: any, callback: IMethodParams): Promise<void>;
    private setCpOf;
    private getCpOf;
    setGameInfo(cp_role_id: string, region_tag: string): void;
    searchGameAccount(callback: IMethodParams): Promise<void>;
    getTempNotice(callback: IMethodParams): Promise<void>;
    getH5LoginConfig(callback: IMethodParams): Promise<void>;
    tradeQuery(params: any, callback: IMethodParams): Promise<void>;
}
export default SdkCommon;
