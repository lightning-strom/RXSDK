
using System.Collections.Generic;
using RXSDK.Data;

namespace RXSDK
{
    public enum AccountType
    {
        Normal = 1,
        Phone,
        Email
    }
    public enum CaptchaType
    {
        Email,  // 邮箱
        Phone  // 手机
    }

    public static class CaptchaPurpose
    {
        //意图 key 字段
        public static string PURPOSE_KEY = "purpose";

        /**
         * 短信意图-注册
         */
        public static string REGISTER = "register";
        /**
         * 短信意图-绑定手机
         */
        public static string BINDPHONE = "bindphone";
        /**
         * 短信意图-解绑手机
         */
        public static string UNBINDPHONE = "unbindphone";
        /**
         * 短信意图-重置密码
         */
        public static string RESETPWD = "resetpwd";

        /**
         * 验证码意图 绑定邮箱
         */
        public static string BINDEMAIL = "bindemail";
        /**
         * 验证码意图 解绑邮箱
         */
        public static string UNBINDEMAIL = "unbindemail";
        /**
         * 登录
         */
        public static string LOGIN = "login";
        /**
         * 设置密码
         */
        public static string SETPWD = "setpwd";




    }
    // 注册类型（1-普通账号注册，2-手机号注册,3-邮箱注册）：手机号注册必须填写验证码，邮箱注册必填验证码
    public class RegisterArgs : DataBean
    {
        public AccountType type = AccountType.Phone;
        public string username;
        public string password;
        public string nickname;
        public string captcha_code;
        public object user_attrs;
        public object migrate_args;
        public string avatarUrl;
        public string country = DeviceUtility.GetCountry();
        public int sex = -1;

        public RegisterArgs HandPasswordHash()
        {
            if (!_isHashPwd)
            {
                password = CryptoUtility.GetMD5(password);
                _isHashPwd = true;
            }
            return this;
        }
        private bool _isHashPwd;
    }

    public class LoginArgs : DataBean
    {
        public string method;
        public string login_openid;
        public string username;
        public string password;
        public string captcha_code;
        public string distinct_id;
        public object user_transmits;
        public string[] sign_fields;
        public object migrate_args;
        public Dictionary<string, object> device;
        public Dictionary<string, object> activate;
        public Dictionary<string, object> user_attrs;
        public Dictionary<string, object> user_source;
        public Dictionary<string, object> ext;
        public Dictionary<string, object> custom_ext;

        public Dictionary<string, object> Ext { get => ext; set => ext = value; }

        public Dictionary<string, object> ToDictionary()
        {
            var dict = new Dictionary<string, object>();

            RXUtility.AddValueIfNotNull(dict, nameof(method), method);
            RXUtility.AddValueIfNotNull(dict, nameof(login_openid), login_openid);
            RXUtility.AddValueIfNotNull(dict, nameof(username), username);
            RXUtility.AddValueIfNotNull(dict, nameof(password), password);
            RXUtility.AddValueIfNotNull(dict, nameof(captcha_code), captcha_code);
            RXUtility.AddValueIfNotNull(dict, nameof(distinct_id), distinct_id);
            RXUtility.AddValueIfNotNull(dict, nameof(user_transmits), user_transmits);
            RXUtility.AddValueIfNotNull(dict, nameof(sign_fields), sign_fields);
            RXUtility.AddValueIfNotNull(dict, nameof(migrate_args), migrate_args);
            RXUtility.AddValueIfNotNull(dict, nameof(device), device);
            RXUtility.AddValueIfNotNull(dict, nameof(activate), activate);
            RXUtility.AddValueIfNotNull(dict, nameof(user_attrs), user_attrs);
            RXUtility.AddValueIfNotNull(dict, nameof(user_source), user_source);
            RXUtility.AddValueIfNotNull(dict, nameof(ext), ext);
            RXUtility.AddValueIfNotNull(dict, nameof(custom_ext), custom_ext);
            return dict;
        }

    }


    public class LoginUIConfig : UnionLoginArgs
    {

    }

    //https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V5/gameservice-gameplayer-V5#section20129173413913
    public class UnionLoginArgs : DataBean
    {
        public class UnionAccountType
        {
            //游戏开放给玩家接入的账号类型名字，例如“官方账号”、“xx账号”等，并不是具体某个玩家ID或开发者ID。最大长度19个字符。
            public string accountName;
            //游戏官方账号图标资源名
            public string accountIcon;
        }

        //是否强制弹出联合登录对话框，允许玩家选择重新登录
        public bool showLoginDialog = true;

        // 0 游戏官方账号入口显示为账号图标。
        // 1 游戏官方账号入口显示为按钮。
        public int loginPanelType = 1;

