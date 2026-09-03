using System.Collections.Generic;
using RuiXue;

namespace RuiXue.Login.Impl
{
    internal interface IRXLogin
    {
        /// <summary>
        /// 退出登录，目前Android端逻辑
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="RequestErrorDelegate"></param>
        public void Logout(RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <param name="captchaCode"></param>
        /// <param name="ext"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void Register(string username, string password, string captchaCode, Dictionary<string, object> ext, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="loginType"></param>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <param name="captchaCode"></param>
        /// <param name="loginOpenId"></param>
        /// <param name="ext"></param>
        /// <param name="signFields"></param>
        /// <param name="migrateArgs"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void Login(string loginType, string username, string password, string captchaCode, string loginOpenId, 
            Dictionary<string, object> ext, string[] signFields, object migrateArgs, 
            RequestResponseDelegate onResponse,RequestErrorDelegate onError);
        
        public void Login(LoginConfig loginConfig, RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 注销
        /// </summary>
        /// <param name="idcard"></param>
        /// <param name="realname"></param>
        /// <param name="cpdata"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void Deregister(RXDeregisterConfig deregisterConfig, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError);
        
        /// <summary>
        /// 撤销注销申请
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void DeregisterCancel(RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 查询当前用户绑定的手机/邮箱账号
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void SearchBindingAccounts(RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 获取验证码（发送验证码）
        /// </summary>
        /// <param name="type"></param>
        /// <param name="target"></param>
        /// <param name="purpose"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void SendCaptcha(CaptchaType type, string target, string purpose, RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 校验验证码
        /// </summary>
        /// <param name="type"></param>
        /// <param name="target"></param>
        /// <param name="purpose"></param>
        /// <param name="captcha_code"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void VerifyCaptcha(CaptchaType type, string target, string purpose, string captcha_code, RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 绑定邮箱
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="captcha_code"></param>
        /// <param name="migrate_args"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void BindEmail(string email, string password, string captcha_code, object migrate_args, RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 解绑邮箱
        /// </summary>
        /// <param name="email"></param>
        /// <param name="captcha_code"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void UnBindEmail(string email, string captcha_code, RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 绑定手机号
        /// </summary>
        /// <param name="phone"></param>
        /// <param name="password"></param>
        /// <param name="captcha_code"></param>
        /// <param name="migrate_args"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void BindPhone(string phone, string password, string captcha_code, object migrate_args, RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 解绑手机号
        /// </summary>
        /// <param name="phone"></param>
        /// <param name="captcha_code"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void UnBindPhone(string phone, string captcha_code, RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 修改手机号
        /// </summary>
        /// <param name="newPhone"></param>
        /// <param name="newPhoneCaptcha"></param>
        /// <param name="oldPhoneCaptcha"></param>
        /// <param name="migrateArgs"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void ChangePhone(string newPhone, string newPhoneCaptcha, string oldPhoneCaptcha, object migrateArgs, RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 获取用户信息
        /// </summary>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetUserInfo(RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 获取指定用户信息
        /// </summary>
        /// <param name="param"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetUserInfoByField(Dictionary<string, object> param, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError);
        
        /// <summary>
        /// 修改用户信息
        /// </summary>
        /// <param name="nickname"></param>
        /// <param name="avatarUrl"></param>
        /// <param name="region"></param>
        /// <param name="sex"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void UpdateUserInfo(string nickname, string avatarUrl, string region, int sex, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 修改密码
        /// </summary>
        /// <param name="old_password"></param>
        /// <param name="new_password"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void ChangePassword(string old_password, string new_password, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        /// <summary>
        /// 重置密码
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <param name="captcha_code"></param>
        /// <param name="migrate_args"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void ResetPassword(string username, string password, string captcha_code, object migrate_args, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);
           
        /// <summary>
        /// 实名认证
        /// </summary>
        /// <param name="realname"></param>
        /// <param name="idcard"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void RealAuth(string realname, string idcard, RequestResponseDelegate onResponse, RequestErrorDelegate onError);
    }
}


