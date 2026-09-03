using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using RuiXue;
using RuiXue.LoginUI;
using UnityEngine.Serialization;

public class RuiXueUIDemo : MonoBehaviour
{
    [SerializeField] private Button _button_OAuthLogin;
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
    [SerializeField] private Button _Button_BindPhone;
    private void Awake()
    {
        Init();
    }

    private void Init()
    {
        // string cpId = "1000197";
        // string channelId = "101";
        // string productId = "198";
        // List<string> list = new()
        // {
        //     "https://winykn.jiaxiangyouxi.com"
        // };

        string cpId = "114";
        string channelId = "iOS";
        string productId = "1002";
        List<string> list = new()
        {
            "http://cn-api-test.ruixueyun.com/"
        };

        RuiXueSdk.Initialize(cpId,productId, channelId, list, LoginResponseDelegate, LoginErrorDelegate);
    }

    private void Start()
    {
        _button_OAuthLogin.onClick.AddListener(OnShowOAuthLoginUI);
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
        _Button_BindPhone.onClick.AddListener(BindPhone);
    }

    public void OnShowOAuthLoginUI()
    {
        RXLoginUI.ShowOAuthLoginUI(GetLoginUIConfig(true, true, true, true), LoginResponseDelegate, LoginErrorDelegate);
    }

    public void OnLoginUI()
    {
        RXLoginUI.LoginUI(GetLoginUIConfig(true, true, true, true), LoginResponseDelegate, LoginErrorDelegate);
    }

    public void OnSyncAccounts()
    {
        List<Dictionary<string, string>> list = new List<Dictionary<string, string>>();
        Dictionary<string, string> map = new Dictionary<string, string>();
        map.Add("username", "username1");
        map.Add("password", "pwd111111!");
        list.Add(map);
        RXLoginUI.SyncAccounts(list);
    }

    public void LoginResponseDelegate(string data)
    {
        Debug.Log($"[RuiXueUIDemo] 登录成功回调: {data}");
        LogUtil.Log("EventManager", $"RequestResponseDelegate: {data}");
    }
    public void LoginErrorDelegate(string data)
    {
        Debug.LogError($"[RuiXueUIDemo] 登录失败回调: {data}");
        LogUtil.Log("EventManager", $"RequestErrorDelegate: {data}");
    }
    
    // public AndroidJavaObject LoginClickHandleDelegate(AndroidJavaObject param)
    // {
    //         string method = JavaHashMapExtensionMethod.Get<string>(param, "method");
    //
    //         AndroidJavaObject loginMethod = JavaHashMapExtensionMethod.CreateJavaHashMap();
    //         // 微信
    //         AndroidJavaObject wechatMap = JavaHashMapExtensionMethod.CreateJavaHashMap();
    //         wechatMap.Put("appid", "wxd9cba83a0a1ef20d");
    //         loginMethod.Put(LoginMethod.Wechat, wechatMap);
    //         // 阿里一键登录
    //         AndroidJavaObject aliMap = JavaHashMapExtensionMethod.CreateJavaHashMap();
    //         aliMap.Put("alikey", "rPTnFy5eAxZTuLVBuur5JXDluwkT7B9jyypi1NselETj6YyYHJuhhKjBtqm05q2t83HyqD2ybRT8U9qGU1eb2MRsQuWsEor1H2Z/K7ha9j+v3UF//lQnZfksSFZoSrRi80jIEgYeqUSK0RhCkkPA3i4j+UR1WR6P7sndv20K6fw/HU66L7s4u2ry3dcb+GDnPylZ9ixx2QWnYXN4ReDxZLlMSpzZEpaj7/nZ1LwEzZ8JRyV1PjzT+N6UwcgnvQyOaq9IskxjQYdLqeZOCMLlM4Lemo32iwtT/2bZzUzkZYQRf8XHH90YYw==");
    //         loginMethod.Put(LoginMethod.QuickPhone, aliMap);
    //         // 判断当前用户选择登录方式，存入参数
    //         if (loginMethod.ContainsKey(method))
    //         {
    //             if (param.ContainsKey("ext"))
    //             {
    //                 AndroidJavaObject pa = JavaHashMapExtensionMethod.Get<AndroidJavaObject>(param, "ext");
    //                 pa.PutAll(JavaHashMapExtensionMethod.Get<AndroidJavaObject>(loginMethod, method));
    //             }else 
    //             {
    //                 param.Put("ext", JavaHashMapExtensionMethod.Get<AndroidJavaObject>(loginMethod, method));
    //             }
    //         }
    //         return param;
    // }

