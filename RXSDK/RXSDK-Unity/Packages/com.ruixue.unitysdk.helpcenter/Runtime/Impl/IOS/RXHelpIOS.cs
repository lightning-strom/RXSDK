using System.Collections.Generic;
using System.Runtime.InteropServices;
#if UNITY_IOS

namespace RuiXue.Help.Impl
{
    internal class RXHelpIOS:IRXHelp
    {
        public void HelperCenterUI(Dictionary<string, object> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            string json = RXJsonUtil.ToJson(dic);
            #if RUIXUE_OVER_SEAS
              RuiXueSdkDriver.RegisterIOSCallBack("ios_serviceCenterWithConfig_OS", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError,
            });
            ios_serviceCenterWithConfig_OS(json, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
            #else
            RuiXueSdkDriver.RegisterIOSCallBack("ios_serviceCenterWithConfig", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError,
            });
            ios_serviceCenterWithConfig(json, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
            #endif

        }

        public void ChatServiceUI(Dictionary<string, object> dic, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            string json = RXJsonUtil.ToJson(dic);
            #if RUIXUE_OVER_SEAS
             RuiXueSdkDriver.RegisterIOSCallBack("ios_chatServiceWithConfig_OS", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError,
            });
            ios_chatServiceWithConfig_OS(json, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
            #else
            RuiXueSdkDriver.RegisterIOSCallBack("ios_chatServiceWithConfig", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError,
            });
            ios_chatServiceWithConfig(json, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
            #endif
        }

        public void CloseLoginUI()
        {
            LogUtil.WarningNotSupport("CloseLoginUI");
        }
        
        #if RUIXUE_OVER_SEAS
        // 帮助中心
        [DllImport("__Internal")]
        private static extern void ios_serviceCenterWithConfig_OS(string config,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);
        
        // 客服
        [DllImport("__Internal")]
        private static extern void ios_chatServiceWithConfig_OS(string config,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);
        #else
        
        // 帮助中心
        [DllImport("__Internal")]
        private static extern void ios_serviceCenterWithConfig(string config,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);
        
        // 客服
        [DllImport("__Internal")]
        private static extern void ios_chatServiceWithConfig(string config,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);
        #endif
    }
}
#endif