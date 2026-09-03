using System;
using System.Collections.Generic;
using System.Reflection;
using RXSDK;
using RXSDK.Data;
using RXSDK.Platform;
using UnityEngine;
using UnityEngine.UI; // 确保引用了UI命名空间  


public class RXSampleScene : MonoBehaviour
{
    private static readonly int LogPageSize = 10000;



    /// <summary>
    /// 预留的解码/调试入口，可按需在此编写测试逻辑。
    /// </summary>
    public void TestDecode()
    {
        Log.D("TestDecode: 使用上方按钮调用各 SDK 能力，结果将显示在 TextLog。");
        ShowText("TestDecode: 使用上方按钮调用各 SDK 能力。");
    }

    #region  test buttons

    public Button buttonPrefab; // 在Inspector中分配你的按钮预制件  
    public RectTransform buttonContainer; // 分配你的Panel或Grid的RectTransform  

    private void CreateButtonList()
    {
        // 获取 MyClass 类型
        Type type = typeof(RXApi);

        // 获取所有公共方法（包括实例方法和静态方法）
        MethodInfo[] publicMethods = type.GetMethods(BindingFlags.Public | BindingFlags.Instance);
        foreach (MethodInfo method in publicMethods)
        {
            if (method.IsPublic && method.DeclaringType == type)
            {
                // 实例化按钮预制件  
                Button newButton = Instantiate(buttonPrefab, buttonContainer);
                newButton.gameObject.SetActive(true);
                // 设置按钮的RectTransform，以便它正确地放置在容器中  
                newButton.transform.SetParent(buttonContainer, false);
                // 设置按钮的文本  
                newButton.GetComponentInChildren<Text>().text = method.Name;
                // 如果需要，可以为每个按钮添加事件监听器  
                newButton.onClick.AddListener(() => ButtonClicked(newButton, method));
            }
        }
    }

    private void ButtonClicked(Button button, MethodInfo methodInfo)
    {
        string methodName = button.GetComponentInChildren<Text>().text;
        // Log.D("Button clicked: " + methodName);
        methodInfo.Invoke(RXApi.Instance, null);
        // Invoke(methodName, 0f);
    }
    #endregion



    static void CallMethod(string methodName, DataBean args)
    {
        string className = "RXSDK.RuiXueSdk";

        Action<int, object, string> callback = (i, str1, str2) =>
        {
            Log.D($"Callback invoked with {i}, {str1}, {str2}");
        };
        // 获取包含静态方法的类型  
        Type type = Type.GetType(className);
        if (type != null)
        {
            // 获取静态方法的信息  
            MethodInfo methodInfo = type.GetMethod(methodName, BindingFlags.Static | BindingFlags.Public);
            if (methodInfo != null)
            {
                // 调用静态方法  
                methodInfo.Invoke(null, new object[] { args, callback });
            }
            else
            {
                Log.D("Method not found." + methodName);
            }
        }
        else
        {
            Log.D("Type not found :" + className);
        }
    }


    #region  mono lifecycle


    void Awake()
    {
        Log.D("RXSampleScene Awake");
    }

    static string fullText = "";
    static int currentPage = 0;
    static Text mUIText;


    static void ShowText(string textStr, int pageIndex = 0)
    {
        fullText = textStr ?? "";
        if (mUIText == null) return;
        int startIndex = pageIndex * LogPageSize;
        int len = fullText.Length;
        int endIndex = Mathf.Min((pageIndex + 1) * LogPageSize, len);
        if (startIndex >= len)
        {
            mUIText.text = "";
            return;
        }
        mUIText.text = fullText.Substring(startIndex, endIndex - startIndex);
    }


    void Start()
    {
        CreateButtonList();
        mUIText = GameObject.Find("TextLog").GetComponent<Text>();
        if (mUIText == null)
            Log.D("RXSampleScene: 未找到 TextLog，请确保场景中有同名 Text 组件。");

        // RXApi.Instance.Init114();
        // RXApi.Instance.Init1000103();
        RXApi.Instance.Init1000197();
        RXApi.Instance.OnKnockShare();
        Log.D("RXSampleScene Start");
    }

    void OnEnable()
    {
        Log.D("RXSampleScene OnEnable");
    }



    // Update is called once per frame
    void Update()
    {

    }

    #endregion

