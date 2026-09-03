#if UNITY_ANDROID
using System.Collections.Generic;
using RuiXue.Impl;
using RuiXueLitJson;
using UnityEngine;
namespace RuiXue.LoginUI.Impl
{
    internal class RXLoginUIAndroid : IRXLoginUI
    {
        private static AndroidJavaClass _unityPlayerObj;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaObject _rxSdkObj;
        private static AndroidJavaObject _rxSdkUiObj;
        private static AndroidJavaObject _sInstanceObj;
        // private static AndroidJavaObject _overseasSdkUIObj;
        // private static AndroidJavaObject _sInstanceOverSeas;
        private static AndroidJavaObject _iView;
        private static AndroidJavaClass _jSONUtil;

        public RXLoginUIAndroid()
        {
            _unityPlayerObj = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _contextObj = _unityPlayerObj.GetStatic<AndroidJavaObject>("currentActivity");
            _rxSdkUiObj = new AndroidJavaObject("com.ruixue.openapi.RXSdkUI");
            _sInstanceObj = _rxSdkUiObj.CallStatic<AndroidJavaObject>("getInstance");
            _rxSdkObj = new AndroidJavaClass("com.ruixue.RuiXueSdk");
            // _overseasSdkUIObj = new("com.ruixue.sdk.OverseasSdkUI");
            // _sInstanceOverSeas = _overseasSdkUIObj.CallStatic<AndroidJavaObject>("getInstance");
            _jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
        }

        public void ShowOAuthLoginUI(LoginUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _sInstanceObj.Call("unityShowOAuthLoginUI", _contextObj, GetJavaLoginUIConfig(config), 
                new JsonCallbackJavaProxy(responseDelegate, errorDelegate));
        }

        public void LoginUI(LoginUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _sInstanceObj.Call("unityShowLoginUI", _contextObj, 
                GetJavaLoginUIConfig(config), new JsonCallbackJavaProxy(responseDelegate, errorDelegate));
            // _iView.Call("unityShow", _contextObj);
        }

        public void CloseLoginUI()
        {
            _iView.Call("unityDismiss", _contextObj);
        }
        
        public void SyncAccounts(List<Dictionary<string, string>> accounts)
        {
            AndroidJavaObject ListObj = JavaArrayListExtensionMethod.CreateJavaArrayList();
            foreach (var item in accounts)
            {
                AndroidJavaObject hashMap = JavaHashMapExtensionMethod.CreateJavaHashMap();
                foreach (var kvp in item)
                {
                    hashMap.Put(kvp.Key, kvp.Value);
                }
                ListObj.Add(hashMap);
            }
            
            
            _rxSdkObj.CallStatic("syncAccounts", ListObj);
        }

        public void FindPasswordUI(FindPasswordUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            AndroidJavaObject hashMap = JavaHashMapExtensionMethod.CreateJavaHashMap();
            hashMap.Put("username", config.username);
            hashMap.Put("password_hint", config.password_hint);
            hashMap.Put("account_type", config.account_type);
            _iView = _sInstanceObj.Call<AndroidJavaObject>("unityFindPassWordUI", _contextObj, hashMap, new JsonCallbackJavaProxy(responseDelegate, errorDelegate));
            _iView.Call("unityShow", _contextObj);
        }

        public void DestroyAccountStatusView(bool isLoginContinue, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate, RequestExtDelegates extDelegates)
        {
            _iView = _sInstanceObj.Call<AndroidJavaObject>("unityDestroyAccountStatusView", _contextObj, isLoginContinue, new JsonCallbackJavaProxy(responseDelegate, errorDelegate));
            _iView.Call("unityShow", _contextObj);
        }

        public void DestroyAccountStatusView(string okButtonText, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate, RequestExtDelegates extDelegates)
        {
            _iView = _sInstanceObj.Call<AndroidJavaObject>("unityDestroyAccountStatusView", _contextObj, okButtonText, new JsonCallbackJavaProxy(responseDelegate, errorDelegate));
            _iView.Call("unityShow", _contextObj);
        }

