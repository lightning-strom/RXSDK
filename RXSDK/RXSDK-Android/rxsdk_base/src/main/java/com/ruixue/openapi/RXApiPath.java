package com.ruixue.openapi;

import java.util.ArrayList;

public class RXApiPath {
    public static final String GET_IP = "getip";
    public static final String CHAT_SERVICE = "static/service#/welcome";

    public static final String BIND_ADID = "v1/attribution/user/bind_adid";

    public static final String OSS_STS = "/v1/thirdparty/api/oss_sts";

    public static final String EVENT_ATTRS = "v1/sdkconfig/sync/event_attrs";

    public static final String SDKCONFIG_INIT = "v1/sdkconfig/init";

    /**
     * SDK 服务器时间探测。
     * <p>响应 {@code data.time} 为服务端毫秒时间戳，用于刷新 {@code st_offset}。
     */
    public static final String SDKCONFIG_DETECTION = "v1/sdkconfig/detection";

    public static final String FEEDBACKAPI_KIND_LIST = "v1/feedbackapi/kind/list";

    public static final String FEEDBACKAPI_PLAYER_CREATE = "v1/feedbackapi/player/create";

    public static final String FEEDBACKAPI_PLEASED_UPDATE = "v1/feedbackapi/pleased/update";

    public static final String REPORT_USERLOG = "v1/feedbackapi/report/userlog";

    public static final String USER_REPORT = "/v1/passport/user/report";

    public static final String PROMO_GET_API = "v1/operationtoolsapi/exchange/game_display";

    public static final String PROMO_EXCHANGE = "v1/operationtoolsapi/exchange/exchange";

    public static final String QUICK_AP_CHECK = "v1/ke/ap/quick_ap_check";

    public static final String DATA_OPERATION_SCENE = "v1/operationtoolsapi/user_data_operation_platform/scene/all";

    /**
     * 通行证
     */
    public static final class Passport {

        /**
         * 在用户首次打开应用注册账号前，需要调用本接口，每个用户仅需调用一次。此接口不只是用于采集广告投放效果，如果想要分析是否有用户打开了应用但最终没有注册账号，也需要接入此接口。
         */
        public static final String FIRST_ACTIVATED = "v1/attribution/user/activated";

        /**
         * 查询用户拥有的账号
         */
        public static final String ACCOUNT_QUERY = "v1/passport/user/query";

        public static final String ACCOUNT_BOUND_QUERY = "v1/passport/user/bound_accounts";
        /**
         * 注册
         */
        public static final String REGISTER = "v1/passport/account/register";
        /**
         * SDK登录
         */
        public static final String LOGIN = "v1/passport/account/login_by_credential";

        public static final String LOGIN_TOKEN = "v1/passport/account/login_by_token";
        /**
         * 发送验证码
         */
        public static final String SEND_CAPTCHA = "v1/passport/captcha/send";
        public static final String SEND_CAPTCHA_AUTH = "v1/passport/captcha/send_auth";

        /**
         * 校验验证码
         */
        public static final String VERIFY_CAPTCHA = "v1/passport/captcha/verify";
        /**
         * 刷新令牌
         */
        public static final String REFRESH_TOKEN = "v1/passport/token/refresh";
        /**
         * 获取用户信息
         */
        public static final String USER_INFO = "v1/passport/user/get_info";
        /**
         * 获取指定用户信息
         */
        public static final String USER_INFO_BY_FIELD = "v1/passport/user/info_by_field";

        public static final String SYNC_APP_INFO = "v1/passport/user/sync_app_info";
        public static final String BIND_ACCOUNT = "v1/passport/user/bind_account";
        /**
         * 修改用户信息
         */
        public static final String UPDATE_USER = "v1/passport/user/update_info";
        /**
         * 绑定手机号
         */
        public static final String BIND_PHONE = "v1/passport/user/bind_phone";
        /**
         * 解绑手机号
         */
        public static final String UNBIND_PHONE = "v1/passport/user/unbind_phone";

