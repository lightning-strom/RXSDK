using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;

public class ExportPackage : MonoBehaviour
{
    private static string GetVersionNumber()
    {
        return RXSDK.RuiXueSdk.GetSdkVersion();
    }

    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

    }

    [MenuItem("Tools/Export Package")]
    public static void ExportUnityPackage()
    {

        string[] assetPaths = new string[]
        {
            "Assets/Plugins",
            "Assets/RXSample",
            "Assets/RXSDK"
        };

        string version = GetVersionNumber();
        string publishDir = "publish";
        if (!Directory.Exists(publishDir))
        {
            Directory.CreateDirectory(publishDir);
        }

        string exportPath = Path.Combine(publishDir, $"rxsdk_harmony_v{version}.unitypackage");

        // 导出 Package
        AssetDatabase.ExportPackage(assetPaths, exportPath, ExportPackageOptions.Recurse);
        UnityEngine.Debug.Log($"Package exported to: {exportPath}");
        // OpenInFinder(exportPath);
    }
    [MenuItem("Tools/Export Steam Package")]
    public static void ExportSteamPackage()
    {
        string[] baseAssetPaths = new string[]
        {
            "Assets/com.rlabrecque.steamworks.net",
            "Assets/RXSDK"
        };

        // 过滤出存在的路径
        var validPaths = new List<string>();
        foreach (var path in baseAssetPaths)
        {
            if (Directory.Exists(path) || File.Exists(path))
            {
                validPaths.Add(path);
            }
            else
            {
                Debug.LogWarning($"Path not found and will be skipped: {path}");
            }
        }

        if (validPaths.Count == 0)
        {
            Debug.LogError("No valid paths found for export");
            return;
        }

        string[] excludePaths = new string[]
        {
            "Assets/RXSDK/Editor"
        };

        var assetPaths = GetFilteredAssetPaths(validPaths.ToArray(), excludePaths);

        if (assetPaths == null || assetPaths.Count == 0)
        {
            Debug.LogError("No valid assets found for export");
            return;
        }

        try
        {
            string version = GetVersionNumber();
            string publishDir = "publish";
            if (!Directory.Exists(publishDir))
            {
                Directory.CreateDirectory(publishDir);
            }

            string exportPath = Path.Combine(publishDir, $"rxsdk_steam_v{version}.unitypackage");

            // 导出 Package
            AssetDatabase.ExportPackage(assetPaths.ToArray(), exportPath, ExportPackageOptions.Recurse);
            Debug.Log($"Steam Package exported to: {exportPath}");
        }
        catch (Exception ex)
        {
            Debug.LogError($"Failed to export package: {ex.Message}");
        }
    }

    private static List<string> GetFilteredAssetPaths(string[] baseAssetPaths, string[] excludePaths)
    {
        var result = new List<string>();

        foreach (var basePath in baseAssetPaths)
        {
            if (File.Exists(basePath))
            {
                if (!ShouldExclude(basePath, excludePaths))
                {
                    result.Add(basePath);
                }
                continue;
            }

            var guids = AssetDatabase.FindAssets("", new[] { basePath });
            foreach (var guid in guids)
            {
                string assetPath = AssetDatabase.GUIDToAssetPath(guid);

                if (!ShouldExclude(assetPath, excludePaths))
                {
                    result.Add(assetPath);
                }
            }
        }
        return result;
    }

    private static bool ShouldExclude(string assetPath, string[] excludePaths)
    {
        foreach (var excludePath in excludePaths)
        {
            if (assetPath.StartsWith(excludePath, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }
        }
        return false;
    }


    // private static void OpenInFinder(string filePath)
    // {
    //     string path = System.IO.Path.GetFullPath(filePath);
    //     System.Diagnostics.Process.Start("open", path); 
    // }
}