        public void ProtocolView(string key, List<string> keyList)
        {
            AndroidJavaObject ListObj = JavaArrayListExtensionMethod.CreateJavaArrayList();
            foreach (var item in keyList)
            {
                ListObj.Add(item);
            }
            _iView = _sInstanceObj.Call<AndroidJavaObject>("unityProtocolView", _contextObj, key, ListObj);
            _iView.Call("unityShow", _contextObj);
        }

        public void RealAuthUI(RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _iView = _sInstanceObj.Call<AndroidJavaObject>("unityRealAuthUI", _contextObj, false, new JsonCallbackJavaProxy(responseDelegate, errorDelegate));
            _iView.Call("unityShow", _contextObj);
        }

        public void LimitUI(string titleStr, string contextStr, string buttonTxt, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _iView = _sInstanceObj.Call<AndroidJavaObject>("unityLimitUI", _contextObj, titleStr, contextStr, buttonTxt, new JsonCallbackJavaProxy(responseDelegate, errorDelegate));
            _iView.Call("unityShow", _contextObj);
        }

        public void UserCenterUI(UserCenterUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            AndroidJavaObject hashMap = JavaHashMapExtensionMethod.CreateJavaHashMap();
            hashMap.Put("transmit_args", config.transmit_args);
            hashMap.Put("game_user_id", config.game_user_id);
            hashMap.Put("nickname", config.nickname);
            hashMap.Put("head_img_url", config.head_img_url);
            hashMap.Put("queue_name", config.queue_name);
            _iView = _sInstanceObj.Call<AndroidJavaObject>("unityUserCenterUI", _contextObj, hashMap, new JsonCallbackJavaProxy(responseDelegate, errorDelegate));

            AndroidJavaObject mapObj = new AndroidJavaObject("java.util.HashMap");
            foreach (var item in config.setConfigParams)
            {
                AndroidJavaObject ListObj = new AndroidJavaObject("java.util.ArrayList");
                foreach (var arrItem in item.Value)
                {
                    ListObj.Call<bool>("add", arrItem);
                }
                mapObj.Call<AndroidJavaObject[]>("put", item.Key, ListObj.Call<AndroidJavaObject[]>("toArray"));
            }
            _iView.Call("setConfigParams", mapObj);
            if (config.webViewOnCloseDeletage != null)
            {
                _iView.Call<AndroidJavaObject>("setWebViewCloseListener", new OnRxWebViewOnCloseListener(config.webViewOnCloseDeletage));
            }
            _iView.Call("unityShow", _contextObj);

        }

        public void ApplyForDeregisterUI(UserCenterUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            AndroidJavaObject hashMap = JavaHashMapExtensionMethod.CreateJavaHashMap();
            hashMap.Put("transmit_args", config.transmit_args);
            hashMap.Put("game_user_id", config.game_user_id);
            hashMap.Put("nickname", config.nickname);
            hashMap.Put("head_img_url", config.head_img_url);
            hashMap.Put("queue_name", config.queue_name); //客服使用，参照客服api 参数
            _iView = _sInstanceObj.Call<AndroidJavaObject>("unityApplyForDeregisterUI", _contextObj, hashMap, new JsonCallbackJavaProxy(responseDelegate, errorDelegate));
            _iView.Call("unityShow", _contextObj);
        }

        public void ShowMailCenter(string userId)
        {
            _iView = _sInstanceObj.Call<AndroidJavaObject>("unityShowMailCenter", _contextObj, userId);
            _iView.Call("unityShow", _contextObj);
        }

        public void ShowAnnounceView(int limit, OnLink onLink, HsAnnounceUI hsAnnounceUI)
        {
            _sInstanceObj.Call("unityShowAnnounceView", _contextObj, limit, 
                new NoticeCallbackJavaProxy(onLink, hsAnnounceUI));
        }

