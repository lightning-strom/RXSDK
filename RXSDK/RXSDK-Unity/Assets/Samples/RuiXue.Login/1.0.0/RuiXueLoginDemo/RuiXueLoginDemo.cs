using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Testtest;
using RuiXue;
using RuiXue.Login;
using RuiXue.Reddit;
using RuiXue.Google;
using RuiXue.Instagram;
using RuiXue.Performance;
using RuiXue.UWA;

public class RuiXueLoginDemo : MonoBehaviour
{
    // [SerializeField] private GameObject _msgBox;
    // [SerializeField] private Text _textMsg;
    // [SerializeField] private Button _btnMsgBoxOK;
    [SerializeField] private Button _Button_Register;
    [SerializeField] private Button _Button_Login;
    [SerializeField] private Button _Button_Deregister;
    [SerializeField] private Button _Button_deregisterCancel;
    [SerializeField] private Button _Button_SearchBindingAccounts;
    [SerializeField] private Button _Button_SendCaptcha;
    [SerializeField] private Button _Button_verifyCaptcha;
    [SerializeField] private Button _Button_BindEmail;
    [SerializeField] private Button _Button_UnBindEmail;
    [SerializeField] private Button _Button_BindPhone;
    [SerializeField] private Button _Button_UnBindPhone;
    [SerializeField] private Button _Button_ChangePhone;
    [SerializeField] private Button _Button_GetUserInfo;
    [SerializeField] private Button _Button_UpdateUserInfo;
    [SerializeField] private Button _Button_ChangePassword;
    [SerializeField] private Button _Button_ResetPassword;
    [SerializeField] private Button _Button_RealAuth;
    [SerializeField] private Button _Button_Logout;
    [SerializeField] private Button _Button_picCaptcha;
    

    // private static RuiXueLoginDemo _instance;
    
    private void Awake()
    {
        // _instance = this;
        // _msgBox.SetActive(false);
        // _btnMsgBoxOK.onClick.AddListener(() =>
        // {
        //     _msgBox.SetActive(false);
        // });
        Init();
        OnSetPrivacyAgree();
        RuiXueSdk.DisableReadSensitiveInfo(false);
        
        // Dictionary<string, object> map = new()
        // {
        //     { "appSecret", "01bc05dc742a4319bb2ac4c312b2a8a8" },
        //     { "appid", 18521139 },
        //     { "appkey", "19k9IesEC1jU0wsFRHFqe7WGDoZgRGS3" },
        // };

        Dictionary<string, object> map = new();
        map.Add("appSecret", "01bc05dc742a4319bb2ac4c312b2a8a8");
        
        /*map.Add("appid", 18521119);
        map.Add("appkey", "LxAvWcVW8pMWayzPN4cqryO9");*/
        
        map.Add("server_id", "6885");
        map.Add("server_name", "bilibili区");
        map.Add("merchant_id", "2402");
        /*map.Add("appid", "7713");*/
        map.Add("appkey", "a481e40a81eb4a25a53527f175de7ef1");
        
        /*map.Add("appid", "134794");*/
        
        map.Add("client_id", "ff95b16e1e0143af9a81c7751534df84");
        
        
        map.Add("clientId", "681389341105-1gjar2pgmg0vvlik0in4job178l0bamc.apps.googleusercontent.com");
        
        map.Add("line_channel_id", "1660717706");
        
        map.Add("reddit_clientid", "dmRjS23kxHeuXPSFeAJwrg");
        map.Add("reddit_redirecturi", "http://localhost");
        
        map.Add("ld_app_key", "82451108656044469d666b73573688c8");
        
        map.Add("honor_appid", "82451108656044469d666b73573688c8");
        map.Add("honor_cpid", "82451108656044469d666b73573688c8");
        
        
        RuiXueSdk.InitThirdSdk(map, InitThirdSdkResponseDelegate, InitThirdSdkErrorDelegate);
        
        RXInstagram.init("400197956108491","https://ruixue.com/instagram/oauth2");
        RXReddit.init("MjsG77lLx0ndS4u8JPjqCw","http://localhost");
    }
    
