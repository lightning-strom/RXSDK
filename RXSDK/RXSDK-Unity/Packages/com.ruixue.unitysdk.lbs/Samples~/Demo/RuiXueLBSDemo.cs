using System.Collections.Generic;
using RuiXue;
using RuiXue.LBS;
using UnityEngine;
using UnityEngine.Serialization;
using UnityEngine.UI;

public class RuiXueLBSDemo : MonoBehaviour
{
    [SerializeField] private Button _Button_InitLocation;
    [SerializeField] private Button _Button_GetGPSStatusString;
    [SerializeField] private Button _Button_ResetOption;
    [SerializeField] private Button _Button_StartLocation;
    [SerializeField] private Button _Button_StartLocation2;
    [SerializeField] private Button _Button_StopLocation;
    [SerializeField] private Button _Button_WGSLat;
    [SerializeField] private Button _Button_WGSLon;
    [SerializeField] private Button _Button_TransformLon;
    [SerializeField] private Button _Button_TransformLat;
    [SerializeField] private Button _btn_IOS_Init;
    [SerializeField] private Button _btn_IOS_GetLocationInfo;
    [SerializeField] private Button _btn_IOS_IsEnabelLocation;
    [SerializeField] private Button _btn_IOS_ReqLocationAuth;
    [SerializeField] private Button _btn_IOS_SetAllowsBackground;
    [SerializeField] private Button _btn_IOS_SetLocationTimeout;
    
    private void Awake()
    {
        Init();
        OnSetPrivacyAgree();
    }
    
    private void Init()
    {
        string cpId = "114";
        string channelId = "unity_test";
        string productId = "unity_test";
        List<string> list = new()
        {
            "https://rxapi.fishinggamezone.com/"
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
    
    private void Start()
    {
        _Button_InitLocation.onClick.AddListener(OnInitLocation);
        _Button_GetGPSStatusString.onClick.AddListener(OnGetGPSStatusString);
        _Button_ResetOption.onClick.AddListener(OnResetOption);
        _Button_StartLocation.onClick.AddListener(OnStartLocation);
        _Button_StartLocation2.onClick.AddListener(OnStartLocation2);
        _Button_StopLocation.onClick.AddListener(OnStopLocation);
        _Button_WGSLat.onClick.AddListener(OnWGSLat);
        _Button_WGSLon.onClick.AddListener(OnWGSLon);
        _Button_TransformLon.onClick.AddListener(OnTransformLon);
        _Button_TransformLat.onClick.AddListener(OnTransformLat);
#if UNITY_IOS
        _btn_IOS_Init.onClick.AddListener(OnIOSInit);
        _btn_IOS_GetLocationInfo.onClick.AddListener(OnIOSGetLocationInfo);
        _btn_IOS_IsEnabelLocation.onClick.AddListener(OnIOSIsEnabelLocation);
        _btn_IOS_ReqLocationAuth.onClick.AddListener(OnIOSReqLocationAuth);
        _btn_IOS_SetAllowsBackground.onClick.AddListener(OnIOSSetAllowsBackground);
        _btn_IOS_SetLocationTimeout.onClick.AddListener(OnIOSSetLocationTimeout);
#endif
    }

    public void OnInitLocation()
    {
        RXLBSAndroid.InitLocation();
    }

    public void OnGetGPSStatusString()
    {
        LogUtil.Log("EventManager", $"GetGPSStatusString {RXLBSAndroid.GetGPSStatusString(0)}");
    }

    public void OnResetOption()
    {
        RXLBSAndroid.ResetOption(true, true, true, true, true, 
            true, 10000, 10000);
    }

    public void OnStartLocation()
    {
        RXLBSAndroid.StartLocation(true, true, true, true, true, 
            true, 10000, 10000, 
            StartLocationResponseDelegate, StartLocationErrorDelegate);
    }
    
    public void OnStartLocation2()
    {
        string[] arr = { "test", "friend" };
        RXLBSAndroid.StartLocation(arr, 5000, StartLocationResponseDelegate, StartLocationErrorDelegate);
    }
    
    private void StartLocationResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $" StartLocation StartLocationResponseDelegate: {data}");
    }

    private void StartLocationErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $" StartLocation StartLocationErrorDelegate: {error}");
    }
    
    public void StartLocationStringFailForAndroid(int code, string msg, string traceId)
    {
        LogUtil.Log("EventManager", $"StartLocation StartLocationStringFailForAndroid: {code} - {msg} = {traceId}");
    }

    public void OnStopLocation()
    {
        RXLBSAndroid.StopLocation();
    }

    public void OnWGSLat()
    {
        LogUtil.Log("EventManager", $" OnWGSLat : {RXLBSAndroid.WGSLat(1, 3)}");
    }

    public void OnWGSLon()
    {
        LogUtil.Log("EventManager", $" OnWGSLat : {RXLBSAndroid.WGSLon(1, 3)}");
    }

    public void OnTransformLon()
    {
        LogUtil.Log("EventManager", $" OnWGSLat : {RXLBSAndroid.TransformLon(1, 3)}");
    }

    public void OnTransformLat()
    {
        LogUtil.Log("EventManager", $" OnWGSLat : {RXLBSAndroid.TransformLat(1, 3)}");
    }
#if UNITY_IOS
    public void OnIOSInit()
    {
        RXLBSIOS.Init("b3f38f782104520d41d8a8a96462df43");
    }

    public void OnIOSGetLocationInfo()
    {
        RXLBSIOS.GetLocationInfo((data) =>
        {
            LogUtil.Log("EventManager", $"GetLocationInfo rsp: {data}");
        }, (error) =>
        {
            LogUtil.Log("EventManager", $"GetLocationInfo error: {error}");
        });
    }

    public void OnIOSIsEnabelLocation()
    {
        LogUtil.Log("EventManager", $"IsEnableLocation:{RXLBSIOS.IsEnableLocation()}");
    }

    public void OnIOSReqLocationAuth()
    {
        RXLBSIOS.RequestLocationAuthorization((authorized) =>
        {
            LogUtil.Log("EventManager", $"RequestLocationAuthorization:{authorized}");
        });
    }

    public void OnIOSSetAllowsBackground()
    {
        RXLBSIOS.SetAllowsBackgroundLocationUpdates(true);
        LogUtil.Log("EventManager", $"SetAllowsBackgroundLocationUpdates {true}");
    }

    public void OnIOSSetLocationTimeout()
    {
        RXLBSIOS.SetLocationTimeout(10);
        LogUtil.Log("EventManager", $"SetLocationTimeout {10}");
    }
#endif
}
