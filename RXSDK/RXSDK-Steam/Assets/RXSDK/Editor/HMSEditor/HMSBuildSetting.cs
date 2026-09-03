using UnityEngine;
using UnityEditor;
using System.IO;

public class HMSBuildSetting
{
#if UNITY_EDITOR
    public static string settingFolderPath = "Assets/Plugins/Editor/HMSEditor";
    public static string settingFilePath = settingFolderPath + "/HMSSetting.asset";

    [MenuItem("HMSSetting/EditHMSSetting", priority = 0)]
    public static void EditHMSSetting()
    {
        OpenHMSSetting();
    }
    private static void OpenHMSSetting()
    {
        HMSBuildSettingItem item = null;
        string path = settingFilePath;

        Debug.Log(path);
        if (File.Exists(path))
        {
            item = AssetDatabase.LoadAssetAtPath<HMSBuildSettingItem>(path);
        }
        else
        {
            if (!Directory.Exists(settingFolderPath))
            {
                Directory.CreateDirectory(settingFolderPath);
            }
            // 如果资源不存在，则创建新的ScriptableObject  
            item = ScriptableObject.CreateInstance<HMSBuildSettingItem>();
            AssetDatabase.CreateAsset(item, settingFilePath);
            AssetDatabase.SaveAssets(); // 保存更改  
            AssetDatabase.Refresh(); // 刷新资产数据库  
        }
        Selection.activeObject = item;
    }
#endif
}
