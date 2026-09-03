using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using RuiXue;
using RuiXue.Ad;
using RuiXue.Analysis;
using RuiXue.Business;
using RuiXue.Feedback;
using RuiXue.LBS;
using RuiXue.Login;
using RuiXue.Pay;
using RuiXue.Rank;
using RuiXue.Share;
using RuiXue.Social;
using RuiXue.VersionCheck;

#if UNITY_WEBGL
using RuiXue.MiniGame.WeiXin;
#endif

public class RuiXueWeiXinMiniGameDemo : MonoBehaviour
{
    [Header("账号相关")]
    [SerializeField] private Button _Button_InitSDK;
    [SerializeField] private Button _Button_SetSubChannel;
    [SerializeField] private Button _Button_Login;
    [SerializeField] private Button _Button_SecondLogin;
    [SerializeField] private Button _Button_Deregister;
    [SerializeField] private Button _Button_deregisterCancel;
    [SerializeField] private Button _Button_SendCaptcha;
    [SerializeField] private Button _Button_BindEmail;
    [SerializeField] private Button _Button_UnBindEmail;
    [SerializeField] private Button _Button_BindPhone;
    [SerializeField] private Button _Button_UnBindPhone;
    [SerializeField] private Button _Button_GetUserInfo;
    [SerializeField] private Button _Button_UpdateUserInfo;
    [SerializeField] private Button _Button_SyncUserInfo;
    [Header("支付相关")]
    [SerializeField] private Button _Button_Pay;
    [Header("分享相关")]
    [SerializeField] private Button _Button_Share;
    [SerializeField] private Button _Button_GetShareData;
    [SerializeField] private Button _Button_GetShareScheduling;
    [SerializeField] private Button _Button_ShareSchedulingReport;
    [SerializeField] private Button _Button_ShareSchedulingInit;

    [Header("社交相关")]
    [SerializeField] private Button _Button_AuthorizeLocation;
    [SerializeField] private Button _Button_GetNearlyPersionByRadius;
    [SerializeField] private Button _Button_StartLocation;
    [SerializeField] private Button _Button_StopLocation;
    [SerializeField] private Button _Button_DeleteLocation;
    [SerializeField] private Button _Button_AddRelation;
    [SerializeField] private Button _Button_DeleteRelation;
    [SerializeField] private Button _Button_GetRelationList;
    [SerializeField] private Button _Button_UpdateRemarks;
    [SerializeField] private Button _Button_HasRelation;
    [SerializeField] private Button _Button_AddFriend;
    [SerializeField] private Button _Button_DelFriend;
    [SerializeField] private Button _Button_UpdateFriendRemarks;
    [SerializeField] private Button _Button_IsFriend;
    [SerializeField] private Button _Button_Friends;

    [Header("排行榜相关")]
    [SerializeField] private Button _Button_AddScore;
    [SerializeField] private Button _Button_SetScore;
    [SerializeField] private Button _Button_QueryUserRank;
    [SerializeField] private Button _Button_GetRankList;
    [SerializeField] private Button _Button_FriendsRank;
    
    [Header("商业化相关")]
    [SerializeField] private Button _Button_GetBusinessData;
    [SerializeField] private Button _Button_GetAllBusinessData;
    [SerializeField] private Button _Button_RequestBusinessOrder;
    [SerializeField] private Button _Button_RefreshBusinessData;
    
    [Header("数据分析相关")]
    [SerializeField] private Button _Button_Track;
    [SerializeField] private Button _Button_SetPublicProperties;
    [SerializeField] private Button _Button_UpdatePublicProperties;
    [SerializeField] private Button _Button_DeletePublicProperties;
    
    [Header("反馈相关")]
    [SerializeField] private Button _Button_CreateFeedback;
    [SerializeField] private Button _Button_GetFeedbackKindList;
    [SerializeField] private Button _Button_SatisfactionEvalutation;
    
    [Header("版本检查相关")]
    [SerializeField] private Button _Button_CheckAppVersion;
    [SerializeField] private Button _Button_CheckVersion;
    [SerializeField] private Button _Button_CheckGameVersion;
    [SerializeField] private Button _Button_CheckActivityVersion;

