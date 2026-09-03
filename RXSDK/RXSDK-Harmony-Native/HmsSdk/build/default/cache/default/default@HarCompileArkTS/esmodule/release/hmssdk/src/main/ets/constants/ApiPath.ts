import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
export default class ApiPath {
    public static readonly UPDATE_MODULE_VERSION: string = "v1/vcapi/update_module_version";
    public static readonly SDK_CONFIG_INIT: string = "v1/sdkconfig/init";
    public static readonly FEEDBACKAPI_KIND_LIST = "v1/feedbackapi/kind/list";
    public static readonly FEEDBACKAPI_PLAYER_CREATE = "v1/feedbackapi/player/create";
    public static readonly FEEDBACKAPI_PLEASED_UPDATE = "v1/feedbackapi/pleased/update";
    public static readonly FIRST_ACTIVATED = "v1/attribution/user/activated";
    public static readonly PLATFORMS = "v1/operationapi/share/platforms";
    public static readonly GET_DATA = "v1/operationapi/share/data";
    public static readonly SCHEDULING_REPORT = "v1/operationapi/scheduling_report";
    public static readonly SCHEDULING_INIT = "v1/operationapi/scheduling/init";
    public static readonly SCHEDULING_AD_REPORT = "v1/operationapi/ad/scheduling_report";
    public static readonly LEGAL = "v1/operationapi/legal";
    public static readonly LEGAL_TERMS = "v1/operationapi/legal/terms";
    public static readonly ORDER = "v1/ke/order";
    public static readonly LBS_UPDATE = "v1/social/lbs/update";
    public static readonly USER_SET_CUSTOM = "v1/social/user/setcustom";
    public static readonly LBS_RADIUS = "v1/social/lbs/radius";
    public static readonly LBS_DELETE = "v1/social/lbs/delete";
    public static readonly RELATION_ADD = "v1/social/relation/add";
    public static readonly RELATION_DELETE = "v1/social/relation/delete";
    public static readonly RELATION_UPDATE_REMARKS = "v1/social/relation/updateremarks";
    public static readonly RELATION_HAS_RELATION = "v1/social/relation/hasrelation";
    public static readonly RELATION_LIST = "v1/social/relation/list";
    public static readonly RELATION_ADD_FRIEND = "v1/social/relation/addfriend";
    public static readonly RELATION_DEL_FRIEND = "v1/social/relation/delfriend";
    public static readonly RELATION_UPDATE_FRIEND_REMARKS = "v1/social/relation/updatefriendremarks";
    public static readonly RELATION_IS_FRIEND = "v1/social/relation/isfriend";
    public static readonly RELATION_FRIENDS = "v1/social/relation/friends";
    public static readonly RANK_ADDSCORE = "v1/social/rank/addscore";
    public static readonly RANK_SETSCORE = "v1/social/rank/setscore";
    public static readonly RANK_QUERYUSERRANK = "v1/social/rank/queryuserrank";
    public static readonly RANK_GETRANKLIST = "v1/social/rank/getranklist";
    public static readonly RANK_FRIENDSRANK = "v1/social/rank/friendsrank";
    public static readonly STATIC_FORGET_PASSWORD = "static/passport/#/user/forgetpassword";
    public static readonly STATIC_USER_CENTER = "static/passport/#/userCenter";
    public static readonly STATIC_CHAT_SERVICE = "static/service/#/welcome?theme=light&minimized=0";
    public static readonly STATIC_HELPER_CENTER = "static/passport/#/helpcenter/questioncatalogue";
    public static readonly STATIC_PROTOCOL_LIST = "static/passport/#/protocol/protocollist";
    public static readonly CHAT_SERVICE = "static/service#/welcome";
    public static readonly STATIC_LEGAL_TERMS = "static/landing/#/v1/legal/terms";
    public static readonly STATIC_CAPTCHA = "static/passport/#/captcha";
    public static readonly UNREGISTERCONDITION = "static/passport/#/user/unregistercondition";
    public static getPrivacyUrl(u34: string) {
        let v34 = SDKConfig.domain;
        return v34 + '/' + ApiPath.STATIC_LEGAL_TERMS + '/' + SDKConfig.productId + '/' + SDKConfig.channelId + '/' + u34;
    }
    public static getUrl(s34: string): string {
        let t34 = SDKConfig.domain;
        if (s34 && !s34.startsWith('http://') && !s34.startsWith('https://')) {
            t34 += '/' + s34;
        }
        return t34;
    }
    async initApi() {
    }
    private static readonly IGNORE_TOKEN_ARRAY: string[] = [];
    public static needVerifyToken(r34: string): boolean {
        return ApiPath.IGNORE_TOKEN_ARRAY.indexOf(r34) != -1;
    }
}
