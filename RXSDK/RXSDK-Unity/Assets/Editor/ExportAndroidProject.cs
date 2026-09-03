using UnityEditor;
using UnityEngine;
using System.IO;
using System.Linq;

public static class ExportAndroidProject
{
    private const string DefaultOutputDir = "build/AndroidExport";

    [MenuItem("RuiXue/导出 Android 工程")]
    public static void Export()
    {
        var outputPath = Path.Combine(
            Directory.GetParent(Application.dataPath).FullName, DefaultOutputDir);

        if (Directory.Exists(outputPath))
        {
            if (!EditorUtility.DisplayDialog(
                "导出 Android 工程",
                $"输出目录已存在：\n{outputPath}\n\n是否覆盖？",
                "覆盖", "取消"))
                return;
            Directory.Delete(outputPath, true);
        }

        var scenes = EditorBuildSettings.scenes
            .Where(s => s.enabled)
            .Select(s => s.path)
            .ToArray();

        if (scenes.Length == 0)
        {
            EditorUtility.DisplayDialog("导出 Android 工程",
                "Build Settings 中没有启用的场景，请先添加至少一个场景。", "确定");
            return;
        }

        Debug.Log($"[ExportAndroid] 导出到: {outputPath}，场景: {string.Join(", ", scenes)}");

        EditorUserBuildSettings.SwitchActiveBuildTarget(
            BuildTargetGroup.Android, BuildTarget.Android);
        EditorUserBuildSettings.exportAsGoogleAndroidProject = true;
        EditorUserBuildSettings.androidBuildSystem = AndroidBuildSystem.Gradle;

        var report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
        {
            scenes = scenes,
            locationPathName = outputPath,
            target = BuildTarget.Android,
            options = BuildOptions.AcceptExternalModificationsToPlayer
        });

        if (report.summary.result == UnityEditor.Build.Reporting.BuildResult.Succeeded)
        {
            Debug.Log($"[ExportAndroid] 导出成功: {outputPath}");
            EditorUtility.DisplayDialog("导出 Android 工程", $"导出成功！\n{outputPath}", "确定");
            EditorUtility.RevealInFinder(outputPath);
        }
        else
        {
            Debug.LogError($"[ExportAndroid] 导出失败: {report.summary.result}");
            EditorUtility.DisplayDialog("导出 Android 工程",
                $"导出失败：{report.summary.result}\n请查看 Console 日志。", "确定");
        }
    }

    [MenuItem("RuiXue/导出 Android 工程（命令行）")]
    public static void ExportFromCommandLine()
    {
        var outputPath = GetCommandLineArg("-exportPath") ??
            Path.Combine(Directory.GetParent(Application.dataPath).FullName, DefaultOutputDir);
        if (Directory.Exists(outputPath))
        {
            Directory.Delete(outputPath, true);
        }

        var scenes = EditorBuildSettings.scenes
            .Where(s => s.enabled)
            .Select(s => s.path)
            .ToArray();

        EditorUserBuildSettings.SwitchActiveBuildTarget(
            BuildTargetGroup.Android, BuildTarget.Android);
        EditorUserBuildSettings.exportAsGoogleAndroidProject = true;
        EditorUserBuildSettings.androidBuildSystem = AndroidBuildSystem.Gradle;

        var report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
        {
            scenes = scenes,
            locationPathName = outputPath,
            target = BuildTarget.Android,
            options = BuildOptions.AcceptExternalModificationsToPlayer
        });

        EditorApplication.Exit(report.summary.result == UnityEditor.Build.Reporting.BuildResult.Succeeded ? 0 : 1);
    }

    private static string GetCommandLineArg(string name)
    {
        var args = System.Environment.GetCommandLineArgs();
        for (int i = 0; i < args.Length - 1; i++)
            if (args[i] == name) return args[i + 1];
        return null;
    }
}
