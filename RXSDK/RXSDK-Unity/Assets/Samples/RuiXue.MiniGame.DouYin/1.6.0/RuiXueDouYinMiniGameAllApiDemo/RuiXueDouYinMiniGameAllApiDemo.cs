using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using RuiXue;
using RuiXue.Ad;
using RuiXue.Analysis;
using RuiXue.Login;
using RuiXue.Pay;
using RuiXue.Share;

#if UNITY_WEBGL && RUIXUE_MINIGAME_DOUYIN
using RuiXue.MiniGame.DouYin;
using TTSDK;
#endif

public class RuiXueDouYinMiniGameAllApiDemo : MonoBehaviour
{
    [Header("账号相关")]
    [SerializeField] private Button _Button_InitSDK;
    [SerializeField] private Button _Button_Login;
    [SerializeField] private Button _Button_SetLog;
   
    [Header("支付相关")]
    [SerializeField] private Button _Button_Pay;
    
    [Header("录屏相关")]
    [SerializeField] private Button _Button_StartRecord;
    [SerializeField] private Button _Button_StopRecord;
    
    [Header("分享相关")]
    [SerializeField] private Button _Button_Share;
    [SerializeField] private Button _Button_ShareVideo;
    [SerializeField] private Button _Button_ShareFriend;
    [SerializeField] private Button _Button_GetShareData;
    
    [Header("数据分析相关")]
    [SerializeField] private Button _Button_Track;
    [SerializeField] private Button _Button_SetPublicProperties;
    [SerializeField] private Button _Button_UpdatePublicProperties;
    [SerializeField] private Button _Button_DeletePublicProperties;

    [Header("广告相关")]
    [SerializeField] private Button _Button_RewardedAd;
    
    #if UNITY_WEBGL && RUIXUE_MINIGAME_DOUYIN

    private void Start()
    {
        _Button_InitSDK.onClick.AddListener(OnInitSDK);
        _Button_Login.onClick.AddListener(OnLogin);
        _Button_SetLog.onClick.AddListener(OnSetLog);
       
        _Button_Pay.onClick.AddListener(OnPay);
        
        _Button_StartRecord.onClick.AddListener(OnStartRecord);
        _Button_StopRecord.onClick.AddListener(OnStopRecord);
        
        _Button_Share.onClick.AddListener(OnShare);
        _Button_ShareVideo.onClick.AddListener(OnShareVideo);
        _Button_ShareFriend.onClick.AddListener(OnShareFriend);
        _Button_GetShareData.onClick.AddListener(OnGetShareData);
        
        _Button_Track.onClick.AddListener(OnTrack);
        _Button_SetPublicProperties.onClick.AddListener(OnSetPublicProperties);
        _Button_UpdatePublicProperties.onClick.AddListener(OnUpdatePublicProperties);
        _Button_DeletePublicProperties.onClick.AddListener(OnDeletePublicProperties);
        
        _Button_RewardedAd.onClick.AddListener(OnRewardedAd);
    }

    private void OnInitSDK()
    {
        string cpId = "1000198";
        string channelId = "861";
        string productId = "109";
        List<string> list = new()
        {
            "https://vidwfm.jiaxiangcheers.com/"
        };
        
        RuiXueSdk.Initialize(cpId, productId, channelId, list, OnResponse, OnError);
    }

    public void OnResponse(string data)
    {
        LogUtil.Log("RXDemo",$"Response: {data}");
    }
    public void OnError(string data)
    {
        LogUtil.Log("RXDemo", $"Error: {data}");
    }
    
    
    private void OnLogin()
    {
        LogUtil.Log("RXDemo", "点击登录");
        
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.DouYinH5;
        loginConfig.force = true;
        
        RXLogin.Login(loginConfig, OnResponse, OnError);
    }

    private void OnSetLog()
    {
        RuiXueSdk.SetLogEnable(!LogUtil.LogEnabled);
    }

