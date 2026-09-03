using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEditor;
using UnityEditor.IMGUI.Controls;

namespace Tuanjie.OpenHarmony.Hilog
{
    //Remaining data after the  "OpenHarmonyHilogConsoleWindow" window is reloaded.
    internal class OpenHarmonyHilogConsoleWindowData
    {
        internal Dictionary<string, Priority> m_TagPriorityOnDevice = new Dictionary<string, Priority>();
        internal OpenHarmonyHilogConsoleWindow.ScrollData m_ScrollData = new OpenHarmonyHilogConsoleWindow.ScrollData();
        internal OpenHarmonyHilogStatusBar m_StatusBar = new OpenHarmonyHilogStatusBar();
        internal SearchField m_SearchField = new SearchField();
    }

    /// <summary>
    /// The interface to show Hilog information
    /// Hilog information can be filtered by tags, priorities, PIDs, texts and regexs.
    /// </summary>
    internal partial class OpenHarmonyHilogConsoleWindow : EditorWindow
    {
        private OpenHarmonyHilogConsoleWindowData m_Data;

        private bool ShowDuringBuildRun;

        private GUIContent kAutoRunText;
        private GUIContent kReconnect;
        private GUIContent kDisconnect;
        private GUIContent kClearButtonText;
        private GUIContent kMatchCase;
        private GUIContent kRegex;

        private OpenHarmonyHilogRuntimeBase m_Runtime;
        private OpenHarmonyHilog m_Hilog;

        private SearchField m_SearchField;
        private OpenHarmonyHilogStatusBar m_StatusBar;

        private DateTime m_TimeOfLastAutoConnectUpdate;
        private DateTime m_TimeOfLastAutoConnectStart;
        private const int kMillisecondsBetweenConsecutiveDeviceChecks = 1000;
        private const int kMillisecondsBetweenConsecutiveAutoConnectChecks = 1000;
        private const int kMillisecondsMaxAutoconnectTimeOut = 5000;

        private bool m_AutoSelectProcess;
        private bool m_FinishedAutoselectingProcess;
        private bool m_RestartHilog = false;
        private bool IsHilogConnected => m_Hilog != null && m_Hilog.IsConnected;

        private ProcessInformation m_SelectedProcess;
        internal ProcessInformation SelectedProcess
        {
            set
            {
                m_SelectedProcess = value;
            }
            get
            {
                return m_SelectedProcess;
            }
        }
        private IOpenHarmonyHilogDevice m_SelectedDevice;
        internal IOpenHarmonyHilogDevice SelectedDevice
        {
            set
            {
                m_SelectedDevice = value;
            }
            get
            {
                return m_SelectedDevice;
            }
        }

        //Last 4 processes of each device.
        private IReadOnlyList<ProcessInformation> ProcessesForSelectedDevice
        {
            get { return m_Runtime.UserSettings.GetKnownProcesses(SelectedDevice); }
        }
        public bool AutoSelectProcess
        {
            set
            {
                m_AutoSelectProcess = value;
                m_FinishedAutoselectingProcess = false;
                m_TimeOfLastAutoConnectStart = DateTime.Now;
                if (m_StatusBar != null && m_AutoSelectProcess)
                    m_StatusBar.Message = "Waiting for '" + PlayerSettings.applicationIdentifier + "'";
            }

            get
            {
                return m_AutoSelectProcess;
            }
        }

        internal void PostInstantiation(OpenHarmonyHilogConsoleWindowData data)
        {
            titleContent = new GUIContent("Hilog");
            m_Data = data;
        }

        internal void OnEnable()
        {
            if (!OpenHarmonyBridge.OpenHarmonyExtensionsInstalled)
                return;

            if (OpenHarmonyHilogContainerWindow.ContainerWindow.m_Runtime == null)
            {
                OpenHarmonyHilogInternalLog.Log("Runtime was already destroyed.");
                return;
            }

            if (OpenHarmonyHilogContainerWindow.ContainerWindow.w_HilogConsoleWindowData == null)
            {
                OpenHarmonyHilogInternalLog.Log("ConsoleWindowData was already destroyed.");
                return;
            }

            m_Data = m_Data ?? OpenHarmonyHilogContainerWindow.ContainerWindow.w_HilogConsoleWindowData;
            m_Runtime = m_Runtime ?? OpenHarmonyHilogContainerWindow.ContainerWindow.m_Runtime;

            m_Runtime.UserSettings.Tags.TagSelectionChanged += TagSelectionChanged;
            m_Runtime.Update += OnUpdate;
            m_Runtime.DeviceQuery.DeviceSelected += OnSelectedDevice;
            // Since Runtime.OnDisable can be called earlier than this window OnClose, we must ensure the order
            m_Runtime.Closing += OnDisable;

            //Init properties
            Init();
        }

