using System;
using System.Collections.Generic;
using UnityEngine;

namespace RuiXue
{
    /// <summary>
    /// 请求响应回调
    /// </summary>
    public delegate void RequestResponseDelegate(string data);
    
    /// <summary>
    /// 请求失败回调
    /// </summary>
    public delegate void RequestErrorDelegate(string data);
    
    /// <summary>
    /// 少部分接口除统一的RequestResponseDelegate，RequestErrorDelegate 外，可能需要额外回调函数,
    /// 由于具体平台实现额外回调的格式可能不一样，为了方便不同平台能够统一接口，因此包装为一个参数。
    /// </summary>
    public class RequestExtDelegates
    {
        public IOS_DestroyAccountDeregisterTypeDelegate IOSDestroyAccountDeregisterTypeDelegate;
        public IOS_DestroyAccountDeregisterBtnTitleDelegate IOSDestroyAccountDeregisterBtnTitleDelegate;
        public IOS_AntiAdditionDelegate IOSAntiAdditionDelegate;
    }
    
    /// <summary>
    /// 旧版撤销注销回调；当前 DestroyAccountStatusView 使用 RequestResponseDelegate/RequestErrorDelegate。
    /// </summary>
    public delegate void IOS_DestroyAccountDeregisterTypeDelegate(int deregisterType);
    
    /// <summary>
    /// 旧版撤销注销回调；当前 DestroyAccountStatusView 使用 RequestResponseDelegate/RequestErrorDelegate。
    /// </summary>
    public delegate void IOS_DestroyAccountDeregisterBtnTitleDelegate(string btnTitle);
    
    /// <summary>
    /// 防沉迷回调，用于IOS端逻辑
    /// </summary>
    public delegate void IOS_AntiAdditionDelegate();
    
    /// <summary>
    /// SDK退出回调
    /// </summary>
    public delegate void LogoutDelegate(int code, string msg);

    /// <summary>
    /// 切换账号回调
    /// </summary>
    public delegate bool SwitchAccountDelegate(int code, string data);

    /// <summary>
    /// 全局通用回调
    /// </summary>
    public delegate void PublicDelegate(int type, string jsonDicData);

    /// <summary>
    /// APP退出确认回调
    /// </summary>
    public delegate void ExitConfirmDelegate(string res);

    /// <summary>
    /// APP退出取消回调
    /// </summary>
    public delegate void ExitCancelDelegate();
    
    /// <summary>
    /// 界面关闭回调
    /// </summary>
    public delegate void WebViewCloseDelegate();

    /// <summary>
    /// 隐私协议回调
    /// </summary>
    public delegate void PrivacyAgreeDelegate(bool isAgree);
    
    /// <summary>开始录屏</summary>
    public delegate void OnRuixueRecordStartCallback();

    /// <summary>
    /// 录屏错误
    /// <param name="errCode">错误码</param>
    /// <param name="errMsg">错误消息</param>
    /// </summary>
    public delegate void OnRuixueRecordErrorCallback(int errCode, string errMsg);

    /// <summary>
    /// 录屏完成
    /// <param name="videoPath">实际视频路径</param>
    /// </summary>
    public delegate void OnRuixueRecordCompleteCallback(string videoPath);

    public delegate string OnPerformanceCallback();
    
    public delegate void IOSOnPerformanceCallback(string data);
    
    /// <summary>
    ///  公告富文本点击反馈链接
    /// </summary>
    public delegate void OnLink(string link);

    /// <summary>
    /// 公告UI是否展示
    /// </summary>
    public delegate void HsAnnounceUI(bool isHas);

    /// <summary>
    /// 获取UWA数据并将数据通过通知传递回OC方法
    /// </summary>
    public delegate void IOSGetUwaInfoPostNotiToOC();
}