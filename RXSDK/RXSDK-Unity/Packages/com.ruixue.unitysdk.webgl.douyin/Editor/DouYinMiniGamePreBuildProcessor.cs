using System.IO;
using RuiXue.RuiXueBase.Editor;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;

#if UNITY_WEBGL
public class DouYinMinGamePreBuildProcessor: IPreprocessBuildWithReport
{
    const string SDKFOLDER = "RXJsSdk_DouYin";
    const string DSTFOLDER = "RXJsSdk_DouYin_Clone";
    public int callbackOrder => 1;
    public void OnPreprocessBuild(BuildReport report)
    {
        var streamingAssetsPath = AssetDatabase.FindAssets("StreamingAssets");
        
        if (streamingAssetsPath.Length == 0)
        {
            Debug.Log("创建 StreamingAssets");
            Directory.CreateDirectory("Assets/StreamingAssets");
        }
        
        var cpJsFilesPath = AssetDatabase.FindAssets("__cp_js_files");
        
        if (cpJsFilesPath.Length == 0)
        {
            Debug.Log("创建 __cp_js_files");
            Directory.CreateDirectory("Assets/StreamingAssets/__cp_js_files");
        }
        
        var douyinJsSdkPath = AssetDatabase.FindAssets($"{SDKFOLDER}");
        
        var sdkPath = AssetDatabase.GUIDToAssetPath(douyinJsSdkPath[0]);
        ProcessorFileUtil.CopyDirectory(sdkPath, 
            "Assets/StreamingAssets/__cp_js_files");
    }
}

#endif