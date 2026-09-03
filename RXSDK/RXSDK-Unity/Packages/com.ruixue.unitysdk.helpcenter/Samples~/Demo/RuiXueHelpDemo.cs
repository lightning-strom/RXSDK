using System.Collections.Generic;
using RuiXue;
using RuiXue.Help;
using RuiXue.Login;
using UnityEngine;
using Button = UnityEngine.UI.Button;

public class RuiXueHelpDemo : MonoBehaviour
{
    
    [SerializeField] private Button _Button_HelperCenterUI;
    [SerializeField] private Button _Button_ChatServiceUI;

    private void Awake()
    {
        Init();
        OnSetPrivacyAgree();
        OnLogin();
    }
    
    private void Init()
    {
        string cpId = "1000101";
        string channelId = "100";
        string productId = "1002";
        List<string> list = new()
        {
            "https://anhvcpo.weilekuiming.com"
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

    void Start()
    {
        _Button_HelperCenterUI.onClick.AddListener(OnHelperCenterUI);
        _Button_ChatServiceUI.onClick.AddListener(ChatServiceUI);
    }

    public void OnHelperCenterUI()
    {
        Dictionary<string, object> dic = new();
        RXHelp.HelperCenterUI(dic, HelperCenterUIResponseDelegate, HelperCenterUIErrorDelegate);
    }
    
    public void HelperCenterUIResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $" HelperCenterUI HelperCenterUIResponseDelegate: {data}");
    }
    public void HelperCenterUIErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $" HelperCenterUI HelperCenterUIErrorDelegate: {data}");
    }

    public void ChatServiceUI()
    {
        Dictionary<string, object> dic = new();
        RXHelp.ChatServiceUI(dic, ChatServiceUIResponseDelegate, ChatServiceUIErrorDelegate);
    }
    
    public void ChatServiceUIResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $" HelperCenterUI HelperCenterUIResponseDelegate: {data}");
    }
    public void ChatServiceUIErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $" HelperCenterUI HelperCenterUIErrorDelegate: {data}");
    }

}
