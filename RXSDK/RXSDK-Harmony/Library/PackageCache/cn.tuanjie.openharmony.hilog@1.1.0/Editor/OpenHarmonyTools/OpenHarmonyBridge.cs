using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using UnityEngine;
using UnityEditor;
using Object = System.Object;

namespace Tuanjie.OpenHarmony.Hilog
{
    /// <summary>
    /// Provides dynamic way of accessing UnityEditor.OpenHarmony.Extensions.dll.
    /// It solves the problem where if you have OpenHarmony-Hilog package installed, but there's no OpenHarmony Support installed, you won't get compiler errors
    /// It also enables to use Hilog package when active platform is not OpenHarmony
    /// </summary>
    class OpenHarmonyBridge
    {
        enum ExtensionState
        {
            Undefined,
            Unavalaible,
            Available
        }

        private static ExtensionState s_OpenHarmonyExtensionsState = ExtensionState.Undefined;
        private static Assembly s_OpenHarmonyExtensions;
        private static readonly string kOpenHarmonyHilogWarningIssued = nameof(kOpenHarmonyHilogWarningIssued);

        private static Assembly OpenHarmonyExtensions
        {
            get
            {
                // Fast exit, since reflection is very slow
                if (s_OpenHarmonyExtensionsState == ExtensionState.Unavalaible)
                    return null;

                if (s_OpenHarmonyExtensions != null)
                    return s_OpenHarmonyExtensions;
                var assemblyName = "UnityEditor.OpenHarmony.Extensions";
                s_OpenHarmonyExtensions = AppDomain.CurrentDomain.GetAssemblies()
                    .FirstOrDefault(a => a.FullName.Contains(assemblyName));
                s_OpenHarmonyExtensionsState = s_OpenHarmonyExtensions == null ? ExtensionState.Unavalaible : ExtensionState.Available;

                // Warn user once why hilog is disabled
                if (SessionState.GetBool(kOpenHarmonyHilogWarningIssued, false) == false &&
                    s_OpenHarmonyExtensionsState == ExtensionState.Unavalaible)
                {
                    SessionState.SetBool(kOpenHarmonyHilogWarningIssued, true);
                    Debug.LogWarning($"{assemblyName} assembly not found, OpenHarmony hilog will be disabled.");
                }

                return s_OpenHarmonyExtensions;
            }
        }

        internal static bool OpenHarmonyExtensionsInstalled => OpenHarmonyExtensions != null;

        // Reflection of UnityEditor.OpenHarmony.HDC
        // Include specified hdc path and hdc version.
        internal class HDC
        {
            private static Type s_HDCType;
            private static MethodInfo s_GetInstanceMethodInfo;
            private static MethodInfo s_GetHDCPathMethodInfo;
            private static MethodInfo s_RunMethodInfo;
            private static MethodInfo s_RunMethodWithContinuousOutputInfo;
            private static HDCVersion s_HDCVersion;

            private System.Object m_HDCObject;

            private string m_LastSDKPath = OpenHarmonySDKRoot.sdkRootPath;

            public class HDCVersion
            {
                internal Version m_HDCVersion;
                internal string m_Suffix;
                internal int m_APILevel;

                public HDCVersion(Version HDCVersion, string Suffix, int Level)
                {
                    this.m_HDCVersion = HDCVersion;
                    this.m_Suffix = Suffix;
                    this.m_APILevel = Level;
                }
            }

            private static Type UnderlyingType
            {
                get
                {
                    if (s_HDCType != null)
                        return s_HDCType;
                    if (OpenHarmonyExtensions == null)
                        return null;
                    s_HDCType = OpenHarmonyExtensions.GetType("UnityEditor.OpenHarmony.HDC");
                    if (s_HDCType == null)
                        throw new Exception("Failed to locate HDC type");
                    return s_HDCType;
                }
            }

            internal System.Object UnderlyingObject => m_HDCObject;