        //可在union login 添加一个游戏官方账号类型
        public List<UnionAccountType> accountInfos;

        // 
        public string[] scopes;
        public string[] permission;
        public bool forceAuthorization = true;

        public List<Dictionary<string, string>> loginMethods;

        //cp 自定义扩展参数
        public Dictionary<string, object> ext;
        /**
        *  1 开启实名认证， 0 关闭
        */
        public int indulgeAuth = 1;
        //首次登录是否需要设置密码
        public bool firstNeedSetPassword = false;

        //游戏官方账号登录界面是否显示隐私协议
        public bool privacyEnable = true;
        //协议文本
        public string privacyText1;
        public string privacyText2;
        public string privacyText3;
        //协议地址
        public string privacyUrl1;
        public string privacyUrl2;
        public string privacyUrl3;

        public Dictionary<string, object> Ext { get => ext; set => ext = value; }
        public UnionLoginArgs SetRXArgs(LoginArgs loginArgs)
        {
            ext = loginArgs?.ToDictionary();
            return this;
        }
        public UnionLoginArgs SetCustomExt(Dictionary<string, object> cd)
        {
            if (cd != null && cd.Count > 0)
            {
                ext ??= new Dictionary<string, object>();
                ext["custom_ext"] = cd;
            }
            return this;
        }
        public UnionLoginArgs SetCustomParams(Dictionary<string, object> cd)
        {
            if (ext == null)
            {
                ext = cd;
            }
            else if (cd != null)
            {
                foreach (var kvp in cd)
                {
                    ext[kvp.Key] = kvp.Value;
                }
            }
            return this;
        }
        public Dictionary<string, object> ToDictionary()
        {
            var dict = new Dictionary<string, object>();
            RXUtility.AddValueIfNotNull(dict, nameof(showLoginDialog), showLoginDialog);
            RXUtility.AddValueIfNotNull(dict, nameof(loginPanelType), loginPanelType);
            RXUtility.AddValueIfNotNull(dict, nameof(accountInfos), accountInfos);
            RXUtility.AddValueIfNotNull(dict, nameof(scopes), scopes);
            RXUtility.AddValueIfNotNull(dict, nameof(permission), permission);
            RXUtility.AddValueIfNotNull(dict, nameof(forceAuthorization), forceAuthorization);
            RXUtility.AddValueIfNotNull(dict, nameof(indulgeAuth), indulgeAuth);
            RXUtility.AddValueIfNotNull(dict, nameof(firstNeedSetPassword), firstNeedSetPassword);
            RXUtility.AddValueIfNotNull(dict, nameof(privacyEnable), privacyEnable);
            RXUtility.AddValueIfNotNull(dict, nameof(privacyText1), privacyText1);
            RXUtility.AddValueIfNotNull(dict, nameof(privacyText2), privacyText2);
            RXUtility.AddValueIfNotNull(dict, nameof(privacyText3), privacyText3);
            RXUtility.AddValueIfNotNull(dict, nameof(privacyUrl1), privacyUrl1);
            RXUtility.AddValueIfNotNull(dict, nameof(privacyUrl2), privacyUrl2);
            RXUtility.AddValueIfNotNull(dict, nameof(privacyUrl3), privacyUrl3);
            RXUtility.AddValueIfNotNull(dict, nameof(ext), ext);
            return dict;
        }
    }

    public class SendCaptchaArgs : DataBean
    {
        public string email;
        public string phone;
        public string purpose;
        public string tencent_captcha;


    }
    public class VerifyCaptchaArgs : DataBean
    {
        public string phone;
        public string email;
        public string purpose;
        public string captcha_code;
    }

    public class BindPhoneArgs : DataBean
    {
        public string phone;
        public string password;
        public string captcha_code;
        public object migrate_args;

        public BindPhoneArgs HandPasswordHash()
        {
            if (!_isHashPwd)
            {
                password = CryptoUtility.GetMD5(password);
                _isHashPwd = true;
            }
            return this;
        }
        private bool _isHashPwd;

    }
    public class UnBindPhoneArgs : DataBean
    {

        public string phone;
        public string captcha_code;

    }

    public class ChangePhoneArgs : DataBean
    {
        public string oldphone_captcha;
        public string newphone;
        public string newphone_captcha;
        public object migrate_args;

    }

    public class BindEmailArgs : DataBean
    {
        public string email;
        public string password;
        public string captcha_code;
        public object migrate_args;
        private bool _isHashPwd;
        public BindEmailArgs HandPasswordHash()
        {
            if (!_isHashPwd)
            {
                password = CryptoUtility.GetMD5(password);
                _isHashPwd = true;
            }
            return this;
        }

    }
    public class UnBindEmailArgs : DataBean
    {
        public string email;
        public string captcha_code;

    }

