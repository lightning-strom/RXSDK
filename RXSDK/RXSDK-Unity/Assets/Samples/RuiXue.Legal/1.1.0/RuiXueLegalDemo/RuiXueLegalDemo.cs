using System.Collections.Generic;
using RuiXue;
using RuiXue.Legal;
using RuiXue.Login;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueLegalDemo : MonoBehaviour
{

    [SerializeField] private Button _Button_Legal;
    
    private void Awake()
    {
        Init();
        OnSetPrivacyAgree();
        OnLogin();
    }
    
    void Start()
    {
        _Button_Legal.onClick.AddListener(OnLegal);
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

    private void OnLegal()
    {
        RXLegal.Legal(LegalResponseDelegate, LegalErrorDelegate);
    }
    
    private void LegalResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"LegalResponseDelegate : {data}");
    }

    private void LegalErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"LegalErrorDelegate : {error}");
    }
    
}
