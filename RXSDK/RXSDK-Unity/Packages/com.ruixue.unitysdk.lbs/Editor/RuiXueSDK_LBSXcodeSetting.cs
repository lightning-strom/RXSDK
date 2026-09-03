using System.IO;
using UnityEditor;
using UnityEngine;
#if UNITY_EDITOR
public class RuiXueSDK_LBSXcodeSetting : ScriptableObject
{
   public static string AssetPath = "Assets/RuiXueSettings/RuiXueSDK_LBSXcodeSetting.asset";

   public string PrivacyLocationAlwaysUsageDescription= "是否允许访问定位权限？";
   public string PrivacyLocationAlwaysAndWhenInUseUsageDescription = "是否允许访问定位权限？";
   public string PrivacyLocationWhenInUseUsageDescription = "是否允许访问定位权限？";
}

public class RuiXueSDK_LBSXCodeSettingMenu : MonoBehaviour
{
   [MenuItem("瑞雪SDK/XCode Settings/LBS定位")]
   static void OpenIOSSetting()
   {
      string path = RuiXueSDK_LBSXcodeSetting.AssetPath;
      var scriptableObject = AssetDatabase.LoadAssetAtPath<RuiXueSDK_LBSXcodeSetting>(path);
      
      if (scriptableObject == null)
      {
         string dir = $"{Application.dataPath}/RuiXueSettings";
         if (!Directory.Exists(dir))
         {
            Directory.CreateDirectory(dir);
         }
         
         scriptableObject = ScriptableObject.CreateInstance<RuiXueSDK_LBSXcodeSetting>();
         AssetDatabase.CreateAsset(scriptableObject, path);
         AssetDatabase.SaveAssets();
         AssetDatabase.Refresh();
      }
   
      Selection.activeObject = scriptableObject;
   }
}
#endif