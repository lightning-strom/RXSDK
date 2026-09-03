using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;
#if UNITY_IOS
namespace RuiXue.Login.Impl
{
    internal class RXLoginIOS : IRXLogin
    {
        public void DeregisterCancel(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_deregisterCancelWithComplete", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_deregisterCancelWithComplete(RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void SearchBindingAccounts(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            /*
            RuiXueSdkDriver.RegisterIOSCallBackHandler("ios_searchHasAccountsWithMethod", new IOSCallBackHandler
            {
                onResponse = onResponse,
                onError = onError
            });
            */
            
            Debug.LogError("ios 未实现该方法 [SearchBindingAccounts]");
            //ios_searchHasAccountsWithMethod(BridgeCallBack_RequestResponse, BridgeCallBack_RequestError);
        }

        public void GetUserInfo(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_getUserInfoWithComplete", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_getUserInfoWithComplete(RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetUserInfoByField(Dictionary<string, object> param, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_getUserInfoByFieldWithParams", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            string jsonParam = RXJsonUtil.ToJson(param ?? new Dictionary<string, object>());
            ios_getUserInfoByFieldWithParams(jsonParam, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void Logout(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
             LogUtil.WarningNotSupport("Logout");
        }

        public void Register(string username, string password, string captchaCode, Dictionary<string, object> ext,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_registerWithUsername", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            string jsonExt = RXJsonUtil.ToJson(ext);
            
            ios_registerWithUsername(username, password, captchaCode,jsonExt, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void Login(string loginType, string username, string password, string captchaCode, string loginOpenId,
            Dictionary<string, object> ext, string[] signFields, object migrateArgs, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            string[] permissions = {};
            string jsonPermissions = RXJsonUtil.ToJson(permissions);
            string jsonExt = RXJsonUtil.ToJson(ext);
            string jsonSignFields = RXJsonUtil.ToJson(signFields);
            string jsonMigrateArgs = RXJsonUtil.ToJson(migrateArgs);
            
            RuiXueSdkDriver.RegisterIOSCallBack("ios_loginWithLoginType", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            var loginTypeForIOS = LoginTypeForIOSExtension.FromLoginMethod(loginType);
            ios_loginWithLoginType((int)loginTypeForIOS, username, password, captchaCode, jsonPermissions, loginOpenId, jsonExt, jsonSignFields, jsonMigrateArgs, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }
        
        public void LoginWithPermissions(string loginType, string username, string password, string captchaCode, string[] permissions, string loginOpenId,
            Dictionary<string, object> ext, string[] signFields, object migrateArgs, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            string jsonPermissions = RXJsonUtil.ToJson(permissions);
            string jsonExt = RXJsonUtil.ToJson(ext);
            string jsonSignFields = RXJsonUtil.ToJson(signFields);
            string jsonMigrateArgs = RXJsonUtil.ToJson(migrateArgs);
            
            RuiXueSdkDriver.RegisterIOSCallBack("ios_loginWithLoginType", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            var loginTypeForIOS = LoginTypeForIOSExtension.FromLoginMethod(loginType);
            ios_loginWithLoginType((int)loginTypeForIOS, username, password, captchaCode, jsonPermissions, loginOpenId, jsonExt, jsonSignFields, jsonMigrateArgs, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void Login(LoginConfig loginConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            string jsonPermissions = RXJsonUtil.ToJson(loginConfig.permissions);
            string jsonExt = RXJsonUtil.ToJson(loginConfig.ext);
            string jsonSignFields = RXJsonUtil.ToJson(loginConfig.signFields);
            string jsonMigrateArgs = RXJsonUtil.ToJson(loginConfig.migrateArgs);
            
            RuiXueSdkDriver.RegisterIOSCallBack("ios_loginWithLoginType", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            var loginTypeForIOS = LoginTypeForIOSExtension.FromLoginMethod(loginConfig.loginType);
            ios_loginWithLoginType((int)loginTypeForIOS, loginConfig.username, loginConfig.password, loginConfig.captchaCode, jsonPermissions, loginConfig.loginOpenId, jsonExt, jsonSignFields, jsonMigrateArgs, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void Deregister(RXDeregisterConfig deregisterConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_deregisterWithRealname", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            string config = RXJsonUtil.ToJson(deregisterConfig);
            ios_deregisterWithConfig(config, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void SendCaptcha(CaptchaType type, string target, string purpose, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_sendCaptchaWithType", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_sendCaptchaWithType((int)type, target, purpose, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void VerifyCaptcha(CaptchaType type, string target, string purpose, string captcha_code,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_verifyCaptchaWithType", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_verifyCaptchaWithType((int)type, target, purpose, captcha_code, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void BindEmail(string email, string password, string captcha_code, object migrate_args,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_bindEmailWithEmail", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            string jsonMigrateArgs = RXJsonUtil.ToJson(migrate_args);
            ios_bindEmailWithEmail(email, password, captcha_code, jsonMigrateArgs, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void UnBindEmail(string email, string captcha_code, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_unBindEmailWithEmail", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_unBindEmailWithEmail(email, captcha_code, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void BindPhone(string phone, string password, string captcha_code, object migrate_args,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_bindPhoneWithCaptchaCode", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            string jsonMigrateArgs = RXJsonUtil.ToJson(migrate_args);
            ios_bindPhoneWithCaptchaCode(captcha_code, password, phone, jsonMigrateArgs, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void UnBindPhone(string phone, string captcha_code, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_unBindPhoneWithCaptchaCode", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_unBindPhoneWithCaptchaCode(captcha_code, phone, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void ChangePhone(string newPhone, string newPhoneCaptcha, string oldPhoneCaptcha, object migrateArgs,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_changePhoneWithOldPhoneCaptcha", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            string jsonMigrateArgs = RXJsonUtil.ToJson(migrateArgs);
            ios_changePhoneWithOldPhoneCaptcha(oldPhoneCaptcha, newPhone, newPhoneCaptcha, jsonMigrateArgs, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void UpdateUserInfo(string nickname, string avatarUrl, string region, int sex,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_updateUserInfo", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_updateUserInfo(avatarUrl, nickname, sex.ToString(), region, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void ChangePassword(string old_password, string new_password, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_changePasswordWithNewPwd", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_changePasswordWithNewPwd(new_password,old_password, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void ResetPassword(string username, string password, string captcha_code, object migrate_args,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_resetPasswordWithUsername", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            string jsonMigrateArgs = RXJsonUtil.ToJson(migrate_args);
            ios_resetPasswordWithUsername(username, password, captcha_code, jsonMigrateArgs, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void RealAuth(string realname, string idcard, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_realAuthWithRealName", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_realAuthWithRealName(realname, idcard,RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }
        
        // 登录
        [DllImport("__Internal")]
        public static extern void ios_loginWithLoginType(int LoginType, string username,
            string password,
            string captchaCode,
            string permissions,
            string loginOpenId,
            string jsonExtDic,
            string jsonArraySignFields,
            string jsonMigrateArgs,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError
        );


        // 注册
        [DllImport("__Internal")]
        public static extern void ios_registerWithUsername(string username,
            string password,
            string captchaCode,
            string jsonExtDic,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError
        );


// 发送验证码
        [DllImport("__Internal")]
        public static extern void ios_sendCaptchaWithType(int captchaType,
            string target,
            string purpose,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);


// 校验验证码
        [DllImport("__Internal")]
        public static extern void ios_verifyCaptchaWithType(int captchaType,
            string target,
            string purpose,
            string captchaCode,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);


// 绑定邮箱
        [DllImport("__Internal")]
        public static extern void ios_bindEmailWithEmail(string email,
            string password,
            string captchaCode,
            string jsonMigrateArgs,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);


// 解绑邮箱
        [DllImport("__Internal")]
        public static extern void ios_unBindEmailWithEmail(string email,
            string captchaCode,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);


// 绑定手机
        [DllImport("__Internal")]
        public static extern void ios_bindPhoneWithCaptchaCode(string captchaCode,
            string password,
            string phone,
            string jsonMigrateArgs,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);

// 解绑手机
        [DllImport("__Internal")]
        public static extern void ios_unBindPhoneWithCaptchaCode(string captchaCode,
            string phone,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);

// 修改手机号
        [DllImport("__Internal")]
        public static extern void ios_changePhoneWithOldPhoneCaptcha(string oldPhoneCaptcha,
            string newphone,
            string newphone_captcha,
            string jsonMigrateArgs,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);


// 获取用户信息
        [DllImport("__Internal")]
        public static extern void ios_getUserInfoWithComplete(IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);

// 获取指定用户信息
        [DllImport("__Internal")]
        public static extern void ios_getUserInfoByFieldWithParams(string jsonParam,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);


// 修改用户信息
        [DllImport("__Internal")]
        public static extern void ios_updateUserInfo(string avatarUrl,
            string nickname,
            string sex,
            string region,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);


// 修改密码
        [DllImport("__Internal")]
        public static extern void ios_changePasswordWithNewPwd(string newPwd,
            string oldPwd,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);


// 重置密码
        [DllImport("__Internal")]
        public static extern void ios_resetPasswordWithUsername(string username,
            string password,
            string captchaCode,
            string jsonMigrateArgs,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);

// 实名认证
        [DllImport("__Internal")]
        public static extern void ios_realAuthWithRealName(string realName,
            string idCard,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);


// 查询用户拥有的账号
        [DllImport("__Internal")]
        public static extern void ios_searchHasAccountsWithMethod(string method,
            string deviceCode,
            int states,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);


// 申请注销账号
        [DllImport("__Internal")]
        public static extern void ios_deregisterWithConfig(string config,
            IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);

// 撤销注销申请
        [DllImport("__Internal")]
        public static extern void ios_deregisterCancelWithComplete(IOSCallBackCommonDelegate requestResponse,
            IOSCallBackCommonDelegate requestError);
    }
}
#endif