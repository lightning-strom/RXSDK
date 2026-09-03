using System;
using System.Collections.Generic;
using RuiXue;
using RuiXue.Performance;
using RuiXue.UWA;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueUwaDemo : MonoBehaviour
{

    [SerializeField] private Button Button_Init;
    [SerializeField] private Button Button_Changesene;
    [SerializeField] private Button Networklatency;
    [SerializeField] private Button Button_Setuser;
    [SerializeField] private Button Button_Setuserid;
    [SerializeField] private Button Button_Setquality;
    [SerializeField] private Button Button_Beginsceneload;
    [SerializeField] private Button Button_Endsceneload;
    [SerializeField] private Button Button_Beginignore;
    [SerializeField] private Button Button_Endignore;
    [SerializeField] private Button Button_Sdkinfo;
    [SerializeField] private Button Button_Sdkdata;
    [SerializeField] private Button Button_Setscreenshotratio;
    [SerializeField] private Button Button_PerformReport;
    
    [SerializeField] private Text _textMsg;

   
    
    private void Awake()
    {
        
#if UNITY_ANDROID
        RuiXueUWAGPM.StaticInit(
            "https://2uq9pq.pwypyq.com", 
            "7d979a9a-57c9-467e-ac67-e4a8c418cf4b", 
            "3.25.7",
            "101",
            debug: true
        );
        RuiXueSdk.SetLogEnable(true);
        OnBtnInit();
#elif UNITY_IOS
        UWAGPM.StaticInit(
            "https://soidwxk.jiaxiangxm.com", 
            "d6abae78-9cd0-4d61-99fd-0c705ad18eab", 
            "3.25.7",
            "101",
            debug: true
        );
#endif
    }
    
    private void OnBtnInit()
    {
        string cpId = "1000102";
        string channelId = "101";
        string productId = "142";
        List<string> list = new()
        {
            "https://umusblhbv.wjhmqn.com"
        };
        
        RuiXueSdk.Initialize(cpId,productId, channelId, list, RequestResponseDelegate, RequestErrorDelegate);
    }

    private void RequestResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestResponseDelegate: {data}");
    }

    private void RequestErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"RequestErrorDelegate: {error}");
    }

    private void Start()
    {
        Button_Init.onClick.AddListener(GetRegisterState);
        Button_Changesene.onClick.AddListener(ChangeScene);
        Networklatency.onClick.AddListener(SetNetworkLatency);
        Button_Setuser.onClick.AddListener(SetUser);
        Button_Setuserid.onClick.AddListener(SetUserId);
        Button_Setquality.onClick.AddListener(SetQuality);
        Button_Beginsceneload.onClick.AddListener(BeginSceneLoad);
        Button_Endsceneload.onClick.AddListener(EndSceneLoad);
        Button_Beginignore.onClick.AddListener(BeginIgnore);
        Button_Endignore.onClick.AddListener(EndIgnore);
        Button_Sdkinfo.onClick.AddListener(XXXGetSDKInfo);
        Button_Sdkdata.onClick.AddListener(GetSDKData);
        Button_Setscreenshotratio.onClick.AddListener(SetScreenShotRatio);
        Button_PerformReport.onClick.AddListener(ReportData);
    }

    private void GetRegisterState()
    {
        LogUtil.Log("RuiXueUwaDemo", "注册状态：" + RuiXueUWAGPM.GetRegisterState());
    }

    private void ChangeScene()
    {
        RuiXueUWAGPM.ChangeScene("test");
    }

    private void SetNetworkLatency()
    {
        RuiXueUWAGPM.SetNetworkLatency(1);
    }

    private void SetUser()
    {
        RuiXueUWAGPM.SetUser("22222");
    }

    private void SetUserId()
    {
        RuiXueUWAGPM.SetUserId("111111");
    }

    private void SetQuality()
    {
        RuiXueUWAGPM.SetQuality(1);
    }

    private void BeginSceneLoad()
    {
        RuiXueUWAGPM.BeginSceneLoad("test");
    }

    private void EndSceneLoad()
    {
        RuiXueUWAGPM.EndSceneLoad();
    }

    private void BeginIgnore()
    {
        RuiXueUWAGPM.BeginIgnore();
    }

    private void EndIgnore()
    {
        RuiXueUWAGPM.EndIgnore();
    }
    

    private void XXXGetSDKInfo()
    {
        LogUtil.Log("RuiXueUwaDemo", "SDK INFO, 是否是模拟器: " + RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.ROOT));
        _textMsg.text = "SDK INFO, 是否是模拟器: " + RuiXueUWAGPM.GetSDKInfo(UWAGPM.SDKInfoType.RESOLUTION);
    }

    private void GetSDKData()
    {
        LogUtil.Log("RuiXueUwaDemo", "GPU 温度 " + RuiXueUWAGPM.GetSDKData(UWAGPM.SDKMetricType.CPUTEMP));
        LogUtil.Log("RuiXueUwaDemo", "CPU 温度 " + RuiXueUWAGPM.GetSDKData(UWAGPM.SDKMetricType.GPUTEMP));
    }

    private void ReportData()
    {
        PerformManceReport.PerformReport();
    }
    

    private void SetScreenShotRatio()
    {
        RuiXueUWAGPM.SetScreenShotRatio(1);
    }

}