    [Header("广告相关")]
    [SerializeField] private Button _Button_InterstitialAd;
    [SerializeField] private Button _Button_BannerAd;
    [SerializeField] private Button _Button_RewardedAd;

    [Header("开放数据")] 
    [SerializeField] private Button _Button_GetUserInteractiveStorage;
    [SerializeField] private Button _Button_GetGameClubData;
    [SerializeField] private Button _Button_SetUserCloudStorage;
    [SerializeField] private Button _Button_GetUserCloudStorage;
    [SerializeField] private Button _Button_RemoveUserCloudStorage;
    [SerializeField] private Button _Button_GetUserCloudStorageKeys;
    [SerializeField] private Button _Button_GetFriendCloudStorage;
    [SerializeField] private Button _Button_GetPotentialFriendList;
    [SerializeField] private Button _Button_GetRelationFriendList;
    
#if UNITY_WEBGL
    private void Start()
    {
        _Button_InitSDK.onClick.AddListener(OnInitSDK);
        _Button_SetSubChannel.onClick.AddListener(OnSetSubChannelId);
        _Button_Login.onClick.AddListener(OnLogin);
        _Button_SecondLogin.onClick.AddListener(OnSecondLogin);
        _Button_Deregister.onClick.AddListener(OnDeregister);
        _Button_deregisterCancel.onClick.AddListener(OnDeregisterCancel);
        _Button_SendCaptcha.onClick.AddListener(OnSendCaptcha);
        _Button_BindEmail.onClick.AddListener(OnBindEmail);
        _Button_UnBindEmail.onClick.AddListener(OnUnBindEmail);
        _Button_BindPhone.onClick.AddListener(OnBindPhone);
        _Button_UnBindPhone.onClick.AddListener(OnUnBindPhone);
        _Button_GetUserInfo.onClick.AddListener(OnGetUserInfo);
        _Button_UpdateUserInfo.onClick.AddListener(OnUpdateUserInfo);
        _Button_SyncUserInfo.onClick.AddListener(OnUserInfoSync);
        _Button_Pay.onClick.AddListener(OnPay);
        _Button_Share.onClick.AddListener(OnShare);
        _Button_GetShareData.onClick.AddListener(OnGetShareData);
        _Button_GetShareScheduling.onClick.AddListener(OnGetShareScheduling);
        _Button_ShareSchedulingReport.onClick.AddListener(OnShareSchedulingReport);
        _Button_ShareSchedulingInit.onClick.AddListener(OnShareSchedulingInit);
        
        _Button_AuthorizeLocation.onClick.AddListener(OnAuthorizeLocation);
        _Button_GetNearlyPersionByRadius.onClick.AddListener(OnGetNearlyPersonByRadius);
        _Button_StartLocation.onClick.AddListener(OnStartLocation);
        _Button_StopLocation.onClick.AddListener(OnStopLocation);
        _Button_DeleteLocation.onClick.AddListener(OnDeleteLocation);
        _Button_AddRelation.onClick.AddListener(OnAddRelation);
        _Button_DeleteRelation.onClick.AddListener(OnDeleteRelation);
        _Button_GetRelationList.onClick.AddListener(OnGetRelationList);
        _Button_UpdateRemarks.onClick.AddListener(OnUpdateRemarks);
        _Button_HasRelation.onClick.AddListener(OnHasRelation);
        _Button_AddFriend.onClick.AddListener(OnAddFriend);
        _Button_DelFriend.onClick.AddListener(OnDelFriend);
        _Button_UpdateFriendRemarks.onClick.AddListener(OnUpdateFriendRemarks);
        _Button_IsFriend.onClick.AddListener(OnIsFriend);
        _Button_Friends.onClick.AddListener(OnFriends);
        
        _Button_AddScore.onClick.AddListener(OnAddScore);
        _Button_SetScore.onClick.AddListener(OnSetScore);
        _Button_QueryUserRank.onClick.AddListener(OnQueryUserRank);
        _Button_GetRankList.onClick.AddListener(OnGetRankList);
        _Button_FriendsRank.onClick.AddListener(OnFriendsRank);
        
        _Button_GetBusinessData.onClick.AddListener(OnGetBusinessData);
        _Button_GetAllBusinessData.onClick.AddListener(OnGetAllBusinessData);
        _Button_RequestBusinessOrder.onClick.AddListener(OnRequestBusinessOrder);
        _Button_RefreshBusinessData.onClick.AddListener(OnRefreshBusinessData);
        
        _Button_Track.onClick.AddListener(OnTrack);
        _Button_SetPublicProperties.onClick.AddListener(OnSetPublicProperties);
        _Button_UpdatePublicProperties.onClick.AddListener(OnUpdatePublicProperties);
        _Button_DeletePublicProperties.onClick.AddListener(OnDeletePublicProperties);
        
        _Button_CreateFeedback.onClick.AddListener(OnCreateFeedback);
        _Button_GetFeedbackKindList.onClick.AddListener(OnGetFeedbackKindList);
        _Button_SatisfactionEvalutation.onClick.AddListener(OnSatisfactionEvalutation);
        
        _Button_CheckAppVersion.onClick.AddListener(OnCheckAppVersion);
        _Button_CheckVersion.onClick.AddListener(OnCheckVersion);
        _Button_CheckGameVersion.onClick.AddListener(OnCheckGameVersion);
        _Button_CheckActivityVersion.onClick.AddListener(OnCheckActivityVersion);
        
        _Button_InterstitialAd.onClick.AddListener(OnInterstitialAd);
        _Button_BannerAd.onClick.AddListener(OnBannerAd);
        _Button_RewardedAd.onClick.AddListener(OnRewardedAd);
        
        _Button_GetUserInteractiveStorage.onClick.AddListener(OnGetUserInteractiveStorage);
        _Button_GetGameClubData.onClick.AddListener(OnGetGameClubData);
        _Button_SetUserCloudStorage.onClick.AddListener(OnSetUserCloudStorage);
        _Button_GetUserCloudStorage.onClick.AddListener(OnGetUserCloudStorage);
        _Button_RemoveUserCloudStorage.onClick.AddListener(OnRemoveUserCloudStorage);
        _Button_GetUserCloudStorageKeys.onClick.AddListener(OnGetUserCloudStorageKeys);
        _Button_GetFriendCloudStorage.onClick.AddListener(OnGetFriendCloudStorage);
        _Button_GetPotentialFriendList.onClick.AddListener(OnGetPotentialFriendList);
        _Button_GetRelationFriendList.onClick.AddListener(OnGetRelationFriendList);
    }

