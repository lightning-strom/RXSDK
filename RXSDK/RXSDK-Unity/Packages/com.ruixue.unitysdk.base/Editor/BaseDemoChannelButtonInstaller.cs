#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

namespace RuiXue.Editor
{
    [InitializeOnLoad]
    internal static class BaseDemoChannelButtonInstaller
    {
        private const string BaseScenePath =
            "Assets/Samples/RuiXue.Base/0.1.0/RuiXueBaseDemo/RuiXueBaseDemo.unity";
        private const string ChannelScenePath =
            "Assets/Samples/RuiXue.Base/0.1.0/RuiXueBaseDemo/RuiXueChannelDemo.unity";
        private const string ChannelScriptPath =
            "Assets/Samples/RuiXue.Base/0.1.0/RuiXueBaseDemo/RuiXueChannelDemo.cs";
        private const string LegacyPanelName = "ChannelFunctions";
        private const string NavigationName = "ChannelNavigation";
        private const string ChannelSceneRootName = "RuiXueChannelDemo";

        static BaseDemoChannelButtonInstaller()
        {
            EditorApplication.delayCall += Install;
        }

        [MenuItem("瑞雪SDK/Demo/安装 Base 渠道功能按钮")]
        private static void Install()
        {
            if (AssetDatabase.LoadAssetAtPath<SceneAsset>(BaseScenePath) == null)
                return;

            MonoScript channelScript = AssetDatabase.LoadAssetAtPath<MonoScript>(ChannelScriptPath);
            Type channelDemoType = channelScript?.GetClass();
            if (channelDemoType == null)
            {
                EditorApplication.delayCall += Install;
                return;
            }

            InstallBaseNavigation();
            InstallChannelScene(channelDemoType);
            AddScenesToBuild();
            AssetDatabase.Refresh();
        }

        private static void InstallBaseNavigation()
        {
            Scene scene = OpenScene(BaseScenePath, out bool closeAfterInstall);
            MonoBehaviour demo = scene.GetRootGameObjects()
                .SelectMany(root => root.GetComponentsInChildren<MonoBehaviour>(true))
                .FirstOrDefault(component => component.GetType().Name == "RuiXueBaseDemo");
            if (demo == null)
            {
                if (closeAfterInstall)
                    EditorSceneManager.CloseScene(scene, true);
                return;
            }

            bool hasLegacyPanel = scene.GetRootGameObjects()
                .Any(root => root.name == LegacyPanelName);
            bool hasNavigation = scene.GetRootGameObjects()
                .Any(root => root.name == NavigationName);
            if (!hasLegacyPanel && hasNavigation)
            {
                if (closeAfterInstall)
                    EditorSceneManager.CloseScene(scene, true);
                return;
            }

            DestroyRoot(scene, LegacyPanelName);
            DestroyRoot(scene, NavigationName);
            Transform panel = CreatePanel(scene, NavigationName, 440f);
            AddButton(panel, demo, "渠道功能", "OpenChannelFunctions");

            EditorSceneManager.SaveScene(scene);
            if (closeAfterInstall)
                EditorSceneManager.CloseScene(scene, true);
        }

        private static void InstallChannelScene(Type channelDemoType)
        {
            bool sceneExists =
                AssetDatabase.LoadAssetAtPath<SceneAsset>(ChannelScenePath) != null;
            Scene scene = sceneExists
                ? EditorSceneManager.OpenScene(ChannelScenePath, OpenSceneMode.Additive)
                : EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Additive);
            if (scene.GetRootGameObjects().Any(root => root.name == "ChannelFunctionsScene"))
            {
                EditorSceneManager.CloseScene(scene, true);
                return;
            }

            Component demo = scene.GetRootGameObjects()
                .SelectMany(root => root.GetComponentsInChildren<Component>(true))
                .FirstOrDefault(component => component.GetType() == channelDemoType);
            if (demo == null)
            {
                GameObject demoObject = new GameObject(ChannelSceneRootName);
                SceneManager.MoveGameObjectToScene(demoObject, scene);
                demo = demoObject.AddComponent(channelDemoType);
            }

            if (!scene.GetRootGameObjects().Any(root => root.GetComponent<EventSystem>() != null))
            {
                GameObject eventSystem = new GameObject("EventSystem", typeof(EventSystem),
                    typeof(StandaloneInputModule));
                SceneManager.MoveGameObjectToScene(eventSystem, scene);
            }

