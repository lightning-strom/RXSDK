using System.Collections.Generic;
using RuiXue;
using RuiXue.Login;
using RuiXue.Pay;
using UnityEngine;

public class RuiXueXutengDemo : MonoBehaviour
{
    [Header("瑞雪公共配置（请替换占位符）")]
    [SerializeField] private string cpId = "replace_with_cp_id";
    [SerializeField] private string productId = "replace_with_product_id";
    [SerializeField] private string channelId = "replace_with_channel_id";
    [SerializeField] private string baseUrl = "https://replace_with_base_url";

    [Header("支付参数（请替换占位符）")]
    [SerializeField] private string goodsTag = "replace_with_goods_tag";
    [SerializeField] private string tradeNo = "replace_with_server_order";

    [Header("角色参数（请替换占位符）")]
    [SerializeField] private string roleId = "replace_with_role_id";
    [SerializeField] private string roleName = "replace_with_role_name";
    [SerializeField] private string serverId = "replace_with_server_id";
    [SerializeField] private string serverName = "replace_with_server_name";

    private void OnGUI()
    {
        GUI.skin.label.fontSize = 26;
        GUI.skin.button.fontSize = 24;

        GUILayout.BeginArea(new Rect(40, 80, Screen.width - 80, Screen.height - 160),
            GUI.skin.box);
        GUILayout.Label("RuiXue Xuteng Demo");
        GUILayout.Space(16);
        GUILayout.Label("请先在 Inspector、Manifest placeholder 和 brsdk.cfg 中配置渠道参数。");
        GUILayout.Space(24);

        if (GUILayout.Button("1. 初始化瑞雪与栩腾 SDK", GUILayout.Height(72)))
            Initialize();
        if (GUILayout.Button("2. 栩腾登录", GUILayout.Height(72)))
            Login();
        if (GUILayout.Button("3. 栩腾支付", GUILayout.Height(72)))
            Pay();
        if (GUILayout.Button("4. 上报角色信息", GUILayout.Height(72)))
            ReportRole();
        if (GUILayout.Button("5. 退出游戏", GUILayout.Height(72)))
            ExitApp();

        GUILayout.EndArea();
    }

    public void Initialize()
    {
        RuiXueSdk.Initialize(cpId, productId, channelId,
            new List<string> { baseUrl }, OnInitialized, Debug.LogError);
    }

    private static void OnInitialized(string response)
    {
        Debug.Log("栩腾瑞雪 SDK 初始化成功：" + response);
        RuiXueSdk.SetPrivacyAgree(isAgree =>
        {
            if (!isAgree)
            {
                Debug.LogWarning("用户未同意隐私协议，停止初始化栩腾渠道。");
                return;
            }

            RuiXueSdk.InitThirdSdk(new Dictionary<string, object>(),
                data => Debug.Log("栩腾渠道初始化成功：" + data), Debug.LogError);
        });
    }

    public void Login()
    {
        RXLogin.Login(new LoginConfig
        {
            loginType = LoginMethod.Xuteng
        }, data => Debug.Log("栩腾登录成功：" + data), Debug.LogError);
    }

    public void Pay()
    {
        RXPay.Pay(new Dictionary<string, object>
        {
            ["hq_type"] = "xuteng",
            ["goods_tag"] = goodsTag,
            ["trade_no"] = tradeNo
        }, data => Debug.Log("栩腾支付结果：" + data), Debug.LogError);
    }

    public void ReportRole()
    {
        RuiXueSdk.SetThirdGameInfo(new GameInfo(2, roleId, serverId)
        {
            roleName = roleName,
            serverName = serverName,
            gameRoleLevel = "replace_with_role_level",
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
            result => Debug.Log("栩腾渠道确认退出：" + result),
            () => Debug.Log("栩腾渠道取消退出"));
    }
}
