using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using RuiXue.LoginUIOverSeas;
using RuiXue;
using RuiXue.Firebase;
using RuiXue.Adjust;

public class OverSeasUIDemo : MonoBehaviour
{
    [SerializeField] private Button _button_LoginUI;
    [SerializeField] private Button _button_syncAccounts;
    [SerializeField] private Button _button_FindPassWordUI;
    [SerializeField] private Button _button_DestroyAccount1;
    [SerializeField] private Button _button_DestroyAccount2;
    [SerializeField] private Button _button_ProtocolView;
    [SerializeField] private Button _button_realAuthUI;
    [SerializeField] private Button _Button_limitUI;
    [SerializeField] private Button _button_UserCenter;
    [SerializeField] private Button _Button_ApplyForDeregisterUI;
    [SerializeField] private Button _Button_showMailCenter;
    [SerializeField] private Button _Button_ShowAnnounceView;
    [SerializeField] private Button _Button_ShowUpdateAppView;
    [SerializeField] private Button _Button_ShowCheckUpdateAppView;
    [SerializeField] private Button _Button_ShowCreateFeedbackView;
    [SerializeField] private Button _Button_ShowFeedbackListView;
    [SerializeField] private Button _Button_bindEmail;
    [SerializeField] private Button _Button_bindPhone;

    [SerializeField] private Button _Button_FirebaseInit;
    [SerializeField] private Button _Button_FirebaseLogEvent;
    [SerializeField] private Button _Button_FirebaseUserProperty;
    [SerializeField] private Button _Button_FirebaseCrashLog;
    [SerializeField] private Button _Button_FirebaseRecordException;
    [SerializeField] private Button _Button_FirebaseFCM;

    [SerializeField] private Button _Button_AdjustInit;
    [SerializeField] private Button _Button_AdjustTrackEvent;
    [SerializeField] private Button _Button_AdjustResume;
    [SerializeField] private Button _Button_AdjustPause;
    [SerializeField] private Button _Button_AdjustAttribution;
    private void Awake()
    {
        Init();
        Dictionary<string, object> map = new()
        {
            { "clientId", "302429863905-5c237rh19tecnmu08p6e8p4jj6uhfsvv.apps.googleusercontent.com" },
            { "line_channel_id", "1660717706" }
        };

        RuiXueSdk.InitThirdSdk(map, InitThirdSdkResponseDelegate, InitThirdSdkErrorDelegate);
    }

