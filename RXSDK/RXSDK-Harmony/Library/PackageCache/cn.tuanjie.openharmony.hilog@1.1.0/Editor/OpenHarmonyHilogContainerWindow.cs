using UnityEngine;
using UnityEditor;
using System;
using System.Diagnostics;
using static Tuanjie.OpenHarmony.Hilog.EditorGUIBridge;
using System.Reflection;

namespace Tuanjie.OpenHarmony.Hilog
{
    /// <summary>
    /// In charge of all GUI views and windows of the "OpenHarmony Hilog"
    /// Singleton class
    /// </summary>
    public class OpenHarmonyHilogContainerWindow
    {
        private static OpenHarmonyHilogContainerWindow m_Instance;

        internal static OpenHarmonyHilogContainerWindow ContainerWindow 
        {
            get
            {
                return m_Instance;
            }
        }

        // A containerWindow consists of several Views(SplitView)
        // A SplitView consists of several DockAreas
        // A DockerAreas consists of several EditorWindows
        private object w_ContainerViewInstance;
        private object w_SplitViewInstance;
        private object w_DockAreaInstance;

        private object w_DeviceInfoDockAreaInstance;

        internal OpenHarmonyHilogDeviceInfoWindow w_HilogDeviceInfoWindow;
        internal OpenHarmonyHilogConsoleWindow w_HilogConsoleWindow;
        internal OpenHarmonyHilogStacktraceWindow w_HilogStacktraceWindow;
        //internal OpenHarmonyHilogMemoryWindow w_HilogMemoryViewer;
        internal OpenHarmonyHilogPerformanceWindow w_HilogPerformanceViewer;
        internal OpenHarmonyHilogArkUIWindow w_HilogArkUIWindow;

        internal OpenHarmonyHilogConsoleWindowData w_HilogConsoleWindowData;
        //internal OpenHarmonyHilogMemoryWindowData w_HilogMemoryWindowData;
        internal OpenHarmonyHilogPerformanceMemoryData w_HilogPerformanceMemoryData;

        internal OpenHarmonyHilogRuntimeBase m_Runtime;

        internal bool m_ApplySettings;

        internal bool hasDockerToggle = false;

        private bool Init()
        {
            if (!OpenHarmonyBridge.OpenHarmonyExtensionsInstalled)
                return false;
            try
            {
                OpenHarmonyHilogInternalLog.Log("OnEnable");
                m_Runtime.Settings.OnSettingsChanged -= OnSettingsChanged;
                m_Runtime.Settings.OnSettingsChanged += OnSettingsChanged;
                m_ApplySettings = true;

                w_ContainerViewInstance = EditorContainerWindow.CreateInstance();
                w_SplitViewInstance = EditorSplitView.CreateInstance();

                try
                {
                    w_DockAreaInstance = EditorDockAreaWithToggle.CreateInstance();
                    w_DeviceInfoDockAreaInstance = EditorDockArea.CreateInstance();
                    EditorDockAreaWithToggle.SetExtraToggle(w_DockAreaInstance, OpenHarmonyHilogStyles.kSimulator_DeviceInfo, "Device Info", new Rect(0, 0, 20, 20));
                    hasDockerToggle = true;
                }
                catch (Exception e)
                {
                    w_DockAreaInstance = EditorDockArea.CreateInstance();
                    hasDockerToggle = false;
                }

                w_HilogConsoleWindowData = new OpenHarmonyHilogConsoleWindowData();
                //w_HilogMemoryWindowData = new OpenHarmonyHilogMemoryWindowData(m_Runtime);

                w_HilogPerformanceMemoryData = new OpenHarmonyHilogPerformanceMemoryData(m_Runtime);

                w_HilogConsoleWindow = ScriptableObject.CreateInstance<OpenHarmonyHilogConsoleWindow>();
                w_HilogConsoleWindow.PostInstantiation(w_HilogConsoleWindowData);
                w_HilogStacktraceWindow = ScriptableObject.CreateInstance<OpenHarmonyHilogStacktraceWindow>();
                w_HilogStacktraceWindow.PostInstantiation();
                //w_HilogMemoryViewer = ScriptableObject.CreateInstance<OpenHarmonyHilogMemoryWindow>();
                //w_HilogMemoryViewer.PostInstantiation(w_HilogMemoryWindowData);
                w_HilogPerformanceViewer = ScriptableObject.CreateInstance<OpenHarmonyHilogPerformanceWindow>();
                w_HilogPerformanceViewer.PostInstantiation(w_HilogPerformanceMemoryData);
                w_HilogArkUIWindow = ScriptableObject.CreateInstance<OpenHarmonyHilogArkUIWindow>();
                w_HilogArkUIWindow.PostInstantiation();
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log($"Exception while initiate the GUI window of Openharmony Hilog :\n{ex.Message}");
            }

            return true;
        }

