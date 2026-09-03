using System.Collections.Generic;
using RuiXue;
using RuiXue.Login;
using RuiXue.Rank;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueRankDemo : MonoBehaviour
{
    [SerializeField] private Button _Button_AddScore;
    [SerializeField] private Button _Button_SetScore;
    [SerializeField] private Button _Button_queryUserRank;
    [SerializeField] private Button _Button_getRankList;
    [SerializeField] private Button _Button_friendsRank;
    
    private string _rankID = "2023_100_1680_weekly";
    private string _openID = "rxuNZP3GnkxYVXMf2xW6UZEKdg0z7wLm";

    private void Awake()
    {
        Init();
        OnSetPrivacyAgree();
        // OnLogin();
    }

    void Start()
    {
        _Button_AddScore.onClick.AddListener(OnAddScore);
        _Button_SetScore.onClick.AddListener(OnSetScore);
        _Button_queryUserRank.onClick.AddListener(OnQueryUserRank);
        _Button_getRankList.onClick.AddListener(OnGetRankList);
        _Button_friendsRank.onClick.AddListener(OnFriendsRank);
    }
    
    private void Init()
    {
        // string cpId = "1000101";
        // string channelId = "100";
        // string productId = "1002";
        // List<string> list = new()
        // {
        //     "https://anhvcpo.weilekuiming.com"
        // };
        //
        // RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
        
        string cpId = "119";
        string channelId = "iOSOS";
        string productId = "SDKOS";
        List<string> list = new()
        {
            "http://os-api-test.ruixuecloud.com"
        };
        
        RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
    }

    public void InitResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"InitResponseDelegate RequestResponseDelegate: {data}");
        OnLogin();
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
        loginConfig.loginType = LoginMethod.Guest;
        // loginConfig.loginType = LoginMethod.Username;
        // loginConfig.username = "xiaohai3333";
        // loginConfig.password = "1122232wewe";
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

    public void OnAddScore()
    {
        RXRank.AddScore(_rankID, 80, RankResponseDelegate, RankErrorDelegate);
    }

    public void OnSetScore()
    {
        RXRank.SetScore(_rankID, 80, RankResponseDelegate, RankErrorDelegate);
    }

    public void OnQueryUserRank()
    {
        RXRank.QueryUserRank(_rankID, _openID, RankResponseDelegate, RankErrorDelegate);
    }

    public void OnGetRankList()
    {
        RXRank.GetRankList(_rankID, 1, 100, RankResponseDelegate, RankErrorDelegate);
    }

    public void OnFriendsRank()
    {
        RXRank.FriendsRank(_rankID, RankResponseDelegate, RankErrorDelegate);
    }

    private void RankResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RankResponseDelegate : {data}");
    }

    private void RankErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"RankErrorDelegate : {error}");
    }

}
