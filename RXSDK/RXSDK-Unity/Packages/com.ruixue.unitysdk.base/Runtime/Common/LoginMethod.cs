namespace RuiXue
{
    public static class LoginMethod
    {
        public const string Virtual = "virtual";// 虚拟账号。用于一些暂时不想接入瑞雪通行证的账号体系，但要使用瑞雪的分享、统计等功能的游戏项目，相当于将游戏项目自身作为一个三方账号平台。
        public const string CaptchaCode = "captchacode"; // 手机/邮箱验证码登录，username 可为手机号或者邮箱地址
        public const string Guest = "guest"; // 游客账号，以设备信息生成设备码作为登录凭证。
        public const string Username = "username"; // 普通账号，包括手机账号、邮箱账号和自定义用户名的账号
        public const string QuickPhone = "quickphone"; // 阿里一键登录，即将当前手机号作为用户名。
        public const string Wechat = "wechat"; // 通过微信 APP 授权登录微信账号
        public const string Minigame = "minigame"; // 通过微信小游戏登录微信账号
        public const string MobileQQ = "mobileqq"; // QQ 账号登录。
        public const string YSDK = "ysdk"; // 应用宝账号登录。
        public const string KuaiShou = "kuaishou"; // 登录快手账号。 
        public const string Apple = "apple"; // 登录苹果账号。
        public const string BaiduNet = "baidunet"; // 登录百度网讯账号
        public const string HuaWei = "huawei"; // 登录华为账号。
        public const string HWJos = "hwjos"; // 登录华为拂袖账号
        public const string HuaWeiH5 = "huaweih5"; // 通过 H5 的方式登录华为账号
        public const string Mi = "mi"; // 登录小米账号。
        public const string Vivo = "vivo"; // 登录 vivo 账号。
        public const string Oppo = "oppo"; // 登录 oppo 账号。
        public const string MeiTuan = "meituan"; // 登录美团账号
        public const string DouYin = "douyin"; // 登录抖音账号。
        public const string DouYinH5 = "douyinh5"; // 登录抖音小游戏账号。
        public const string FaceBook = "facebook"; // 登录 facebook 账号。
        public const string Google = "google"; // 登录 google 账号。
        public const string TapTap = "taptap"; // 登录 TapTap 账号。
        public const string BiliBili = "bilibili"; // 登录 bilibili 账号
        public const string Line = "line"; // 登录 LINE 账号
        public const string _4399 = "4399"; // 登录 4399 账号
        public const string WeiLe = "weile"; // 登录微乐小游戏账号
        public const string JiXiang = "jixiang"; // 登录吉祥小游戏账号。
        public const string XinYue = "xinyue";// 登录心悦小游戏账号。
        public const string Qoo = "qoo";// Qoo渠道登录
        public const string Zalo = "zalo";// zalo登录
        public const string Tiktok = "tiktok";// tiktok登录
        public const string SnapChat = "snapchat";//snapchat登录，snapChat无登录功能
        public const string Instagram = "instagram";//instagram登录
        public const string Reddit = "reddit";// Reddit登录
        public const string Default = "default"; //自定义登录
        public const string LEIDIAN = "leidian";// 雷电
        public const string HIHONOR = "hihonor";// 荣耀
        public const string MuMu = "mumu";// 网易 MuMu/Yofun 渠道登录
        public const string Huya = "huya";// 虎牙联运渠道登录
        public const string Xuteng = "xuteng";// 栩腾渠道登录
        public const string QUICK = "quick";// quick
    }
}