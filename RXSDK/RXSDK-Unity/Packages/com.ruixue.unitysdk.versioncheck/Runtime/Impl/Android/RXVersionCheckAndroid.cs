#if UNITY_ANDROID
using System.Collections.Generic;
using UnityEngine;

namespace RuiXue.VersionCheck.Impl
{
    internal class RXVersionCheckAndroid : IRXVersionCheck
    {
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _rxSdkObj;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaObject _rxApiObj;
        private static AndroidJavaClass _jSONUtil;

        public RXVersionCheckAndroid()
        {
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _rxSdkObj = new AndroidJavaClass("com.ruixue.RuiXueSdk");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            _rxApiObj = _rxSdkObj.CallStatic<AndroidJavaObject>("getRXSdkApi");
            _jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
        }

        public void UpdateApp(string version, string region, string type, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            AndroidJavaObject extMap = null;
            Dictionary<string, object> dic = new Dictionary<string, object>();
            if (!string.IsNullOrEmpty(type))
            {
                dic.Add("type", $"{type}");
            }
            
            string jsonStr = RXJsonUtil.ToJson(dic);
            extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            
            _rxApiObj.Call("updateApp", version, region, extMap, 
                new ConvertRXStringCallbackProxy(onResponse, onError));
        }

        public void CheckUpdateApp(string version, string region, string type, Dictionary<string, int> games, Dictionary<string, int> activities,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            Dictionary<string, object> dic = new();
            if (games != null)
                dic.Add("games", games);
            
            if (activities != null)
                dic.Add("activities",activities);
            
            string jsonStr = RXJsonUtil.ToJson(dic);
            AndroidJavaObject extMap = null;
            extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            _rxApiObj.Call("checkUpdateApp", version, region, type, extMap, 
                new ConvertRXStringCallbackProxy(onResponse, onError));
        }

        public void UpdateGame(string gameId, string gameVersion, string gameCheckVersion, string type, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject extMap = null;
            Dictionary<string, object> dic = new Dictionary<string, object>();
            if (!string.IsNullOrEmpty(type))
            {
                dic.Add("type", $"{type}");
            }
            
            string jsonStr = RXJsonUtil.ToJson(dic);
            extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            _rxApiObj.Call("updateGame", gameId, gameVersion, gameCheckVersion, extMap, 
                new ConvertRXStringCallbackProxy(onResponse, onError));
        }

        public void UpdateGameVersion(Dictionary<string, object> body,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            string jsonStr = RXJsonUtil.ToJson(body ?? new Dictionary<string, object>());
            AndroidJavaObject bodyMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            _rxApiObj.Call("updateGameVersion", bodyMap, new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void UpdateActivity(string activityShortname, string activityVersion, string activityCheckVersion,
            string type, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            AndroidJavaObject extMap = null;
            
            Dictionary<string, object> dic = new Dictionary<string, object>();
            if (!string.IsNullOrEmpty(type))
            {
                dic.Add("type", $"{type}");
            }
            
            string jsonStr = RXJsonUtil.ToJson(dic);
            extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            _rxApiObj.Call("updateActivity", activityShortname, activityVersion, activityCheckVersion, extMap, 
                new ConvertRXStringCallbackProxy(onResponse, onError));
        }
    }
}
#endif