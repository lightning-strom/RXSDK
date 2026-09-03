
using System.Collections.Generic;

namespace RXSDK
{


    sealed class APIPath
    {

        public static readonly string GET_IP = "getip";
        public static readonly string CHAT_SERVICE = "static/service#/welcome";

        public static readonly string EVENT_ATTRS = "v1/sdkconfig/sync/event_attrs";

        public static readonly string SDKCONFIG_INIT = "v1/sdkconfig/init";

        public static readonly string FEEDBACKAPI_KIND_LIST = "v1/feedbackapi/kind/list";

        public static readonly string FEEDBACKAPI_PLAYER_CREATE = "v1/feedbackapi/player/create";

        public static readonly string FEEDBACKAPI_PLEASED_UPDATE = "v1/feedbackapi/pleased/update";

        public static readonly string FIRST_ACTIVATED = "v1/attribution/user/activated";
        public static readonly string ACCOUNT_QUERY = "v1/passport/user/query";

        public static readonly string REGISTER = "v1/passport/account/register";

        /**
         * SDK登录
         */
        public static readonly string LOGIN = "v1/passport/account/login_by_credential";

        // 二次登录
        public static readonly string LOGIN_TOKEN = "v1/passport/account/login_by_token";
        public static readonly string HARMONY_ASSOCIATION = "/v1/passport/user/harmony_association";
        /**
         * 发送验证码
         */
        public static readonly string SEND_CAPTCHA = "v1/passport/captcha/send";

        /**
         * 校验验证码
         */
        public static readonly string VERIFY_CAPTCHA = "v1/passport/captcha/verify";
        /**
         * 刷新令牌
         */
        public static readonly string REFRESH_TOKEN = "v1/passport/token/refresh";
        /**
         * 获取用户信息
         */
        public static readonly string USER_INFO = "v1/passport/user/get_info";

        public static readonly string SYNC_INFO = "v1/passport/user/sync_app_info";
        /**
         * 修改用户信息
         */
        public static readonly string UPDATE_USER = "v1/passport/user/update_info";
        /**
         * 绑定手机号
         */
        public static readonly string BIND_PHONE = "v1/passport/user/bind_phone";
        /**
         * 解绑手机号
         */
        public static readonly string UNBIND_PHONE = "v1/passport/user/unbind_phone";

        /**
         * 修改手机账号
         */
        public static readonly string CHANGE_PHONE = "v1/passport/user/change_phone";
        /**
         * 绑定邮箱
         */
        public static readonly string BIND_EMAIL = "v1/passport/user/bind_email";
        /**
         * 解绑邮箱
         */
        public static readonly string UNBIND_EMAIL = "v1/passport/user/unbind_email";
        /**
         * 修改密码
         */
        public static readonly string CHANGE_PWD = "v1/passport/user/change_password";
        /**
         * 密码重置
         */
        public static readonly string RESET_PWD = "v1/passport/user/reset_password";
        /**
         * 实名认证
         */
        public static readonly string CERTIFICATION = "v1/passport/user/realauth";
        /**
         * 注销账号
         */
        public static readonly string USER_DEREGISTER = "v1/passport/user/deregister";
        /**
         * 撤销账号注销申请
         */
        public static readonly string USER_DEREGISTER_CANCEL = "v1/passport/user/cancel_deregister";


        /**
         * 埋点数据上报
         */
        public static readonly string TRACK_DATA_API = "v1/data/api/track";

        public static readonly string PLATFORMS = "v1/operationapi/share/platforms";

        public static readonly string GET_DATA = "v1/operationapi/share/data";

        public static readonly string SCHEDULING_REPORT = "v1/operationapi/scheduling_report";

        public static readonly string SCHEDULING_INIT = "v1/operationapi/scheduling/init";
        //看广告完成上报
        public static readonly string SCHEDULING_AD_REPORT = "v1/operationapi/ad/scheduling_report";


