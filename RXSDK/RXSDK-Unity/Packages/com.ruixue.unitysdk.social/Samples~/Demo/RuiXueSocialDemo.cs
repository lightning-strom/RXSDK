using System.Collections.Generic;
using RuiXue;
using RuiXue.LBS;
using RuiXue.Login;
using RuiXue.Social;
using UnityEngine;
using UnityEngine.UI;

public class RuiXueSocialDemo : MonoBehaviour
{

    [SerializeField] private Button _Button_LbsRadius;
    [SerializeField] private Button _Button_UserSetCustom;
    [SerializeField] private Button _Button_LbsUpdate;

    [SerializeField] private Button _Button_LbsDelete;
    [SerializeField] private Button _Button_RelationAdd;
    [SerializeField] private Button _Button_RelationDelete;

    [SerializeField] private Button _Button_UpdateRemarks;

    [SerializeField] private Button _Button_RelationList;

    [SerializeField] private Button _Button_HasRelation;

    [SerializeField] private Button _Button_AddFriends;

    [SerializeField] private Button _Button_RemoveFriends;

    [SerializeField] private Button _Button_UpdateFriendRemarks;

    [SerializeField] private Button _Button_RelationFriends;

    [SerializeField] private Button _Button_IsFriend;
    
    private string[] arr =
    {
        "rxuNZP3GnkxYVXMf2xW6UZEKdg0z7wLm",
        "rxufyWGAzrN4vQYuNML0SQ7z5PqOdLwo",
        "rxuC0Q9_GxeMY1rHjnr_Im1PY2O3E-pr"
    };
    
    private readonly string _customRelationKey = "test";
    private readonly string _openID = "rxuNZP3GnkxYVXMf2xW6UZEKdg0z7wLm";
    

    private void Awake()
    {
        Init();
        OnSetPrivacyAgree();
        // OnLogin();
        
        InitLBS();
    }
    
    void Start()
    {
        _Button_LbsRadius.onClick.AddListener(OnLbsRadius);
        _Button_UserSetCustom.onClick.AddListener(OnUserSetCustom);
        _Button_LbsUpdate.onClick.AddListener(OnLbsUpdate);
        _Button_LbsDelete.onClick.AddListener(OnLbsDelete);
        _Button_RelationAdd.onClick.AddListener(OnRelationAdd);
        _Button_RelationDelete.onClick.AddListener(OnRelationDelete);
        _Button_UpdateRemarks.onClick.AddListener(OnUpdateRemarks);
        _Button_RelationList.onClick.AddListener(OnRelationList);
        _Button_HasRelation.onClick.AddListener(OnHasRelation);
        _Button_AddFriends.onClick.AddListener(OnAddFriends);
        _Button_RemoveFriends.onClick.AddListener(OnRemoveFriends);
        _Button_UpdateFriendRemarks.onClick.AddListener(OnUpdateFriendRemarks);
        _Button_RelationFriends.onClick.AddListener(OnRelationFriends);
        _Button_IsFriend.onClick.AddListener(IsFriend);
    }

    private void Init()
    {
        string cpId = "1000101";
        string channelId = "100";
        string productId = "1002";
        List<string> list = new()
        {
            "https://anhvcpo.weilekuiming.com"
        };
        
        RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
    }

    public void InitResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"InitResponseDelegate RequestResponseDelegate: {data}");
        OnLogin();
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
    
    private void OnLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.Username;
        loginConfig.username = "xiaohai3333";
        loginConfig.password = "1122232wewe";
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }

    private void InitLBS()
    {
        #if UNITY_IOS
        RXLBSIOS.Init("b3f38f782104520d41d8a8a96462df43");
        #endif
    }

    private void LoginResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"Login Response : {data}");
    }

    private void LoginErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"Login Error : {error}");
    }

    private void OnLbsRadius()
    {
        RXSocial.LbsRadius("friend", 118.19646377354036f, 24.483710802285128f, 1000, 10, 1, 10, 
            SocialResponseDelegate, RegisterErrorDelegate);
    }

    public void OnUserSetCustom()
    {
        RXSocial.UserSetCustom("1111", SocialResponseDelegate, RegisterErrorDelegate);
    }

    public void OnLbsUpdate()
    {
        string[] arr = {"1111"};
        RXSocial.LbsUpdate(arr, 118.19646377354036f, 24.483710802285128f, 
            SocialResponseDelegate, RegisterErrorDelegate);
    }

    public void OnLbsDelete()
    {
        string[] arr = {""};
        RXSocial.LbsDelete(arr, SocialResponseDelegate, RegisterErrorDelegate);
    }

    public void OnRelationAdd()
    {
        string[] arr =
        {
            "rxuN4ZOvlnP2_16wmj3Lfz3FYiej5xMk07yNKJAz",
            "rxuN4ZOvlnP2_16wmj3Lfz3FYiej5xMk07yNKJAz"
        };
        Dictionary<string, object> dic = new();
        dic.Add("test", true);
        RXSocial.RelationAdd(arr[1], dic, null, null, 
            SocialResponseDelegate, RegisterErrorDelegate);
    }

    public void OnRelationDelete()
    {
        Dictionary<string, object> dic = new();
        dic.Add("test", true);
        RXSocial.RelationDelete(arr[1], dic, SocialResponseDelegate, RegisterErrorDelegate);
    }

    public void OnUpdateRemarks()
    {
        string targetRemarks = _customRelationKey + " 关系备注";
        RXSocial.UpdateRemarks(_openID, "", targetRemarks, SocialResponseDelegate, RegisterErrorDelegate);
    }

    public void OnRelationList()
    {
        RXSocial.RelationList("test", SocialResponseDelegate, RegisterErrorDelegate);
    }

    public void OnHasRelation()
    {
        RXSocial.HasRelation(arr[1], "test", SocialResponseDelegate, RegisterErrorDelegate);
    }

    public void OnAddFriends()
    {
        RXSocial.AddFriends(arr[1], null, null, SocialResponseDelegate, RegisterErrorDelegate);
    }

    public void OnRemoveFriends()
    {
        RXSocial.RemoveFriends(arr[1], SocialResponseDelegate, RegisterErrorDelegate);
    }

    public void OnUpdateFriendRemarks()
    {
        RXSocial.UpdateFriendRemarks(arr[1], "", SocialResponseDelegate, RegisterErrorDelegate);
    }

    public void OnRelationFriends()
    {
        RXSocial.RelationFriends(SocialResponseDelegate, RegisterErrorDelegate);
    }

    public void IsFriend()
    {
        RXSocial.IsFriend(arr[1], SocialResponseDelegate, RegisterErrorDelegate);
    }

    private void SocialResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"SocialResponseDelegate : {data}");
    }

    private void RegisterErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"RegisterErrorDelegate : {error}");
    }


}
