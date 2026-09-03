#if UNITY_ANDROID
using System.Collections.Generic;
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.Share.Impl
{
    internal class RuiXueShareAndroid : IRXShare
    {
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _rxSdkObj;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaObject _rxApiObj;
        private static AndroidJavaClass _jSONUtil;

        public RuiXueShareAndroid()
        {
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _rxSdkObj = new AndroidJavaClass("com.ruixue.RuiXueSdk");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            _rxApiObj = _rxSdkObj.CallStatic<AndroidJavaObject>("getRXSdkApi");
            _jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
        }

        public void ShareSchedulingInit(string[] funcs, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject list = JavaArrayListExtensionMethod.CreateJavaArrayList();
            AndroidJavaObject[] javaArr = null;
            if (funcs != null)
            {
                foreach (var item in funcs)
                {
                    list.Add(item);
                }
                javaArr = list.Call<AndroidJavaObject[]>("toArray");
            }

            _rxApiObj.Call("shareSchedulingInit", javaArr, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public string GetShareScheduling(string[] funcs)
        {
            AndroidJavaObject list = JavaArrayListExtensionMethod.CreateJavaArrayList();
            AndroidJavaObject[] javaArr = null;
            if (funcs != null)
            {
                foreach (var item in funcs)
                {
                    list.Add(item);
                }
                javaArr = list.Call<AndroidJavaObject[]>("toArray");
            }
            return _rxApiObj.Call<string>("unityGetShareScheduling", javaArr, "");
        }

        public void GetShareInfo(RXShareConfig shareConfig, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject configObj = new AndroidJavaObject("com.ruixue.openapi.RXShareConfig");
            configObj.Call("setFunc", shareConfig.func);
            configObj.Call("setPlatform", shareConfig.platform);
            configObj.Call("setRegion", shareConfig.region);
            configObj.Call("setTransmits", shareConfig.transmits);
            configObj.Call("setiOSScheme", shareConfig.protocol_ios);
            configObj.Call("setAndroidScheme", shareConfig.protocol_android);
            configObj.Call("setUseScheme", shareConfig.use_scheme);
            configObj.Call("setReadCache", shareConfig.read_cache);
            configObj.Call("setAutoReport", shareConfig.auto_report);
            configObj.Call("setShareScene", shareConfig.shareScene);
            configObj.Call("setUseShortUrl", shareConfig.useShortUrl);
            if (shareConfig.ext != null)
            {
                var jsonStr = JsonMapper.ToJson(shareConfig.ext);
                AndroidJavaObject extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
                configObj.Call("setExt", extMap);
            }

            if (shareConfig.properties != null)
            {
                var jsonStr = JsonMapper.ToJson(shareConfig.properties);
                AndroidJavaObject extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
                configObj.Call("setProperties", extMap);
            }
            
            _rxApiObj.Call("getShareInfo", configObj, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetShareData(RXShareConfig shareConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject configObj = new AndroidJavaObject("com.ruixue.openapi.RXShareConfig");
            configObj.Call("setFunc", shareConfig.func);
            configObj.Call("setPlatform", shareConfig.platform);
            configObj.Call("setRegion", shareConfig.region);
            configObj.Call("setTransmits", shareConfig.transmits);
            configObj.Call("setiOSScheme", shareConfig.protocol_ios);
            configObj.Call("setAndroidScheme", shareConfig.protocol_android);
            configObj.Call("setUseScheme", shareConfig.use_scheme);
            configObj.Call("setReadCache", shareConfig.read_cache);
            configObj.Call("setAutoReport", shareConfig.auto_report);
            configObj.Call("setShareScene", shareConfig.shareScene);
            configObj.Call("setUseShortUrl", shareConfig.useShortUrl);
            if (shareConfig.ext != null)
            {
                var jsonStr = JsonMapper.ToJson(shareConfig.ext);
                AndroidJavaObject extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
                configObj.Call("setExt", extMap);
            }

            if (shareConfig.properties != null)
            {
                var jsonStr = JsonMapper.ToJson(shareConfig.properties);
                AndroidJavaObject extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
                configObj.Call("setProperties", extMap);
            }
            
            _rxApiObj.Call("getShareInfo", configObj, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void ShareCustom(RXCustomShareConfig shareConfig, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject configObj = new AndroidJavaObject("com.ruixue.openapi.RXCustomShareConfig");
            
            configObj.Call("setPlatform", shareConfig.platform);
            configObj.Call("setShareScene", shareConfig.shareScene);
            configObj.Call("setType", shareConfig.material_type);
            configObj.Call("setTitle", shareConfig.title);
            configObj.Call("setDescription", shareConfig.content);
            configObj.Call("setImage", shareConfig.image);
            configObj.Call("setUrl", shareConfig.url);
            configObj.Call("setX", shareConfig.x);
            configObj.Call("setY", shareConfig.y);
            configObj.Call("setWidth", shareConfig.width);
            configObj.Call("setHeight", shareConfig.height);
            
            AndroidJavaClass contentInCircleObj = new AndroidJavaClass("java.lang.Boolean");
            configObj.Call("setShow_content_in_circle", 
                contentInCircleObj.CallStatic<AndroidJavaObject>("valueOf", 
                    shareConfig.show_content_in_circle));
            configObj.Call("setThirdAppid", shareConfig.appid);
            configObj.Call("setOpenId", shareConfig.openId);
            configObj.Call("setUsername", shareConfig.username);
            configObj.Call("setPath", shareConfig.path);
            AndroidJavaClass withShareTicketObj = new AndroidJavaClass("java.lang.Boolean");
            configObj.Call("setWithShareTicket", 
                withShareTicketObj.CallStatic<AndroidJavaObject>("valueOf", 
                    shareConfig.withShareTicket));
            configObj.Call("setExtData", shareConfig.extData);
            
            configObj.Call("setUseScheme", shareConfig.use_scheme);
            configObj.Call("setIOSProtocol", shareConfig.protocol_ios);
            configObj.Call("setAndroidProtocol", shareConfig.protocol_android);
            
            _rxApiObj.Call("shareCustom", _contextObj, configObj, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void ShareForWebglCustom(Dictionary<string, object> shareParams, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("ShareForWebglCustom");
        }


        public void Share(RXShareConfig shareConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            
            AndroidJavaObject configObj = new AndroidJavaObject("com.ruixue.openapi.RXShareConfig");
            configObj.Call("setFunc", shareConfig.func);
            configObj.Call("setPlatform", shareConfig.platform);
            configObj.Call("setRegion", shareConfig.region);
            configObj.Call("setTransmits", shareConfig.transmits);
            configObj.Call("setiOSScheme", shareConfig.protocol_ios);
            configObj.Call("setAndroidScheme", shareConfig.protocol_android);
            configObj.Call("setUseScheme", shareConfig.use_scheme);
            configObj.Call("setReadCache", shareConfig.read_cache);
            configObj.Call("setAutoReport", shareConfig.auto_report);
            configObj.Call("setShareScene", shareConfig.shareScene);
            configObj.Call("setUseShortUrl", shareConfig.useShortUrl);
            if (shareConfig.ext != null)
            {
                var jsonStr = JsonMapper.ToJson(shareConfig.ext);
                AndroidJavaObject extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
                configObj.Call("setExt", extMap);
            }

            if (shareConfig.properties != null)
            {
                var jsonStr = JsonMapper.ToJson(shareConfig.properties);
                AndroidJavaObject extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
                configObj.Call("setProperties", extMap);
            }

            _rxApiObj.Call("share", _contextObj, configObj, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void ShareSchedulingReport(string func, string platform, string region, bool scheduling_event, string scheduling_type,
            string transmits, Dictionary<string, object> properties, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject extMap = null;
            if (properties != null)
            {
                string jsonStr = JsonMapper.ToJson(properties);
                extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            }
            _rxApiObj.Call("shareSchedulingReport", func, platform, region, scheduling_event, 
                scheduling_type, transmits, extMap, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetShortUrl(string url, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("getShortUrl", url, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetShortUrl(Dictionary<string, object> dic, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            if (dic != null)
            {
                var jsonStr = JsonMapper.ToJson(dic);
                AndroidJavaObject extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
                _rxApiObj.Call("getShortUrl", extMap, new JsonCallbackJavaProxy(onResponse, onError));
            }
            
        }
    }
}
#endif
