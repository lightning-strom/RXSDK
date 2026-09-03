using System;
using System.Runtime.InteropServices;
using UnityEngine;

#if UNITY_IOS
namespace RuiXue.Adjust.Impl
{
    public class RXAdjustIOS:IRXAdjust
    {
        private static OnAttributionChangedDelegate _onAttributionChanged;
        private static OnFinishedEventTrackingSucceededDelegate _onFinishedEventTrackingSucceeded;
        private static OnFinishedEventTrackingFailedDelegate _onFinishedEventTrackingFailed;
        private static OnFinishedSessionTrackingSucceededDelegate _onFinishedSessionTrackingSucceeded;
        private static OnFinishedSessionTrackingFailedDelegate _onFinishedSessionTrackingFailed;
        
        public void Init(RxAdjustConfig rxAdjustConfig)
        {
            string json = RXJsonUtil.ToJson(rxAdjustConfig);
            ios_adjust_init(json);

            _onAttributionChanged = rxAdjustConfig.OnRxAttributionChangedDelegateListener;
            _onFinishedEventTrackingSucceeded = rxAdjustConfig.OnRxEventTrackingSucceededDelegateListener;
            _onFinishedEventTrackingFailed = rxAdjustConfig.OnRxEventTrackingFailedDelegateListener;
            _onFinishedSessionTrackingSucceeded = rxAdjustConfig.OnRxSessionTrackingSucceededDelegateListener;
            _onFinishedSessionTrackingFailed = rxAdjustConfig.OnRxSessionTrackingFailedDelegateListener;
            
            ios_adjust_setDelegate(OnAttributionChanged, 
                OnFinishedEventTrackingSucceeded, 
                OnFinishedEventTrackingFailed, 
                OnFinishedSessionTrackingSucceeded, 
                OnFinishedSessionTrackingFailed);
        }

        public void OnResume()
        {
            LogUtil.WarningNotSupport("OnResume");
        }

        public void OnPause()
        {
            LogUtil.WarningNotSupport("OnPause");
        }

        public void TrackEvent(RxAdjustEvent rxAdjustEvent)
        {
            string json = RXJsonUtil.ToJson(rxAdjustEvent);
            ios_adjust_trackEvent(json);
        }

        public string GetData()
        {
            LogUtil.WarningNotSupport("GetData");
            return "";
        }

        public void AppWillOpenUrl(string data)
        {
           LogUtil.WarningNotSupport("AppWillOpenUrl");
        }

        public void ResolveLink(string url, string[] arr)
        {
             LogUtil.WarningNotSupport("ResolveLink");
        }

        public void AddSessionCallbackParameter(string key, string val)
        {
           ios_adjust_addSessionCallbackParameter(key, val);
        }

        public void RemoveSessionCallbackParameter(string key)
        {
            ios_adjust_removeSessionCallbackParameter(key);
        }

        public void ResetSessionCallbackParameters()
        {
           ios_adjust_resetSessionCallbackParameters();
        }

        public void AddSessionPartnerParameter(string key, string val)
        {
            ios_adjust_addSessionPartnerParameter(key, val);
        }

        public void RemoveSessionPartnerParameter(string key)
        {
            ios_adjust_removeSessionPartnerParameter(key);
        }

        public void ResetSessionPartnerParameters()
        {
           ios_adjust_resetSessionPartnerParameters();
        }

        public void SendFirstPackages()
        {
            LogUtil.WarningNotSupport("SendFirstPackages");
        }

        public RxAdjustAttribution GetAttribution()
        {
            string json = ios_adjust_getAttribution();
            RxAdjustAttribution attribution = RXJsonUtil.FromJson<RxAdjustAttribution>(json);
            if (attribution == null)
            {
                Debug.LogError("GetAttribution 解析出错: " + json);
            }
            return attribution;
        }