    public class InitArgs : DataBean
    {
        public string productId;
        public string channelId;
        public string cpId;
        public string[] baseUrls;
        public bool debugEnable = true;
        public bool privacyEnable = false;
        public string privacyTitle;
        public string privacy;
        public string logoResource;
        public Dictionary<string, object> login_config;


    }
    // 大数据上报信息
    public class BigDataReport
    {
        public string scene_identifier { get; set; }
        public string scene_name { get; set; }
        public string trigger_button_identifier { get; set; }
        public string trigger_button_name { get; set; }
        public string window_identifier { get; set; }
        public string window_name { get; set; }
        public string window_sequence { get; set; }
        public GiftPackage gift_package { get; set; }

        // 转换为字典
        public Dictionary<string, object> ToDictionary()
        {
            var dict = new Dictionary<string, object>();
            RXUtility.AddValueIfNotNull(dict, nameof(scene_identifier), scene_identifier);
            RXUtility.AddValueIfNotNull(dict, nameof(scene_name), scene_name);
            RXUtility.AddValueIfNotNull(dict, nameof(trigger_button_identifier), trigger_button_identifier);
            RXUtility.AddValueIfNotNull(dict, nameof(trigger_button_name), trigger_button_name);
            RXUtility.AddValueIfNotNull(dict, nameof(window_identifier), window_identifier);
            RXUtility.AddValueIfNotNull(dict, nameof(window_name), window_name);
            RXUtility.AddValueIfNotNull(dict, nameof(window_sequence), window_sequence);
            RXUtility.AddValueIfNotNull(dict, nameof(gift_package), gift_package?.ToDictionary());
            return dict;
        }
    }

    // 礼包信息
    public class GiftPackage
    {
        public string identifier { get; set; }
        public string name { get; set; }
        public string purchase_medium { get; set; }
        public int? price { get; set; }
        public string billing_point { get; set; }

        // 转换为字典
        public Dictionary<string, object> ToDictionary()
        {
            var dict = new Dictionary<string, object>();
            RXUtility.AddValueIfNotNull(dict, nameof(identifier), identifier);
            RXUtility.AddValueIfNotNull(dict, nameof(name), name);
            RXUtility.AddValueIfNotNull(dict, nameof(purchase_medium), purchase_medium);
            RXUtility.AddValueIfNotNull(dict, nameof(price), price);
            RXUtility.AddValueIfNotNull(dict, nameof(billing_point), billing_point);
            return dict;
        }
    }
    public class PayArgs : DataBean
    {

        public string pay_type = "harmony";// string 否   支付类型(参考 pay_type 对照表) ，三方渠道默认使用渠道支付
        public string goods_tag;//  string 是   瑞雪计费点标识
        public string trade_no;//   string 是   商户订单号
        public string transmit_args;//  string 否   透传参数
        public string notify_url;//  string 否   支付成功通知 CP 发货地址
        public string currency = "CNY";//    string 是   币种 全大写 国内传: CNY，参考 国家编码 币种字典
        public object ext;//object 否   支付下单扩展信息，不同渠道具体对接
        public int? indulge_auth;//   int 否   默认(自运营渠道默认值 1 , 三方渠道默认值 0 )， 是否进行防沉迷验证 ，0 不验证、1 验证。
        public int? age; //int 否   默认取登录返回 age 字段
        public string user_real_currency; //   否   用户实际支付币种
        public object user_real_price; //否   用户实际支付金额
        public Dictionary<string, object> custom_ext; //否
        public Dictionary<string, object> game_info; //否
        public Dictionary<string, object> bigdata_report; //否
        public Dictionary<string, object> ToDictionary()
        {
            var dict = new Dictionary<string, object>();
            RXUtility.AddValueIfNotNull(dict, nameof(pay_type), pay_type);
            RXUtility.AddValueIfNotNull(dict, nameof(goods_tag), goods_tag);
            RXUtility.AddValueIfNotNull(dict, nameof(trade_no), trade_no);
            RXUtility.AddValueIfNotNull(dict, nameof(transmit_args), transmit_args);
            RXUtility.AddValueIfNotNull(dict, nameof(notify_url), notify_url);
            RXUtility.AddValueIfNotNull(dict, nameof(currency), currency);
            RXUtility.AddValueIfNotNull(dict, nameof(ext), ext);
            RXUtility.AddValueIfNotNull(dict, nameof(indulge_auth), indulge_auth);
            RXUtility.AddValueIfNotNull(dict, nameof(age), age);
            RXUtility.AddValueIfNotNull(dict, nameof(user_real_currency), user_real_currency);
            RXUtility.AddValueIfNotNull(dict, nameof(user_real_price), user_real_price);
            RXUtility.AddValueIfNotNull(dict, nameof(custom_ext), custom_ext);
            RXUtility.AddValueIfNotNull(dict, nameof(bigdata_report), bigdata_report);
            RXUtility.AddValueIfNotNull(dict, nameof(game_info), game_info);
            return dict;
        }
    }

