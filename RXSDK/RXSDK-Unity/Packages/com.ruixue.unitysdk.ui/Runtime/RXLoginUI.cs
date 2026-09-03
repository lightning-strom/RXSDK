using System.Collections.Generic;
using RuiXue;
using RuiXue.LoginUI.Impl;
using UnityEngine;

namespace RuiXue.LoginUI
{
    public static class RXLoginUI
    {
#if UNITY_ANDROID
        private static readonly IRXLoginUI _sdk = new RXLoginUIAndroid();
#elif UNITY_IOS
        private static IRXLoginUI _sdk = new RXLoginUIIOS();
#else
        private static IRXLoginUI _sdk = new RXLoginUINotSupport();
#endif
        
        /// <summary>
        /// 一键登录
        /// </summary>
        /// <param name="config"></param>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        /// <param name="extDelegates"></param>
        public static void ShowOAuthLoginUI(LoginUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _sdk.ShowOAuthLoginUI(config, responseDelegate, errorDelegate);
        }


       /// <summary>
       /// 显示登录界面
       /// </summary>
       /// <param name="config"></param>
       /// <param name="responseDelegate"></param>
       /// <param name="errorDelegate"></param>
       /// <param name="extDelegates"></param>
        public static void LoginUI(LoginUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _sdk.LoginUI(config, responseDelegate, errorDelegate);
        }
        
        /// <summary>
        /// 关闭登录弹窗
        /// </summary>
        public static void CloseLoginUI()
        {
            _sdk.CloseLoginUI();
        }
        
        /// <summary>
        ///  同步账号记录
        /// </summary>
        /// <param name="accounts"></param>
        public static void SyncAccounts(List<Dictionary<string, string>> accounts)
        {
            _sdk.SyncAccounts(accounts);
        }

        /// <summary>
        /// 显示找回密码界面
        /// </summary>
        /// <param name="config"></param>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        /// <param name="extDelegates"></param>
        public static void FindPasswordUI(FindPasswordUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _sdk.FindPasswordUI(config, responseDelegate, errorDelegate);
        }

        /// <summary>
        /// 撤销注销申请
        /// </summary>
        /// <param name="isLoginContinue"></param>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        /// <param name="extDelegates"></param>
        public static void DestroyAccountStatusView(bool isLoginContinue, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate, RequestExtDelegates extDelegates)
        {
            _sdk.DestroyAccountStatusView(isLoginContinue, responseDelegate, errorDelegate,extDelegates);
        }

        /// <summary>
        /// 撤销注销申请
        /// </summary>
        /// <param name="okButtonText"></param>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        /// <param name="extDelegates"></param>
        public static void DestroyAccountStatusView(string okButtonText, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate, RequestExtDelegates extDelegates)
        {
            _sdk.DestroyAccountStatusView(okButtonText, responseDelegate, errorDelegate, extDelegates);
        }


        /// <summary>
        /// 协议声明
        /// </summary>
        /// <param name="key"></param>
        /// <param name="keyList"></param>
        public static void ProtocolView(string key, List<string> keyList)
        {
            _sdk.ProtocolView(key, keyList);
        }

        /// <summary>
        /// 实名认证界面
        /// </summary>
        /// <param name="cancelAble"></param>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        /// <param name="extDelegates"></param>
        public static void RealAuthUI(RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _sdk.RealAuthUI(responseDelegate, errorDelegate);
        }

        /// <summary>
        /// 防沉迷界面
        /// </summary>
        /// <param name="titleStr"></param>
        /// <param name="contextStr"></param>
        /// <param name="buttonTxt"></param>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        /// <param name="extDelegates"></param>
        public static void LimitUI(string titleStr, string contextStr, string buttonTxt, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        { 
            _sdk.LimitUI(titleStr, contextStr, buttonTxt, responseDelegate, errorDelegate);
        }

        /// <summary>
        /// 用户中心
        /// </summary>
        /// <param name="config"></param>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        /// <param name="extDelegates"></param>
        public static void UserCenterUI(UserCenterUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _sdk.UserCenterUI(config, responseDelegate, errorDelegate);
        }

        /// <summary>
        /// 申请账号注销
        /// </summary>
        /// <param name="config"></param>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        /// <param name="extDelegates"></param>
        public static void ApplyForDeregisterUI(UserCenterUIConfig config, RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _sdk.ApplyForDeregisterUI(config, responseDelegate, errorDelegate);
        }

        /// <summary>
        /// 邮件中心
        /// </summary>
        /// <param name="userId"></param>
        public static void ShowMailCenter(string userId)
        {
            _sdk.ShowMailCenter(userId);
        }
        
        /// <summary>
        /// 显示公告UI
        /// </summary>
        /// <param name="limit"></param> 显示条数，limit > 0
        /// <param name="onLink"></param>
        /// <param name="hsAnnounceUI"></param>
        public static void ShowAnnounceView(int limit, OnLink onLink, HsAnnounceUI hsAnnounceUI)
        {
            _sdk.ShowAnnounceView(limit, onLink, hsAnnounceUI);
        }

        /// <summary>
        /// 产品包版本检查公告UI（通用）
        /// </summary>
        /// <param name="version"></param> 客户端版本号，3段或4段
        /// <param name="region"></param> 地区码
        /// <param name="queryMap"></param> type 脚本类型 默认json， 可选 lua， u3d format 输出文件后缀，默认json，可选lua
        /// <param name="isShowUI"></param> isShowUI 是否显示UI
        /// <param name="onLink"></param>
        /// <param name="hsAnnounceUI"></param>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        public static void ShowUpdateAppView(string version, string region, Dictionary<string, object> queryMap,
            bool isShowUI, OnLink onLink, HsAnnounceUI hsAnnounceUI,
            RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _sdk.ShowUpdateAppView(version, region, queryMap, isShowUI, 
                onLink, hsAnnounceUI, responseDelegate, errorDelegate);
        }

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
        public static void ShowCheckUpdateAppView(string version, string region, string type,
            Dictionary<string, object> queryMap, bool isShowUI, OnLink onLink, HsAnnounceUI hsAnnounceUI,
            RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _sdk.ShowCheckUpdateAppView(version, region, type, queryMap, isShowUI, 
                onLink, hsAnnounceUI, responseDelegate, errorDelegate);
        }

        /// <summary>
        /// 绑定/换绑手机
        /// </summary>
        /// <param name="responseDelegate"></param>
        /// <param name="errorDelegate"></param>
        public static void bindPhone(RequestResponseDelegate responseDelegate, RequestErrorDelegate errorDelegate)
        {
            _sdk.bindPhone(responseDelegate, errorDelegate);
        }
    }
}