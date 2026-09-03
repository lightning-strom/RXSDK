#if UNITY_5_3_OR_NEWER
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEditor.Build;
using UnityEngine;

namespace UWAGPMEditor
{
#if UNITY_2018_1_OR_NEWER || TUANJIE_2022_3_OR_NEWER
    internal class EditorLauncher : IPreprocessBuildWithReport
    {
        public int callbackOrder { get { return 0; } }
        public void OnPreprocessBuild(UnityEditor.Build.Reporting.BuildReport report)
        {
            BuildPrepareTool.Prepare();
        }
    }
#else
    internal class EditorLauncher : IPreprocessBuild
    {
        public int callbackOrder { get { return 0; } }
        public void OnPreprocessBuild(BuildTarget target, string path)
        {
            BuildPrepareTool.Prepare();
        }
    }
#endif

    class BuildPrepareTool
    {
        private const string SDKRoot = "UWA_GPM";
        public static void Prepare()
        {
            // Android
            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/Android/libs/arm64-v8a/libuwa_gpm.so", BuildTarget.Android);
            SetPlatformData(UwaUnityPath + "/Runtime/Plugins/Android/libs/arm64-v8a/libuwa_gpm.so", BuildTarget.Android, "CPU", "ARM64");

            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/Android/libs/armeabi-v7a/libuwa_gpm.so", BuildTarget.Android);
            SetPlatformData(UwaUnityPath + "/Runtime/Plugins/Android/libs/armeabi-v7a/libuwa_gpm.so", BuildTarget.Android, "CPU", "ARMv7");

            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/Android/libs/x86/libuwa_gpm.so", BuildTarget.Android);
            SetPlatformData(UwaUnityPath + "/Runtime/Plugins/Android/libs/x86/libuwa_gpm.so", BuildTarget.Android, "CPU", "x86");

            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/Android/libs/x86_64/libuwa_gpm.so", BuildTarget.Android);
            SetPlatformData(UwaUnityPath + "/Runtime/Plugins/Android/libs/x86_64/libuwa_gpm.so", BuildTarget.Android, "CPU", "x86_64");

            // iOS
            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/iOS/libuwa_gpm.a", BuildTarget.iOS);
            SetPlatformData(UwaUnityPath + "/Runtime/Plugins/iOS/libuwa_gpm.a", BuildTarget.iOS, "CPU", "ARM64");
            
            // Windows
            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/x86/uwa_gpm.dll", BuildTarget.StandaloneWindows);
            SetPlatformData(UwaUnityPath + "/Runtime/Plugins/x86/uwa_gpm.dll", BuildTarget.StandaloneWindows, "CPU", "x86");

            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/x86_64/uwa_gpm.dll", BuildTarget.StandaloneWindows64);
            SetPlatformData(UwaUnityPath + "/Runtime/Plugins/x86_64/uwa_gpm.dll", BuildTarget.StandaloneWindows64, "CPU", "x86_64");
            
            // Webgl
            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/WebGL/libuwa_gpm.a", BuildTarget.WebGL);

#if TUANJIE_2022_3_OR_NEWER
            // OpenHarmony
            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/OpenHarmony/libs/arm64-v8a/libuwa_gpm.so", BuildTarget.OpenHarmony);
            SetPlatformData(UwaUnityPath + "/Runtime/Plugins/OpenHarmony/libs/arm64-v8a/libuwa_gpm.so", BuildTarget.OpenHarmony, "CPU", "ARM64");

            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/OpenHarmony/libs/armeabi-v7a/libuwa_gpm.so", BuildTarget.OpenHarmony);
            SetPlatformData(UwaUnityPath + "/Runtime/Plugins/OpenHarmony/libs/armeabi-v7a/libuwa_gpm.so", BuildTarget.OpenHarmony, "CPU", "ARMv7");

            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/OpenHarmony/libs/x86_64/libuwa_gpm.so", BuildTarget.OpenHarmony);
            SetPlatformData(UwaUnityPath + "/Runtime/Plugins/OpenHarmony/libs/x86_64/libuwa_gpm.so", BuildTarget.OpenHarmony, "CPU", "x86_64");

            // TSLIB OpenHarmony
            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/OpenHarmony/uwagpm.tslib", BuildTarget.OpenHarmony);

            // Minigame
            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/WebGL/libuwa_gpm.a", BuildTarget.WeixinMiniGame, exclude: false);
#else
            // OpenHarmony
            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/OpenHarmony/libs/arm64-v8a/libuwa_gpm.so", BuildTarget.NoTarget);
            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/OpenHarmony/libs/armeabi-v7a/libuwa_gpm.so", BuildTarget.NoTarget);
            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/OpenHarmony/libs/x86_64/libuwa_gpm.so", BuildTarget.NoTarget);

            // TSLIB OpenHarmony
            SetPluginTarget(UwaUnityPath + "/Runtime/Plugins/OpenHarmony/uwagpm.tslib", BuildTarget.NoTarget);
#endif
        }

        private static List<BuildTarget> BuildTargets = new List<BuildTarget>()
        {
#if UNITY_2017_3_OR_NEWER
            BuildTarget.StandaloneOSX,
#else
            BuildTarget.StandaloneOSXIntel,
            BuildTarget.StandaloneOSXIntel64,
            BuildTarget.StandaloneOSXUniversal,
#endif
            BuildTarget.StandaloneLinux64,

#if !UNITY_2019_2_OR_NEWER
            BuildTarget.StandaloneLinux,
            BuildTarget.StandaloneLinuxUniversal,
#endif
            BuildTarget.StandaloneWindows,
            BuildTarget.StandaloneWindows64,
            BuildTarget.Android,
            (BuildTarget)9,

#if TUANJIE_2022_3_OR_NEWER
            BuildTarget.OpenHarmony,
            BuildTarget.WeixinMiniGame,
#endif
        };

        private static bool SetPluginTarget(string pluginPath, BuildTarget target, bool exclude = true, bool withEditor = false)
        {
            PluginImporter pI = AssetImporter.GetAtPath(pluginPath) as PluginImporter;
            if (pI == null) return false;

            pI.SetCompatibleWithAnyPlatform(false);
            pI.SetCompatibleWithEditor(withEditor);

            if (exclude)
            {
                for (int i = 0; i < BuildTargets.Count; i++)
                {
                    pI.SetCompatibleWithPlatform(BuildTargets[i], false);
                }
            }

            if (target != BuildTarget.NoTarget) pI.SetCompatibleWithPlatform(target, true);

#if UNITY_2019_1_OR_NEWER || TUANJIE_2022_3_OR_NEWER
            if (pI.isNativePlugin) pI.isPreloaded = true;
#endif
            pI.SaveAndReimport();
            return true;
        }

        private static bool SetPlatformData(string pluginPath, BuildTarget target, string key, string value)
        {
            PluginImporter pI = AssetImporter.GetAtPath(pluginPath) as PluginImporter;
            if (pI == null) return false;

            pI.SetPlatformData(target, key, value);
            pI.SaveAndReimport();

            string curV = pI.GetPlatformData(target, key);
            return curV == value;
        }

        public static string UwaUnityPath
        {
            get
            {
                if (_uwaUnityPath == null)
                {
                    string[] path = Directory.GetDirectories(Application.dataPath, SDKRoot, SearchOption.AllDirectories);
                    if (path.Length == 0)
                    {
                        _uwaUnityPath = "";
                    }
                    else
                    {
                        _uwaUnityPath = path[0].Replace(Application.dataPath, "Assets");
                    }
                }
                return _uwaUnityPath;
            }
        }
        private static string _uwaUnityPath = null;
    }
}
#endif