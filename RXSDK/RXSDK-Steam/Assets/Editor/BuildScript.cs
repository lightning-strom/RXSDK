using UnityEditor;
using System.IO;
using System.Linq;
using System.Diagnostics;
using Debug = UnityEngine.Debug;
using System.Collections.Generic;

public class BuildScript
{
    private static readonly string BuildFolderName = "publish";
    private static string PlatformFolderName => EditorUserBuildSettings.activeBuildTarget == BuildTarget.StandaloneWindows64 ? "Windows" : "MacOS";
    private static readonly string AppName = "RXTJUnity";

    private static string BuildPath => Path.Combine(Directory.GetCurrentDirectory(), BuildFolderName, PlatformFolderName);
    private static string AppPath => EditorUserBuildSettings.activeBuildTarget == BuildTarget.StandaloneWindows64
        ? Path.Combine(BuildPath, $"{AppName}.exe")
        : Path.Combine(BuildPath, $"{AppName}.app");

    // 运行菜单项
    [MenuItem("Tools/Run PC", priority = 1)]
    public static void RunPC()
    {
        if (Directory.Exists(BuildPath))
        {
            Process process = new Process();
            if (EditorUserBuildSettings.activeBuildTarget == BuildTarget.StandaloneWindows64)
            {
                process.StartInfo.FileName = AppPath;
            }
            else
            {
                process.StartInfo.FileName = "open";
                process.StartInfo.Arguments = $"\"{AppPath}\"";
            }
            process.Start();
            Debug.Log($"Application launched from: {AppPath}");
        }
        else
        {
            Debug.LogError($"Application not found at: {AppPath}");
        }
    }

    // 验证运行菜单项是否可用
    [MenuItem("Tools/Run PC", true)]
    public static bool ValidateRunPC()
    {
        string targetPath = EditorUserBuildSettings.activeBuildTarget == BuildTarget.StandaloneWindows64 ? AppPath : Path.Combine(AppPath, "Contents/MacOS", AppName);
        return File.Exists(targetPath);
    }

    // 构建菜单项
    [MenuItem("Tools/Build PC", priority = 2)]
    public static void BuildPC()
    {
        BuildPCInternal(false);
    }

    // 构建并运行菜单项
    [MenuItem("Tools/Build And Run PC", priority = 3)]
    public static void BuildAndRunPC()
    {
        BuildPCInternal(true);
    }

    // 更新菜单项名称
    private static void UpdateMenuItems()
    {
        string platformName = EditorUserBuildSettings.activeBuildTarget == BuildTarget.StandaloneWindows64 ? "Windows" : "MacOS";
        Menu.SetChecked("Tools/Switch Platform/Windows", EditorUserBuildSettings.activeBuildTarget == BuildTarget.StandaloneWindows64);
        Menu.SetChecked("Tools/Switch Platform/MacOS", EditorUserBuildSettings.activeBuildTarget == BuildTarget.StandaloneOSX);
    }

    private static void BuildPCInternal(bool shouldRun)
    {
        // 确保输出目录存在
        Directory.CreateDirectory(BuildPath);

        string[] scenes = EditorBuildSettings.scenes
            .Where(scene => scene.enabled)
            .Select(scene => scene.path)
            .ToArray();

        // 执行构建
        BuildPipeline.BuildPlayer(scenes,
            AppPath,
            EditorUserBuildSettings.activeBuildTarget,
            BuildOptions.None);

        //
        Debug.Log($"Build completed: {AppPath}" + (IsExists() ? " (Success)" : " (Failed)"));

        // 如果需要运行
        if (shouldRun && IsExists())
        {
            RunPC();
        }
    }
    public static bool IsExists()
    {
        if (EditorUserBuildSettings.activeBuildTarget == BuildTarget.StandaloneOSX)
        {
            return Directory.Exists(AppPath);
        }
        else
        {
            return File.Exists(AppPath);
        }

    }

    // Windows 平台切换菜单项
    [MenuItem("Tools/Switch Platform/Windows", priority = 20)]
    public static void SwitchToWindows()
    {
        if (EditorUserBuildSettings.activeBuildTarget != BuildTarget.StandaloneWindows64)
        {
            EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTargetGroup.Standalone, BuildTarget.StandaloneWindows64);
            Debug.Log("Switched to Windows build target");
        }
        UpdateMenuItems();
    }

    // MacOS 平台切换菜单项
    [MenuItem("Tools/Switch Platform/MacOS", priority = 21)]
    public static void SwitchToMacOS()
    {
        if (EditorUserBuildSettings.activeBuildTarget != BuildTarget.StandaloneOSX)
        {
            EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTargetGroup.Standalone, BuildTarget.StandaloneOSX);
            Debug.Log("Switched to MacOS build target");
        }
        UpdateMenuItems();
    }

    // 验证 Windows 平台切换是否可用
    [MenuItem("Tools/Switch Platform/Windows", true)]
    public static bool ValidateSwitchToWindows()
    {
        return true;
    }

    // 验证 MacOS 平台切换是否可用
    [MenuItem("Tools/Switch Platform/MacOS", true)]
    public static bool ValidateSwitchToMacOS()
    {
#if UNITY_EDITOR_WIN
        return false; // Windows 编辑器不支持切换到 MacOS 构建目标
#else
        return true;
#endif
    }

    // 当 Unity 编辑器重新编译脚本时调用
    [InitializeOnLoadMethod]
    static void OnProjectLoadedInEditor()
    {
        UpdateMenuItems();
        EditorApplication.delayCall += () =>
        {
            // 确保在编辑器加载完成后更新菜单
            UpdateMenuItems();
        };
    }
}
