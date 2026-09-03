using System;
using System.Globalization;
using System.IO;
using UnityEngine;

namespace RXSDK
{

    public class DeviceUtility
    {
        private static string distinctId;
        private static string deviceCode;
        public static string GetDeviceCode()
        {
            deviceCode ??= PlayerPrefs.GetString(Constants.RX_DEVICE_CODE, SystemInfo.deviceUniqueIdentifier.Replace("-", ""));
            if (deviceCode == null || deviceCode == "")
            {
                deviceCode = GetNewUUID().Replace("-", "");
                PlayerPrefs.SetString(Constants.RX_DEVICE_CODE, deviceCode);
            }
            return deviceCode;
        }

        public static string TuanjieVersion
        {
            get
            {
#if UNITY_OPENHARMONY
                return Application.tuanjieVersion; 
#else
                return "0";
#endif

            }
        }


        public static void CleanCache()
        {
            PlayerPrefs.DeleteAll();
            string persistentDataPath = Application.persistentDataPath;
            if (Directory.Exists(persistentDataPath))
            {
                try
                {

                    // 删除持久化数据路径下的所有文件
                    string[] files = Directory.GetFiles(persistentDataPath);
                    foreach (string file in files)
                    {
                        File.Delete(file);
                    }

                    // 删除持久化数据路径下的所有文件夹
                    string[] directories = Directory.GetDirectories(persistentDataPath);
                    foreach (string directory in directories)
                    {
                        Directory.Delete(directory, true);
                    }

                    Debug.Log("沙盒缓存清理成功！");
                }
                catch (System.Exception e)
                {
                    Debug.LogError($"清理沙盒缓存时出错: {e.Message}");
                }
            }
            else
            {
                Debug.Log("持久化数据路径不存在。");
            }
        }

        public static string GetNewUUID()
        {
            return Guid.NewGuid().ToString();
        }

        public static string GetLanguage()
        {
            return CultureInfo.CurrentCulture.ToString();
        }

        public static string GetCountry()
        {
#if STEAMWORKS_SUPPORT &&!UNITY_OPENHARMONY
            return SteamManager.Instance.GetCountry();
#else
            return RegionInfo.CurrentRegion.ToString();
#endif


        }

        public static bool IsAndroid()
        {
            return Application.platform == RuntimePlatform.Android;
        }
        public static bool IsHarmony()
        {
#if UNITY_OPENHARMONY
            return Application.platform == RuntimePlatform.OpenHarmony;
#else
            return false;
#endif

        }

        public static bool IsSteam()
        {
#if !DISABLESTEAMWORKS
            return Application.platform == RuntimePlatform.OSXPlayer || Application.platform == RuntimePlatform.WindowsPlayer || Application.platform == RuntimePlatform.OSXEditor;
#else
            return false;
#endif

        }

        public static bool IsWXMini()
        {
#if UNITY_OPENHARMONY
            return Application.platform == RuntimePlatform.WeixinMiniGamePlayer;
#else
            return false;
#endif

        }
        public static bool IsIOS()
        {
            return Application.platform == RuntimePlatform.IPhonePlayer;
        }
        public static RuntimePlatform GetPlatform()
        {
            return Application.platform;
        }

        public static string GetClipboard()
        {
            return GUIUtility.systemCopyBuffer;
        }


        public static string NewDistinctId()
        {
            distinctId = GetNewUUID();
            PlayerPrefs.SetString(Constants.DISTINCT_ID_KEY, distinctId);
            return distinctId;
        }
        public static string GetDistinctId()
        {
            distinctId ??= PlayerPrefs.GetString(Constants.DISTINCT_ID_KEY, distinctId);
            return distinctId;
        }
        public static void RemoveDistinctId()
        {
            distinctId = null;
            PlayerPrefs.DeleteKey(Constants.DISTINCT_ID_KEY);
        }
        public static int GetPlatformID()
        {
            return Application.platform switch
            {
                RuntimePlatform.Android => 1,
                RuntimePlatform.IPhonePlayer => 2,
#if UNITY_OPENHARMONY
                RuntimePlatform.OpenHarmony => 6,
#endif
                _ => 6,
            };
        }

    }

}