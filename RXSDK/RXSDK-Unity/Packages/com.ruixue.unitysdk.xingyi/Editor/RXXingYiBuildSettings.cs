#if UNITY_EDITOR
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;

namespace RuiXue.XingYi.Editor
{
    public sealed class RXXingYiBuildSettings : ScriptableObject
    {
        private const string AssetPath =
            "Assets/RuiXueSettings/RXXingYiBuildSettings.asset";

        [Tooltip("仅在需要星驿支付的 Android 构建中启用")]
        public bool enabled;

        internal static bool IsEnabled()
        {
            RXXingYiBuildSettings settings =
                AssetDatabase.LoadAssetAtPath<RXXingYiBuildSettings>(AssetPath);
            if (settings != null)
            {
                return settings.enabled;
            }

            return EditorBuildSettings.scenes.Any(scene =>
                scene.enabled && scene.path.Contains("RuiXueXingYiDemo"));
        }

        [MenuItem("瑞雪SDK/Android Settings/XingYi", false, 1)]
        private static void OpenSettings()
        {
            RXXingYiBuildSettings settings =
                AssetDatabase.LoadAssetAtPath<RXXingYiBuildSettings>(AssetPath);
            if (settings == null)
            {
                string directory = Path.GetDirectoryName(AssetPath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }
                settings = CreateInstance<RXXingYiBuildSettings>();
                AssetDatabase.CreateAsset(settings, AssetPath);
                AssetDatabase.SaveAssets();
            }
            Selection.activeObject = settings;
        }
    }
}
#endif
