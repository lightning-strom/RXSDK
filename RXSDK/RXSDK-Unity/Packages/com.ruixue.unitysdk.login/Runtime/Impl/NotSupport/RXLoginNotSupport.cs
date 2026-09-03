using System.Collections.Generic;

namespace RuiXue.Login.Impl
{
    internal class RXLoginNotSupport: IRXLogin
    {
        public void DeregisterCancel(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("DeregisterCancel");
        }

        public void SearchBindingAccounts(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("SearchBindingAccounts");
        }

        public void GetUserInfo(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetUserInfo");
        }

        public void GetUserInfoByField(Dictionary<string, object> param, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetUserInfoByField");
        }

        public void Logout(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("Logout");
        }

        public void Register(string username, string password, string captchaCode, Dictionary<string, object> ext, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("Register");
        }

        public void Login(string loginType, string username, string password, string captchaCode, string loginOpenId, Dictionary<string, object> ext, string[] signFields, object migrateArgs, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("Login");
        }

        public void Login(LoginConfig loginConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("Login");
        }

        public void Deregister(RXDeregisterConfig deregisterConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("Deregister");
        }

        public void SendCaptcha(CaptchaType type, string target, string purpose, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("SendCaptcha");
        }

        public void VerifyCaptcha(CaptchaType type, string target, string purpose, string captcha_code, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("VerifyCaptcha");
        }

        public void BindEmail(string email, string password, string captcha_code, object migrate_args, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("BindEmail");
        }

        public void UnBindEmail(string email, string captcha_code, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("UnBindEmail");
        }

        public void BindPhone(string phone, string password, string captcha_code, object migrate_args, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("BindPhone");
        }

        public void UnBindPhone(string phone, string captcha_code, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("UnBindPhone");
        }

        public void ChangePhone(string newPhone, string newPhoneCaptcha, string oldPhoneCaptcha, object migrateArgs, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("ChangePhone");
        }

        public void UpdateUserInfo(string nickname, string avatarUrl, string region, int sex, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("UpdateUserInfo");
        }

        public void ChangePassword(string old_password, string new_password, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("ChangePassword");
        }

        public void ResetPassword(string username, string password, string captcha_code, object migrate_args, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("ResetPassword");
        }

        public void RealAuth(string realname, string idcard, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("RealAuth");
        }
    }
}