    public void InitThirdSdkResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestResponseDelegate: {data}");
    }
    public void InitThirdSdkErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestErrorDelegate: {data}");
    }

    private void Init()
    {
        // string cpId = "120";
        // string channelId = "unity_test_overseas";
        // string productId = "unity_test_overseas";
        // List<string> list = new()
        // {
        //     "https://os-api-demo.ruixuecloud.com/"
        // };
        //
        // RuiXueSdk.Initialize(cpId,productId, channelId, list, LoginResponseDelegate, LoginErrorDelegate);
        
        // string cpId = "119";
        // string channelId = "iOSOS";
        // string productId = "SDKOS";
        // List<string> list = new()
        // {
        //     "https://os-api-test.ruixuecloud.com/"
        // };

        string cpId = "119";
        string channelId = "qq11";
        string productId = "000003";
        List<string> list = new()
        {
            "http://os-api-test.ruixueyun.com/"
        };
        
        // string cpId = "114";
        // string channelId = "unity_test";
        // string productId = "unity_test";
        // List<string> list = new()
        // {
        //     "https://cn-api-test.ruixueyun.com/"
        // };
        
        RuiXueSdk.Initialize(cpId, productId, channelId, list, InitThirdSdkResponseDelegate, InitThirdSdkErrorDelegate);
        
        // string cpId = "1000040";
        // string channelId = "1002";
        // string productId = "265";
        // List<string> list = new()
        // {
        //     "https://rxapi.fishinggamezone.com/"
        // };
        //
        // RuiXueSdk.Initialize(cpId, productId, channelId, list, InitThirdSdkResponseDelegate, InitThirdSdkErrorDelegate);
    }

    private void Start()
    {
        _button_LoginUI.onClick.AddListener(OnLoginUI);
        _button_syncAccounts.onClick.AddListener(OnSyncAccounts);
        _button_FindPassWordUI.onClick.AddListener(OnFindPassWordUI);
        _button_DestroyAccount1.onClick.AddListener(OnDestroyAccount1);
        _button_DestroyAccount2.onClick.AddListener(OnDestroyAccount2);
        _button_ProtocolView.onClick.AddListener(OnProtocolView);
        _button_realAuthUI.onClick.AddListener(OnRealAuthUI);
        _Button_limitUI.onClick.AddListener(LimitUI);
        _button_UserCenter.onClick.AddListener(OnUserCenterUI);
        _Button_ApplyForDeregisterUI.onClick.AddListener(OnApplyForDeregisterUI);
        _Button_showMailCenter.onClick.AddListener(showMailCenter);
        _Button_ShowAnnounceView.onClick.AddListener(ShowAnnounceView);
        _Button_ShowUpdateAppView.onClick.AddListener(ShowUpdateAppView);
        _Button_ShowCheckUpdateAppView.onClick.AddListener(ShowCheckUpdateAppView);
        _Button_ShowCreateFeedbackView.onClick.AddListener(ShowCreateFeedbackView);
        _Button_ShowFeedbackListView.onClick.AddListener(ShowFeedbackListView);
        _Button_bindEmail.onClick.AddListener(BindEmail);
        _Button_bindPhone.onClick.AddListener(BindPhone);

        _Button_FirebaseInit.onClick.AddListener(OnFirebaseInit);
        _Button_FirebaseLogEvent.onClick.AddListener(OnFirebaseLogEvent);
        _Button_FirebaseUserProperty.onClick.AddListener(OnFirebaseUserProperty);
        _Button_FirebaseCrashLog.onClick.AddListener(OnFirebaseCrashLog);
        _Button_FirebaseRecordException.onClick.AddListener(OnFirebaseRecordException);
        _Button_FirebaseFCM.onClick.AddListener(OnFirebaseFCM);

        _Button_AdjustInit.onClick.AddListener(OnAdjustInit);
        _Button_AdjustTrackEvent.onClick.AddListener(OnAdjustTrackEvent);
        _Button_AdjustResume.onClick.AddListener(OnAdjustResume);
        _Button_AdjustPause.onClick.AddListener(OnAdjustPause);
        _Button_AdjustAttribution.onClick.AddListener(OnAdjustAttribution);
    }

    public void OnLoginUI()
    {
        RXLoginUIOverSeas.LoginUI(GetLoginUIConfig(true, true, true, true), 
            LoginResponseDelegate, LoginErrorDelegate);
    }

    public void OnSyncAccounts()
    {
        List<Dictionary<string, string>> list = new List<Dictionary<string, string>>();
        Dictionary<string, string> map = new Dictionary<string, string>();
        map.Add("username", "username1");
        map.Add("password", "pwd111111!");
        list.Add(map);
        RXLoginUIOverSeas.SyncAccounts(list);
    }

    public void LoginResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestResponseDelegate: {data}");
    }
    public void LoginErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestErrorDelegate: {data}");
    }

    public LoginUIConfig GetLoginUIConfig(bool isCaptcha, bool isPhone, bool isQuick, bool withOther)
    {
        LoginUIConfig loginUIConfig = new()
        {
            needRealAuth = false,
            isHistoryViewEnable = isQuick,
            forgotUrl = "https://rxapi.tongitstara.com/static/passport/#/user/forgetpassword",
            loginViewType = 1,
            logoImage = LoadImage(),
            keyboardType = isPhone ? 2 : 1
        };

        List<string> privacieTitles = new List<string>
        {
            "用户1",
            "隐私2",
            "儿童3"
        };
        loginUIConfig.privacieTitles = privacieTitles;

        List<string> privacies = new List<string>
        {
            "http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/100/00001",
            "https://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh",
            "http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms3333"
        };
        loginUIConfig.privacies = privacies;
        if (withOther)
        {
            List<string> loginTypes = new List<string>
            {
                LoginMethod.FaceBook,
                LoginMethod.Google,
                LoginMethod.Line,
                LoginMethod.Guest,
                LoginMethod.Username
            };
            loginUIConfig.loginTypes = loginTypes;
        }
        return loginUIConfig;
    }

    public void OnFindPassWordUI()
    {
        FindPasswordUIConfig findPasswordUIConfig = new FindPasswordUIConfig
        {
            username = "18143088888",
            password_hint = "请输入密码（4-12位字母或数字）",
            account_type = 2
        };

        RXLoginUIOverSeas.FindPasswordUI(findPasswordUIConfig, FindPassResponseDelegate, FindPassErrorDelegate);
    }

    public void FindPassResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"FindPassWord RequestResponseDelegate: {data}");
    }
    public void FindPassErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"FindPassWord RequestErrorDelegate: {data}");
    }

    public void OnDestroyAccount1()
    {
        LogUtil.Log("EventManager", "OverSeasUI OnDestroyAccount1 clicked");
        Debug.Log("[OverSeasUI] OnDestroyAccount1 clicked");
        RXLoginUIOverSeas.DestroyAccountStatusView(true, DestroyAccountResponseDelegate, DestroyAccountErrorDelegate, new RequestExtDelegates());
    }

    public void OnDestroyAccount2()
    {
        LogUtil.Log("EventManager", "OverSeasUI OnDestroyAccount2 clicked");
        Debug.Log("[OverSeasUI] OnDestroyAccount2 clicked");
        RXLoginUIOverSeas.DestroyAccountStatusView("知道了", DestroyAccountResponseDelegate, DestroyAccountErrorDelegate, new RequestExtDelegates());
    }

    public void DestroyAccountResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"DestroyAccount RequestResponseDelegate: {data}");
        Debug.Log($"[OverSeasUI] DestroyAccount RequestResponseDelegate: {data}");
    }
    public void DestroyAccountErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"DestroyAccount RequestErrorDelegate: {data}");
        Debug.LogError($"[OverSeasUI] DestroyAccount RequestErrorDelegate: {data}");
    }
    public void OnProtocolView()
    {
        List<string> list = new List<string>();
        list.Add("00001");
        list.Add("00002");
        RXLoginUIOverSeas.ProtocolView("00001", list);
    }

    public void OnRealAuthUI()
    {
        RXLoginUIOverSeas.RealAuthUI(true, RealAuthUIResponseDelegate, RealAuthUIErrorDelegate);
    }

    public void RealAuthUIResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RealAuth RequestResponseDelegate: {data}");
    }
    public void RealAuthUIErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RealAuth RequestErrorDelegate: {data}");
    }
    public AndroidJavaObject RealAuthUIClickHandleDelegate(AndroidJavaObject param)
    {
        LogUtil.Log("EventManager", $"RealAuth RealAuthUIClickHandleDelegate");
        return param;
    }

    public void LimitUI()
    {
        RXLoginUIOverSeas.LimitUI("未成年人防沉迷提示","防沉迷内容说明", "按钮", LimitUIUIResponseDelegate, LimitUIUIErrorDelegate);
    }

    public void LimitUIUIResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"LimitUI RequestResponseDelegate: {data}");
    }
    public void LimitUIUIErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"LimitUI RequestErrorDelegate: {data}");
    }

    public void OnUserCenterUI()
    {
        UserCenterUIConfig userCenterUIConfig = new()
        {
            transmit_args = "透传参数",
            game_user_id = 1000,
            nickname = "用户昵称",
            head_img_url = "用户头像",
            queue_name = "default"
        };
        Dictionary<string, string[]> map = new()
        {
            { "btns", new string[] { "change_pwd", "acount_cancel", "privacy_policy", "real_name", "phone_management" } }
        };
        userCenterUIConfig.setConfigParams = map;
        userCenterUIConfig.webViewOnCloseDeletage = OnWebViewOClosed;
        RXLoginUIOverSeas.UserCenterUI(userCenterUIConfig, UserCenterUIResponseDelegate, UserCenterUIErrorDelegate);
    }

    public void OnWebViewOClosed()
    {
        LogUtil.Log("EventManager", "WebViewOnCloseListener 关闭");
    }

    public void UserCenterUIResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"UserCenterUI RequestResponseDelegate: {data}");
    }
    public void UserCenterUIErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"UserCenterUI RequestErrorDelegate: {data}");
    }

    public void OnApplyForDeregisterUI()
    {
        UserCenterUIConfig applyForDeregisterUIConfig = new()
        {
            transmit_args = "透传参数",
            game_user_id = 1000,
            nickname = "用户昵称",
            head_img_url = "用户头像",
            queue_name = "default"
        };
        
        RXLoginUIOverSeas.ApplyForDeregisterUI(applyForDeregisterUIConfig, ApplyForDeregisterUIResponseDelegate, ApplyForDeregisterUIErrorDelegate);
    }

    public void ApplyForDeregisterUIResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"ApplyForDeregisterUI RequestResponseDelegate: {data}");
    }
    public void ApplyForDeregisterUIErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"ApplyForDeregisterUI RequestErrorDelegate: {data}");
    }
    
    public void showMailCenter()
    {
        RXLoginUIOverSeas.ShowMailCenter("442099939");
    }

    public void ShowAnnounceView()
    {
        RXLoginUIOverSeas.ShowAnnounceView(100, Onlink, HsAnnounceUI);
    }

    /// <summary>
    /// 返回图片配置link或者url
    /// </summary>
    /// <param name="data"></param>
    public void Onlink(string data)
    {
        LogUtil.Log("EventManager", "Announce Onlink: " + data);
    }
    /// <summary>
    /// 当前UI是否显示了
    /// </summary>
    /// <param name="isHas"></param>
    public void HsAnnounceUI(bool isHas)
    {
        LogUtil.Log("EventManager", "Announce HsAnnounceUI: " + isHas);
    }
    /// <summary>
    /// 成功返回 版本检查数据
    /// </summary>
    /// <param name="data"></param>
    public void AnnounceResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"UserCenterUI RequestResponseDelegate: {data}");
    }
    /// <summary>
    /// 失败返回 版本检查数据
    /// </summary>
    /// <param name="data"></param>
    public void AnnounceErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"UserCenterUI RequestErrorDelegate: {data}");
    }

    public void ShowUpdateAppView()
    {
        Dictionary<string, object> queryMap = new Dictionary<string, object>();
        queryMap.Add("format", "json");
        RXLoginUIOverSeas.ShowUpdateAppView("1.0.1", "150000", queryMap, true, Onlink, 
            HsAnnounceUI, AnnounceResponseDelegate, AnnounceErrorDelegate);
    }

    public void ShowCheckUpdateAppView()
    {
        RXLoginUIOverSeas.ShowCheckUpdateAppView("1.0.1", "150000", "js", null, true, 
            Onlink, HsAnnounceUI, AnnounceResponseDelegate, AnnounceErrorDelegate);
    }
    
    public void ShowCreateFeedbackView()
    {
        
    }

    public void ShowFeedbackListView()
    {
        
        
    }

    public void BindEmail()
    {
        RXLoginUIOverSeas.bindEmail(BindEmailResponseDelegate, BindEmailErrorDelegate);
    }
    
    public void BindEmailResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"BindEmail RequestResponseDelegate: {data}");
    }
    
    public void BindEmailErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"BindEmail RequestErrorDelegate: {data}");
    }

    public void BindPhone()
    {
        RXLoginUIOverSeas.bindPhone(BindPhoneResponseDelegate, BindPhoneErrorDelegate);
    }
    
    public void BindPhoneResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"BindEmail RequestResponseDelegate: {data}");
    }
    
    public void BindPhoneErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"BindEmail RequestErrorDelegate: {data}");
    }

    // ==================== Firebase ====================
    public void OnFirebaseInit()
    {
        LogUtil.Log("EventManager", "OnFirebaseInit");
        RXFirebase.InitFirebaseAnalytics();
    }

    public void OnFirebaseLogEvent()
    {
        Dictionary<string, object> dic = new();
        dic.Add(RxFirebaseAnalytics.Param.METHOD, "sign");
        RXFirebase.LogEvent(RxFirebaseAnalytics.Event.SIGN_UP, dic);
    }

    public void OnFirebaseUserProperty()
    {
        RXFirebase.SetUserProperty("favorite_food", "food");
    }

    public void OnFirebaseCrashLog()
    {
        RXFirebase.Log("OverSeasUIDemo firebase crashlytics log");
    }

    public void OnFirebaseRecordException()
    {
        RXFirebase.RecordException(new Exception("OverSeasUIDemo test exception"));
    }

    public void OnFirebaseFCM()
    {
        RXFirebase.SetFCMCallBack(FirebaseMessageReceivedDelegate, FirebaseNewTokenDelegate);
    }

    public void FirebaseMessageReceivedDelegate(RemoteMessage message)
    {
        LogUtil.Log("EventManager", $"Firebase MessageReceived: {message.messageId}");
    }

    public void FirebaseNewTokenDelegate(string token)
    {
        LogUtil.Log("EventManager", $"Firebase NewToken: {token}");
    }

    // ==================== Adjust ====================
    public void OnAdjustInit()
    {
        string environment = RxAdjustConfig.ENVIRONMENT_SANDBOX;
        RxAdjustConfig config = new RxAdjustConfig("a7tay9toq29s", environment);
        config.needsCost = true;
        config.SetLogLevel(RxLogLevel.DEBUG);
        config.OnRxAttributionChangedDelegateListener = OnAdjustAttributionChanged;
        config.OnRxEventTrackingSucceededDelegateListener = OnAdjustEventTrackingSucceeded;
        config.OnRxEventTrackingFailedDelegateListener = OnAdjustEventTrackingFailed;
        config.OnRxSessionTrackingSucceededDelegateListener = OnAdjustSessionTrackingSucceeded;
        config.OnRxSessionTrackingFailedDelegateListener = OnAdjustSessionTrackingFailed;
        config.OnRxDeeplinkDelegateResponseListener = OnAdjustDeeplink;
        RXAdjust.Init(config);
    }

    public void OnAdjustTrackEvent()
    {
        RxAdjustEvent rxAdjustEvent = new RxAdjustEvent("36il0v");
        RXAdjust.TrackEvent(rxAdjustEvent);
    }

    public void OnAdjustResume()
    {
        RXAdjust.OnResume();
    }

    public void OnAdjustPause()
    {
        RXAdjust.OnPause();
    }

    public void OnAdjustAttribution()
    {
        LogUtil.Log("EventManager", $"Adjust adid: {RXAdjust.GetAttribution().adid}");
    }

    public void OnAdjustAttributionChanged(RxAdjustAttribution attribution)
    {
        LogUtil.Log("EventManager", $"Adjust attribution changed: {attribution.adid}");
    }

    public void OnAdjustEventTrackingSucceeded(RxAdjustEventSuccess data)
    {
        LogUtil.Log("EventManager", data.ToString());
    }

    public void OnAdjustEventTrackingFailed(RxAdjustEventFailure data)
    {
        LogUtil.Log("EventManager", data.ToString());
    }

    public void OnAdjustSessionTrackingSucceeded(RxAdjustSessionSuccess data)
    {
        LogUtil.Log("EventManager", data.ToString());
    }

    public void OnAdjustSessionTrackingFailed(RxAdjustSessionFailure data)
    {
        LogUtil.Log("EventManager", data.ToString());
    }

    public bool OnAdjustDeeplink(string deeplink)
    {
        LogUtil.Log("EventManager", $"Adjust deeplink: {deeplink}");
        return true;
    }

    public byte[] LoadImage()
    {
        Texture2D image = (Texture2D) Resources.Load("logo");

        Texture2D decopmpresseTex = image.DeCompress();

        return decopmpresseTex.EncodeToPNG();
    }
}
