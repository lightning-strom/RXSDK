using System.IO;
using UnityEditor;
using UnityEngine;
#if UNITY_EDITOR
public class RuiXueSDK_GoogleXcodeSetting : ScriptableObject
{
   public static string AssetPath = "Assets/RuiXueSettings/RuiXueSDK_GoogleXcodeSetting.asset";

   [Header("填写 google 开发后台凭据中 OAuth 2.0 的 客户端 ID")]
   public string GIDClientID;
   [Header("填写 google 开发后台凭据 OAuth 2.0 中的 IOS 网址架构")]
   public string REVERSED_CLIENT_ID;
}

public class RuiXueSDK_GoogleXCodeSettingMenu : MonoBehaviour
{
   [MenuItem("瑞雪SDK/XCode Settings/Google登录")]
   static void OpenIOSSetting()
   {
      string path = RuiXueSDK_GoogleXcodeSetting.AssetPath;
      var scriptableObject = AssetDatabase.LoadAssetAtPath<RuiXueSDK_GoogleXcodeSetting>(path);
      
      if (scriptableObject == null)
      {
         string dir = $"{Application.dataPath}/RuiXueSettings";
         if (!Directory.Exists(dir))
         {
            Directory.CreateDirectory(dir);
         }
         
         scriptableObject = ScriptableObject.CreateInstance<RuiXueSDK_GoogleXcodeSetting>();
         AssetDatabase.CreateAsset(scriptableObject, path);
         AssetDatabase.SaveAssets();
         AssetDatabase.Refresh();
      }
   
      Selection.activeObject = scriptableObject;
   }
}
#endif