#if UNITY_ANDROID

using System.Collections.Generic;
using UnityEngine;
using System;
using RuiXueLitJson;

namespace RuiXue.Impl
{
    internal class RuiXueSdkAndroid : IRuiXueSdk
    {
        private const string BindAccountMinAndroidSdkVersion = "4.0.8";
        private const string IIFAAMinAndroidSdkVersion = "4.0.9";
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _rxSdkObj;
        private static AndroidJavaClass _rxSdkSpecialForUnity;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaObject _rxApiObj;
        private static AndroidJavaClass _jSONUtil;
        
        public RuiXueSdkAndroid()
        {
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _rxSdkObj = new AndroidJavaClass("com.ruixue.RuiXueSdk");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            _rxApiObj = _rxSdkObj.CallStatic<AndroidJavaObject>("getRXSdkApi");
            _jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
            try
            {
                _rxSdkSpecialForUnity = new AndroidJavaClass("com.ruixue.openapi.RXSdkSpecialForUnity");
            }
            catch (Exception e)
            {
                LogUtil.Log("EventManager", e.Message);
            }
        }
        
        public void SetLogEnable(bool logEnabled)
        {
            LogUtil.LogEnabled = logEnabled;
            _rxSdkObj.CallStatic("setLogEnable", logEnabled);
        }
        
