using System.Collections.Generic;

namespace RuiXue.LoginUIOverSeas.Impl
{
    internal interface IRXLoginUIOverSeas
    {
        /// <summary>
        ///     显示登录界面
        /// </summary>
        /// <param name="config"></param>
        /// <param name="callback"></param>
        void LoginUI(LoginUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate);

        /// <summary>
        ///     关闭登录弹窗
        /// </summary>
        void CloseLoginUI();

        /// <summary>
        ///     显示找回密码界面
        /// </summary>
        /// <param name="config"></param>
        /// <param name="callback"></param>
        void FindPasswordUI(FindPasswordUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate);

        /// <summary>
        ///     撤销注销申请
        /// </summary>
        /// <param name="isLoginContinue"></param>
        /// <param name="callback"></param>
        void DestroyAccountStatusView(bool isLoginContinue, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate, RequestExtDelegates extDelegates);

        /// <summary>
        ///     撤销注销申请
        /// </summary>
        /// <param name="okButtonText"></param>
        /// <param name="callback"></param>
        void DestroyAccountStatusView(string okButtonText, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate, RequestExtDelegates extDelegates);

        /// <summary>
        /// </summary>
        /// <param name="key"></param>
        /// <param name="keyList"></param>
        void ProtocolView(string key, List<string> keyList);

        /// <summary>
        ///     实名认证界面
        /// </summary>
        /// <param name="cancelAble"></param>
        /// <param name="callback"></param>
        void RealAuthUI(bool cancelAble, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate);

        /// <summary>
        ///     防沉迷界面
        /// </summary>
        /// <param name="titleStr"></param>
        /// <param name="contextStr"></param>
        /// <param name="buttonTxt"></param>
        /// <param name="callback"></param>
        void LimitUI(string titleStr, string contextStr, string buttonTxt, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate);

        /// <summary>
        ///     用户中心
        /// </summary>
        /// <param name="config"></param>
        /// <param name="callback"></param>
        void UserCenterUI(UserCenterUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate);

        /// <summary>
        ///     申请账号注销
        /// </summary>
        /// <param name="config"></param>
        /// <param name="callback"></param>
        void ApplyForDeregisterUI(UserCenterUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate);
        
        /// <summary>
        ///     同步账号记录
        /// </summary>
        /// <param name="accounts"></param>
        public void SyncAccounts(List<Dictionary<string, string>> accounts);
        
        /// <summary>
        ///     邮件中心
        /// </summary>
        /// <param name="userId"></param>
        void ShowMailCenter(string userId);

        /// <summary>
        /// 显示公告UI
        /// </summary>
        /// <param name="limit"></param>
        /// <param name="onLink"></param>
        /// <param name="hsAnnounceUI"></param>
        void ShowAnnounceView(int limit, OnLink onLink, HsAnnounceUI hsAnnounceUI);

        /// <summary>
        /// 产品包版本检查公告UI（通用）
        /// </summary>
        /// <param name="version"></param>
        /// <param name="region"></param>
        /// <param name="queryMap"></param>
        /// <param name="isShowUI"></param>
        /// <param name="onLink"></param>
        /// <param name="hsAnnounceUI"></param>
        void ShowUpdateAppView(string version, string region, Dictionary<string, object> queryMap, 
            bool isShowUI, OnLink onLink, HsAnnounceUI hsAnnounceUI, 
            RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate);

        /// <summary>
        /// 产品包版本检查公告UI（自定义）
        /// </summary>
        /// <param name="version"></param>
        /// <param name="region"></param>
        /// <param name="type"></param>
        /// <param name="queryMap"></param>
        /// <param name="isShowUI"></param>
        /// <param name="onLink"></param>
        /// <param name="hsAnnounceUI"></param>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        public void ShowCheckUpdateAppView(string version, string region, string type,
            Dictionary<string, object> queryMap, bool isShowUI, OnLink onLink, HsAnnounceUI hsAnnounceUI,
            RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate);
        
        /// <summary>
        /// 绑定/换绑手机
        /// </summary>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        public void bindPhone(RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate);
        
        /// <summary>
        /// 绑定/换绑邮箱
        /// </summary>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        public void bindEmail(RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate);
    }
}