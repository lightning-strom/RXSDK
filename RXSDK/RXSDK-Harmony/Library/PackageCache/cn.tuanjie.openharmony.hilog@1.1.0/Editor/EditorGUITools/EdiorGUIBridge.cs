using System;
using System.Reflection;
using UnityEngine;
using UnityEditor;
using Object = System.Object;

namespace Tuanjie.OpenHarmony.Hilog
{
    /// <summary>
    /// Provides dynamic way of accessing classes under UnityEditor
    /// Enable to construct an interface containing several "EditorWindow"s as tabs
    /// </summary>
    internal class EditorGUIBridge
    {
        private static Assembly EditorAssembly = typeof(EditorWindow).Assembly;

        //Reflection of UnityEditor.ContainerWindow
        internal class EditorContainerWindow
        {
            private static Type s_ContainerWindowType;
            private static PropertyInfo s_RootViewPropertyInfo;
            private static PropertyInfo s_RootViewPositionPropertyInfo;
            private static MethodInfo s_ShowMethodInfo;
            private static MethodInfo s_DisplayAllViewsMethodInfo;
            private static MethodInfo s_OnResizeMethodInfo;
            private Object m_ContainerWindowObject;

            private static Type UnderlyingType
            {
                get
                {
                    if (s_ContainerWindowType != null)
                        return s_ContainerWindowType;
                    s_ContainerWindowType = EditorAssembly.GetType("UnityEditor.ContainerWindow");
                    if (s_ContainerWindowType == null)
                        throw new Exception("Failed to locate ContainerWindow type");
                    return s_ContainerWindowType;
                }
            }

            internal System.Object UnderlyingObject => m_ContainerWindowObject;

            internal static object CreateInstance()
            {
                return ScriptableObject.CreateInstance(UnderlyingType);
            }

            private static PropertyInfo RootViewPropertyInfo
            {
                get
                {
                    if (s_RootViewPropertyInfo != null)
                        return s_RootViewPropertyInfo;
                    s_RootViewPropertyInfo = UnderlyingType.GetProperty("rootView", BindingFlags.Instance | BindingFlags.Public);
                    return s_RootViewPropertyInfo;
                }
            }

            public static void SetRootView(object instance, object value)
            {
                if (RootViewPropertyInfo == null) 
                    return;
                RootViewPropertyInfo.SetValue(instance, value);
            }

            private static PropertyInfo RootViewPositionPropertyInfo
            {
                get
                {
                    if (s_RootViewPositionPropertyInfo != null)
                        return s_RootViewPositionPropertyInfo;
                    s_RootViewPositionPropertyInfo = RootViewPropertyInfo.PropertyType.GetProperty("position", BindingFlags.Instance | BindingFlags.Public);
                    return s_RootViewPositionPropertyInfo;
                }
            }

            public static void SetRootViewPosition(object instance, Rect value)
            {
                if (s_RootViewPropertyInfo == null || RootViewPositionPropertyInfo == null) return;
                RootViewPositionPropertyInfo.SetValue(s_RootViewPropertyInfo.GetValue(instance), value);
            }

            private static MethodInfo ShowMethodInfo
            {
                get
                {
                    if (s_ShowMethodInfo != null)
                        return s_ShowMethodInfo;
                    s_ShowMethodInfo = UnderlyingType.GetMethod("Show", BindingFlags.Public | BindingFlags.Instance, null,
                        new Type[]
                        {
                            EditorAssembly.GetType("UnityEditor.ShowMode"), typeof(bool), typeof(bool), typeof(bool)
                        }, null);
                    return s_ShowMethodInfo;
                }
            }

            public static void Show(object instance, int showMode, bool loadPosition, bool displayImmediately, bool setFocus)
            {
                if (ShowMethodInfo == null) 
                    return;
                ShowMethodInfo.Invoke(instance, new object[] { showMode, loadPosition, displayImmediately, setFocus });
            }

            private static MethodInfo DisplayAllViewsMethodInfo
            {
                get
                {
                    if (s_DisplayAllViewsMethodInfo != null)
                        return s_DisplayAllViewsMethodInfo;
                    s_DisplayAllViewsMethodInfo = UnderlyingType.GetMethod("DisplayAllViews", BindingFlags.Public | BindingFlags.Instance, null,
                        new Type[] { }, null);
                    return s_DisplayAllViewsMethodInfo;
                }
            }

