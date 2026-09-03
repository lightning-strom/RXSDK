#if UNITY_ANDROID
using UnityEngine;

namespace RuiXue.Review.Impl
{
    internal class RXReviewAndroid : IRXReview
    {
        
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _rxSdkObj;
        private static AndroidJavaObject _contextObj;

        public RXReviewAndroid()
        {
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _rxSdkObj = new AndroidJavaClass("com.ruixue.RuiXueSdk");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
        }

        public bool JumpToAppStore()
        {
            return _rxSdkObj.CallStatic<bool>("jumpToAppStore", _contextObj);
        }
    }
}
#endif