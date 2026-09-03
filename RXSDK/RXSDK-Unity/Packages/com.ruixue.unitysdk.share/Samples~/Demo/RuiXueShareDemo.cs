using System;
using System.Collections;
using System.Collections.Generic;
using RuiXue;
using RuiXue.Login;
using RuiXue.Share;
using UnityEngine;
using UnityEngine.UI;
using RuiXue.WeiXin;

public class RuiXueShareDemo : MonoBehaviour
{
    [SerializeField] private Button _Button_ShareSchedulingInit;
    [SerializeField] private Button _Button_GetShareScheduling;
    [SerializeField] private Button _Button_Share;
    [SerializeField] private Button _Button_ShareSchedulingReport;
    [SerializeField] private Button _Button_GetShortUrl;
    [SerializeField] private Button _Button_GetShareInfo;
    [SerializeField] private Button _Button_ShareCustom;
    
    private void Awake()
    {
        Init();
        OnSetPrivacyAgree();
        // DouYinH5Login();
        //OnLogin();
    }

    private void Start()
    {
        _Button_ShareSchedulingInit.onClick.AddListener(OnShareSchedulingInit);
        _Button_GetShareScheduling.onClick.AddListener(OnGetShareScheduling);
        _Button_Share.onClick.AddListener(WeixinShare);
        _Button_ShareSchedulingReport.onClick.AddListener(OnShareSchedulingReport);
        _Button_GetShortUrl.onClick.AddListener(OnGetShortUrl);
        _Button_GetShareInfo.onClick.AddListener(OnGetShareInfo);
        _Button_ShareCustom.onClick.AddListener(OnShareCustom);
    }
    

    private void Init()
    {
        // string cpId = "112";
        // string channelId = "123456789";
        // string productId = "123456789";
        // List<string> list = new()
        // {
        //     "https://cn-api-demo.ruixuecloud.com/"
        // };
        //
        // RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
        
        string cpId = "114";
        string channelId = "unity_test";
        string productId = "unity_test";
        List<string> list = new()
        {
            "https://cn-api-test.ruixuecloud.com/"
        };
        
        RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
        
        // string cpId = "119";
        // string channelId = "iOSOS";
        // string productId = "SDKOS";
        // List<string> list = new()
        // {
        //     "http://os-api-test.ruixuecloud.com"
        // };
        // RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
        
        // string cpId = "114";
        // string channelId = "iOS";
        // string productId = "1002";
        // List<string> list = new()
        // {
        //     "http://cn-api-test.ruixuecloud.com/"
        // };
        //
        // RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);

        // RXWeiXin.ConfigUniversalLink("https://open.weileapp.com/toolapi/");
        // RXWeiXin.ConfigUniversalLink("https://api.7nightapp.com/ulink/");
    }
    
