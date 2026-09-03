using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using RuiXue;
using RuiXue.LoginUI;
using UnityEngine.Serialization;

public class RuiXueFeedbackUIDemo : MonoBehaviour
{
    
    [SerializeField] private Button _Button_ShowCreateFeedbackView;
    [SerializeField] private Button _Button_ShowFeedbackListView;
    private void Awake()
    {
        Init();
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
        RXLoginUI.ShowCreateFeedbackView();
    }

    public void ShowFeedbackListView()
    {
        RXLoginUI.ShowFeedbackListView();
    }


}