    public void InitThirdSdkResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"InitThirdSdkResponseDelegate: {data}");
    }
    public void InitThirdSdkErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"InitThirdSdkErrorDelegate: {data}");
    }


    private void Init()
    {
        string cpId = "1000215";
        string channelId = "2004";
        string productId = "109";
        List<string> list = new()
        {
            "https://i4ksyn.dummygameth.com/"
        };
        RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
        
        /*string cpId = "120";
        string channelId = "unity_test_overseas";
        string productId = "unity_test_overseas";
        List<string> list = new()
        {
            "https://os-api-demo.ruixuecloud.com/"
        };
        
        RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);*/
        
        /*string cpId = "1000005";
        string channelId = "100";
        string productId = "422";
        List<string> list = new()
        {
            "https://v063mk.weilemks.com/"
        }*/;
        
        // string cpId = "1000038";
        // string channelId = "300";
        // string productId = "264";
        // List<string> list = new()
        // {
        //     "https://yh9gc7be1n.hitoffapp.com/"
        // };
        //
        // RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
        
        // string cpId = "1000040";
        // string channelId = "10021";
        // string productId = "265";
        // List<string> list = new()
        // {
        //     "https://rxapi.fishinggamezone.com/"
        // };
        // RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
        
        // string cpId = "1000112";
        // string channelId = "1001";
        // string productId = "264";
        // List<string> list = new()
        // {
        //     "https://wygzt.homelandfishingarcade.com/"
        // };
        
        // string cpId = "112";
        // string channelId = "123456789";
        // string productId = "123456789";
        // List<string> list = new()
        // {
        //     "https://cn-api-demo.ruixuecloud.com/"
        // };
        
        RuiXueUWAGPM.StaticInit(
            "https://2uq9pq.pwypyq.com", 
            "7d979a9a-57c9-467e-ac67-e4a8c418cf4b", 
            "3.25.7",
            "101",
            debug: true
        );
        RuiXueSdk.SetLogEnable(true);
        PerformManceReport.PerformReport();
        
        // string cpId = "119";
        // string channelId = "iOSOS";
        // string productId = "SDKOS";
        // List<string> list = new()
        // {
        //     "http://os-api-test.ruixuecloud.com/"
        // };
        //
        // RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
    }

    public void InitResponseDelegate(string data)
    {
        LogUtil.Log("EventManager",$"RequestResponseDelegate: {data}");
    }
    public void InitErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestErrorDelegate: {data}");
    }
    
    public void OnPrivacyAgree(bool userClick)
    {
        LogUtil.Log("EventManager", $"userClick: {userClick}");
    }

    private void OnSetPrivacyAgree()
    {
        RuiXueSdk.SetPrivacyAgree(OnPrivacyAgree);
    }

    // private static void ShowMsgBox(string str)
    // {
    //     _instance._textMsg.text = str;
    //     _instance._msgBox.SetActive(true);
    // }

    private void Start()
    {
        _Button_Register.onClick.AddListener(OnRegister);
        _Button_Login.onClick.AddListener(OnLogin);
        _Button_Deregister.onClick.AddListener(OnDeregister);
        _Button_deregisterCancel.onClick.AddListener(OnDeregisterCancel);
        _Button_SearchBindingAccounts.onClick.AddListener(OnSearchBindingAccounts);
        _Button_SendCaptcha.onClick.AddListener(OnSendCaptcha);
        _Button_verifyCaptcha.onClick.AddListener(OnVerifyCaptcha);
        _Button_BindEmail.onClick.AddListener(OnBindEmail);
        _Button_UnBindEmail.onClick.AddListener(OnUnBindEmail);
        _Button_BindPhone.onClick.AddListener(OnBindPhone);
        _Button_UnBindPhone.onClick.AddListener(OnUnBindPhone);
        _Button_ChangePhone.onClick.AddListener(OnChangePhone);
        _Button_GetUserInfo.onClick.AddListener(OnGetUserInfoByField);
        _Button_UpdateUserInfo.onClick.AddListener(OnUpdateUserInfo);
        _Button_ChangePassword.onClick.AddListener(OnChangePassword);
        _Button_ResetPassword.onClick.AddListener(OnResetPassword);
        _Button_RealAuth.onClick.AddListener(OnRealAuth);
        _Button_picCaptcha.onClick.AddListener(OnPicCaptcha);
        _Button_Logout.onClick.AddListener(OnLogout);
    }

    private void OnRegister()
    {
        Dictionary<string, object> dic = new();
        dic.Add("nickname", "unity_test");
        dic.Add("avatarUrl", "www.baidu.com");
        dic.Add("sex", "1");
        RXLogin.Register("xiaohai", "123123123", "", dic, RegisterResponseDelegate, RegisterErrorDelegate);
    }

    private void RegisterResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"OnRegister Response : {data}");
    }

    private void RegisterErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"OnRegister Error : {error}");
    }

    private void OnLogin()
    {
        LogUtil.Log("EventManager", "点击登录");
        // AccountLogin();
        
        // DouYinH5Login();

        // ConfigAccountLogin();

        // RedditLogin();
        
        // appleLogin();

        // LeidianLogin();

        // Instagram();

        // HihonorLogin();

        GestLogin();

    }
    
    /// <summary>
    /// 二次登录
    /// </summary>
    private void SecondLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Username;
        loginConfig.loginOpenId =
            "3GRcankRaneQeA5aYNlWUWH8xADqfxiHNVG8Y34O0Be+CjiJ/S/YGgOn3oCI8rFOJ44TTtz68pu6Q9WyyYgjculMslxmRpfAdtre00nm7ryeLIOzw8g1lWhOILASrgTege0E97aYGhs+bVph/BwGyfBWgmdWkyaAo6YRHjj46RUVMxjHs2/y5UK9iTcdhIiSUkLXKcjhPH1DdPqGtqYrrOQYDqPng6fcaA6Sns9iltQM6RU8zoTBQ3zMo0Aju/m8/OvpMMbh0lvW/FwZO34Tu12vxSN7G8vtiQceXOlQ40n2ndLZT61Ee/KVxu4FmwejaVImV5KkVjXhs8IUKRofqYPagpGxzIE2VzCRIYh41lCVdkHmHlclGXevf+pO3ZQikjua75OBKDCGiAzJPw1DiNBs52FaYOfqiAElVZj61+yu1qieNssPdce0b5I4eXqMH/VvS9+sSpYjukG82UJxtL77lfrRZJhLvlo9yXFUxmqD6I+GhB1xwxdHP6FvkN4lyTI2AL5HXG0m/yiJ9QlGnNHq5++8Pkl77o8s7+iN4mNd+5mBVyOEY50oMBrsZE2hvM4dZtuWCN3eejmNEGP9Ju7GbJffVWP+zc2fWjnwICoRvMXLe5k2MOLC9Zgb5xRhwQ4sv/9Ek2q5muorEXHQ3BV8tO2mDZpYDMqmL7fZkEAnPxs2LOuUXQ07j3uGU0tbQc5b3rw+KtKv6gOISrSLoUHa0E6SZ2BPKPkYeRXYp/zYMRqO0IwKQYNOE3vkQmmBQg7qkhX1dEECte9sYSEnL+NcV2ewgyTtovaQZ6vSOB/pIWHDdBKt1AwsfM82QpE27ejh9HRt+73J7TTHnLbr7vtkL7961Bg1O3s0vNydsGpHwpSWfNUWw8Ye51Pz5byJwa8GGmZaZk90EoGxuLCIG5hIQ1HOWSsjdB5W6B2Us8vjUv0/wq2FLIMYdjj+IRaFcW96MzBMLpsyeXtLDreH7Q==";
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    /// <summary>
    /// 快速登录
    /// </summary>
    private void QuickphoneLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        Dictionary<string, object> ext = new();
        ext.Add("alikey", "rPTnFy5eAxZTuLVBuur5JXDluwkT7B9jyypi1NselETj6YyYHJuhhKjBtqm05q2t83HyqD2ybRT8U9qGU1eb2MRsQuWsEor1H2Z/K7ha9j+v3UF//lQnZfksSFZoSrRi80jIEgYeqUSK0RhCkkPA3i4j+UR1WR6P7sndv20K6fw/HU66L7s4u2ry3dcb+GDnPylZ9ixx2QWnYXN4ReDxZLlMSpzZEpaj7/nZ1LwEzZ8JRyV1PjzT+N6UwcgnvQyOaq9IskxjQYdLqeZOCMLlM4Lemo32iwtT/2bZzUzkZYQRf8XHH90YYw==");

        loginConfig.loginType = LoginMethod.QuickPhone;
        loginConfig.ext = ext;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
        
    }

    /// <summary>
    /// 账号密码登录
    /// </summary>
    private void AccountLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Username;
        loginConfig.username = "xiaohai";
        loginConfig.password = "123123123";
        
        
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);        
    }
    
    /// <summary>
    /// 微信登录
    /// </summary>
    private void WxLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        Dictionary<string, object> ext = new();
        ext.Add("appid", "wxd9cba83a0a1ef20d");
        loginConfig.ext = ext;
        loginConfig.loginType = LoginMethod.Wechat;
        
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    
    /// <summary>
    /// 苹果登录
    /// </summary>
    private void appleLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Apple;
        
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    
    /// <summary>
    /// 游客登录
    /// </summary>
    private void GestLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Guest;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    /// <summary>
    /// 验证码登录
    /// </summary>
    private void PhoneLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.CaptchaCode;
        loginConfig.username = "18243088053";
        loginConfig.captchaCode = "5362";
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    /// <summary>
    /// 华为登录
    /// </summary>
    private void HuaweiLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.HWJos;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    /// <summary>
    /// OPPO 登录
    /// </summary>
    private void OppoLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Oppo;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    /// <summary>
    /// Vivo登录
    /// </summary>
    private void VivoLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Vivo;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    /// <summary>
    /// 小米登录
    /// </summary>
    private void MiLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Mi;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    /// <summary>
    /// 抖音登录
    /// </summary>
    private void DouYinLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.DouYin;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }

    private void DouYinH5Login()
    {
        
        LogUtil.Log("EventManager", "发起抖音H5登录");
        
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.DouYinH5;
        loginConfig.force = true;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);

    }

    /// <summary>
    /// 百度登录
    /// </summary>
    private void BaiduLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.BaiduNet;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    /// <summary>
    /// 快手
    /// </summary>
    private void KuaiShowLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.KuaiShou;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    /// <summary>
    /// 应用宝 
    /// </summary>
    private void YingyongbaoLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.YSDK;
        
        // todo 等待账号
        Dictionary<string, object> ext = new();
        ext.Add("platform_type", 1);

        loginConfig.ext = ext;
        
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
        
    }
    /// <summary>
    /// Bilibili
    /// </summary>
    private void BilibiliLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.BiliBili;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
        
    }
    /// <summary>
    /// taptap登录
    /// </summary>
    // todo 等待账号
    private void Taptap()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.TapTap;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }

    /// <summary>
    /// 4399登录
    /// </summary>
    private void F4399Login()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod._4399;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    
    /// <summary>
    /// FaceBook 登录
    /// </summary>
    private void FaceBookLogin()
    {
        Dictionary<string, object> facebook = new();
        facebook.Add("app_associated_bussiness", true);
        Dictionary<string, object> ext = new();
        ext.Add("ext", facebook);
        
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.FaceBook;
        loginConfig.ext = ext;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    /// <summary>
    /// Line 登录
    /// </summary>
    private void LineLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Line;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    /// <summary>
    /// 邮箱登录
    /// </summary>
    public void MailLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.CaptchaCode;
        loginConfig.username = "xuqiangjiaohe@163.com";
        loginConfig.captchaCode = "2651";
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }

    public void LeidianLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.LEIDIAN;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);  
    }

    public void RedditLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Reddit;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }

    public void tiktok()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Tiktok;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate); 
    }
    
    public void zalo()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Zalo;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate); 
    }
    
    public void HihonorLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.HIHONOR;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate); 
    }
    
    public void Instagram()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Instagram;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate); 
    }

    private void LoginResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"Login Response : {data}");
    }

    private void LoginErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"Login Error : {error}");
    }

    private void OnDeregister()
    {

        RXDeregisterConfig deregisterConfig = new RXDeregisterConfig();
        deregisterConfig.idcard = "220281199103162215";
        deregisterConfig.realname = "徐强";
        deregisterConfig.cpdata = "111";
        Dictionary<string, object> dic = new Dictionary<string, object>();
        dic.Add("test", 111);
        deregisterConfig.thirdParams = dic;
        
        RXLogin.Deregister(deregisterConfig, DeregisterResponseDelegate, DeregisterErrorDelegate);
    }

    private void DeregisterResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"Deregister Response : {data}");
    }

    private void DeregisterErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"Deregister Error : {error}");
    }

    public void OnDeregisterCancel()
    {
        RXLogin.DeregisterCancel(DeregisterCancelResponseDelegate, DeregisterCancelErrorDelegate);
    }

    private void DeregisterCancelResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"OnDeregisterCancel Response : {data}");
    }

    private void DeregisterCancelErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"OnDeregisterCancel Error : {error}");
    }

    public void OnSearchBindingAccounts()
    {
        RXLogin.SearchBindingAccounts(SearchBindingResponseDelegate, SearchBindingErrorDelegate);
    }

    private void SearchBindingResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"SearchBindingAccounts Response : {data}");
    }

    private void SearchBindingErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"SearchBindingAccounts Error : {error}");
    }

    public void OnSendCaptcha()
    {
        RXLogin.SendCaptcha(CaptchaType.CaptchaType_email, "xuqiangjiaohe@163.com", "login",
             SendCaptchaResponseDelegate, SendCaptchaErrorDelegate);
    }

    private void SendCaptchaResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"OnSendCaptcha Response : {data}");
    }

    private void SendCaptchaErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"OnSendCaptcha Error : {error}");
    }

    public void OnVerifyCaptcha()
    {
        RXLogin.VerifyCaptcha(CaptchaType.CaptchaType_phone, "18243088053", "login", "1111", 
            VerifyCaptchaResponseDelegate, VerifyCaptchaErrorDelegate);
    }

    private void VerifyCaptchaResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"VerifyCaptcha Response : {data}");
    }

    private void VerifyCaptchaErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"VerifyCaptcha Error : {error}");
    }

    public void OnBindEmail()
    {
        RXLogin.BindEmail("xuqiangjiaohe@163.com", "1122232wewe", "1111", new Test(), 
            BindEmailResponseDelegate, BindEmailErrorDelegate);
    }

    private void BindEmailResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"BindEmail Response : {data}");
    }

    private void BindEmailErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"BindEmail Error : {error}");
    }

    public void OnUnBindEmail()
    {
        RXLogin.UnBindEmail("xuqiangjiaohe@163.com", "2323", UnBindEmailResponseDelegate, UnBindEmailErrorDelegate);
    }

    private void UnBindEmailResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"UnBindEmail Response : {data}");
    }

    private void UnBindEmailErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"UnBindEmail Error : {error}");
    }

    public void OnBindPhone()
    {
        RXLogin.BindPhone("18243088053", "1122232wewe", "222", new Test(), 
            OnBindPhoneResponseDelegate, OnBindPhoneErrorDelegate);
    }

    private void OnBindPhoneResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"BindPhone Response : {data}");
    }

    private void OnBindPhoneErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"BindPhone Error : {error}");
    }

    public void OnUnBindPhone()
    {
        RXLogin.UnBindPhone("18243088053",  "2442", UnBindPhoneResponseDelegate, UnBindPhoneErrorDelegate);
    }

    private void UnBindPhoneResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"UnBindPhone Response : {data}");
    }

    private void UnBindPhoneErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"UnBindPhone Error : {error}");
    }

    public void OnChangePhone()
    {
        RXLogin.ChangePhone("18243088053", "15128393723", "2344", new Test(), 
            ChangePhoneResponseDelegate, ChangePhoneErrorDelegate);
    }

    private void ChangePhoneResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"ChangePhone Response : {data}");
    }

    private void ChangePhoneErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"ChangePhone Error : {error}");
    }

    public void OnGetUserInfo()
    {
        RXLogin.GetUserInfo(GetUserInfoResponseDelegate, GetUserInfoErrorDelegate);
    }

    public void OnGetUserInfoByField()
    {
        Dictionary<string, object> param = new();
        param.Add( "account", new[] { "method" } );
        RXLogin.GetUserInfoByField(param, GetUserInfoByFieldResponseDelegate, GetUserInfoByFieldErrorDelegate);
    }

    private void GetUserInfoByFieldResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"GetUserInfoByField Response : {data}");
    }

    private void GetUserInfoByFieldErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"GetUserInfoByField Error : {error}");
    }

    private void GetUserInfoResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"GetUserInfo Response : {data}");
    }

    private void GetUserInfoErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"GetUserInfo Error : {error}");
    }

    public void OnUpdateUserInfo()
    {
        RXLogin.UpdateUserInfo("yyyyy", "www.baidu.com", "1", 1, UpdateUserInfoResponseDelegate, UpdateUserInfoErrorDelegate);
    }
    private void UpdateUserInfoResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"UpdateUserInfo Response : {data}");
    }

    private void UpdateUserInfoErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"UpdateUserInfo Error : {error}");
    }

    public void OnChangePassword()
    {
        RXLogin.ChangePassword("1122232wewe", "123123123", 
            ChangePasswordResponseDelegate, ChangePasswordErrorDelegate);
    }

    private void ChangePasswordResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"ChangePassword Response : {data}");
    }

    private void ChangePasswordErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"ChangePassword Error : {error}");
    }

    public void OnResetPassword()
    {
        RXLogin.ResetPassword("18243088053", "123123123", "1122", null, 
            ResetPasswordResponseDelegate, ResetPasswordErrorDelegate);
    }

    private void ResetPasswordResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"ResetPassword Response : {data}");
    }

    private void ResetPasswordErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"ResetPassword Error : {error}");
    }

    public void OnRealAuth()
    {
        RXLogin.RealAuth("徐大强", "22028119932234", RealAuthdResponseDelegate, RealAuthErrorDelegate);
    }

    private void RealAuthdResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RealAuth Response : {data}");
    }

    private void RealAuthErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"RealAuth Error : {error}");
    }

    private void OnPicCaptcha()
    {
        RuiXueSdk.ShowCaptchaVerifyUI("193923813", PicCaptchaResponseDelegate, PicCaptchaErrorDelegate);
    }

    private void PicCaptchaResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"Pic Captcha Response : {data}");
    }
    
    private void PicCaptchaErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"Pic Captcha Error : {error}");
    }

    public void OnLogout()
    {
        RXLogin.Logout(LogOutResponseDelegate, LogOutErrorDelegate);
    }

    private void LogOutResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", "LogOutResponseDelegate: data: {data}");
    }
    
    private void  LogOutErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"LogOutErrorDelegate : {error}");
    }
}
