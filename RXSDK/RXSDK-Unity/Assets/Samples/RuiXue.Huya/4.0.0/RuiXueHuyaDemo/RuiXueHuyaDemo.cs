using System.Collections.Generic;
using RuiXue;
using RuiXue.Login;
using RuiXue.Pay;
using UnityEngine;

public class RuiXueHuyaDemo : MonoBehaviour
{
    private const string CpId = "114";
    private const string ProductId = "1002";
    private const string ChannelId = "100";
    private const string BaseUrl = "https://cn-api-test.ruixueyun.com";
    private const bool LandscapeMode = true;

    [Header("虎牙渠道配置（请通过 Inspector 安全注入）")]
    [SerializeField] private string gameId;
    [SerializeField] private string loginClientId;
    [SerializeField] private string loginClientSecret;
    [SerializeField] private string payAppId;

    private void OnGUI()
    {
        GUI.skin.label.fontSize = 26;
        GUI.skin.button.fontSize = 24;

        GUILayout.BeginArea(new Rect(40, 80, Screen.width - 80, Screen.height - 160),
            GUI.skin.box);
        GUILayout.Label("RuiXue Huya Demo");
        GUILayout.Space(16);
        GUILayout.Label("当前使用内置的瑞雪与虎牙测试环境配置。");
        GUILayout.Space(24);

        if (GUILayout.Button("1. 初始化瑞雪与虎牙 SDK", GUILayout.Height(72)))
            Initialize();
        if (GUILayout.Button("2. 虎牙登录", GUILayout.Height(72)))
            Login();
        if (GUILayout.Button("3. 虎牙支付", GUILayout.Height(72)))
            Pay();
        if (GUILayout.Button("4. 上报角色信息", GUILayout.Height(72)))
            ReportRole();

        GUILayout.EndArea();
    }

    public void Initialize()
    {
        if (string.IsNullOrWhiteSpace(gameId) ||
            string.IsNullOrWhiteSpace(loginClientId) ||
            string.IsNullOrWhiteSpace(loginClientSecret) ||
            string.IsNullOrWhiteSpace(payAppId))
        {
            Debug.LogError("请先在 Inspector 中配置虎牙渠道参数。");
            return;
        }

        RuiXueSdk.SetSdkCallback(OnPublicCallback, OnLogout, OnSwitchAccount);
        RuiXueSdk.Initialize(CpId, ProductId, ChannelId,
            new List<string> { BaseUrl }, OnInitialized, Debug.LogError);
    }

    private void OnInitialized(string response)
    {
        Debug.Log("虎牙瑞雪 SDK 初始化成功：" + response);
        RuiXueSdk.SetPrivacyAgree(_ =>
        {
            Dictionary<string, object> config = new Dictionary<string, object>
            {
                ["gameId"] = gameId,
                ["loginClientID"] = loginClientId,
                ["loginClientSecret"] = loginClientSecret,
                ["payAppId"] = payAppId,
                ["debugMode"] = true,
                ["landscapeMode"] = LandscapeMode,
                ["isShowSwitchCountInGameCenter"] = true
            };
            RuiXueSdk.InitThirdSdk(config,
                data => Debug.Log("虎牙渠道初始化成功：" + data), Debug.LogError);
        });
    }

    public void Login()
    {
        RXLogin.Login(new LoginConfig
        {
            loginType = LoginMethod.Huya
        }, data => Debug.Log("虎牙登录成功：" + data), Debug.LogError);
    }

    public void Pay()
    {
        RXPay.Pay(new Dictionary<string, object>
        {
            ["hq_type"] = "huya",
            ["goods_tag"] = "bytest",
            ["trade_no"] = "123123123123",
            ["currency"] = "CNY",
            ["age"] = 18
        }, data => Debug.Log("虎牙支付结果：" + data), Debug.LogError);
    }

    public void ReportRole()
    {
        RuiXueSdk.SetThirdGameInfo(new GameInfo(2, "role_10001", "server_1")
        {
            roleName = "角色名",
            serverName = "一区",
            gameRoleLevel = "12",
            attach = "{\"career\":\"战士\",\"chapter\":\"第一章\"," +
                     "\"realm_id\":\"1\",\"realm_name\":\"人界\"," +
                     "\"sdk_channel_id\":\"huya\"}"
        });
    }

    private static void OnPublicCallback(int type, string data)
    {
        Debug.Log($"虎牙渠道回调：type={type}, data={data}");
    }

    private static void OnLogout(int code, string message)
    {
        Debug.Log($"虎牙退出登录：code={code}, message={message}");
    }

    private static bool OnSwitchAccount(int code, string data)
    {
        Debug.Log($"虎牙切换账号：code={code}, data={data}");
        return true;
    }
}
