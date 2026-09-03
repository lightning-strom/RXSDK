using System.IO;
using UnityEditor;
using UnityEngine;
#if UNITY_EDITOR
public class RuiXueSDK_LineXcodeSetting : ScriptableObject
{
   public static string AssetPath = "Assets/RuiXueSettings/RuiXueSDK_LineXcodeSetting.asset";
   
   public string ChannelID;
}

public class RuiXueSDK_LineXCodeSettingMenu : MonoBehaviour
{
   [MenuItem("瑞雪SDK/XCode Settings/Line")]
   static void OpenIOSSetting()
   {
      string path = RuiXueSDK_LineXcodeSetting.AssetPath;
      var scriptableObject = AssetDatabase.LoadAssetAtPath<RuiXueSDK_LineXcodeSetting>(path);
      
      if (scriptableObject == null)
      {
         string dir = $"{Application.dataPath}/RuiXueSettings";
         if (!Directory.Exists(dir))
         {
            Directory.CreateDirectory(dir);
         }
         
         scriptableObject = ScriptableObject.CreateInstance<RuiXueSDK_LineXcodeSetting>();
         AssetDatabase.CreateAsset(scriptableObject, path);
         AssetDatabase.SaveAssets();
         AssetDatabase.Refresh();
      }
   
      Selection.activeObject = scriptableObject;
   }
}
#endif