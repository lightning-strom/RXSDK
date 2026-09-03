using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using UnityEditor;
using UnityEditor.OpenHarmony;
using UnityEngine;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;



public class HMSBuildProcessor : IPostprocessBuildWithReport, IPreprocessBuildWithReport, IPostGenerateOpenHarmonyProject
{
    /// <summary>从 Player Settings → OpenHarmony → Compatible SDK 读取并转为 build-profile 字符串。</summary>
    private string CompatibleSdkVersion => ToSdkVersionString((int)PlayerSettings.OpenHarmony.compatibleSdkVersion);

    private const string TargetSdkVersion = "6.1.0(23)";

    public int callbackOrder
    {
        get { return 10; }
    }
    private Version TJVersion { get { return new Version(Application.tuanjieVersion); } }

    /// <summary>API Level → HarmonyOS SDK 版本串，如 18 → 5.1.0(18)。</summary>
    private static string ToSdkVersionString(int apiLevel)
    {
        switch (apiLevel)
        {
            case 12: return "5.0.0(12)";
            case 13: return "5.0.1(13)";
            case 14: return "5.0.2(14)";
            case 15: return "5.0.3(15)";
            case 16: return "5.0.4(16)";
            case 17: return "5.0.5(17)";
            case 18: return "5.1.0(18)";
            case 19: return "5.1.1(19)";
            case 20: return "6.0.0(20)";
            case 21: return "6.0.1(21)";
            case 22: return "6.0.2(22)";
            case 23: return "6.1.0(23)";
            default:
                Debug.LogWarning($"HMSBuildProcessor: unknown OpenHarmony API level {apiLevel}, using {apiLevel}.0.0({apiLevel}).");
                return apiLevel + ".0.0(" + apiLevel + ")";
        }
    }

    private readonly Dictionary<string, string> dependencyMap = new();

    /**
    * Tuanjie 1.10+ Export Project 回调（不走 IPostprocessBuildWithReport）
    */
    public void OnPostGenerateOpenHarmonyProject(string path)
    {
        if (TJVersion >= new Version("1.10.0"))
        {
            ApplyTuanjie110HostGlue(path);
        }
    }

    /**
    * build 构建完成后回调
    */

    public void OnPostprocessBuild(BuildReport report)
    {
        if (report.summary.platform == BuildTarget.OpenHarmony)
        {
            // 1.10+：仅补 Index/exported/签名/SDK；PlayerView 在 classesLib 内，ModifyRXWebView 无效
            if (TJVersion >= new Version("1.10.0"))
            {
                ApplyTuanjie110HostGlue(report.summary.outputPath);
            }
            else
            {
                DefaultRecodeFile(report.summary.outputPath);
                CustomRecodeFile(report.summary.outputPath);
                // <1.10：往 TuanjiePlayerView 插入 RXWebViewComponent；1.5+ WebView bind 改由 HMSMessageBind
                ModifyRXWebView(report.summary.outputPath);
            }

            // CopyWebViewImages(report.summary.outputPath);
        }
    }

    /**
    * build 构建开始前回调
    */
    public void OnPreprocessBuild(BuildReport report)
    {
        if (report.summary.platform != BuildTarget.OpenHarmony)
        {
            return;
        }

        if (!PlayerSettings.OpenHarmony.useCustomKeystore)
        {
            Debug.LogWarning(
                "HMSBuildProcessor: OpenHarmony Custom Keystore is off; Export Project will leave signingConfigs empty. Enable it in Player Settings → Publishing Settings, or sign in DevEco.");
        }
    }

    /// <summary>
    /// Tuanjie 1.10：WorkerProxy 在 classesLib 内不再调用 InitMessageBind，且不再写 UIContext。
    /// 导出后给 entry/Index.ets 打补丁，确保 tuanjieLib 导出 HMSMessageBind，并回写 SDK 版本。
    /// </summary>
    private void ApplyTuanjie110HostGlue(string path)
    {
        EnsureHarmonySdkVersion(path);
        EnsureSigningConfigs(path);
        EnsureHmsMessageBindExport(path);
        PatchEntryIndexForHmsMessageBind(path);
    }

