export default class ApiPath {
    static readonly UPDATE_MODULE_VERSION: string;
    static readonly SDK_CONFIG_INIT: string;
    static readonly FEEDBACKAPI_KIND_LIST = "v1/feedbackapi/kind/list";
    static readonly FEEDBACKAPI_PLAYER_CREATE = "v1/feedbackapi/player/create";
    static readonly FEEDBACKAPI_PLEASED_UPDATE = "v1/feedbackapi/pleased/update";
    static readonly FIRST_ACTIVATED = "v1/attribution/user/activated";
    static readonly PLATFORMS = "v1/operationapi/share/platforms";
    static readonly GET_DATA = "v1/operationapi/share/data";
    static readonly SCHEDULING_REPORT = "v1/operationapi/scheduling_report";
    static readonly SCHEDULING_INIT = "v1/operationapi/scheduling/init";
    static readonly SCHEDULING_AD_REPORT = "v1/operationapi/ad/scheduling_report";
    /**
     * 法务数据
     */
    static readonly LEGAL = "v1/operationapi/legal";
    static readonly LEGAL_TERMS = "v1/operationapi/legal/terms";
    /**
     * 支付下单
     */
    static readonly ORDER = "v1/ke/order";
    /**
     * 上报/更新经纬度坐标
     */
    static readonly LBS_UPDATE = "v1/social/lbs/update";
    /**
     * 给用户设置CP的自定义信息
     */
    static readonly USER_SET_CUSTOM = "v1/social/user/setcustom";
    /**
     * 获取指定半径内的其他用户信息
     */
    static readonly LBS_RADIUS = "v1/social/lbs/radius";
    /**
     * 删除经纬度坐标
     */
    static readonly LBS_DELETE = "v1/social/lbs/delete";
    /**
     * 添加自定关系
     */
    static readonly RELATION_ADD = "v1/social/relation/add";
    /**
     * 删除自定关系
     */
    static readonly RELATION_DELETE = "v1/social/relation/delete";
    /**
     * 更新自定关系备注
     */
    static readonly RELATION_UPDATE_REMARKS = "v1/social/relation/updateremarks";
    /**
     * 判断两用户是否存在某自定关系
     */
    static readonly RELATION_HAS_RELATION = "v1/social/relation/hasrelation";
    /**
     * 获取自定关系列表
     */
    static readonly RELATION_LIST = "v1/social/relation/list";
    /**
     * 添加好友列表
     */
    static readonly RELATION_ADD_FRIEND = "v1/social/relation/addfriend";
    /**
     * 删除好友列表
     */
    static readonly RELATION_DEL_FRIEND = "v1/social/relation/delfriend";
    /**
     * 更新好友关系备注
     */
    static readonly RELATION_UPDATE_FRIEND_REMARKS = "v1/social/relation/updatefriendremarks";
    /**
     * 判断两用户是否为好友
     */
    static readonly RELATION_IS_FRIEND = "v1/social/relation/isfriend";
    /**
     * 获取好友列表
     */
    static readonly RELATION_FRIENDS = "v1/social/relation/friends";
    /**
     * 排行榜
     */
    static readonly RANK_ADDSCORE = "v1/social/rank/addscore";
    static readonly RANK_SETSCORE = "v1/social/rank/setscore";
    static readonly RANK_QUERYUSERRANK = "v1/social/rank/queryuserrank";
    static readonly RANK_GETRANKLIST = "v1/social/rank/getranklist";
    static readonly RANK_FRIENDSRANK = "v1/social/rank/friendsrank";
    static readonly STATIC_FORGET_PASSWORD = "static/passport/#/user/forgetpassword";
    static readonly STATIC_USER_CENTER = "static/passport/#/userCenter";
    static readonly STATIC_CHAT_SERVICE = "static/service/#/welcome?theme=light&minimized=0";
    static readonly STATIC_HELPER_CENTER = "static/passport/#/helpcenter/questioncatalogue";
    static readonly STATIC_PROTOCOL_LIST = "static/passport/#/protocol/protocollist";
    static readonly CHAT_SERVICE = "static/service#/welcome";
    static readonly STATIC_LEGAL_TERMS = "static/landing/#/v1/legal/terms";
    static readonly STATIC_CAPTCHA = "static/passport/#/captcha";
    static readonly UNREGISTERCONDITION = "static/passport/#/user/unregistercondition";
    static getPrivacyUrl(u34: string): string;
    static getUrl(s34: string): string;
    initApi(): Promise<void>;
    private static readonly IGNORE_TOKEN_ARRAY;
    static needVerifyToken(r34: string): boolean;
}
