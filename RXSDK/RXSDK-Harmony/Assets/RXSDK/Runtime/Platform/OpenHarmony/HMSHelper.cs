using System;
using System.Collections.Generic;
using UnityEngine;

namespace RXSDK
{
    /// <summary>HMS/鸿蒙 OpenHarmony 桥接 API，按职责拆分为多个 partial 文件。</summary>
    public static partial class HMSAPI
    {
        private static OpenHarmonyJSCallback _hmsManagerCallback;
        public static Dictionary<string, Action<string>> actionDic = new();

        internal static readonly string LOGIN_TYPE = "Login";
        internal static readonly string UNION_LOGIN = "UnionLogin";

        private static OpenHarmonyJSObject m_HMSManagerObj;
        private static OpenHarmonyJSObject m_HMSLoginManagerObj;
        private static OpenHarmonyJSObject m_HMSGameServiceManagerObj;
        private static OpenHarmonyJSObject m_HMSGetDataManagerObj;
        private static OpenHarmonyJSObject m_HMSPushManagerObj;
        private static OpenHarmonyJSObject m_RXAPIManagerObj;

        public static void SetCallback(string type, Action<string> callback)
        {
            Log.D($"SetCallback {type}");
            actionDic.Remove(type);
            actionDic.Add(type, callback);
        }

        public static OpenHarmonyJSCallback GetJSCallback()
        {
            _hmsManagerCallback ??= new OpenHarmonyJSCallback(HMSManagerCallback);
            return _hmsManagerCallback;
        }

        public static OpenHarmonyJSObject GetHMSPushManager()
        {
            m_HMSPushManagerObj ??= CreateHMSPushManager();
            return m_HMSPushManagerObj;
        }

        public static OpenHarmonyJSObject GetRXAPIManager()
        {
            m_RXAPIManagerObj ??= CreateRXAPIManager();
            return m_RXAPIManagerObj;
        }

        public static OpenHarmonyJSObject GetHMSIAPManager()
        {
            m_HMSManagerObj ??= CreateHMSIAPManager();
            return m_HMSManagerObj;
        }

        public static OpenHarmonyJSObject GetHMSLoginManager()
        {
            m_HMSLoginManagerObj ??= CreateHMSLoginManager();
            return m_HMSLoginManagerObj;
        }

        public static OpenHarmonyJSObject GetHMSGameServiceManager()
        {
            m_HMSGameServiceManagerObj ??= CreateHMSGameServiceManager();
            return m_HMSGameServiceManagerObj;
        }

        public static OpenHarmonyJSObject GetHMSGetDataManager()
        {
            m_HMSGetDataManagerObj ??= CreateHMSGetDataManager();
            return m_HMSGetDataManagerObj;
        }

        public static OpenHarmonyJSObject CreateHMSPushManager()
        {
            var c = new OpenHarmonyJSClass("HMSPushManager");
            return c.CallStatic<OpenHarmonyJSObject>("getInstance");
        }

        public static OpenHarmonyJSObject CreateRXAPIManager()
        {
            var c = new OpenHarmonyJSClass("RXAPIManager");
            return c.CallStatic<OpenHarmonyJSObject>("getInstance");
        }

        public static OpenHarmonyJSObject CreateHMSIAPManager()
        {
            var c = new OpenHarmonyJSClass("HMSIAPManager");
            return c.CallStatic<OpenHarmonyJSObject>("getInstance");
        }

        public static OpenHarmonyJSObject CreateHMSLoginManager()
        {
            var c = new OpenHarmonyJSClass("HMSLoginManager");
            return c.CallStatic<OpenHarmonyJSObject>("getInstance");
        }

        public static OpenHarmonyJSObject CreateHMSGameServiceManager()
        {
            var c = new OpenHarmonyJSClass("HMSGameServiceManager");
            return c.CallStatic<OpenHarmonyJSObject>("getInstance");
        }

        public static OpenHarmonyJSObject CreateHMSGetDataManager()
        {
            var c = new OpenHarmonyJSClass("HMSGetDataManager");
            return c.CallStatic<OpenHarmonyJSObject>("getInstance");
        }

        internal static object HMSManagerCallback(params OpenHarmonyJSObject[] args)
        {
            if (args.Length >= 3)
            {
                string type = args[0].As<string>();
                string data = args[2].As<string>();
                Log.D("invoke " + type + ": params: " + data);
                if (actionDic.TryGetValue(type, out var cb))
                    cb?.Invoke(data);
                else
                    Log.D("native callback no exists " + type);
            }
            else
                Log.D("HMSManagerCallback args error length " + args.Length);
            return null;
        }
    }
}