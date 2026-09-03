using System;
using UnityEngine;

namespace RXSDK
{

    public class Log
    {
        public static bool IsLogEnabled => SDKConfig.Instance.IsDebugEnable;

        static Log()
        {
            SetStackTraceLogType();
        }
        public static void SetStackTraceLogType(LogType logType = LogType.Log, StackTraceLogType stackTraceType = StackTraceLogType.ScriptOnly)
        {
            Application.SetStackTraceLogType(logType, stackTraceType);
        }


        /// <summary>
        ///  Debug LogFormat
        /// </summary>
        /// <param name="format">format</param>
        /// <param name="args"></param>args<summary>
        public static void F(string format, params object[] args)
        {
            if (!IsLogEnabled) return;
            Debug.LogFormat(format, args);
        }

        public static void E(object msg)
        {
            if (!IsLogEnabled) return;
            Debug.LogError(msg);
        }

        public static void W(object msg)
        {
            Debug.LogWarning(msg);
        }

        public static void Exception(Exception exception)
        {
            if (!IsLogEnabled) return;
            Debug.LogException(exception);
        }
        public static void D(object msg)
        {
            if (!IsLogEnabled) return;
            Debug.Log(msg);
        }

        // 带标签的日志
        public static void D(string tag, object msg)
        {
            if (!IsLogEnabled) return;
            Debug.Log($"[{tag}] {msg}");
        }

        // 带堆栈跟踪的错误日志
        public static void EWithStack(object msg)
        {
            if (!IsLogEnabled) return;
            Debug.LogError($"{msg}\nStackTrace: {Environment.StackTrace}");
        }

        // 条件日志
        public static void Assert(bool condition, object msg)
        {
            if (!IsLogEnabled) return;
            Debug.Assert(condition, msg);
        }
    }
}