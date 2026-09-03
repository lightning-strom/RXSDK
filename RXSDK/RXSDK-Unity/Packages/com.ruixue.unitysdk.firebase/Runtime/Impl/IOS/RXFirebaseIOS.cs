#if UNITY_IOS
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace RuiXue.Firebase.Impl
{
    public class RXFirebaseIOS:IRXFirebase
    {
        public void InitFirebaseAnalytics()
        {
            ios_firebase_configure();
        }

        public void LogEvent(string name, Dictionary<string, object> param)
        {
            string json = RXJsonUtil.ToJson(param);
            ios_firebase_logEvent(name,json);
        }

        public void SetDefaultEventParameters(Dictionary<string, object> param)
        {
            string json = RXJsonUtil.ToJson(param);
            ios_firebase_setDefaultEventParameters(json);
        }

        public void SetUserProperty(string name, string value)
        {
            ios_firebase_setUserProperty(name, value);
        }

        public void SetAnalyticsUserId(string id)
        {
            ios_firebase_setUserID(id);
        }

        public void SetAnalyticsCollectionEnabled(bool enabled)
        {
            ios_firebase_setAnalyticsCollectionEnabled(enabled);
        }

        public void SetCustomKey(string key, string value)
        {
            LogUtil.WarningNotSupport("SetCustomKey");
        }

        public void SetCustomKey(string key, bool value)
        {
            LogUtil.WarningNotSupport("SetCustomKey");
        }

        public void SetCustomKey(string key, float value)
        {
            LogUtil.WarningNotSupport("SetCustomKey");
        }

        public void SetCustomKey(string key, int value)
        {
            LogUtil.WarningNotSupport("SetCustomKey");
        }

        public void SetCustomKey(string key, long value)
        {
            LogUtil.WarningNotSupport("SetCustomKey");
        }

        public void SetCustomKeys(Dictionary<string, object> keysAndValues)
        {
            LogUtil.WarningNotSupport("SetCustomKeys");
        }

        public void Log(string message)
        {
            LogUtil.WarningNotSupport("Log");
        }

        public void SetCrashUserId(string identifier)
        {
            LogUtil.WarningNotSupport("SetCrashUserId");
        }

        public void RecordException(Exception throwable)
        {
            LogUtil.WarningNotSupport("RecordException");
        }

        public void SetCrashlyticsCollectionEnabled(bool enabled)
        {
            LogUtil.WarningNotSupport("SetCrashlyticsCollectionEnabled");
        }

        public void SetFCMCallBack(IRXFirebase.MessageReceivedDelegate messageReceived, IRXFirebase.NewTokenDelegate newToken)
        {
            LogUtil.WarningNotSupport("SetFCMCallBack");
        }

        public void ClearFCMCallBack()
        {
            LogUtil.WarningNotSupport("ClearFCMCallBack");
        }
        
        
        // 初始化
        [DllImport("__Internal")]
        public static extern void ios_firebase_configure();

// 发送事件
        [DllImport("__Internal")]
        public static extern void ios_firebase_logEvent(string name, string parameters);

// 设置默认事件参数
        [DllImport("__Internal")]
        public static extern void ios_firebase_setDefaultEventParameters(string parameters);

// 设置用户属性
        [DllImport("__Internal")]
        public static extern void ios_firebase_setUserProperty(string name, string value);

// 设置用户id
        [DllImport("__Internal")]
        public static extern void ios_firebase_setUserID(string userID);

// 是否启用数据收集
        [DllImport("__Internal")]
        public static extern void ios_firebase_setAnalyticsCollectionEnabled(bool enable);
    }
}
#endif