using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;

#if UNITY_IOS
namespace RuiXue.LoginUI.Impl
{
    internal class RXLoginUIIOS : IRXLoginUI
    {
        private static OnLink _onLinkDelegate;
        private static HsAnnounceUI _hasAnnounceUIDelegate;

        [AOT.MonoPInvokeCallback(typeof(OnLink))]
        static void OnLinkCallbackBridge(string data)
        {
            if (_onLinkDelegate != null)
            {
                LogUtil.Log("_onLinkDelegate", "invoke");
                _onLinkDelegate.Invoke(data);
            }
        }

        [AOT.MonoPInvokeCallback(typeof(HsAnnounceUI))]
        static void HasAnnounceUICallbackBridge(bool has)
        {
            if (_hasAnnounceUIDelegate != null)
            {
                LogUtil.Log("_hasAnnounceUIDelegate", "invoke");
                _hasAnnounceUIDelegate.Invoke(has);
            }
        }

        public void ShowOAuthLoginUI(LoginUIConfig config, RequestResponseDelegate responseDelegate,
            RequestErrorDelegate errorDelegate)
        {
            LogUtil.WarningNotSupport("ShowOAuthLoginUI");
        }

        public void LoginUI(LoginUIConfig config, RequestResponseDelegate responseDelegate,
            RequestErrorDelegate errorDelegate)
        {
            string jsonConfig = RXJsonUtil.ToJson(config);
            RuiXueSdkDriver.RegisterIOSCallBack("ios_showLoginUIWithConfig", new IOSCallBackWrapper
            {
                onResponse = responseDelegate,
                onError = errorDelegate
            });

            ios_showLoginUIWithConfig(jsonConfig, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void CloseLoginUI()
        {
            ios_closeLoginView();
        }

        public void SyncAccounts(List<Dictionary<string, string>> accounts)
        {
            string json = RXJsonUtil.ToJson(accounts);
            ios_syncAccounts(json);
        }

        public void FindPasswordUI(FindPasswordUIConfig config, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_getBackPasswordWithComplete", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_getBackPasswordWithComplete(RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void DestroyAccountStatusView(bool isLoginContinue, RequestResponseDelegate responseDelegate,
            RequestErrorDelegate errorDelegate, RequestExtDelegates extDelegates)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_destroyAccountStatusViewWithDeregisterType", new IOSCallBackWrapper
            {
                onResponse = responseDelegate,
                onError = errorDelegate
            });
            ios_destroyAccountStatusViewWithDeregisterType(isLoginContinue, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void DestroyAccountStatusView(string okButtonText, RequestResponseDelegate responseDelegate,
            RequestErrorDelegate errorDelegate, RequestExtDelegates extDelegates)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_destroyAccountStatusUIWithBtnTitle", new IOSCallBackWrapper
            {
                onResponse = responseDelegate,
                onError = errorDelegate
            });
            ios_destroyAccountStatusUIWithBtnTitle(okButtonText, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void ProtocolView(string key, List<string> keyList)
        {
            ios_setProtocolViewWithKey(key, RXJsonUtil.ToJson(keyList));
        }

        public void RealAuthUI(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_setRealauthView", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_setRealauthView(RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void LimitUI(string titleStr, string contextStr, string buttonTxt,
            RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_setAntiAdditionViewWithTitle", new IOSCallBackWrapper
            {
                onResponse = responseDelegate,
                onError = errorDelegate
            });

            ios_setAntiAdditionViewWithTitle(titleStr, contextStr, buttonTxt, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void UserCenterUI(UserCenterUIConfig config, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            string json = RXJsonUtil.ToJson(config);
            RuiXueSdkDriver.RegisterIOSCallBack("ios_userCenterWithConfig", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_userCenterWithConfig(json, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void ApplyForDeregisterUI(UserCenterUIConfig config, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            string json = RXJsonUtil.ToJson(config);

            RuiXueSdkDriver.RegisterIOSCallBack("ios_applyForDeregisterWithConfig", new IOSCallBackWrapper
            {
                onResponse = onResponse,
            });

            ios_applyForDeregisterWithConfig(json, RuiXueSdkDriver.IOSCallBackOnResponse);
        }

        public void ShowMailCenter(string userId)
        {
            ios_showEmailViewWithCpUserId(userId);
        }

        public void ShowAnnounceView(int limit, OnLink onLink, HsAnnounceUI hsAnnounceUI)
        {
            _onLinkDelegate = onLink;
            _hasAnnounceUIDelegate = hsAnnounceUI;
            ios_showAnnounceViewWithLimit(limit, OnLinkCallbackBridge, HasAnnounceUICallbackBridge);
        }

        public void ShowUpdateAppView(string version, string region, Dictionary<string, object> queryMap, bool isShowUI,
            OnLink onLink,
            HsAnnounceUI hsAnnounceUI, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _onLinkDelegate = onLink;
            string typeStr = "";
            string formatStr = "";
            if (queryMap != null && queryMap.Count > 0)
            {
                if (queryMap.TryGetValue("type", out object typeObj) && typeObj is string type)
                {
                    typeStr = type;
                }
            
                if (queryMap.TryGetValue("format", out object formatObj) && formatObj is string format)
                {
                    formatStr = format;
                }
            }
            
            RuiXueSdkDriver.RegisterIOSCallBack("ios_checkUpdate_AppWithRegion_get", new IOSCallBackWrapper
            {
                onResponse = responseDelegate,
                onError = errorDelegate
            });
            ios_checkUpdate_AppWithRegion_get(region: region,client_version:version,type:typeStr,json:formatStr,isShow:isShowUI,linkCallback:OnLinkCallbackBridge,RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void ShowCheckUpdateAppView(string version, string region, string type,
            Dictionary<string, object> queryMap, bool isShowUI,
            OnLink onLink, HsAnnounceUI hsAnnounceUI, RequestResponseDelegate responseDelegate,
            RequestErrorDelegate errorDelegate)
        {
            _onLinkDelegate = onLink;

            string gamesMapJson = "";
            string activitiesMapJson = "";
            if (queryMap != null && queryMap.Count > 0)
            {
                Dictionary<string, string> gamesMap = null;
                if (queryMap.TryGetValue("games", out object gamesObj) && gamesObj is Dictionary<string, string> games)
                {
                    gamesMap = games;
                }
                if (gamesMap != null)
                {
                    gamesMapJson = RXJsonUtil.ToJson(gamesMap);
                }
            
                Dictionary<string, string> activitiesMap = null;
                if (queryMap.TryGetValue("activities", out object activitiesObj) && activitiesObj is Dictionary<string, string> activities)
                {
                    activitiesMap = activities;
                }
                if (activitiesMap != null)
                {
                    activitiesMapJson = RXJsonUtil.ToJson(activitiesMap);
                }

            }
            
            RuiXueSdkDriver.RegisterIOSCallBack("ios_checkUpdate_AppWithRegion_post", new IOSCallBackWrapper
            {
                onResponse = responseDelegate,
                onError = errorDelegate
            });
            ios_checkUpdate_AppWithRegion_post(region:region, client_version:version,games:gamesMapJson,activities:activitiesMapJson,type:type,json:"",isShow:isShowUI,OnLinkCallbackBridge,RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void bindPhone(RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_bindPhone", new IOSCallBackWrapper
            {
                onResponse = responseDelegate,
                onError = errorDelegate
            });
            ios_bindPhone(RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        [DllImport("__Internal")]
        private static extern void ios_showLoginUIWithConfig(string config,
            IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);

        [DllImport("__Internal")]
        private static extern void ios_closeLoginView();

        [DllImport("__Internal")]
        private static extern void ios_syncAccounts(string json);

        [DllImport("__Internal")]
        private static extern void ios_getBackPasswordWithComplete(IOSCallBackCommonDelegate onResponse,
            IOSCallBackCommonDelegate onError);

        [DllImport("__Internal")]
        private static extern void ios_destroyAccountStatusViewWithDeregisterType(bool isLoginContinue,
            IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);


        [DllImport("__Internal")]
        private static extern void ios_destroyAccountStatusUIWithBtnTitle(string btnTitle,
            IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);

        [DllImport("__Internal")]
        private static extern void ios_setProtocolViewWithKey(string key, string keyListJson);

        [DllImport("__Internal")]
        private static extern void ios_setRealauthView(IOSCallBackCommonDelegate onResponse,
            IOSCallBackCommonDelegate onError);

        [DllImport("__Internal")]
        private static extern void ios_setAntiAdditionViewWithTitle(string title, string des, string btnTitle,
            IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);

        [DllImport("__Internal")]
        private static extern void ios_userCenterWithConfig(string config, IOSCallBackCommonDelegate onResponse,
            IOSCallBackCommonDelegate onError);

        [DllImport("__Internal")]
        private static extern void
            ios_applyForDeregisterWithConfig(string config, IOSCallBackCommonDelegate onResponse);

        [DllImport("__Internal")]
        private static extern void ios_showEmailViewWithCpUserId(string cpUserId);

        [DllImport("__Internal")]
        private static extern void ios_showAnnounceViewWithLimit(int limit, OnLink linkCallback,
            HsAnnounceUI hasAnnounceCallback);

        [DllImport("__Internal")]
        private static extern void ios_checkUpdate_AppWithRegion_get(string region, string client_version, string type,
            string json, bool isShow, OnLink linkCallback, IOSCallBackCommonDelegate onResponse,
            IOSCallBackCommonDelegate onError);

        [DllImport("__Internal")]
        private static extern void ios_checkUpdate_AppWithRegion_post(string region, string client_version, string games,
            string activities, string type, string json, bool isShow, OnLink linkCallback,
            IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport("__Internal")]
        private static extern void ios_bindPhone(IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
    }
}
#endif