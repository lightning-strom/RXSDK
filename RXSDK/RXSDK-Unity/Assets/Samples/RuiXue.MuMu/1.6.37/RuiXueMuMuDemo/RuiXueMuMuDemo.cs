using System.Collections.Generic;
using RuiXue;
using RuiXue.Login;
using UnityEngine;

public class RuiXueMuMuDemo : MonoBehaviour
{
    [Header("瑞雪 SDK 配置")]
    [SerializeField] private string cpId;
    [SerializeField] private string productId;
    [SerializeField] private string channelId;
    [SerializeField] private string baseUrl;
    [SerializeField, Range(0, 2)] private int splashType;

    public void Initialize()
    {
        RuiXueSdk.SetSdkCallback(OnPublicCallback, OnLogout, OnSwitchAccount);
        RuiXueSdk.Initialize(cpId, productId, channelId,
            new List<string> { baseUrl }, OnInitialized, Debug.LogError);
    }

    private void OnInitialized(string response)
    {
        Debug.Log("MuMu 瑞雪 SDK 初始化成功：" + response);
        RuiXueSdk.SetPrivacyAgree(_ =>
        {
            RuiXueSdk.InitThirdSdk(new Dictionary<string, object>
                {
                    ["debugMode"] = Debug.isDebugBuild
                },
                _ => RuiXueSdk.InvokeChannelAction(RuiXueSdk.ChannelActionShowSplash,
                    new Dictionary<string, object>
                    {
                        ["splashType"] = splashType
                    },
                    data => Debug.Log("MuMu 渠道闪屏展示完成：" + data), Debug.LogError),
                Debug.LogError);
        });
    }

    public void Login()
    {
        LoginConfig config = new LoginConfig
        {
            loginType = LoginMethod.MuMu
        };
        RXLogin.Login(config,
            response => Debug.Log("MuMu 登录成功：" + response),
            Debug.LogError);
    }

    public void ReportRoleCreated()
    {
        ReportRoleEvent(1);
    }

    public void ReportLoginSucceeded()
    {
        ReportRoleEvent(2);
    }

    public void ReportRoleUpgraded()
    {
        ReportRoleEvent(3);
    }

    private static void ReportRoleEvent(int type)
    {
        GameInfo info = new GameInfo(type, "1001", "S001")
        {
            roleName = "剑圣",
            serverName = "华东1区",
            gameRoleLevel = "36",
            vipLevel = 5,
            gameRolePower = 98800,
            partyId = "g_8801",
            partyName = "无双战盟",
            balance = "9999",
            attach = "{\"roleType\":\"战士\"}"
        };
        RuiXueSdk.SetThirdGameInfo(info);
    }

    private static void OnPublicCallback(int type, string data)
    {
        Debug.Log($"MuMu 渠道 UI 回调：type={type}, data={data}");
        if (type == 1)
        {
            Time.timeScale = 1f;
            AudioListener.pause = false;
        }
    }

    private static void OnLogout(int code, string message)
    {
        Debug.Log($"MuMu 退出登录：code={code}, message={message}");
    }

    private static bool OnSwitchAccount(int code, string data)
    {
        Debug.Log($"MuMu 切换账号：code={code}, data={data}");
        return true;
    }
}
