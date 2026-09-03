using System.Collections.Generic;
using RuiXue;
using RuiXue.WeiXin;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueWeixinDemo : MonoBehaviour
{
    
    [SerializeField] public Button _Button_IsWXAppInstalled;
    [SerializeField] public Button _Button_OpenWXApp;
    [SerializeField] public Button _Button_OpenMiniProgram;
    
    void Start()
    {
        _Button_IsWXAppInstalled.onClick.AddListener(OnIsWXAppInstalled);
        _Button_OpenWXApp.onClick.AddListener(OnOpenWXApp);
        _Button_OpenMiniProgram.onClick.AddListener(OnOpenMiniProgram);
#if UNITY_IOS
        // RXWeiXin.ConfigUniversalLink("https://open.weileapp.com/toolapi/");
        // RXWeiXin.ConfigUniversalLink("https://api.7nightapp.com/ulink/");
#endif
    }

    public void OnIsWXAppInstalled()
    {
        bool isTag = RXWeiXin.IsWXAppInstalled();
        LogUtil.Log("EventManager", $"IsWXAppInstalled : {isTag}");
    }

    public void OnOpenWXApp()
    {
        bool isTag = RXWeiXin.OpenWXApp();
        LogUtil.Log("EventManager", $"OpenWXApp : {isTag}");
    }

    public void OnOpenMiniProgram()
    {
        Dictionary<string, object> dic = new();
        dic.Add("username", "gh_f24d58f11458");
        dic.Add("appid","wx5d34c56f0c58e881");
        dic.Add("path","pages/fromAppPay/index?state=bca7b9ab-f74a-4186-af88-bfdf2323a3fb&customerNo=10089891566&goodsName=831000076&customerRequestNo=2402053225158958v1&orderAmount=0.01&launchSource=MINI_PROGRAM");
        dic.Add("miniProgramType","0");
        RXWeiXin.OpenMiniProgram(dic, OpenMiniProgramResponseDelegate, OpenMiniProgramErrorDelegate);
    }
    
    public void OpenMiniProgramResponseDelegate(string data)
    {
        LogUtil.Log("EventManager",$"OpenMiniProgramResponseDelegate: {data}");
    }
    public void OpenMiniProgramErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"OpenMiniProgramErrorDelegate: {data}");
    }

}