    public class UpdateUserInfoArgs : DataBean
    {

        public string avatarurl;
        public string nickname;
        /// <summary>
        /// 性别 1 男 ,0 女，无改动传-1
        /// </summary> 
        public int sex = -1;
        public string wechat_avatarurl;

    }
    public class ChangePasswordArgs : DataBean
    {
        public string old_password;
        public string new_password;
        public void SetPassword(string oldpwd, string newpwd)
        {
            old_password = CryptoUtility.GetMD5(oldpwd);
            new_password = CryptoUtility.GetMD5(newpwd);
            _isHashPwd = true;
        }
        public ChangePasswordArgs HandPasswordHash()
        {
            if (!_isHashPwd)
            {
                old_password = CryptoUtility.GetMD5(old_password);
                new_password = CryptoUtility.GetMD5(new_password);
                _isHashPwd = true;
            }
            return this;
        }
        private bool _isHashPwd;

    }
    public class ResetPasswordArgs : DataBean
    {

        public string username;
        public string password;
        public string captcha_code;
        public string MD5Password
        {
            set
            {
                password = CryptoUtility.GetMD5(value);
                _isHashPwd = true;
            }
        }
        public ResetPasswordArgs HandPasswordHash()
        {
            if (!_isHashPwd)
            {
                password = CryptoUtility.GetMD5(password);
                _isHashPwd = true;
            }
            return this;
        }
        private bool _isHashPwd;

    }
    public class RealAuthArgs : DataBean
    {
        public string realname;
        public string idcard;

    }

    public class UpdateAppArgs : DataBean
    {
        public string type;

    }
    public class LegalArgs : DataBean
    {
        public string product_id;
        public string channel_id;
        /// <summary>
        /// 法务keys 逗号分割
        /// </summary>
        public string keys;
        /// <summary>
        /// 1登录 2用户中心 4其他， 可keys二选一
        /// </summary>
        public string position;
        /// <summary>
        /// 法务keys
        /// </summary>
        /// <param name="k">keys 数组</param>
        public LegalArgs SetKeys(string[] k)
        {
            keys = string.Join(",", k);
            return this;
        }

        public Dictionary<string, object> ToDictionary()
        {
            var dict = new Dictionary<string, object>();
            RXUtility.AddValueIfNotNull(dict, nameof(product_id), product_id);
            RXUtility.AddValueIfNotNull(dict, nameof(channel_id), channel_id);
            RXUtility.AddValueIfNotNull(dict, nameof(keys), keys);
            RXUtility.AddValueIfNotNull(dict, nameof(position), position);
            return dict;
        }
    }



    public class WebParams : DataBean
    {
        public string config_prams;
        public string custom_params;

        public void SetConfigParams(Dictionary<string, object> pairs)
        {
            config_prams = RXUtility.ObjectToJson(pairs);
        }
        public void SetCustomParams(Dictionary<string, object> pairs)
        {
            custom_params = RXUtility.ObjectToJson(pairs);
        }
    }

    public class WebViewConfig : DataBean
    {
        public string url;
        public string title;
        public bool naviBarVisible = true;
        public bool closeVisible = true;
        public bool backVisible = false;
        public bool newView = true;
        public WebParams webParams;
    }
    public class PrivacyKeyAgrs : DataBean
    {
        public string key;
        public string[] key_list;
    }
    public class TrackDataArgs : DataBean
    {
        public string event_name;
        public Dictionary<string, object> properties;
        public string distinct_id;
        public bool report_at_time;
    }

    public class UserCenterUIConfig : DataBean
    {
        public UserCenterUIArgs config_prams;
        public HelpCenterUIArgs custom_params;
    }


    public class UserCenterUIArgs
    {
        /// <summary>
        /// 配置用户中心入口
        /// </summary>
        public string[] btns;
    }

    public class HelpCenterUIArgs : DataBean
    {
        //透传参数
        public string transmit_args;
        //游戏id
        public string game_user_id;
        //用户昵称
        public string nickname;
        public string head_img_url;
        public string queue_name;
        public bool light_theme;

    }


}