            public static void DisplayAllViews(object instance)
            {
                if (DisplayAllViewsMethodInfo == null) 
                    return;
                DisplayAllViewsMethodInfo.Invoke(instance, null);
            }

            private static MethodInfo OnResizeMethodInfo
            {
                get
                {
                    if (s_OnResizeMethodInfo != null)
                        return s_OnResizeMethodInfo;
                    s_OnResizeMethodInfo = UnderlyingType.GetMethod("OnResize", BindingFlags.Public | BindingFlags.Instance);
                    return s_OnResizeMethodInfo;
                }
            }


            public static void OnResize(object instance)
            {
                if (OnResizeMethodInfo == null) 
                    return;
                OnResizeMethodInfo.Invoke(instance, null);
            }
        }

        //Reflection of UnityEditor.SplitView
        internal class EditorSplitView
        {
            private static Type s_SplitViewType;
            private static MethodInfo s_AddChildMethodInfo;
            private static MethodInfo s_RemoveChildNiceMethodInfo;
            private Object m_ContainerWindowObject;

            private static Type UnderlyingType
            {
                get
                {
                    if (s_SplitViewType != null)
                        return s_SplitViewType;
                    s_SplitViewType = EditorAssembly.GetType("UnityEditor.SplitView");
                    if (s_SplitViewType == null)
                        throw new Exception("Failed to locate SplitView type");
                    return s_SplitViewType;
                }
            }

            internal System.Object UnderlyingObject => m_ContainerWindowObject;

            internal static object CreateInstance()
            {
                return ScriptableObject.CreateInstance(UnderlyingType);
            }

            private static MethodInfo AddChildMethodInfo
            {
                get
                {
                    if (s_AddChildMethodInfo != null)
                        return s_AddChildMethodInfo;
                    s_AddChildMethodInfo = UnderlyingType.GetMethod("AddChild", BindingFlags.Public | BindingFlags.Instance, null,
                        new Type[] { typeof(EditorWindow).Assembly.GetType("UnityEditor.View") }, null);
                    return s_AddChildMethodInfo;
                }
            }

            private static MethodInfo RemoveChildMethodInfo
            {
                get
                {
                    if (s_RemoveChildNiceMethodInfo != null)
                        return s_RemoveChildNiceMethodInfo;
                    s_RemoveChildNiceMethodInfo = UnderlyingType.GetMethod("RemoveChild", BindingFlags.Public | BindingFlags.Instance, null,
                        new Type[] { typeof(EditorWindow).Assembly.GetType("UnityEditor.View") }, null);
                    return s_RemoveChildNiceMethodInfo;
                }
            }

            //Add a DockArea as child of SplitView
            public static void AddChild(object instance, object view)
            {
                if (AddChildMethodInfo == null) 
                    return;
                AddChildMethodInfo.Invoke(instance, new object[] { view });
            }

            public static void RemoveChild(object instance, object view)
            {
                if (RemoveChildMethodInfo == null)
                    return;
                RemoveChildMethodInfo.Invoke(instance, new object[] { view });
            }
        }

        //Reflection of UnityEditor.DockArea
        internal class EditorDockArea
        {
            private static Type s_DockAreaType;
            private static MethodInfo s_AddTabMethodInfo;
            private static PropertyInfo s_PositionPropertyInfo;
            private Object m_ContainerWindowObject;
            
            private static Type UnderlyingType
            {
                get
                {
                    if (s_DockAreaType != null)
                        return s_DockAreaType;
                    s_DockAreaType = EditorAssembly.GetType("UnityEditor.DockArea");
                    if (s_DockAreaType == null)
                        throw new Exception("Failed to locate DockArea type");
                    return s_DockAreaType;
                }
            }

            internal System.Object UnderlyingObject => m_ContainerWindowObject;

            internal static object CreateInstance()
            {
                return ScriptableObject.CreateInstance(UnderlyingType);
            }

