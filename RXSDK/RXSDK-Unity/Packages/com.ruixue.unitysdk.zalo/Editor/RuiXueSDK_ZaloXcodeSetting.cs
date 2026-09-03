using System.IO;
using UnityEditor;
using UnityEngine;
#if UNITY_EDITOR
public class RuiXueSDK_ZaloXcodeSetting : ScriptableObject
{
   public static string AssetPath = "Assets/RuiXueSettings/RuiXueSDK_ZaloXcodeSetting.asset";

   public string zaloAppID;
}

public class RuiXueSDK_ZaloXCodeSettingMenu : MonoBehaviour
{
   [MenuItem("瑞雪SDK/XCode Settings/Zalo")]
   static void OpenIOSZaloSetting()
   {
      string path = RuiXueSDK_ZaloXcodeSetting.AssetPath;
      var scriptableObject = AssetDatabase.LoadAssetAtPath<RuiXueSDK_ZaloXcodeSetting>(path);
      
      if (scriptableObject == null)
      {
         string dir = $"{Application.dataPath}/RuiXueSettings";
         if (!Directory.Exists(dir))
         {
            Directory.CreateDirectory(dir);
         }
         
         scriptableObject = ScriptableObject.CreateInstance<RuiXueSDK_ZaloXcodeSetting>();
         AssetDatabase.CreateAsset(scriptableObject, path);
         AssetDatabase.SaveAssets();
         AssetDatabase.Refresh();
      }
   
      Selection.activeObject = scriptableObject;
   }
}
#endif