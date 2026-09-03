using System;
using System.Collections.Generic;

namespace RuiXue.LoginUI
{
    [Serializable]
    public class LoginUIConfig
    {
        /// <summary>
        /// 登录方式
        /// </summary>
        public List<string> loginTypes = new List<string>();

        /// <summary>
        /// 协议地址, 顺序0为用户协议，1为隐私协议
        /// </summary>
        public List<string> privacies = new List<string>();

        /// <summary>
        /// 协议显示名称，顺序0为用户协议，1为隐私协议
        /// </summary>
        public List<string> privacieTitles = new List<string>();
        
        /// <summary>
        ///  登录显示的 logo，不配置默认显示标题。
        /// </summary>
        public byte[] logoImage;

        /// <summary>
        /// 登录页是否显示关闭按钮，默认显示。
        /// </summary>
        public bool isShowClose = true;

        /// <summary>
        /// 显示账号密码登录或验证码登录。0 账号密码登录 1 验证码登录 默认账号密码登录。
        /// </summary>
        public int loginViewType = 0;

        /// <summary>
        /// 账号密码登录方式键盘类型。1 全键盘 2 数字键盘 3 邮箱键盘 默认全键盘。
        /// </summary>
        public int keyboardType = 1;

        /// <summary>
        /// 验证码登录的新用户是否弹出设置密码，默认不弹出。注：弹出设置密码后登录数据将在设置成功或关闭设置页面后返回。
        /// </summary>
        public bool needSetPassword = false;

        /// <summary>
        /// 是否显示底部快速登录按钮，默认显示。
        /// </summary>
        public bool isQuickButtonBarVisible = true;

        /// <summary>
        /// 处于注销中的用户登录后是否显示注销窗口，默认不显示
        /// </summary>
        public bool isShowDeregister = false;

        /// <summary>
        /// 如果账号在注销中是继续登录还是退出登录
        /// </summary>
        public bool isLoginContinue = true;

        /// <summary>
        /// 自定义参数
        /// </summary>
        public Dictionary<string, object> customParams;

        /// <summary>
        /// 自定义参数
        /// </summary>
        public string forgotUrl;
        
    }
}