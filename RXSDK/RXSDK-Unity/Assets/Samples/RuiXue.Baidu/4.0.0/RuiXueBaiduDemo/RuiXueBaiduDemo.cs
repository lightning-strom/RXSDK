using System.Collections.Generic;
using RuiXue;
using RuiXue.Login;
using RuiXue.Pay;
using UnityEngine;

public class RuiXueBaiduDemo : MonoBehaviour
{
    private const string CpId = "1000197";
    private const string ProductId = "198";
    private const string ChannelId = "203";
    private const string BaseUrl = "https://winykn.jiaxiangyouxi.com";
    private const string BaiduAppId = "123175256";

    [Header("百度渠道配置（请通过 Inspector 安全注入）")]
    [SerializeField] private string appKey;

    private void OnGUI()
    {
        GUI.skin.label.fontSize = 26;
        GUI.skin.button.fontSize = 24;

        GUILayout.BeginArea(new Rect(40, 80, Screen.width - 80, Screen.height - 160),
            GUI.skin.box);
        GUILayout.Label("RuiXue Baidu Demo");
        GUILayout.Space(16);
        GUILayout.Label("当前使用内置的瑞雪与百度测试环境配置。");
        GUILayout.Space(24);

        if (GUILayout.Button("1. 初始化瑞雪与百度 SDK", GUILayout.Height(72)))
            Initialize();
        if (GUILayout.Button("2. 百度登录", GUILayout.Height(72)))
            Login();
        if (GUILayout.Button("3. 百度支付", GUILayout.Height(72)))
            Pay();
        if (GUILayout.Button("4. 显示百度悬浮窗", GUILayout.Height(72)))
            ShowFloatView();
        if (GUILayout.Button("5. 关闭百度悬浮窗", GUILayout.Height(72)))
            CloseFloatView();
        if (GUILayout.Button("6. 上报角色信息", GUILayout.Height(72)))
            ReportRole();
        if (GUILayout.Button("7. 退出游戏", GUILayout.Height(72)))
            ExitApp();

        GUILayout.EndArea();
    }

    public void Initialize()
    {
        if (string.IsNullOrWhiteSpace(appKey))
        {
            Debug.LogError("请先在 Inspector 中配置百度 appkey。");
            return;
        }

        RuiXueSdk.Initialize(CpId, ProductId, ChannelId,
            new List<string> { BaseUrl }, OnInitialized, Debug.LogError);
    }

    private void OnInitialized(string response)
    {
        Debug.Log("百度瑞雪 SDK 初始化成功：" + response);
        RuiXueSdk.SetPrivacyAgree(isAgree =>
        {
            if (!isAgree)
            {
                Debug.LogWarning("用户未同意隐私协议，停止初始化百度渠道。");
                return;
            }

            var config = new Dictionary<string, object>
            {
                ["appid"] = BaiduAppId,
                ["appkey"] = appKey
            };
            RuiXueSdk.InitThirdSdk(config,
                _ => RuiXueSdk.InvokeChannelAction(RuiXueSdk.ChannelActionShowSplash,
                    new Dictionary<string, object>(),
                    data => Debug.Log("百度闪屏展示完成：" + data), Debug.LogError),
                Debug.LogError);
        });
    }

    public void Login()
    {
        RXLogin.Login(new LoginConfig
        {
            loginType = LoginMethod.BaiduNet
        }, data => Debug.Log("百度登录成功：" + data), Debug.LogError);
    }

    public void Pay()
    {
        RXPay.Pay(new Dictionary<string, object>
        {
            ["hq_type"] = "baidunet",
            ["goods_tag"] = "replace_with_goods_tag",
            ["trade_no"] = "replace_with_server_order"
        }, data => Debug.Log("百度支付结果：" + data), Debug.LogError);
    }

    public void ShowFloatView()
    {
        RuiXueSdk.InvokeChannelAction(RuiXueSdk.ChannelActionShowFloatView,
            new Dictionary<string, object>(),
            data => Debug.Log("百度悬浮窗展示结果：" + data), Debug.LogError);
    }

    public void CloseFloatView()
    {
        RuiXueSdk.InvokeChannelAction(RuiXueSdk.ChannelActionHideFloatView,
            new Dictionary<string, object>(),
            data => Debug.Log("百度悬浮窗关闭结果：" + data), Debug.LogError);
    }

    public void ReportRole()
    {
        RuiXueSdk.SetThirdGameInfo(new GameInfo(2, "replace_with_role_id",
            "replace_with_server_id")
        {
            roleName = "replace_with_role_name",
            serverName = "replace_with_server_name",
            gameRoleLevel = "1",
            vipLevel = 0,
            gameRolePower = 0,
            partyId = "replace_with_party_id",
            partyName = "replace_with_party_name",
            experience = "0",
            balance = "0",
            attach = string.Empty
        });
    }

    public void ExitApp()
    {
        RuiXueSdk.ExitApp(
            result => Debug.Log("百度渠道确认退出：" + result),
            () => Debug.Log("百度渠道取消退出"));
    }
}
