using System;
using System.Collections.Generic;
namespace RuiXue.Impl
{
    internal class RuiXueSdkNotSupport : IRuiXueSdk
    {
        public void SetLogEnable(bool logEnabled)
        {
            LogUtil.LogEnabled = logEnabled;
        }

        public void Initialize(string cpid, string productid, string channelid, List<string> urls, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("Initialize");
        }

        public void Initialize(RXSdkInitConfig rxSdkInitConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            throw new NotImplementedException();
        }

        public void SetSubChannelId(string subChannelId)
        {
            LogUtil.WarningNotSupport("SetSubChannelId");
        }

        public void SetGameInfo(string roleId, string regionTag)
        {
            LogUtil.WarningNotSupport("SetGameInfo");
        }

        public void SetThirdGameInfo(GameInfo gameInfo)
        {
            LogUtil.WarningNotSupport("SetThirdGameInfo");
        }

        public void SearchGameAccount(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("SearchGameAccount");
        }

        public void BindAccount(Dictionary<string, object> ext, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("BindAccount");
        }

        public void GetIIFAARedirectURL(string appName, string thirdPartSchema, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetIIFAARedirectURL");
        }

        public void GetIIFAAResultWithSource(string source, int retryCount, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetIIFAAResultWithSource");
        }

        public void GetIIFAAResultWithRetryCount(int retryCount, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetIIFAAResultWithRetryCount");
        }

        public void SetupAddictDelegate(IAntiAddictDelegate addictDelegate)
        {
            LogUtil.WarningNotSupport("SetupAddictDelegate");
        }

        public void DisableReadSensitiveInfo(bool disabled)
        {
            LogUtil.WarningNotSupport("DisableReadSensitiveInfo");
        }

        public bool IsAgreedPrivacy()
        {
            LogUtil.WarningNotSupport("IsAgreedPrivacy");
            return true;
        }

        public void SetPrivacyAgree(PrivacyAgreeDelegate callback)
        {
            LogUtil.WarningNotSupport("SetPrivacyAgree");
        }

        public void SetLanguage(string language)
        {
            LogUtil.WarningNotSupport("SetLanguage");
        }

        public void SetScreenCaptureDisable(bool disable)
        {
            LogUtil.WarningNotSupport("SetScreenCaptureDisable");
        }

        public void CreateRequest(string url, Dictionary<string, string> header, Dictionary<string, string> body, HttpMethod method, bool needLogin,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("CreateRequest");
        }

        public void InitThirdSdk(Dictionary<string, object> map, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("InitThirdSdk");
        }

        public void InvokeChannelAction(string action, Dictionary<string, object> parameters,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            onError?.Invoke("InvokeChannelAction is not supported on the current platform.");
        }

        public void SetSdkCallback(PublicDelegate publicDelegate, LogoutDelegate onLogout, SwitchAccountDelegate onSwitchAccount)
        {
            LogUtil.WarningNotSupport("SetSdkCallback");
        }

        public void ExitApp(ExitConfirmDelegate onExitConfirm, ExitCancelDelegate onExitCancel)
        {
            LogUtil.WarningNotSupport("ExitApp");
        }

        public void GetEmailList(string userId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            throw new NotImplementedException();
        }

        public void DeleteEmail(string userId, int type, int mailId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            throw new NotImplementedException();
        }

        public void GetEmailDetail(string userId, int mailId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            throw new NotImplementedException();
        }

        public void GetEmailAward(string userId, int type, int mailId, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            throw new NotImplementedException();
        }

        public void GetAnnouncement(int limit, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            throw new NotImplementedException();
        }

        public void GetTempNotice(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            throw new NotImplementedException();
        }

        public void FeedbackCreate(string content, string[] attachments, string phone, string[] tags,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            throw new NotImplementedException();
        }

        public void GetFeedbackList(int page, int size, int status, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            throw new NotImplementedException();
        }

        public void GetFeedbackDetail(int id, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            throw new NotImplementedException();
        }

        public void FeedbackGetprop(int id, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            throw new NotImplementedException();
        }

        public void GetPromoDisplayKEY(bool authRefresh, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            throw new NotImplementedException();
        }
        
        public void ExchangePromoCDKEY(string cdKey, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("exchangePromoCDKEY");
        }
        
        public void GetDeviceCode(RequestResponseDelegate onResponse)
        {
            LogUtil.WarningNotSupport("getDeviceCode");
        }

        public void GetDistinctId(RequestResponseDelegate onResponse)
        {
            LogUtil.WarningNotSupport("getDistinctId");
        }

        public void ShowCaptchaVerifyUI(string appId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("ShowCaptchaVerifyUI");
        }

        public void CheckQuickAp(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("CheckQuickAp");
        }

        public void SubmitChannelPayment(int amountFen, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("SubmitChannelPayment");
        }

        public void SubmitChannelPayment(int amountFen, Dictionary<string, object> overrideFields,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("SubmitChannelPayment");
        }

        public void CheckChannelPaymentLimit(int amountFen, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("CheckChannelPaymentLimit");
        }

        public void configErrorMsg(Dictionary<string, object> errorMsgMap)
        {
            LogUtil.WarningNotSupport("configErrorMsg");
        }

        public bool LoginOpenidExpireInvalid()
        {
            throw new NotImplementedException();
        }
        
        public void SetPasswordStrength(RXPasswordStrength type)
        {
            LogUtil.WarningNotSupport("SetPasswordStrength");
        }
        
        public void SetPwdPattern(string pattern)
        {
            LogUtil.WarningNotSupport("SetPwdPattern");
        }
        
        public void SetArea(string area)
        {
            LogUtil.WarningNotSupport("SetArea");
        }
    }
}
