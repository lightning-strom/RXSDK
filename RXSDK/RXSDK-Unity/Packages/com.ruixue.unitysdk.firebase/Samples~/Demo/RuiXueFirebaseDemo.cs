using System;
using System.Collections.Generic;
using RuiXue;
using RuiXue.Firebase;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueFirebaseDemo : MonoBehaviour
{

    [SerializeField] private Button _Button_InitFirebaseAnalytics;
    [SerializeField] private Button _Button_LogEvent;
    [SerializeField] private Button _Button_SetDefaultEventParameters;
    [SerializeField] private Button _Button_SetUserProperty;
    [SerializeField] private Button _Button__SetAnalyticsUserId;
    [SerializeField] private Button _Button_SetAnalyticsCollectionEnabled;
    
    [SerializeField] private Button _Button_SetCustomKey;
    [SerializeField] private Button _Button_SetCustomKeys;
    [SerializeField] private Button _Button_Log;
    [SerializeField] private Button _Button_SetCrashUserId;
    [SerializeField] private Button _Button_RecordException;
    [SerializeField] private Button _Button_SetCrashlyticsCollectionEnabled;
    
    [SerializeField] private Button _Button_SetFCMCallBack;
    [SerializeField] private Button _Button_ClearFCMCallBack;
    
    void Start()
    {
        _Button_InitFirebaseAnalytics.onClick.AddListener(OnInitFirebaseAnalytics);
        _Button_LogEvent.onClick.AddListener(OnLogEvent);
        _Button_SetDefaultEventParameters.onClick.AddListener(OnSetDefaultEventParameters);
        _Button_SetUserProperty.onClick.AddListener(OnSetUserPropert);
        _Button__SetAnalyticsUserId.onClick.AddListener(OnSetAnalyticsUserId);
        _Button_SetAnalyticsCollectionEnabled.onClick.AddListener(OnSetAnalyticsCollectionEnabled);
        
        _Button_SetCustomKey.onClick.AddListener(OnSetCustomKey);
        _Button_SetCustomKeys.onClick.AddListener(OnSetCustomKeys);
        _Button_Log.onClick.AddListener(OnLog);
        _Button_SetCrashUserId.onClick.AddListener(OnSetCrashUserId);
        _Button_RecordException.onClick.AddListener(OnRecordException);
        _Button_SetCrashlyticsCollectionEnabled.onClick.AddListener(OnSetCrashlyticsCollectionEnabled);
        
        _Button_SetFCMCallBack.onClick.AddListener(OnSetFCMCallBack);
        _Button_ClearFCMCallBack.onClick.AddListener(OnClearFCMCallBack);
    }

    public void OnInitFirebaseAnalytics()
    { 
        LogUtil.Log("EventManager", "OnInitFirebaseAnalytics");
        RXFirebase.InitFirebaseAnalytics();
    }

    public void OnLogEvent()
    {
        Dictionary<string, object> dic = new();
        dic.Add(RxFirebaseAnalytics.Param.METHOD, "sign");
        RXFirebase.LogEvent(RxFirebaseAnalytics.Event.SIGN_UP, dic);
    }

    public void OnSetDefaultEventParameters()
    {
        Dictionary<string, object> parameters = new();
        parameters.Add("level_name", "Caverns01");
        parameters.Add("level_difficulty", 4);
        RXFirebase.SetDefaultEventParameters(parameters);
    }

    public void OnSetUserPropert()
    {
        RXFirebase.SetUserProperty("favorite_food", "food");
    }

    public void OnSetAnalyticsUserId()
    {
        RXFirebase.SetAnalyticsUserId("123456");
    }

    public void OnSetAnalyticsCollectionEnabled()
    {
        RXFirebase.SetAnalyticsCollectionEnabled(true);
    }

    public void OnSetCustomKey()
    {
        RXFirebase.SetCustomKey("my_string_key", "foo");
    }

    public void OnSetCustomKeys()
    {
        Dictionary<string, object> keysAndValues = new();
        keysAndValues.Add("string key", "string value");
        keysAndValues.Add("string key 2", "string  value 2");
        keysAndValues.Add("boolean key", true);
        keysAndValues.Add("boolean key 2", false);
        keysAndValues.Add("float key", 1.01f);
        keysAndValues.Add("float key 2", 2.02f);
        RXFirebase.SetCustomKeys(keysAndValues);
    }

    public void OnLog()
    {
        RXFirebase.Log("message");
    }

    public void OnSetCrashUserId()
    {
        RXFirebase.SetCrashUserId("user123456789");
    }

    public void OnRecordException()
    {
        RXFirebase.RecordException(new Exception("测试看看"));
    }

    public void OnSetCrashlyticsCollectionEnabled()
    {
        RXFirebase.SetCrashlyticsCollectionEnabled(true);
    }

    public void OnSetFCMCallBack()
    {
        RXFirebase.SetFCMCallBack(MessageReceivedDelegate, NewTokenDelegate);
    }

    public void OnClearFCMCallBack()
    {
        RXFirebase.ClearFCMCallBack();
    }

    public void MessageReceivedDelegate(RemoteMessage message)
    {
        foreach (var key in message.data)
        {
            LogUtil.Log("EventManager", $"MessageReceivedDelegate data: {key.Key} ---- {key.Value}");
        }
        LogUtil.Log("EventManager", $"MessageReceivedDelegate {message.messageId}");
    }

    public void NewTokenDelegate(string token)
    {
        LogUtil.Log("EventManager", $"NewTokenDelegate {token}");
    }

}
