
using System;
using System.Collections.Generic;

namespace RXSDK
{


    public static class InitHelper
    {

        public static void GetSdkInfo()
        {
            ShowText("GetSdkInfo:" + RuiXueSdk.GetSdkInfo());
            Log.D("GetSdkInfo:" + RuiXueSdk.GetSdkInfo());
        }
        // 隐私协议链接，仅为示例：url链接请替换为自己隐私协议链接地址。
        private static string agreement =
            "<a href='https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00001'>《用户协议》</a>" +
            "、<a href='https://gochsyj.pwypyq.com/static/landing/#/v1/legal/terms/guge/00002'>《隐私政策》</a>";

        // 隐私协议内容拼接
        private static string privacyStr =>
            $"在您使用我们（微乐）服务前，请您务必审慎阅读、充分理解{agreement}的各条款。" +
            $"同时，您应特别注意前述协议中免除或者限制我们责任的条款、对您权利进行限制的条款、" +
            $"约定争议解决方式和司法管辖的条款。如您已详细阅读并同意{agreement}请点击“同意”开始使用我们的服务。";
        static void ShowText(string textStr, int pageIndex = 0)
        {
            Log.D(textStr);

            // fullText = textStr;
            // int startIndex = pageIndex * pageSize;
            // int endIndex = Mathf.Min((pageIndex + 1) * pageSize, textStr.Length);
            // mUIText.text = fullText.Substring(startIndex, endIndex - startIndex);
        }

        private static Action<int, string, string> InitCallback()
        {
            return (code, data, msg) =>
            {
                if (code == 0)
                {
                    ShowText("IsLoggedIn:" + RuiXueSdk.IsLoggedIn() + " data:" + data);
                }
                else
                {
                    ShowText($"code:{code}, msg:{msg}");
                }
                RXSDK.RuiXueSdk.Encipher = 0;
                Log.D("Init IsLoggedIn: " + RuiXueSdk.IsLoggedIn() + " code:" + code + ", msg:" + msg + ",data:" + data);
            };
        }

        public static void Init114()
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
                privacy = privacyStr //设置隐私协议内容

            };

            RuiXueSdk.SetGameLoginConfig(new Dictionary<string, object>
            {
                {"game_fields",new string[]{"openid"}},
                {"cpmigrate_args","cpcustom"},

            });

            RuiXueSdk.Init(initArgs, InitCallback());
        }
        public static void Init114steam()
        {
            string cpId = "114", productId = "1002", channelId = "steam";
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
                privacy = privacyStr //设置隐私协议内容

            };
            RuiXueSdk.SetGameLoginConfig(new Dictionary<string, object>
            {
                {"game_fields",new string[]{"openid"}},
                {"cpmigrate_args","cpcustom"},

            });
            RuiXueSdk.Init(initArgs, InitCallback());
        }
        public static void Init119()
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
                privacy = privacyStr
            };

            RuiXueSdk.Init(initArgs, InitCallback());
        }


        public static void Init1000038()
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
                privacy = privacyStr
            };

            RuiXueSdk.Init(initArgs, InitCallback());
        }


        public static void Init1000103()
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
                privacy = privacyStr

            };

            RuiXueSdk.Init(initArgs, InitCallback());


            // RuiXueSdk.Init("114", "1002", "100", new string[] { "http://cn-api-test.ruixueyun.com" }, (code, data, msg) =>
            // {
            //     ShowText(data);
            //     Log.D("Init : code:" + code + ", msg:" + msg + ",data:" + data);
            // });
        }

    }
}