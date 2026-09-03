using System.Collections.Generic;
using System.Runtime.InteropServices;
using RuiXue;
using RuiXue.Impl;
using RuiXueLitJson;
using UnityEngine;

#if UNITY_WEBGL
public class RuiXueSdkWebGL : JsCallBackHandlerBase, IRuiXueSdk
{
    public void InitThirdSdk(Dictionary<string, object> map, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("InitThirdSdk");
    }

    public void InvokeChannelAction(string action, Dictionary<string, object> parameters,
        RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        onError?.Invoke("InvokeChannelAction is not supported on WebGL.");
    }

    public void SetSdkCallback(PublicDelegate publicDelegate, LogoutDelegate onLogout, SwitchAccountDelegate onSwitchAccount)
    {
        LogUtil.WarningNotSupport("SetSdkCallback");
    }

    public void SetLogEnable(bool logEnabled)
    {
        LogUtil.LogEnabled = logEnabled;
    }

    public void Initialize(string cpid, string productid, string channelid, List<string> urls,
        RequestResponseDelegate onSuccess, RequestErrorDelegate onError)
    {
        var data = new JsonData
        {
            ["cpid"] = cpid,
            ["productId"] = productid,
            ["channelId"] = channelid,
            ["baseUrlList"] = JsonMapper.ToObject(JsonMapper.ToJson(urls))
        };

        RegisterJsCallBack("rx_init", onSuccess, onError);
        rx_init(data.ToJson());
    }
    
    public void Initialize(RXSdkInitConfig rxSdkInitConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("Initialize");
    }

    public void SetSubChannelId(string subChannelId)
    {
        rx_setSubChannelId(subChannelId);
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

    public void BindAccount(Dictionary<string, object> ext, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
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

    public void CreateRequest(string url, Dictionary<string, string> header, Dictionary<string, string> body,
        HttpMethod method, bool needLogin,
        RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("CreateRequest");
    }
    

    public void ExitApp(ExitConfirmDelegate onExitConfirm, ExitCancelDelegate onExitCancel)
    {
        LogUtil.WarningNotSupport("ExitApp");
    }
    
    public void GetEmailList(string userId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("GetEmailList");
    }
    
    public void DeleteEmail(string userId, int type, int mailId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("DeleteEmail");
    }
    
    public void GetEmailDetail(string userId, int mailId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("GetEmailDetail");
    }

    public void GetEmailAward(string userId, int type, int mailId, RequestResponseDelegate onResponse,
        RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("GetEmailAward");
    }

    public void GetAnnouncement(int limit, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("GetAnnouncement");
    }

    public void GetTempNotice(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("GetTempNotice");
    }

    public void FeedbackCreate(string content, string[] attachments, string phone, string[] tags,
        RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("FeedbackCreate");
    }

    public void GetFeedbackList(int page, int size, int status, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("GetFeedbackList");
    }

    public void GetFeedbackDetail(int id, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("GetFeedbackDetail");
    }

    public void FeedbackGetprop(int id, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("FeedbackGetprop");
    }

    public void GetPromoDisplayKEY(bool authRefresh, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("GetPromoDisplayKEY");
    }
    
    public void ExchangePromoCDKEY(string cdKey, RequestResponseDelegate onResponse,
        RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("ExchangePromoCDKEY");
    }
    
    public void GetDeviceCode(RequestResponseDelegate onResponse)
    {
        LogUtil.WarningNotSupport("GetDeviceCode");
    }

    public void GetDistinctId(RequestResponseDelegate onResponse)
    {
        LogUtil.WarningNotSupport("GetDistinctId");
    }

    public void ShowCaptchaVerifyUI(string appId, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        throw new System.NotImplementedException();
    }

    public void CheckQuickAp(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        throw new System.NotImplementedException();
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

    public void CheckChannelPaymentLimit(int amountFen, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
    {
        LogUtil.WarningNotSupport("CheckChannelPaymentLimit");
    }

    public void configErrorMsg(Dictionary<string, object> errorMsgMap)
    {
        LogUtil.WarningNotSupport("configErrorMsg");
    }

    public bool LoginOpenidExpireInvalid()
    {
        throw new System.NotImplementedException();
    }

    public void SetPasswordStrength(RXPasswordStrength type)
    {
        throw new System.NotImplementedException();
    }
    
    public void SetPwdPattern(string pattern)
    {
        throw new System.NotImplementedException();
    }
    
    public void SetArea(string area)
    {
        throw new System.NotImplementedException();
    }

    [DllImport("__Internal")]
    public static extern void rx_init(string json);
    
    [DllImport("__Internal")]
    public static extern void rx_setSubChannelId(string subChannelId);
}
#endif