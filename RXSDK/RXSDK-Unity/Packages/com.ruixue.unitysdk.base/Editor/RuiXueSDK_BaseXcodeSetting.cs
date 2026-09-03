using System.IO;
using UnityEditor;
using UnityEngine;

#if UNITY_EDITOR
public class RuiXueSDK_BaseXcodeSetting : ScriptableObject
{
   public static string AssetPath = "Assets/RuiXueSettings/RuiXueSDK_BaseXcodeSetting.asset";
   
   public string PrivacyTrackingUsageDescription = "此标识符将用于向您推荐个性化广告。";
}

public class RuiXueSDK_BaseXCodeSettingMenu : MonoBehaviour
{
   [MenuItem("瑞雪SDK/XCode Settings/基础必填(IDFA权限描述)",false, 0)]
   static void OpenIOSSetting()
   {
      string path = RuiXueSDK_BaseXcodeSetting.AssetPath;
      var scriptableObject = AssetDatabase.LoadAssetAtPath<RuiXueSDK_BaseXcodeSetting>(path);
      
      if (scriptableObject == null)
      {
         string dir = $"{Application.dataPath}/RuiXueSettings";
         if (!Directory.Exists(dir))
         {
            Directory.CreateDirectory(dir);
         }
         
         scriptableObject = ScriptableObject.CreateInstance<RuiXueSDK_BaseXcodeSetting>();
         AssetDatabase.CreateAsset(scriptableObject, path);
         AssetDatabase.SaveAssets();
         AssetDatabase.Refresh();
      }
   
      Selection.activeObject = scriptableObject;
   }
}
#endif