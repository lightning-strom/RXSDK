using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using RuiXue;
using RuiXue.FeedbackUI;
using RuiXue.Login;
using RuiXue.LoginUI;
using UnityEngine.Serialization;

public class RuiXueFeedbackUIDemo : MonoBehaviour
{
    
    [SerializeField] private Button _Button_ShowCreateFeedbackView;
    [SerializeField] private Button _Button_ShowFeedbackListView;
    private void Awake()
    {
        
        RuiXueSdk.SetLogEnable(true);
        
        Init();
        OnSetPrivacyAgree();
        
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
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }

    private void Init()
    {
        string cpId = "114";
        string channelId = "unity_test";
        string productId = "unity_test";
        List<string> list = new()
        {
            "https://cn-api-test.ruixuecloud.com/"
        };
        
        RuiXueSdk.Initialize(cpId,productId, channelId, list, LoginResponseDelegate, LoginErrorDelegate);
    }
    
    public void LoginResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestResponseDelegate: {data}");
        OnLogin();
    }
    public void LoginErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestErrorDelegate: {data}");
    }

    private void Start()
    {
        _Button_ShowCreateFeedbackView.onClick.AddListener(ShowCreateFeedbackView);
        _Button_ShowFeedbackListView.onClick.AddListener(ShowFeedbackListView);
    }

    public void ShowCreateFeedbackView()
    {
        RXFeedbackUI.ShowCreateFeedbackView();
    }

    public void ShowFeedbackListView()
    {
        RXFeedbackUI.ShowFeedbackListView();
    }


}
