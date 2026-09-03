#if UNITY_EDITOR && UNITY_ANDROID
using System;
using System.IO;
using System.Text.RegularExpressions;
using UnityEditor.Android;
using UnityEditor.Build;
using UnityEngine;

namespace RuiXue.XingYi.Editor
{
    internal class RXXingYiBuildProcessor : IPostGenerateGradleAndroidProject
    {
        internal const string AndroidSdkVersion = "4.0.14";
        private const string ByteDanceRepository =
            "https://artifact.bytedance.com/repository/Volcengine/";
        private static readonly string[] Dependencies =
        {
            "rxsdk_xingyi",
            "rxsdk_h5pay"
        };

        public int callbackOrder => 110;

        public void OnPostGenerateGradleAndroidProject(string path)
        {
            if (!RXXingYiBuildSettings.IsEnabled())
            {
                Debug.Log("未启用星驿支付，跳过星驿 Android 依赖注入。");
                return;
            }

            string rootPath = Directory.GetParent(path)?.FullName;
            if (string.IsNullOrEmpty(rootPath))
            {
                throw new BuildFailedException($"无法识别 Android Gradle 工程根目录：{path}");
            }

            PatchRepository(rootPath);
            string gradlePath = Path.Combine(path, "build.gradle");
            if (!File.Exists(gradlePath))
            {
                throw new BuildFailedException($"未找到 Unity Android Gradle 文件：{gradlePath}");
            }

            string content = File.ReadAllText(gradlePath);
            File.WriteAllText(gradlePath, PatchGradleContent(content));
            Debug.Log("星驿支付 Android 依赖已注入导出的 Gradle 工程。");
        }

        private static void PatchRepository(string rootPath)
        {
            string settingsPath = Path.Combine(rootPath, "settings.gradle");
            if (File.Exists(settingsPath) &&
                TryPatchRepository(settingsPath, "dependencyResolutionManagement"))
            {
                return;
            }

            string buildGradlePath = Path.Combine(rootPath, "build.gradle");
            if (File.Exists(buildGradlePath) &&
                TryPatchRepository(buildGradlePath, "allprojects"))
            {
                return;
            }

            throw new BuildFailedException(
                "无法在导出的 Android 工程中写入星驿支付所需的字节跳动 Maven 仓库。");
        }

        private static bool TryPatchRepository(string filePath, string parentBlock)
        {
            string content = File.ReadAllText(filePath);
            if (content.Contains(ByteDanceRepository))
            {
                return true;
            }

            int parentIndex = content.IndexOf(parentBlock, StringComparison.Ordinal);
            int repositoriesIndex = parentIndex >= 0
                ? content.IndexOf("repositories", parentIndex, StringComparison.Ordinal)
                : -1;
            int openingBraceIndex = repositoriesIndex >= 0
                ? content.IndexOf('{', repositoriesIndex)
                : -1;
            if (openingBraceIndex < 0)
            {
                return false;
            }

            string repository =
                $"\n        maven {{ url '{ByteDanceRepository}' }} // RX_XINGYI";
            File.WriteAllText(filePath, content.Insert(openingBraceIndex + 1, repository));
            return true;
        }

        internal static string PatchGradleContent(string content)
        {
            if (string.IsNullOrWhiteSpace(content))
            {
                throw new BuildFailedException("Unity Android Gradle 文件为空。");
            }

            content = Regex.Replace(content,
                @"(?<prefix>[""']com\.ruixue:[^:""']+:)(?<version>\d+\.\d+\.\d+)(?<suffix>[""'])",
                match => CompareVersion(match.Groups["version"].Value, AndroidSdkVersion) < 0
                    ? match.Groups["prefix"].Value + AndroidSdkVersion +
                      match.Groups["suffix"].Value
                    : match.Value);

            foreach (string artifact in Dependencies)
            {
                content = EnsureDependency(content, artifact);
            }
            return content;
        }

        private static string EnsureDependency(string content, string artifact)
        {
            var dependencyPattern = new Regex(
                $@"com\.ruixue:{Regex.Escape(artifact)}:(?<version>[^""']+)");
            Match dependency = dependencyPattern.Match(content);
            if (dependency.Success)
            {
                string version = dependency.Groups["version"].Value;
                if (!Regex.IsMatch(version, @"^\d+\.\d+\.\d+$"))
                {
                    throw new BuildFailedException(
                        $"{artifact} 必须使用固定版本，当前为：{version}");
                }
                return content;
            }

            Match dependenciesBlock = Regex.Match(content, @"\bdependencies\s*\{");
            if (!dependenciesBlock.Success)
            {
                throw new BuildFailedException("Gradle 文件中未找到 dependencies 块。");
            }

            int insertIndex = dependenciesBlock.Index + dependenciesBlock.Length;
            string line =
                $"\n    implementation 'com.ruixue:{artifact}:{AndroidSdkVersion}' // RX_XINGYI";
            return content.Insert(insertIndex, line);
        }

        private static int CompareVersion(string left, string right)
        {
            string[] leftParts = left.Split('.');
            string[] rightParts = right.Split('.');
            for (int index = 0; index < 3; index++)
            {
                int comparison = int.Parse(leftParts[index])
                    .CompareTo(int.Parse(rightParts[index]));
                if (comparison != 0)
                {
                    return comparison;
                }
            }
            return 0;
        }
    }
}
#endif
