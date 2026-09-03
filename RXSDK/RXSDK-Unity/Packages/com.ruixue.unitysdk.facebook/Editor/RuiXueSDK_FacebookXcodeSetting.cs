using System.IO;
using UnityEditor;
using UnityEngine;
#if UNITY_EDITOR
public class RuiXueSDK_FacebookXcodeSetting : ScriptableObject
{
   public static string AssetPath = "Assets/RuiXueSettings/RuiXueSDK_FacebookXcodeSetting.asset";

   public string FbId;
   public string FacebookAppID;
   public string FacebookClientToken;
}

public class RuiXueSDK_FacebookXCodeSettingMenu : MonoBehaviour
{
   [MenuItem("瑞雪SDK/XCode Settings/Facebook")]
   static void OpenIOSFacebookSetting()
   {
      string path = RuiXueSDK_FacebookXcodeSetting.AssetPath;
      var scriptableObject = AssetDatabase.LoadAssetAtPath<RuiXueSDK_FacebookXcodeSetting>(path);
      
      if (scriptableObject == null)
      {
         string dir = $"{Application.dataPath}/RuiXueSettings";
         if (!Directory.Exists(dir))
         {
            Directory.CreateDirectory(dir);
         }
         
         scriptableObject = ScriptableObject.CreateInstance<RuiXueSDK_FacebookXcodeSetting>();
         AssetDatabase.CreateAsset(scriptableObject, path);
         AssetDatabase.SaveAssets();
         AssetDatabase.Refresh();
      }
   
      Selection.activeObject = scriptableObject;
   }
}
#endif