        [AOT.MonoPInvokeCallback(typeof(Action<string>))]
        public static void OnAttributionChanged(string data)
        {
            if (_onAttributionChanged != null)
            {
                RxAdjustAttribution attribution = RXJsonUtil.FromJson<RxAdjustAttribution>(data);
                if (attribution!=null)
                {
                    _onAttributionChanged(attribution);
                }
            }
        }
        
        [AOT.MonoPInvokeCallback(typeof(Action<string>))]
        public static void OnFinishedEventTrackingSucceeded(string data)
        {
            if (_onFinishedEventTrackingSucceeded != null)
            {
                RxAdjustEventSuccess eventSuccessResponseData = RXJsonUtil.FromJson<RxAdjustEventSuccess>(data);
                if (eventSuccessResponseData != null)
                {
                    _onFinishedEventTrackingSucceeded(eventSuccessResponseData);
                }
            }
        }
        
        [AOT.MonoPInvokeCallback(typeof(Action<string>))]
        public static void OnFinishedEventTrackingFailed(string data)
        {
            if (_onFinishedEventTrackingFailed != null)
            {
                RxAdjustEventFailure rxAdjustEventFailure = RXJsonUtil.FromJson<RxAdjustEventFailure>(data);
                if (rxAdjustEventFailure != null)
                {
                    _onFinishedEventTrackingFailed(rxAdjustEventFailure);
                }
            }
        }
        
        [AOT.MonoPInvokeCallback(typeof(Action<string>))]
        public static void OnFinishedSessionTrackingSucceeded(string data)
        {
            if (_onFinishedSessionTrackingSucceeded != null)
            {
                RxAdjustSessionSuccess rxAdjustSessionSuccess = RXJsonUtil.FromJson<RxAdjustSessionSuccess>(data);
                if (rxAdjustSessionSuccess != null)
                {
                    _onFinishedSessionTrackingSucceeded(rxAdjustSessionSuccess);
                }
            }
        }
        
        [AOT.MonoPInvokeCallback(typeof(Action<string>))]
        public static void OnFinishedSessionTrackingFailed(string data)
        {
            if (_onFinishedSessionTrackingFailed != null)
            {
                RxAdjustSessionFailure rxAdjustSessionFailure = RXJsonUtil.FromJson<RxAdjustSessionFailure>(data);
                if (rxAdjustSessionFailure != null)
                {
                    _onFinishedSessionTrackingFailed(rxAdjustSessionFailure);
                }
            }
        }
        
        // 初始化
        [DllImport("__Internal")]
        public static extern void ios_adjust_init(string config);
        
        // 设置delegate
        [DllImport("__Internal")]
        public static extern void ios_adjust_setDelegate(Action<string> onAttributionChanged, 
            Action<string> onFinishedEventTrackingSucceeded, 
            Action<string> onFinishedEventTrackingFailed, 
            Action<string> onFinishedSessionTrackingSucceeded, 
            Action<string> onFinishedSessionTrackingFailed);

// 记录事件
        [DllImport("__Internal")]
        public static extern void ios_adjust_trackEvent(string eventJson);

// 添加默认伙伴参数
        [DllImport("__Internal")]
        public static extern void ios_adjust_addSessionPartnerParameter(string key, string value);

// 删除默认伙伴参数
        [DllImport("__Internal")]
        public static extern void ios_adjust_removeSessionPartnerParameter(string key);

// 删除所有伙伴参数
        [DllImport("__Internal")]
        public static extern void ios_adjust_resetSessionPartnerParameters();

// 添加会话回调参数
        [DllImport("__Internal")]
        public static extern void ios_adjust_addSessionCallbackParameter(string key, string value);

// 从会话包中删除默认回调参数
        [DllImport("__Internal")]
        public static extern void ios_adjust_removeSessionCallbackParameter(string key);

// 删除所有回调参数
        [DllImport("__Internal")]
        public static extern void ios_adjust_resetSessionCallbackParameters();

// 获取用户归因
        [DllImport("__Internal")]
        public static extern string ios_adjust_getAttribution();
    }
}
#endif