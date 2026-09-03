#if UNITY_ANDROID
using System.Collections.Generic;
using UnityEngine;

namespace RuiXue.Oaidv2.Impl
{
    internal class RXOaidv2Android : IRXOaidv2
    {
        
        public static AndroidJavaObject _oaidv2SdkObj;
        public static AndroidJavaObject _oaidv2SdkInstance;
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaClass _jSONUtil;

        public RXOaidv2Android()
        {
            _oaidv2SdkObj = new AndroidJavaClass("com.ruixue.mdid.OaidSdkWrapper");
            _oaidv2SdkInstance = _oaidv2SdkObj.CallStatic<AndroidJavaObject>("getInstance");
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            _jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
        }


        public void InitOaidSdk(string certString, AppOaidCallbackJavaProxy onResponse)
        {
            _oaidv2SdkInstance.Call<int>("initOaidSdk", _contextObj, certString, onResponse);
        }

        public void InitOaidSdk(string certString)
        {
            _oaidv2SdkInstance.Call("initOaidSdk", _contextObj, certString);
        }

        public bool IsSupport()
        {
            return _oaidv2SdkInstance.Call<bool>("isSupport");
        }

        public string GetOAID()
        {
            return _oaidv2SdkInstance.Call<string>("getOAID");
        }
    }
}
#endif