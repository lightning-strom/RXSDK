using System.Collections.Generic;
using System.Runtime.InteropServices;
using RuiXue.Impl;
using RuiXueLitJson;
using UnityEngine;

#if UNITY_WEBGL
namespace RuiXue.Login.Impl
{
    public class RXLoginWebGL: JsCallBackHandlerBase,IRXLogin
    {
        public void Logout(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("Logout");
        }

        public void Register(string username, string password, string captchaCode, Dictionary<string, object> ext, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("Register");
        }

        public void Login(string loginType, string username, string password, string captchaCode, string loginOpenId, 
            Dictionary<string, object> ext,
            string[] signFields, object migrateArgs, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
             var data = new JsonData
             {
                 ["version"] = "normal",
                 ["method"] = loginType
             };

            if (signFields != null && signFields.Length > 0)
            {
                data["sign_fields"] = JsonMapper.ToObject(JsonMapper.ToJson(signFields));
            }

            if (!string.IsNullOrEmpty(loginOpenId))
            {
                data["login_openid"] = loginOpenId;
            }

            if (ext != null && ext.Count > 0)
            {
                data["ext"] = JsonMapper.ToObject(JsonMapper.ToJson(ext));
            }

            RegisterJsCallBack("rx_login", onResponse, onError);
            rx_login(data.ToJson());
        }

        public void Login(LoginConfig loginConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["version"] = loginConfig.version,
                ["force"] = loginConfig.force,
                ["method"] = loginConfig.loginType
            };

            if (loginConfig.signFields != null && loginConfig.signFields.Length > 0)
            {
                data["sign_fields"] = JsonMapper.ToObject(JsonMapper.ToJson(loginConfig.signFields));
            }

            if (!string.IsNullOrEmpty(loginConfig.loginOpenId))
            {
                data["login_openid"] = loginConfig.loginOpenId;
            }

            if (loginConfig.ext != null && loginConfig.ext.Count > 0)
            {
                data["ext"] = JsonMapper.ToObject(JsonMapper.ToJson(loginConfig.ext));
            }

            RegisterJsCallBack("rx_login", onResponse, onError);
            rx_login(data.ToJson());
        }

        public void Deregister(RXDeregisterConfig deregisterConfig, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            JsonData data = JsonMapper.ToObject(JsonMapper.ToJson(deregisterConfig));
            
            RegisterJsCallBack("rx_deregister", onResponse, onError);
            rx_deregister(data.ToJson());
        }

        public void Deregister(string idcard, string realname, string cpdata, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["idcard"] = idcard,
                ["realname"] = realname,
                ["cpdata"] = cpdata,
            };
            
            RegisterJsCallBack("rx_deregister", onResponse, onError);
            rx_deregister(data.ToJson());
        }

        public void DeregisterCancel(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RegisterJsCallBack("rx_deregisterCancel", onResponse, onError);
            rx_deregisterCancel();
        }

        public void SearchBindingAccounts(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("SearchBindingAccounts");
        }

        public void SendCaptcha(CaptchaType type, string target, string purpose, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["purpose"] = purpose,
            };

            if (type == CaptchaType.CaptchaType_email)
            {
                data["email"] = target;
            }else if (type == CaptchaType.CaptchaType_phone)
            {
                data["phone"] = target;
            }
            
            RegisterJsCallBack("rx_sendCaptcha", onResponse, onError);
            rx_sendCaptcha(data.ToJson());
        }

        public void VerifyCaptcha(CaptchaType type, string target, string purpose, string captcha_code,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("VerifyCaptcha");
        }

        public void BindEmail(string email, string password, string captcha_code, object migrate_args,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["email"] = email,
                ["captcha_code"] = captcha_code,
                ["password"] = password,
            };
            
            RegisterJsCallBack("rx_bindEmail", onResponse, onError);
            rx_bindEmail(data.ToJson());
        }

        public void UnBindEmail(string email, string captcha_code, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["email"] = email,
                ["captcha_code"] = captcha_code,
            };
            
            RegisterJsCallBack("rx_unbindEmail", onResponse, onError);
            rx_unbindEmail(data.ToJson());
        }

        public void BindPhone(string phone, string password, string captcha_code, object migrate_args,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["phone"] = phone,
                ["captcha_code"] = captcha_code,
                ["password"] = password,
            };
            
            RegisterJsCallBack("rx_bindPhone", onResponse, onError);
            rx_bindPhone(data.ToJson());
        }

        public void UnBindPhone(string phone, string captcha_code, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["phone"] = phone,
                ["captcha_code"] = captcha_code,
            };
            
            RegisterJsCallBack("rx_unbindPhone", onResponse, onError);
            rx_unbindPhone(data.ToJson());
        }

        public void ChangePhone(string newPhone, string newPhoneCaptcha, string oldPhoneCaptcha, object migrateArgs,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("ChangePhone");
        }

        public void GetUserInfo(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RegisterJsCallBack("rx_getUserInfo", onResponse, onError);
            rx_getUserInfo();
        }

        public void GetUserInfoByField(Dictionary<string, object> param, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetUserInfoByField");
        }

        public void UpdateUserInfo(string nickname, string avatarUrl, string region, int sex, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["nickname"] = nickname,
                ["avatarurl"] = avatarUrl,
                ["region"] = region,
                ["sex"] = sex,
            };
            RegisterJsCallBack("rx_updateUserInfo", onResponse, onError);
            rx_updateUserInfo(data.ToJson());
        }

        public void ChangePassword(string old_password, string new_password, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("ChangePassword");
        }

        public void ResetPassword(string username, string password, string captcha_code, object migrate_args,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("ResetPassword");
        }

        public void RealAuth(string realname, string idcard, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("RealAuth");
        }

        public void UserInfoSync(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RegisterJsCallBack("rx_infoSync", onResponse, onError);
            rx_infoSync();
        }
        
        public void UserInfoSilentSync(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RegisterJsCallBack("rx_userInfoSilentSync", onResponse, onError);
            rx_userInfoSilentSync();
        }
        
        [DllImport("__Internal")]
        private static extern void rx_infoSync();
        
        [DllImport("__Internal")]
        private static extern void rx_userInfoSilentSync();
        
        [DllImport("__Internal")]
        private static extern void rx_login(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_deregister(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_deregisterCancel();
        
        [DllImport("__Internal")]
        private static extern void rx_sendCaptcha(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_bindEmail(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_unbindEmail(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_bindPhone(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_unbindPhone(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_getUserInfo();
        
        [DllImport("__Internal")]
        private static extern void rx_updateUserInfo(string json);
    }
}
#endif