        public void Initialize(string cpid, string productid, string channelid, List<string> urls,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject ListObj = JavaArrayListExtensionMethod.CreateJavaArrayList();
            foreach (var item in urls)
            {
                ListObj.Add(item);
            }
            
            _rxSdkObj.CallStatic("initialize", cpid, productid, channelid, ListObj, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void Initialize(RXSdkInitConfig rxSdkInitConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject ListObj = JavaArrayListExtensionMethod.CreateJavaArrayList();
            foreach (var item in rxSdkInitConfig.baseUrlList)
            {
                ListObj.Add(item);
            }
            AndroidJavaObject configObj = new AndroidJavaObject("com.ruixue.RXSdkInitConfig", 
                rxSdkInitConfig.cpId, rxSdkInitConfig.productId, rxSdkInitConfig.channelId, 
                new JsonCallbackJavaProxy(onResponse, onError), ListObj);
            configObj.Call("setLogEnable", rxSdkInitConfig.isLogEnable);
            configObj.Call("setUsePrivacy", rxSdkInitConfig.usePrivacy);
            configObj.Call("setAgreementTitle", rxSdkInitConfig.agreementTitle);
            configObj.Call("setUseDNS", rxSdkInitConfig.isUseDNS);
            configObj.Call("setAutoInitThird", rxSdkInitConfig.autoInitThird);
            if (rxSdkInitConfig.agreementMap != null)
            {
                var jsonStr = JsonMapper.ToJson(rxSdkInitConfig.agreementMap);
                AndroidJavaObject extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
                configObj.Call("setAgreementMap", extMap);
            }
            if (rxSdkInitConfig.thirdSdkParams != null)
            {
                var jsonStr = JsonMapper.ToJson(rxSdkInitConfig.thirdSdkParams);
                AndroidJavaObject thirdSdkParams =
                    _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
                configObj.Call("setThirdSdkParams", thirdSdkParams);
            }
            
            _rxSdkObj.CallStatic("initialize", configObj);
            
        }

        public void SetSubChannelId(string subChannelId)
        {
            _rxSdkObj.CallStatic("setSubChannelId", subChannelId);
        }

        public void SetGameInfo(string roleId, string regionTag)
        {
            _rxApiObj.Call("setGameInfo", roleId, regionTag);
        }

        public void SetThirdGameInfo(GameInfo gameInfo)
        {
            if (gameInfo == null)
            {
                throw new ArgumentNullException(nameof(gameInfo));
            }

            using (AndroidJavaObject gameInfoObj = new AndroidJavaObject(
                       "com.ruixue.openapi.GameInfo", gameInfo.type, gameInfo.roleId, gameInfo.serverId))
            {
                gameInfoObj.Call("setRoleName", gameInfo.roleName);
                gameInfoObj.Call("setServerName", gameInfo.serverName);
                gameInfoObj.Call("setGameRoleLevel", gameInfo.gameRoleLevel);
                gameInfoObj.Call("setRoleCreateTime", gameInfo.roleCreateTime);
                gameInfoObj.Call("setPartyId", gameInfo.partyId);
                gameInfoObj.Call("setPartyName", gameInfo.partyName);
                gameInfoObj.Call("setVipLevel", gameInfo.vipLevel);
                gameInfoObj.Call("setGameRolePower", gameInfo.gameRolePower);
                gameInfoObj.Call("setExperience", gameInfo.experience);
                gameInfoObj.Call("setBalance", gameInfo.balance);
                gameInfoObj.Call("setAttach", gameInfo.attach);
                _rxApiObj.Call("setGameInfo", gameInfoObj);
            }
        }

        public void SearchGameAccount(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("searchGameAccount", new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void BindAccount(Dictionary<string, object> ext, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            string sdkVersion = _rxSdkObj.CallStatic<string>("getSdkVersion");
            if (!IsVersionAtLeast(sdkVersion, BindAccountMinAndroidSdkVersion))
            {
                onError?.Invoke(
                    $"BindAccount requires Android SDK >= {BindAccountMinAndroidSdkVersion}, current version is {sdkVersion}. Low versions do not support automatic upgrade.");
                return;
            }

            string jsonStr = JsonMapper.ToJson(ext ?? new Dictionary<string, object>());
            AndroidJavaObject extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            _rxApiObj.Call("bindAccount", _contextObj, extMap, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetIIFAARedirectURL(string appName, string thirdPartSchema, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            if (!CheckIIFAASdkVersion(onError))
            {
                return;
            }

            _rxApiObj.Call("getIIFAARedirectURL", appName, thirdPartSchema,
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetIIFAAResultWithRetryCount(int retryCount, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            if (!CheckIIFAASdkVersion(onError))
            {
                return;
            }

            _rxApiObj.Call("getIIFAAResultWithRetryCount", retryCount,
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetIIFAAResultWithSource(string source, int retryCount, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            if (!CheckIIFAASdkVersion(onError))
            {
                return;
            }

            _rxApiObj.Call("getIIFAAResultWithSource", source, retryCount,
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        private static bool CheckIIFAASdkVersion(RequestErrorDelegate onError)
        {
            string sdkVersion = _rxSdkObj.CallStatic<string>("getSdkVersion");
            if (IsVersionAtLeast(sdkVersion, IIFAAMinAndroidSdkVersion))
            {
                return true;
            }

            onError?.Invoke(
                $"IIFAA real auth requires Android SDK >= {IIFAAMinAndroidSdkVersion}, current version is {sdkVersion}.");
            return false;
        }

        private static bool IsVersionAtLeast(string currentVersion, string minVersion)
        {
            int[] currentParts = ParseVersion(currentVersion);
            int[] minParts = ParseVersion(minVersion);
            if (currentParts == null || minParts == null)
            {
                return false;
            }

            for (int i = 0; i < minParts.Length; i++)
            {
                if (currentParts[i] > minParts[i])
                {
                    return true;
                }

                if (currentParts[i] < minParts[i])
                {
                    return false;
                }
            }

            return true;
        }

        private static int[] ParseVersion(string version)
        {
            if (string.IsNullOrEmpty(version))
            {
                return null;
            }

            string[] parts = version.Split('_')[0].Split('-')[0].Split('.');
            int[] result = new int[] { 0, 0, 0 };
            for (int i = 0; i < result.Length && i < parts.Length; i++)
            {
                string number = "";
                foreach (char c in parts[i])
                {
                    if (!char.IsDigit(c))
                    {
                        break;
                    }

                    number += c;
                }

                if (number.Length == 0 || !int.TryParse(number, out result[i]))
                {
                    return null;
                }
            }

            return result;
        }

        public void SetupAddictDelegate(IAntiAddictDelegate addictDelegate)
        {
            _rxApiObj.Call("setupAddictDelegate", new AntiAddictJavaProxy(addictDelegate));
        }

        public void DisableReadSensitiveInfo(bool disabled)
        {
            _rxSdkObj.CallStatic("disableReadSensitiveInfo", disabled);
        }

        public bool IsAgreedPrivacy()
        {
            return _rxSdkObj.CallStatic<bool>("isAgreedPrivacy");
        }

        public void SetPrivacyAgree(PrivacyAgreeDelegate callback)
        {
            _rxSdkObj.CallStatic("setPrivacyAgree", new PrivacyJavaProxy(callback));
        }

        public void SetLanguage(string language)
        {
            _rxSdkObj.CallStatic("setUnityLanguage", _contextObj, language);
        }

        public void SetScreenCaptureDisable(bool disable)
        {
            _rxSdkObj.CallStatic("setUnityScreenCaptureDisable", _contextObj, disable);
        }

        public void CreateRequest(string url, Dictionary<string, string> header, Dictionary<string, string> body, HttpMethod method, bool needLogin,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject hashMap = JavaHashMapExtensionMethod.CreateJavaHashMap();
            if (body != null)
            {
                foreach (var v in body)
                {
                    hashMap.Put(v.Key, v.Value);
                }
            }

            // needlogin
            AndroidJavaObject obj = _rxApiObj.Call<AndroidJavaObject>("createRequest", url, hashMap);
            obj = obj.Call<AndroidJavaObject>("setNeedLoggedIn", needLogin);
            
            // header;
            if (header != null && header.Count > 0)
            {
                AndroidJavaObject headerMap = JavaHashMapExtensionMethod.CreateJavaHashMap();
                foreach (var v in header)
                {
                    headerMap.Put(v.Key, v.Value);
                }
                obj = obj.Call<AndroidJavaObject>("addHeaders", headerMap);
            }

            // post, get
            if (method == HttpMethod.POST)
            {
                obj.Call("postAsync", new JsonCallbackJavaProxy(onResponse, onError));
            }
            else
            {
                obj.Call("getAsync", new JsonCallbackJavaProxy(onResponse, onError));
            }
        }
        
        public void InitThirdSdk(Dictionary<string, object> map, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            String jsonStr = JsonMapper.ToJson(map);
            AndroidJavaObject extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            
            LogUtil.Log("EventManager", "InitThirdSdk");

            _rxApiObj.Call("unityInitThirdSdk", _contextObj, extMap, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void InvokeChannelAction(string action, Dictionary<string, object> parameters,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            string jsonStr = JsonMapper.ToJson(parameters ?? new Dictionary<string, object>());
            AndroidJavaObject parameterMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            _rxApiObj.Call("unityInvokeChannelAction", _contextObj, action, parameterMap,
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void SetSdkCallback(PublicDelegate publicDelegate, LogoutDelegate logout, SwitchAccountDelegate switchAccount)
        {
            _rxSdkObj.CallStatic("setRuiXueSdkCallback", new RuiXueSdkCallbackJavaProxy(publicDelegate, logout, switchAccount));
        }

        public void ExitApp(ExitConfirmDelegate exitConfirm, ExitCancelDelegate exitCancel)
        {
            _rxSdkObj.CallStatic("exitApp", _contextObj, new AppExitCallbackCallbackJavaProxy(exitConfirm, exitCancel));
        }

        public void GetEmailList(string userId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("getEmailList", userId, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void DeleteEmail(string userId, int type, int mailId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("deleteEmail", userId, type, mailId, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetEmailDetail(string userId, int mailId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("getEmailDetial", userId, mailId, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetEmailAward(string userId, int type, int mailId, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _rxApiObj.Call("getEmailDetial", userId, type, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetAnnouncement(int limit, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("getAnnouncement", limit, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetTempNotice(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("getTempNotice", new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void FeedbackCreate(string content, string[] attachments, string phone, string[] tags,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("feedbackCreate", content, attachments, phone, tags, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetFeedbackList(int page, int size, int status, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("getFeedbackList", page, size, status, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetFeedbackDetail(int id, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("getFeedbackDetail", id, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void FeedbackGetprop(int id, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("feedbackGetprop", id, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetPromoDisplayKEY(bool authRefresh, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("getPromoDisplayKEY", 
                authRefresh, new JsonCallbackJavaProxy(onResponse, onError));
        }
        
        public void ExchangePromoCDKEY(string cdKey, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _rxApiObj.Call("exchangePromoCDKEY", cdKey, 
                new JsonCallbackJavaProxy( onResponse, onError));
        }
        
        public void GetDeviceCode(RequestResponseDelegate onResponse)
        {
            if (onResponse != null)
            {
                onResponse.Invoke(_rxSdkObj.CallStatic<string>("getDeviceCode"));
            }
        }

        public void GetDistinctId(RequestResponseDelegate onResponse)
        {
            if (onResponse != null)
            {
                onResponse.Invoke(_rxSdkObj.CallStatic<string>("getDistinctId"));
            }
        }

        public void ShowCaptchaVerifyUI(string appId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxSdkSpecialForUnity.CallStatic("showCaptchaVerifyUI", _contextObj, appId,
                new JsonCallbackJavaProxy( onResponse, onError));
        }

        public void CheckQuickAp(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("checkQuickAp", new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void SubmitChannelPayment(int amountFen, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("unitySubmitChannelPayment", amountFen,
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void SubmitChannelPayment(int amountFen, Dictionary<string, object> overrideFields,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            string jsonStr = JsonMapper.ToJson(overrideFields ?? new Dictionary<string, object>());
            AndroidJavaObject hashMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            _rxApiObj.Call("unitySubmitChannelPayment", amountFen, hashMap,
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void CheckChannelPaymentLimit(int amountFen, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            _rxApiObj.Call("unityCheckChannelPaymentLimit", _contextObj, amountFen,
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void configErrorMsg(Dictionary<string, object> errorMsgMap)
        {
            String jsonStr = JsonMapper.ToJson(errorMsgMap);
            AndroidJavaObject extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            _rxSdkObj.CallStatic("setErrorMsg", extMap);
        }

        public bool LoginOpenidExpireInvalid()
        {
            return _rxSdkObj.CallStatic<bool>("loginOpenidExpireInvalid");
        }

        public void SetPasswordStrength(RXPasswordStrength type)
        {
            _rxSdkObj.CallStatic("setPasswordStrength",  (int)type);

        }
        
        public void SetPwdPattern(string pattern)
        {
            _rxSdkObj.CallStatic("setPwdPattern",  pattern);
        }

        public void SetArea(string area)
        {
            _rxSdkObj.CallStatic("setArea",  area);
        }
    }
}
#endif