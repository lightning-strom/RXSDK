using System.Collections.Generic;
using RuiXue;
using RuiXue.Login;
using RuiXue.Pay;
using RuiXue.Quick;
using RuiXue.Quick.Impl;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueQuickDemo : MonoBehaviour
{
    
    [SerializeField] private Button Button_Login;
    [SerializeField] private Button Button_Pay;
    [SerializeField] private Button Button_SetRoleInfo;
    [SerializeField] private Button Button_OnLogout;
    [SerializeField] private Button Button_RealName;
    [SerializeField] private Button Button_ExitApp;
    
    void Start()
    {
        Button_Login.onClick.AddListener(Login);
        Button_Pay.onClick.AddListener(Pay);
        Button_SetRoleInfo.onClick.AddListener(SetRoleInfo);
        Button_OnLogout.onClick.AddListener(OnLogout);
        Button_RealName.onClick.AddListener(RealName);
        Button_ExitApp.onClick.AddListener(ExitApp);
    }
    
    private void Login()
    {
        
        LogUtil.Log("EventManager", "发起Quick登录");
        
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.QUICK;
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

    private void Pay()
    {
        Dictionary<string, object> pay = new Dictionary<string, object>();
        pay.Add("hq_type", "quick");
        pay.Add("goods_tag", "007_test");
        pay.Add("env", 1);
        pay.Add("age", 18);
        Dictionary<string, object> gameRoleInfoMap = new Dictionary<string, object>();
        gameRoleInfoMap.Add("serverId", "1");// 服务器ID，其值必须为数字字符串
        gameRoleInfoMap.Add("serverName", "火星服务器");// 服务器名称
        gameRoleInfoMap.Add("gameRoleName", "裁决之剑");// 角色名称
        gameRoleInfoMap.Add("gameRoleId", "1121121");// 角色ID
        gameRoleInfoMap.Add("gameUserLevel", "12");// 等级
        gameRoleInfoMap.Add("vipLevel", "Vip4");// VIP等级
        gameRoleInfoMap.Add("gameBalance", "5000");// 角色现有金额
        gameRoleInfoMap.Add("roleCreateTime", "1473141432"); // UC与1881渠道必传，值为10位数时间戳
        gameRoleInfoMap.Add("partyName", "");// 公会名字
        pay.Add("game_role_info", gameRoleInfoMap);
        RXPay.Pay(pay, PayResponseDelegate, PayErrorDelegate);
    }
    
    private void PayResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"Pay Response : {data}");
    }

    private void PayErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"Pay Error : {error}");
    }
    
    
    public void SetRoleInfo()
    {
        RXGameRoleInfo rxGameRoleInfo = new RXGameRoleInfo();
        rxGameRoleInfo.serverID = "1";// 服务器ID
        rxGameRoleInfo.serverName = "火星服务器";// 服务器名称
        rxGameRoleInfo.gameRoleName = "裁决之剑";// 角色名称
        rxGameRoleInfo.gameRoleID = "1121121";// 角色ID
        rxGameRoleInfo.gameUserLevel = "12";// 等级
        rxGameRoleInfo.vipLevel = "9"; // 设置当前用户vip等级，必须为整型字符串
        rxGameRoleInfo.gameBalance = "5000"; // 角色现有金额
        rxGameRoleInfo.gameUserLevel = "12"; // 设置游戏角色等级
        rxGameRoleInfo.partyName = "无敌联盟"; // 设置帮派，公会名称
        rxGameRoleInfo.roleCreateTime = "1473141432"; // UC与1881渠道必传，值为10位数时间戳
        rxGameRoleInfo.partyId = "1100"; // 360渠道参数，设置帮派id，必须为整型字符串
        rxGameRoleInfo.gameRoleGender = "男"; // 360渠道参数
        rxGameRoleInfo.gameRolePower = "38"; // 360渠道参数，设置角色战力，必须为整型字符串
        rxGameRoleInfo.partyRoleId = "11"; // 360渠道参数，设置角色在帮派中的id
        rxGameRoleInfo.partyRoleName = "帮主"; // 360渠道参数，设置角色在帮派中的名称
        rxGameRoleInfo.professionId = "38"; // 360渠道参数，设置角色职业id，必须为整型字符串
        rxGameRoleInfo.profession = "法师"; // 360渠道参数，设置角色职业名称
        rxGameRoleInfo.friendlist = "无"; // 360渠道参数，设置好友关系列表，格式请参考：http://open.quicksdk.net/help/detail/aid/190
        RXQuickWrapper.SetGameRoleInfo(rxGameRoleInfo, true);
    }

    public void OnLogout()
    {
        RXLogin.Logout(LogOutResponseDelegate, LogOutErrorDelegate);
    }

    private void LogOutResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"LogOutResponseDelegate: data: {data}");
    }
    
    private void  LogOutErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"LogOutErrorDelegate : {error}");
    }

    public void RealName()
    {
        RXQuickWrapper.VerifyRealName(RealNameResponseDelegate, RealNameErrorDelegate);
    }
    
    private void RealNameResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"LogOutResponseDelegate: data: {data}");
    }
    
    private void RealNameErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"LogOutErrorDelegate : {error}");
    }
    
    public void ExitApp()
    {
        RuiXueSdk.ExitApp(ExitConfirm, ExitCancel);
    }
    
    private void ExitConfirm(string res)
    {
        LogUtil.Log("EventManager", $" ExitApp res: {res}");
    }

    private void ExitCancel()
    {
        LogUtil.Log("EventManager", $" ExitCancel");
    }

}
