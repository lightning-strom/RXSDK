using System.Runtime.InteropServices;
using UnityEngine;

namespace RuiXue
{
    public class LogUtil
    {
        public static bool LogEnabled
        {
            get => _isLogEnabled;
            set
            {
                _isLogEnabled = value;
#if UNITY_WEBGL
                rx_jsLogEnable(_isLogEnabled);                
#endif
            }
        }
        
        private static bool _isLogEnabled = false;

        public static void Log(string tag, string logStr)
        {
            if (!LogEnabled)
                return;
            
#if UNITY_EDITOR
            Debug.Log(tag + ": " + logStr);
#elif UNITY_ANDROID
            AndroidJavaClass LogObj = new AndroidJavaClass("android.util.Log");
            LogObj.CallStatic<int>("d", tag, logStr);
#elif UNITY_WEBGL
            rx_jsLog(tag, logStr);
#else
            Debug.Log(tag + ": " + logStr);
#endif
        }
        
        #if UNITY_WEBGL
        [DllImport("__Internal")]
        private static extern void rx_jsLog(string tag, string logStr);
        
        [DllImport("__Internal")]
        private static extern void rx_jsLogEnable(bool enable);
        #endif


        public static void WarningNotSupport(string funcName)
        {
            Debug.LogWarning($"RuiXueSDK:  [{Application.platform}]  暂不支持  [{funcName}] 方法");
        }
    }
}

