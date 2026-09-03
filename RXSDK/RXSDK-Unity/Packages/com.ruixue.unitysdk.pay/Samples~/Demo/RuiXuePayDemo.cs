using System;
using System.Collections.Generic;
using RuiXue;
using RuiXue.Login;
using RuiXue.Pay;
using RuiXue.Google;
using UnityEngine;
using UnityEngine.UI;

public class RuiXuePayDemo : MonoBehaviour
{

    public Button _Button_Pay;
    public Button _Button_Login;
    public Button _Button_QueryProduct;
    
    private void Awake()
    {
        Init();
        OnSetPrivacyAgree();
        // DouYinH5Login();
        
        Dictionary<string, object> map = new();
        
        // bilibili
        map.Add("server_id", "6885");
        map.Add("server_name", "bilibili区");
        map.Add("merchant_id", "2402");
        // map.Add("appid", "7713");
        // map.Add("appkey", "a481e40a81eb4a25a53527f175de7ef1");
        
        // oppo
        map.Add("appSecret", "01bc05dc742a4319bb2ac4c312b2a8a8");
        
        // 百度网讯
        /*map.Add("appid", 18521119);
        map.Add("appkey", "LxAvWcVW8pMWayzPN4cqryO9");*/
        
        map.Add("clientId", "728854069094-v0apajj7rd65s3abb8aj9kkub79rdt4f.apps.googleusercontent.com");
        
        map.Add("ld_app_key", "82451108656044469d666b73573688c8");
        
        map.Add("catappult_public_key", "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyEt94j9rt0UvpkZ2jPMZZ16yUrBOtjpIQCWi/\nF3HN0+iwSAeEJyDw7xIKfNTEc0msm+m6ud1kJpLK3oCsK61syZ8bYQlNZkUxTaWNof1nMnbw3Xu5nuY\nMuowmzDqNMWg5jNooy6oxwIgVcdvbyGi5RIlxqbo2vSAwpbAAZE2HbUrysKhLME7IOrdRR8MQbSbKE\ny/9MtfKz0uZCJGi9h+dQb0b69H7Yo+/BN/ayBSJzOPlaqmiHK5lZsnZhK+ixpB883fr+PgSczU7qGoktqoe\n6Fs+nhk9bLElljCs5ZIl9/NmOSteipkbplhqLY7KwapDmhrtBgrTetmnW9PU/eCWQIDAQAB");
        
        RuiXueSdk.InitThirdSdk(map, InitThirdSdkResponseDelegate, InitThirdSdkErrorDelegate);
        
    }
    
