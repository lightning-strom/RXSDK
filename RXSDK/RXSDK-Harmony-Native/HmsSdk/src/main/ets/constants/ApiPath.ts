import SDKConfig from '../sdk/SDKConfig';

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
  //看广告完成上报
  public static readonly SCHEDULING_AD_REPORT = "v1/operationapi/ad/scheduling_report";
  /**
   * 法务数据
   */
  public static readonly LEGAL = "v1/operationapi/legal";
  public static readonly LEGAL_TERMS = "v1/operationapi/legal/terms";

  /**
   * 支付下单
   */
  public static readonly ORDER = "v1/ke/order";

  /**
   * 上报/更新经纬度坐标
   */
  public static readonly LBS_UPDATE = "v1/social/lbs/update";
  /**
   * 给用户设置CP的自定义信息
   */
  public static readonly USER_SET_CUSTOM = "v1/social/user/setcustom";
  /**
   * 获取指定半径内的其他用户信息
   */
  public static readonly LBS_RADIUS = "v1/social/lbs/radius";
  /**
   * 删除经纬度坐标
   */
  public static readonly LBS_DELETE = "v1/social/lbs/delete";


  /**
   * 添加自定关系
   */
  public static readonly RELATION_ADD = "v1/social/relation/add";
  /**
   * 删除自定关系
   */
  public static readonly RELATION_DELETE = "v1/social/relation/delete";

  /**
   * 更新自定关系备注
   */
  public static readonly RELATION_UPDATE_REMARKS = "v1/social/relation/updateremarks";

  /**
   * 判断两用户是否存在某自定关系
   */
  public static readonly RELATION_HAS_RELATION = "v1/social/relation/hasrelation";
  /**
   * 获取自定关系列表
   */
  public static readonly RELATION_LIST = "v1/social/relation/list";


  /**
   * 添加好友列表
   */
  public static readonly RELATION_ADD_FRIEND = "v1/social/relation/addfriend";
  /**
   * 删除好友列表
   */
  public static readonly RELATION_DEL_FRIEND = "v1/social/relation/delfriend";
  /**
   * 更新好友关系备注
   */
  public static readonly RELATION_UPDATE_FRIEND_REMARKS = "v1/social/relation/updatefriendremarks";
  /**
   * 判断两用户是否为好友
   */
  public static readonly RELATION_IS_FRIEND = "v1/social/relation/isfriend";


  /**
   * 获取好友列表
   */
  public static readonly RELATION_FRIENDS = "v1/social/relation/friends";
  /**
   * 排行榜
   */
  public static readonly RANK_ADDSCORE = "v1/social/rank/addscore";
  public static readonly RANK_SETSCORE = "v1/social/rank/setscore";
  public static readonly RANK_QUERYUSERRANK = "v1/social/rank/queryuserrank";
  public static readonly RANK_GETRANKLIST = "v1/social/rank/getranklist";
  public static readonly RANK_FRIENDSRANK = "v1/social/rank/friendsrank";

  //忘记密码
  public static readonly STATIC_FORGET_PASSWORD = "static/passport/#/user/forgetpassword";
  public static readonly STATIC_USER_CENTER = "static/passport/#/userCenter";
  public static readonly STATIC_CHAT_SERVICE = "static/service/#/welcome?theme=light&minimized=0";
  public static readonly STATIC_HELPER_CENTER = "static/passport/#/helpcenter/questioncatalogue";
  public static readonly STATIC_PROTOCOL_LIST = "static/passport/#/protocol/protocollist";
  public static readonly CHAT_SERVICE = "static/service#/welcome";
  public static readonly STATIC_LEGAL_TERMS = "static/landing/#/v1/legal/terms";
  public static readonly STATIC_CAPTCHA = "static/passport/#/captcha";
  public static readonly UNREGISTERCONDITION = "static/passport/#/user/unregistercondition"

  public static getPrivacyUrl(key: string) {
    let baseUrl = SDKConfig.domain
    return baseUrl + '/' + ApiPath.STATIC_LEGAL_TERMS + '/' + SDKConfig.productId + '/' + SDKConfig.channelId + '/' + key
  }

  public static getUrl(path: string): string {
    let baseUrl = SDKConfig.domain
    if (path && !path.startsWith('http://') && !path.startsWith('https://')) {
      baseUrl += '/' + path; // 确保 path 前面有一个斜杠
    }
    return baseUrl;
  }

  async initApi() {

  }

  private static readonly IGNORE_TOKEN_ARRAY: string[] =
    [
    // ApiPath.LEGAL,
    // ApiPath.FIRST_ACTIVATED,
    // ApiPath.LOGIN,
    // ApiPath.LOGIN_TOKEN,
    // ApiPath.REFRESH_TOKEN,
    // ApiPath.REGISTER,
    // ApiPath.RESET_PWD,
    // ApiPath.SEND_CAPTCHA,
    // ApiPath.ACCOUNT_QUERY
    ];

  public static needVerifyToken(apiPath: string): boolean {
    return ApiPath.IGNORE_TOKEN_ARRAY.indexOf(apiPath) != -1;
  }
}

