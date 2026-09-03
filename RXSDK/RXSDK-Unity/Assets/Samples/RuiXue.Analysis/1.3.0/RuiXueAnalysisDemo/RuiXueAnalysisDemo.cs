using System.Collections.Generic;
using RuiXue;
using RuiXue.Analysis;
using RuiXue.Login;
using RuiXue.Performance;
using RuiXue.UWA;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueAnalysisDemo : MonoBehaviour
{

    [SerializeField] private Button _Button_DataTrack;
    [SerializeField] private Button _Button_SetPublicProperties;
    [SerializeField] private Button _Button_UpdatePublicProperties;
    [SerializeField] private Button _Button_DeletePublicProperties;
    
    private void Awake()
    {
        Init();
        OnSetPrivacyAgree();
        RuiXueSdk.InitThirdSdk(new Dictionary<string, object>
        {
            { "clientId", "728854069094-v0apajj7rd65s3abb8aj9kkub79rdt4f.apps.googleusercontent.com" }
        }, ResponseDelegate, ErrorDelegate);
        
        OnLogin();
    }
    
    void Start()
    {
        _Button_DataTrack.onClick.AddListener(OnDataTrack);
        _Button_SetPublicProperties.onClick.AddListener(OnSetPublicProperties);
        _Button_UpdatePublicProperties.onClick.AddListener(OnUpdatePublicProperties);
        _Button_DeletePublicProperties.onClick.AddListener(OnDeletePublicProperties);
    }
    
    private void Init()
    {
        
#if UNITY_ANDROID
        RuiXueUWAGPM.StaticInit(
            "https://2uq9pq.pwypyq.com", 
            "7d979a9a-57c9-467e-ac67-e4a8c418cf4b", 
            "3.25.7",
            "101",
            debug: true
        );
        RuiXueSdk.SetLogEnable(true);
#elif UNITY_IOS
        UWAGPM.StaticInit(
            "https://soidwxk.jiaxiangxm.com", 
            "d6abae78-9cd0-4d61-99fd-0c705ad18eab", 
            "3.25.7",
            "101",
            debug: true
        );
#endif
        RuiXueSdk.SetLogEnable(true);
        
        string cpId = "1000102";
        string channelId = "102";
        string productId = "142";
        List<string> list = new()
        {
            "https://umusblhbv.wjhmqn.com"
        };
        
        RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
    }

    public void InitResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"InitResponseDelegate RequestResponseDelegate: {data}");
        OnLogin();
        PerformManceReport.PerformReport();
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

    private void OnDataTrack()
    {
        Dictionary<string, object> dic = new();
        dic.Add("test1", "testdic1");
        RXAnalysis.DataTrack("cl_101001", "", dic, ResponseDelegate, ErrorDelegate);
        Dictionary<string, object> dic1 = new();
        dic1.Add("test2", "testdic2");
        RXAnalysis.DataTrack("cl_102001", "", dic1, ResponseDelegate, ErrorDelegate);
        Dictionary<string, object> dic2 = new();
        dic2.Add("test3", "testdic3");
        RXAnalysis.DataTrack("cl_102002", "", dic2, ResponseDelegate, ErrorDelegate);
    }
    
    public void ResponseDelegate(string data)
    {
        LogUtil.Log("EventManager",$"RequestResponseDelegate: {data}");
    }
    public void ErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestErrorDelegate: {data}");
    }

    private void OnSetPublicProperties()
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

    private void OnUpdatePublicProperties()
    {
        RXAnalysis.UpdatePublicProperties("test", "1111");
    }

    private void OnDeletePublicProperties()
    {
        RXAnalysis.DeletePublicProperties("test");
    }
}
