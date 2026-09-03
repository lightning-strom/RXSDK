using System.Collections.Generic;
using RuiXue;
using RuiXue.Ad;
using RuiXue.Login;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueAdDemo : MonoBehaviour
{
    
    [SerializeField] private Button _Button_RewardedVideoAd;
    
    private void Awake()
    {
        Init();
        OnSetPrivacyAgree();
        DouYinH5Login();
    }
    
    void Start()
    {
        _Button_RewardedVideoAd.onClick.AddListener(RewardedVideoAd);
    }
    
    private void Init()
    {
        string cpId = "112";
        string channelId = "123456789";
        string productId = "123456789";
        List<string> list = new()
        {
            "https://cn-api-demo.ruixuecloud.com/"
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
    
    private void DouYinH5Login()
    {
        
        LogUtil.Log("EventManager", "发起抖音H5登录");
        
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.DouYinH5;
        loginConfig.force = true;
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

    public void RewardedVideoAd()
    {
        RXAd.RewardedVideoAd("74o0968j3n53wnrla9", false, AdResponseDelegate, AdErrorDelegate);
    }
    
    public void AdResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"InitResponseDelegate RequestResponseDelegate: {data}");
        
    }
    public void AdErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $" InitErrorDelegate RequestErrorDelegate: {data}");
    }

}