    private void OnInitSDK()
    {
        string cpId = "114";
        string channelId = "1002";
        string productId = "818";
        List<string> list = new()
        {
            "https://cn-api-test.ruixueyun.com/"
        };
        
        RuiXueSdk.Initialize(cpId, productId, channelId, list, OnInitResponse, OnError);
    }

    private void OnInitResponse(string data)
    {
        OnResponse(data);
        RXMiniGameWeiXin.RegisterGdtMenuEventListeners();
    }

    public void OnResponse(string data)
    {
        LogUtil.Log("RXDemo",$"Response: {data}");
    }
    public void OnError(string data)
    {
        LogUtil.Log("RXDemo", $"Error: {data}");
    }
    

    private void OnSetSubChannelId()
    {
        RuiXueSdk.SetSubChannelId("your sub_channel_id");
    }
    
    private void OnLogin()
    {
        LogUtil.Log("RXDemo", "点击登录");
        
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Minigame;
        loginConfig.version = "normal";
        
        RXLogin.Login(loginConfig, OnResponse, OnError);
    }

    private void OnSecondLogin()
    {
        LogUtil.Log("RXDemo", "二次登录");
        
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Minigame;
        loginConfig.loginOpenId =
            "Hjyr7natPbngkaFnQd6M24lpPeyEcbIZzX4RSclZ4N65W8P3cL2C2kBbdPHKbp3XrOUaFn87mrMxC/62XKJGxCA1eebrH4IeNN+zGcqDbS6pdWcTQjM7k5rTVq2d/RFoIJeVzQGCcX3RsrUD+72N19rtM8YDGk+FI2Vb56+1uKF1wytzK+tyeGwlwIa3tfOIqiTd6Jm4MrjVVYbMVPdqTw2ZBoKYOZJWSMwUqQGyJehCev9v1BGgjEx2Fc7n2F0uc2tH3aDrrxURBSotC72er+B/rAWzIUQT7yD69MY/czRS1NNYyyhS8mpeUlDRvhcgb+eUgJhA3ZL1Fv8Xcs4/Ff/t9A2O5+i2DQilkWcsQtqmRwshe54FplHfUJdmtIUZSNRX9IKm6zTNXN6XMYWtTsIsMclZtJZ6iztE5YRp7IJ01/EczOY54xGxXovNak7D+yaUoG0pKDTURc4TZcuB30myVqaw/1Omc7U6KTD0sLK9mYaE6FC+MiHO64u+XzkApHHIRc4EhDdgXbZTzX8UZe1EgjyothcUp6+wxOAKTZHPAkMX+wRibtF1Gfei3BVxk+nzEeXleHg/rGIJfB761ZQf50BzDSjRkikVgRmaQyLvCEeiQHcyzhAKxaokV0C/sjwfHLSP1WUybDduOcijLVEx8H2Pz08mwnmLPiYsTAy/nG30P/qFhCznM+a6b3MQY3BuBOEs7r+Ma3c0NtpsSglJVXJFqqD7cW4YU/q3T+uCBCw+XHFHPiSlhWnzzG8STQ+ZX8ZlG3doRmjz+SVsz/pj67yhXNCWflkT3O5IH+/xlpfD842b/jsuNpOAYdNlWGWovBH1l7DtJahDoe05v21aJs8XiqGWgiwGlvxpHX2v1OTZW6Ff79oIqkdWT2R0Y7o82rXbTbHSlA66UrkMnTXvq6tzTWbqEme+MPqbPo8BVzWh5ZXpQ4pV9IFEAhRejT+pkpTWlS4xC3YNApKynntiHJool5ga0Qc9OgGCOJwpxGUcEZ2EdYf/NCoCesQG5dtDNPceocCMyh7vISFzRo0NWBAxSMKgudLx9Wvpr7U=";
        
        RXLogin.Login(loginConfig, OnResponse, OnError);
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
        
        RXLogin.Deregister(deregisterConfig, OnResponse, OnError);
    }

