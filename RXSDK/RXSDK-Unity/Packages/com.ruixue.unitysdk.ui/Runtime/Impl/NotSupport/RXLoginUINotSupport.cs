using System.Collections.Generic;

namespace RuiXue.LoginUI.Impl
{
    internal class RXLoginUINotSupport : IRXLoginUI
    {
        public void SyncAccounts(List<Dictionary<string, string>> accounts)
        {
            LogUtil.WarningNotSupport("SyncAccounts");
        }
        
        public void ShowOAuthLoginUI(LoginUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            LogUtil.WarningNotSupport("ShowOAuthLoginUI");
        }
        public void LoginUI(LoginUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            LogUtil.WarningNotSupport("LoginUI");
        }

        public void CloseLoginUI()
        {
            LogUtil.WarningNotSupport("CloseLoginUI");
        }

        public void FindPasswordUI(FindPasswordUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            LogUtil.WarningNotSupport("FindPasswordUI");
        }

        public void DestroyAccountStatusView(bool isLoginContinue, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate, RequestExtDelegates extDelegates)
        {
            LogUtil.WarningNotSupport("DestroyAccountStatusView");
        }

        public void DestroyAccountStatusView(string okButtonText, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate, RequestExtDelegates extDelegates)
        {
            LogUtil.WarningNotSupport("DestroyAccountStatusView");
        }

        public void ProtocolView(string key, List<string> keyList)
        {
            LogUtil.WarningNotSupport("ProtocolView");
        }

        public void RealAuthUI(RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            LogUtil.WarningNotSupport("RealAuthUI");
        }

        public void LimitUI(string titleStr, string contextStr, string buttonTxt, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            LogUtil.WarningNotSupport("LimitUI");
        }

        public void UserCenterUI(UserCenterUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            LogUtil.WarningNotSupport("UserCenterUI");
        }

        public void ApplyForDeregisterUI(UserCenterUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            LogUtil.WarningNotSupport("ApplyForDeregisterUI");
        }

        public void ShowMailCenter(string userId)
        {
            throw new System.NotImplementedException();
        }

        public void ShowAnnounceView(int limit, OnLink onLink, HsAnnounceUI hsAnnounceUI)
        {
            throw new System.NotImplementedException();
        }

        public void ShowUpdateAppView(string version, string region, Dictionary<string, object> queryMap, bool isShowUI, OnLink onLink,
            HsAnnounceUI hsAnnounceUI, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            throw new System.NotImplementedException();
        }

        public void ShowCheckUpdateAppView(string version, string region, string type, Dictionary<string, object> queryMap, bool isShowUI,
            OnLink onLink, HsAnnounceUI hsAnnounceUI, RequestResponseDelegate responseDelegate,
            RequestErrorDelegate errorDelegate)
        {
            throw new System.NotImplementedException();
        }

        public void bindPhone(RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            LogUtil.WarningNotSupport("bindPhone");
        }
    }
}