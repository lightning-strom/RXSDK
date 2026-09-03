
using System;
using System.Collections.Generic;
using RXSDK;
using RXSDK.Data;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class TestRXAPI
{

    private static readonly TestRXAPI _instance = new TestRXAPI();
    // 公共访问点
    public static TestRXAPI Instance
    {
        get
        {
            return _instance;
        }
    }

    static string fullText = "非常长的文本...";  // 你的长文本
    static int currentPage = 0;
    static int pageSize = 10000;
    static Text mUIText;
    static void ShowText(string textStr, int pageIndex = 0)
    {

    }

    string phone1 = "15500000001";
    string phone2 = "15500000002";
    string email1 = "lipeng@jixiang.cn";

    DataBean GetTestData(string name)
    {
        // InputField usernameFiled = GameObject.Find("Username").GetComponent<InputField>();
        // InputField passwordFiled = GameObject.Find("Password").GetComponent<InputField>();
        // InputField captchadFiled = GameObject.Find("Captcha").GetComponent<InputField>();
        // Dropdown dropdown1 = GameObject.Find("Dropdown").GetComponent<Dropdown>();
        DataBean data = null;
        if ("Register".Equals(name))
        {
            // data = new RegisterArgs()
            // {
            //     username = usernameFiled.text,
            //     password = passwordFiled.text,

            //     captcha_code = captchadFiled.text
            // };
        }
        else if ("RealAuth".Equals(name))
        {
            data = new RealAuthArgs
            {
                idcard = "130532197901235712",
                realname = "乐淳雅"
            };
        }
        // else if ("SendCaptcha".Equals(name))
        // {
        //     string pru = dropdown1.captionText.text;
        //     bool isemail = pru.Equals(CaptchaPurpose.BINDEMAIL) || pru.Equals(CaptchaPurpose.UNBINDEMAIL) ? true : false;
        //     data = new SendCaptchaArgs()
        //     {
        //         phone = isemail ? null : phone1,
        //         email = isemail ? email1 : null,
        //         purpose = pru

        //     };
        // }
        // else if ("VerifyCaptcha".Equals(name))
        // {
        //     string pru = dropdown1.captionText.text;
        //     data = new VerifyCaptchaArgs()
        //     {
        //         phone = phone1,
        //         purpose = pru,
        //         captcha_code = phone1.Substring(phone1.Length - 4),
        //     };

        // }
        else if ("BindPhone".Equals(name))
        {
            data = new BindPhoneArgs()
            {
                phone = phone1,
                password = "111111",
                captcha_code = "0001",
            };

        }
        else if ("UnBindPhone".Equals(name))
        {
            data = new UnBindPhoneArgs()
            {
                phone = phone1,
                captcha_code = phone1.Substring(phone1.Length - 4),
            };
        }
        else if ("UpdateUserInfo".Equals(name))
        {
            data = new UpdateUserInfoArgs()
            {
                avatarurl = "https://pics5.baidu.com/feed/f9198618367adab4ae93d01f4d2fd5158601e435.jpeg?token=dc16fc242c33735fa67c32567ce5fc0c",
                sex = 0,
                wechat_avatarurl = "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK7I2LkIqgwO1cunedHjwesjdRYn3rlJvib9ovibCGG30nibnLI6TCYxjVnuunFw4ZtrRLjf6uuW8L7w/132",
                nickname = "你的神"
            };

        }
        else if ("ChangeBindPhone".Equals(name))
        {

            data = new ChangePhoneArgs()
            {
                oldphone_captcha = phone1,
                newphone = phone2,
                newphone_captcha = phone2.Substring(phone2.Length - 4),
            };

        }
        else if ("BindEmail".Equals(name))
        {

            data = new BindEmailArgs()
            {
                email = "lipeng@jixiang.cn",
                password = "111111",
                captcha_code = "0001",
            };

        }
        else if ("UnBindEmail".Equals(name))
        {

            data = new UnBindEmailArgs()
            {
                email = "lipeng@jixiang.cn",
                captcha_code = "0001",
            };

        }
        else if ("ChangePassword".Equals(name))
        {
            data = new ChangePasswordArgs()
            {
                old_password = "111111",
                new_password = "222222",
            };

        }
        else if ("ResetPassword".Equals(name))
        {
            data = new ResetPasswordArgs()
            {
                username = phone1,
                password = "222222",
                captcha_code = phone1.Substring(phone1.Length - 4),
            };

        }
        else if ("LegalTerms".Equals(name))
        {
            string[] k = { "00001", "00002", "00003" };
            data = new LegalArgs().SetKeys(k);

        }
        else if ("Login1".Equals(name))
        {
            data = new LoginArgs()
            {
                method = "username",
                username = phone1,
                password = "222222",
                captcha_code = phone1.Substring(phone1.Length - 4),
            };
        }
        return data;
    }



    // 翻到下一页
    public void NextPage()
    {
        if ((currentPage + 1) * pageSize < fullText.Length)
        {
            currentPage++;
            ShowText(fullText, currentPage);
        }

    }

    // 翻到上一页
    public void PreviousPage()
    {
        if (currentPage > 0)
        {
            currentPage--;
            ShowText(fullText, currentPage);
        }

    }
    /// <summary>
    /// 回调参数说明
    /// </summary>
    /// <param name="code"> 错误码</param>
    /// <param name="data"> 业务 data 数据一般情况是 json，具体类型看业务接口响应结构 </param>
    /// <param name="msg">错误消息</param>
    void OnRXCallback(int code, object data, string msg)
    {
        Log.D("RXCallback code:" + code + ", msg:" + msg);
        // ShowText("code:" + code + ", msg:" + msg + ", data:" + data);
        if (code == 0)
        {
            if (data != null)
            {
                //todo 读取业务数据
            }
            // 处理成功业务逻辑
            Log.D("RXCallback data= " + data);
        }
        else
        {
            // 处理失败业务
            Log.D("RXCallback msg= " + msg);
        }
    }

    void OnRXCallback1<T>(RXResult<T> ret, Exception e)
    {
        var code = ret.code;
        var data = ret.data;
        var msg = ret.msg;
        Log.D("RXCallback code:" + code + ", msg:" + msg);
        // ShowText("code:" + code + ", msg:" + msg + ", data:" + data);
        if (code == 0)
        {
            if (data != null)
            {
                //todo 读取业务数据
            }
            // 处理成功业务逻辑
            Log.D("RXCallback data= " + data);
        }
        else
        {
            // 处理失败业务
            Log.D("RXCallback msg= " + msg);
        }
    }

    public void SyncInfo()
    {
        var sy = new Dictionary<string, object>();
        RuiXueSdk.SyncInfo(sy, OnRXCallback);

    }
    public void TestReport()
    {
        string task_id = "10000003";
        // PushManager.Instance.DeivceToken = "MAMzLgJknVEDF3QAstOV5gAAAGQAAAAAAAJTXc8BNL9BLT_QV1swcPX3VlgyveONsM0TazbdZm-GhUk9W5Ji41vpgIbUpiE_XYSMOco7VvfR7alw";
        PushManager.Instance.ReportNotifyStatus(task_id);
        string version = Application.unityVersion;
        Log.D("version:" + version);
    }

    public void LegalTerms()
    {


    }


    public void Login()
    {
        DoLogin(LoginMethod.Harmony);
    }
    public void Test3Login()
    {
        Dictionary<string, object> parm = new()
        {
            {"username","test3"},
            {"password","111111aA!"}
        };

        DoLogin(LoginMethod.UserName, parm);
    }

    public void Logout()
    {
        RuiXueSdk.Logout();
    }


    // public void UnionLogin()
    // {
    //     Dictionary<string, object> parm = new Dictionary<string, object>();

    //     // Dictionary<string, object> account = new Dictionary<string, object>
    //     // {
    //     //     { "accountName", "微乐游戏账号" },
    //     //     { "accountIcon", "app.media.app_icon" }
    //     // };

    //     // List<Dictionary<string, object>> acclist = new List<Dictionary<string, object>>
    //     // {
    //     //     account
    //     // };

    //     // parm.Add("accountInfos", acclist);
    //     // parm.Add("showLoginDialog", true);
    //     // parm.Add("loginPanelType", 1);

    //     UnionLoginArgs unionLoginArgs = new()
    //     {
    //         accountInfos = new List<UnionLoginArgs.UnionAccountType>()
    //     };

    //     UnionLoginArgs.UnionAccountType unionAccountType = new()
    //     {
    //         accountIcon = "app.media.app_icon",
    //         accountName = "微乐游戏账号"
    //     };

    //     unionLoginArgs.accountInfos.Add(unionAccountType);

    //     // RuiXueSdk.UnionLogin(unionLoginArgs, parm, (code, data, msg) =>
    //     // {
    //     //     if (data != null)
    //     //     {
    //     //         Log.D("data= " + data.ToJson());
    //     //         ShowText(data.ToJson());
    //     //     }
    //     //     else
    //     //     {
    //     //         Log.D("code:" + code + ", msg:" + msg);
    //     //         ShowText("code:" + code + ", msg:" + msg);
    //     //     }
    //     // });
    // }

    public void UnionLogin()
    {

        UnionLoginArgs unionLoginArgs = new()
        {
            accountInfos = new List<UnionLoginArgs.UnionAccountType>()
        };

        UnionLoginArgs.UnionAccountType unionAccountType = new()
        {
            accountIcon = "app.media.app_icon",
            accountName = "微乐游戏账号"
        };


        unionLoginArgs.accountInfos.Add(unionAccountType);

        //cp 自定义参数
        // migrate_args 必须是对象（map）；服务端 LoginByCredentialArg.migrate_args 不能是 string
        unionLoginArgs.ext = new Dictionary<string, object>{
            {"sign",new string[]{"openid","method"}},
            {"migrate_args", new Dictionary<string, object>{ {"custom", "cpcustom"} }},
        };


        RuiXueSdk.UnionLogin(unionLoginArgs, (code, data, msg) =>
        {
            if (data != null)
            {
                Log.D("data= " + data.ToJson());
                ShowText(data.ToJson());
            }
            else
            {
                Log.D("code:" + code + ", msg:" + msg);
                ShowText("code:" + code + ", msg:" + msg);
            }
        });

    }

    public void UnBindPlayer()
    {
        RuiXueSdk.UnBindPlayer(null, null, (json) =>
        {
            ShowText("UnBindPlayer:" + json);
        });
    }
    public void Guest()
    {
        DoLogin(LoginMethod.Guest);
    }
    public void UpdateApp()
    {
        RuiXueSdk.CheckUpdateApp("1.0.1", 0, "js", null, OnRXCallback);
    }
    public void UpdateGame()
    {
        RuiXueSdk.CheckUpdateGame(100, 1, 0, null, OnRXCallback);
    }
    public void UpdateActivity()
    {
        RuiXueSdk.CheckUpdateActivity("ax", 1, 0, null, OnRXCallback);
    }
    public void RegisterToken()
    {
        RuiXueSdk.PushAPI.RegisterToken(OnRXCallback);
    }
    public void UnRegisterToken()
    {
        PushManager.Instance.UnRegisterToken(OnRXCallback);
    }
    public void BindAlias()
    {
        PushManager.Instance.BindAlias(RuiXueSdk.OpenId);
    }

    public void Legal()
    {
        RuiXueSdk.Legal(OnRXCallback);
    }

    public void Track()
    {
        Dictionary<string, object> keyValuePairs = new()
        {
            { "login", "sset" },//事件类型（目前默认为 track）
            { "login2", "sset" + DeviceUtility.GetNewUUID() }//事件类型（目前默认为 track）
        };

        RuiXueSdk.Track("#test", keyValuePairs);
    }

    [Obsolete]
    public void Pay()
    {
        Dictionary<string, object> keyValuePairs = new()
        {
            {"trade_no",""+TimeUtility.GetTimeMillis()}
        };
        var data = new PayArgs()
        {
            // goods_tag = "bytest",
            goods_tag = "goods_forever_1_10",
            trade_no = "" + TimeUtility.GetTimeMillis(),
        };

        RuiXueSdk.Pay(data, (code, data, msg) =>
         {

             Log.D("Pay code:" + code + ", msg:" + msg);
             ShowText("code:" + code + ", msg:" + msg + ", data:" + data);

             if (data != null)
             {
                 Log.D("data= " + data);
             }
         });
    }


    private Action<int, string, string> InitCallback()
    {
        return (code, data, msg) =>
        {
            if (code == 0)
            {
                ShowText("IsLoggedIn:" + RuiXueSdk.IsLoggedIn + " data:" + data);
            }
            else
            {
                ShowText($"code:{code}, msg:{msg}");
            }
            Log.D("Init IsLoggedIn: " + RuiXueSdk.IsLoggedIn + " code:" + code + ", msg:" + msg + ",data:" + data);
        };
    }

    public void Init112()
    {
        string cpId = "112", productId = "1002", channelId = "100";
        string[] baseUrls = new string[] { "https://cn-api-demo.ruixueyun.com" };

        InitArgs initArgs = new()
        {
            baseUrls = baseUrls,
            cpId = cpId,
            productId = productId,
            channelId = channelId,
            debugEnable = true,
            privacyEnable = true
        };

        RuiXueSdk.Init(initArgs, (code, data, msg) =>
        {
            if (code == 0)
            {
                ShowText("IsLoggedIn:" + RuiXueSdk.IsLoggedIn + " data:" + data);
            }
            else
            {
                ShowText($"code:{code}, msg:{msg}");
            }

            Log.D("Init IsLoggedIn: " + RuiXueSdk.IsLoggedIn + " code:" + code + ", msg:" + msg + ",data:" + data);
        });

    }
    public void Init114()
    {
        string cpId = "114", productId = "1002", channelId = "100";
        string[] baseUrls = new string[] { "http://cn-api-test.ruixueyun.com" };

        InitArgs initArgs = new()
        {
            baseUrls = baseUrls,
            cpId = cpId,
            productId = productId,
            channelId = channelId,
            debugEnable = true,
            privacyEnable = true
        };

        RuiXueSdk.Init(initArgs, InitCallback());
    }

    public void Init1000038()
    {
        // {"productId":"264","channelId":"214","cpId":"1000038","baseUrls":["https://yh9gc7be1n.hitoffapp.com"],"debugEnable":true}
        string cpId = "1000038", productId = "264", channelId = "214";
        string[] baseUrls = new string[] { "https://yh9gc7be1n.hitoffapp.com" };

        InitArgs initArgs = new()
        {
            baseUrls = baseUrls,
            cpId = cpId,
            productId = productId,
            channelId = channelId,
            debugEnable = true,
            privacyEnable = true
        };

        RuiXueSdk.Init(initArgs, InitCallback());
    }


    public void Init1000103()
    {
        // {"productid":"34","cpid":"1000103","channelid":204,"logEnable":true,"baseUrls":["https://gochsyj.pwypyq.com/","https://gochsyj.dtnanb.com/"]}


        string cpId = "1000103", productId = "34", channelId = "214";
        string[] baseUrls = new string[] { "https://gochsyj.pwypyq.com/", "https://gochsyj.dtnanb.com/" };

        // https://cn-api-demo.ruixueyun.com/v1/ke/callback/1002/100
        // API域名/v1/ke/callback/产品ID@渠道ID/honor(渠道)
        // api域名/v1/pusher/notify/honor(渠道)?product_id=产品ID&channel_id=渠道ID

        // https://cn-api-demo.ruixueyun.com/v1/pusher/notify/huawei?product_id=1002&channel_id=100

        // string cpId = "1000103", productId = "34", channelId = "204";
        // string[] baseUrls = new string[] { "https://gochsyj.pwypyq.com/","https://gochsyj.dtnanb.com/" };


        Dictionary<string, Dictionary<string, object>> pubProperties = new()
        {
            {"test",new Dictionary<string, object>{{"aa","bb"}}},
            {"#test",new Dictionary<string, object>{{"aaa","bba"}}},
            {"#login",new Dictionary<string, object>{{"ccd","ddf"}}}
        };

        RuiXueSdk.SetPublicProperties(pubProperties);

        InitArgs initArgs = new()
        {
            baseUrls = baseUrls,
            cpId = cpId,
            productId = productId,
            channelId = channelId,
            debugEnable = true,
            privacyEnable = true

        };

        RuiXueSdk.Init(initArgs, InitCallback());


        // RuiXueSdk.Init("114", "1002", "100", new string[] { "http://cn-api-test.ruixueyun.com" }, (code, data, msg) =>
        // {
        //     ShowText(data);
        //     Log.D("Init : code:" + code + ", msg:" + msg + ",data:" + data);
        // });
    }

    public void HwjosLogin()
    {

        Dictionary<string, object> parm = new()
        {
            {"sign_fields",new string[]{"openid"}}
        };

        DoLogin(LoginMethod.HuaWei, parm);
    }



    public void DoLogin(LoginMethod method, Dictionary<string, object> parm = null)
    {
        Log.D("login:" + method);

        RuiXueSdk.Login(method, parm, (code, data, msg) =>
        {
            if (code == 0 && data != null)
            {
                Log.D("data= " + data.ToJson());
                ShowText(data.ToJson());
            }
            else
            {
                Log.D("code:" + code + ", msg:" + msg);
                ShowText("code:" + code + ", msg:" + msg);
            }
        });
    }

    public void NextScene()
    {
        UnityEngine.SceneManagement.SceneManager.LoadScene("HMS_Demo");

    }
    #region  social api
    public void LbsRadius()
    {
        float lon = 118.19646377354036f;
        float lat = 24.4837108022851f;
        var radius = 20000;
        var count = 0;
        var page = 1;
        var page_size = 10;
        var type = "friend";
        RuiXueSdk.SocialAPI.LbsRadius(type, lon, lat, radius, count, page, page_size, OnRXCallback1);

    }
    public void LbsUpdate()
    {
        float lon = 118.19646377354036f;
        float lat = 24.4837108022851f;
        var types = new string[] { "sss" };
        RuiXueSdk.SocialAPI.LbsUpdate(types, lon, lat, OnRXCallback1);

    }

    public void LbsDelete()
    {

        var types = new string[] { "sss" };
        RuiXueSdk.SocialAPI.LbsDelete(types, OnRXCallback1);

    }
    public void UserSetCustom()
    {
        var custom = "custom info 最大长度为 512 字节";
        RuiXueSdk.SocialAPI.UserSetCustom(custom, OnRXCallback1);

    }
    public void RelationAdd()
    {
        string target = "";
        Dictionary<string, object> types = new Dictionary<string, object>();
        string target_remarks = "";
        string user_remarks = "";
        RuiXueSdk.SocialAPI.RelationAdd(target, types, target_remarks, user_remarks, OnRXCallback1);

    }
    public void RelationDelete()
    {
        string target = "";
        Dictionary<string, object> types = new Dictionary<string, object>();
        RuiXueSdk.SocialAPI.RelationDelete(target, types, OnRXCallback1);

    }
    public void UpdateRemarks()
    {
        string target = "";
        string target_remarks = "";
        string type = "";
        RuiXueSdk.SocialAPI.UpdateRemarks(target, type, target_remarks, OnRXCallback1);

    }
    public void RelationList()
    {

        string type = "cptypexxx";
        RuiXueSdk.SocialAPI.RelationList(type, OnRXCallback1);

    }
    public void HasRelation()
    {
        string target = "test";
        string type = "cptypexxx";
        RuiXueSdk.SocialAPI.HasRelation(target, type, OnRXCallback1);
    }
    public void AddFriends()
    {
        string target = "test";
        string target_remarks = "test";
        string user_remarks = "test";
        RuiXueSdk.SocialAPI.AddFriends(target, target_remarks, user_remarks, OnRXCallback1);
    }
    public void RemoveFriends()
    {
        string target = "test";
        RuiXueSdk.SocialAPI.RemoveFriends(target, OnRXCallback1);
    }
    public void UpdateFriendRemarks()
    {
        string target = "test";
        string target_remarks = "target_remarks";
        RuiXueSdk.SocialAPI.UpdateFriendRemarks(target, target_remarks, OnRXCallback1);
    }
    public void RelationFriends()
    {
        RuiXueSdk.SocialAPI.RelationFriends(OnRXCallback1);
    }
    public void IsFriend()
    {
        string target = "test";
        RuiXueSdk.SocialAPI.IsFriend(target, OnRXCallback1);
    }
    #endregion
    #region  rank api
    public void AddScore()
    {
        string rank_id = "diddd";
        int score = 100;
        RuiXueSdk.RankingAPI.AddScore(rank_id, score, OnRXCallback1);
    }
    public void SetScore()
    {
        string rank_id = "diddd";
        int score = 100;
        RuiXueSdk.RankingAPI.SetScore(rank_id, score, OnRXCallback1);
    }
    public void QueryUserRank()
    {
        string rank_id = "diddd";
        string openid = "diddd";

        RuiXueSdk.RankingAPI.QueryUserRank(rank_id, openid, OnRXCallback1);
    }
    public void GetRankList()
    {
        string rank_id = "idxxx";
        int start_rank = 0;
        int end_rank = 20;

        RuiXueSdk.RankingAPI.GetRankList(rank_id, start_rank, end_rank, OnRXCallback1);
    }
    public void FriendsRank()
    {
        string rank_id = "idxxx";

        RuiXueSdk.RankingAPI.FriendsRank(rank_id, OnRXCallback1);
    }
    #endregion


    public void GetAnnouncement()
    {
        RuiXueSdk.OperationAPI.GetAnnouncement(100, OnRXCallback1);
    }
    public void GetEmailList()
    {
        string userId = "user123"; // 示例用户ID，可替换为实际值
        RuiXueSdk.OperationAPI.GetEmailList(userId, OnRXCallback1);
    }

    public void DeleteEmail()
    {
        string userId = "user123"; // 示例用户ID，可替换为实际值
        int type = 1; // 删除单封邮件
        int? mailId = 456; // 示例邮件ID，可替换为实际值

        RuiXueSdk.OperationAPI.DeleteEmail(userId, type, mailId, OnRXCallback1);
    }

    public void GetEmailDetail()
    {
        string userId = "user123"; // 示例用户ID，可替换为实际值
        int mailId = 456; // 示例邮件ID，可替换为实际值

        RuiXueSdk.OperationAPI.GetEmailDetail(userId, mailId, OnRXCallback1);
    }

    public void GetEmailAward()
    {
        string userId = "user123"; // 示例用户ID，可替换为实际值
        int type = 1; // 领取单封邮件奖励
        int? mailId = 456; // 示例邮件ID，可替换为实际值

        RuiXueSdk.OperationAPI.GetEmailAward(userId, type, mailId, OnRXCallback1);
    }

    public void HelpCenter()
    {
        HelpCenterUIArgs custom = new HelpCenterUIArgs
        {
            transmit_args = "透传参数",
            game_user_id = "1000",
            nickname = "用户昵称",
            head_img_url = "用户头像",
            queue_name = "default"
        };
        RuiXueSdk.HelpCenterUI(custom, (json) =>
        {
            Log.D("HelpCenterUI callback:" + json);
            ShowText("HelpCenterUI:" + json);
        });
    }

    public void ChatService()
    {
        HelpCenterUIArgs custom = new HelpCenterUIArgs
        {
            transmit_args = "透传参数",
            game_user_id = "1000",
            nickname = "用户昵称",
            head_img_url = "用户头像",
            queue_name = "default"
        };
        RuiXueSdk.ChatServiceUI(custom);
    }

    public void ApplyForDeregisterUI()
    {
        HelpCenterUIArgs custom = new()
        {
            transmit_args = "透传参数",
            game_user_id = "1000",
            nickname = "用户昵称",
            head_img_url = "用户头像",
            queue_name = "default"
        };

        RuiXueSdk.ApplyForDeregisterUI(custom, (json) =>
        {
            Log.D("ApplyForDeregisterUI callback:" + json);
            ShowText("ApplyForDeregisterUI:" + json);
        });
    }



    public void ProtocolView()
    {
        // WebViewManager.Instance.OpenPrivacy("00001", new string[] { "00001", "00002" });
        RuiXueSdk.ProtocolView("00002", new string[] { "00001", "00002", "00003", "00004", "00005", "00006", "00007", "00008", "00009" });

    }
    public void UserCenter()
    {
        HelpCenterUIArgs custom = new()
        {
            transmit_args = "透传参数",
            game_user_id = "1000",
            nickname = "用户昵称",
            head_img_url = "用户头像",
            queue_name = "default",
        };

        UserCenterUIConfig config = new()
        {
            custom_params = custom
        };

        RuiXueSdk.UserCenterUI(config, (json) =>
        {
            // {
            //     type:"用户中心回调事件类型"
            // }
            Log.D("UserCenterUI callback:" + json);
            ShowText("UserCenterUI:" + json);

        });

    }

    string cdkey = "";

    public void GetPromoKey()
    {
        RuiXueSdk.GetPromoDisplayKEY((code, promo, msg) =>
        {
            if (code == 0)
            {
                cdkey = promo.promo_code;
            }
            Log.D("RXCallback code:" + code + ", msg:" + msg);
            ShowText("code:" + code + ", msg:" + msg + ", promo:" + RXUtility.ObjectToJson(promo));
        }, true);
    }
    public void ExchangePromoKey()
    {
        RuiXueSdk.ExchangePromoCDKEY(cdkey, OnRXCallback);
    }
    public void OpenWebview()
    {
        // string baseUrl = RXConfig.Instance.BaseUrls[0];
        // string helpCenterUrl = $"{baseUrl}/static/passport/#/protocol/protocollist";
        // OpenHarmonyWebview _openHarmonyWebview = new OpenHarmonyWebview();
        // _openHarmonyWebview.CreateWebview(0, 0, 0, 0, true);
        // _openHarmonyWebview.LoadURL(helpCenterUrl);

    }
    public void LoadUrl()
    {

        // Application.OpenURL("https://www.baidu.com/");
#if UNITY_OPENHARMONY
        RXWebView _openHarmonyWebview = new RXWebView();
        _openHarmonyWebview.CreateWebview();
        _openHarmonyWebview.LoadURL("https://www.baidu.com/");

        // createBtn.onClick.AddListener(() => _openHarmonyWebview.CreateWebview(Screen.width / 8, Screen.height / 8, Screen.width / 8, Screen.height / 2, true));
        // removeBtn.onClick.AddListener(_openHarmonyWebview.RemoveWebview);
        // loadurlBtn.onClick.AddListener(() => _openHarmonyWebview.LoadURL("https://www.baidu.com/"));
        // loadhtmlstringBtn.onClick.AddListener(() =>
        //     _openHarmonyWebview.LoadHTMLString("<html><body bgcolor=\"white\">Source:<pre>source</pre></body></html>",
        //         ""));
        // loaddataBtn.onClick.AddListener(() =>
        //     _openHarmonyWebview.LoadData("<html><body bgcolor=\"white\">Source:<pre>source</pre></body></html>", ""));
        // loadUrlLocalBtn.onClick.AddListener(() =>
        //     _openHarmonyWebview.LoadURL("resource://rawfile/Data/StreamingAssets/index.html"));
        // evaluatejsBtn.onClick.AddListener(() => _openHarmonyWebview.EvaluateJS("test()"));
        // setvisibilityBtn.onClick.AddListener(() => _openHarmonyWebview.SetVisibility(true));
        // setmarginsBtn.onClick.AddListener(() =>
        //     _openHarmonyWebview.SetMargins(Screen.width / 8, Screen.height / 8, Screen.width / 8, Screen.height / 2));
        // reloadBtn.onClick.AddListener(_openHarmonyWebview.Reload);
        // stoploaddingBtn.onClick.AddListener(_openHarmonyWebview.StopLoading);
        // goforwardBtn.onClick.AddListener(_openHarmonyWebview.GoForward);
        // gobackBtn.onClick.AddListener(_openHarmonyWebview.GoBack);
#endif

    }


}