        public void ShowUpdateAppView(string version, string region, Dictionary<string, object> queryMap, bool isShowUI, OnLink onLink,
            HsAnnounceUI hsAnnounceUI, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            string jsonStr = JsonMapper.ToJson(queryMap);
            AndroidJavaObject hashMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            _sInstanceObj.Call("UnityShowUpdateAppView", _contextObj, version, region, 
                hashMap, isShowUI, new MaintainNoticeCallbackJavaProxy(onLink, hsAnnounceUI, responseDelegate, errorDelegate));
        }

        public void ShowCheckUpdateAppView(string version, string region, string type, Dictionary<string, object> queryMap, bool isShowUI,
            OnLink onLink, HsAnnounceUI hsAnnounceUI, RequestResponseDelegate responseDelegate,
            RequestErrorDelegate errorDelegate)
        {
            AndroidJavaObject hashMap = null;
            if (queryMap != null)
            {
                string jsonStr = JsonMapper.ToJson(queryMap);
                hashMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            }

            _sInstanceObj.Call("unityShowCheckUpdateAppView", _contextObj, version, region, 
                type, hashMap, isShowUI, new MaintainNoticeCallbackJavaProxy(onLink, hsAnnounceUI, responseDelegate, errorDelegate));
        }

        private static AndroidJavaObject GetJavaLoginUIConfig(LoginUIConfig config) 
        {
            if (config == null)
            {
                return null;
            }
            AndroidJavaObject LoginUIConfigObj = new("com.ruixue.openapi.RXLoginUIModel");
            LoginUIConfigObj.Call("setDeregisterShow", config.isShowDeregister);
            LoginUIConfigObj.Call("setLoginContinue", config.isLoginContinue);
            LoginUIConfigObj.Call("setFirstNeedSetPassword", config.needSetPassword);
            LoginUIConfigObj.Call("setTitleByteArr", config.logoImage);
            LoginUIConfigObj.Call("isShowClose", config.isShowClose);

            if (config.loginTypes != null && config.loginTypes.Count > 0)
            {
                AndroidJavaObject list = JavaArrayListExtensionMethod.CreateJavaArrayList();
                foreach (var item in config.loginTypes)
                {
                    list.Add(item);
                }
                LoginUIConfigObj.Call("setLoginMethods", list);
            }
            
            if (config.customParams != null && config.customParams.Count > 0)
            {
                string jsonStr = JsonMapper.ToJson(config.customParams);
                AndroidJavaObject extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
                LoginUIConfigObj.Call("setCustomParams", extMap);
            }

            LoginUIConfigObj.Call("setQuickButtonBarVisible", config.isQuickButtonBarVisible);
            LoginUIConfigObj.Call("keyboardType", config.keyboardType);
            
            LoginUIConfigObj.Call("setForgotUrl", config.forgotUrl);
            LoginUIConfigObj.Call("loginViewType", config.loginViewType);

            if (config.privacieTitles != null && config.privacies != null 
                                              && config.privacieTitles.Count == config.privacies.Count)
            {
                AndroidJavaObject androidJavaObject = new AndroidJavaObject("java.util.LinkedHashMap");
                for (int i = 0; i < config.privacieTitles.Count; i++)
                {
                    androidJavaObject.Call<AndroidJavaObject>("put", 
                        config.privacies[i], config.privacieTitles[i]);
                }
                LoginUIConfigObj.Call("setPrivacies", androidJavaObject);
            }

            return LoginUIConfigObj;
        }

        public void bindPhone(RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _iView = _sInstanceObj.Call<AndroidJavaObject>("unityBindPhoneUI", 
                _contextObj, new JsonCallbackJavaProxy(responseDelegate, errorDelegate));
            _iView.Call("unityShow", _contextObj);
        }
    }
}
#endif