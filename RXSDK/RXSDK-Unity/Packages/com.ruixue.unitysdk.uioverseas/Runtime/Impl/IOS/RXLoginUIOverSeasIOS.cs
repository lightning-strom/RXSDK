using System.Collections.Generic;
using System.Runtime.InteropServices;
#if UNITY_IOS
namespace RuiXue.LoginUIOverSeas.Impl
{
    internal class RXLoginUIOverSeasIOS : IRXLoginUIOverSeas
    {
        private static IOS_AntiAdditionDelegate _antiAdditionDelegate;
        private static OnLink _onLinkDelegate;
        private static HsAnnounceUI _hasAnnounceUIDelegate;
        
        [AOT.MonoPInvokeCallback(typeof(IOS_AntiAdditionDelegate))]
        static void AntiAdditionCallbackBridge()
        {
            if (_antiAdditionDelegate != null)
                _antiAdditionDelegate.Invoke();
        }
        
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

        public void LoginUI(LoginUIConfig config, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            
            string jsonConfig = RXJsonUtil.ToJson(config);
            RuiXueSdkDriver.RegisterIOSCallBack("ios_setLoginViewWithConfig_OS", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_showLoginUIWithConfig_OS(jsonConfig, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }



        public void CloseLoginUI()
        {
            ios_closeLoginView_OS();
        }

        public void SyncAccounts(List<Dictionary<string, string>> accounts)
        {
            string json = RXJsonUtil.ToJson(accounts);
            ios_syncAccounts_OS(json);
        }


        public void FindPasswordUI(FindPasswordUIConfig config, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_getBackPasswordWithComplete_OS", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_getBackPasswordWithComplete_OS(RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void DestroyAccountStatusView(bool isLoginContinue, RequestResponseDelegate responseDelegate,
            RequestErrorDelegate errorDelegate, RequestExtDelegates extDelegates)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_destroyAccountStatusViewWithDeregisterType_OS", new IOSCallBackWrapper
            {
                onResponse = responseDelegate,
                onError = errorDelegate
            });
            ios_destroyAccountStatusViewWithDeregisterType_OS(isLoginContinue, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void DestroyAccountStatusView(string okButtonText, RequestResponseDelegate responseDelegate,
            RequestErrorDelegate errorDelegate, RequestExtDelegates extDelegates)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_destroyAccountStatusUIWithBtnTitle_OS", new IOSCallBackWrapper
            {
                onResponse = responseDelegate,
                onError = errorDelegate
            });
            ios_destroyAccountStatusUIWithBtnTitle_OS(okButtonText, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void ProtocolView(string key, List<string> keyList)
        {
            ios_setProtocolViewWithKey_OS(key, RXJsonUtil.ToJson(keyList));
        }

        public void RealAuthUI(bool cancelAble, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_setRealauthViewWithCanClose_OS", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_setRealauthViewWithCanClose_OS(cancelAble, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void LimitUI(string titleStr, string contextStr, string buttonTxt,
            RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_setAntiAdditionViewWithTitle_OS", new IOSCallBackWrapper
            {
                onResponse = responseDelegate,
                onError = errorDelegate
            });
            
            ios_setAntiAdditionViewWithTitle_OS(titleStr, contextStr, buttonTxt, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void UserCenterUI(UserCenterUIConfig config, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            string json = RXJsonUtil.ToJson(config);
            RuiXueSdkDriver.RegisterIOSCallBack("ios_userCenterWithConfig_OS", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            ios_userCenterWithConfig_OS(json, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void ApplyForDeregisterUI(UserCenterUIConfig config, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            string json = RXJsonUtil.ToJson(config);
            RuiXueSdkDriver.RegisterIOSCallBack("ios_applyForDeregisterWithConfig_OS", new IOSCallBackWrapper
            {
                onResponse = onResponse,
            });
            ios_applyForDeregisterWithConfig_OS(json, RuiXueSdkDriver.IOSCallBackOnResponse);
        }
        
        public void ShowMailCenter(string userId)
        {
            ios_showEmailViewWithCpUserId_OS(userId);
        }

        public void ShowAnnounceView(int limit, OnLink onLink, HsAnnounceUI hsAnnounceUI)
        {
            _onLinkDelegate = onLink;
            _hasAnnounceUIDelegate = hsAnnounceUI;
            ios_showAnnounceViewWithLimit_OS(limit, OnLinkCallbackBridge, HasAnnounceUICallbackBridge);
        }

        public void ShowUpdateAppView(string version, string region, Dictionary<string, object> queryMap,
            bool isShowUI, OnLink onLink, HsAnnounceUI hsAnnounceUI,
            RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
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
            ios_checkUpdate_AppWithRegion_get_OS(region: region,client_version:version,type:typeStr,json:formatStr,isShow:isShowUI,linkCallback:OnLinkCallbackBridge,RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void ShowCheckUpdateAppView(string version, string region, string type,
            Dictionary<string, object> queryMap, bool isShowUI, OnLink onLink, HsAnnounceUI hsAnnounceUI,
            RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
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
            ios_checkUpdate_AppWithRegion_post_OS(region:region, client_version:version,games:gamesMapJson,activities:activitiesMapJson,type:type,json:"",isShow:isShowUI,OnLinkCallbackBridge,RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void bindPhone(RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_bindPhone_OS", new IOSCallBackWrapper
            {
                onResponse = responseDelegate,
                onError = errorDelegate
            });
            ios_bindPhone_OS(RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }
        
        public void bindEmail(RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_bindEmail_OS", new IOSCallBackWrapper
            {
                onResponse = responseDelegate,
                onError = errorDelegate
            });
            ios_bindEmail_OS(RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        [DllImport("__Internal")]
        private static extern void ios_showLoginUIWithConfig_OS(string config,
            IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);

        [DllImport("__Internal")]
        private static extern void ios_closeLoginView_OS();

        [DllImport("__Internal")]
        private static extern void ios_syncAccounts_OS(string json);

        [DllImport("__Internal")]
        private static extern void ios_getBackPasswordWithComplete_OS(IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport("__Internal")]
        private static extern void ios_destroyAccountStatusViewWithDeregisterType_OS(bool isLoginContinue, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);

         
        [DllImport("__Internal")]
        private static extern void ios_destroyAccountStatusUIWithBtnTitle_OS(string btnTitle, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport("__Internal")]
        private static extern void ios_setProtocolViewWithKey_OS(string key, string keyListJson);
        
        [DllImport("__Internal")]
        private static extern void ios_setRealauthViewWithCanClose_OS(bool canClose, IOSCallBackCommonDelegate onResponse,
            IOSCallBackCommonDelegate onError);
        
        [DllImport("__Internal")]
        private static extern void ios_setAntiAdditionViewWithTitle_OS(string title, string des, string btnTitle, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);

        [DllImport("__Internal")]
        private static extern void ios_userCenterWithConfig_OS(string config, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport("__Internal")]
        private static extern void ios_applyForDeregisterWithConfig_OS(string config, IOSCallBackCommonDelegate onResponse);
        
        [DllImport("__Internal")]
        private static extern void ios_showEmailViewWithCpUserId_OS(string cpUserId);
        
        [DllImport("__Internal")]
        private static extern void ios_showAnnounceViewWithLimit_OS(int limit, OnLink linkCallback,
            HsAnnounceUI hasAnnounceCallback);

        [DllImport("__Internal")]
        private static extern void ios_checkUpdate_AppWithRegion_get_OS(string region, string client_version, string type,
            string json, bool isShow, OnLink linkCallback, IOSCallBackCommonDelegate onResponse,
            IOSCallBackCommonDelegate onError);

        [DllImport("__Internal")]
        private static extern void ios_checkUpdate_AppWithRegion_post_OS(string region, string client_version, string games,
            string activities, string type, string json, bool isShow, OnLink linkCallback,
            IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport("__Internal")]
        private static extern void ios_bindPhone_OS(IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport("__Internal")]
        private static extern void ios_bindEmail_OS(IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
    }
}
#endif