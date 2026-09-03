using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace RuiXue
{
    public partial class RuiXueSdkDriver : MonoBehaviour
    {
        private static RuiXueSdkDriver _instance;

        public static RuiXueSdkDriver Instance
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new GameObject("RuiXueSdk").AddComponent<RuiXueSdkDriver>();
                    DontDestroyOnLoad(_instance);
                }

                return _instance;
            }
        }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSplashScreen)]
        private static void FirstInit()
        {
            var ins = RuiXueSdkDriver.Instance;
            LogUtil.Log("EventManager", "FirstInit");
        }
        
        public static string CacheInitParamCpid { get; set; }
        public static string CacheInitParamProductid{ get; set; }
        public static string CacheInitParamChannelid { get; set; }
        public static List<string> CacheInitParamBaseUrlList { get; set; }

        private void OnApplicationPause(bool pauseStatus)
        {
            if (pauseStatus)
            {
                LogUtil.Log("EventManager", $" OnApplicationPause {true}");
            }
            else
            {
                LogUtil.Log("EventManager", $" OnApplicationPause {false}");
            }
        }

        private void OnApplicationFocus(bool hasFocus)
        {
            if (hasFocus)
            {
                LogUtil.Log("EventManager", $" OnApplicationFocus {true}");
            }
            else
            {
                LogUtil.Log("EventManager", $" OnApplicationFocus {false}");
            }
        }
    }
}