        //Init variables after reloading.
        private void Init()
        {
            ShowDuringBuildRun = m_Runtime.StaticData.ShowDuringBuildRun;

            m_TimeOfLastAutoConnectStart = DateTime.Now;
            SelectedDevice = null;
            m_FinishedAutoselectingProcess = false;
            m_DisplayNamePriority = m_Runtime?.UserSettings?.SelectedPriority == null ? "Priority: Verbose" :
                string.Format("Priority: {0}", m_Runtime.UserSettings.SelectedPriority.ToString());
            OpenHarmonyHilogInternalLog.Log("Package: {0}, Auto select: {1}", PlayerSettings.applicationIdentifier, AutoSelectProcess);

            m_TagPriorityOnDevice = m_TagPriorityOnDevice ?? m_Data.m_TagPriorityOnDevice;
            m_ScrollData = m_ScrollData ?? m_Data.m_ScrollData;
            m_ScrollMode = m_Runtime.UserSettings.AutoScroll;
            m_StatusBar = m_StatusBar ?? m_Data.m_StatusBar;
            m_SearchField = m_SearchField ?? m_Data.m_SearchField;
            m_TagPriorityOnDevice.Clear();
            m_ScrollData.Reset();
            m_StatusBar.Reset();

            kAutoRunText = OpenHarmonyHilogStyles.kAutoRunText;
            kReconnect = OpenHarmonyHilogStyles.kIconReconnect;
            kDisconnect = OpenHarmonyHilogStyles.kIconDisconnect;
            kClearButtonText = OpenHarmonyHilogStyles.kIconClearButtonText;
            kMatchCase = OpenHarmonyHilogStyles.kIconMatchCase;
            kRegex = OpenHarmonyHilogStyles.kIconRegex;
            kScroll = OpenHarmonyHilogStyles.kScroll;
        }

        internal void OnDisable()
        {
            if (!OpenHarmonyBridge.OpenHarmonyExtensionsInstalled)
                return;

            if (m_Runtime == null)
            {
                OpenHarmonyHilogInternalLog.Log("Runtime was already destroyed.");
                return;
            }
            m_Runtime.UserSettings.Tags.TagSelectionChanged -= TagSelectionChanged;

            m_Runtime.Closing -= OnDisable;

            m_Runtime.DeviceQuery.DeviceSelected -= OnSelectedDevice;

            m_Runtime.Update -= OnUpdate;
            OpenHarmonyHilogInternalLog.Log("OnDisable, Auto select: {0}", m_AutoSelectProcess);
            StopHilog();
            m_Runtime.UserSettings.AutoScroll = m_ScrollMode;
            m_Runtime = null;
        }

        private void RemoveTag(string tag)
        {
            if (!m_Runtime.UserSettings.Tags.Remove(tag))
                return;

            RestartHilog();
        }

        private void AddTag(string tag)
        {
            if (!m_Runtime.UserSettings.Tags.Add(tag, true))
                return;

            RestartHilog();
        }

        private void TagSelectionChanged()
        {
            RestartHilog();
        }

        private void FilterByProcessId(int processId)
        {
            var selectedDevice = SelectedDevice;
            var processes = m_Runtime.UserSettings.GetKnownProcesses(selectedDevice);
            foreach (var p in processes)
            {
                if (p.processId == processId)
                {
                    SelectProcess(p);
                    RestartHilog();
                    return;
                }
            }

            var processName = OpenHarmonyHilogUtilities.GetProcessNameFromPid(m_Runtime.Tools.HDC, selectedDevice, processId);

            var process = m_Runtime.UserSettings.CreateProcessInformation(processName, processId, selectedDevice);

            SelectProcess(process);
            RestartHilog();
        }