            private static MethodInfo AddTabMethodInfo
            {
                get
                {
                    if (s_AddTabMethodInfo != null)
                        return s_AddTabMethodInfo;
                    s_AddTabMethodInfo = UnderlyingType.GetMethod("AddTab", BindingFlags.Instance | BindingFlags.Public, null,
                        new Type[] { typeof(EditorWindow), typeof(bool) }, null);
                    return s_AddTabMethodInfo;
                }
            }

            /// <summary>
            /// Add Tab(EditorWindow)
            /// </summary>
            /// <param name="instance"></param>
            /// <param name="window"></param>
            /// <param name="sendPaneEvents"></param>
            public static void AddTab(object instance, EditorWindow window, bool sendPaneEvents = true)
            {
                if (AddTabMethodInfo == null) 
                    return;
                AddTabMethodInfo.Invoke(instance, new object[] { window, sendPaneEvents });
            }

            private static PropertyInfo PositionPropertyInfo
            {
                get
                {
                    if (s_PositionPropertyInfo != null)
                        return s_PositionPropertyInfo;
                    s_PositionPropertyInfo = UnderlyingType.GetProperty("position", BindingFlags.Instance | BindingFlags.Public);
                    return s_PositionPropertyInfo;
                }
            }

            /// <summary>
            /// Set Tab Position
            /// </summary>
            /// <param name="instance"></param>
            /// <param name="position"></param>
            public static void SetPosition(object instance, Rect position)
            {
                if (PositionPropertyInfo == null) 
                    return;
                PositionPropertyInfo.SetValue(instance, position);
            }
        }

        internal class EditorDockAreaWithToggle
        {
            private static Type s_DockAreaType;
            private static MethodInfo s_AddTabMethodInfo;
            private static MethodInfo s_SetExtraToggleInfo;

            private static MethodInfo s_SetToggleStatusInfo;
            private static MethodInfo s_GetToggleStatusInfo;

            private static MethodInfo s_SetToggleCallback;

            private static PropertyInfo s_PositionPropertyInfo;
            private Object m_ContainerWindowObject;

            private static Type UnderlyingType
            {
                get
                {
                    if (s_DockAreaType != null)
                        return s_DockAreaType;
                    s_DockAreaType = EditorAssembly.GetType("UnityEditor.DockAreaWithToggle");
                    if (s_DockAreaType == null)
                        throw new Exception("Failed to locate DockArea type");
                    return s_DockAreaType;
                }
            }

            internal System.Object UnderlyingObject => m_ContainerWindowObject;

            internal static object CreateInstance()
            {
                return ScriptableObject.CreateInstance(UnderlyingType);
            }

            private static MethodInfo AddTabMethodInfo
            {
                get
                {
                    if (s_AddTabMethodInfo != null)
                        return s_AddTabMethodInfo;
                    s_AddTabMethodInfo = UnderlyingType.GetMethod("AddTab", BindingFlags.Instance | BindingFlags.Public, null,
                        new Type[] { typeof(EditorWindow), typeof(bool) }, null);
                    return s_AddTabMethodInfo;
                }
            }

            private static MethodInfo ExtraToggleInfo
            {
                get
                {
                    if (s_SetExtraToggleInfo != null)
                        return s_SetExtraToggleInfo;
                    s_SetExtraToggleInfo = UnderlyingType.GetMethod("SetExtraToggle", BindingFlags.Instance | BindingFlags.Public, null,
                        new Type[] { typeof(Texture), typeof(string), typeof(Rect) }, null);
                    return s_SetExtraToggleInfo;
                }
            }

            private static MethodInfo SetToggleStatusInfo
            {
                get
                {
                    if (s_SetToggleStatusInfo != null)
                        return s_SetToggleStatusInfo;
                    s_SetToggleStatusInfo = UnderlyingType.GetMethod("SetToggleStatus", BindingFlags.Instance | BindingFlags.Public, null,
                        new Type[] { typeof(bool) }, null);
                    return s_SetToggleStatusInfo;
                }
            }

            private static MethodInfo GetToggleStatusInfo
            {
                get
                {
                    if (s_GetToggleStatusInfo != null)
                        return s_GetToggleStatusInfo;
                    s_GetToggleStatusInfo = UnderlyingType.GetMethod("SetToggleStatus", BindingFlags.Instance | BindingFlags.Public, null,
                        new Type[] { }, null);
                    return s_GetToggleStatusInfo;
                }
            }