    public void OnDeregisterCancel()
    {
        RXLogin.DeregisterCancel(OnResponse, OnError);
    }
    

    public void OnSendCaptcha()
    {
        RXLogin.SendCaptcha(CaptchaType.CaptchaType_phone, "18614001864", "login",
             OnResponse, OnError);
    }
    

    public void OnBindEmail()
    {
        RXLogin.BindEmail("liyubo3603237@126.com", "12345qwert", "2816", null, 
            OnResponse, OnError);
    }
    

    public void OnUnBindEmail()
    {
        RXLogin.UnBindEmail("liyubo3603237@126.com", "2816", OnResponse, OnError);
    }
    

    public void OnBindPhone()
    {
        RXLogin.BindPhone("18614001864", "12345qwert", "2816", null, 
            OnResponse, OnError);
    }
    

    public void OnUnBindPhone()
    {
        RXLogin.UnBindPhone("18614001864",  "2816", OnResponse, OnError);
    }
    

    public void OnGetUserInfo()
    {
        RXLogin.GetUserInfo(OnResponse, OnError);
    }

    
    public void OnUpdateUserInfo()
    {
        RXLogin.UpdateUserInfo("yyyyy", "www.baidu.com", "1", 1, OnResponse, OnError);
    }
    

    public void OnUserInfoSync()
    {
        RXLogin.WebGL_UserInfoSync(OnResponse, OnError);
    }