        /**
         * 修改手机账号
         */
        public static final String CHANGE_PHONE = "v1/passport/user/change_phone";

        public static final String CHANGE_EMAIL = "v1/passport/user/change_email";
        /**
         * 绑定邮箱
         */
        public static final String BIND_EMAIL = "v1/passport/user/bind_email";
        /**
         * 解绑邮箱
         */
        public static final String UNBIND_EMAIL = "v1/passport/user/unbind_email";
        /**
         * 修改密码
         */
        public static final String CHANGE_PWD = "v1/passport/user/change_password";
        /**
         * 密码重置
         */
        public static final String RESET_PWD = "v1/passport/user/reset_password";
        /**
         * 实名认证
         */
        public static final String CERTIFICATION = "v1/passport/user/realauth";
        /**
         * 注销账号
         */
        public static final String USER_DEREGISTER = "v1/passport/user/deregister";
        /**
         * 撤销账号注销申请
         */
        public static final String USER_DEREGISTER_CANCEL = "v1/passport/user/cancel_deregister";
        /**
         * 查询游戏注销状态
         */
        @Deprecated
        public static final String ACCOUNTGETSTATE = "Landing/Account/GetState";

        /**
         * 撤销注销申请
         */
        @Deprecated
        public static final String ACCOUNTREVOKE = "Landing/Account/Revoke";
    }

    /**
     * 风控 / 认证相关
     */
    public static final class Risk {
        /**
         * 获取 IIFAA 支付宝授权跳转地址
         */
        public static final String IIFAA_REDIRECT_URL = "v1/cgosdk/sdk/auth/iifaa/redirect_url";

        /**
         * 查询 IIFAA 认证结果
         */
        public static final String IIFAA_VALIDATE_BY_BIZID = "v1/cgosdk/sdk/auth/iifaa/validate_by_bizid";
    }


    public static final class Data {


        /**
         * 埋点数据上报
         */
        public static final String TRACK_DATA_API = "v1/data/api/track";

    }

    public static final class Share {
        //        /**
        //         * 获取指定埋点次数信息
        //         */
        //        @Deprecated
        //        public static final String LIMIT = "Share/Share/Limit";
        //        /**
        //         * 获取分享埋点数据
        //         */
        //        //正式
        //        @Deprecated
        //        public static final String BURYINPOINT = "Share/Share/GetData";
        //        /**
        //         * 分享上报
        //         */
        //        //正式
        //        @Deprecated
        //        public static final String REPORT = "Share/Share/Report";

        public static final String PLATFORMS = "v1/operationapi/share/platforms";

        public static final String GET_DATA = "v1/operationapi/share/data";

        public static final String SCHEDULING_REPORT = "v1/operationapi/scheduling_report";

        public static final String SCHEDULING_INIT = "v1/operationapi/scheduling/init";
        //看广告完成上报
        public static final String SCHEDULING_AD_REPORT = "v1/operationapi/ad/scheduling_report";
    }


    public static final class Pay {
        /**
         * 支付下单
         */
        public static final String ORDER = "v1/ke/order";

        public static final String EXCHANGE = "v1/operationtoolsapi/user_data_operation_platform/item_redemption";
    }

    public static final class Social {
        /**
         * 上报/更新经纬度坐标
         */
        public static final String LBS_UPDATE = "v1/social/lbs/update";
        /**
         * 给用户设置CP的自定义信息
         */
        public static final String USER_SET_CUSTOM = "v1/social/user/setcustom";
        /**
         * 获取指定半径内的其他用户信息
         */
        public static final String LBS_RADIUS = "v1/social/lbs/radius";
        /**
         * 删除经纬度坐标
         */
        public static final String LBS_DELETE = "v1/social/lbs/delete";


        /**
         * 添加自定关系
         */
        public static final String RELATION_ADD = "v1/social/relation/add";
        /**
         * 删除自定关系
         */
        public static final String RELATION_DELETE = "v1/social/relation/delete";

