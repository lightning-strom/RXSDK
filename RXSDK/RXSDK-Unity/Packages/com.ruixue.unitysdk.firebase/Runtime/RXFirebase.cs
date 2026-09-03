using System;
using System.Collections.Generic;
using RuiXue.Firebase.Impl;

namespace RuiXue.Firebase
{
    public static class RXFirebase
    {
#if UNITY_ANDROID
        private static readonly IRXFirebase _sdk = new RXFirebaseAndroid();
#elif UNITY_IOS
        private static readonly IRXFirebase _sdk = new RXFirebaseIOS();
#else
        private static readonly IRXFirebase _sdk = new RXFirebaseNotSupport();
#endif

        /// <summary>
        ///     初始化fireBase
        /// </summary>
        public static void InitFirebaseAnalytics()
        {
            LogUtil.Log("EventManager", "_sdk.InitFirebaseAnalytics()");
            _sdk.InitFirebaseAnalytics();
        }

        /// <summary>
        ///     记录事件
        /// </summary>
        /// <param name="name"></param>
        /// <param name="param"></param>
        public static void LogEvent(string name, Dictionary<string, object> param)
        {
            _sdk.LogEvent(name, param);
        }

        /// <summary>
        ///     设置默认事件参数
        /// </summary>
        /// <param name="param"></param>
        public static void SetDefaultEventParameters(Dictionary<string, object> param)
        {
            _sdk.SetDefaultEventParameters(param);
        }

        /// <summary>
        ///     设置用户属性
        /// </summary>
        /// <param name="name"></param>
        /// <param name="value"></param>
        public static void SetUserProperty(string name, string value)
        {
            _sdk.SetUserProperty(name, value);
        }

        /// <summary>
        ///     设置用户ID
        /// </summary>
        /// <param name="id"></param>
        public static void SetAnalyticsUserId(string id)
        {
            _sdk.SetAnalyticsUserId(id);
        }

        /// <summary>
        ///     是否开启数据收集
        /// </summary>
        /// <param name="enabled"></param>
        public static void SetAnalyticsCollectionEnabled(bool enabled)
        {
            _sdk.SetAnalyticsCollectionEnabled(enabled);
        }

        /// <summary>
        /// 添加自定义键
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public static void SetCustomKey(string key, string value)
        {
                _sdk.SetCustomKey(key, value);    
        }

        /// <summary>
        /// 添加自定义键
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public static void SetCustomKey(string key, bool value)
        {
                _sdk.SetCustomKey(key, value);    
        }

        /// <summary>
        /// 添加自定义键
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public static void SetCustomKey(string key, float value)
        {
                _sdk.SetCustomKey(key, value);    
        }


        /// <summary>
        /// 添加自定义键
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public static void SetCustomKey(string key, int value)
        {
                _sdk.SetCustomKey(key, value);    
        }

        /// <summary>
        /// 添加自定义键
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public static void SetCustomKey(string key, long value)
        {
                _sdk.SetCustomKey(key, value);      
        }

        /// <summary>
        /// 批量添加键值对
        /// </summary>
        /// <param name="keysAndValues"></param>
        public static void SetCustomKeys(Dictionary<string, object> keysAndValues)
        {
                _sdk.SetCustomKeys(keysAndValues);    
        }

        /// <summary>
        /// 添加自定义消息
        /// </summary>
        /// <param name="message"></param>
        public static void Log(string message)
        {
                _sdk.Log(message);   
        }

        /// <summary>
        /// 设置用户标识
        /// </summary>
        /// <param name="identifier"></param>
        public static void SetCrashUserId(string identifier)
        {
                _sdk.SetCrashUserId(identifier);
        }

        /// <summary>
        /// 报告非常严重的错误
        /// </summary>
        /// <param name="throwable"></param>
        public static void RecordException(Exception throwable)
        {
                _sdk.RecordException(throwable); 
        }

        /// <summary>
        /// 是否开启崩溃自动收集
        /// </summary>
        /// <param name="enabled"></param>
        public static void SetCrashlyticsCollectionEnabled(bool enabled)
        {
                _sdk.SetCrashlyticsCollectionEnabled(enabled);
        }

        /// <summary>
        /// 设置通知点击回调
        /// </summary>
        /// <param name="messageReceived"></param>
        /// <param name="newToken"></param>
        public static void SetFCMCallBack(IRXFirebase.MessageReceivedDelegate messageReceived,
                IRXFirebase.NewTokenDelegate newToken)
        {
                _sdk.SetFCMCallBack(messageReceived, newToken); 
        }

        /// <summary>
        /// 清除通知点击回调
        /// </summary>
        public static void ClearFCMCallBack()
        {
                _sdk.ClearFCMCallBack();  
        }

    }
}