    public void OnPay()
    {
        var dic = new Dictionary<string, object>()
        {
            {"pay_type","minigame_v2"},
            {"goods_tag", "goods1"},
            {"trade_no", $"{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}"},
            {"transmit_args", "a=1&b=2"},
            {"indulge_auth", 1},
            {"age", 18},
            {"is_debug", 1},
            {"env", 1},
        };
        
        RXPay.Pay(dic, OnResponse, OnError);
    }

    public void OnShare()
    {
        RXShareConfig rxShareConfig = new RXShareConfig();
        rxShareConfig.func = "unity_test";
        rxShareConfig.read_cache = true;
        rxShareConfig.transmits = "uId=1&shareType=2";
        RXShare.Share(rxShareConfig, OnResponse, OnError);
    }

    public void OnGetShareData()
    {
        RXShareConfig rxShareConfig = new RXShareConfig();
        rxShareConfig.func = "unity_test";
        rxShareConfig.transmits = "uId=1&shareType=2";
        RXShare.GetShareData(rxShareConfig, OnResponse, OnError);
    }

    public void OnShareSchedulingInit()
    {
        string[] arr = { "maidian3"};
        RXShare.ShareSchedulingInit(arr, OnResponse, OnError);
    }

    public void OnGetShareScheduling()
    {
        string[] arr = { "maidian3"};
        string scheduleStr = RXShare.GetShareScheduling(arr);
        LogUtil.Log("RXDemo",$"OnGetShareScheduling: {scheduleStr}");
    }

    public void OnShareSchedulingReport()
    {
        RXShare.ShareSchedulingReport("wake_game_honor_1", "wechat", "220101", true,
            "share", "", null, 
            OnResponse, OnError);
    }

    public void OnAuthorizeLocation()
    {
        RXLBSWebGL.AuthorizeLocation(OnResponse, OnError);
    }

    public void OnGetNearlyPersonByRadius()
    {
        RXSocial.LbsRadius("friend", 118.19646377354036f, 24.483710802285128f, 1000, 10, 1, 10, 
            OnResponse, OnError);
    }

    public void OnStartLocation()
    {
        RXLBSWebGL.StartReportLocation(new []{"test1"}, 3000, OnResponse, OnError);
    }

    public void OnStopLocation()
    {
        RXLBSWebGL.StopReportLocation();
    }

    public void OnDeleteLocation()
    {
        RXSocial.LbsDelete(new []{"test1"}, OnResponse, OnError);
    }
    
    private string[] _arr =
    {
        "rxuNZP3GnkxYVXMf2xW6UZEKdg0z7wLm",
        "rxufyWGAzrN4vQYuNML0SQ7z5PqOdLwo",
        "rxuC0Q9_GxeMY1rHjnr_Im1PY2O3E-pr"
    };
    
    public void OnAddRelation()
    {
        
        Dictionary<string, object> dic = new();
        dic.Add("test", true);
        RXSocial.RelationAdd(_arr[1], dic, null, null, 
            OnResponse, OnError);
    }
    
    public void OnDeleteRelation()
    {
        Dictionary<string, object> dic = new();
        dic.Add("test", true);
        RXSocial.RelationDelete(_arr[1], dic, OnResponse, OnError);
    }
    
    public void OnGetRelationList()
    {
        RXSocial.RelationList("test", OnResponse, OnError);
    }
    
    private readonly string _customRelationKey = "test";
    private readonly string _openID = "rxuNZP3GnkxYVXMf2xW6UZEKdg0z7wLm";
    public void OnUpdateRemarks()
    {
        string targetRemarks = _customRelationKey + " 关系备注";
        RXSocial.UpdateRemarks(_openID, "test", targetRemarks, OnResponse, OnError);
    }
    
    public void OnHasRelation()
    {
        RXSocial.HasRelation(_arr[1], "test", OnResponse, OnError);
    }
    
    public void OnAddFriend()
    {
        RXSocial.AddFriends(_arr[1], null, null, OnResponse, OnError);
    }
    
    public void OnDelFriend()
    {
        RXSocial.RemoveFriends(_arr[1], OnResponse, OnError);
    }
    
