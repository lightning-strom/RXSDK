#if UNITY_ANDROID
using System.Collections.Generic;
using RuiXueLitJson;
using UnityEngine;

namespace RuiXue.Help.Impl
{
    internal class RXHelpAndroid : IRXHelp
    {
        private static AndroidJavaClass _unityPlayerObj;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaObject _rxSdkUiObj;
        private static AndroidJavaObject _sInstanceObj;
        private static AndroidJavaClass _jSONUtil;
        private static AndroidJavaObject _iView;

        public RXHelpAndroid()
        {
            _unityPlayerObj = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _contextObj = _unityPlayerObj.GetStatic<AndroidJavaObject>("currentActivity");
            _rxSdkUiObj = new AndroidJavaObject("com.ruixue.openapi.RXSdkUI");
            _sInstanceObj = _rxSdkUiObj.CallStatic<AndroidJavaObject>("getInstance");
            _jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
        }

        public void HelperCenterUI(Dictionary<string, object> dic,
            RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            AndroidJavaObject extMap = null;
            if (dic != null)
            {
                var jsonStr = JsonMapper.ToJson(dic);
                extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            }

            _iView = _sInstanceObj.Call<AndroidJavaObject>("unityHelperCenterUI", _contextObj, extMap,
                new JsonCallbackJavaProxy(responseDelegate, errorDelegate));
            _iView.Call("unityShow", _contextObj);
        }

        public void ChatServiceUI(Dictionary<string, object> dic,
            RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            AndroidJavaObject extMap = null;
            if (dic != null)
            {
                var jsonStr = JsonMapper.ToJson(dic);
                extMap = _jSONUtil.CallStatic<AndroidJavaObject>("toMap", jsonStr);
            }

            _iView = _sInstanceObj.Call<AndroidJavaObject>("unityChatServiceUI", _contextObj, extMap,
                new JsonCallbackJavaProxy(responseDelegate, errorDelegate));
            _iView.Call("unityShow", _contextObj);
        }

        public void CloseLoginUI()
        {
            _iView.Call("unityDismiss", _contextObj);
        }
    }
}
#endif