    public LoginUIConfig GetLoginUIConfig(bool isCaptcha, bool isPhone, bool isQuick, bool withOther)
    {
        LoginUIConfig loginUIConfig = new LoginUIConfig();
        loginUIConfig.forgotUrl = "https://rxapi.tongitstara.com/static/passport/#/user/forgetpassword";
        loginUIConfig.loginViewType = 0;
        loginUIConfig.logoImage = LoadImage();
        loginUIConfig.keyboardType = isPhone ? 2 : 1;

        List<string> privacieTitles = new List<string>();
        privacieTitles.Add("用户协议");
        privacieTitles.Add("隐私协议");
        privacieTitles.Add("儿童隐私");
        loginUIConfig.privacieTitles = privacieTitles;

        List<string> privacies = new List<string>();
        privacies.Add("http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/100/00001");
        privacies.Add("https://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/ccc/jkldajfljalsdfj/00001?lang=zh");
        privacies.Add("http://rxapi.jilinhaiqi.com/static/landing/#/v1/legal/terms/100/00003");
        loginUIConfig.privacies = privacies;
        
        if (withOther)
        {
            List<string> loginTypes = new List<string>();
            loginTypes.Add(LoginMethod.Wechat);
            loginTypes.Add(LoginMethod.Guest);
            loginTypes.Add(LoginMethod.Username);
            loginTypes.Add(LoginMethod.CaptchaCode);
            loginTypes.Add(LoginMethod.QuickPhone);
            loginTypes.Add(LoginMethod.DouYin);
            loginUIConfig.loginTypes = loginTypes;
        }

        Dictionary<string, object> ext = new Dictionary<string, object>();
        
        // 覆盖自定义参数
        Dictionary<string, object> custom = new Dictionary<string, object>();
        custom.Add("appid", "wxd9cba83a0a1ef20d");
        custom.Add("alikey", "rPTnFy5eAxZTuLVBuur5JXDluwkT7B9jyypi1NselETj6YyYHJuhhKjBtqm05q2t83HyqD2ybRT8U9qGU1eb2MRsQuWsEor1H2Z/K7ha9j+v3UF//lQnZfksSFZoSrRi80jIEgYeqUSK0RhCkkPA3i4j+UR1WR6P7sndv20K6fw/HU66L7s4u2ry3dcb+GDnPylZ9ixx2QWnYXN4ReDxZLlMSpzZEpaj7/nZ1LwEzZ8JRyV1PjzT+N6UwcgnvQyOaq9IskxjQYdLqeZOCMLlM4Lemo32iwtT/2bZzUzkZYQRf8XHH90YYw==");
        ext.Add("ext", custom);
        loginUIConfig.customParams = ext;
        
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

        RXLoginUI.FindPasswordUI(findPasswordUIConfig, FindPassResponseDelegate, FindPassErrorDelegate);
    }

