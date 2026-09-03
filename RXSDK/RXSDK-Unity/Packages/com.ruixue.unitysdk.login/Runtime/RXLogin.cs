using System.Collections.Generic;
using RuiXue.Login.Impl;

namespace RuiXue.Login
{
    public static class RXLogin
    {
#if UNITY_ANDROID
        private static readonly IRXLogin _sdk = new RXLoginAndroid();
#elif UNITY_IOS
        private static IRXLogin _sdk = new RXLoginIOS();
#elif UNITY_WEBGL
        private static IRXLogin _sdk = new RXLoginWebGL();        
#else
        private static IRXLogin _sdk = new RXLoginNotSupport();
#endif
        
        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <param name="captchaCode"></param>
        /// <param name="ext"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void Register(string username, string password, string captchaCode, Dictionary<string, object> ext, 
            RequestResponseDelegate onResponse,RequestErrorDelegate onError)
        {
            _sdk.Register(username, password, captchaCode, ext, onResponse, onError);
        }

        public static void Login(LoginConfig loginConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.Login(loginConfig, onResponse, onError);
        }

        /// <summary>
        /// 注销
        /// </summary>
        /// <param name="idcard"></param>
        /// <param name="realname"></param>
        /// <param name="cpdata"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void Deregister(RXDeregisterConfig deregisterConfig, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk.Deregister(deregisterConfig, onResponse, onError);
        }

        /// <summary>
        /// 撤销注销申请
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void DeregisterCancel(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.DeregisterCancel(onResponse, onError);
        }

        /// <summary>
        /// 查询当前用户绑定的手机/邮箱账号
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void SearchBindingAccounts(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.SearchBindingAccounts(onResponse, onError);
        }

        /// <summary>
        /// 获取验证码（发送验证码）
        /// </summary>
        /// <param name="type"></param>
        /// <param name="target"></param>
        /// <param name="purpose"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void SendCaptcha(CaptchaType type, string target, string purpose, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.SendCaptcha(type, target, purpose, onResponse, onError);
        }

        /// <summary>
        /// 校验验证码
        /// </summary>
        /// <param name="type"></param>
        /// <param name="target"></param>
        /// <param name="purpose"></param>
        /// <param name="captcha_code"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void VerifyCaptcha(CaptchaType type, string target, string purpose, string captcha_code, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.VerifyCaptcha(type, target, purpose, captcha_code, onResponse, onError);
        }

        /// <summary>
        /// 绑定邮箱
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="captcha_code"></param>
        /// <param name="migrate_args"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void BindEmail(string email, string password, string captcha_code, object migrate_args,
             RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.BindEmail(email, password, captcha_code, migrate_args, onResponse, onError);
        }

        /// <summary>
        /// 解绑邮箱
        /// </summary>
        /// <param name="email"></param>
        /// <param name="captcha_code"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void UnBindEmail(string email, string captcha_code, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.UnBindEmail(email, captcha_code, onResponse, onError);
        }

        /// <summary>
        /// 绑定手机号
        /// </summary>
        /// <param name="phone"></param>
        /// <param name="password"></param>
        /// <param name="captcha_code"></param>
        /// <param name="migrate_args"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void BindPhone(string phone, string password, string captcha_code, object migrate_args, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.BindPhone(phone, password, captcha_code, migrate_args, onResponse, onError);
        }

        /// <summary>
        /// 解绑手机号
        /// </summary>
        /// <param name="phone"></param>
        /// <param name="captcha_code"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void UnBindPhone(string phone, string captcha_code, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.UnBindPhone(phone, captcha_code, onResponse, onError);
        }

        /// <summary>
        /// 修改手机号
        /// </summary>
        /// <param name="newPhone"></param>
        /// <param name="newPhoneCaptcha"></param>
        /// <param name="oldPhoneCaptcha"></param>
        /// <param name="migrateArgs"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void ChangePhone(string newPhone, string newPhoneCaptcha, string oldPhoneCaptcha, object migrateArgs, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.ChangePhone(newPhone, newPhoneCaptcha, oldPhoneCaptcha, migrateArgs, onResponse, onError);
        }

        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetUserInfo(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.GetUserInfo(onResponse, onError);
        }

        /// <summary>
        /// 获取指定用户信息
        /// </summary>
        /// <param name="param"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetUserInfoByField(Dictionary<string, object> param, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _sdk.GetUserInfoByField(param, onResponse, onError);
        }

        /// <summary>
        /// 修改用户信息
        /// </summary>
        /// <param name="nickname"></param>
        /// <param name="avatarUrl"></param>
        /// <param name="region"></param>
        /// <param name="sex"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void UpdateUserInfo(string nickname, string avatarUrl, string region, int sex, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.UpdateUserInfo(nickname, avatarUrl, region, sex, onResponse, onError);
        }

        /// <summary>
        /// 修改密码
        /// </summary>
        /// <param name="old_password"></param>
        /// <param name="new_password"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void ChangePassword(string old_password, string new_password, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.ChangePassword(old_password, new_password, onResponse, onError);
        }

        /// <summary>
        /// 重置密码
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <param name="captcha_code"></param>
        /// <param name="migrate_args"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void ResetPassword(string username, string password, string captcha_code, object migrate_args, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.ResetPassword(username, password, captcha_code, migrate_args, onResponse, onError);
        }

        /// <summary>
        /// 实名认证
        /// </summary>
        /// <param name="realname"></param>
        /// <param name="idcard"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void RealAuth(string realname, string idcard, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.RealAuth(realname, idcard, onResponse, onError);
        }

        /// <summary>
        /// 退出登录，目前Android端逻辑
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="RequestErrorDelegate"></param>
        public static void Logout(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.Logout(onResponse, onError);
        }
        
        #if UNITY_WEBGL
        /// <summary>
        /// 同步用户信息，only For js sdk
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void WebGL_UserInfoSync(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            if (_sdk is RXLoginWebGL sdkWebGL)
            {
                sdkWebGL.UserInfoSync(onResponse, onError);
            }
        }
        
        /// <summary>
        /// 静默同步用户信息， only For js sdk
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void WebGL_UserInfoSilentSync(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            if (_sdk is RXLoginWebGL sdkWebGL)
            {
                sdkWebGL.UserInfoSilentSync(onResponse, onError);
            }
        }
        #endif
    }
}


