#if UNITY_IOS
namespace RuiXue
{
    public enum LoginTypeForIOS
    {
        LoginTypeVisitor, // 游客登录
        LoginTypeAccount, // 账号登录
        LoginTypeEmail, // 邮箱登录
        LoginTypeAuth, // 本机一键登录
        LoginTypeW, // 微信登录
        LoginTypeApple, // 苹果登录
        LoginTypeQuick, // 二次登录
        LoginTypeGoogle, // 谷歌登录
        LoginTypeFacebook, // facebook登录
        LoginTypeVirtual, // 虚拟登录
        LoginTypeCapCode, // 验证码登录
        LoginTypeLine, // line登录
        LoginTypeZalo,     // zalo登录
        LoginTypeTikTok,   // tiktok登录
        LoginTypeSnapChat, // snapChat登录,snapChat无登录功能
        LoginTypeInstagram,// instagram登录
        LoginTypeReddit,   // reddit登录
        LoginTypeDefault,   // 自定义登录
        
        LoginTypeNotSupport
    }

    public static class LoginTypeForIOSExtension
    {
        // 转换为LoginMethod
        public static string ToLoginMethod(this LoginTypeForIOS loginType)
        {
            switch (loginType)
            {
                case LoginTypeForIOS.LoginTypeVisitor:
                    return LoginMethod.Guest;
                case LoginTypeForIOS.LoginTypeAccount:
                    return LoginMethod.Username;
                case LoginTypeForIOS.LoginTypeEmail:
                    return LoginMethod.Username;
                    ;
                case LoginTypeForIOS.LoginTypeAuth:
                    return LoginMethod.QuickPhone;
                case LoginTypeForIOS.LoginTypeW:
                    return LoginMethod.Wechat;
                case LoginTypeForIOS.LoginTypeApple:
                    return LoginMethod.Apple;
                case LoginTypeForIOS.LoginTypeQuick:
                    //return LoginMethod.QuickPhone;
                    return "";
                case LoginTypeForIOS.LoginTypeGoogle:
                    return LoginMethod.Google;
                case LoginTypeForIOS.LoginTypeFacebook:
                    return LoginMethod.FaceBook;
                case LoginTypeForIOS.LoginTypeVirtual:
                    return LoginMethod.Virtual;
                case LoginTypeForIOS.LoginTypeCapCode:
                    return LoginMethod.CaptchaCode;
                case LoginTypeForIOS.LoginTypeLine:
                    return LoginMethod.Line;
                case LoginTypeForIOS.LoginTypeZalo:
                    return LoginMethod.Zalo;
                case LoginTypeForIOS.LoginTypeTikTok:
                    return LoginMethod.Tiktok;
                case LoginTypeForIOS.LoginTypeSnapChat:
                    return LoginMethod.SnapChat;
                case LoginTypeForIOS.LoginTypeInstagram:
                    return LoginMethod.Instagram;
                case LoginTypeForIOS.LoginTypeReddit:
                    return LoginMethod.Reddit;
                case LoginTypeForIOS.LoginTypeDefault:
                    return LoginMethod.Default;
                default:
                    return "";
            }
        }

        public static LoginTypeForIOS FromLoginMethod(string method)
        {
            switch (method)
            {
                case LoginMethod.Guest:
                    return LoginTypeForIOS.LoginTypeVisitor;
                case LoginMethod.Username:
                    return LoginTypeForIOS.LoginTypeAccount;
                // case LoginMethod.Username:
                //     return LoginTypeForIOS.LoginTypeEmail;
                case LoginMethod.QuickPhone:
                    return LoginTypeForIOS.LoginTypeAuth;
                case LoginMethod.Wechat:
                    return LoginTypeForIOS.LoginTypeW;
                case LoginMethod.Apple:
                    return LoginTypeForIOS.LoginTypeApple;
                case LoginMethod.Google:
                    return LoginTypeForIOS.LoginTypeGoogle;
                case LoginMethod.FaceBook:
                    return LoginTypeForIOS.LoginTypeFacebook;
                case LoginMethod.Virtual:
                    return LoginTypeForIOS.LoginTypeVirtual;
                case LoginMethod.CaptchaCode:
                    return LoginTypeForIOS.LoginTypeCapCode;
                case LoginMethod.Line:
                    return LoginTypeForIOS.LoginTypeLine;
                case LoginMethod.Zalo:
                    return LoginTypeForIOS.LoginTypeZalo;
                case LoginMethod.Tiktok:
                    return LoginTypeForIOS.LoginTypeTikTok;
                case LoginMethod.SnapChat:
                    return LoginTypeForIOS.LoginTypeSnapChat;
                case LoginMethod.Instagram:
                    return LoginTypeForIOS.LoginTypeInstagram;
                case LoginMethod.Reddit:
                    return LoginTypeForIOS.LoginTypeReddit;
                case LoginMethod.Default:
                    return LoginTypeForIOS.LoginTypeDefault;
                default:
                    return LoginTypeForIOS.LoginTypeNotSupport;
            }
        }
    }
}
#endif