    public class RXApi
    {
        private static readonly RXApi _instance = new RXApi();
        // 公共访问点
        public static RXApi Instance
        {
            get
            {
                return _instance;
            }
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

        // public void AESTest()
        // {
        //     string data2 = "{\"device\":{\"oaid\":\"b32eac80-b45c-41f4-b799-fedb6429486f\",\"package_name\":\"com.ruixue.sdk\"},\"method\":\"guest\",\"ext\":{}}";
        //     string key = "49ba75442e28c9665f0c636a5944e14e";
        //     key = null;
        //     string result = CryptoUtility.AesCbcEncrypt(data2, key);
        //     string result2 = CryptoUtility.AesCbcDecrypt(result, key);
        //     Log.D($"AesCbcEncrypt result:{result}, AesCbcDecrypt result:{result2}");
        //     ShowText($"AesCbcEncrypt result:{result}, AesCbcDecrypt result:{result2}");
        // }

        public void SteamScene()
        {
            string sceneName = "SteamSampleScene";
            RXSDK.SceneUtility.LoadSceneAsync(sceneName, null);
        }

        // 翻到下一页
        public void NextPage()
        {



            if ((currentPage + 1) * LogPageSize < fullText.Length)
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
        public void CleanCache()
        {
            DeviceUtility.CleanCache();
        }



        /// <summary>
        /// 回调参数说明
        /// </summary>
        /// <param name="code"> 错误码</param>
        /// <param name="data"> 业务 data 数据一般情况是 json Newtonsoft.Json.Linq.JObject ，具体类型看业务接口响应结构 </param>
        /// <param name="msg">错误消息</param>
        void OnRXCallback(int code, object data, string msg)
        {
            Log.D("RXCallback code:" + code + ", msg:" + msg);
            ShowText($"code:{code}, msg:{msg}, data:{data}");
            if (code == 0)
            {
                if (data != null)
                {
                    //todo 读取业务数据
                    string dd = data?.ToString();
                    // todo 处理成功业务逻辑
                    Log.D($"RXCallback type:{data.GetType()}, data= {dd}");

                    Newtonsoft.Json.Linq.JObject jObject = data as Newtonsoft.Json.Linq.JObject;
                    if (jObject != null)
                    {
                        // MyClass myObject = jObject.ToObject<MyClass>();
                        // 现在你可以使用 myObject 了
                        var dictionary = jObject.ToObject<Dictionary<string, object>>();

                        string fieldValue = jObject["fieldName"]?.ToString();
                        int? numberField = jObject["numberField"]?.ToObject<int>();

                        string nestedFieldValue = jObject["parent"]?["child"]?.ToString();

                    }
                }

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
        #region  init


        // 隐私协议链接，仅为示例：url链接请替换为自己隐私协议链接地址。
        private string agreement =
            "<a href='https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00001'>《用户协议》</a>" +
            "、<a href='https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00002'>《隐私政策》</a>";

        // 隐私协议内容拼接
        private string privacyStr =>
            $"在您使用我们（微乐）服务前，请您务必审慎阅读、充分理解{agreement}的各条款。" +
            $"同时，您应特别注意前述协议中免除或者限制我们责任的条款、对您权利进行限制的条款、" +
            $"约定争议解决方式和司法管辖的条款。如您已详细阅读并同意{agreement}请点击“同意”开始使用我们的服务。";

        public void GetSdkInfo()
        {
            ShowText("GetSdkInfo:" + RuiXueSdk.GetSdkInfo());
            Log.D("GetSdkInfo:" + RuiXueSdk.GetSdkInfo());
        }

        public void Init114()
        {
            string cpId = "114", productId = "1002", channelId = "100";
            string[] baseUrls = new string[] { "https://cn-api-test.ruixueyun.com" };

            InitArgs initArgs = new()
            {
                baseUrls = baseUrls,
                cpId = cpId,
                productId = productId,
                channelId = channelId,
                debugEnable = true,
                logoResource = "自定义标题",
                privacyEnable = true, //开启隐私协议
                privacy = this.privacyStr //设置隐私协议内容

            };

            RuiXueSdk.Init(initArgs, InitCallback());
        }
        public void Init119()
        {
            string cpId = "119", productId = "1002", channelId = "1000";
            string[] baseUrls = new string[] { "http://os-api-test.ruixueyun.com" };

            InitArgs initArgs = new()
            {
                baseUrls = baseUrls,
                cpId = cpId,
                productId = productId,
                channelId = channelId,
                debugEnable = true,
                privacyEnable = true,
                privacy = this.privacyStr
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
                privacyEnable = true,
                privacy = this.privacyStr
            };

            RuiXueSdk.Init(initArgs, InitCallback());
        }

        public void Init1000197()
        {
            // {"productId":"264","channelId":"214","cpId":"1000038","baseUrls":["https://yh9gc7be1n.hitoffapp.com"],"debugEnable":true}
            string cpId = "1000197", productId = "198", channelId = "214";
            string[] baseUrls = new string[] { "https://winykn.jiaxiangyouxi.com" };

            InitArgs initArgs = new()
            {
                baseUrls = baseUrls,
                cpId = cpId,
                productId = productId,
                channelId = channelId,
                debugEnable = true,
                privacyEnable = true,
                privacy = this.privacyStr
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
                privacyEnable = true,
                privacy = this.privacyStr

            };

            RuiXueSdk.Init(initArgs, InitCallback());


            // RuiXueSdk.Init("114", "1002", "100", new string[] { "http://cn-api-test.ruixueyun.com" }, (code, data, msg) =>
            // {
            //     ShowText(data);
            //     Log.D("Init : code:" + code + ", msg:" + msg + ",data:" + data);
            // });
        }

        #endregion

        public void SendCaptcha()
        {
            string methodName = MethodBase.GetCurrentMethod().Name;
            CallMethod(methodName, GetTestData(methodName));

        }
        public void VerifyCaptcha()
        {
            string methodName = MethodBase.GetCurrentMethod().Name;
            CallMethod(methodName, GetTestData(methodName));
        }
        public void SyncInfo()
        {
            var sy = new Dictionary<string, object>();
            RuiXueSdk.SyncInfo(sy, OnRXCallback);

        }
        public void BindPhone()
        {

            var data1 = new SendCaptchaArgs()
            {
                phone = phone1,
                purpose = CaptchaPurpose.BINDPHONE

            };

            RuiXueSdk.SendCaptcha(data1, (code, data, msg) =>
            {
                RuiXueSdk.BindPhone(new BindPhoneArgs()
                {
                    phone = phone1,
                    password = "111111",
                    captcha_code = "0001",
                }, OnRXCallback);
            });

        }
        public void UnBindPhone()
        {
            var data1 = new SendCaptchaArgs()
            {
                phone = phone1,
                purpose = CaptchaPurpose.UNBINDPHONE
            };

            RuiXueSdk.SendCaptcha(data1, (code, data, msg) =>
            {
                RuiXueSdk.UnBindPhone(new UnBindPhoneArgs()
                {
                    phone = phone1,
                    captcha_code = "0001",
                }, OnRXCallback);
            });
        }
        public void ChangeBindPhone()
        {
            string methodName = MethodBase.GetCurrentMethod().Name;
            CallMethod(methodName, GetTestData(methodName));
        }
        public void BindEmail()
        {
            string methodName = MethodBase.GetCurrentMethod().Name;
            CallMethod(methodName, GetTestData(methodName));
        }
        public void UnBindEmail()
        {
            string methodName = MethodBase.GetCurrentMethod().Name;
            CallMethod(methodName, GetTestData(methodName));
        }
        public void ChangePassword()
        {
            string methodName = MethodBase.GetCurrentMethod().Name;
            CallMethod(methodName, GetTestData(methodName));
        }
        public void ResetPassword()
        {
            string methodName = MethodBase.GetCurrentMethod().Name;
            CallMethod(methodName, GetTestData(methodName));
        }

        public void PushReport()
        {
            string task_id = "10000003";
            // PushManager.Instance.DeivceToken = "MAMzLgJknVEDF3QAstOV5gAAAGQAAAAAAAJTXc8BNL9BLT_QV1swcPX3VlgyveONsM0TazbdZm-GhUk9W5Ji41vpgIbUpiE_XYSMOco7VvfR7alw";
            PushManager.Instance.ReportNotifyStatus(task_id);
            string version = Application.unityVersion;
            Log.D("version:" + version);
        }

        public void LegalTerms()
        {
            string methodName = MethodBase.GetCurrentMethod().Name;
            // CallMethod(methodName, GetTestData(methodName));
            RuiXueSdk.LegalTerms((LegalArgs)GetTestData(methodName), OnRXCallback);
        }

        public void RealAuth()
        {

            var data = new RealAuthArgs
            {
                idcard = "130532197901235712",
                realname = "乐淳雅"
            };
            RuiXueSdk.RealAuth(data, (code, data, msg) =>
            {
                Log.D($" code: {code} ,msg:{msg} ,data:{data} ");
                Log.D(data?.GetType()?.ToString());
            });

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


        public void UnionLogin()
        {

            UnionLoginArgs unionLoginArgs = new()
            {
                accountInfos = new List<UnionLoginArgs.UnionAccountType>(),
                //游戏官方账号登录界面是否显示隐私协议
                privacyEnable = true,

                // privacyText1 = "用户协议",
                // privacyText2 = "隐私政策",
                // privacyText3 = "儿童隐私",
                // privacyUrl1 = "http://协议1",
                // privacyUrl2 = "http://协议2",
                // privacyUrl3 = "http://协议3",
                // loginMethods = new List<Dictionary<string, string>>()
                // {
                //        new() {
                //             { "method", "username" }
                //         },
                //         new() {
                //             { "method", "captchacode" }
                //         },
                //         new() {
                //             { "method", "wechat" },
                //             { "wx_appid", "wx2634a4144ccbe556" }
                //         }
                // }
            };

            UnionLoginArgs.UnionAccountType unionAccountType = new()
            {
                accountIcon = "app.media.app_icon",
                accountName = "微乐游戏账号"
            };


            unionLoginArgs.accountInfos.Add(unionAccountType);

            unionLoginArgs.scopes = new string[] { "profile" };
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

            RuiXueSdk.Pay(data, (ret, e) =>
             {

                 Log.D("Pay code:" + ret.code + ", msg:" + ret.msg);
                 ShowText("code:" + ret.code + ", msg:" + ret.msg + ", data:" + ret.data);

                 if (ret.data != null)
                 {
                     Log.D("data= " + ret.data);
                 }
             });
        }


        private Action<int, string, string> InitCallback()
        {
            return (code, data, msg) =>
            {
                RuiXueSdk.Encipher = 0;//test
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



        public void HwjosLogin()
        {

            Dictionary<string, object> parm = new()
            {
                {"sign_fields",new string[]{"openid"}}
            };

            DoLogin(LoginMethod.HuaWei, parm);
        }



        private void DoLogin(LoginMethod method, Dictionary<string, object> parm = null)
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

        // #region  social api
        // public void LbsRadius()
        // {
        //     float lon = 118.19646377354036f;
        //     float lat = 24.4837108022851f;
        //     var radius = 20000;
        //     var count = 0;
        //     var page = 1;
        //     var page_size = 10;
        //     var type = "friend";
        //     RuiXueSdk.SocialAPI.LbsRadius(type, lon, lat, radius, count, page, page_size, RXCallback);

        // }
        // public void LbsUpdate()
        // {
        //     float lon = 118.19646377354036f;
        //     float lat = 24.4837108022851f;
        //     var types = new string[] { "sss" };
        //     RuiXueSdk.SocialAPI.LbsUpdate(types, lon, lat, RXCallback);

        // }

        // public void LbsDelete()
        // {

        //     var types = new string[] { "sss" };
        //     RuiXueSdk.SocialAPI.LbsDelete(types, RXCallback);

        // }
        // public void UserSetCustom()
        // {
        //     var custom = "custom info 最大长度为 512 字节";
        //     RuiXueSdk.SocialAPI.UserSetCustom(custom, RXCallback);

        // }
        // public void RelationAdd()
        // {
        //     string target = "";
        //     Dictionary<string, object> types = new Dictionary<string, object>();
        //     string target_remarks = "";
        //     string user_remarks = "";
        //     RuiXueSdk.SocialAPI.RelationAdd(target, types, target_remarks, user_remarks, RXCallback);

        // }
        // public void RelationDelete()
        // {
        //     string target = "";
        //     Dictionary<string, object> types = new Dictionary<string, object>();
        //     RuiXueSdk.SocialAPI.RelationDelete(target, types, RXCallback);

        // }
        // public void UpdateRemarks()
        // {
        //     string target = "";
        //     string target_remarks = "";
        //     string type = "";
        //     RuiXueSdk.SocialAPI.UpdateRemarks(target, type, target_remarks, RXCallback);

        // }
        // public void RelationList()
        // {

        //     string type = "cptypexxx";
        //     RuiXueSdk.SocialAPI.RelationList(type, RXCallback);

        // }
        // public void HasRelation()
        // {
        //     string target = "test";
        //     string type = "cptypexxx";
        //     RuiXueSdk.SocialAPI.HasRelation(target, type, RXCallback);
        // }
        // public void AddFriends()
        // {
        //     string target = "test";
        //     string target_remarks = "test";
        //     string user_remarks = "test";
        //     RuiXueSdk.SocialAPI.AddFriends(target, target_remarks, user_remarks, RXCallback);
        // }
        // public void RemoveFriends()
        // {
        //     string target = "test";
        //     RuiXueSdk.SocialAPI.RemoveFriends(target, RXCallback);
        // }
        // public void UpdateFriendRemarks()
        // {
        //     string target = "test";
        //     string target_remarks = "target_remarks";
        //     RuiXueSdk.SocialAPI.UpdateFriendRemarks(target, target_remarks, RXCallback);
        // }
        // public void RelationFriends()
        // {
        //     RuiXueSdk.SocialAPI.RelationFriends(RXCallback);
        // }
        // public void IsFriend()
        // {
        //     string target = "test";
        //     RuiXueSdk.SocialAPI.IsFriend(target, RXCallback);
        // }
        // #endregion

        // #region  rank api
        // public void AddScore()
        // {
        //     string rank_id = "diddd";
        //     int score = 100;
        //     RuiXueSdk.RankingAPI.AddScore(rank_id, score, RXCallback);
        // }
        // public void SetScore()
        // {
        //     string rank_id = "diddd";
        //     int score = 100;
        //     RuiXueSdk.RankingAPI.SetScore(rank_id, score, RXCallback);
        // }
        // public void QueryUserRank()
        // {
        //     string rank_id = "diddd";
        //     string openid = "diddd";

        //     RuiXueSdk.RankingAPI.QueryUserRank(rank_id, openid, RXCallback);
        // }
        // public void GetRankList()
        // {
        //     string rank_id = "idxxx";
        //     int start_rank = 0;
        //     int end_rank = 20;

        //     RuiXueSdk.RankingAPI.GetRankList(rank_id, start_rank, end_rank, RXCallback);
        // }
        // public void FriendsRank()
        // {
        //     string rank_id = "idxxx";

        //     RuiXueSdk.RankingAPI.FriendsRank(rank_id, RXCallback);
        // }
        // #endregion


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

            RuiXueSdk.ProtocolView("00001", new string[] { "00001", "00002", "00003", "00004", "00005", "00006", "00007", "00008", "00009" });

        }
        public void ProtocolViewOld()
        {
            WebViewManager.Instance.OpenPrivacy("00001", new string[] { "00001", "00002" });

        }
        public void GetShareData()
        {
            var shareParams = new Dictionary<string, object>()
            {
                {"platform" , "hw_knock"},
                {"func",  "peng-big"}
            };

            // 模拟调用分享接口
            RuiXueSdk.ShareAPI.GetShareData(shareParams, (result, e) =>
            {
                if (e != null)
                {
                    Log.D("Error:" + e.Message);
                    return;
                }
                ShowText(result.ToJson());
                if (result.code == 0)
                {
                    Log.D("分享成功！" + result);
                }
                else
                {
                    Log.D($"分享失败: {result.msg}");
                }
            });
        }
        public void Share()
        {
            var shareParams = new RXShareConfig
            {
                platform = "hw_knock",
                func = "peng-big",
            };

            // 模拟调用分享接口
            RuiXueSdk.ShareAPI.Share(shareParams, (result, e) =>
            {
                if (e != null)
                {
                    Log.D("Error:" + e.Message);
                    return;
                }
                ShowText(result.ToJson());
                if (result.code == 0)
                {
                    Log.D("分享成功！" + result);

                }
                else
                {
                    Log.D($"分享失败: {result.msg}");
                }
            });
        }

        public void OnKnockShare()
        {
            RuiXueSdk.ShareAPI.OnKnockShare((str) =>
            {
                // Log.D("Knock 分享触发");
                var shareParams = new RXShareConfig
                {
                    platform = "hw_knock",
                    func = "peng-small",
                };

                // 模拟调用分享接口
                RuiXueSdk.ShareAPI.Share(shareParams, (result, e) =>
                {
                    if (e != null)
                        Log.D(e);

                    if (result.code == 0)
                    {
                        Log.D("分享成功！");
                        ShowText("碰一碰分享成功！");
                    }
                    else
                    {
                        Log.D($"分享失败: {result.msg}");
                        ShowText($"碰一碰分享失败: {result.msg}");
                    }
                });

            });
        }

        public void OffKnockShare()
        {
            RuiXueSdk.ShareAPI.OffKnockShare();
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

        public void WXBusinessView()
        {
            RXWXBusinessConfig cfg = new()
            {
                wx_appid = "wx8888888888888888",
                businessType = "requestMerchantTransfer",
                query = "mchId=1230000000&appId=wx8888888888888888&package=affffddafdfafddffda%3D%3D"
            };
            RuiXueSdk.ShareAPI.OpenBusinessView(cfg, (r, e) =>
            {
                ShowText(r?.ToJson());
            });
        }
        public void NearbyCreate()
        {

            RuiXueSdk.GameNearbyTransfer().Create(null, (ret) =>
            {
                Log.D("Nearby create:" + ret.ToJson());
                ShowText("create :" + RXUtility.ObjectToJson(ret));
                NearbyRegisterCallback();


            });

        }
        public void NearbyDestory()
        {
            RuiXueSdk.GameNearbyTransfer().Destroy((ret) =>
           {
               Log.D("NearbyDestory:" + ret.ToJson());
               ShowText("NearbyDestory :" + RXUtility.ObjectToJson(ret));
           });

        }

        public void NearbyRegisterCallback()
        {
            RuiXueSdk.GameNearbyTransfer().RegisterCallback((ret) =>
               {

                   Log.D("Nearby onEvent:" + ret.ToJson());
                   ShowText(RXUtility.ObjectToJson(ret));
               });
        }
        public void NearbyUnregisterCallback()
        {
            RuiXueSdk.GameNearbyTransfer().UnregisterCallback();

        }
        public void NearbyPublishNearbyGame()
        {
            RuiXueSdk.GameNearbyTransfer().PublishNearbyGame((ret) =>
           {
               Log.D("Nearby callback:" + ret.ToJson());

               ShowText("reslut :" + RXUtility.ObjectToJson(ret));

           });

        }
        public void NearbyAutoBindNearbyGame()
        {
            RuiXueSdk.GameNearbyTransfer().AutoBindNearbyGame((ret) =>
           {
               Log.D("Nearby callback:" + ret.ToJson());

               ShowText("reslut :" + RXUtility.ObjectToJson(ret));

           });

        }

        List<NearbyGameDevice> devices;
        public void NearbyDiscovery()
        {
            RuiXueSdk.GameNearbyTransfer().Discovery((ret) =>
           {
               Log.D("Nearby discovery:" + ret.ToJson());
               ShowText("discovery :" + RXUtility.ObjectToJson(ret));
               devices = ret.data.nearbyGameDevices;

           });
        }
        public void NearbyBindNearbyGame()
        {
            if (devices != null && devices.Count > 0)
            {
                foreach (var device in devices)
                {
                    Log.D("Nearby BindNearbyGame:" + device.ToString());
                    RuiXueSdk.GameNearbyTransfer().BindNearbyGame(device, (ret) =>
                     {
                         Log.D("Nearby bindDevice:" + ret.ToJson());
                         ShowText("bindDevice :" + RXUtility.ObjectToJson(ret));

                     });
                }
            }


        }


        /// <summary>
        /// 
        /// </summary>
        public void ReportWindowExposure()
        {
            // 场景数据
            Dictionary<string, object> scene = new Dictionary<string, object>
            {
                { "scene_identifier", "scene_001" }, // 场景标识
                { "scene_name", "Example Scene" },  // 场景名称

                // 触发按钮数据
                { "trigger_button_identifier", "btn_001" }, // 触发按钮标识
                { "trigger_button_name", "Start Button" },  // 触发按钮名称

                // 窗口数据
                { "window_identifier", "window_001" },  // 窗口标识
                { "window_name", "Main Window" },       // 窗口名称
                { "window_sequence", "1" }             // 窗口展示顺序
            };

            // 礼包对象组
            List<Dictionary<string, object>> giftPackages = new List<Dictionary<string, object>>();

            // 礼包1
            Dictionary<string, object> giftPackage1 = new Dictionary<string, object>
            {
                { "identifier", "gift_001" },        // 礼包标识
                { "name", "Starter Pack" },          // 礼包名称
                { "purchase_medium", "Credit Card" },// 购买礼包介质
                { "price", 9.99 },                   // 礼包价格
                { "billing_point", "BP001" }         // 礼包计费点
            };

            // 礼包2
            Dictionary<string, object> giftPackage2 = new Dictionary<string, object>
            {
                { "identifier", "gift_002" },        // 礼包标识
                { "name", "Premium Pack" },          // 礼包名称
                { "purchase_medium", "PayPal" },     // 购买礼包介质
                { "price", 19.99 },                  // 礼包价格
                { "billing_point", "BP002" }         // 礼包计费点
            };

            // 添加礼包到礼包对象组
            giftPackages.Add(giftPackage1);
            giftPackages.Add(giftPackage2);

            // 将礼包对象组加入场景数据
            scene.Add("gift_package", giftPackages);
            RuiXueSdk.ReportWindowExposure(scene);
        }

        /// <summary>
        /// 获取商业化接口
        /// </summary>
        public void GetOperationScene()
        {
            RuiXueSdk.GetOperationScene((res, e) =>
            {
                ShowText(res?.ToJson());
            });
        }



        // (OpenWebview/LoadUrl 已移除，如需 WebView 请使用 RuiXueSdk 对应 API)
        // {
        //     string baseUrl = RXConfig.Instance.BaseUrls[0];
        //     string helpCenterUrl = $"{baseUrl}/static/passport/#/protocol/protocollist";
        //     OpenHarmonyWebview _openHarmonyWebview = new OpenHarmonyWebview();
        //     _openHarmonyWebview.CreateWebview(0, 0, 0, 0, true);
        //     _openHarmonyWebview.LoadURL(helpCenterUrl);

        // }

        // (LoadUrl 已移除)
        // #if UNITY_OPENHARMONY
        //             RXWebView _openHarmonyWebview = new RXWebView();
        //             _openHarmonyWebview.CreateWebview();
        //             _openHarmonyWebview.LoadURL("https://www.baidu.com/");

        //             // createBtn.onClick.AddListener(() => _openHarmonyWebview.CreateWebview(Screen.width / 8, Screen.height / 8, Screen.width / 8, Screen.height / 2, true));
        //             // removeBtn.onClick.AddListener(_openHarmonyWebview.RemoveWebview);
        //             // loadurlBtn.onClick.AddListener(() => _openHarmonyWebview.LoadURL("https://www.baidu.com/"));
        //             // loadhtmlstringBtn.onClick.AddListener(() =>
        //             //     _openHarmonyWebview.LoadHTMLString("<html><body bgcolor=\"white\">Source:<pre>source</pre></body></html>",
        //             //         ""));
        //             // loaddataBtn.onClick.AddListener(() =>
        //             //     _openHarmonyWebview.LoadData("<html><body bgcolor=\"white\">Source:<pre>source</pre></body></html>", ""));
        //             // loadUrlLocalBtn.onClick.AddListener(() =>
        //             //     _openHarmonyWebview.LoadURL("resource://rawfile/Data/StreamingAssets/index.html"));
        //             // evaluatejsBtn.onClick.AddListener(() => _openHarmonyWebview.EvaluateJS("test()"));
        //             // setvisibilityBtn.onClick.AddListener(() => _openHarmonyWebview.SetVisibility(true));
        //             // setmarginsBtn.onClick.AddListener(() =>
        //             //     _openHarmonyWebview.SetMargins(Screen.width / 8, Screen.height / 8, Screen.width / 8, Screen.height / 2));
        //             // reloadBtn.onClick.AddListener(_openHarmonyWebview.Reload);
        //             // stoploaddingBtn.onClick.AddListener(_openHarmonyWebview.StopLoading);
        //             // goforwardBtn.onClick.AddListener(_openHarmonyWebview.GoForward);
        //             // gobackBtn.onClick.AddListener(_openHarmonyWebview.GoBack);
        // #endif

        //         }
    }

}