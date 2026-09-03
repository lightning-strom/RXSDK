using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using UnityEditor;
using UnityEngine;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using LitJson;
using UnityEditor.Callbacks;


public class HMSBuildProcessor : IPostprocessBuildWithReport, IPreprocessBuildWithReport
{
    readonly string compatibleSdkVersion = "5.0.0(12)";

    public int callbackOrder
    {
        get { return 10; }
    }
    private Version TJVersion { get {
#if UNITY_OPENHARMONY
            return new Version(Application.tuanjieVersion);
#else
            return new Version("0.0.0");
#endif
        } }

    private Dictionary<string, string> dependencyMap = new Dictionary<string, string>();

    /**
    * build 构建完成后回调
    */

    public void OnPostprocessBuild(BuildReport report)
    {
#if UNITY_OPENHARMONY
        if (report.summary.platform == BuildTarget.OpenHarmony)
        {
            //修改文件
            DefaultRecodeFile(report.summary.outputPath);
            CustomRecodeFile(report.summary.outputPath);

            ModifyRXWebView(report.summary.outputPath);
            // CopyWebViewImages(report.summary.outputPath);
        }
#endif
    }

    /**
    * build 构建开始前回调
    */
    public void OnPreprocessBuild(BuildReport report)
    {
#if UNITY_OPENHARMONY
        if (report.summary.platform == BuildTarget.OpenHarmony)
        {
            CheckHasSettingFile();
        }
#endif
    }

    private bool CheckHasSettingFile()
    {
        string filePath = HMSBuildSetting.settingFilePath;
        if (!File.Exists(filePath))
        {
            Debug.LogError(
                "Failed to automatically add configuration items because the setting file is incorrectly configured. Manually modify related configuration items later.");

            return false;
        }
        else
        {
            return true;
        }
    }

    /**
     * 默认需要修改的文件
     */
    private void DefaultRecodeFile(string path)
    {
        ModifyHvigorConfig(path);
        ModifyBuildProfile(path);
    }

