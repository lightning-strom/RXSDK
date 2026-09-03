using System.IO;
using UnityEditor;
using UnityEngine;
#if UNITY_EDITOR
public class RuiXueSDK_FirebaseXcodeSetting : ScriptableObject
{
   public static string AssetPath = "Assets/RuiXueSettings/RuiXueSDK_FirebaseXcodeSetting.asset";

   [Header("Firebase 配置就绪标记（由 MCP firebase_config 写入，1 表示已配置）")]
   public int ConfigReady;
}

public class RuiXueSDK_FirebaseXCodeSettingMenu : MonoBehaviour
{
   [MenuItem("瑞雪SDK/XCode Settings/Firebase")]
   static void OpenFirebaseSetting()
   {
      string path = RuiXueSDK_FirebaseXcodeSetting.AssetPath;
      var scriptableObject = AssetDatabase.LoadAssetAtPath<RuiXueSDK_FirebaseXcodeSetting>(path);

      if (scriptableObject == null)
      {
         string dir = $"{Application.dataPath}/RuiXueSettings";
         if (!Directory.Exists(dir))
         {
            Directory.CreateDirectory(dir);
         }

         scriptableObject = ScriptableObject.CreateInstance<RuiXueSDK_FirebaseXcodeSetting>();
         AssetDatabase.CreateAsset(scriptableObject, path);
         AssetDatabase.SaveAssets();
         AssetDatabase.Refresh();
      }

      Selection.activeObject = scriptableObject;
   }
}
#endif