        private void OnUpdate()
        {
            //if (this != EditorWindow.focusedWindow)
            //    return;

            var deviceQuery = m_Runtime.DeviceQuery;

            if (deviceQuery.FirstConnectedDevice == null)
                deviceQuery.UpdateConnectedDevicesList(false, SelectedDevice);

            if (deviceQuery.FirstConnectedDevice == null)
                return;

            if (m_AutoSelectProcess && !m_FinishedAutoselectingProcess)
            {
                // This is for AutoRun triggered by "Build And Run".
                if ((DateTime.Now - m_TimeOfLastAutoConnectUpdate).TotalMilliseconds < kMillisecondsBetweenConsecutiveAutoConnectChecks)
                    return;
                OpenHarmonyHilogInternalLog.Log("Waiting for {0} launch, elapsed {1} seconds", PlayerSettings.applicationIdentifier, (DateTime.Now - m_TimeOfLastAutoConnectStart).Seconds);
                m_TimeOfLastAutoConnectUpdate = DateTime.Now;

                var firstDevice = deviceQuery.FirstConnectedDevice;
                ResetProcesses(firstDevice);

                int projectApplicationPid = GetPidFromPackageName(null, PlayerSettings.applicationIdentifier, firstDevice);
                var process = m_Runtime.UserSettings.CreateProcessInformation(PlayerSettings.applicationIdentifier, projectApplicationPid, firstDevice);
                if (process != null)
                {
                    OpenHarmonyHilogInternalLog.Log("Auto selecting process {0}", PlayerSettings.applicationIdentifier);
                    // Note: Don't call SelectPackage as that will reset m_AutoselectPackage
                    SetProcess(process);
                    deviceQuery.SelectDevice(ref m_SelectedDevice, firstDevice, false);

                    RestartHilog();

                    m_FinishedAutoselectingProcess = true;
                    //if hdc.exe crash, retry auto connection.
                    var  m_CheckAutoConnectTimer = new System.Timers.Timer(500);
                    m_CheckAutoConnectTimer.Elapsed += (sender, e) =>
                    {
                        m_FinishedAutoselectingProcess = !m_Hilog.MessageProvider.HasExited;
                        m_CheckAutoConnectTimer.Stop();
                    };
                    m_CheckAutoConnectTimer.Start();
                    UpdateStatusBar();
                }
                else
                {
                    var timeoutMS = (DateTime.Now - m_TimeOfLastAutoConnectStart).TotalMilliseconds;
                    if (timeoutMS > kMillisecondsMaxAutoconnectTimeOut)
                    {
                        var msg = string.Format("Timeout {0} ms while waiting for '{1}' to launch.", timeoutMS, PlayerSettings.applicationIdentifier);
                        UpdateStatusBar(msg);
                        OpenHarmonyHilogInternalLog.Log(msg);
                        m_FinishedAutoselectingProcess = true;
                    }
                }
            }
            else if (SelectedDevice == null)
            {
                IOpenHarmonyHilogDevice selectedDevice;
                ProcessInformation selectedProcess;
                OpenHarmonyHilogUtilities.GetDeviceAndProcessFromSavedState(m_Runtime, SelectedProcess, out selectedDevice, out selectedProcess);
                if (selectedDevice == null)
                    selectedDevice = deviceQuery.FirstConnectedDevice;
                if (selectedDevice != null)
                {
                    SelectedProcess = null;
                    if (selectedProcess == null)
                    {
                        deviceQuery.SelectDevice(ref m_SelectedDevice, selectedDevice);
                    }
                    else
                    {
                        // We don't want for SelectDevice to start hilog, since we're gonna select a process
                        // That's why we're not notifying the listeners
                        deviceQuery.SelectDevice(ref m_SelectedDevice, selectedDevice, false);
                        SelectProcess(selectedProcess);
                    }
                }
            }
        }

        private void OnHilogDisconnected(IOpenHarmonyHilogDevice device)
        {
            StopHilog();
            var msg = string.Format("Either HDC application crashed or device disconnected (device id: {0} ); {1}", device.DisplayName, 
                OpenHarmonyHilogUtilities.HDCVersionReminder(device.APILevel, m_Runtime.Tools.HDC)); 
            OpenHarmonyHilogInternalLog.Log(msg);

            m_Runtime.DeviceQuery.UpdateConnectedDevicesList(true, SelectedDevice);
            SetProcess(null);
            UpdateStatusBar(msg);
        }

        private void OnHilogConnected(IOpenHarmonyHilogDevice device)
        {
            m_Runtime.DeviceQuery.UpdateConnectedDevicesList(true, SelectedDevice);
            UpdateStatusBar();
        }

        private void OnNewLogEntryAdded(IReadOnlyList<HilogEntry> entries)
        {
            Repaint();
        }

