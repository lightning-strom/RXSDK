#if UNITY_IOS
using System;
using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;
using UnityEditor.iOS.Xcode.Extensions;
using UnityEngine;

public class IOSNotificationPostProcessor : MonoBehaviour
{
    private const string NotificationServiceTargetName = "NotificationService";
    private const string NotificationServiceDirectory = "RXPushNotificationService";
    private const string NotificationServiceClassName = "NotificationService";
    private const string NotificationServiceBundleIdSuffix = ".NotificationService";
    private const string MinimumIOSVersion = "12.0";

    [PostProcessBuild(-100)]
    public static void OnPostprocessBuild(BuildTarget buildTarget, string path)
    {
        if (buildTarget != BuildTarget.iOS)
            return;

        // Check if we have the minimal iOS version set.
        bool hasMinOSVersion;
        try
        {
            var requiredVersion = new Version(12, 0);
            var currentVersion = new Version(PlayerSettings.iOS.targetOSVersionString);
            hasMinOSVersion = currentVersion >= requiredVersion;
        }
        catch (Exception)
        {
            hasMinOSVersion = false;
        }

        if (!hasMinOSVersion)
            Debug.LogWarning("RXPushSDK requires iOS 12.0 or newer. Please update `Target minimum iOS Version` in Player Settings.");
        
        // 打开unity 宏
        PatchPreprocessor(path);
        
        // 后台或退出状态下，通过 Notification Service Extension 上报消息接收统计
        AddNotificationServiceExtension(path);

        // 配置 capability
        SettingCapability(path);
    }

    private static void PatchPreprocessor(string path)
    {
        var preprocessorPath = path + "/Classes/Preprocessor.h";
        var preprocessor = File.ReadAllText(preprocessorPath);
        var needsToWriteChanges = false;
        
        if (preprocessor.Contains("UNITY_USES_REMOTE_NOTIFICATIONS"))
        {
            preprocessor =
                preprocessor.Replace("UNITY_USES_REMOTE_NOTIFICATIONS 0", "UNITY_USES_REMOTE_NOTIFICATIONS 1");
            needsToWriteChanges = true;
        }

        if (needsToWriteChanges)
            File.WriteAllText(preprocessorPath, preprocessor);
    }
    
    private static void AddNotificationServiceExtension(string path)
    {
        string extensionPath = Path.Combine(path, NotificationServiceDirectory);
        Directory.CreateDirectory(extensionPath);

        string headerRelativePath = NotificationServiceDirectory + "/" + NotificationServiceClassName + ".h";
        string implementationRelativePath = NotificationServiceDirectory + "/" + NotificationServiceClassName + ".m";
        string infoPlistRelativePath = NotificationServiceDirectory + "/Info.plist";

        File.WriteAllText(Path.Combine(path, headerRelativePath), NotificationServiceHeader);
        File.WriteAllText(Path.Combine(path, implementationRelativePath), NotificationServiceImplementation);
        WriteNotificationServiceInfoPlist(Path.Combine(path, infoPlistRelativePath));

        string projectPath = PBXProject.GetPBXProjectPath(path);
        var project = new PBXProject();
        project.ReadFromFile(projectPath);

        string mainTargetGuid = project.GetUnityMainTargetGuid();
        string extensionTargetGuid = project.TargetGuidByName(NotificationServiceTargetName);
        if (string.IsNullOrEmpty(extensionTargetGuid))
        {
            string bundleId = GetMainTargetBundleIdentifier(project, mainTargetGuid) +
                              NotificationServiceBundleIdSuffix;
            extensionTargetGuid = project.AddAppExtension(
                mainTargetGuid,
                NotificationServiceTargetName,
                bundleId,
                infoPlistRelativePath);
        }

        AddFileToTarget(project, extensionTargetGuid, headerRelativePath);
        AddFileToTarget(project, extensionTargetGuid, implementationRelativePath);
        project.AddFrameworkToProject(extensionTargetGuid, "UserNotifications.framework", false);
        project.SetBuildProperty(extensionTargetGuid, "APPLICATION_EXTENSION_API_ONLY", "YES");
        project.SetBuildProperty(extensionTargetGuid, "IPHONEOS_DEPLOYMENT_TARGET", MinimumIOSVersion);
        project.SetBuildProperty(
            extensionTargetGuid,
            "LD_RUNPATH_SEARCH_PATHS",
            "$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks");
        project.SetBuildProperty(extensionTargetGuid, "SKIP_INSTALL", "YES");
        CopyBuildProperty(project, mainTargetGuid, extensionTargetGuid, "CODE_SIGN_STYLE");
        CopyBuildProperty(project, mainTargetGuid, extensionTargetGuid, "DEVELOPMENT_TEAM");
        CopyBuildProperty(project, mainTargetGuid, extensionTargetGuid, "PROVISIONING_PROFILE_SPECIFIER");
        project.WriteToFile(projectPath);
    }

    private static void CopyBuildProperty(
        PBXProject project,
        string sourceTargetGuid,
        string destinationTargetGuid,
        string propertyName)
    {
        string propertyValue = project.GetBuildPropertyForAnyConfig(sourceTargetGuid, propertyName);
        if (!string.IsNullOrEmpty(propertyValue))
            project.SetBuildProperty(destinationTargetGuid, propertyName, propertyValue);
    }

