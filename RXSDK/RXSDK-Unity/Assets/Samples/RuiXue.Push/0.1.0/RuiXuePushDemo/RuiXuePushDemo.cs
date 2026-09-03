using System.Collections.Generic;
using RuiXue;
using RuiXue.Login;
using RuiXue.Push;
using UnityEngine;
using UnityEngine.UI;

public class RuiXuePushDemo : MonoBehaviour
{
    [SerializeField] private Button _Button_initPush;
    [SerializeField] private Button _Button_registerToken;
    [SerializeField] private Button _Button_unRegisterToken;
    [SerializeField] private Button _Button_getDeviceToken;
    [SerializeField] private Button _Button_isSupport;
    [SerializeField] private Button _Button_getBrandName;
    [SerializeField] private Button _Button_bindAlias;
    [SerializeField] private Button _Button_unBindAlias;

    [SerializeField] private Button _Button_Login;
    
    private void Awake()
    {
        LogUtil.Log("xuqiang-test", "unity - Awake");
        Init();
        
        OnSetPrivacyAgree();
        
        /*Dictionary<string, object> map = new()
        {
            { "appSecret", "01bc05dc742a4319bb2ac4c312b2a8a8" },
        };
        
        RuiXueSdk.InitThirdSdk(map, InitThirdSdkResponseDelegate, InitThirdSdkErrorDelegate);*/
    }
    
    public void InitThirdSdkResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestResponseDelegate: {data}");
    }
    public void InitThirdSdkErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestErrorDelegate: {data}");
    }
    
    /// <summary>
    /// Vivo登录
    /// </summary>
    private void VivoLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.Vivo;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    
    /// <summary>
    /// OPPO 登录
    /// </summary>
    private void OppoLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.Oppo;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    
    /// <summary>
    /// 小米登录
    /// </summary>
    private void MiLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.Mi;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    
    void Start()
    {
        LogUtil.Log("xuqiang-test", "unity - Start");
        _Button_initPush.onClick.AddListener(OnInitPush);
        _Button_registerToken.onClick.AddListener(OnRegisterToken);
        _Button_unRegisterToken.onClick.AddListener(OnUnRegisterToken);
        _Button_getDeviceToken.onClick.AddListener(OnGetDeviceToken);
        _Button_isSupport.onClick.AddListener(OnIsSupport);
        _Button_getBrandName.onClick.AddListener(OnGetBrandName);
        _Button_bindAlias.onClick.AddListener(OnBindAlias);
        _Button_unBindAlias.onClick.AddListener(OnUnBindAlias);
        
        _Button_Login.onClick.AddListener(MiLogin);
    }
    
    private void Init()
    {
        string cpId = "1000101";
        string channelId = "100";
        string productId = "1002";
        List<string> list = new()
        {
            "https://anhvcpo.weilekuiming.com"
        };
        
        RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
    }

    public void InitResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"InitResponseDelegate RequestResponseDelegate: {data}");
        
    }
    public void InitErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $" InitErrorDelegate RequestErrorDelegate: {data}");
    }
    
    private void OnSetPrivacyAgree()
    {
        RuiXueSdk.SetPrivacyAgree(OnPrivacyAgree);
    }
    
    public void OnPrivacyAgree(bool userClick)
    {
        LogUtil.Log("EventManager", $"userClick: {userClick}");
    }
    
    private void OnLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.Username;
        loginConfig.username = "xiaohai3333";
        loginConfig.password = "1122232wewe";
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }

    private void OnInitPush()
    {
        // 初始化
        RXPush.Init();
    }

    private void LoginResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"Login Response : {data}");
    }

    private void LoginErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"Login Error : {error}");
    }

    public void OnRegisterToken()
    {
        RXPush.RegisterToken();
    }

    public void OnUnRegisterToken()
    {
        RXPush.UnRegisterToken();
    }

    public void OnGetDeviceToken()
    {
       LogUtil.Log("EventManager",  "GetDeviceToken " + RXPush.GetDeviceToken());
    }

    public void OnIsSupport()
    {
        LogUtil.Log("EventManager",  "IsSupport " + RXPush.IsSupport());
    }

    public void OnGetBrandName()
    {
        LogUtil.Log("EventManager",  "GetBrandName " + RXPush.GetBrandName());
    }

    public void OnBindAlias()
    {
        RXPush.BindAlias("unity-test");
    }

    public void OnUnBindAlias()
    {
        RXPush.UnBindAlias("unity-test");
    }
}