    public void FindPassResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"FindPassWord RequestResponseDelegate: {data}");
    }
    public void FindPassErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"FindPassWord RequestErrorDelegate: {data}");
    }
    // public AndroidJavaObject FindPassClickHandleDelegate(AndroidJavaObject param)
    // {
    //     string password = JavaHashMapExtensionMethod.Get<string>(param, "password");
    //     if (password != null && password.Length < 4)
    //     {
    //         param.Put("break", true); // //用于中断后续请求操作。 中断后不再执行后续回调或提示
    //     }
    //     return param;
    // }

    public void OnDestroyAccount1()
    {
        RXLoginUI.DestroyAccountStatusView(true, DestroyAccountResponseDelegate, DestroyAccountErrorDelegate, new RequestExtDelegates());
    }

    public void OnDestroyAccount2()
    {
        RXLoginUI.DestroyAccountStatusView("知道了", DestroyAccountResponseDelegate, DestroyAccountErrorDelegate, new RequestExtDelegates());
    }

    public void DestroyAccountResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"DestroyAccount RequestResponseDelegate: {data}");
    }
    public void DestroyAccountErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"DestroyAccount RequestErrorDelegate: {data}");
    }
    public void OnProtocolView()
    {
        List<string> list = new List<string>();
        list.Add("00001");
        list.Add("00002");
        RXLoginUI.ProtocolView("00001", list);
    }

    public void OnRealAuthUI()
    {
        RXLoginUI.RealAuthUI(RealAuthUIResponseDelegate, RealAuthUIErrorDelegate);
    }

    public void RealAuthUIResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RealAuth RequestResponseDelegate: {data}");
    }
    public void RealAuthUIErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RealAuth RequestErrorDelegate: {data}");
    }
    
    #if UNITY_ANDROID
    public AndroidJavaObject RealAuthUIClickHandleDelegate(AndroidJavaObject param)
    {
        LogUtil.Log("EventManager", $"RealAuth RealAuthUIClickHandleDelegate");
        return param;
    }
    #endif

    public void LimitUI()
    {
        RXLoginUI.LimitUI("未成年人防沉迷提示","防沉迷内容说明", "按钮", LimitUIUIResponseDelegate, LimitUIUIErrorDelegate);
    }

    public void LimitUIUIResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"LimitUI RequestResponseDelegate: {data}");
    }
    public void LimitUIUIErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"LimitUI RequestErrorDelegate: {data}");
    }
    #if UNITY_ANDROID
    public AndroidJavaObject LimitUIUIClickHandleDelegate(AndroidJavaObject param)
    {
        LogUtil.Log("EventManager", $"LimitUI RealAuthUIClickHandleDelegate");
        return param;
    }
    #endif

    public void LimitUICallBackIOS()
    {
        Debug.Log("LimitUICallBackIOS");
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
        userCenterUIConfig.webViewOnCloseDeletage = OnWebViewClosed;
        
        RXLoginUI.UserCenterUI(userCenterUIConfig, UserCenterUIResponseDelegate, UserCenterUIErrorDelegate);
    }
    
    public void OnWebViewClosed()
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
    #if UNITY_ANDROID
    public AndroidJavaObject UserCenterUIClickHandleDelegate(AndroidJavaObject param)
    {
        LogUtil.Log("EventManager", $"UserCenterUI RealAuthUIClickHandleDelegate");
        return param;
    }
    #endif

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
        
        RXLoginUI.ApplyForDeregisterUI(applyForDeregisterUIConfig, ApplyForDeregisterUIResponseDelegate, ApplyForDeregisterUIErrorDelegate);
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
        RXLoginUI.ShowMailCenter("442099939");//Android:442132347  iOS:442099939
    }

    public void ShowAnnounceView()
    {
        RXLoginUI.ShowAnnounceView(100, Onlink, HsAnnounceUI);
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
        RXLoginUI.ShowUpdateAppView("1.0.1", "150000", queryMap, true, Onlink, 
            HsAnnounceUI, AnnounceResponseDelegate, AnnounceErrorDelegate);
    }

    public void ShowCheckUpdateAppView()
    {
        RXLoginUI.ShowCheckUpdateAppView("1.0.0", "150000", "js", null, true, 
            Onlink, HsAnnounceUI, AnnounceResponseDelegate, AnnounceErrorDelegate);
    }

    public void ShowCreateFeedbackView()
    {
        
    }

    public void ShowFeedbackListView()
    {
        
    }

    public void BindPhone()
    {
        RXLoginUI.bindPhone(LoginResponseDelegate, LoginErrorDelegate);
    }

    #if UNITY_ANDROID
    public AndroidJavaObject ApplyForDeregisterUIClickHandleDelegate(AndroidJavaObject param)
    {
        LogUtil.Log("EventManager", $"ApplyForDeregisterUI RealAuthUIClickHandleDelegate");
        return param;
    }
    #endif

    public byte[] LoadImage()
    {
        Texture2D image = (Texture2D) Resources.Load("logo");

        Texture2D decopmpresseTex = image.DeCompress();

        return decopmpresseTex.EncodeToPNG();
    }

    // Start is called before the first frame update


}
