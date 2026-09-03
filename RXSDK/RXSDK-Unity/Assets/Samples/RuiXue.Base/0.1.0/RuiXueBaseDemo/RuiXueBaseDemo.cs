using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using RuiXue;
using RuiXue.Login;
using RuiXue.VersionCheck;
using UnityEngine.XR;
using Newtonsoft.Json.Linq;
using RuiXue.AliDns;
using RuiXue.Performance;
using RuiXue.TxDns;
using RuiXue.UWA;
using UnityEngine.SceneManagement;

public class RuiXueBaseDemo : MonoBehaviour
{
    [SerializeField] private Button _btnInit;

    [SerializeField] private GameObject _msgBox;
    [SerializeField] private Text _textMsg;
    [SerializeField] private Button _btnMsgBoxOK;
    [SerializeField] private Button _button_Addict;
    [SerializeField] private Button _button_SensitiveInfo;

    [SerializeField] private Button _button_IsAgreedPrivacy;
    [SerializeField] private Button _button_PrivacyAgree;
    [SerializeField] private Button _Button_SubChannel;
    [SerializeField] private Button _Button_IRXRequest;
    [SerializeField] private Button _Button_Language;
    [SerializeField] private Button _Button_ScreenCaptureDisable;
    [SerializeField] private Button _Button_SetCallBack;
    [SerializeField] private Button _Button_ExitAPP;
    [SerializeField] private Button _Button_getPromo;
    [SerializeField] private Button _Button_exchange;
    [SerializeField] private Button _Button_customErrorMsg;
    [SerializeField] private Button _Button_initError;
    [SerializeField] private Button _Button_checkQuickAp;
    [SerializeField] private Button _Button_setPwdPattern;
    [SerializeField] private Button _Button_setPasswordStrength;
    [SerializeField] private Button _Button_submitChannelPayment;
    [SerializeField] private Button _Button_checkUpdateApp;
    [Header("渠道通用接口示例")]
    [SerializeField] private string baiduAppId;
    [SerializeField] private string baiduAppKey;
    [SerializeField, Range(0, 2)] private int mumuSplashType;
    private static RuiXueBaseDemo _instance;
    private string cdKey;
    private bool isIifaaRealAuthInProgress;
    
    private void Awake()
    {
        _instance = this;
        _msgBox.SetActive(false);
        _btnMsgBoxOK.onClick.AddListener(() =>
        {
            _msgBox.SetActive(false);
        });
        
        RuiXueUWAGPM.StaticInit(
            "https://2uq9pq.pwypyq.com", 
            "7d979a9a-57c9-467e-ac67-e4a8c418cf4b", 
            "3.25.7",
            "101",
            debug: true
        );
        RuiXueSdk.SetLogEnable(true);
        PerformManceReport.PerformReport();
        OnBtnInit();
    }

    private static void ShowMsgBox(string str)
    {
        _instance._textMsg.text = str;
        _instance._msgBox.SetActive(true);
    }

    private void Start()
    {
        _btnInit.onClick.AddListener(OnBtnInit);
        _button_Addict.onClick.AddListener(OnBtnSetupAddictDelegate);
        _button_SensitiveInfo.onClick.AddListener(OnDisableReadSensitiveInfo);
        _button_PrivacyAgree.onClick.AddListener(OnSetPrivacyAgree);
        _button_IsAgreedPrivacy.onClick.AddListener(OnIsAgreedPrivacy);
        _Button_SubChannel.onClick.AddListener(OnSetSubChannelId);
        _Button_IRXRequest.onClick.AddListener(OnRXRequest);
        _Button_Language.onClick.AddListener(SetLanguage);
        _Button_ScreenCaptureDisable.onClick.AddListener(SetScreenCaptureDisable);
        _Button_SetCallBack.onClick.AddListener(SetRuiXueSdkCallback);
        _Button_ExitAPP.onClick.AddListener(ExitApp);
        _Button_getPromo.onClick.AddListener(getPromo);
        _Button_exchange.onClick.AddListener(exchange);
        _Button_customErrorMsg.onClick.AddListener(customErrorMsg);
        _Button_initError.onClick.AddListener(initError);
        _Button_checkQuickAp.onClick.AddListener(checkQuickAp);
        _Button_setPasswordStrength.onClick.AddListener(SetPasswordStrength);
        _Button_setPwdPattern.onClick.AddListener(setPwdPattern);
        _Button_submitChannelPayment?.onClick.AddListener(OnSubmitChannelPayment);
        _Button_checkUpdateApp?.onClick.AddListener(OnCheckUpdateApp);
    }

