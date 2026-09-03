#if UNITY_ANDROID
using RuiXueLitJson;
using UnityEngine;
namespace RuiXue
{
    public class MaintainNoticeCallbackJavaProxy : AndroidJavaProxy
    {
        private OnLink _onLink;
        private HsAnnounceUI _hsAnnounceUI;
        private RequestResponseDelegate _onResponse;
        private RequestErrorDelegate _onError;

        public MaintainNoticeCallbackJavaProxy(OnLink onLink, HsAnnounceUI hsAnnounceUI, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError) 
            : base("com.ruixue.view.notice.MaintainNoticeCallback")
        {
            JavaCallBackToMainThread.CheckInit();
            
            _onLink = onLink;
            _hsAnnounceUI = hsAnnounceUI;
            _onResponse = onResponse;
            _onError = onError;
        }

        public void onLink(string link)
        {
            _onLink?.Invoke(link);
        }
        
        public void hasAnnounceUI(bool isHas)
        {
            _hsAnnounceUI?.Invoke(isHas);
        }
        
        public void onSuccess(string data)
        {
            if (_onResponse != null)
            {
                _onResponse.Invoke(data);
            }
        }

        public void onFailed(int code, string msg, string traceId)
        {
            if (_onError != null)
            {
                FailEntity failEntity = new FailEntity();
                failEntity.code = code;
                failEntity.msg = msg;
                failEntity.traceId = traceId;
                string failJson = JsonMapper.ToJson(failEntity);
                _onError.Invoke(failJson);
            }
        }

        class FailEntity
        {
            public int code;
            public string msg;
            public string traceId;
        }
        
    }
}
#endif