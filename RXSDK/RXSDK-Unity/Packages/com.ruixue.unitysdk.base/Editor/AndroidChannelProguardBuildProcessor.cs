#if UNITY_EDITOR && UNITY_ANDROID
using System;
using System.IO;
using System.Xml;
using UnityEditor.Android;
using UnityEditor.Build;
using UnityEditor.PackageManager;
using UnityEngine;

namespace RuiXue.Editor
{
    internal sealed class AndroidChannelProguardBuildProcessor :
        IPostGenerateGradleAndroidProject
    {
        private const string FileName = "ruixue-channel-proguard.pro";
        private const string Marker = "// RXSDK_CHANNEL_PROGUARD";
        private const string HuyaRepository =
            "https://artifact.bytedance.com/repository/Volcengine/";
        private const string AndroidNamespace =
            "http://schemas.android.com/apk/res/android";
        private const string XutengApplication = "com.ruixue.sdk.XTApplication";

        public int callbackOrder => 90;

        public void OnPostGenerateGradleAndroidProject(string path)
        {
            string rootPath = Directory.GetParent(path)?.FullName;
            if (string.IsNullOrEmpty(rootPath))
            {
                throw new BuildFailedException($"无法识别 Android Gradle 工程根目录：{path}");
            }

            ConfigureXutengApplication(path);

            string launcherPath = Path.Combine(rootPath, "launcher");
            string launcherGradlePath = Path.Combine(launcherPath, "build.gradle");
            if (!File.Exists(launcherGradlePath))
            {
                throw new BuildFailedException($"未找到 launcher/build.gradle：{launcherGradlePath}");
            }
            EnsureHuyaRepository(rootPath);

            string packagePath = PackageInfo.FindForAssembly(
                typeof(AndroidChannelProguardBuildProcessor).Assembly)?.resolvedPath;
            if (string.IsNullOrEmpty(packagePath))
            {
                throw new BuildFailedException("无法定位 RuiXue.Base UPM 路径。");
            }

            string sourcePath = Path.Combine(packagePath, "Editor", "Templates", FileName);
            if (!File.Exists(sourcePath))
            {
                throw new BuildFailedException($"未找到渠道混淆模板：{sourcePath}");
            }

            File.Copy(sourcePath, Path.Combine(launcherPath, FileName), true);

            string content = File.ReadAllText(launcherGradlePath);
            if (content.IndexOf(Marker, StringComparison.Ordinal) < 0)
            {
                content +=
                    $"\n{Marker}\n" +
                    $"android.buildTypes.all {{ buildType -> buildType.proguardFiles '{FileName}' }}\n";
                File.WriteAllText(launcherGradlePath, content);
            }

            GenerateBaiduProviderPaths(path);
            Debug.Log("RuiXue.Base 已注入渠道混淆、百度 Provider 路径和虎牙 Maven 仓库。");
        }

        private static void ConfigureXutengApplication(string unityLibraryPath)
        {
            string gradlePath = Path.Combine(unityLibraryPath, "build.gradle");
            if (!File.Exists(gradlePath))
            {
                return;
            }
            bool hasXutengDependency = HasActiveXutengDependency(gradlePath);

            string manifestPath = Path.Combine(
                unityLibraryPath, "src", "main", "AndroidManifest.xml");
            if (!File.Exists(manifestPath))
            {
                throw new BuildFailedException(
                    $"栩腾渠道未找到 unityLibrary AndroidManifest.xml：{manifestPath}");
            }

            var document = new XmlDocument
            {
                PreserveWhitespace = true,
                XmlResolver = null
            };
            document.Load(manifestPath);

            XmlElement manifest = document.DocumentElement;
            if (manifest == null || manifest.LocalName != "manifest")
            {
                throw new BuildFailedException(
                    $"AndroidManifest.xml 根节点必须为 manifest：{manifestPath}");
            }

            XmlElement application = null;
            foreach (XmlNode node in manifest.ChildNodes)
            {
                if (node is XmlElement element && element.LocalName == "application")
                {
                    application = element;
                    break;
                }
            }
            if (application == null)
            {
                throw new BuildFailedException(
                    $"AndroidManifest.xml 未找到 application：{manifestPath}");
            }

            XmlAttribute nameAttribute =
                application.GetAttributeNode("name", AndroidNamespace);
            if (!hasXutengDependency)
            {
                if (nameAttribute == null ||
                    nameAttribute.Value != XutengApplication)
                {
                    return;
                }

                string projectApplication = GetProjectApplicationName();
                if (string.IsNullOrEmpty(projectApplication))
                {
                    throw new BuildFailedException(
                        "非栩腾构建检测到残留 XTApplication，但无法读取项目原始 Application。请执行完整构建。");
                }
                nameAttribute.Value = projectApplication;
                document.Save(manifestPath);
                return;
            }

            if (nameAttribute != null &&
                nameAttribute.Value == XutengApplication)
            {
                return;
            }

            if (nameAttribute == null)
            {
                nameAttribute = document.CreateAttribute(
                    "android", "name", AndroidNamespace);
                application.Attributes.Append(nameAttribute);
            }
            nameAttribute.Value = XutengApplication;
            document.Save(manifestPath);
        }

        private static bool HasActiveXutengDependency(string gradlePath)
        {
            foreach (string line in File.ReadLines(gradlePath))
            {
                string activeContent = line;
                int commentIndex = activeContent.IndexOf("//", StringComparison.Ordinal);
                if (commentIndex >= 0)
                {
                    activeContent = activeContent.Substring(0, commentIndex);
                }

                string trimmed = activeContent.TrimStart();
                bool isDependency = trimmed.StartsWith("implementation", StringComparison.Ordinal) ||
                                    trimmed.StartsWith("api", StringComparison.Ordinal);
                if (isDependency &&
                    activeContent.IndexOf("rxsdk_xuteng", StringComparison.Ordinal) >= 0)
                {
                    return true;
                }
            }

            return false;
        }

        private static string GetProjectApplicationName()
        {
            string manifestPath = Path.Combine(
                Application.dataPath, "Plugins", "Android", "AndroidManifest.xml");
            if (!File.Exists(manifestPath))
            {
                return null;
            }

            var document = new XmlDocument
            {
                XmlResolver = null
            };
            document.Load(manifestPath);
            XmlElement application = document.DocumentElement?["application"];
            return application?.GetAttribute("name", AndroidNamespace);
        }

        private static void EnsureHuyaRepository(string rootPath)
        {
            string settingsPath = Path.Combine(rootPath, "settings.gradle");
            if (!File.Exists(settingsPath))
            {
                throw new BuildFailedException($"未找到 settings.gradle：{settingsPath}");
            }

            string content = File.ReadAllText(settingsPath);
            if (content.IndexOf(HuyaRepository, StringComparison.Ordinal) >= 0)
                return;

            int dependencyIndex = content.IndexOf(
                "dependencyResolutionManagement", StringComparison.Ordinal);
            int repositoriesIndex = dependencyIndex >= 0
                ? content.IndexOf("repositories", dependencyIndex, StringComparison.Ordinal)
                : -1;
            int openingBraceIndex = repositoriesIndex >= 0
                ? content.IndexOf('{', repositoriesIndex)
                : -1;
            if (openingBraceIndex < 0)
            {
                throw new BuildFailedException(
                    "settings.gradle 中未找到 dependencyResolutionManagement.repositories。");
            }

            content = content.Insert(openingBraceIndex + 1,
                $"\n        maven {{ url '{HuyaRepository}' }} // RXSDK_HUYA");
            File.WriteAllText(settingsPath, content);
        }

        private static void GenerateBaiduProviderPaths(string unityLibraryPath)
        {
            string xmlDirectory = Path.Combine(unityLibraryPath, "src", "main", "res", "xml");
            Directory.CreateDirectory(xmlDirectory);
            string filePath = Path.Combine(xmlDirectory, "provider_paths.xml");

            var document = new XmlDocument();
            XmlElement paths;
            if (File.Exists(filePath))
            {
                document.Load(filePath);
                paths = document.DocumentElement;
                if (paths == null || paths.Name != "paths")
                {
                    throw new BuildFailedException($"provider_paths.xml 根节点必须为 paths：{filePath}");
                }
            }
            else
            {
                document.AppendChild(document.CreateXmlDeclaration("1.0", "utf-8", null));
                paths = document.CreateElement("paths");
                document.AppendChild(paths);
            }

            EnsurePath(document, paths, "files-path", "files-path", "com.baidu.plaformsdk/");
            EnsurePath(document, paths, "cache-path", "cache-path", "/.");
            EnsurePath(document, paths, "external-path", "external-path", "/.");
            EnsurePath(document, paths, "external-files-path", "external-files-path",
                "com.baidu.plaformsdk/");
            EnsurePath(document, paths, "external-cache-path", "external-cache-path", "/.");
            document.Save(filePath);
        }

        private static void EnsurePath(XmlDocument document, XmlElement paths,
            string elementName, string name, string path)
        {
            XmlElement target = null;
            foreach (XmlNode node in paths.ChildNodes)
            {
                if (node is XmlElement element && element.Name == elementName &&
                    element.GetAttribute("name") == name)
                {
                    target = element;
                    break;
                }
            }

            if (target == null)
            {
                target = document.CreateElement(elementName);
                paths.AppendChild(target);
            }
            target.SetAttribute("name", name);
            target.SetAttribute("path", path);
        }
    }
}
#endif