    /// <summary>
    /// 导出后写回 SDK 版本：compatible ← Player Settings；target 固定 6.1.0(23)。
    /// </summary>
    private void EnsureHarmonySdkVersion(string path)
    {
        string profilePath = Path.Combine(path, "build-profile.json5");
        if (!File.Exists(profilePath))
        {
            Debug.LogWarning("HMSBuildProcessor: build-profile.json5 not found, skip SDK version patch.");
            return;
        }

        int apiLevel = (int)PlayerSettings.OpenHarmony.compatibleSdkVersion;
        string compatible = CompatibleSdkVersion;
        string text = File.ReadAllText(profilePath);
        string original = text;

        text = Regex.Replace(
            text,
            "\"compatibleSdkVersion\"\\s*:\\s*\"[^\"]*\"",
            $"\"compatibleSdkVersion\": \"{compatible}\"");

        if (Regex.IsMatch(text, "\"targetSdkVersion\"\\s*:\\s*\""))
        {
            text = Regex.Replace(
                text,
                "\"targetSdkVersion\"\\s*:\\s*\"[^\"]*\"",
                $"\"targetSdkVersion\": \"{TargetSdkVersion}\"");
        }
        else
        {
            // 模板无 targetSdkVersion 时插在 compatibleSdkVersion 后（保留尾逗号）
            text = Regex.Replace(
                text,
                "(\"compatibleSdkVersion\"\\s*:\\s*\"[^\"]*\")(\\s*,)?",
                $"$1,\n        \"targetSdkVersion\": \"{TargetSdkVersion}\",");
        }

        if (text == original)
        {
            Debug.Log($"HMSBuildProcessor: SDK already compatible={compatible}, target={TargetSdkVersion} (API {apiLevel}).");
            return;
        }

        File.WriteAllText(profilePath, text);
        Debug.Log($"HMSBuildProcessor: set compatibleSdkVersion={compatible} (API {apiLevel}), targetSdkVersion={TargetSdkVersion}.");
    }

    private void EnsureHmsMessageBindExport(string path)
    {
        string exportedPath = Path.Combine(path, "tuanjieLib", "exported.ets");
        if (!File.Exists(exportedPath))
        {
            Debug.LogWarning("HMSBuildProcessor: exported.ets not found, skip HMSMessageBind export.");
            return;
        }

        string text = File.ReadAllText(exportedPath);
        if (text.Contains("HMSMessageBind"))
        {
            return;
        }

        const string exportLine = "export { HMSMessageBind } from './src/main/ets/HMSMessageBind.ets';";
        const string marker = "// declare all exported classes in plugin";
        int markerIndex = text.IndexOf(marker, StringComparison.Ordinal);
        if (markerIndex >= 0)
        {
            int lineEnd = text.IndexOf('\n', markerIndex);
            if (lineEnd < 0)
            {
                text += "\n" + exportLine + "\n";
            }
            else
            {
                text = text.Insert(lineEnd + 1, exportLine + "\n");
            }
        }
        else
        {
            text = text.TrimEnd() + "\n" + exportLine + "\n";
        }

        File.WriteAllText(exportedPath, text);
        Debug.Log("HMSBuildProcessor: added HMSMessageBind export to exported.ets");
    }

