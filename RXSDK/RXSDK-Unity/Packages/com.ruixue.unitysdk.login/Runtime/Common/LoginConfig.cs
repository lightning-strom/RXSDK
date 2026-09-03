using System.Collections.Generic;

namespace RuiXue.Login
{
    public class LoginConfig
    {
        public string loginType;
        public string version;
        public string username;
        public string password;
        public string captchaCode;
        public string loginOpenId;
        public Dictionary<string, object> ext;
        public string[] signFields;
        public object migrateArgs;
        public string[] permissions;

        public bool force;

        public bool forbid_visitor; // 是否禁止游客登录





    }
}