            private static MethodInfo GetInstanceMethodInfo
            {
                get
                {
                    if (s_GetInstanceMethodInfo != null)
                        return s_GetInstanceMethodInfo;
                    s_GetInstanceMethodInfo = UnderlyingType.GetMethod("GetInstance", BindingFlags.Public | BindingFlags.Static);
                    return s_GetInstanceMethodInfo;
                }
            }

            private static MethodInfo GetHDCPathMethodInfo
            {
                get
                {
                    if (s_GetHDCPathMethodInfo != null)
                        return s_GetHDCPathMethodInfo;
                    s_GetHDCPathMethodInfo = UnderlyingType.GetMethod("GetHDCPath", BindingFlags.Public | BindingFlags.Instance);
                    return s_GetHDCPathMethodInfo;
                }
            }

            private static MethodInfo RunInternalMethodInfo
            {
                get
                {
                    if (s_RunMethodInfo != null)
                        return s_RunMethodInfo;
                    s_RunMethodInfo = UnderlyingType.GetMethod("Run", BindingFlags.NonPublic | BindingFlags.Instance);
                    return s_RunMethodInfo;
                }
            }

            private static MethodInfo RunInternalMethodWithContinuousOutputInfo
            {
                get
                {
                    if (s_RunMethodWithContinuousOutputInfo != null)
                    {
                        return s_RunMethodWithContinuousOutputInfo;
                    }
                    s_RunMethodWithContinuousOutputInfo = UnderlyingType.GetMethod("RunWithContinousOutput", BindingFlags.NonPublic | BindingFlags.Instance);
                    return s_RunMethodWithContinuousOutputInfo;
                }
            }

            private HDC(System.Object HDCObject)
            {
                if (HDCObject == null)
                    throw new ArgumentNullException("HDC instance cannot be null. Is OpenHarmony SDK set?");
                m_HDCObject = HDCObject;
            }

            public string GetHDCPath()
            {
                return (string)GetHDCPathMethodInfo.Invoke(m_HDCObject, null);
            }

            public string Run(string[] command, string errorMsg)
            {
                OpenHarmonyHilogInternalLog.Log("{0} {1}", GetHDCPath(), string.Join(" ", command));
                var output =  (string)RunInternalMethodInfo.Invoke(m_HDCObject, new Object[] { command, null, errorMsg });
                OpenHarmonyHilogInternalLog.Log(output);
                return output;
            }

            public void RunWithContinuousOutput(string[] command, string errorMsg, System.Diagnostics.DataReceivedEventHandler onNewOutput)
            {
                OpenHarmonyHilogInternalLog.Log("{0} {1}", GetHDCPath(), string.Join(" ", command));
                RunInternalMethodWithContinuousOutputInfo.Invoke(m_HDCObject, new Object[] { command, null, errorMsg, onNewOutput });
            }

            public static HDC GetInstance()
            {
                s_HDCVersion = null;
                var hdc = new HDC(GetInstanceMethodInfo.Invoke(null, null));
                hdc.GetHDCVersion();
                return hdc;
            }

            //Get API level based on the SDK path or hdc version
            public int GetHDCVersion()
            {
                CheckSDKChange();

                var path = Path.GetFileName(m_LastSDKPath ?? String.Empty);
                if (int.TryParse(path, out var levlel))
                    return levlel;

                if (s_HDCVersion == null)
                {
                    var hdcVersion = Run(new[] { "-v" }, $"Failed to get HDC version.");
                    OpenHarmonyHilogInternalLog.Log("hdc version: {0}", hdcVersion);
                    Regex regex = new Regex(@"Ver:\s*(?<version>[0-9.]+)(?<suffix>[a-z]*)");
                    Match match = regex.Match(hdcVersion);
                    if (match.Success)
                    {
                        Version version = new Version(match.Groups["version"].Value);
                        string suffix = match.Groups["suffix"].Value;
                        s_HDCVersion = new HDCVersion(version, suffix, OpenHarmonySDKRoot.GetAPILevel());
                    }
                }

                return s_HDCVersion?.m_APILevel ?? -1;
            }

