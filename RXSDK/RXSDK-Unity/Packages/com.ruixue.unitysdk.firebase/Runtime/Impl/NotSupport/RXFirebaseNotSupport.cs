using System;
using System.Collections.Generic;

namespace RuiXue.Firebase.Impl
{
    public class RXFirebaseNotSupport:IRXFirebase
    {
        public void InitFirebaseAnalytics()
        {
            LogUtil.WarningNotSupport("InitFirebaseAnalytics");
        }

        public void LogEvent(string name, Dictionary<string, object> param)
        {
            LogUtil.WarningNotSupport("LogEvent");
        }

        public void SetDefaultEventParameters(Dictionary<string, object> param)
        {
            LogUtil.WarningNotSupport("SetDefaultEventParameters");
        }

        public void SetUserProperty(string name, string value)
        {
            LogUtil.WarningNotSupport("SetUserProperty");
        }

        public void SetAnalyticsUserId(string id)
        {
            LogUtil.WarningNotSupport("SetAnalyticsUserId");
        }

        public void SetAnalyticsCollectionEnabled(bool enabled)
        {
            LogUtil.WarningNotSupport("SetAnalyticsCollectionEnabled");
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
    }
}