    private void PatchEntryIndexForHmsMessageBind(string path)
    {
        string indexPath = Path.Combine(path, "entry", "src", "main", "ets", "pages", "Index.ets");
        if (!File.Exists(indexPath))
        {
            Debug.LogWarning("HMSBuildProcessor: entry Index.ets not found, skip host glue patch.");
            return;
        }

        string text = File.ReadAllText(indexPath);
        if (text.Contains("HMSMessageBind.bindWithRetry"))
        {
            Debug.Log("HMSBuildProcessor: Index.ets already contains HMSMessageBind glue.");
            return;
        }

        const string oldImport = "import { APP_KEY_SAFEAREA_RECT, APP_KEY_NAVIGATION_MARGIN, Tuanjie } from 'tuanjieLib';";
        const string newImport = "import { APP_KEY_SAFEAREA_RECT, APP_KEY_NAVIGATION_MARGIN, Tuanjie, SetToGlobalThis, HMSMessageBind } from 'tuanjieLib';";
        if (text.Contains(oldImport))
        {
            text = text.Replace(oldImport, newImport);
        }
        else if (!text.Contains("HMSMessageBind") || !text.Contains("SetToGlobalThis"))
        {
            Debug.LogWarning("HMSBuildProcessor: unexpected Index.ets import, glue patch may be incomplete.");
        }

        const string aboutToAppearBlock =
            "  aboutToAppear() {\n" +
            "    // 1.10 classesLib no longer SetToGlobalThis('UIContext'); login UI needs it.\n" +
            "    SetToGlobalThis('UIContext', this.getUIContext());\n" +
            "    // 1.10 WorkerProxy no longer calls SDKManager.InitMessageBind.\n" +
            "    HMSMessageBind.bindWithRetry();\n" +
            "  }\n" +
            "\n";

        const string buildAnchor = "  build() {";
        if (!text.Contains(buildAnchor))
        {
            Debug.LogError("HMSBuildProcessor: cannot find build() in Index.ets, skip aboutToAppear patch.");
            return;
        }

        if (!text.Contains("aboutToAppear()"))
        {
            text = text.Replace(buildAnchor, aboutToAppearBlock + buildAnchor);
        }
        else
        {
            Debug.LogWarning("HMSBuildProcessor: Index.ets already has aboutToAppear; please merge HMSMessageBind manually.");
            return;
        }

        File.WriteAllText(indexPath, text);
        Debug.Log("HMSBuildProcessor: patched entry Index.ets for HMSMessageBind / UIContext.");
    }

    /**
     * 默认需要修改的文件
     */
    private void DefaultRecodeFile(string path)
    {
        ModifyHvigorConfig(path);
        ModifyBuildProfile(path);
    }

    /// <summary>
    /// 导出后回写 signingConfigs。路径优先 Player Settings；密码优先
    /// <c>Local/OpenHarmonySigning.local.json</c>（gitignore，DevEco 密文），否则用会话明文。
    /// 团结 Export 会写出空密码骨架，因此始终覆盖 app.signingConfigs。
    /// </summary>
    private void EnsureSigningConfigs(string path)
    {
        if (!TryResolveOpenHarmonySigningConfig(out Dictionary<string, object> signingConfig, out string source))
        {
            return;
        }

        string buildProfilePath = Path.Combine(path, "build-profile.json5");
        if (!File.Exists(buildProfilePath))
        {
            Debug.LogWarning("HMSBuildProcessor: build-profile.json5 not found, skip signingConfigs.");
            return;
        }

        try
        {
            JObject root = JObject.Parse(File.ReadAllText(buildProfilePath));
            JToken app = root["app"];
            if (app == null || app.Type != JTokenType.Object)
            {
                Debug.LogWarning("HMSBuildProcessor: build-profile.json5 missing app object, skip signingConfigs.");
                return;
            }

            ((JObject)app)["signingConfigs"] = new JArray
            {
                JObject.FromObject(signingConfig)
            };
            File.WriteAllText(buildProfilePath, root.ToString(Formatting.Indented) + "\n");
            Debug.Log("HMSBuildProcessor: wrote signingConfigs from " + source + ".");
        }
        catch (Exception e)
        {
            Debug.LogError("HMSBuildProcessor: failed to write signingConfigs: " + e.Message);
        }
    }

    private static string LocalSigningSecretsPath =>
        Path.Combine(Directory.GetParent(Application.dataPath).FullName, "Local", "OpenHarmonySigning.local.json");

