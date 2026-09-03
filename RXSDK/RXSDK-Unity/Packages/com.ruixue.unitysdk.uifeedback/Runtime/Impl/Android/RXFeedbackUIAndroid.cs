#if UNITY_ANDROID
using UnityEngine;

namespace RuiXue.FeedbackUI.Impl
{
    internal class RXFeedbackUIAndroid : IRXFeedbackUI
    {
        
        private static AndroidJavaClass _unityPlayerObj;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaObject _feedbackUI;

        public RXFeedbackUIAndroid()
        {
            _unityPlayerObj = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _contextObj = _unityPlayerObj.GetStatic<AndroidJavaObject>("currentActivity");
            _feedbackUI = new AndroidJavaClass("com.ruixue.feedbackui.RXFeedbackUI");
        }
        
        public void ShowCreateFeedbackView()
        {
            _feedbackUI.CallStatic("showUnityCreateFeedbackView", _contextObj);
        }

        public void ShowFeedbackListView()
        {
            _feedbackUI.CallStatic("showUnityFeedbackListView", _contextObj);
        }
    }
}
#endif