        internal void OnGUI()
        {
            if (!OpenHarmonyBridge.OpenHarmonyExtensionsInstalled)
            {
                OpenHarmonyHilogUtilities.ShowOpenHarmonyIsNotInstalledMessage();
                return;
            }

            if (OpenHarmonyHilogContainerWindow.ContainerWindow.m_ApplySettings)
            {
                OpenHarmonyHilogUtilities.ApplySettings(m_Runtime, SelectedDevice, m_Hilog);
                Repaint();
                OpenHarmonyHilogContainerWindow.ContainerWindow.m_ApplySettings = false;
            }

            EditorGUILayout.BeginVertical();
                EditorGUILayout.BeginHorizontal();
                {
                    ShowDuringBuildRun = GUILayout.Toggle(ShowDuringBuildRun, kAutoRunText, OpenHarmonyHilogStyles.toolbarButton);

                    OpenHarmonyHilogCommonGUIElements.HandleSelectedDeviceField(m_Runtime, ref m_SelectedDevice, ref m_SelectedProcess, HandleDeviceSelection);

                    EditorGUI.BeginDisabledGroup(!m_StatusBar.Connected);
                    OpenHarmonyHilogCommonGUIElements.HandleSelectedProcess(m_Runtime, ref m_SelectedDevice, ref m_SelectedProcess, HandleProcessSelection);

                    DisplayPriorityAndTagGUI();

                    if (m_RestartHilog)
                    {
                        RestartHilog();
                        m_RestartHilog = !m_RestartHilog;
                    }
                    EditorGUI.EndDisabledGroup();

                    HandleSearchField();

                var toolbarButtonIconGray = new GUIStyle(OpenHarmonyHilogStyles.toolbarButtonIcon);
                    toolbarButtonIconGray.normal.background = Texture2D.grayTexture;

                    if (GUILayout.Button(kMatchCase, m_Runtime.UserSettings.FilterOptions.MatchCase ? toolbarButtonIconGray : OpenHarmonyHilogStyles.toolbarButtonIcon, GUILayout.MinWidth(40)))
                        FilterByMatchCase();
                    if (GUILayout.Button(kRegex, m_Runtime.UserSettings.FilterOptions.UseRegularExpressions ? toolbarButtonIconGray : OpenHarmonyHilogStyles.toolbarButtonIcon, GUILayout.MinWidth(40)))
                        FilterByRegex();

                    if (GUILayout.Button(kReconnect, OpenHarmonyHilogStyles.toolbarButtonIcon, GUILayout.MinWidth(40)))
                        RestartHilog();
                    if (GUILayout.Button(kDisconnect, OpenHarmonyHilogStyles.toolbarButtonIcon, GUILayout.MinWidth(40)))
                        StopHilog();

                    if (GUILayout.Button(kClearButtonText, OpenHarmonyHilogStyles.toolbarButtonIcon, GUILayout.MinWidth(40)))
                    {
                        ClearHilog();
                        Repaint();
                    }

                }
                EditorGUILayout.EndHorizontal();

                if (DoMessageView(m_SelectedDevice))
                {
                    Repaint();
                }

                EditorGUILayout.BeginHorizontal();
                if (m_StatusBar != null)
                    m_StatusBar.DoGUI();
                DoScrollOptionsGUI();
                EditorGUILayout.EndHorizontal();

            EditorGUILayout.EndVertical();
        }

        //Callback after a certain device selected.
        private void HandleDeviceSelection(int selectIndex)
        {
            m_Runtime.DeviceQuery.SelectDevice(ref m_SelectedDevice, m_Runtime.DeviceQuery.Devices.Values.ToArray()[selectIndex]);
            SelectedProcess = null;
        }

        //Callback after a certain process selected.
        private void HandleProcessSelection(ProcessInformation newProcess)
        {
            if ((SelectedProcess == null && newProcess == null) || 
                (newProcess != null && SelectedProcess != null && newProcess.name == SelectedProcess.name && newProcess.processId == SelectedProcess.processId))
                return;

            m_AutoSelectProcess = false;

            OpenHarmonyHilogInternalLog.Log("Selecting process {0}", newProcess == null ? "<null>" : newProcess.DisplayName);

            SelectedProcess = newProcess;

            m_RestartHilog = true;
        }