    private static string GetMainTargetBundleIdentifier(PBXProject project, string mainTargetGuid)
    {
        string bundleId = project.GetBuildPropertyForAnyConfig(
            mainTargetGuid,
            "PRODUCT_BUNDLE_IDENTIFIER");
        bundleId = string.IsNullOrEmpty(bundleId) ? null : bundleId.Trim().Trim('"');

        // 导出的 Xcode 工程是最终配置来源。只有工程未写入明确 Bundle ID 时，
        // 才回退到 Unity PlayerSettings，避免 Keychain 继续使用 Demo 的固定标识。
        if (string.IsNullOrEmpty(bundleId) || bundleId.Contains("$("))
            bundleId = PlayerSettings.GetApplicationIdentifier(BuildTargetGroup.iOS);

        if (string.IsNullOrEmpty(bundleId))
            throw new InvalidOperationException("Unable to resolve the iOS PRODUCT_BUNDLE_IDENTIFIER for RXPush Keychain Sharing.");

        return bundleId;
    }

    private static void AddFileToTarget(PBXProject project, string targetGuid, string relativePath)
    {
        string fileGuid = project.FindFileGuidByProjectPath(relativePath);
        if (string.IsNullOrEmpty(fileGuid))
            fileGuid = project.AddFile(relativePath, relativePath);

        project.AddFileToBuild(targetGuid, fileGuid);
    }

    private static void WriteNotificationServiceInfoPlist(string infoPlistPath)
    {
        var plist = new PlistDocument();
        PlistElementDict root = plist.root;
        root.SetString("CFBundleDevelopmentRegion", "$(DEVELOPMENT_LANGUAGE)");
        root.SetString("CFBundleDisplayName", NotificationServiceTargetName);
        root.SetString("CFBundleExecutable", "$(EXECUTABLE_NAME)");
        root.SetString("CFBundleIdentifier", "$(PRODUCT_BUNDLE_IDENTIFIER)");
        root.SetString("CFBundleInfoDictionaryVersion", "6.0");
        root.SetString("CFBundleName", "$(PRODUCT_NAME)");
        root.SetString("CFBundlePackageType", "XPC!");
        root.SetString("CFBundleShortVersionString", PlayerSettings.bundleVersion);
        root.SetString("CFBundleVersion", PlayerSettings.iOS.buildNumber);

        PlistElementDict extension = root.CreateDict("NSExtension");
        extension.SetString("NSExtensionPointIdentifier", "com.apple.usernotifications.service");
        extension.SetString("NSExtensionPrincipalClass", NotificationServiceClassName);
        plist.WriteToFile(infoPlistPath);
    }

    private static void SettingCapability(string path)
    {
        string projectPath = PBXProject.GetPBXProjectPath(path);
        string mainEntitlementPath = RXIosXcodeTool.EntitlementName + "/" +
                                     RXIosXcodeTool.EntitlementName + ".entitlements";
        string extensionEntitlementPath = NotificationServiceDirectory + "/" +
                                          NotificationServiceTargetName + ".entitlements";
        var project = new PBXProject();
        project.ReadFromFile(projectPath);
        string mainTargetGuid = project.GetUnityMainTargetGuid();
        string extensionTargetGuid = project.TargetGuidByName(NotificationServiceTargetName);
        string mainBundleId = GetMainTargetBundleIdentifier(project, mainTargetGuid);
        string extensionBundleId = mainBundleId + NotificationServiceBundleIdSuffix;
        string[] keychainAccessGroups =
        {
            "$(AppIdentifierPrefix)" + mainBundleId,
            "$(AppIdentifierPrefix)" + extensionBundleId
        };
        project.SetBuildProperty(mainTargetGuid, "CODE_SIGN_ENTITLEMENTS", mainEntitlementPath);
        project.SetBuildProperty(extensionTargetGuid, "CODE_SIGN_ENTITLEMENTS", extensionEntitlementPath);
        project.WriteToFile(projectPath);

        var mainCapabilityManager = new ProjectCapabilityManager(
            projectPath,
            mainEntitlementPath,
            null,
            mainTargetGuid);
		
        mainCapabilityManager.AddPushNotifications(true);
        mainCapabilityManager.AddKeychainSharing(keychainAccessGroups);
        mainCapabilityManager.WriteToFile();

        var extensionCapabilityManager = new ProjectCapabilityManager(
            projectPath,
            extensionEntitlementPath,
            null,
            extensionTargetGuid);
        extensionCapabilityManager.AddKeychainSharing(keychainAccessGroups);
        extensionCapabilityManager.WriteToFile();
    }

    private const string NotificationServiceHeader =
        "#import <UserNotifications/UserNotifications.h>\n\n" +
        "@interface NotificationService : UNNotificationServiceExtension\n" +
        "@end\n";

    private const string NotificationServiceImplementation =
        "#import \"NotificationService.h\"\n" +
        "#import <RXPushSDK/RXPushSDK.h>\n\n" +
        "@interface NotificationService ()\n" +
        "@property (nonatomic, copy) void (^contentHandler)(UNNotificationContent *contentToDeliver);\n" +
        "@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;\n" +
        "@end\n\n" +
        "@implementation NotificationService\n\n" +
        "- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request\n" +
        "                   withContentHandler:(void (^)(UNNotificationContent *contentToDeliver))contentHandler\n" +
        "{\n" +
        "    self.contentHandler = contentHandler;\n" +
        "    self.bestAttemptContent = [request.content mutableCopy];\n\n" +
        "    [[RXPushService sharedSDK] pushReceivedWithUserInfo:self.bestAttemptContent.userInfo];\n" +
        "    self.contentHandler(self.bestAttemptContent);\n" +
        "    self.contentHandler = nil;\n" +
        "}\n\n" +
        "- (void)serviceExtensionTimeWillExpire\n" +
        "{\n" +
        "    if (self.contentHandler && self.bestAttemptContent) {\n" +
        "        self.contentHandler(self.bestAttemptContent);\n" +
        "    }\n" +
        "}\n\n" +
        "@end\n";
}
#endif