            private static MethodInfo SetToggleCallback
            {
                get
                {
                    if (s_SetToggleCallback != null)
                        return s_SetToggleCallback;
                    s_SetToggleCallback = UnderlyingType.GetMethod("SetToggleCallback", BindingFlags.Instance | BindingFlags.Public, null,
                        new Type[] { typeof(Object), typeof(MethodInfo) }, null);
                    return s_SetToggleCallback;
                }
            }

            /// <summary>
            /// Add Tab(EditorWindow)
            /// </summary>
            /// <param name="instance"></param>
            /// <param name="window"></param>
            /// <param name="sendPaneEvents"></param>
            public static void AddTab(object instance, EditorWindow window, bool sendPaneEvents = true)
            {
                if (AddTabMethodInfo == null)
                    return;
                AddTabMethodInfo.Invoke(instance, new object[] { window, sendPaneEvents });
            }

            /// <summary>
            /// SetExtraButton (EditorWindow)
            /// </summary>
            /// <param name="instance"></param>
            /// <param name="img"></param>
            /// <param name="toolTip"></param>
            /// <param name="buttonSize"></param>
            public static void SetExtraToggle(object instance, Texture img, string toolTip, Rect buttonSize)
            {
                if (ExtraToggleInfo == null)
                    return;
                ExtraToggleInfo.Invoke(instance, new object[] { img, toolTip, buttonSize });
            }

            public static void SetToggleStatus(object instance, bool newStatus)
            {
                if (SetToggleStatusInfo == null)
                    return;
                SetToggleStatusInfo.Invoke(instance, new object[] { newStatus });
            }

            public static bool GetToggleStatus(object instance, bool newStatus)
            {
                if (GetToggleStatusInfo == null)
                    return false;
                return (bool)GetToggleStatusInfo.Invoke(instance, new object[] { });
            }

            public static void SetToggleCallbackFunc(object instance1, object instance2, MethodInfo callback)
            {
                if(SetToggleCallback == null)
                {
                    return;
                }

                SetToggleCallback.Invoke(instance1, new object[] { instance2, callback });
            }

            private static PropertyInfo PositionPropertyInfo
            {
                get
                {
                    if (s_PositionPropertyInfo != null)
                        return s_PositionPropertyInfo;
                    s_PositionPropertyInfo = UnderlyingType.GetProperty("position", BindingFlags.Instance | BindingFlags.Public);
                    return s_PositionPropertyInfo;
                }
            }

            /// <summary>
            /// Set Tab Position
            /// </summary>
            /// <param name="instance"></param>
            /// <param name="position"></param>
            public static void SetPosition(object instance, Rect position)
            {
                if (PositionPropertyInfo == null)
                    return;
                PositionPropertyInfo.SetValue(instance, position);
            }
        }

        //Reflection of UnityEditor.MainView
        internal class EditorMainView

        {
            private static Type s_MainViewType;
            private static PropertyInfo s_UseTopViewPropertyInfo;
            private static PropertyInfo s_UseBottomViewPropertyInfo;
            private static PropertyInfo s_TopViewHeightPropertyInfo;
            private static PropertyInfo s_BottomViewHeightPropertyInfo;
            private static MethodInfo s_AddChildMethodInfo;
            private Object m_MainViewObject;

            private static Type UnderlyingType
            {
                get
                {
                    if (s_MainViewType != null)
                        return s_MainViewType;
                    s_MainViewType = EditorAssembly.GetType("UnityEditor.MainView");
                    if (s_MainViewType == null)
                        throw new Exception("Failed to locate ContainerWindow type");
                    return s_MainViewType;
                }
            }

            internal System.Object UnderlyingObject => m_MainViewObject;

            internal static object CreateInstance()
            {
                return ScriptableObject.CreateInstance(UnderlyingType);
            }

            private static PropertyInfo UseTopViewPropertyInfo
            {
                get
                {
                    if (s_UseTopViewPropertyInfo != null)
                        return s_UseTopViewPropertyInfo;
                    s_UseTopViewPropertyInfo = UnderlyingType.GetProperty("useTopView", BindingFlags.Instance | BindingFlags.Public);
                    return s_UseTopViewPropertyInfo;
                }
            }

