using System.Collections.Generic;
using RuiXue;
using RuiXue.Login;
using RuiXue.Pay;
using RuiXue.Qoo;
using RuiXueLitJson;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueQooDemo : MonoBehaviour
{
    
    [SerializeField] private Button Button_Login;
    [SerializeField] private Button Button_Pay;
    [SerializeField] private Button Button_CheckLicense;
    [SerializeField] private Button Button_RestorePurchases;
    [SerializeField] private Button Button_Consume;
    [SerializeField] private Button Button_QueryProducts;
    [SerializeField] private Button Button_QueryProductInfo;
    [SerializeField] private Button Button_QueryProducts2;
    [SerializeField] private Button Button_OpenGameDetail;
    [SerializeField] private Button Button_LatestVersionCode;
    [SerializeField] private Button Button_SetLocale;
    
    private void Awake()
    {
        Init();
        OnSetPrivacyAgree();
        // Login();
        InitThirdSdk();
    }
    
    void Start()
    {
        Button_Login.onClick.AddListener(Login);
        Button_Pay.onClick.AddListener(Pay);
        Button_CheckLicense.onClick.AddListener(CheckLicense);
        Button_RestorePurchases.onClick.AddListener(RestorePurchases);
        Button_Consume.onClick.AddListener(Consume);
        Button_QueryProducts.onClick.AddListener(QueryProducts);
        Button_QueryProductInfo.onClick.AddListener(QueryProductInfo);
        Button_QueryProducts2.onClick.AddListener(QueryProducts2);
        Button_OpenGameDetail.onClick.AddListener(OpenGameDetail);
        Button_LatestVersionCode.onClick.AddListener(LatestVersionCode);
        Button_SetLocale.onClick.AddListener(SetLocale);
    }
    
    private void Init()
    {
        string cpId = "119";
        string channelId = "youtube_test";
        string productId = "youtebe_test";
        List<string> list = new()
        {
            "https://os-api-test.ruixuecloud.com/"
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

    public void InitThirdSdk()
    {
        Dictionary<string, object> map = new();
        RuiXueSdk.InitThirdSdk(map, InitThirdSdkResponseDelegate, InitThirdSdkErrorDelegate);
    }

    public void InitThirdSdkResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestResponseDelegate: {data}");
    }
    public void InitThirdSdkErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestErrorDelegate: {data}");
    }
    
    private void OnSetPrivacyAgree()
    {
        RuiXueSdk.SetPrivacyAgree(OnPrivacyAgree);
    }
    
    public void OnPrivacyAgree(bool userClick)
    {
        LogUtil.Log("EventManager", $"userClick: {userClick}");
    }
    
    private void Login()
    {
        
        LogUtil.Log("EventManager", "发起Qoo登录");
        
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.Qoo;
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

    private void Pay()
    {
        Dictionary<string, object> pay = new();
        pay.Add("pay_type", "qoo");
        pay.Add("goods_tag", "youtube_test");
        pay.Add("trade_no", "2312125686062680");
        pay.Add("notify_url", "http://game.pay.result.callback");
        RXPay.Pay(pay, PayResponseDelegate, PayErrorDelegate);
    }
    
    private void PayResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"Pay Response : {data}");
    }

    private void PayErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"Pay Error : {error}");
    }

    private void CheckLicense()
    {
        RXQoo.CheckLicense(CheckLicenseResponseDelegate, CheckLicenseErrorDelegate);
    }
    
    private void CheckLicenseResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"CheckLicense Response : {data}");
    }

    private void CheckLicenseErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"CheckLicense Error : {error}");
    }

    private void RestorePurchases()
    {
        RXQoo.RestorePurchases(RestorePurchasesResponseDelegate, RestorePurchasesErrorDelegate);
    }
    
    private void RestorePurchasesResponseDelegate(string data)
    {
        JsonData jsonData = JsonMapper.ToObject(data);
        LogUtil.Log("EventManager", $"RestorePurchases Response : " +
                                    $"{RXQoo.GetDataFromResponse(jsonData["data"]["msg"].ToString())}");
    }

    private void RestorePurchasesErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"RestorePurchases Error : {error}");
    }

    private void Consume()
    {
        RXQoo.Consume("SOP0000020405", "4cba9072d05f448b87214e9620cd4136", 
            ConsumeResponseDelegate, ConsumeErrorDelegate);
    }
    
    private void ConsumeResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"Consume Response : {data}");
    }

    private void ConsumeErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"Consume Error : {error}");
    }

    public void QueryProducts()
    {
        RXQoo.QueryProducts(QueryProductsResponseDelegate, QueryProductsErrorDelegate);
    }
    
    private void QueryProductsResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"QueryProducts Response : {data}");
    }

    private void QueryProductsErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"QueryProducts Error : {error}");
    }

    public void QueryProductInfo()
    {
        RXQoo.QueryProductInfo("com.ruixue.sdk1", QueryProductInfoResponseDelegate, QueryProductInfoErrorDelegate);
    }
    
    private void QueryProductInfoResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"QueryProductInfo Response : {data}");
    }

    private void QueryProductInfoErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"QueryProductInfo Error : {error}");
    }

    public void QueryProducts2()
    {
        RXQoo.QueryProducts(1, 2, QueryProducts2ResponseDelegate, QueryProducts2ErrorDelegate);
    }
    
    private void QueryProducts2ResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"QueryProducts2 Response : {data}");
    }

    private void QueryProducts2ErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"QueryProducts2 Error : {error}");
    }

    public void OpenGameDetail()
    {
        RXQoo.OpenGameDetail();
    }

    public void LatestVersionCode()
    {
        RXQoo.LatestVersionCode(LatestVersionCodeResponseDelegate, LatestVersionCodeErrorDelegate);
    }
    
    private void LatestVersionCodeResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"LatestVersionCode Response : {data}");
    }

    private void LatestVersionCodeErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"LatestVersionCode Error : {error}");
    }

    public void SetLocale()
    {
        LogUtil.Log("EventManager", $"SetLocale : {RXQoo.SetLocale("en_US")}");
    }

}
