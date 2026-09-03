using System.IO;
using UnityEditor;
using UnityEngine;
#if UNITY_EDITOR
public class RuiXueSDK_AdjustXcodeSetting : ScriptableObject
{
   public static string AssetPath = "Assets/RuiXueSettings/RuiXueSDK_AdjustXcodeSetting.asset";

   [Header("填写 Adjust 控制台的 App Token")]
   public string AppToken;
   [Header("Adjust 运行环境：production 正式 / sandbox 测试")]
   public string Environment = "production";
}

public class RuiXueSDK_AdjustXCodeSettingMenu : MonoBehaviour
{
   [MenuItem("瑞雪SDK/XCode Settings/Adjust")]
   static void OpenAdjustSetting()
   {
      string path = RuiXueSDK_AdjustXcodeSetting.AssetPath;
      var scriptableObject = AssetDatabase.LoadAssetAtPath<RuiXueSDK_AdjustXcodeSetting>(path);

      if (scriptableObject == null)
      {
         string dir = $"{Application.dataPath}/RuiXueSettings";
         if (!Directory.Exists(dir))
         {
            Directory.CreateDirectory(dir);
         }

         scriptableObject = ScriptableObject.CreateInstance<RuiXueSDK_AdjustXcodeSetting>();
         AssetDatabase.CreateAsset(scriptableObject, path);
         AssetDatabase.SaveAssets();
         AssetDatabase.Refresh();
      }

      Selection.activeObject = scriptableObject;
   }
}
#endif