    public void OnUpdateFriendRemarks()
    {
        RXSocial.UpdateFriendRemarks(_arr[1], "", OnResponse, OnError);
    }
    
    public void OnIsFriend()
    {
        RXSocial.IsFriend(_arr[1], OnResponse, OnError);
    }
    
    public void OnFriends()
    {
        RXSocial.RelationFriends(OnResponse, OnError);
    }
    
    private string _rankID = "2023_100_1680_weekly";

    public void OnAddScore()
    {
        RXRank.AddScore(_rankID, 80, OnResponse, OnError);
    }
    
    public void OnSetScore()
    {
        RXRank.SetScore(_rankID, 80, OnResponse, OnError);
    }
    
    public void OnQueryUserRank()
    {
        RXRank.QueryUserRank(_rankID, _openID, OnResponse, OnError);
    }
    
    public void OnGetRankList()
    {
        RXRank.GetRankList(_rankID, 1, 100, OnResponse, OnError);
    }
    
    public void OnFriendsRank()
    {
        RXRank.FriendsRank(_rankID, OnResponse, OnError);
    }
    
    public void OnGetBusinessData()
    {
        string windowKey = "sfnj";
        string events = "#share_get_data";
        RXBusiness.GetBusinessData(windowKey, events, "", OnResponse, OnError);
    }
    
    public void OnGetAllBusinessData()
    {
        RXBusiness.GetAllBusinessData(OnResponse, OnError);
    }
    
    public void OnRequestBusinessOrder()
    {
        RXBusiness.RequestBusinessOrder("1111", "111", OnResponse, OnError);
    }
    
