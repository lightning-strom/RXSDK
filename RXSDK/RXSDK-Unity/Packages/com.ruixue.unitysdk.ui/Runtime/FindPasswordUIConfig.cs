namespace RuiXue.LoginUI
{
    public class FindPasswordUIConfig
    {
        /// <summary>
        ///     账号类型提示（1-通用提示 ，2-手机号提示，3-邮箱提示 [可选 默认 2]）
        /// </summary>
        public int account_type=2;

        /// <summary>
        ///     输入密码提示文本
        /// </summary>
        public string password_hint;

        /// <summary>
        ///     默认填充的账号
        /// </summary>
        public string username;
    }
}