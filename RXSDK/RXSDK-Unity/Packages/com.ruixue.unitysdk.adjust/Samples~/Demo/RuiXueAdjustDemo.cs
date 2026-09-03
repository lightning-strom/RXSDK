using RuiXue;
using RuiXue.Adjust;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueAdjustDemo : MonoBehaviour
{

    [SerializeField] private Button _Button_init;
    [SerializeField] private Button _Button_onResume;
    [SerializeField] private Button _Button_onPause;
    [SerializeField] private Button _Button_TrackEvent;

    [SerializeField] private Button _Button_GetData;
    [SerializeField] private Button _Button_AppWillOpenUrl;
    [SerializeField] private Button _Button_ResolveLinkl;
    [SerializeField] private Button _Button_AddSessionCallbackParameter;
    
    [SerializeField] private Button _Button_RemoveSessionCallbackParameter;
    [SerializeField] private Button _Button_ResetSessionCallbackParameters;
    [SerializeField] private Button _Button_AddSessionPartnerParameter;
    [SerializeField] private Button _Button_RemoveSessionPartnerParameter;
    [SerializeField] private Button _Button_ResetSessionPartnerParameters;
    [SerializeField] private Button _Button_SendFirstPackages;

    [SerializeField] private Button _Button_GetAttribution;
    
    
    
    void Start()
    {
        _Button_init.onClick.AddListener(OnInit);
        _Button_onResume.onClick.AddListener(OnResume);
        _Button_onPause.onClick.AddListener(OnPause);
        _Button_TrackEvent.onClick.AddListener(OnTrackEvent);
        _Button_GetData.onClick.AddListener(OnGetData);
        _Button_AppWillOpenUrl.onClick.AddListener(OnAppWillOpenUrl);
        _Button_ResolveLinkl.onClick.AddListener(OnResolveLinkl);
        _Button_AddSessionCallbackParameter.onClick.AddListener(OnAddSessionCallbackParameter);
        
        _Button_RemoveSessionCallbackParameter.onClick.AddListener(OnRemoveSessionCallbackParameter);
        _Button_ResetSessionCallbackParameters.onClick.AddListener(OnResetSessionCallbackParameters);
        _Button_AddSessionPartnerParameter.onClick.AddListener(OnAddSessionPartnerParameter);
        _Button_RemoveSessionPartnerParameter.onClick.AddListener(OnRemoveSessionPartnerParameter);
        _Button_ResetSessionPartnerParameters.onClick.AddListener(OnResetSessionPartnerParameters);
        _Button_SendFirstPackages.onClick.AddListener(OnSendFirstPackages);
        
        _Button_GetAttribution.onClick.AddListener(OnGetAttribution);
        
        EnviInit();//初始化环境成功后登录
    }

    private void OnInit()
    {
        
        string environment = RxAdjustConfig.ENVIRONMENT_SANDBOX;
        RxAdjustConfig config = new RxAdjustConfig("21lpq03nrw8w", environment);
        config.needsCost = true;
        
        config.SetLogLevel(RxLogLevel.DEBUG);
        
        config.OnRxAttributionChangedDelegateListener = OnAttributionChanged;
        config.OnRxEventTrackingSucceededDelegateListener = OnFinishedEventTrackingSucceeded;
        config.OnRxEventTrackingFailedDelegateListener = OnFinishedEventTrackingFailed;
        config.OnRxSessionTrackingSucceededDelegateListener = OnFinishedSessionTrackingSucceeded;
        config.OnRxSessionTrackingFailedDelegateListener = OnFinishedSessionTrackingFailed;
        config.OnRxDeeplinkDelegateResponseListener = LaunchReceivedDeeplink;
        
        RXAdjust.Init(config);
    }

    private void OnResume()
    {
        RXAdjust.OnResume();
    }

    public void OnPause()
    {
        RXAdjust.OnPause();
    }

    public void OnTrackEvent()
    {
        /*RxAdjustEvent rxAdjustEvent = new RxAdjustEvent("abc123");
        RXAdjust.TrackEvent(rxAdjustEvent);*/
        
        /*RxAdjustEvent rxAdjustEvent = new RxAdjustEvent("cshuun");
        rxAdjustEvent.setRevenue(0.01,"EUR");
        RXAdjust.TrackEvent(rxAdjustEvent);*/
        
        /*RxAdjustEvent rxAdjustEvent = new RxAdjustEvent("abc123");
        rxAdjustEvent.setRevenue(0.01,"EUR");
        rxAdjustEvent.setOrderId("{OrderId}");
        RXAdjust.TrackEvent(rxAdjustEvent);*/
        
        /*RxAdjustEvent rxAdjustEvent = new RxAdjustEvent("kmgq59");
        rxAdjustEvent.addCallbackParameter("key","value");
        rxAdjustEvent.addCallbackParameter("foo","bar");
        RXAdjust.TrackEvent(rxAdjustEvent);*/
        
        /*RxAdjustEvent rxAdjustEvent = new RxAdjustEvent("abc123partner");
        rxAdjustEvent.addPartnerParameter("key","value");
        rxAdjustEvent.addPartnerParameter("foo","bar");
        RXAdjust.TrackEvent(rxAdjustEvent);*/
        
        /*RxAdjustEvent rxAdjustEvent = new RxAdjustEvent("abc123backId");
        rxAdjustEvent.setCallbackId("Your-Custom-Id");
        RXAdjust.TrackEvent(rxAdjustEvent);*/
        
        RxAdjustEvent rxAdjustEvent = new RxAdjustEvent("36il0v");
        RXAdjust.TrackEvent(rxAdjustEvent);
        
    }

    public void OnGetData()
    {
        string uri = RXAdjust.GetData();
        LogUtil.Log("EventManager", $"OnGetData {uri}");
    }

    public void OnAppWillOpenUrl()
    {
        RXAdjust.AppWillOpenUrl("test");
    }

    public void OnResolveLinkl()
    {
        RXAdjust.ResolveLink("test", new[]{"example.com"}); 
    }

    public void OnAddSessionCallbackParameter()
    {
        RXAdjust.AddSessionCallbackParameter("foo", "bar");
    }

    public void OnRemoveSessionCallbackParameter()
    {
        RXAdjust.RemoveSessionCallbackParameter("foo");
    }

    public void OnResetSessionCallbackParameters()
    {
        RXAdjust.ResetSessionCallbackParameters();
    }

    public void OnAddSessionPartnerParameter()
    {
        RXAdjust.AddSessionPartnerParameter("foo", "bar");
    }

    public void OnRemoveSessionPartnerParameter()
    {
        RXAdjust.RemoveSessionPartnerParameter("foo");
    }

    public void OnResetSessionPartnerParameters()
    {
        RXAdjust.ResetSessionPartnerParameters();
    }

    public void OnSendFirstPackages()
    {
        RXAdjust.SendFirstPackages();
    }

    public void OnGetAttribution()
    {
        LogUtil.Log("EventManager", RXAdjust.GetAttribution().adid);
    }

    public void OnAttributionChanged(RxAdjustAttribution attribution)
    {
        LogUtil.Log("EventManager", attribution.adid);
    }

    public void OnFinishedEventTrackingSucceeded(RxAdjustEventSuccess eventSuccessResponseData)
    {
        LogUtil.Log("EventManager", eventSuccessResponseData.ToString());
    }

    public void OnFinishedEventTrackingFailed(RxAdjustEventFailure rxAdjustEventFailure)
    {
        LogUtil.Log("EventManager", rxAdjustEventFailure.ToString());
    }

    public void OnFinishedSessionTrackingSucceeded(RxAdjustSessionSuccess rxAdjustSessionSuccess)
    {
        LogUtil.Log("EventManager", rxAdjustSessionSuccess.ToString());
    }

    public void OnFinishedSessionTrackingFailed(RxAdjustSessionFailure rxAdjustSessionFailure)
    {
        LogUtil.Log("EventManager", rxAdjustSessionFailure.ToString());
    }

    public bool LaunchReceivedDeeplink(string deeplink)
    {
        LogUtil.Log("EventManager", deeplink.ToString());
        return true;
    }
    
    private void EnviInit()
    {
        string cpId = "114";
        string channelId = "iOS";
        string productId = "1002";
        List<string> list = new()
        {
            "http://cn-api-test.ruixuecloud.com"
        };
        
        RuiXueSdk.Initialize(cpId,productId, channelId, list, RequestResponseDelegate, RequestErrorDelegate);
    }

    private void RequestResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestResponseDelegate: {data}");
        CountLogin();
    }

    private void RequestErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"RequestErrorDelegate: {error}");
    }
    
    private void CountLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.Username;
        loginConfig.username = "xuqiangtest1123";
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
}