    public void OnRefreshBusinessData()
    {
        RXBusiness.RefreshBusinessData();
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
    
    
    public void OnCreateFeedback()
    {
        Dictionary<string, object> dic = new()
        {
            { "game_id", 100 },
            { "kind_id", 1 },
            { "kind_name", "意见反馈类型" },
            { "priority", 1 },
            { "content", "说明" },
            { "picture", "图片url" },
            { "player_gameid", "玩家游戏id" },
            { "send_voided_mails", 1 }
        };

        RXFeedback.CreateFeedback(dic, OnResponse, OnError);
    }
    
    public void OnGetFeedbackKindList()
    {
        RXFeedback.GetFeedbackKindList(OnResponse, OnError);
    }
    
    public void OnSatisfactionEvalutation()
    {
        Dictionary<string, object> dic = new();
        dic.Add("key_number", 10);
        dic.Add("pleased_status", 1);
        dic.Add("reason", "理由");
        RXFeedback.SatisfactionEvaluation(dic, OnResponse, OnError);
    }
    
    public void OnCheckAppVersion()
    {
        RXVersionCheck.UpdateApp("1", "0", "u3d", 
            OnResponse, OnError);
    }
    
    public void OnCheckVersion()
    {
        var games = new Dictionary<string, int>() { { "123", 123 } };
        var activities = new Dictionary<string, int>() { { "test", 123 } };
        RXVersionCheck.CheckUpdateApp("1.0.1", "0", "u3d", games, activities,
            OnResponse, OnError);
    }
    
    public void OnCheckGameVersion()
    {
        var modules = new List<VersionCheckModule>
        {
            new VersionCheckModule("dsa", "dass", 0, 0),
            new VersionCheckModule("_nNNN", "default", 0, 0)
        };
        RXVersionCheck.UpdateGameVersion(modules, "u3d",
            OnResponse, OnError);
    }
    
    public void OnCheckActivityVersion()
    {
        RXVersionCheck.UpdateActivity("test", "1", "0", "u3d", 
            OnResponse, OnError);
    }
    
    public void OnInterstitialAd()
    {
        RXAd.InterstitialAd("adunit-5a21fa42940a66b1", false, OnResponse, OnError);
    }
    
    public void OnBannerAd()
    {
        RXAd.BannerAd("adunit-d747b761c15165d8", new Rect(0,0, 800,200), 30, false, OnResponse, OnError);
    }
    
    public void OnRewardedAd()
    {
        RXAd.RewardedVideoAd("adunit-0896c8150129798b", false, OnResponse, OnError);
    }



    public void OnGetUserInteractiveStorage()
    {
        RXMiniGameWeiXin.GetUserInteractiveStorage(new []{"1", "2"}, OnResponse, OnError);
    }
    

    public void OnGetGameClubData()
    {
        RXMiniGameWeiXin.GetGameClubData(new RXMiniGameWeiXin.GameClubDataType[]
        {
            new()
            {
                type = 1,
            }
        }, OnResponse, OnError);
    }

    public void OnSetUserCloudStorage()
    {
        RXMiniGameWeiXin.CloudStorageKVData[] data = new[]
        {
            new RXMiniGameWeiXin.CloudStorageKVData()
            {
                key = "gold",
                value = "3000"
            },
            new RXMiniGameWeiXin.CloudStorageKVData()
            {
                key = "score",
                value = "16"
            },
        };
        
        RXMiniGameWeiXin.SetUserCloudStorage(data, OnResponse, OnError);
    }

    public void OnGetUserCloudStorage()
    {
        RXMiniGameWeiXin.GetUserCloudStorage(new []{"gold", "score"}, OnResponse, OnError);
    }

    public void OnRemoveUserCloudStorage()
    {
        RXMiniGameWeiXin.RemoveUserCloudStorage(new []{"score"}, OnResponse, OnError);
    }

    public void OnGetUserCloudStorageKeys()
    {
        RXMiniGameWeiXin.GetUserCloudStorageKeys(OnResponse, OnError);
    }

    public void OnGetFriendCloudStorage()
    {
        RXMiniGameWeiXin.GetFriendCloudStorage(new string[]{"gold", "score"}, OnResponse, OnError);
    }

    public void OnGetPotentialFriendList()
    {
        RXMiniGameWeiXin.GetPotentialFriendList(OnResponse, OnError);
    }

    public void OnGetRelationFriendList()
    {
        Dictionary<string, object> dic = new()
        {
            ["guideAuthWhenDeny"] = true,
            ["authModalTitle"] = "授权提示",
            ["authModalContent"] = "需要获取互动好友信息，请在设置中开启授权"
        };
        RXMiniGameWeiXin.GetRelationFriendList(dic, OnResponse, OnError);
    }

    public void OnReportGdt()
    {
        RXMiniGameWeiXin.ReportGdt("QUEST", new Dictionary<string, object>
        {
            ["outer_action_id"] = "quest-1001",
            ["product_id"] = 101,
            ["amount"] = 9.9
        });
    }

    public void OnLoadFinish()
    {
        RXMiniGameWeiXin.LoadFinish();
    }

    public void OnSubscribe()
    {
        RXMiniGameWeiXin.Subscribe();
    }

    public void OnTutorialStart()
    {
        RXMiniGameWeiXin.TutorialStart();
    }

    public void OnReportRequiredGdtEvents()
    {
        RXMiniGameWeiXin.ReportCreateRole("role-id");
        RXMiniGameWeiXin.ReportUpdateLevel(new Dictionary<string, dynamic>
        {
            ["level"] = 10
        });
        RXMiniGameWeiXin.ReportTutorialFinish();
        RXMiniGameWeiXin.ReportViewContent("Mall");
    }

    public void OnGetDirectAdStatusSync()
    {
        var status = RXMiniGameWeiXin.GetDirectAdStatusSync();
        LogUtil.Log("RXDemo",
            $"DirectAdStatus: isInMask={status?.isInMask}, isInDirectGameAd={status?.isInDirectGameAd}");
    }

    public void OnListenDirectAdStatusChange()
    {
        RXMiniGameWeiXin.OnDirectAdStatusChange(status =>
        {
            LogUtil.Log("RXDemo",
                $"DirectAdStatusChange: isInMask={status.isInMask}, " +
                $"isInDirectGameAd={status.isInDirectGameAd}, isEndByAbnormal={status.isEndByAbnormal}");
        });
    }
#endif
}