    /**
     * build-profile.json5 配置项修改
     */
    private void ModifyBuildProfile(string path)
    {
        Debug.Log("ModifyBuildProfile" + path);
        FileOperator foBuildProfile = new FileOperator(path + "/build-profile.json5");

        HMSBuildSettingItem item = AssetDatabase.LoadAssetAtPath<HMSBuildSettingItem>(HMSBuildSetting.settingFilePath);
        if (!string.IsNullOrEmpty(item.storePassword) &&
            !string.IsNullOrEmpty(item.certpath) &&
            !string.IsNullOrEmpty(item.keyPassword) &&
            !string.IsNullOrEmpty(item.keyAlias) &&
            !string.IsNullOrEmpty(item.profile) &&
            !string.IsNullOrEmpty(item.signAlg) &&
            !string.IsNullOrEmpty(item.storeFile)
        )
        {
            Dictionary<string, object> dictionary = new();
            Dictionary<string, object> material = new()
            {
                ["storePassword"] = item.storePassword,
                ["certpath"] = item.certpath,
                ["keyPassword"] = item.keyPassword,
                ["keyAlias"] = item.keyAlias,
                ["profile"] = item.profile,
                ["signAlg"] = item.signAlg,
                ["storeFile"] = item.storeFile
            };
            dictionary["material"] = material;
            dictionary["name"] = "default";
            dictionary["type"] = "HarmonyOS";
            JsonWriter jw1 = new()
            {
                PrettyPrint = true
            };

            JsonMapper.ToJson(dictionary, jw1);
            foBuildProfile.ReplaceString("\"signingConfigs\": [],", $"\"signingConfigs\":[{jw1.TextWriter}],");
        }

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
            buildProfileNewContent.Append("        \"compatibleSdkVersion\": \"" + compatibleSdkVersion + "\",");
            buildProfileNewContent.Append("\n");
            buildProfileNewContent.Append("        \"runtimeOS\": \"HarmonyOS\",");

            foBuildProfile.ReplaceString(buildProfileDefaultContent, buildProfileNewContent.ToString());
        }
        else
        {
            string buildProfileDefaultContent = "\"compatibleSdkVersion\": \"5.0.0(12)\"";
            StringBuilder buildProfileNewContent = new("        " + buildProfileDefaultContent);
            string newJsonPart = @",
        ""buildOption"": {
        ""strictMode"": {
            ""useNormalizedOHMUrl"": true
        }
        }";
            buildProfileNewContent.Append(newJsonPart);

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
        if (compatibleSdkVersion.StartsWith("5.0.0"))
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
        string filePath = path + "/entry/src/main/ets/workers/TuanjieMainWorker.ets";
        if (!File.Exists(filePath)) return;
        FileOperator foOhPackage = new FileOperator(filePath);
        // 增加import内容
        string[] importLines = { "import { SDKManager } from '../RXInterface';" };
        foOhPackage.InsertImports(importLines);
        // 在Onmessage声明方法后面绑定增量AddListener
        string initMessageBindContent = "SDKManager.InitMessageBind(this.threadWorker);";
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
     * app.json5 修改app包名数据，可在HMSSetting中修改
     */
    private void ModifyAppJson5(string path)
    {
        string appJson5FilePath = path + "/AppScope/app.json5";
        string jsonIn = File.ReadAllText(appJson5FilePath);
        Dictionary<string, Dictionary<string, object>> dictionary =
            JsonMapper.ToObject<Dictionary<string, Dictionary<string, object>>>(jsonIn);
        HMSBuildSettingItem item = AssetDatabase.LoadAssetAtPath<HMSBuildSettingItem>(HMSBuildSetting.settingFilePath);
        dictionary["app"]["bundleName"] = item.bundle_name;
        string jsonOut = JsonMapper.ToJson(dictionary);
        File.WriteAllText(appJson5FilePath, jsonOut);
    }

    /**
     * module.json5 修改appId/clientId，可在HMSSetting中修改
     */
    private void ModifyModuleJson5(string path)
    {
        HMSBuildSettingItem item = AssetDatabase.LoadAssetAtPath<HMSBuildSettingItem>(HMSBuildSetting.settingFilePath);
        string moduleJson5FilePath = path + "/entry/src/main/module.json5";
        string jsonIn = File.ReadAllText(moduleJson5FilePath);
        JsonData jsonData = JsonMapper.ToObject(jsonIn);
        JsonData metadataList = jsonData["module"]["metadata"];
        JsonData abilities = jsonData["module"]["abilities"];
        foreach (JsonData ability in abilities)
        {
            if (ability.ContainsKey("srcEntrance"))
            {
                string srcEntranceValue = ability["srcEntrance"].ToString();
                ability["srcEntry"] = srcEntranceValue;
                ability.Remove("srcEntrance");
                ability["orientation"] = "auto_rotation_landscape";

            }
        }
        JsonData appIdDataObj = new JsonData();
        appIdDataObj.SetJsonType(JsonType.Object);
        appIdDataObj["name"] = "app_id";
        appIdDataObj["value"] = item.app_id;
        metadataList.Add(appIdDataObj);
        JsonData clientIdDataObj = new JsonData();
        clientIdDataObj.SetJsonType(JsonType.Object);
        clientIdDataObj["name"] = "client_id";
        clientIdDataObj["value"] = item.client_id;
        metadataList.Add(clientIdDataObj);
        JsonWriter jw1 = new()
        {
            PrettyPrint = true
        };
        jsonData.ToJson(jw1);
        // string jsonOut = JsonMapper.ToJson(jsonData);
        File.WriteAllText(moduleJson5FilePath, jw1.TextWriter.ToString());
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
        {
            var p = path + "/entry/src/main/ets/pages/TuanjiePlayerAbilityIndex.ets";
            var import = "import { RXWebViewComponent } from '../RXWebViewComponent'";
            if (!File.Exists(p))
            {
                p = path + "/entry/src/main/ets/pages/components/TuanjiePlayerView.ets";
                import = "import { RXWebViewComponent } from '../../RXWebViewComponent'";

            }

            FileOperator foOhPackage = new FileOperator(p);

            foOhPackage.InsertImports(new[] { import });

            string[] workerHandlerMessageContents =
            {
                "          RXWebViewComponent();"
            };
            foOhPackage.InsertBeforeLineContent("StaticSplashScreen()", workerHandlerMessageContents);
        }

        {
            FileOperator foOhPackage = new FileOperator(path + "/entry/src/main/ets/workers/TuanjieMainworker.ets");
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