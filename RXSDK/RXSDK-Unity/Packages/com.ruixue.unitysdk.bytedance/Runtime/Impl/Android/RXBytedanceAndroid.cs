#if UNITY_ANDROID
using UnityEngine;

namespace RuiXue.Bytedance.Impl
{
    public class RXBytedanceAndroid : IRXBytedance
    {
        
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _contextObj;
        public static AndroidJavaObject _bytedanceSdkObj;
        public static AndroidJavaObject _bytedanceSdkInstance;

        public RXBytedanceAndroid()
        {
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            _bytedanceSdkObj = new AndroidJavaClass("com.ruixue.sdk.bytedancelog.BytedanceLogWrapper");
            _bytedanceSdkInstance = _bytedanceSdkObj.CallStatic<AndroidJavaObject>("getInstance");
        }

        public void SetContext()
        {
            _bytedanceSdkInstance.Call("setContext", _contextObj);
        }
    }
}
#endif