        /**
        * 支付下单
        */
        public static readonly string ORDER = "v1/ke/order";

        /**
        * 上报/更新经纬度坐标
        */
        public static readonly string LBS_UPDATE = "v1/social/lbs/update";
        /**
         * 给用户设置CP的自定义信息
         */
        public static readonly string USER_SET_CUSTOM = "v1/social/user/setcustom";
        /**
         * 获取指定半径内的其他用户信息
         */
        public static readonly string LBS_RADIUS = "v1/social/lbs/radius";
        /**
         * 删除经纬度坐标
         */
        public static readonly string LBS_DELETE = "v1/social/lbs/delete";


        /**
         * 添加自定关系
         */
        public static readonly string RELATION_ADD = "v1/social/relation/add";
        /**
         * 删除自定关系
         */
        public static readonly string RELATION_DELETE = "v1/social/relation/delete";

        /**
         * 更新自定关系备注
         */
        public static readonly string RELATION_UPDATE_REMARKS = "v1/social/relation/updateremarks";

        /**
         * 判断两用户是否存在某自定关系
         */
        public static readonly string RELATION_HAS_RELATION = "v1/social/relation/hasrelation";
        /**
         * 获取自定关系列表
         */
        public static readonly string RELATION_LIST = "v1/social/relation/list";


        /**
         * 添加好友列表
         */
        public static readonly string RELATION_ADD_FRIEND = "v1/social/relation/addfriend";
        /**
         * 删除好友列表
         */
        public static readonly string RELATION_DEL_FRIEND = "v1/social/relation/delfriend";
        /**
         * 更新好友关系备注
         */
        public static readonly string RELATION_UPDATE_FRIEND_REMARKS = "v1/social/relation/updatefriendremarks";
        /**
         * 判断两用户是否为好友
         */
        public static readonly string RELATION_IS_FRIEND = "v1/social/relation/isfriend";


        /**
         * 获取好友列表
         */
        public static readonly string RELATION_FRIENDS = "v1/social/relation/friends";
        /**
         * 排行榜
         */
        public static readonly string RANK_ADDSCORE = "v1/social/rank/addscore";
        public static readonly string RANK_SETSCORE = "v1/social/rank/setscore";
        public static readonly string RANK_QUERYUSERRANK = "v1/social/rank/queryuserrank";
        public static readonly string RANK_GETRANKLIST = "v1/social/rank/getranklist";
        public static readonly string RANK_FRIENDSRANK = "v1/social/rank/friendsrank";

        /**
        * 法务数据
        */
        public static readonly string LEGAL = "v1/operationapi/legal";

        public static readonly string LEGAL_TERMS = "v1/operationapi/legal/terms";

        public static readonly string EXCHANGE_GAME_DISPLAY = "/v1/operationtoolsapi/exchange/game_display";
        public static readonly string UNREGISTERCONDITION = "static/passport/#/user/unregistercondition";
        public static readonly string DATA_OPERATION_SCENE = "v1/operationtoolsapi/user_data_operation_platform/scene/all";

        public static string GetUrl(string apiPath)
        {
            string baseUrl = SDKConfig.Instance.BaseUrls[0];
            return $"{baseUrl}/{apiPath}";
        }


        private static readonly List<string> IGNORE_TOKEN_ARRAY = new()
        {
            LEGAL       ,
            LEGAL_TERMS       ,
            SDKCONFIG_INIT,
            EVENT_ATTRS,
            GET_IP,
            FIRST_ACTIVATED,
            LOGIN,
            LOGIN_TOKEN,
            REFRESH_TOKEN,
            REGISTER,
            RESET_PWD,
            SEND_CAPTCHA,
            ACCOUNT_QUERY
        };

        public static bool NeedVerifyToken(string apiPath)
        {
            return !IGNORE_TOKEN_ARRAY.Contains(apiPath);
        }

    }

}