        private void DisplayPriorityAndTagGUI()
        {
            
            GUILayout.Label(new GUIContent(m_DisplayNamePriority,"Select different priorities"), OpenHarmonyHilogStyles.toolbarPopup, GUILayout.MinWidth(55));
            var rectPriority = GUILayoutUtility.GetLastRect();
            if (Event.current.type == EventType.MouseDown && rectPriority.Contains(Event.current.mousePosition))
            {
                var priorities = (Priority[])Enum.GetValues(typeof(Priority));
                EditorUtility.DisplayCustomMenu(
                    new Rect(Event.current.mousePosition, Vector2.zero),
                    priorities.Select(m => new GUIContent(m.ToString())).ToArray(),
                    (int)m_Runtime.UserSettings.SelectedPriority, PrioritySelection, null);
            }

            var rectTag = GUILayoutUtility.GetLastRect();
            if (GUILayout.Button(new GUIContent(m_Runtime.UserSettings.Tags.displayNameTag, "Select different tags"), OpenHarmonyHilogStyles.toolbarPopup, GUILayout.MinWidth(40)))
            {
                m_Runtime.UserSettings.Tags.DoGUI(new Rect(Event.current.mousePosition, Vector2.zero),
                    new Rect(rectTag.x + rectTag.width, rectTag.y, 0, 20));
            }
        }

        private void SetProcess(ProcessInformation newProcess)
        {
            SelectedProcess = newProcess;
        }

        private void SelectProcess(ProcessInformation newProcess)
        {
            if ((SelectedProcess == null && newProcess == null) ||
                (newProcess != null && SelectedProcess != null && newProcess.name == SelectedProcess.name && newProcess.processId == SelectedProcess.processId))
                return;

            m_AutoSelectProcess = false;

            OpenHarmonyHilogInternalLog.Log("Selecting process {0}", newProcess == null ? "<null>" : newProcess.DisplayName);

            SetProcess(newProcess);
        }

        private void ResetProcesses(IOpenHarmonyHilogDevice device)
        {
            OpenHarmonyHilogInternalLog.Log("Reset processes");
            SetProcess(null);
        }

        private void HandleSearchField()
        {
            var filterValid = m_Hilog != null ? m_Hilog.FilterOptions.IsValid : true;
            var oldColor = GUI.color;
            if (!filterValid)
                GUI.color = Color.red;
            var newFilter = m_SearchField.OnToolbarGUI(m_Runtime.UserSettings.FilterOptions.Filter, null);
            if (!filterValid)
                GUI.color = oldColor;
            SetFilter(newFilter);
        }

        private void OnSelectedDevice(IOpenHarmonyHilogDevice device)
        {
            if (device == null)
                return;

            if (focusedWindow != this)
                return;

            ResetProcesses(device);
            UpdateDebuggablePackages();
            RestartHilog();
        }

        private void SetSelectedPriority(Priority newPriority)
        {
            if (newPriority != m_Runtime.UserSettings.SelectedPriority)
            {
                m_Runtime.UserSettings.SelectedPriority = newPriority;
                RestartHilog();
            }
        }

        private void SetFilter(string newFilter)
        {
            if (newFilter == m_Runtime.UserSettings.FilterOptions.Filter)
                return;

            m_Runtime.UserSettings.FilterOptions.Filter = string.IsNullOrEmpty(newFilter) ? string.Empty : newFilter;
            if (m_Hilog != null)
                m_Hilog.FilterOptions.Filter = m_Runtime.UserSettings.FilterOptions.Filter;
        }

        private void CheckIfProcessExited(Dictionary<string, int> cache)
        {
            foreach (var process in ProcessesForSelectedDevice)
            {
                if (process == null || process.processId <= 0)
                    continue;

                if (GetPidFromPackageName(cache, process.name, SelectedDevice) != process.processId)
                {
                    process.SetExited();
                }
                else
                {
                    process.SetAlive();
                }
            }
        }

