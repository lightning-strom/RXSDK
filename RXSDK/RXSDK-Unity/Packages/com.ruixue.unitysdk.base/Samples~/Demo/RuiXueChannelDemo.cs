using System.Collections.Generic;
using RuiXue;
using RuiXue.Login;
using UnityEngine;
using UnityEngine.SceneManagement;

public class RuiXueChannelDemo : MonoBehaviour
{
    [Header("瑞雪 SDK 配置")]
    [SerializeField] private string cpId = "1000361";
    [SerializeField] private string productId = "301";
    [SerializeField] private string channelId = "2004";
    [SerializeField] private string baseUrl = "https://omlhj-api.nacardgame.com";

    [Header("百度配置")]
    [SerializeField] private string baiduAppId;
    [SerializeField] private string baiduAppKey;

    [Header("MuMu 配置")]
    [SerializeField, Range(0, 2)] private int mumuSplashType;

    private void OnGUI()
    {
        const float width = 520f;
        GUILayout.BeginArea(new Rect(24f, 24f, width, 620f),
            "渠道功能", GUI.skin.window);
        if (GUILayout.Button("初始化瑞雪 SDK", GUILayout.Height(64f))) InitializeSdk();
        if (GUILayout.Button("初始化百度并展示闪屏", GUILayout.Height(64f))) InitializeBaidu();
        if (GUILayout.Button("百度登录", GUILayout.Height(64f))) BaiduLogin();
        if (GUILayout.Button("初始化 MuMu 并展示闪屏", GUILayout.Height(64f))) InitializeMumu();
        if (GUILayout.Button("显示渠道浮窗", GUILayout.Height(64f))) ShowChannelFloatView();
        if (GUILayout.Button("隐藏渠道浮窗", GUILayout.Height(64f))) HideChannelFloatView();
        if (GUILayout.Button("返回 Base Demo", GUILayout.Height(64f))) BackToBaseDemo();
        GUILayout.EndArea();
    }

    public void InitializeSdk()
    {
        RuiXueSdk.Initialize(cpId, productId, channelId,
            new List<string> { baseUrl },
            data =>
            {
                Debug.Log("瑞雪 SDK 初始化成功：" + data);
                RuiXueSdk.SetPrivacyAgree(_ => Debug.Log("已设置隐私同意"));
            },
            Debug.LogError);
    }

    public void InitializeBaidu()
    {
        // if (string.IsNullOrWhiteSpace(baiduAppId) ||
        //     string.IsNullOrWhiteSpace(baiduAppKey))
        // {
        //     Debug.LogError("请先配置百度 appid/appkey。");
        //     return;
        // }

        RuiXueSdk.InitThirdSdk(new Dictionary<string, object>
        {
            ["appid"] = "123175256",
            ["appkey"] = "mLhd8AGHGDlF0ALlqaAcfGCULQjufOF9"
        }, _ => ShowSplash(new Dictionary<string, object>()), Debug.LogError);
    }

    public void BaiduLogin()
    {
        RXLogin.Login(new LoginConfig
        {
            loginType = LoginMethod.BaiduNet
        }, data => Debug.Log("百度登录成功：" + data), Debug.LogError);
    }

    public void InitializeMumu()
    {
        RuiXueSdk.InitThirdSdk(new Dictionary<string, object>
        {
            ["debugMode"] = Debug.isDebugBuild
        }, _ => ShowSplash(new Dictionary<string, object>
        {
            ["splashType"] = mumuSplashType
        }), Debug.LogError);
    }

    public void ShowChannelFloatView()
    {
        RuiXueSdk.InvokeChannelAction(RuiXueSdk.ChannelActionShowFloatView,
            new Dictionary<string, object>(), Debug.Log, Debug.LogError);
    }

    public void HideChannelFloatView()
    {
        RuiXueSdk.InvokeChannelAction(RuiXueSdk.ChannelActionHideFloatView,
            new Dictionary<string, object>(), Debug.Log, Debug.LogError);
    }

    public void BackToBaseDemo()
    {
        SceneManager.LoadScene("RuiXueBaseDemo");
    }

    private static void ShowSplash(Dictionary<string, object> parameters)
    {
        RuiXueSdk.InvokeChannelAction(RuiXueSdk.ChannelActionShowSplash,
            parameters, Debug.Log, Debug.LogError);
    }
}
