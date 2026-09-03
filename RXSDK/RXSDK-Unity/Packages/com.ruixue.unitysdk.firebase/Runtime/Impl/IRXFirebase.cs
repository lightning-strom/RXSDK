using System;
using System.Collections.Generic;

namespace RuiXue.Firebase.Impl
{
    public interface  IRXFirebase
    {
        public delegate void MessageReceivedDelegate(RemoteMessage message);
        public delegate void NewTokenDelegate(string token);
        
        /// <summary>
        /// 初始化fireBase
        /// </summary>
        public void InitFirebaseAnalytics();
        
        /// <summary>
        /// 记录事件
        /// </summary>
        /// <param name="name"></param>
        /// <param name="param"></param>
        public void LogEvent(string name, Dictionary<string, object> param);

        /// <summary>
        /// 设置默认事件参数
        /// </summary>
        /// <param name="param"></param>
        public void SetDefaultEventParameters(Dictionary<string, object> param);

        /// <summary>
        /// 设置用户属性
        /// </summary>
        /// <param name="name"></param>
        /// <param name="value"></param>
        public void SetUserProperty(string name, string value);

        /// <summary>
        /// 设置用户ID
        /// </summary>
        /// <param name="id"></param>
        public void SetAnalyticsUserId(string id);

        /// <summary>
        /// 是否开启数据收集
        /// </summary>
        /// <param name="enabled"></param>
        public void SetAnalyticsCollectionEnabled(bool enabled);
        
        /// <summary>
        /// 添加自定义键
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public void SetCustomKey(string key, string value);

        /// <summary>
        /// 添加自定义键
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public void SetCustomKey(string key, bool value);

        /// <summary>
        /// 添加自定义键
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public void SetCustomKey(string key, float value);

        /// <summary>
        /// 添加自定义键
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public void SetCustomKey(string key, int value);

        /// <summary>
        /// 添加自定义键
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public void SetCustomKey(string key, long value);

        /// <summary>
        /// 批量添加键值对
        /// </summary>
        /// <param name="keysAndValues"></param>
        public void SetCustomKeys(Dictionary<string, object> keysAndValues);

        /// <summary>
        /// 添加自定义消息
        /// </summary>
        /// <param name="message"></param>
        public void Log(string message);

        /// <summary>
        /// 设置用户标识
        /// </summary>
        /// <param name="identifier"></param>
        public void SetCrashUserId(string identifier);

        /// <summary>
        /// 报告非常严重的错误
        /// </summary>
        /// <param name="throwable"></param>
        public void RecordException(Exception throwable);
        
        /// <summary>
        /// 是否开启崩溃自动收集
        /// </summary>
        /// <param name="enabled"></param>
        public void SetCrashlyticsCollectionEnabled(bool enabled);

        /// <summary>
        /// 设置通知点击回调
        /// </summary>
        /// <param name="messageReceived"></param>
        /// <param name="newToken"></param>
        public void SetFCMCallBack(MessageReceivedDelegate messageReceived, NewTokenDelegate newToken);

        /// <summary>
        /// 清除通知点击回调
        /// </summary>
        public void ClearFCMCallBack();


    }
}
