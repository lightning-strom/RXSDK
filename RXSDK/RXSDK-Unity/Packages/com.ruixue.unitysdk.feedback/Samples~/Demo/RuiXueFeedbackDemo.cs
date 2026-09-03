using System.Collections.Generic;
using RuiXue;
using RuiXue.Feedback;
using RuiXue.Login;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueFeedbackDemo : MonoBehaviour
{

    [SerializeField] private Button _Button_GetFeedbackKindList;
    [SerializeField] private Button _Button_CreateFeedback;
    [SerializeField] private Button _Button_SatisfactionEvaluation;
    [SerializeField] private Button _Button_ReportFeedbackLog;
    
    private void Awake()
    {
        Init();
        OnSetPrivacyAgree();
        OnLogin();
    }
    
    void Start()
    {
        _Button_GetFeedbackKindList.onClick.AddListener(OnGetFeedbackKindList);
        _Button_CreateFeedback.onClick.AddListener(OnCreateFeedback);
        _Button_SatisfactionEvaluation.onClick.AddListener(OnSatisfactionEvaluation);
        _Button_ReportFeedbackLog.onClick.AddListener(OnReportFeedbackLog);
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
        loginConfig.username = "xuqiangsecondtest";
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

    public void OnGetFeedbackKindList()
    {
        RXFeedback.GetFeedbackKindList(FeedbackResponseDelegate, FeedbackErrorDelegate);
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

        RXFeedback.CreateFeedback(dic, FeedbackResponseDelegate, FeedbackErrorDelegate);
        
    }

    public void OnSatisfactionEvaluation()
    {
        Dictionary<string, object> dic = new();
        dic.Add("key_number", 10);
        dic.Add("pleased_status", 1);
        dic.Add("reason", "理由");
        RXFeedback.SatisfactionEvaluation(dic, FeedbackResponseDelegate, FeedbackErrorDelegate);
    }

    public void OnReportFeedbackLog()
    {
        RXFeedback.ReportFeedbackLog(new byte[200], FeedbackResponseDelegate, FeedbackErrorDelegate);
    }
    
    // public byte[] LoadImage()
    // {
    //     Texture2D image = (Texture2D) Resources.Load("logo");
    //
    //     Texture2D decopmpresseTex = image.DeCompress();
    //
    //     return decopmpresseTex.EncodeToPNG();
    // }
    
    private void FeedbackResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"FeedbackResponseDelegate : {data}");
    }

    private void FeedbackErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"FeedbackErrorDelegate : {error}");
    }
    
}