    private static bool TryResolveOpenHarmonySigningConfig(
        out Dictionary<string, object> signingConfig,
        out string source)
    {
        signingConfig = null;
        source = null;

        JObject secrets = LoadLocalSigningSecrets();
        // 路径：Player Settings 优先；密码：本地 secrets（DevEco 密文）优先，避免把 Editor 会话明文写进工程
        string storeFile = ResolveProjectPath(
            FirstNonEmpty(PlayerSettings.OpenHarmony.keystoreName, secrets?["storeFile"]?.ToString()));
        string storePassword = FirstNonEmpty(secrets?["storePassword"]?.ToString(), PlayerSettings.OpenHarmony.keystorePass);
        string keyAlias = FirstNonEmpty(PlayerSettings.OpenHarmony.keyaliasName, secrets?["keyAlias"]?.ToString());
        string keyPassword = FirstNonEmpty(secrets?["keyPassword"]?.ToString(), PlayerSettings.OpenHarmony.keyaliasPass);
        string profile = ResolveProjectPath(
            FirstNonEmpty(PlayerSettings.OpenHarmony.openHarmonyProfile, secrets?["profile"]?.ToString()));
        string certpath = ResolveProjectPath(
            FirstNonEmpty(PlayerSettings.OpenHarmony.openHarmonyCertificate, secrets?["certpath"]?.ToString()));
        string signAlg = FirstNonEmpty(secrets?["signAlg"]?.ToString(), "SHA256withECDSA");

        if (string.IsNullOrEmpty(storeFile) ||
            string.IsNullOrEmpty(storePassword) ||
            string.IsNullOrEmpty(keyAlias) ||
            string.IsNullOrEmpty(keyPassword) ||
            string.IsNullOrEmpty(profile) ||
            string.IsNullOrEmpty(certpath))
        {
            Debug.LogWarning(
                "HMSBuildProcessor: signing material incomplete. Fill Player Settings paths, and either enter " +
                "session passwords or create Local/OpenHarmonySigning.local.json (see OpenHarmonySigning.local.json.example).");
            return false;
        }

        bool passwordFromSecrets = secrets != null &&
                                   !string.IsNullOrEmpty(secrets["storePassword"]?.ToString());
        source = passwordFromSecrets
            ? "Local/OpenHarmonySigning.local.json (+ Player Settings paths)"
            : "Player Settings (plaintext session passwords)";

        signingConfig = new Dictionary<string, object>
        {
            ["name"] = "default",
            ["type"] = "HarmonyOS",
            ["material"] = new Dictionary<string, object>
            {
                ["storeFile"] = storeFile,
                ["storePassword"] = storePassword,
                ["keyAlias"] = keyAlias,
                ["keyPassword"] = keyPassword,
                ["profile"] = profile,
                ["certpath"] = certpath,
                ["signAlg"] = signAlg
            }
        };
        return true;
    }

    private static string ResolveProjectPath(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return value;
        }

        const string inProjectPrefix = "{inproject}:";
        string path = value.Trim();
        if (path.StartsWith(inProjectPrefix, StringComparison.OrdinalIgnoreCase))
        {
            path = path.Substring(inProjectPrefix.Length).Trim();
        }

        if (Path.IsPathRooted(path))
        {
            return path;
        }

