#if UNITY_ANDROID
using System;
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.Adjust.Impl
{
    public class RXAdjustAndroid : IRXAdjust
    {
        
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _contextObj;
        public static AndroidJavaObject _adjustSdkObj;
        public static AndroidJavaObject _adjustSdkInstance;
        private static AndroidJavaClass _jSONUtil;
        private static AndroidJavaObject _uriObj;
        private AndroidJavaObject _gsonUtil;


        public RXAdjustAndroid()
        {
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            _adjustSdkObj = new AndroidJavaClass("com.ruixue.sdk.adjust.AdjustSdkWrapper");
            _adjustSdkInstance = _adjustSdkObj.CallStatic<AndroidJavaObject>("getInstance");
            _jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
            _uriObj = new AndroidJavaClass("android.net.Uri");
            _gsonUtil = new AndroidJavaObject("com.google.gson.GsonBuilder")
                .Call<AndroidJavaObject>("serializeSpecialFloatingPointValues")
                .Call<AndroidJavaObject>("create");
        }


        public void Init(RxAdjustConfig rxAdjustConfig)
        {
            _adjustSdkInstance.Call("init", _contextObj, convertConfig(rxAdjustConfig));
        }
        
        public void OnResume()
        {
            _adjustSdkInstance.Call("onResume", _contextObj);
        }

        public void OnPause()
        {
            _adjustSdkInstance.Call("onPause", _contextObj);
        }

        public void TrackEvent(RxAdjustEvent rxAdjustEvent)
        {
            AndroidJavaObject adjustEvent = new AndroidJavaObject("com.ruixue.sdk.adjust.config.RxAdjustEvent", 
                rxAdjustEvent.eventToken);

            if (rxAdjustEvent.revenue != -1)
            {
                AndroidJavaObject revenueDouble = new AndroidJavaObject("java.lang.Double");
                AndroidJavaObject revenueObj = revenueDouble.CallStatic<AndroidJavaObject>("valueOf", rxAdjustEvent.revenue);
                adjustEvent.Set("revenue", revenueObj);
            }

            if (!String.IsNullOrEmpty(rxAdjustEvent.currency))
            {
                adjustEvent.Set("currency", rxAdjustEvent.currency);
            }

            if (rxAdjustEvent.callbackParameters != null)
            {
                string jsonStr = JsonMapper.ToJson(rxAdjustEvent.callbackParameters);
                AndroidJavaObject extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
                adjustEvent.Set("callbackParameters", extMap);
            }

            if (rxAdjustEvent.partnerParameters != null)
            {
                string jsonStr = JsonMapper.ToJson(rxAdjustEvent.partnerParameters);
                AndroidJavaObject extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
                adjustEvent.Set("partnerParameters", extMap);
            }
            
            if (!String.IsNullOrEmpty(rxAdjustEvent.orderId))
            {
                adjustEvent.Set("orderId", rxAdjustEvent.orderId);
            }
            
            if (!String.IsNullOrEmpty(rxAdjustEvent.callbackId))
            {
                adjustEvent.Set("callbackId", rxAdjustEvent.callbackId);
            }

            _adjustSdkInstance.Call("trackEvent", adjustEvent);
        }

        public string GetData()
        {
            AndroidJavaObject intent = _contextObj.Call<AndroidJavaObject>("getIntent");
            if (intent != null)
            {
                AndroidJavaObject uriObj = _adjustSdkInstance.Call<AndroidJavaObject>("getData", intent);
                if (uriObj != null)
                {
                    return uriObj.Call<string>("toString");
                }
                return "";
            }
            return "";
        }

        public void AppWillOpenUrl(string data)
        {
            AndroidJavaObject uriObj = _uriObj.CallStatic<AndroidJavaObject>("parse", data);
            _adjustSdkInstance.Call("appWillOpenUrl", uriObj, _contextObj);
        }

        public void ResolveLink(string url, string[] arr)
        {
            AndroidJavaObject list = JavaArrayListExtensionMethod.CreateJavaArrayList();
            AndroidJavaObject[] javaArr = null;
            if (arr != null)
            {
                foreach (var item in arr)
                {
                    list.Add(item);
                }
                javaArr = list.Call<AndroidJavaObject[]>("toArray");
            }
            _adjustSdkInstance.Call("resolveLink", url, javaArr, _contextObj);
        }

        public void AddSessionCallbackParameter(string key, string val)
        {
            _adjustSdkInstance.Call("addSessionCallbackParameter", key, val);
        }

        public void RemoveSessionCallbackParameter(string key)
        {
            _adjustSdkInstance.Call("removeSessionCallbackParameter", key);
        }

        public void ResetSessionCallbackParameters()
        {
            _adjustSdkInstance.Call("resetSessionCallbackParameters");
        }

        public void AddSessionPartnerParameter(string key, string val)
        {
            _adjustSdkInstance.Call("addSessionPartnerParameter", key,val);
        }

        public void RemoveSessionPartnerParameter(string key)
        {
            _adjustSdkInstance.Call("removeSessionPartnerParameter", key);
        }

        public void ResetSessionPartnerParameters()
        {
            _adjustSdkInstance.Call("resetSessionPartnerParameters");
        }

        public void SendFirstPackages()
        {
            _adjustSdkInstance.Call("sendFirstPackages");
        }

        public RxAdjustAttribution GetAttribution()
        {
            AndroidJavaObject attributionObj = _adjustSdkInstance.Call<AndroidJavaObject>("getAttribution");
            if (attributionObj != null)
            {
                string jsonStr = _gsonUtil.Call<string>("toJson", attributionObj);
                // todo 有隐患，LitJosn 如何处理 NAN
                string repstr = jsonStr.Replace("NaN", "-1");
                
                LogUtil.Log("EventManager", $"GetAttribution {repstr}");
                
                return JsonMapper.ToObject<RxAdjustAttribution>(repstr);
            }

            return null;
        }

        public AndroidJavaObject convertConfig(RxAdjustConfig rxAdjustConfig)
        {
            AndroidJavaObject configObject = new AndroidJavaObject("com.ruixue.sdk.adjust.config.RxAdjustConfig", 
                _contextObj, rxAdjustConfig.appToken, rxAdjustConfig.environment);

            
            if (rxAdjustConfig != null)
            {
                AndroidJavaClass typeClass = new AndroidJavaClass("com.ruixue.sdk.adjust.config.RxLogLevel");
                AndroidJavaObject level = null;
                if (rxAdjustConfig.rxLogLevel == RxLogLevel.VERBOSE)
                {
                    level = typeClass.GetStatic<AndroidJavaObject>("VERBOSE");
                }else if (rxAdjustConfig.rxLogLevel == RxLogLevel.DEBUG)
                {
                    level = typeClass.GetStatic<AndroidJavaObject>("DEBUG");
                }else if (rxAdjustConfig.rxLogLevel == RxLogLevel.INFO)
                {
                    level = typeClass.GetStatic<AndroidJavaObject>("INFO");
                }else if (rxAdjustConfig.rxLogLevel == RxLogLevel.WARN)
                {
                    level = typeClass.GetStatic<AndroidJavaObject>("WARN");
                }else if (rxAdjustConfig.rxLogLevel == RxLogLevel.ERROR)
                {
                    level = typeClass.GetStatic<AndroidJavaObject>("ERROR");
                }else if (rxAdjustConfig.rxLogLevel == RxLogLevel.ASSERT)
                {
                    level = typeClass.GetStatic<AndroidJavaObject>("ASSERT");
                }else if (rxAdjustConfig.rxLogLevel == RxLogLevel.SUPRESS)
                {
                    level = typeClass.GetStatic<AndroidJavaObject>("SUPRESS");
                }

                configObject.Call("setLogLevel", level);
            }
            
            configObject.Call("setEventBufferingEnabled", rxAdjustConfig.eventBufferingEnabled);
            configObject.Call("setSendInBackground", rxAdjustConfig.sendInBackground);
            configObject.Call("setDelayStart", rxAdjustConfig.delayStart);
            configObject.Call("setExternalDeviceId", rxAdjustConfig.externalDeviceId);
            configObject.Call("setPreinstallTrackingEnabled", rxAdjustConfig.preinstallTrackingEnabled);
            configObject.Call("setNeedsCost", rxAdjustConfig.needsCost);
            configObject.Call("setUrlStrategy", rxAdjustConfig.urlStrategy);
            
            configObject.Call("setOnRxAttributionChangedListener", 
                new OnRxAttributionChangedJavaProxy(rxAdjustConfig.OnRxAttributionChangedDelegateListener));
            
            configObject.Call("setOnRxEventTrackingSucceededListener", 
                new OnFinishedEventTrackingSucceededJavaProxy(rxAdjustConfig.OnRxEventTrackingSucceededDelegateListener));
            
            configObject.Call("setOnRxEventTrackingFailedListener", 
                new OnFinishedEventTrackingFailedJavaProxy(rxAdjustConfig.OnRxEventTrackingFailedDelegateListener));
            
            configObject.Call("setOnRxSessionTrackingSucceededListener", 
                new OnFinishedSessionTrackingSucceededProxy(rxAdjustConfig.OnRxSessionTrackingSucceededDelegateListener));
            
            configObject.Call("setOnRxSessionTrackingFailedListener", 
                new OnFinishedSessionTrackingFailedJavaProxy(rxAdjustConfig.OnRxSessionTrackingFailedDelegateListener));
            
            configObject.Call("setOnRxDeeplinkResponseListener", 
                new LaunchReceivedDeeplinkJavaProxy(rxAdjustConfig.OnRxDeeplinkDelegateResponseListener));
            
            return configObject;
        }



    }
}

#endif