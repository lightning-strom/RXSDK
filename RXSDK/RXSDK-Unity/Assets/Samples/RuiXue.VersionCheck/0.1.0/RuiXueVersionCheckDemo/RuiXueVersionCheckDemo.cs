using System.Collections.Generic;
using RuiXue;
using RuiXue.Login;
using RuiXue.VersionCheck;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueVersionCheckDemo : MonoBehaviour
{
    [SerializeField] private Button _Button_UpdateApp;
    [SerializeField] private Button _Button_CheckUpdateApp;
    [SerializeField] private Button _Button_UpdateGame;
    [SerializeField] private Button _Button_UpdateActivity;
    
    private void Awake()
    {
        Init();
        OnSetPrivacyAgree();
        // OnLogin();
    }
    
    void Start()
    {
        _Button_UpdateApp.onClick.AddListener(OnUpdateApp);
        _Button_CheckUpdateApp.onClick.AddListener(OnCheckUpdateApp);
        _Button_UpdateGame.onClick.AddListener(OnUpdateGame);
        _Button_UpdateActivity.onClick.AddListener(OnUpdateActivity);
    }
    
    private void Init()
    {
        // string cpId = "114";
        // string channelId = "unity_test";
        // string productId = "unity_test";
        // List<string> list = new()
        // {
        //     "https://cn-api-test.ruixuecloud.com/"
        // };
        //
        // RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
        
        string cpId = "119";
        string channelId = "iOSOS";
        string productId = "SDKOS";
        List<string> list = new()
        {
            "https://os-api-test.ruixuecloud.com/"
        };
        
        RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
    }

    public void InitResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"InitResponseDelegate RequestResponseDelegate: {data}");
        GuestLogin();

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
        loginConfig.username = "xuqiangsecondtest";
        loginConfig.password = "ruixue@12345678";
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    
    private void GuestLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.Guest;
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

    private void OnUpdateApp()
    {
        RXVersionCheck.UpdateApp("1", "0", "u3d", 
            VersionCheckResponseDelegate, VersionCheckErrorDelegate);
    }

    public void OnCheckUpdateApp()
    {
        var games = new Dictionary<string, int>() { { "123", 123 } };
        var activities = new Dictionary<string, int>() { { "test", 123 } };
        RXVersionCheck.CheckUpdateApp("1.0.1", "0", "u3d", games, activities,
            VersionCheckResponseDelegate, VersionCheckErrorDelegate);
    }

    public void OnUpdateGame()
    {
        RXVersionCheck.UpdateGame("123","1","0","u3d",
            VersionCheckResponseDelegate, VersionCheckErrorDelegate);
    }

    public void OnUpdateActivity()
    {
        RXVersionCheck.UpdateActivity("test", "1", "0", "u3d", 
            VersionCheckResponseDelegate, VersionCheckErrorDelegate);
    }
    
    private void VersionCheckResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $" VersionCheckResponseDelegate : {data}");
    }

    private void VersionCheckErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $" VersionCheckErrorDelegate : {error}");
    }
    
    public void VersionCheckStringFailForAndroid(int code, string msg, string traceId)
    {
        LogUtil.Log("EventManager", $" VersionCheckStringFailForAndroid: {code} - {msg} = {traceId}");
    }

}