            // Check if SDK path (in Preferences/External Tools) changes
            // If so, update hdc path and version.
            private void CheckSDKChange()
            {
                var currentSDKPath = OpenHarmonySDKRoot.sdkRootPath;
                if (!string.Equals(currentSDKPath, m_LastSDKPath))
                {
                    m_HDCObject = GetInstanceMethodInfo.Invoke(null, null);
                    s_HDCVersion = null;
                    m_LastSDKPath = currentSDKPath;
                }
            }
        }

        // Reflection of UnityEditor.OpenHarmony.OpenHarmonySDKRoot
        // Include SDK path (in Preferences/External Tools).
        internal class OpenHarmonySDKRoot
        {
            private static Type s_OpenHarmonySDKRootType;
            private static Type s_OpenHarmonyRootType;
            private static MethodInfo s_GetInstanceMethodInfo;
            private static MethodInfo s_GetRootDirectoryMethodInfo;
            private static object s_SdkRootPathProperty;

            private static Type UnderlyingType
            {
                get
                {
                    if (s_OpenHarmonySDKRootType != null)
                        return s_OpenHarmonySDKRootType;
                    if (OpenHarmonyExtensions == null)
                        return null;
                    s_OpenHarmonySDKRootType = OpenHarmonyExtensions.GetType("UnityEditor.OpenHarmony.OpenHarmonySDKRoot");
                    if (s_OpenHarmonySDKRootType == null)
                        throw new Exception("Failed to locate HDC OpenHarmonySDKRoot");

                    return s_OpenHarmonySDKRootType;
                }
            }

            private static Type OpenHarmonyRootType
            {
                get
                {
                    if (s_OpenHarmonyRootType != null)
                        return s_OpenHarmonyRootType;
                    if (OpenHarmonyExtensions == null)
                        return null;
                    s_OpenHarmonyRootType = OpenHarmonyExtensions.GetType("UnityEditor.OpenHarmony.OpenHarmonyRoot");
                    if (s_OpenHarmonyRootType == null)
                        throw new Exception("Failed to locate HDC OpenHarmonyRoot");

                    return s_OpenHarmonyRootType;
                }
            }

            private static MethodInfo GetInstanceMethodInfo
            {
                get
                {
                    if (s_GetInstanceMethodInfo != null)
                        return s_GetInstanceMethodInfo;
                    s_GetInstanceMethodInfo = UnderlyingType.GetMethod("GetInstance", BindingFlags.Public | BindingFlags.Static);
                    return s_GetInstanceMethodInfo;
                }
            }

            private static MethodInfo GetRootDirectoryMethodInfo
            {
                get
                {
                    if (s_GetRootDirectoryMethodInfo != null)
                        return s_GetRootDirectoryMethodInfo;
                    s_GetRootDirectoryMethodInfo = OpenHarmonyRootType.GetMethod("GetRootDirectory", BindingFlags.NonPublic | BindingFlags.Instance);
                    return s_GetRootDirectoryMethodInfo;
                }
            }

            private static object SdkRootPathProperty
            {
                get
                {
                    if (GetInstanceMethodInfo == null || GetRootDirectoryMethodInfo == null) 
                        return null;

                    object OpenHarmonyRootmInfo = GetInstanceMethodInfo.Invoke(null, new object[] { });
                    if (OpenHarmonyRootmInfo == null) 
                        return null;

                    s_SdkRootPathProperty = GetRootDirectoryMethodInfo.Invoke(OpenHarmonyRootmInfo, new object[] { });

                    return s_SdkRootPathProperty;
                }
            }

            public static string sdkRootPath
            {
                get => (string)SdkRootPathProperty;
            }

            private class SDKJsonInfo 
            {
                public int apiVersion;
            }

            public static int GetAPILevel()
            {
                var filePath = Paths.Combine(sdkRootPath, "native/oh-uni-package.json");
                var json = File.ReadAllText(filePath);
                var jsonObj = JsonUtility.FromJson<SDKJsonInfo>(json);
                return jsonObj.apiVersion;
            }
        }
    }
}