        /**
         * 更新自定关系备注
         */
        public static final String RELATION_UPDATE_REMARKS = "v1/social/relation/updateremarks";

        /**
         * 判断两用户是否存在某自定关系
         */
        public static final String RELATION_HAS_RELATION = "v1/social/relation/hasrelation";
        /**
         * 获取自定关系列表
         */
        public static final String RELATION_LIST = "v1/social/relation/list";


        /**
         * 添加好友列表
         */
        public static final String RELATION_ADD_FRIEND = "v1/social/relation/addfriend";
        /**
         * 删除好友列表
         */
        public static final String RELATION_DEL_FRIEND = "v1/social/relation/delfriend";
        /**
         * 更新好友关系备注
         */
        public static final String RELATION_UPDATE_FRIEND_REMARKS = "v1/social/relation/updatefriendremarks";
        /**
         * 判断两用户是否为好友
         */
        public static final String RELATION_IS_FRIEND = "v1/social/relation/isfriend";


        /**
         * 获取好友列表
         */
        public static final String RELATION_FRIENDS = "v1/social/relation/friends";
        /**
         * 排行榜
         */
        public static final String RANK_ADDSCORE = "v1/social/rank/addscore";
        public static final String RANK_SETSCORE = "v1/social/rank/setscore";
        public static final String RANK_QUERYUSERRANK = "v1/social/rank/queryuserrank";
        public static final String RANK_GETRANKLIST = "v1/social/rank/getranklist";
        public static final String RANK_FRIENDSRANK = "v1/social/rank/friendsrank";
    }

    /**
     * 法务数据
     */
    public static final String LEGAL = "v1/operationapi/legal";

    public static final String LEGAL_TERMS = "v1/operationapi/legal/terms";

    //    @Deprecated
    //    public static final class Old {
    //
    //        /**
    //         * 法务接口
    //         */
    //        @Deprecated
    //        public static final String LEGAL = "Old/Legal/NewLegal";
    //
    //        /**
    //         * 推送接口
    //         */
    //        @Deprecated
    //        public static final String PUSH = "Old/Client/Client";
    //
    //        @Deprecated
    //        public static final String GET_NOTICE_LIST = "Old/Notice/GetNoticeList";
    //    }

    private static final ArrayList<String> IGNORE_TOKEN_ARRAY = new ArrayList<>();

    /**
     * 判断是否需要访问的刷新令牌的接口
     * @param apiPath 接口路径
     * @return 是否需要验证已登录
     */
    public static boolean needVerifyToken(String apiPath) {
        return !IGNORE_TOKEN_ARRAY.contains(apiPath);
    }

    //忽略登录接口初始化
    static {
        IGNORE_TOKEN_ARRAY.add(LEGAL);
        IGNORE_TOKEN_ARRAY.add(SDKCONFIG_INIT);
        IGNORE_TOKEN_ARRAY.add(SDKCONFIG_DETECTION);
        IGNORE_TOKEN_ARRAY.add(EVENT_ATTRS);
        IGNORE_TOKEN_ARRAY.add(GET_IP);
        IGNORE_TOKEN_ARRAY.add(Passport.FIRST_ACTIVATED);
        IGNORE_TOKEN_ARRAY.add(Passport.LOGIN);
        IGNORE_TOKEN_ARRAY.add(Passport.LOGIN_TOKEN);
        IGNORE_TOKEN_ARRAY.add(Passport.REFRESH_TOKEN);
        IGNORE_TOKEN_ARRAY.add(Passport.REGISTER);
        IGNORE_TOKEN_ARRAY.add(Passport.RESET_PWD);
        IGNORE_TOKEN_ARRAY.add(Passport.SEND_CAPTCHA);
        IGNORE_TOKEN_ARRAY.add(REPORT_USERLOG);
        IGNORE_TOKEN_ARRAY.add(Passport.ACCOUNT_QUERY);
    }

}