            Transform panel = CreatePanel(scene, "ChannelFunctionsScene", 520f);
            AddButton(panel, demo, "初始化瑞雪 SDK", "InitializeSdk");
            AddButton(panel, demo, "初始化百度并展示闪屏", "InitializeBaidu");
            AddButton(panel, demo, "百度登录", "BaiduLogin");
            AddButton(panel, demo, "初始化 MuMu 并展示闪屏", "InitializeMumu");
            AddButton(panel, demo, "显示渠道浮窗", "ShowChannelFloatView");
            AddButton(panel, demo, "隐藏渠道浮窗", "HideChannelFloatView");
            AddButton(panel, demo, "返回 Base Demo", "BackToBaseDemo");

            EditorSceneManager.SaveScene(scene, ChannelScenePath);
            EditorSceneManager.CloseScene(scene, true);
        }

        private static Transform CreatePanel(Scene scene, string canvasName, float width)
        {
            GameObject canvasObject = new GameObject(canvasName, typeof(Canvas),
                typeof(CanvasScaler), typeof(GraphicRaycaster));
            SceneManager.MoveGameObjectToScene(canvasObject, scene);
            Canvas canvas = canvasObject.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.sortingOrder = 100;

            GameObject panel = new GameObject("Panel", typeof(RectTransform), typeof(Image),
                typeof(VerticalLayoutGroup), typeof(ContentSizeFitter));
            panel.transform.SetParent(canvasObject.transform, false);
            RectTransform panelRect = panel.GetComponent<RectTransform>();
            panelRect.anchorMin = new Vector2(1f, 1f);
            panelRect.anchorMax = new Vector2(1f, 1f);
            panelRect.pivot = new Vector2(1f, 1f);
            panelRect.anchoredPosition = new Vector2(-24f, -24f);
            panelRect.sizeDelta = new Vector2(width, 0f);
            panel.GetComponent<Image>().color = new Color(0f, 0f, 0f, 0.75f);

            VerticalLayoutGroup layout = panel.GetComponent<VerticalLayoutGroup>();
            layout.padding = new RectOffset(20, 20, 20, 20);
            layout.spacing = 12f;
            layout.childControlHeight = true;
            layout.childControlWidth = true;
            layout.childForceExpandHeight = false;
            panel.GetComponent<ContentSizeFitter>().verticalFit =
                ContentSizeFitter.FitMode.PreferredSize;
            return panel.transform;
        }

        private static Scene OpenScene(string path, out bool closeAfterInstall)
        {
            Scene scene = SceneManager.GetSceneByPath(path);
            closeAfterInstall = !scene.IsValid() || !scene.isLoaded;
            return closeAfterInstall
                ? EditorSceneManager.OpenScene(path, OpenSceneMode.Additive)
                : scene;
        }

        private static void DestroyRoot(Scene scene, string rootName)
        {
            GameObject root = scene.GetRootGameObjects()
                .FirstOrDefault(item => item.name == rootName);
            if (root != null)
                UnityEngine.Object.DestroyImmediate(root);
        }

        private static void AddScenesToBuild()
        {
            List<EditorBuildSettingsScene> scenes =
                EditorBuildSettings.scenes.ToList();
            if (!scenes.Any(item => item.path == BaseScenePath))
                scenes.Add(new EditorBuildSettingsScene(BaseScenePath, true));
            if (!scenes.Any(item => item.path == ChannelScenePath))
                scenes.Add(new EditorBuildSettingsScene(ChannelScenePath, true));
            EditorBuildSettings.scenes = scenes.ToArray();
        }

        private static void AddButton(Transform parent, UnityEngine.Object target, string text,
            string methodName)
        {
            GameObject buttonObject = DefaultControls.CreateButton(new DefaultControls.Resources());
            buttonObject.name = "Button_" + methodName;
            buttonObject.transform.SetParent(parent, false);
            LayoutElement layout = buttonObject.AddComponent<LayoutElement>();
            layout.preferredHeight = 72f;

            Text label = buttonObject.GetComponentInChildren<Text>();
            label.text = text;
            label.fontSize = 24;

            Button button = buttonObject.GetComponent<Button>();
            SerializedObject serializedButton = new SerializedObject(button);
            SerializedProperty calls = serializedButton.FindProperty(
                "m_OnClick.m_PersistentCalls.m_Calls");
            int index = calls.arraySize;
            calls.InsertArrayElementAtIndex(index);
            SerializedProperty call = calls.GetArrayElementAtIndex(index);
            call.FindPropertyRelative("m_Target").objectReferenceValue = target;
            call.FindPropertyRelative("m_TargetAssemblyTypeName").stringValue =
                target.GetType().AssemblyQualifiedName;
            call.FindPropertyRelative("m_MethodName").stringValue = methodName;
            call.FindPropertyRelative("m_Mode").enumValueIndex = 1;
            call.FindPropertyRelative("m_CallState").enumValueIndex = 2;
            serializedButton.ApplyModifiedPropertiesWithoutUndo();
        }
    }
}
#endif
