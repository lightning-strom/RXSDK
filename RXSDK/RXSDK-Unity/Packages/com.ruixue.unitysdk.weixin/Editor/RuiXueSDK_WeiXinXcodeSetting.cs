using System.IO;
using UnityEditor;
using UnityEngine;
#if UNITY_EDITOR
public class RuiXueSDK_WeiXinXcodeSetting : ScriptableObject
{
   public static string AssetPath = "Assets/RuiXueSettings/RuiXueSDK_WeiXinXcodeSetting.asset";
   
   public string AppID;
   
   [Header("填写格式为  applinks:{域名}")]
   public string[] AssociatedDomains;
}

public class RuiXueSDK_WeiXinXCodeSettingMenu : MonoBehaviour
{
   [MenuItem("瑞雪SDK/XCode Settings/微信")]
   static void OpenIOSSetting()
   {
      string path = RuiXueSDK_WeiXinXcodeSetting.AssetPath;
      var scriptableObject = AssetDatabase.LoadAssetAtPath<RuiXueSDK_WeiXinXcodeSetting>(path);
      
      if (scriptableObject == null)
      {
         string dir = $"{Application.dataPath}/RuiXueSettings";
         if (!Directory.Exists(dir))
         {
            Directory.CreateDirectory(dir);
         }
         
         scriptableObject = ScriptableObject.CreateInstance<RuiXueSDK_WeiXinXcodeSetting>();
         AssetDatabase.CreateAsset(scriptableObject, path);
         AssetDatabase.SaveAssets();
         AssetDatabase.Refresh();
      }
   
      Selection.activeObject = scriptableObject;
   }
}
#endif