            //Use Top GUI element
            public static void SetUseTopView(object instance, object value)
            {
                if (UseTopViewPropertyInfo == null)
                    return;
                UseTopViewPropertyInfo.SetValue(instance, value);
            }

            private static PropertyInfo UseBottomViewPropertyInfo
            {
                get
                {
                    if (s_UseBottomViewPropertyInfo != null)
                        return s_UseBottomViewPropertyInfo;
                    s_UseBottomViewPropertyInfo = UnderlyingType.GetProperty("useBottomView", BindingFlags.Instance | BindingFlags.Public);
                    return s_UseBottomViewPropertyInfo;
                }
            }

            //Use Bottom GUI element
            public static void SetUseBottomView(object instance, object value)
            {
                if (UseBottomViewPropertyInfo == null)
                    return;
                UseBottomViewPropertyInfo.SetValue(instance, value);
            }

            private static PropertyInfo TopViewHeightPropertyInfo
            {
                get
                {
                    if (s_TopViewHeightPropertyInfo != null)
                        return s_TopViewHeightPropertyInfo;
                    s_TopViewHeightPropertyInfo = UnderlyingType.GetProperty("topViewHeight", BindingFlags.Instance | BindingFlags.Public);
                    return s_TopViewHeightPropertyInfo;
                }
            }

            public static void SetTopViewHeight(object instance, object value)
            {
                if (TopViewHeightPropertyInfo == null)
                    return;
                TopViewHeightPropertyInfo.SetValue(instance, value);
            }

            private static PropertyInfo BottomViewHeightPropertyInfo
            {
                get
                {
                    if (s_BottomViewHeightPropertyInfo != null)
                        return s_BottomViewHeightPropertyInfo;
                    s_BottomViewHeightPropertyInfo = UnderlyingType.GetProperty("bottomViewHeight", BindingFlags.Instance | BindingFlags.Public);
                    return s_BottomViewHeightPropertyInfo;
                }
            }

            public static void SetBottomViewHeight(object instance, object value)
            {
                if (BottomViewHeightPropertyInfo == null)
                    return;
                BottomViewHeightPropertyInfo.SetValue(instance, value);
            }

            private static MethodInfo AddChildMethodInfo
            {
                get
                {
                    if (s_AddChildMethodInfo != null)
                        return s_AddChildMethodInfo;
                    s_AddChildMethodInfo = UnderlyingType.GetMethod("AddChild", BindingFlags.Instance | BindingFlags.Public, null,
                        new Type[] { typeof(EditorWindow).Assembly.GetType("UnityEditor.View") }, null);
                    return s_AddChildMethodInfo;
                }
            }

            public static void AddChild(object instance, object view)
            {
                if (AddChildMethodInfo == null) 
                    return;
                AddChildMethodInfo.Invoke(instance, new object[] { view });
            }
        }

        //Reflection of UnityEditor.View
        internal class EditorViewView
        {
            private static Type s_ViewType;
            private static PropertyInfo s_PositionPropertyInfo;
            private Object m_ViewObject;

            private static Type UnderlyingType
            {
                get
                {
                    if (s_ViewType != null)
                        return s_ViewType;
                    s_ViewType = EditorAssembly.GetType("UnityEditor.View");
                    if (s_ViewType == null)
                        throw new Exception("Failed to locate ContainerWindow type");
                    return s_ViewType;
                }
            }

            internal System.Object UnderlyingObject => m_ViewObject;
            private static PropertyInfo PositionPropertyInfo
            {
                get
                {
                    if (s_PositionPropertyInfo != null)
                        return s_PositionPropertyInfo;
                    s_PositionPropertyInfo = UnderlyingType.GetProperty("position", BindingFlags.Instance | BindingFlags.Public);
                    return s_PositionPropertyInfo;
                }
            }


            public static void SetPosition(object instance, Rect position)
            {
                if (PositionPropertyInfo == null) 
                    return;
                PositionPropertyInfo.SetValue(instance, position);
            }
        }
    }
}
