#if UNITY_ANDROID
using UnityEngine;

namespace RuiXue.Impl 
{
    public class OnRxWebViewOnCloseListener : AndroidJavaProxy
    {
        private WebViewCloseDelegate _webViewOnCloseDeletage;

        public OnRxWebViewOnCloseListener(WebViewCloseDelegate webViewOnCloseDeletage) : base("com.ruixue.view.RXWebView$OnCloseListener") {
            _webViewOnCloseDeletage = webViewOnCloseDeletage;
        }

        public void OnClosed(AndroidJavaObject v)
        {
            _webViewOnCloseDeletage?.Invoke();
        }

    }
}
#endif