    public void InitResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"InitResponseDelegate RequestResponseDelegate: {data}");
        ZaloLogin();
    
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
    
    private void DouYinH5Login()
    {
        
        LogUtil.Log("EventManager", "发起抖音H5登录");
        
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.DouYinH5;
        loginConfig.force = true;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);

    }
    
    private void GuestLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.Guest;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    
    public void ZaloLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Zalo;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate); 
    }
    
    public void tiktok()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Tiktok;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate); 
    }
    
    
    private void OnLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.Username;
        loginConfig.username = "xiaohai";
        loginConfig.password = "123123123";
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    
    private void CountLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.Username;
        loginConfig.username = "xuqiangtest1123";
        loginConfig.password = "ruixue@12345678";
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

    public void OnShareSchedulingInit()
    {
        LogUtil.Log("EventManager", "OnShareSchedulingInit");
        string[] arr = { "maidian3"};
        RXShare.ShareSchedulingInit(arr, ShareInitResponseDelegate, ShareInitErrorDelegate);
    }

    public void Test()
    {
        LogUtil.Log("EventManager", "Test");
    }

    public void OnGetShareScheduling()
    {
        string[] arr = { "maidian3"};
        string scheduleStr = RXShare.GetShareScheduling(arr);
        LogUtil.Log("EventManager",$"GetShareScheduling RequestResponseDelegate: {scheduleStr}");
    }

    public void ShareInitResponseDelegate(string data)
    {
        LogUtil.Log("EventManager",$"ShareSchedulingInit RequestResponseDelegate: {data}");
    }
    public void ShareInitErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"ShareSchedulingInit RequestErrorDelegate: {data}");
    }

    public void OnGetShareInfo()
    {
        RXShareConfig rxShareConfig = new RXShareConfig();
        rxShareConfig.platform = "wechat";
        rxShareConfig.func = "urltest";
        rxShareConfig.useShortUrl = true;
        rxShareConfig.auto_report = true;
        rxShareConfig.shareScene = 0;

        Dictionary<string, object> ext = new Dictionary<string, object>();
        ext.Add("test", "测试");
        rxShareConfig.ext = ext;
        
        Dictionary<string, object> properties = new Dictionary<string, object>();
        properties.Add("properties", "properties测试");
        rxShareConfig.properties = properties;
        RXShare.GetShareData(rxShareConfig, GetShareInfoResponseDelegate, GetShareInfoErrorDelegate);
    }

    public void OnShareCustom()
    {
        RXCustomShareConfig rxCustomShareConfig = new RXCustomShareConfig();
        rxCustomShareConfig.platform = "wechat";
        // rxCustomShareConfig.url = "http://www.baidu.com/url";
        rxCustomShareConfig.appid = "wx8755e7b80be19d33";
        rxCustomShareConfig.material_type = "text";
        rxCustomShareConfig.title = "分享标题";
        rxCustomShareConfig.content = "分享内容";
        rxCustomShareConfig.shareScene = 1;
        
        RXShare.ShareCustom(rxCustomShareConfig, GetShareInfoResponseDelegate, GetShareInfoErrorDelegate);

    }

    public void GetShareInfoResponseDelegate(string data)
    {
        LogUtil.Log("EventManager",$"ShareSchedulingInit RequestResponseDelegate: {data}");
    }
    public void GetShareInfoErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"ShareSchedulingInit RequestErrorDelegate: {data}");
    }

    public void DouyinShare()
    {
        RXShareConfig rxShareConfig = new RXShareConfig();
        rxShareConfig.func = "unity_test";
        rxShareConfig.platform = "wechat";
        rxShareConfig.read_cache = true;
        rxShareConfig.protocol_android = "android_protocal_test";
        rxShareConfig.protocol_ios = "ios_protocal_test";
        rxShareConfig.shareScene = 1;
        
        RXShare.Share(rxShareConfig, ShareResponseDelegate, ShareErrorDelegate);
    }

    /// <summary>
    /// 微信分享
    /// </summary>
    public void WeixinShare()
    {
        RXShareConfig rxShareConfig = new RXShareConfig();
        rxShareConfig.platform = "wechat";
        rxShareConfig.func = "urltest";
        rxShareConfig.useShortUrl = true;
        rxShareConfig.auto_report = true;
        rxShareConfig.shareScene = 0;

        Dictionary<string, object> ext = new Dictionary<string, object>();
        ext.Add("test", "测试");
        rxShareConfig.ext = ext;
        
        Dictionary<string, object> properties = new Dictionary<string, object>();
        properties.Add("properties", "properties测试");
        rxShareConfig.properties = properties;
        
        // rxShareConfig.channel = "invite";
        
        
        RXShare.Share(rxShareConfig, ShareResponseDelegate, ShareErrorDelegate);
        
    }
    
    /// <summary>
    /// 系统分享
    /// </summary>
    public void SystemShare()
    {
        RXShareConfig rxShareConfig = new RXShareConfig();
        // rxShareConfig.func = "unity_test";
        rxShareConfig.func = "sdk_chengjiu";
        rxShareConfig.platform = "system";
        rxShareConfig.read_cache = true;
        rxShareConfig.protocol_android = "android_protocal_test";
        rxShareConfig.protocol_ios = "ios_protocal_test";
        
        RXShare.Share(rxShareConfig, ShareResponseDelegate, ShareErrorDelegate);
    }
    
    /// <summary>
    /// FaceBook分享
    /// </summary>
    public void FaceBookShare()
    {
        RXShareConfig rxShareConfig = new RXShareConfig();
        // rxShareConfig.func = "reward_shen_jiang";
        rxShareConfig.func = "sunurl";
        rxShareConfig.platform = "facebook";
        rxShareConfig.read_cache = true;
        rxShareConfig.protocol_android = "android_protocal_test";
        rxShareConfig.protocol_ios = "ios_protocal_test";
        
        RXShare.Share(rxShareConfig, ShareResponseDelegate, ShareErrorDelegate);
    }
    
    /// <summary>
    /// Messenger 分享
    /// </summary>
    public void MessengerShare()
    {
        RXShareConfig rxShareConfig = new RXShareConfig();
        rxShareConfig.func = "reward_kill_boss";
        rxShareConfig.platform = "messenger";
        rxShareConfig.read_cache = true;
        rxShareConfig.protocol_android = "android_protocal_test";
        rxShareConfig.protocol_ios = "ios_protocal_test";
        
        RXShare.Share(rxShareConfig, ShareResponseDelegate, ShareErrorDelegate);
    }
    
    /// <summary>
    /// line 分享
    /// </summary>
    public void LineShare()
    {
        RXShareConfig rxShareConfig = new RXShareConfig();
        // rxShareConfig.func = "reward_kill_boss";
        rxShareConfig.func = "sunurl";
        rxShareConfig.platform = "line";
        // rxShareConfig.read_cache = true;
        // rxShareConfig.protocol_android = "android_protocal_test";
        // rxShareConfig.protocol_ios = "ios_protocal_test";
        RXShare.Share(rxShareConfig, ShareResponseDelegate, ShareErrorDelegate);
    }

    /// <summary>
    /// tiktok分享
    /// </summary>
    public void TiktokShare()
    {
        RXShareConfig rxShareConfig = new RXShareConfig();
        rxShareConfig.func = "sdk_chengjiu";
        rxShareConfig.platform = "tiktok";
        rxShareConfig.read_cache = true;
        rxShareConfig.protocol_android = "android_protocal_test";
        rxShareConfig.protocol_ios = "ios_protocal_test";
        RXShare.Share(rxShareConfig, ShareResponseDelegate, ShareErrorDelegate);
    }

    public void zalo()
    {
        RXShareConfig rxShareConfig = new RXShareConfig();
        rxShareConfig.func = "zalo";
        rxShareConfig.platform = "zalo";
        rxShareConfig.read_cache = true;
        rxShareConfig.protocol_android = "android_protocal_test";
        rxShareConfig.protocol_ios = "ios_protocal_test";
        RXShare.Share(rxShareConfig, ShareResponseDelegate, ShareErrorDelegate);
    }

    public void ShareResponseDelegate(string data)
    {
        LogUtil.Log("EventManager",$"ShareSchedulingInit RequestResponseDelegate: {data}");
    }
    public void ShareErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"ShareSchedulingInit RequestErrorDelegate: {data}");
    }

    public void OnShareSchedulingReport()
    {
        RXShare.ShareSchedulingReport("wake_game_honor_1", "wechat", "220101", true,
            "share", "", null, 
            ShareSchedulingReportResponseDelegate, ShareSchedulingReportErrorDelegate);
    }
    
    public void ShareSchedulingReportResponseDelegate(string data)
    {
        LogUtil.Log("EventManager",$"ShareSchedulingInit RequestResponseDelegate: {data}");
    }
    public void ShareSchedulingReportErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"ShareSchedulingInit RequestErrorDelegate: {data}");
    }

    public void OnGetShortUrl()
    {
        
        Dictionary<string, object> dic = new Dictionary<string, object>();
        dic.Add("url", "www.baidu.com");
        dic.Add("title", "getShortUrl 标题");
        dic.Add("content", "getShortUrl 内容");
        dic.Add("image", "https://rxfile-test.ruixuecloud.com/share/2024/07/06/1720252159611.png");
        Dictionary<string, object> ext = new Dictionary<string, object>();
        ext.Add("exttest", "测试。。。");
        dic.Add("ext", ext);
        
        RXShare.GetShortUrl(dic, GetShortUrlResponseDelegate, GetShortUrlErrorDelegate);
    }
    
    public void GetShortUrlResponseDelegate(string data)
    {
        LogUtil.Log("EventManager",$"ShareSchedulingInit RequestResponseDelegate: {data}");
    }
    public void GetShortUrlErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"ShareSchedulingInit RequestErrorDelegate: {data}");
    }

}