        private void UpdateDebuggablePackages()
        {
            // When running test Tools don't exist
            if (m_Runtime.Tools == null)
                return;
            var startTime = DateTime.Now;
            var packagePIDCache = new Dictionary<string, int>();
            CheckIfProcessExited(packagePIDCache);

            int topAbilityPid = 0;
            string topAbilityPackageName = string.Empty;
            bool checkProjectPackage = true;
            var selectedDevice = SelectedDevice;
            if (OpenHarmonyHilogUtilities.GetTopAbilityInfo(m_Runtime.Tools.HDC, selectedDevice, ref topAbilityPackageName, ref topAbilityPid))
            {
                m_Runtime.UserSettings.CreateProcessInformation(topAbilityPackageName, topAbilityPid, selectedDevice);

                checkProjectPackage = topAbilityPackageName != PlayerSettings.applicationIdentifier;
            }

            if (checkProjectPackage)
            {
                int projectApplicationPid = GetPidFromPackageName(packagePIDCache, PlayerSettings.applicationIdentifier, selectedDevice);
                m_Runtime.UserSettings.CreateProcessInformation(PlayerSettings.applicationIdentifier, projectApplicationPid, selectedDevice);
            }

            m_Runtime.UserSettings.CleanupDeadProcessesForDevice(SelectedDevice, m_Runtime.Settings.MaxExitedPackagesToShow);
            OpenHarmonyHilogInternalLog.Log("UpdateDebuggablePackages finished in " + (DateTime.Now - startTime).Milliseconds + " ms");
        }

        private int GetPidFromPackageName(Dictionary<string, int> cache, string packageName, IOpenHarmonyHilogDevice device)
        {
            if (device == null)
                return -1;
            // Getting pid for packages is a very costly operation, use cache to make less queries
            int pid;
            if (cache != null && cache.TryGetValue(packageName, out pid))
                return pid;

            pid = OpenHarmonyHilogUtilities.GetPidFromPackageName(m_Runtime.Tools.HDC, device, packageName);
            if (cache != null)
                cache[packageName] = pid;
            return pid;
        }

        private void FilterByMatchCase()
        {
            var filterOptions = m_Runtime.UserSettings.FilterOptions;
            filterOptions.MatchCase = !filterOptions.MatchCase;
            if (m_Hilog != null)
                m_Hilog.FilterOptions.MatchCase = filterOptions.MatchCase;
        }

        private void FilterByRegex()
        {
            var filterOptions = m_Runtime.UserSettings.FilterOptions;
            filterOptions.UseRegularExpressions = !filterOptions.UseRegularExpressions;
            if (m_Hilog != null)
                m_Hilog.FilterOptions.UseRegularExpressions = filterOptions.UseRegularExpressions;
        }

        private void RestartHilog()
        {
            StopHilog();

            StartHilog();

            CollectTagPrioritiesFromDevice(m_SelectedDevice);
        }

        private void StartHilog()
        {
            var device = SelectedDevice;
            if (device == null)
                return;
            if (m_Runtime.Tools == null)
                return;

            m_Hilog = new OpenHarmonyHilog(
                m_Runtime,
                m_Runtime.Tools.HDC,
                device,
                SelectedProcess == null ? 0 : SelectedProcess.processId,
                m_Runtime.UserSettings.SelectedPriority,
                m_Runtime.UserSettings.FilterOptions,
                m_Runtime.UserSettings.Tags.GetSelectedTags());
            m_Hilog.FilteredLogEntriesAdded += OnNewLogEntryAdded;
            m_Hilog.Disconnected += OnHilogDisconnected;
            m_Hilog.Connected += OnHilogConnected;

            m_Hilog.Start();
        }

        private void StopHilog()
        {
            if (m_Hilog != null)
                m_Hilog.Stop();

            UpdateStatusBar();
        }

        private void ClearHilog()
        {
            if (m_Hilog == null)
            {
                return;
            }

            m_Hilog.Stop();
            m_Hilog.Clear();
            m_Hilog.Start();
        }

        public void UpdateStatusBar()
        {
            var filterOptions = m_Runtime.UserSettings.FilterOptions;
            var text = filterOptions.Filter;
            var regex = filterOptions.UseRegularExpressions ? "On" : "Off";
            var tags = m_Runtime.UserSettings.Tags.ToString();
            var message = $"Filtering with Priority '{m_Runtime.UserSettings.SelectedPriority}'";
            if (!string.IsNullOrEmpty(tags))
                message += $", Tags '{m_Runtime.UserSettings.Tags.ToString()}'";
            if (!string.IsNullOrEmpty(text))
                message += $", Text '{filterOptions.Filter}', Regex '{regex}' Match Case '{filterOptions.MatchCase}'. ";

            UpdateStatusBar(message);
        }

        public void UpdateStatusBar(string message)
        {
            if (m_StatusBar == null)
                return;

            m_StatusBar.Connected = IsHilogConnected;
            m_StatusBar.Message = message;

            Repaint();
        }
    }
}