    public void OnPay()
    {
        Dictionary<string, object> dic = new();
        dic.Add("pay_type", "douyinh5");
        dic.Add("platform", "ios");
        dic.Add("goods_tag", "bytest"); // 计费点
        dic.Add("trade_no", "2312125686062680"); // 订单号
        dic.Add("onlyGetOrder", true); // 写死必传
        
        RXMiniGameDouYin.Pay(dic, OnResponse, OnError);
    }

    public void OnStartRecord()
    {
        RXMiniGameDouYin.StartRecord();
    }
    
    public void OnStopRecord()
    {
        RXMiniGameDouYin.StopRecord();
    }

    public void OnShare()
    {
        RXShareConfig rxShareConfig = new RXShareConfig();
        rxShareConfig.platform = "douyinh5";
        rxShareConfig.func = "dytest"; // 埋点标识
        rxShareConfig.channel = "video";
        rxShareConfig.extra = new Dictionary<string, object>();
        
        // 如果是 ShareExtraVideo 对应的数据
        //rxShareConfig.extra["videoPath"] = "test";
        //rxShareConfig.extra["videoTopics"] = "test";
        // 其它参考文档根据需要填写
        
        // 如果是 ShareExtraPicture 对应数据
        string[] picturePath = { "test", "test2" };
        rxShareConfig.extra["picturePath"] = picturePath;
        // 其它参考文档根据需要填写
        
        // LaunchOption option = RXMiniGameDouYin.GetLaunchOptionsSync();
        // Dictionary<string, object> dic = new();
        // dic.Add("title", "wltest");
        // dic.Add("desc", "测试内容");
        // dic.Add("query", "a=1");
        RXShare.Share(rxShareConfig, OnResponse, OnError);
    }

    public void OnShareVideo()
    {
        RXShareConfig rxShareConfig = new RXShareConfig();
        rxShareConfig.platform = "douyinh5"; 
        rxShareConfig.func = "unity_test"; // 埋点标识
        rxShareConfig.channel = "video"; // 分享方式

        RXShare.Share(rxShareConfig, OnResponse, OnError);
    }

    public void OnShareFriend()
    {
        RXShareConfig rxShareConfig = new RXShareConfig();
        rxShareConfig.platform = "douyinh5";
        rxShareConfig.func = "haoyou"; // 埋点标识
        rxShareConfig.channel = "invite"; // 分享方式

        RXShare.Share(rxShareConfig, OnResponse, OnError);
    }

    public void OnGetShareData()
    {
        RXShareConfig rxShareConfig = new RXShareConfig();
        rxShareConfig.func = "meirenzhuan";
        RXShare.GetShareData(rxShareConfig, OnResponse, OnError);
    }
    
    public void OnTrack()
    {
        Dictionary<string, object> dic = new();
        dic.Add("testdic", "testdic");
        RXAnalysis.DataTrack("data-test", "", dic, OnResponse, OnError);
    }
    
    public void OnSetPublicProperties()
    {
        Dictionary<string, object> pub = new();
        pub.Add("a", 1);
        pub.Add("b", 2);
        pub.Add("c", 3);
        pub.Add("d", 4);
        pub.Add("e", 5);
        pub.Add("f", 6);
        RXAnalysis.SetPublicProperties(pub);
    }
    
    public void OnUpdatePublicProperties()
    {
        RXAnalysis.UpdatePublicProperties("test", "1111");
    }
    
    public void OnDeletePublicProperties()
    {
        RXAnalysis.DeletePublicProperties("test");
    }
    
    public void OnRewardedAd()
    {
        RXAd.RewardedVideoAd("74o0968j3n53wnrla9", false, OnResponse, OnError);
    }
    
    public void OpenCustomerServiceConversation()
    {
        Dictionary<string, string> dic = new();
        dic.Add("type", "3");
        RXMiniGameDouYin.OpenCustomerServiceConversation(dic, OnResponse, OnError);
    }
    #endif
}
