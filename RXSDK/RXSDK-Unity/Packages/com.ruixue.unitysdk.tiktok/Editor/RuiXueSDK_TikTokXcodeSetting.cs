using System.IO;
using UnityEditor;
using UnityEngine;
#if UNITY_EDITOR
public class RuiXueSDK_TikTokXcodeSetting : ScriptableObject
{
   public static string AssetPath = "Assets/RuiXueSettings/RuiXueSDK_TikTokXcodeSetting.asset";

   public string TikTokAppID;
   public string PrivacyPhotoLibraryUsageDescription= "是否允许访问相册？";
}

public class RuiXueSDK_TikTokXCodeSettingMenu : MonoBehaviour
{
   [MenuItem("瑞雪SDK/XCode Settings/TikTok")]
   static void OpenIOSTikTokSetting()
   {
      string path = RuiXueSDK_TikTokXcodeSetting.AssetPath;
      var scriptableObject = AssetDatabase.LoadAssetAtPath<RuiXueSDK_TikTokXcodeSetting>(path);
      
      if (scriptableObject == null)
      {
         string dir = $"{Application.dataPath}/RuiXueSettings";
         if (!Directory.Exists(dir))
         {
            Directory.CreateDirectory(dir);
         }
         
         scriptableObject = ScriptableObject.CreateInstance<RuiXueSDK_TikTokXcodeSetting>();
         AssetDatabase.CreateAsset(scriptableObject, path);
         AssetDatabase.SaveAssets();
         AssetDatabase.Refresh();
      }
   
      Selection.activeObject = scriptableObject;
   }
}
#endif