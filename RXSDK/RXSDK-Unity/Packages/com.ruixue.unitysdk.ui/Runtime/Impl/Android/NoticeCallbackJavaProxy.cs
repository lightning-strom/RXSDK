#if UNITY_ANDROID
using UnityEngine;
namespace RuiXue
{
    public class NoticeCallbackJavaProxy : AndroidJavaProxy
    {
        OnLink _onLink;
        private HsAnnounceUI _hsAnnounceUI;

        public NoticeCallbackJavaProxy(OnLink onLink, HsAnnounceUI hsAnnounceUI) 
            : base("com.ruixue.view.notice.NoticeCallback")
        {
            JavaCallBackToMainThread.CheckInit();
            
            _onLink = onLink;
            _hsAnnounceUI = hsAnnounceUI;
        }

        public void onLink(string link)
        {
            _onLink?.Invoke(link);
        }
        
        public void hasAnnounceUI(bool isHas)
        {
            _hsAnnounceUI?.Invoke(isHas);
        }
    }
}
#endif