        string projectRoot = Directory.GetParent(Application.dataPath).FullName;
        return Path.GetFullPath(Path.Combine(projectRoot, path));
    }

    private static JObject LoadLocalSigningSecrets()
    {
        string path = LocalSigningSecretsPath;
        if (!File.Exists(path))
        {
            return null;
        }

        try
        {
            return JObject.Parse(File.ReadAllText(path));
        }
        catch (Exception e)
        {
            Debug.LogError("HMSBuildProcessor: invalid Local/OpenHarmonySigning.local.json: " + e.Message);
            return null;
        }
    }

    private static string FirstNonEmpty(params string[] values)
    {
        foreach (string value in values)
        {
            if (!string.IsNullOrEmpty(value))
            {
                return value;
            }
        }

        return null;
    }

    /**
     * build-profile.json5 配置项修改
     */
    private void ModifyBuildProfile(string path)
    {
        Debug.Log("ModifyBuildProfile" + path);
        EnsureSigningConfigs(path);
        FileOperator foBuildProfile = new FileOperator(path + "/build-profile.json5");

        if (TJVersion < new Version("1.4.0"))
        {
            foBuildProfile.ReplaceString(" \"compileSdkVersion\": 10,", "");
            foBuildProfile.ReplaceString(" \"compatibleSdkVersion\": 10", "");
            foBuildProfile.ReplaceString(" \"compileSdkVersion\": 11,", "");
            foBuildProfile.ReplaceString(" \"compatibleSdkVersion\": 11", "");
            foBuildProfile.ReplaceString(" \"compileSdkVersion\": 12,", "");
            foBuildProfile.ReplaceString(" \"compatibleSdkVersion\": 12", "");

            string buildProfileDefaultContent = "\"signingConfig\": \"default\"";
            StringBuilder buildProfileNewContent = new("        " + buildProfileDefaultContent);
            buildProfileNewContent.Append(",");
            buildProfileNewContent.Append("\n");
            buildProfileNewContent.Append("        \"compatibleSdkVersion\": \"" + CompatibleSdkVersion + "\",");

            buildProfileNewContent.Append("\n");
            buildProfileNewContent.Append("        \"runtimeOS\": \"HarmonyOS\",");

            foBuildProfile.ReplaceString(buildProfileDefaultContent, buildProfileNewContent.ToString());
        }
        else
        {
            string buildProfileDefaultContent = "\"compatibleSdkVersion\": \"" + CompatibleSdkVersion + "\"";
            StringBuilder buildProfileNewContent = new("        " + buildProfileDefaultContent);
            string newJsonPart = @",
        ""buildOption"": {
        ""strictMode"": {
            ""useNormalizedOHMUrl"": true
          }
        },";
            buildProfileNewContent.Append(newJsonPart);
            if (!string.IsNullOrEmpty(TargetSdkVersion))
            {
                buildProfileNewContent.Append("\n");
                buildProfileNewContent.Append("        \"targetSdkVersion\": \"" + TargetSdkVersion + "\",");

            }

            foBuildProfile.ReplaceString(buildProfileDefaultContent, buildProfileNewContent.ToString());
        }
    }


    /**
     * hvigor-config.json5 配置项修改
     */
    private void ModifyHvigorConfig(string path)
    {
        // Version version = new(Application.tuanjieVersion);
        FileOperator foHvigorConfig = new FileOperator(path + "/hvigor/hvigor-config.json5");
        if (CompatibleSdkVersion.StartsWith("5.0.0"))
        {
            string hvigorVersionDefault = "\"hvigorVersion\": \"3.0.9\",";
            string modelVersion = "\"modelVersion\": \"5.0.0\",";
            foHvigorConfig.ReplaceString(hvigorVersionDefault, modelVersion);

            string hvigorPluginDefault = "\"@ohos/hvigor-ohos-plugin\": \"3.0.9\"";
            foHvigorConfig.ReplaceString(hvigorPluginDefault, "");

            FileOperator foOhPackage = new FileOperator(path + "/oh-package.json5");
            string licenseDefault = "\"license\": \"ISC\",";
            foOhPackage.ReplaceString(licenseDefault, "   " + modelVersion + "\n   " + licenseDefault);

        }
        else
        {
            string hvigorVersionDefault = "\"hvigorVersion\": \"3.0.9\",";
            string hvigorVersionNew = "  \"hvigorVersion\": \"file:../dependencies/hvigor-3.0.9-s.tgz\",";
            foHvigorConfig.ReplaceString(hvigorVersionDefault, hvigorVersionNew);

            string hvigorPluginDefault = "\"@ohos/hvigor-ohos-plugin\": \"3.0.9\"";
            StringBuilder hvigorPluginNew =
                new StringBuilder(
                    "    \"@ohos/hvigor-ohos-plugin\": \"file:../dependencies/hvigor-ohos-plugin-3.0.9-s.tgz\",");
            hvigorPluginNew.Append("\n");
            hvigorPluginNew.Append("    \"rollup\": \"file:../dependencies/rollup.tgz\"");
            foHvigorConfig.ReplaceString(hvigorPluginDefault, hvigorPluginNew.ToString());

            // 移动hvigor依赖库（外网放开hvigor下载后可以删除）
            string oldPath = path + "/entry/src/main/resources/rawfile/Data/StreamingAssets/dependencies";
            string newPath = path + "/dependencies";
            FileOperator.MoveDirectory(oldPath, newPath);
        }


    }

    /**
     * FMOD自定义修改的文件
     */
    private void CustomRecodeFile(string path)
    {
        ModifyMainWorker(path);
        // ModifyWorkerHandler(path);
        ModifyAppJson5(path);
        ModifyModuleJson5(path);

        AddDependencies(path);
    }

    /**
     * TuanjieMainWorker.cs 新增import和消息监听代码
     */
    private void ModifyMainWorker(string path)
    {
        string filePath;
        if (TJVersion < new Version("1.5.0"))
        {
            filePath = path + "/entry/src/main/ets/workers/TuanjieMainWorker.ets";
        }
        else
        {
            filePath = path + "/tuanjieLib/src/main/ets/workers/WorkerProxy.ets";
        }

        if (!File.Exists(filePath)) return;
        FileOperator foOhPackage = new FileOperator(filePath);
        // 增加import内容
        string[] importLines = { "import { SDKManager } from '../RXInterface';" };
        foOhPackage.InsertImports(importLines);
        // 在Onmessage声明方法后面绑定增量AddListener
        // string initMessageBindContent = "SDKManager.InitMessageBind(this.threadWorker);";
        // 找到内容插入的位置
        string afterFunction = "this.threadWorker.onmessage = (msg)";
        bool findAnchor = false;
        bool findInsertPos = false;
        int bracesCount = 0;
        string[] codes = File.ReadAllLines(filePath);
        string[] codesNew = new string[codes.Length + 1];
        int index;
        for (index = 0; index < codes.Length; index++)
        {
            if (!findInsertPos)
            {
                codesNew[index] = codes[index];
            }
            else
            {
                codesNew[index] = "    SDKManager.InitMessageBind(this.threadWorker);";
                break;
            }

            if (findAnchor)
            {
                bracesCount += CountSymbolInLine('{', codes[index]);
                bracesCount -= CountSymbolInLine('}', codes[index]);

                if (bracesCount == 0)
                {
                    findInsertPos = true;
                    findAnchor = false;
                }

                continue;
            }

            // 找到方法入口，开始计数大括号，直到方法结束
            if (codes[index].Contains(afterFunction))
            {
                findAnchor = true;
                if (codes[index].Contains("{")) bracesCount++;
            }
        }

        for (int i = index + 1; i < codes.Length + 1; i++)
        {
            codesNew[i] = codes[i - 1];
        }

        File.WriteAllLines(filePath, codesNew);

    }

    private int CountSymbolInLine(char symbol, string lineContent)
    {
        IEnumerable<char> stringQuery =
            from ch in lineContent
            where ch.Equals(symbol)
            select ch;
        return stringQuery.Count();
    }

    /**
     * TuanjieMainWorkerHandler.cs 新增消息监听代码
     */
    private void ModifyWorkerHandler(string path)
    {
        FileOperator foOhPackage = new FileOperator(path + "/entry/src/main/ets/workers/TuanjieMainWorkerHandler.ets");
        foOhPackage.InsertImports(new[] { "import { SDKManager } from '../RXInterface';';" });
        string[] workerHandlerMessageContents =
        {
            "    case \"syncHMSSDKResult\":", "      SDKManager.HMSSDKSyncToWorker(data.data_type, data.data)",
            "      break;"
        };
        foOhPackage.InsertBeforeLineContent("default:", workerHandlerMessageContents);


        string initMessageBindContent = "SDKManager.InitMessageBind(this.threadWorker);";
        // 找到内容插入的位置
        string afterFunction = "this.threadWorker.onmessage = function (msg)";
    }

    /**
     * app.json5：包名取自 Player Settings → Application Identifier (OpenHarmony)
     */
    private void ModifyAppJson5(string path)
    {
        string appJson5FilePath = path + "/AppScope/app.json5";
        string jsonIn = File.ReadAllText(appJson5FilePath);
        var dictionary = JsonConvert.DeserializeObject<Dictionary<string, Dictionary<string, object>>>(jsonIn);
        dictionary["app"]["bundleName"] = PlayerSettings.GetApplicationIdentifier(BuildTargetGroup.OpenHarmony);
        string jsonOut = JsonConvert.SerializeObject(dictionary, Formatting.Indented);
        File.WriteAllText(appJson5FilePath, jsonOut);
    }

    /**
     * module.json5：app_id / client_id 取自 Player Settings → OpenHarmony
     */
    private void ModifyModuleJson5(string path)
    {
        string moduleJson5FilePath = path + "/entry/src/main/module.json5";
        string jsonIn = File.ReadAllText(moduleJson5FilePath);

        JObject jsonData = JObject.Parse(jsonIn);

        JArray metadataList = (JArray)jsonData["module"]["metadata"];
        JArray abilities = (JArray)jsonData["module"]["abilities"];

        foreach (JObject ability in abilities)
        {
            if (ability.ContainsKey("srcEntrance"))
            {
                string srcEntranceValue = (string)ability["srcEntrance"];
                ability["srcEntry"] = srcEntranceValue;
                ability.Remove("srcEntrance");
                ability["orientation"] = "auto_rotation_landscape";
            }
        }

        metadataList.Add(new JObject
        {
            ["name"] = "app_id",
            ["value"] = PlayerSettings.OpenHarmony.openHarmonyAppID
        });

        metadataList.Add(new JObject
        {
            ["name"] = "client_id",
            ["value"] = PlayerSettings.OpenHarmony.openHarmonyClientID
        });

        string jsonOut = jsonData.ToString(Formatting.Indented);

        File.WriteAllText(moduleJson5FilePath, jsonOut);

    }

    /**
 *  oh-package.json5 配置项修改
 */
    private void AddDependencies(string path)
    {

        if (dependencyMap.Count == 0)
        {
            return;
        }

        FileOperator foOhPackage = new FileOperator(path + "/entry/oh-package.json5");
        StringBuilder replaceString = new StringBuilder("\"dependencies\": {");
        foreach (var dependency in dependencyMap)
        {
            replaceString.Append("\n");
            replaceString.Append("  \"" + dependency.Key + "\": \"" + dependency.Value + "\"");
        }

        replaceString.Append("\n");
        replaceString.Append("}");
        Debug.Log(replaceString.ToString());
        foOhPackage.ReplaceString("\"dependencies\": {}", replaceString.ToString());
    }

    private void ModifyRXWebView(string path)
    {
        string moudle;
        if (TJVersion < new Version("1.5.0"))
        {
            moudle = "entry";
        }
        else
        {
            moudle = "tuanjieLib";
        }

        {
            var pPath = path + $"/{moudle}/src/main/ets/pages/TuanjiePlayerAbilityIndex.ets";
            var import = "import { RXWebViewComponent } from '../RXWebViewComponent'";
            if (!File.Exists(pPath))
            {
                pPath = path + $"/{moudle}/src/main/ets/pages/components/TuanjiePlayerView.ets";
                import = "import { RXWebViewComponent } from '../../RXWebViewComponent'";

            }

            FileOperator foOhPackage = new(pPath);

            foOhPackage.InsertImports(new[] { import });

            string[] workerHandlerMessageContents =
            {
                "          RXWebViewComponent();"
            };
            foOhPackage.InsertBeforeLineContent("StaticSplashScreen()", workerHandlerMessageContents);
        }

        if (TJVersion < new Version("1.5.0"))
        {
            FileOperator foOhPackage = new(path + $"/{moudle}/src/main/ets/workers/TuanjieMainworker.ets");
            foOhPackage.InsertImports(new[] { "import { RXWebViewMainThreadWorker } from '../RXWebViewMainThreadWorker';" });
            string[] workerHandlerMessageContents =
            {
                "    RXWebViewMainThreadWorker.InitMessageBind(this.threadWorker);"
            };
            foOhPackage.InsertBeforeLineContent("SDKManager.InitMessageBind(this.threadWorker);", workerHandlerMessageContents);
        }

    }

    private void CopyWebViewImages(string path)
    {
        string resImgPath = string.Empty;
        string[] guids = AssetDatabase.FindAssets("rx_service_back");

        foreach (string guid in guids)
        {
            string assetPath = AssetDatabase.GUIDToAssetPath(guid);
            resImgPath = Application.dataPath + "/" + assetPath.Substring("Assets".Length);
            Debug.Log("Full path of the img: " + resImgPath);
        }

        if (string.IsNullOrEmpty(resImgPath))
            return;

        string pngFolder = Directory.GetParent(resImgPath).FullName;
        Debug.Log("pngFolder: " + pngFolder);
        string targetDir = path + "/AppScope/resources/base/media/";
        string[] pngFiles = Directory.GetFiles(pngFolder, "*.png");
        foreach (string pngFile in pngFiles)
        {
            string fileName = Path.GetFileName(pngFile);
            string destFile = Path.Combine(targetDir, fileName);
            File.Copy(pngFile, destFile, true);
        }

        Debug.Log("Copy img success");
    }
}