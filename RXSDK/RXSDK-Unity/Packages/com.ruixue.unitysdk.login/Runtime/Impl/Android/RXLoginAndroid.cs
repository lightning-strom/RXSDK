#if UNITY_ANDROID
using System.Collections.Generic;
using RuiXueLitJson;
using UnityEngine;
namespace RuiXue.Login.Impl
{
    internal class RXLoginAndroid : IRXLogin
    {
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _rxSdkObj;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaObject _rxApiObj;
        private static AndroidJavaClass _jSONUtil;

        public RXLoginAndroid()
        {
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _rxSdkObj = new AndroidJavaClass("com.ruixue.RuiXueSdk");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            _rxApiObj = _rxSdkObj.CallStatic<AndroidJavaObject>("getRXSdkApi");
            _jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
        }

        public void Register(string username, string password, string captchaCode, Dictionary<string, object> ext, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject extMap = null;
            if (ext != null)
            {
                string jsonStr = JsonMapper.ToJson(ext);
                extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            }
            _rxApiObj.Call("register", username, password, captchaCode, extMap, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void Login(string loginType, string username, string password, string captchaCode, string loginOpenId, 
            Dictionary<string, object> ext, string[] signFields, object migrateArgs, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject extMap = null;
            if (ext != null)
            {
                string jsonStr = JsonMapper.ToJson(ext);
                extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            }

            AndroidJavaObject list = JavaArrayListExtensionMethod.CreateJavaArrayList();
            AndroidJavaObject[] javaArr = null;
            if (signFields != null)
            {
                foreach (var item in signFields)
                {
                    list.Add(item);
                }
                javaArr = list.Call<AndroidJavaObject[]>("toArray");
            }
            AndroidJavaObject migrateArgsJavaObj = null;
            if (migrateArgs != null)
            {
                string jsonStr = JsonMapper.ToJson(migrateArgs);
                migrateArgsJavaObj = _jSONUtil.CallStatic<AndroidJavaObject>("toJSONObject", jsonStr);
            }

            _rxApiObj.Call("login", _contextObj, loginType, username, password, captchaCode, loginOpenId, 
            extMap, javaArr, migrateArgsJavaObj, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void Login(LoginConfig loginConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject extMap = null;
            if (loginConfig.ext != null)
            {
                string jsonStr = JsonMapper.ToJson(loginConfig.ext);
                extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            }

            AndroidJavaObject list = JavaArrayListExtensionMethod.CreateJavaArrayList();
            AndroidJavaObject[] javaArr = null;
            if (loginConfig.signFields != null)
            {
                foreach (var item in loginConfig.signFields)
                {
                    list.Add(item);
                }
                javaArr = list.Call<AndroidJavaObject[]>("toArray");
            }
            AndroidJavaObject migrateArgsJavaObj = null;
            if (loginConfig.migrateArgs != null)
            {
                string jsonStr = JsonMapper.ToJson(loginConfig.migrateArgs);
                migrateArgsJavaObj = _jSONUtil.CallStatic<AndroidJavaObject>("toJSONObject", jsonStr);
            }

            _rxApiObj.Call("login", _contextObj, loginConfig.loginType, loginConfig.username, loginConfig.password, loginConfig.captchaCode, loginConfig.loginOpenId, 
                extMap, javaArr, migrateArgsJavaObj, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void Deregister(RXDeregisterConfig deregisterConfig, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject configObj = new AndroidJavaObject("com.ruixue.openapi.RXDeregisterConfig");
            configObj.Call("setIdCard", deregisterConfig.idcard);
            configObj.Call("setRealName", deregisterConfig.realname);
            configObj.Call("setCpData", deregisterConfig.cpdata);

            if (deregisterConfig.thirdParams != null)
            {
                string jsonStr = JsonMapper.ToJson(deregisterConfig.thirdParams);
                AndroidJavaObject extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
                configObj.Call("setThirdParams", extMap);
            }
            
            
            _rxApiObj.Call("deregister", configObj, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void DeregisterCancel(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("deregisterCancel", null, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void SearchBindingAccounts(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("searchBindingAccounts", new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void SendCaptcha(CaptchaType type, string target, string purpose, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaClass typeClass = new AndroidJavaClass("com.ruixue.openapi.CaptchaType");
            AndroidJavaObject captchaObj = null;
            if (type == CaptchaType.CaptchaType_phone)
            {
                captchaObj = typeClass.GetStatic<AndroidJavaObject>("CaptchaType_phone");
            }else if (type == CaptchaType.CaptchaType_email)
            {
                captchaObj = typeClass.GetStatic<AndroidJavaObject>("CaptchaType_email");
            }
            _rxApiObj.Call<bool>("sendCaptcha", captchaObj, target, purpose, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void VerifyCaptcha(CaptchaType type, string target, string purpose, string captcha_code,
             RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaClass typeClass = new AndroidJavaClass("com.ruixue.openapi.CaptchaType");
            AndroidJavaObject captchaObj = null;
            if (type == CaptchaType.CaptchaType_phone)
            {
                captchaObj = typeClass.GetStatic<AndroidJavaObject>("CaptchaType_phone");
            }else if (type == CaptchaType.CaptchaType_email)
            {
                captchaObj = typeClass.GetStatic<AndroidJavaObject>("CaptchaType_email");
            }
            _rxApiObj.Call<bool>("verifyCaptcha", captchaObj, target, purpose, captcha_code, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void BindEmail(string email, string password, string captcha_code, object migrate_args, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject migrateArgsJavaObj = null;
            if (migrate_args != null)
            {
                string jsonStr = JsonMapper.ToJson(migrate_args);
                migrateArgsJavaObj = _jSONUtil.CallStatic<AndroidJavaObject>("toJSONObject", jsonStr);
            }
            _rxApiObj.Call("bindEmail", email, password, captcha_code, migrateArgsJavaObj, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void UnBindEmail(string email, string captcha_code, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("unBindEmail", email, captcha_code, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void BindPhone(string phone, string password, string captcha_code, object migrate_args, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject migrateArgsJavaObj = null;
            if (migrate_args != null)
            {
                string jsonStr = JsonMapper.ToJson(migrate_args);
                migrateArgsJavaObj = _jSONUtil.CallStatic<AndroidJavaObject>("toJSONObject", jsonStr);
            }
            _rxApiObj.Call("bindPhone", phone, password, captcha_code, migrateArgsJavaObj,
                 new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void UnBindPhone(string phone, string captcha_code, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("unBindPhone", phone, captcha_code, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void ChangePhone(string newPhone, string newPhoneCaptcha, string oldPhoneCaptcha, object migrateArgs,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject migrateArgsJavaObj = null;
            if (migrateArgs != null)
            {
                string jsonStr = JsonMapper.ToJson(migrateArgs);
                migrateArgsJavaObj = _jSONUtil.CallStatic<AndroidJavaObject>("toJSONObject", jsonStr);
            }
            _rxApiObj.Call("changePhone", newPhone, newPhoneCaptcha, oldPhoneCaptcha, migrateArgsJavaObj, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetUserInfo(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("getUserInfo", new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetUserInfoByField(Dictionary<string, object> param, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            string jsonStr = JsonMapper.ToJson(param ?? new Dictionary<string, object>());
            AndroidJavaObject paramMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            _rxApiObj.Call("getUserInfoByField", paramMap, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void UpdateUserInfo(string nickname, string avatarUrl, string region, int sex, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("updateUserInfo", nickname, avatarUrl, region, sex, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void ChangePassword(string old_password, string new_password, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("changePassword", old_password, new_password, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void ResetPassword(string username, string password, string captcha_code, object migrate_args, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject migrateArgsJavaObj = null;
            if (migrate_args != null)
            {
                string jsonStr = JsonMapper.ToJson(migrate_args);
                migrateArgsJavaObj = _jSONUtil.CallStatic<AndroidJavaObject>("toJSONObject", jsonStr);
            }
            _rxApiObj.Call("resetPassword", username, password, captcha_code, migrateArgsJavaObj, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void RealAuth(string realname, string idcard, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("realAuth", realname, idcard, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void Logout(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxSdkObj.CallStatic("logout", new LoginOutJavaProxy(onResponse, onError));
        }

    }
}

#endif