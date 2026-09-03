#if UNITY_ANDROID
using System.Collections.Generic;
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.WeiXin.Impl
{
    internal class RXWeiXinAndroid : IRXWeiXin
    {
        
        public static AndroidJavaObject _weixinSdkObj;
        public static AndroidJavaObject _weixinSdkInstance;
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaClass _jSONUtil;

        public RXWeiXinAndroid()
        {
            _weixinSdkObj = new AndroidJavaClass("com.ruixue.wechat.WXSdkWrapper");
            _weixinSdkInstance = _weixinSdkObj.CallStatic<AndroidJavaObject>("getInstance");
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            _jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
        }

        public bool IsWXAppInstalled()
        {
            return _weixinSdkObj.CallStatic<bool>("isWXAppInstalled", _contextObj);
        }

        public bool OpenWXApp()
        {
            return _weixinSdkObj.CallStatic<bool>("openWXApp", _contextObj);
        }

        public bool OpenMiniProgram(Dictionary<string, object> hashMap, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject extMap = null;
            if (hashMap != null)
            {
                string jsonStr = JsonMapper.ToJson(hashMap);
                extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            }

            return _weixinSdkObj.CallStatic<bool>("openMiniProgram", _contextObj, extMap,
                new JsonCallbackJavaProxy(onResponse, onError));
        }
    }
}
#endif