        private void ShowContainerWindow()
        {
            if (hasDockerToggle)
            {
                EditorDockAreaWithToggle.SetPosition(w_DockAreaInstance, new Rect(0, 0, 200, 800));

                EditorDockAreaWithToggle.AddTab(w_DockAreaInstance, w_HilogConsoleWindow);
                EditorDockAreaWithToggle.AddTab(w_DockAreaInstance, w_HilogStacktraceWindow);
                //EditorDockAreaWithToggle.AddTab(w_DockAreaInstance, w_HilogMemoryViewer);
                EditorDockAreaWithToggle.AddTab(w_DockAreaInstance, w_HilogPerformanceViewer);
                EditorDockAreaWithToggle.AddTab(w_DockAreaInstance, w_HilogArkUIWindow);

                MethodInfo info = GetType().GetMethod("ToggleDeviceInfo", BindingFlags.Instance | BindingFlags.Public, null, new Type[] { typeof(bool) }, null);

                EditorDockAreaWithToggle.SetToggleCallbackFunc(w_DockAreaInstance, this, info);
            }
            else
            {
                EditorDockArea.SetPosition(w_DockAreaInstance, new Rect(0, 0, 200, 800));

                EditorDockArea.AddTab(w_DockAreaInstance, w_HilogConsoleWindow);
                EditorDockArea.AddTab(w_DockAreaInstance, w_HilogStacktraceWindow);
                //EditorDockArea.AddTab(w_DockAreaInstance, w_HilogMemoryViewer);
                EditorDockArea.AddTab(w_DockAreaInstance, w_HilogPerformanceViewer);
                EditorDockArea.AddTab(w_DockAreaInstance, w_HilogArkUIWindow);
            }

            EditorSplitView.AddChild(w_SplitViewInstance, w_DockAreaInstance);

            float width = 800;
            float height = 800;

            var main = EditorMainView.CreateInstance();
            EditorMainView.SetUseTopView(main, true);
            EditorMainView.SetUseBottomView(main, false);
            EditorMainView.SetTopViewHeight(main, 30f);
            EditorMainView.SetBottomViewHeight(main, 30f);

            var centerViewHeight = height - 30f;
            EditorViewView.SetPosition(w_SplitViewInstance, new Rect(0, 30f, width, centerViewHeight));
            EditorMainView.AddChild(main, w_SplitViewInstance);

            EditorContainerWindow.SetRootView(w_ContainerViewInstance, main);
            EditorContainerWindow.SetRootViewPosition(w_ContainerViewInstance, new Rect(0, 0, width, height));
            EditorContainerWindow.Show(w_ContainerViewInstance, 2, true, false, false);
            EditorContainerWindow.DisplayAllViews(w_ContainerViewInstance);
            EditorContainerWindow.OnResize(w_ContainerViewInstance);
        }

        public void ToggleDeviceInfo(bool newStatus)
        {
            if (newStatus)
            {
                w_HilogDeviceInfoWindow = ScriptableObject.CreateInstance<OpenHarmonyHilogDeviceInfoWindow>();
                w_HilogDeviceInfoWindow.PostInstantiation();
                w_HilogDeviceInfoWindow.minSize = new Vector2(400, 600);

                w_HilogDeviceInfoWindow.dockerWithButtonRef = w_DockAreaInstance;

                w_DeviceInfoDockAreaInstance = EditorDockArea.CreateInstance();
                
                EditorDockArea.AddTab(w_DeviceInfoDockAreaInstance, w_HilogDeviceInfoWindow);
                EditorSplitView.AddChild(w_SplitViewInstance, w_DeviceInfoDockAreaInstance);

                EditorContainerWindow.Show(w_ContainerViewInstance, 2, true, false, false);
                EditorContainerWindow.DisplayAllViews(w_ContainerViewInstance);
                EditorContainerWindow.OnResize(w_ContainerViewInstance);

                w_HilogDeviceInfoWindow.Focus();
            }
            else
            {
                if(w_HilogDeviceInfoWindow != null)
                    w_HilogDeviceInfoWindow.Close();
            }
        }

        [MenuItem("Window/Analysis/OpenHarmony Hilog &7")]
        private static void OpenWindow()
        {
            if (m_Instance == null)
                m_Instance = new OpenHarmonyHilogContainerWindow();

            m_Instance.m_Runtime = OpenHarmonyHilogManager.instance.Runtime;
            if (m_Instance.m_Runtime == null)
                return;
            if (m_Instance.Init())
                m_Instance.ShowContainerWindow();

            m_Instance.w_HilogConsoleWindow.Focus();
        }

        //Check if "OpenHarmonyHilogSettings" changes.
        private void OnSettingsChanged(OpenHarmonyHilogSettings settings)
        {
            m_ApplySettings = true;
        }

        //If "Auto Run" is enabled.
        internal static void ShowNewOrExisting(bool autoSelectPackage)
        {
            if (m_Instance == null)
                m_Instance = new OpenHarmonyHilogContainerWindow();

            m_Instance.m_Runtime = OpenHarmonyHilogManager.instance.Runtime;
            if (m_Instance.m_Runtime == null)
                return;
            if(!m_Instance.m_Runtime.StaticData.ShowDuringBuildRun)
                return;
            if (m_Instance.Init())
                m_Instance.ShowContainerWindow();

            m_Instance.w_HilogConsoleWindow.Focus();
            m_Instance.w_HilogConsoleWindow.AutoSelectProcess = autoSelectPackage;
        }

        private OpenHarmonyHilogContainerWindow()
        {
        }
    }
}