    public void InitThirdSdkResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestResponseDelegate: {data}");
    }
    public void InitThirdSdkErrorDelegate(string data)
    {
        LogUtil.Log("EventManager", $"RequestErrorDelegate: {data}");
    }

    void Start()
    {
        _Button_Pay.onClick.AddListener(OnPay);
        _Button_Login.onClick.AddListener(OnLogin);
        _Button_QueryProduct.onClick.AddListener(OnQueryProductDetailsAsync);
    }
    
    private void Init()
    {
        // string cpId = "1000038";
        // string channelId = "300";
        // string productId = "264";
        // List<string> list = new()
        // {
        //     "https://yh9gc7be1n.hitoffapp.com/"
        // };
        //
        // RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
        
        /*string cpId = "120";
        string channelId = "unity_test_overseas";
        string productId = "unity_test_overseas";
        List<string> list = new()
        {
            "https://os-api-demo.ruixuecloud.com/"f
        };

        RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);*/
        
        // string cpId = "112";
        // string channelId = "123456789";
        // string productId = "123456789";
        // List<string> list = new()
        // {
        //     "https://cn-api-demo.ruixuecloud.com/"
        // };
        //
        // RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
        
        // string cpId = "1000112";
        // string channelId = "1001";
        // string productId = "264";
        // List<string> list = new()
        // {
        //     "https://wygzt.homelandfishingarcade.com/"
        // };
        //
        // RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
        
        // string cpId = "1000101";
        // string channelId = "100";
        // string productId = "1002";
        // List<string> list = new()
        // {
        //     "https://anhvcpo.weilekuiming.com/"
        // };
        //
        // RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
        
        // string cpId = "114";
        // string channelId = "iOS";
        // string productId = "1002";
        // List<string> list = new()
        // {
        //     "http://cn-api-test.ruixuecloud.com/"
        // };
        //
        // RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
        
        // string cpId = "114";
        // string channelId = "unity_test";
        // string productId = "unity_test";
        // List<string> list = new()
        // {
        //     "https://cn-api-test.ruixuecloud.com/"
        // };
        
        // string cpId = "119";
        // string channelId = "AndroidOS";
        // string productId = "SDKOS";
        // List<string> list = new()
        // {
        //     "http://os-api-test.ruixuecloud.com/"
        // };
        
        string cpId = "1000197";
        string channelId = "999";
        string productId = "198";
        List<string> list = new()
        {
            "https://winykn.jiaxiangyouxi.com/"
        };
        
        RuiXueSdk.Initialize(cpId, productId, channelId, list, InitResponseDelegate, InitErrorDelegate);
    }

    public void InitResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"InitResponseDelegate RequestResponseDelegate: {data}");
        
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
        guestLogin();
        // WxLogin();
        // LeidianLogin();
    }

    private void WeiXinPay()
    {
        Dictionary<string, object> dic = new();
        
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        
        dic.Add("pay_type", "wechat");
        dic.Add("goods_tag", "weile_rich_GiftPack_1000101");
        dic.Add("indulge_auth", 1);
        dic.Add("trade_no", "518146497684968084");
        dic.Add("currency", "CNY");
        dic.Add("age", 30);
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    
    private void DouYinH5Login()
    {
        
        LogUtil.Log("EventManager", "发起抖音H5登录");
        
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.DouYinH5;
        loginConfig.force = true;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);

    }

    private void guestLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.Guest;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }

    private void CountLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.Username;
        loginConfig.username = "xuqiangtest1123";
        loginConfig.password = "ruixue@12345678";
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    
    private void DouYinLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.DouYin;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }

    private void BilibiliLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.BiliBili;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    
    private void MiLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.Mi;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    
    private void BaiduLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.BaiduNet;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    
    private void WxLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        Dictionary<string, object> ext = new();
        ext.Add("appid", "wxd9cba83a0a1ef20d");
        loginConfig.ext = ext;
        loginConfig.loginType = LoginMethod.Wechat;
        
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

    private void OnPay()
    {
        //DouYinH5Pay();
        // ApplePay();
        // Wechath5();

        // leidian();
        
        // CheckOutPay();
        // Alipayh5Pay();
        // unipinPay();

        WeiXinPay();
    }
    
    private void ApplePay()
    {
        Dictionary<string, object> dic = new();
        dic.Add("goods_tag","ios_tag");
        dic.Add("trade_no","1717674093331");
        dic.Add("is_debug", 1);
        dic.Add("env", 1);
        dic.Add("notify_url","");
        dic.Add("transmit_args","");
        dic.Add("indulge_auth", 0);
        dic.Add("currency","CNY");
        dic.Add("pay_type","appstore");
        dic.Add("age", 30);
        dic.Add("user_real_currency", "CNY");
        dic.Add("user_real_price", "1");
        
        Dictionary<string, object> subDic = new();
        subDic.Add("cp_game_character_id","123");
        subDic.Add("cp_game_area_id","456");
        dic.Add("game_info", subDic);
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    
    private void DouYinH5Pay()
    {
        Dictionary<string, object> dic = new();
        
        dic.Add("pay_type", "douyinh5");
        dic.Add("goods_tag", "douyin");
        dic.Add("trade_no", "2312125686062680");
        dic.Add("onlyGetOrder", true);
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }

    /// <summary>
    /// 微信支付
    /// </summary>
    private void Wechath5()
    {
        Dictionary<string, object> dic = new();
        
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        
        dic.Add("pay_type", "wechath5");
        dic.Add("goods_tag", "goods_mcard_ttl30_rmb1");
        dic.Add("indulge_auth", 1);
        dic.Add("trade_no", timeStamp.ToString());
        dic.Add("currency", "CNY");
        dic.Add("age", 30);
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    /// <summary>
    /// 阿里支付
    /// </summary>
    private void Alipayh5()
    {
        Dictionary<string, object> dic = new();
        
        dic.Add("pay_type", "alipayh5");
        dic.Add("goods_tag", "weile_cat_gift2");
        dic.Add("indulge_auth", 1);
        dic.Add("trade_no", "2312125686062680");
        dic.Add("currency", "CNY");
        dic.Add("age", 30);
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    /// <summary>
    /// 抖音支付
    /// </summary>
    private void Douyin()
    {
        Dictionary<string, object> dic = new();
        
        dic.Add("pay_type", "douyin");
        dic.Add("goods_tag", "weile_cat_gift2");
        dic.Add("indulge_auth", 1);
        dic.Add("trade_no", "2312125686062680");
        dic.Add("currency", "CNY");
        dic.Add("age", 30);
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    /// <summary>
    /// 哔哩哔哩
    /// </summary>
    private void Bilibili()
    {
        
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        
        Dictionary<string, object> dic = new();
        dic.Add("pay_type", "bilibili");
        dic.Add("goods_tag", "weile_cat_gift2");
        dic.Add("indulge_auth", 1);
        dic.Add("trade_no", timeStamp.ToString());
        dic.Add("currency", "CNY");
        dic.Add("age", 30);

        dic.Add("game_money", 1);
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    
    public void LeidianLogin()
    {
        LoginConfig loginConfig = new LoginConfig();
        loginConfig.loginType = LoginMethod.LEIDIAN;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);  
    }
    
    private void leidian()
    {
        
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        
        Dictionary<string, object> dic = new();
        dic.Add("pay_type", "leidian");
        dic.Add("goods_tag", "youtube_test");
        dic.Add("trade_no", timeStamp.ToString());
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    /// <summary>
    /// Vivo 支付
    /// </summary>
    private void Vivo()
    {
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        
        Dictionary<string, object> dic = new();
        dic.Add("pay_type", "vivo");
        dic.Add("goods_tag", "weile_cat_gift2");
        dic.Add("indulge_auth", 1);
        dic.Add("trade_no", timeStamp.ToString());
        dic.Add("currency", "CNY");
        dic.Add("age", 30);
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    
    /// <summary>
    /// Oppo
    /// </summary>
    private void Oppo()
    {
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        
        Dictionary<string, object> dic = new();
        dic.Add("pay_type", "oppo");
        dic.Add("goods_tag", "weile_cat_gift2");
        dic.Add("indulge_auth", 1);
        dic.Add("trade_no", timeStamp.ToString());
        dic.Add("currency", "CNY");
        dic.Add("age", 30);
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    
    /// <summary>
    /// 华为登录
    /// </summary>
    private void HuaweiLogin()
    {
        LoginConfig loginConfig = new();
        loginConfig.loginType = LoginMethod.HWJos;
        RXLogin.Login(loginConfig, LoginResponseDelegate, LoginErrorDelegate);
    }
    /// <summary>
    /// 华为支付
    /// </summary>
    private void Huawei()
    {
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        
        Dictionary<string, object> dic = new();
        dic.Add("pay_type", "hwjos");
        dic.Add("goods_tag", "830004024");
        dic.Add("indulge_auth", 1);
        dic.Add("trade_no", timeStamp.ToString());
        dic.Add("currency", "CNY");
        dic.Add("age", 30);
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    /// <summary>
    /// 小米支付
    /// </summary>
    private void XiaoMi()
    {
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        
        Dictionary<string, object> dic = new();
        dic.Add("pay_type", "mi");
        dic.Add("goods_tag", "weile_cat_gift2");
        dic.Add("indulge_auth", 1);
        dic.Add("trade_no", timeStamp.ToString());
        dic.Add("currency", "CNY");
        dic.Add("age", 30);
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    /// <summary>
    /// 银联支付
    /// </summary>
    private void Aums()
    {
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        
        Dictionary<string, object> dic = new();
        dic.Add("pay_type", "aums");
        dic.Add("goods_tag", "830004024");
        dic.Add("indulge_auth", 1);
        dic.Add("trade_no", timeStamp.ToString());
        dic.Add("currency", "CNY");
        dic.Add("age", 30);
        
        Dictionary<string, object> extmap = new();
        extmap.Add("pay_type", "alipay");
        dic.Add("ext", extmap);
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    
    /// <summary>
    /// 百度网讯支付
    /// </summary>
    private void Baidu()
    {
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        
        Dictionary<string, object> dic = new();
        dic.Add("pay_type", "baidunet");
        dic.Add("goods_tag", "830004024");
        dic.Add("indulge_auth", 1);
        dic.Add("trade_no", timeStamp.ToString());
        dic.Add("currency", "CNY");
        dic.Add("age", 30);
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    /// <summary>
    /// Google 支付
    /// </summary>
    private void Google()
    {
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        
        Dictionary<string, object> dic = new();
        dic.Add("pay_type", "google");
        dic.Add("goods_tag", "830004012");
        dic.Add("indulge_auth", 1);
        dic.Add("trade_no", timeStamp.ToString());
        dic.Add("currency", "USD");
        dic.Add("age", 30);
        
        Dictionary<string, object> extmap = new();
        extmap.Add("third_tag", "com.weile.bygame.ticket9");
        dic.Add("ext", extmap);
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    /// <summary>
    /// Xsolla 支付
    /// </summary>
    //todo 缺少正式环境，未调通
    private void Xsolla()
    {
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        
        Dictionary<string, object> dic = new();
        dic.Add("pay_type", "xsolla");
        dic.Add("goods_tag", "936302001");
        dic.Add("indulge_auth", 1);
        dic.Add("trade_no", timeStamp.ToString());
        dic.Add("currency", "USD");
        dic.Add("age", 30);
        dic.Add("env", 0);
        
        dic.Add("notify_url", "http://game.pay.result.callback");
        
        Dictionary<string, object> extmap = new();
        extmap.Add("user_name", "xuqiangtest1123");
        dic.Add("ext", extmap);
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    /// <summary>
    /// Upay 支付
    /// </summary>
    private void upay()
    {
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        
        Dictionary<string, object> dic = new();
        dic.Add("pay_type", "upay");
        dic.Add("goods_tag", "831000097");
        dic.Add("indulge_auth", 1);
        dic.Add("trade_no", timeStamp.ToString());
        dic.Add("currency", "USD");
        dic.Add("age", 30);
        dic.Add("env", 0);
        
        dic.Add("notify_url", "http://game.pay.result.callback");
        
        Dictionary<string, object> extmap = new();
        
        extmap.Add("pay_type", "net");
        extmap.Add("type_id", "13");
        extmap.Add("vendor", "");
        
        dic.Add("ext", extmap);
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }

    private void CheckOutPay()
    {
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        Dictionary<string, object> dic = new();
        
        dic.Add("pay_type", "checkout");
        dic.Add("env", 1); // 测试: 1 生产: 0
        dic.Add("goods_tag", "paytest");
        dic.Add("currency", "USD");
        dic.Add("age", 18);
        
        Dictionary<string, object> extmap = new();
        extmap.Add("user_name", "test");
        dic.Add("ext", extmap);

        dic.Add("trade_no", timeStamp);
        dic.Add("notify_url", "http://game.pay.result.callback");
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
        
    }

    private void AptoidePay()
    {
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        Dictionary<string, object> dic = new();
        
        dic.Add("pay_type", "aptoide");
        dic.Add("env", 1); // 测试: 1 生产: 0
        dic.Add("goods_tag", "paytest");
        dic.Add("currency", "USD");
        dic.Add("age", 18);
        
        Dictionary<string, object> extmap = new();
        extmap.Add("user_name", "test");
        dic.Add("ext", extmap);

        dic.Add("trade_no", timeStamp);
        dic.Add("notify_url", "http://game.pay.result.callback");
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    
    private void YeepayPay()
    {
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        Dictionary<string, object> dic = new();
        
        dic.Add("pay_type", "yeepay");
        dic.Add("env", 1); // 测试: 1 生产: 0
        dic.Add("goods_tag", "paytest");
        dic.Add("currency", "USD");
        dic.Add("age", 18);
        
        Dictionary<string, object> extmap = new();
        extmap.Add("user_name", "test");
        dic.Add("ext", extmap);

        dic.Add("trade_no", timeStamp);
        dic.Add("notify_url", "http://game.pay.result.callback");
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }

    private void AlipayPay()
    {
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        Dictionary<string, object> dic = new();
        
        dic.Add("pay_type", "alipay");
        dic.Add("env", 1); // 测试: 1 生产: 0
        dic.Add("goods_tag", "paytest");
        dic.Add("currency", "USD");
        dic.Add("age", 18);
        
        Dictionary<string, object> extmap = new();
        extmap.Add("user_name", "test");
        dic.Add("ext", extmap);

        dic.Add("trade_no", timeStamp);
        dic.Add("notify_url", "http://game.pay.result.callback");
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    
    private void Alipayh5Pay()
    {
        long timeStamp = DateTimeOffset.Now.ToUnixTimeSeconds();
        Dictionary<string, object> dic = new();
        
        dic.Add("pay_type", "alipayh5");
        dic.Add("env", 1); // 测试: 1 生产: 0
        dic.Add("goods_tag", "paytest");
        dic.Add("currency", "USD");
        dic.Add("age", 18);
        
        Dictionary<string, object> extmap = new();
        extmap.Add("user_name", "test");
        dic.Add("ext", extmap);

        dic.Add("trade_no", timeStamp);
        dic.Add("notify_url", "http://game.pay.result.callback");
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }
    
    /// <summary>
    /// unipin支付
    /// </summary>
    /// <returns></returns>
    private void unipinPay()
    {
        Dictionary<string, object> dic = new();
        dic.Add("goods_tag","ios_tag");
        dic.Add("trade_no","1717674093331");
        dic.Add("is_debug", 1);
        dic.Add("env", 1);
        dic.Add("notify_url","");
        dic.Add("transmit_args","");
        dic.Add("indulge_auth", 0);
        dic.Add("currency","IDR");
        dic.Add("pay_type","unipin");
        dic.Add("age", 30);
        dic.Add("user_real_currency", "IDR");
        dic.Add("user_real_price", "1");
        
        Dictionary<string, object> subDic = new();
        subDic.Add("cp_game_character_id","123");
        subDic.Add("cp_game_area_id","456");
        dic.Add("game_info", subDic);
        
        RXPay.Pay(dic, PayResponseDelegate, PayErrorDelegate);
    }

    private void PayResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"Pay Response : {data}");
    }

    private void PayErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"Pay Error : {error}");
    }
    
    public void OnQueryProductDetailsAsync()
    {
        List<string> productIdList = new();
        // productIdList.Add("com.weile.bygame.ticket9");
        // productIdList.Add("com.weile.bombchicken.1002");
        // productIdList.Add("com.weile.bombchicken.1003");
        // productIdList.Add("com.weile.bombchicken.1004");
        // productIdList.Add("com.weile.bombchicken.1005");
        // productIdList.Add("com.weile.bombchicken.1006");
        // productIdList.Add("com.weile.bombchicken.1007");
        
        productIdList.Add("com.ruixue.sdk1");
        
        #if UNITY_ANDROID
        RXGoogle.QueryProductDetailsAsync(productIdList, GoogleResponseDelegate, GoogleErrorDelegate);
        #elif UNITY_IOS
        RXPay.IOS_GetProductInfos(productIdList, IOSResponseDelegate, IOSErrorDelegate);
        #endif
    }
    
    private void GoogleResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"GoogleResponseDelegate: {data}");
    }
    
    
    private void GoogleErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"Pay Error : {error}");
    }
    
    private void IOSResponseDelegate(string data)
    {
        LogUtil.Log("EventManager", $"IOSResponseDelegate: {data}");
    }
    
    private void IOSErrorDelegate(string error)
    {
        LogUtil.Log("EventManager", $"IOSErrorDelegate: {error}");
    }
    
    public void GoogleStringFailForAndroid(int code, string msg, string traceId)
    {
        LogUtil.Log("EventManager", $"GoogleResponseDelegate: {code} - {msg} = {traceId}");
    }


}
