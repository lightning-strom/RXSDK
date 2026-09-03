using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
#if UNITY_IOS
namespace RuiXue.Impl
{
    internal class RuiXueSdkIOS : IRuiXueSdk
    {
        public void SetLogEnable(bool logEnabled)
        {
             LogUtil.LogEnabled = logEnabled;
        }
        
        public void Initialize(string cpid, string productid, string channelid, List<string> urls, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_initWithProductId", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_base_initWithProductId(cpid, productid, channelid, urls.ToArray(), urls.Count, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void Initialize(RXSdkInitConfig rxSdkInitConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_initWithConfig", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            string config = RXJsonUtil.ToJson(rxSdkInitConfig);
            ios_base_initWithConfig(config, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void SetSubChannelId(string subChannelId)
        {
            ios_base_setSubChannelId(subChannelId);
        }

        public void SetGameInfo(string roleId, string regionTag)
        {
            ios_base_setGameInfo(roleId, regionTag);
        }

        public void SetThirdGameInfo(GameInfo gameInfo)
        {
            if (gameInfo == null)
            {
                throw new ArgumentNullException(nameof(gameInfo));
            }
            SetGameInfo(gameInfo.roleId, gameInfo.serverId);
        }

        public void SearchGameAccount(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_searchGameAccount", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            ios_base_searchGameAccount(RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void BindAccount(Dictionary<string, object> ext, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_bindAccount", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            ios_base_bindAccount(RXJsonUtil.ToJson(ext ?? new Dictionary<string, object>()), RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetIIFAARedirectURL(string appName, string thirdPartSchema, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_getIIFAARedirectURL", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            ios_base_getIIFAARedirectURL(appName, thirdPartSchema, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetIIFAAResultWithRetryCount(int retryCount, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_getIIFAAResultWithRetryCount", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            ios_base_getIIFAAResultWithRetryCount(retryCount, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetIIFAAResultWithSource(string source, int retryCount, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_getIIFAAResultWithSource", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            ios_base_getIIFAAResultWithSource(source, retryCount, RuiXueSdkDriver.IOSCallBackOnResponse,
                RuiXueSdkDriver.IOSCallBackOnError);
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
            ios_base_setLanguage(language);
        }

        public void SetScreenCaptureDisable(bool disable)
        {
            LogUtil.WarningNotSupport("SetScreenCaptureDisable");
        }

        public void CreateRequest(string url, Dictionary<string, string> header, Dictionary<string, string> body, HttpMethod method, bool needLogin,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var jsonHeader = RXJsonUtil.ToJson(header);
            var jsonBody = RXJsonUtil.ToJson(body);
            
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_createRequestWithUrl", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_base_createRequestWithUrl(url, jsonHeader, jsonBody, (int)method, needLogin, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void InitThirdSdk(Dictionary<string, object> map, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("InitThirdSdk");
        }

        public void InvokeChannelAction(string action, Dictionary<string, object> parameters,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            onError?.Invoke("InvokeChannelAction is not supported on iOS.");
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
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_getEmailListWithCpUserID", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_base_getEmailListWithCpUserID(cpUserID:userId, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void DeleteEmail(string userId, int type, int mailId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_deleteEmailWithCpUserID", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_base_deleteEmailWithCpUserID(cpUserID:userId, type:type, mailId, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetEmailDetail(string userId, int mailId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_getEmailDetailWithCpUserID", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_base_getEmailDetailWithCpUserID(cpUserID:userId, emailID:mailId, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetEmailAward(string userId, int type, int mailId, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_receivePropsWithCpUserID", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_base_receivePropsWithCpUserID(cpUserID:userId, type:type, mailId, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetAnnouncement(int limit, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_getAnnouncementWithLimitWithLimit", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_base_getAnnouncementWithLimitWithLimit(limit:limit, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetTempNotice(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_getTempNotice", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_base_getTempNotice(RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void FeedbackCreate(string content, string[] attachments, string phone, string[] tags,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_feedbackCreateWithContent", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            string attachmentsStr = "";
            if (attachments != null && attachments.Length > 0)
            {
                attachmentsStr = RXJsonUtil.ToJson(attachments);
            }
            ios_base_feedbackCreateWithContent(content:content, attachments:attachmentsStr, phone:phone, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetFeedbackList(int page, int size, int status, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_getFeedbackListWithPage", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_base_getFeedbackListWithPage(page:page, size:size, status:status, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetFeedbackDetail(int id, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_getFeedbackDetailWithFeedbackID", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            ios_base_getFeedbackDetailWithFeedbackID(feedbackID:id, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void FeedbackGetprop(int id, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_feedbackGetpropWithFeedbackID", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            ios_base_feedbackGetpropWithFeedbackID(feedbackID:id, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetPromoDisplayKEY(bool authRefresh, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_getPromoDisplayKeyWithAutoRefresh", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            ios_base_getPromoDisplayKeyWithAutoRefresh(autoRefresh:authRefresh, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void ExchangePromoCDKEY(string cdKey, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_exchangePromoCDKEY", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            ios_base_exchangePromoCDKEY(cdkey:cdKey, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetDeviceCode(RequestResponseDelegate onResponse)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_getDeviceCode", new IOSCallBackWrapper
            {
                onResponse = onResponse
            });
            ios_base_getDeviceCode(RuiXueSdkDriver.IOSCallBackOnResponse);
        }

        public void GetDistinctId(RequestResponseDelegate onResponse)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_getDistinctId", new IOSCallBackWrapper
            {
                onResponse = onResponse
            });
            ios_base_getDistinctId(RuiXueSdkDriver.IOSCallBackOnResponse);
        }

        public void ShowCaptchaVerifyUI(string appId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_base_captchaVerifyUI", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            ios_base_captchaVerifyUI(appId:appId, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
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
            string errorMsgDicStr = RXJsonUtil.ToJson(errorMsgMap);
            ios_base_configErrorMsg(errorMsgDicStr);
        }

        public bool LoginOpenidExpireInvalid()
        {
            return ios_base_loginOpenidExpireInvalid();
        }
        
        public void SetPasswordStrength(RXPasswordStrength type)
        {
            ios_base_setPasswordStrength((int)type);
        }
        
        public void SetPwdPattern(string pattern)
        {
            ios_base_setPwdPattern(pattern);
        }

        public void SetArea(string area)
        {
            ios_base_setArea(area);
        }

        [DllImport ("__Internal")]
        private static extern void ios_base_initWithProductId(string cpid, string productid, string channelid, string[] urls, int urlCount, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport ("__Internal")]
        private static extern void ios_base_setLanguage(string language);

        [DllImport ("__Internal")]
        private static extern void ios_base_createRequestWithUrl(string url, string header, string body, int method, bool needLogin, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);

        [DllImport("__Internal")]
        private static extern void ios_base_setSubChannelId(string channelId);

        [DllImport("__Internal")]
        private static extern void ios_base_setGameInfo(string roleId, string regionTag);

        [DllImport("__Internal")]
        private static extern void ios_base_searchGameAccount(IOSCallBackCommonDelegate onResponse,
            IOSCallBackCommonDelegate onError);

        [DllImport("__Internal")]
        private static extern void ios_base_bindAccount(string ext, IOSCallBackCommonDelegate onResponse,
            IOSCallBackCommonDelegate onError);

        [DllImport("__Internal")]
        private static extern void ios_base_getIIFAARedirectURL(string appName, string thirdPartSchema,
            IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);

        [DllImport("__Internal")]
        private static extern void ios_base_getIIFAAResultWithRetryCount(int retryCount,
            IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);

        [DllImport("__Internal")]
        private static extern void ios_base_getIIFAAResultWithSource(string source, int retryCount,
            IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport ("__Internal")]
        private static extern void ios_base_getEmailListWithCpUserID(string cpUserID, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport ("__Internal")]
        private static extern void ios_base_getEmailDetailWithCpUserID(string cpUserID, int emailID, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport ("__Internal")]
        private static extern void ios_base_receivePropsWithCpUserID(string cpUserID, int type, int emailID, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);

        [DllImport ("__Internal")]
        private static extern void ios_base_deleteEmailWithCpUserID(string cpUserID, int type, int emailID, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport ("__Internal")]
        private static extern void ios_base_getAnnouncementWithLimitWithLimit(int limit, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport ("__Internal")]
        private static extern void ios_base_getTempNotice(IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport ("__Internal")]
        private static extern void ios_base_feedbackCreateWithContent(string content, string attachments, string phone, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);

        [DllImport ("__Internal")]
        private static extern void ios_base_getFeedbackListWithPage(int page, int size, int status, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);

        [DllImport ("__Internal")]
        private static extern void ios_base_getFeedbackDetailWithFeedbackID(int feedbackID, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);

        [DllImport ("__Internal")]
        private static extern void ios_base_feedbackGetpropWithFeedbackID(int feedbackID, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport ("__Internal")]
        private static extern void ios_base_getPromoDisplayKeyWithAutoRefresh(bool autoRefresh, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport ("__Internal")]
        private static extern void ios_base_exchangePromoCDKEY(string cdkey, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);

        [DllImport ("__Internal")]
        private static extern void ios_base_getDeviceCode(IOSCallBackCommonDelegate onResponse);

        [DllImport ("__Internal")]
        private static extern void ios_base_getDistinctId(IOSCallBackCommonDelegate onResponse);

        [DllImport("__Internal")]
        private static extern void ios_base_captchaVerifyUI(string appId, IOSCallBackCommonDelegate onResponse,
            IOSCallBackCommonDelegate onError);
        
        [DllImport ("__Internal")]
        private static extern void ios_base_initWithConfig(string config, IOSCallBackCommonDelegate onResponse, IOSCallBackCommonDelegate onError);
        
        [DllImport ("__Internal")]
        private static extern bool ios_base_loginOpenidExpireInvalid();
        
        [DllImport("__Internal")]
        private static extern void ios_base_configErrorMsg(string errorMsgDicStr);
        
        [DllImport("__Internal")]
        private static extern void ios_base_setPasswordStrength(int type);
        
        [DllImport("__Internal")]
        private static extern void ios_base_setPwdPattern(string pattern);
        
        [DllImport("__Internal")]
        private static extern void ios_base_setArea(string area);
    }
}
#endif