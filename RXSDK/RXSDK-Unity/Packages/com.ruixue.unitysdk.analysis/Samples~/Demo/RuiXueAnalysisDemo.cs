using System.Collections.Generic;
using RuiXue;
using RuiXue.Analysis;
using RuiXue.Login;
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
    
    private void OnLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.Username;
        loginConfig.username = "xiaohai3333";
        loginConfig.password = "1122232wewe";
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
        dic.Add("testdic", "testdic");
        RXAnalysis.DataTrack("data-test", "", dic, ResponseDelegate, ErrorDelegate);
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