    private void OnBtnInit()
    {
        string cpId = "1000197";
        string channelId = "215";
        string productId = "198";
        List<string> list = new()
        {
            "https://winykn.jiaxiangyouxi.com"
        };

        RXSdkInitConfig rxSdkInitConfig = new RXSdkInitConfig
        {
            cpId = cpId,
            channelId = channelId,
            productId = productId,
            baseUrlList = list,
            isUseDNS = true,
            usePrivacy = false,
            autoInitThird = true,
            thirdSdkParams = new Dictionary<string, object>
            {
                ["ld_app_key"] = "8e0ec4a1f3e941bfbf5c7f6b483e79cf"
            }
        };

        // RuiXueSdk.Initialize(rxSdkInitConfig, InitResponseDelegate, InitErrorDelegate);

        RuiXueSdk.Initialize(cpId,productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
    }
    
    private void OnLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.LEIDIAN;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }

    private void InitResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"雷电渠道初始化成功: {data}");
        RuiXueSdk.InitThirdSdk(new Dictionary<string, object>
        {
            ["ld_app_key"] = "8e0ec4a1f3e941bfbf5c7f6b483e79cf"
        }, _ => ShowChannelSplash(new Dictionary<string, object>()), RequestErrorDelegate);
        OnLogin();
    }

    private void InitErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"雷电渠道初始化失败: {error}");
    }
    
    private void LoginResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"Login Response : {data}");
    }

    private void LoginErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"Login Error : {error}");
    }

    private void RequestResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestResponseDelegate: {data}");
        OnLogin();
    }

    private void RequestErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"RequestErrorDelegate: {error}");
    }
    
    private class AddictDelegate : IAntiAddictDelegate
    {
        public bool IsGaming()
        {
            LogUtil.Log("EventManager", "isGaming");
            return false;
        }

        public void AddictInfoUpdate(string json)
        {
            LogUtil.Log("EventManager", $"防沉迷: {json}");
        }

        public bool EnableCustomUI()
        {
            LogUtil.Log("EventManager", "enableCustomUI");
            return false;
        }
    }
    // todo 待测试
    private void OnBtnSetupAddictDelegate()
    {
        RuiXueSdk.SetupAddictDelegate(new AddictDelegate());
    }

    private void OnDisableReadSensitiveInfo()
    {
        RuiXueSdk.DisableReadSensitiveInfo(true);
    }

    public void OnIsAgreedPrivacy()
    {
        LogUtil.Log("EventManager", $"OnIsAgreedPrivacy: {RuiXueSdk.IsAgreedPrivacy()}");
    }

    public void OnPrivacyAgree(bool userClick)
    {
        LogUtil.Log("EventManager", $"userClick: {userClick}");
    }
    
    private void OnSetPrivacyAgree()
    {
        RuiXueSdk.SetPrivacyAgree(OnPrivacyAgree);
    }

    private void OnSetSubChannelId()
    {
        RuiXueSdk.SetSubChannelId("your dsfsafasfsadfa");
    }

    private void OnSetGameInfo()
    {
        RuiXueSdk.SetGameInfo("testrole", "testregion");
    }

    private void OnSearchGameAccount()
    {
        RuiXueSdk.SearchGameAccount(SearchGameAccountResponseDelegate, SearchGameAccountErrorDelegate);
    }

    public void OnCheckUpdateApp()
    {
        var games = new Dictionary<string, int>() { { "123", 123 } };
        var activities = new Dictionary<string, int>() { { "test", 123 } };
        RXVersionCheck.CheckUpdateApp("1.1.1", "0", "u3d", null, null,
            RequestResponseDelegate, RequestErrorDelegate);
    }

    private void OnBindAccount()
    {
        Dictionary<string, object> ext = new()
        {
            { "method", "facebook" },
            { "scene", "authorization" }
        };
        RuiXueSdk.BindAccount(ext, BindAccountResponseDelegate, BindAccountErrorDelegate);
    }

    private void OnStartIifaaRealAuth()
    {
        RuiXueSdk.GetIIFAARedirectURL("游戏名称", "yourapp://iifaa", data =>
        {
            string url = GetIifaaUrl(data);
            if (string.IsNullOrEmpty(url))
            {
                LogUtil.Log("EventManager", $"IIFAA redirect url is empty: {data}");
                return;
            }

            isIifaaRealAuthInProgress = true;
            Application.OpenURL(url);
        }, error => LogUtil.Log("EventManager", $"GetIIFAARedirectURL Error: {error}"));
    }

    private void OnApplicationFocus(bool hasFocus)
    {
        if (!hasFocus || !isIifaaRealAuthInProgress)
        {
            return;
        }

        RuiXueSdk.GetIIFAAResultWithRetryCount(3, data =>
        {
            isIifaaRealAuthInProgress = false;
            LogUtil.Log("EventManager", $"IIFAA Result: {data}");
        }, error =>
        {
            isIifaaRealAuthInProgress = false;
            LogUtil.Log("EventManager", $"IIFAA Result Error: {error}");
        });
    }

    private static string GetIifaaUrl(string data)
    {
        JObject json = JObject.Parse(data);
        return json["data"]?["url"]?.ToString();
    }

    // todo 待测试 成功回调
    private void OnRXRequest()
    {

        string api="v1/operationapi/legal";
        Dictionary<string,string> body = new()
        {
            { "channel_id", "100" },
            { "product_id", "1002" }
        };
        Dictionary<string,string> headers = new()
        {
            { "headers", "headers test" }
        };

        RuiXueSdk.CreateRequest(api, null, body, HttpMethod.GET, false, RequestResponseDelegate, RequestErrorDelegate);
    }

    private void SetLanguage()
    {
        RuiXueSdk.SetLanguage("en");
    }

    private void SetScreenCaptureDisable()
    {
        RuiXueSdk.SetScreenCaptureDisable(true);
    }
    // todo 待测试
    private void SetRuiXueSdkCallback()
    {
        RuiXueSdk.SetSdkCallback(PublicDelegate, LogOut, SwitchAccountDelegate);
    }

    public void PublicDelegate(int type, string jsonDicData)
    {
        if (type == 10001)
        {
            /*
            RXFeedback.ReportFeedbackLog();
            */
        }

        LogUtil.Log("EventManager", $"type: {type}, jsonDicData: {jsonDicData}");
    }

    private void LogOut(int code, string msg)
    {
        LogUtil.Log("EventManager", $"code: {code}, msg: {msg}");
    }

    public bool SwitchAccountDelegate(int code, string data)
    {
        LogUtil.Log("EventManager", $"code: {code}, data: {data}");
        return true;
    }

    public void ExitApp()
    {
        RuiXueSdk.ExitApp(ExitConfirm, ExitCancel);
        // RuiXueSdk.GetEmailList("442099939", MailResponseDelegate, MailErrorDelegate);// 442132347
        // RuiXueSdk.GetEmailDetail("442099939",546, MailResponseDelegate, MailErrorDelegate);
        // RuiXueSdk.GetEmailAward("442099939", 1, 546, MailResponseDelegate, MailErrorDelegate);
        // RuiXueSdk.DeleteEmail("442099939", 1, 546, MailResponseDelegate, MailErrorDelegate);
        // RuiXueSdk.GetAnnouncement(10, AnnounceResponseDelegate, AnnounceErrorDelegate);
        
        // String[] urlArr = {" https://pco-member-imgs.oss-cn-qingdao.aliyuncs.com/images/f3c2bd84-7a9f-743d-5fee-e46b4746f36a/notification/20190918/5d81e31bb44b9.png"};
        // string[] tagArr = {"1", "2"};
        // RuiXueSdk.FeedbackCreate("unity 测试unity 测试unity 测试unity 测试", urlArr, "13843267894", 
            // tagArr, FeedbackResponseDelegate, FeedbackErrorDelegate);
        
        // RuiXueSdk.GetFeedbackList(1, 10, 0, FeedbackResponseDelegate, FeedbackErrorDelegate);
        
        // RuiXueSdk.GetFeedbackDetail(201, FeedbackResponseDelegate, FeedbackErrorDelegate);
        
        // RuiXueSdk.FeedbackGetprop(201, FeedbackResponseDelegate, FeedbackErrorDelegate);
        
        // RuiXueSdk.GetPromoDisplayKEY(true, 
        //     PromoDisplayKEYkResponseDelegate, PromoDisplayKEYErrorDelegate);
        
        RuiXueSdk.GetDeviceCode(DeviceCodeResponseDelegate);
        RuiXueSdk.GetDistinctId(DistinctIdResponseDelegate);
        
    }
    
    private void DeviceCodeResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"GetDeviceCode: {data}");
    }

    private void DistinctIdResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"GetDistinctId: {data}");
    }
    
    private void PromoDisplayKEYkResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"GetPromoDisplayKEY: {data}");
    }

    private void PromoDisplayKEYErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"GetPromoDisplayKEY: {error}");
    }

    private void getPromo()
    {
        RuiXueSdk.GetPromoDisplayKEY(true, getPromoSuccessDelegate, getPromoErrorDelegate);
    }

    private void exchange()
    {
        RuiXueSdk.ExchangePromoCDKEY(cdKey:cdKey, FeedbackResponseDelegate, FeedbackErrorDelegate);
    }

    private void getPromoSuccessDelegate(string data)
    {
        LogUtil.Log("EventManager", $"getPromoSuccessDelegate: {data}");
        if (data != null && data.Length > 0)
        {
            JObject json = JObject.Parse(data);
            cdKey = json["data"]["promo_code"]?.ToString();
        }
    }
    
    private void getPromoErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"getPromoSuccessDelegate: {data}");
    }
    
    private void FeedbackResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"feedback: {data}");
    }

    private void FeedbackErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"feedback: {error}");
    }

    private void SearchGameAccountResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"SearchGameAccount: {data}");
    }

    private void SearchGameAccountErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"SearchGameAccount: {error}");
    }

    private void BindAccountResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"BindAccount: {data}");
    }

    private void BindAccountErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"BindAccount: {error}");
    }
    
    private void MailResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"mail: {data}");
    }

    private void MailErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"mail: {error}");
    }
    
    private void AnnounceResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"Announce: {data}");
    }

    private void AnnounceErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"Announce: {error}");
    }

    private void ExitConfirm(string res)
    {
        LogUtil.Log("EventManager", $" ExitApp res: {res}");
    }

    private void ExitCancel()
    {
        LogUtil.Log("EventManager", $" ExitCancel");
    }

    private void customErrorMsg()
    {
        Dictionary<string,string> zhDic = new()
        {
            { "3001", "错误码信息1" },
            { "3002", "错误码信息2" },
            { "default","测试66666  $msg$ $code$ $thirdcode$ $thirdmsg$"}
        };
        Dictionary<string,string> enDic = new()
        {
            { "3001", "error1" },
            { "3002", "error2" },
            { "default","测试77777  $msg$ $code$ $thirdcode$ $thirdmsg$"}
        };
        Dictionary<string, object> errorDic = new();
        errorDic.Add("zh",zhDic);
        errorDic.Add("en",enDic);
        
        RuiXueSdk.configErrorMsg(errorDic);
    }

    private void initError()
    {
        // string cpId = "114";
        // string channelId = "33333333";
        // string productId = "33333333332322222";
        // List<string> list = new()
        // {
        //     "wwwwwww"
        // };
        //
        // RuiXueSdk.Initialize(cpId,productId, channelId, list, LoginResponseDelegate, LoginErrorDelegate);
        
        LogUtil.Log("SetPasswordStrength", logStr:"SetPasswordStrength");
        RuiXueSdk.SetPasswordStrength(RXPasswordStrength.Average);
    }

    private void checkQuickAp()
    {
        RuiXueSdk.SetArea("JP");
        // RuiXueSdk.SetPwdPattern("");
        // RuiXueSdk.CheckQuickAp(CheckQuickApResponseDelegate, CheckQuickApErrorDelegate);
    }
    
    private void CheckQuickApResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"Check Quick Ap: {data}");
    }

    private void CheckQuickApErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"Check Quick Ap: {error}");
    }

    public void OnSubmitChannelPayment()
    {
        // 单位：分。建议在服务端确认到账后调用，用于渠道合规充值金额上报。
        RuiXueSdk.SubmitChannelPayment(100, SubmitChannelPaymentResponseDelegate, SubmitChannelPaymentErrorDelegate);
    }

    [ContextMenu("渠道示例/初始化百度并展示闪屏")]
    public void OnInitBaiduChannel()
    {
        // if (string.IsNullOrWhiteSpace(baiduAppId) || string.IsNullOrWhiteSpace(baiduAppKey))
        // {
        //     Debug.LogError("请先在 Inspector 中配置百度 appid/appkey。");
        //     return;
        // }

        RuiXueSdk.InitThirdSdk(new Dictionary<string, object>
        {
            ["appid"] = "123175256",
            ["appkey"] = "mLhd8AGHGDlF0ALlqaAcfGCULQjufOF9"
        }, _ => ShowChannelSplash(new Dictionary<string, object>()), RequestErrorDelegate);
    }

    [ContextMenu("渠道示例/初始化 MuMu 并展示闪屏")]
    public void OnInitMumuChannel()
    {
        RuiXueSdk.InitThirdSdk(new Dictionary<string, object>
        {
            ["debugMode"] = Debug.isDebugBuild
        }, _ => ShowChannelSplash(new Dictionary<string, object>
        {
            ["splashType"] = mumuSplashType
        }), RequestErrorDelegate);
    }

    [ContextMenu("渠道示例/显示渠道浮窗")]
    public void OnShowChannelFloatView()
    {
        RuiXueSdk.InvokeChannelAction(RuiXueSdk.ChannelActionShowFloatView,
            new Dictionary<string, object>(), RequestResponseDelegate, RequestErrorDelegate);
    }

    [ContextMenu("渠道示例/隐藏渠道浮窗")]
    public void OnHideChannelFloatView()
    {
        RuiXueSdk.InvokeChannelAction(RuiXueSdk.ChannelActionHideFloatView,
            new Dictionary<string, object>(), RequestResponseDelegate, RequestErrorDelegate);
    }

    private void ShowChannelSplash(Dictionary<string, object> parameters)
    {
        RuiXueSdk.InvokeChannelAction(RuiXueSdk.ChannelActionShowSplash,
            parameters, RequestResponseDelegate, RequestErrorDelegate);
    }

    public void OpenChannelFunctions()
    {
        SceneManager.LoadScene("RuiXueChannelDemo");
    }

    private void SubmitChannelPaymentResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"SubmitChannelPayment: {data}");
    }

    private void SubmitChannelPaymentErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"SubmitChannelPayment Error: {error}");
    }

    private void SetPasswordStrength()
    {
        LogUtil.Log("SetPasswordStrength", logStr:"SetPasswordStrength");
        RuiXueSdk.SetPasswordStrength(RXPasswordStrength.Strong);
    }

    private void setPwdPattern()
    {
        RuiXueSdk.SetPwdPattern("");
    }
}
