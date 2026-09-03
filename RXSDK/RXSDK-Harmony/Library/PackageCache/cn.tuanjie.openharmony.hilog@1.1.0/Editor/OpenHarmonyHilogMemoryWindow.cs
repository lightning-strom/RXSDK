using System;
using System.Collections.Generic;
using UnityEditor;
using System.Text;
using UnityEngine;
using System.Linq;
using System.Threading.Tasks;

namespace Tuanjie.OpenHarmony.Hilog
{
    [Serializable]
    internal class OpenHarmonyHilogMemoryWindowState
    {
        public float MemoryWindowWidth;
        public bool[] MemoryTypeEnabled;
        public MemoryGroup MemoryGroup = MemoryGroup.ProportionalSetSize;
        public bool AutoCapture = true;

        public void Reset(OpenHarmonyHilogMemoryWindowState other)
        {
            this.MemoryWindowWidth = other.MemoryWindowWidth;
            this.MemoryTypeEnabled = other.MemoryTypeEnabled;
            this.MemoryGroup = other.MemoryGroup;
            this.AutoCapture = other.AutoCapture; 
        }
    }

    //Remaining data after the  "OpenHarmonyHilogMemoryWindow" window is reloaded.
    internal class OpenHarmonyHilogMemoryWindowData
    {
        const int kMaxEntries = 300;
        internal OpenHarmonyMemoryStatistics[] m_Entries = new OpenHarmonyMemoryStatistics[kMaxEntries];
        internal OpenHarmonyMemoryStatistics m_LastAllocatedEntry;
        internal OpenHarmonyHilogMemoryWindowState m_State = new OpenHarmonyHilogMemoryWindowState();

        internal OpenHarmonyHilogMemoryWindowData(OpenHarmonyHilogRuntimeBase runtime)
        {
            var m_AllMemoryGroups = runtime.StaticData.m_AllMemoryGroups;
            var m_AllMemoryPageTypes = runtime.StaticData.m_AllMemoryPageTypes;
            var m_AllMemoryTypes = runtime.StaticData.m_AllMemoryTypes;
            for (int i = 0; i < kMaxEntries; i++)
                m_Entries[i] = new OpenHarmonyMemoryStatistics(m_AllMemoryGroups, m_AllMemoryPageTypes, m_AllMemoryTypes);
            m_LastAllocatedEntry = new OpenHarmonyMemoryStatistics(m_AllMemoryGroups, m_AllMemoryPageTypes, m_AllMemoryTypes);
        }
    }

    /// <summary>
    /// The interface to capture Memory information (of a certain process).
    /// Collect statistics of (MAX, MIN, AVG) memory usage of a process.
    /// </summary>
    internal class OpenHarmonyHilogMemoryWindow : EditorWindow
    {

        class OpenHarmonyHilogQueryMemoryInput : IOpenHarmonyHilogTaskInput
        {
            internal OpenHarmonyBridge.HDC hdc;
            internal int packageProcessId;
            internal string packageName;
            internal string deviceId;
        }
        
        class OpenHarmonyHilogQueryMemoryResult : IOpenHarmonyHilogTaskResult
        {
            internal int packageProcessId;
            internal string packageName;
            internal string contents;
            internal string deviceId;
        }

        private OpenHarmonyHilogRuntimeBase m_Runtime;
        private OpenHarmonyHilogMemoryWindowData m_Data;

        private MemoryType[] m_OrderMemoryTypesPSS;
        private MemoryType[] m_OrderMemoryTypesHeap;
        private Dictionary<MemoryType, Color> m_MemoryTypeColors;
        private Material m_Material;
        private MemoryGroup[] m_AllMemoryGroups;
        private MemoryPageType[] m_AllMemoryPageTypes;
        private MemoryType[] m_AllMemoryTypes;


        int m_MaxEntries;
        const float kMinMemoryWindowHeight = 440.0f;
        const float kMaxMemoryWindowHeight = 4000.0f;
        const float kMinMemoryWindowWidth = 200.0f;
        const float kMaxMemoryWindowWidth = 500.0f;

        private OpenHarmonyHilogMemoryWindowState m_State;
        private OpenHarmonyMemoryStatistics[] m_Entries;
        private OpenHarmonyMemoryStatistics m_LastAllocatedEntry;

        private int m_CurrentEntry = 0;
        private int m_EntryCount = 0;
        private UInt64 m_UpperMemoryBoundry = 32 * 1000 * 1000;
        private int m_RequestsInQueue;
        private int m_SelectedEntry;

        private float m_TimeCounting = 0;
        private float m_RealtimeSinceStartup = 0;
        private ulong m_MaxPSSCounting = 0;
        private ulong m_MinPSSCounting = ulong.MaxValue;
        private ulong m_AveragePSSCounting = 0;
        private int m_EntryCountForAveragePSS = 0;

        private IOpenHarmonyHilogDevice m_ExpectedDevice;
        private ProcessInformation m_ExpectedProcessFromRequest;
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
        internal event Action m_OnCounting;

        private bool IsHilogConnected => SelectedDevice.State == IOpenHarmonyHilogDevice.DeviceState.Connected;
        private bool m_isCounting = false;
        private DateTime m_TimeOfLastMemoryRequest;
        private string m_LastError;

        internal void PostInstantiation(OpenHarmonyHilogMemoryWindowData data)
        {
            titleContent = new GUIContent("Memory");
            m_Data = data;
        }

        private MemoryType[] GetOrderMemoryTypes()
        {
            return m_State.MemoryGroup == MemoryGroup.ProportionalSetSize ? m_OrderMemoryTypesPSS : m_OrderMemoryTypesHeap;
        }

        private void OnSelectedDevice(IOpenHarmonyHilogDevice device)
        {
            if (device == null)
                return;

            if (focusedWindow != this)
                return;

            ResetProcesses(device);
            UpdateDebuggablePackages();

            if (SelectedDevice.ConnectionType == IOpenHarmonyHilogDevice.DeviceConnectionType.Network)
            {
                EditorUtility.DisplayProgressBar("Connecting", "Connecting to " + SelectedDevice.Id, 0.0f);
                m_Runtime.Dispatcher.Schedule(new OpenHarmonyHilogConnectToDeviceInput() { hdc = m_Runtime.Tools.HDC, deviceId = SelectedDevice.Id },
                    OpenHarmonyHilogReconnectToDeviceTask.Execute, IntegrateReconnectToDevice, false);
                //Pause the thread 5s waiting for the finish of Wi-Fi connection, as it is asynchronous in case of the blocking of Unity Editor. 
                System.Threading.Thread.Sleep(5000);
            }
        }

        private async void IntegrateReconnectToDevice(IOpenHarmonyHilogTaskResult result)
        {
            var r = (OpenHarmonyHilogConnectToDeviceResult)result;
            if (r.success)
            {
                var deviceID = r.deviceID;
                var cmd = new[] { "list targets -v" };
                var errorMsg = "Unable to list connected devices. ";
                var isConnected = false;
                //Try to access the device connected via Wi-Fi.
                for (int i = 0; i < 3; i++)
                {
                    isConnected = await Task.Run(() => r.hdc.Run(cmd, errorMsg).Contains(deviceID));
                    await Task.Delay(1000);
                }

                //if devices connected via Wi-Fi are still offline, ask user to connect to them manually.
                if (!isConnected)
                {
                    r.message = string.Format("Fail to connect to Device {0}", r.deviceID);
                    r.success = false;
                    SelectedDevice.UpdateState(IOpenHarmonyHilogDevice.DeviceState.Disconnected);
                }
                else
                {
                    r.success = true;
                    SelectedDevice.UpdateState(IOpenHarmonyHilogDevice.DeviceState.Connected);
                }
            }

            OpenHarmonyHilogInternalLog.Log(r.message);
            EditorUtility.ClearProgressBar();
            EditorUtility.DisplayDialog(r.success ? "Success" : "Failure", r.message, "Ok");
        }

        private void ResetProcesses(IOpenHarmonyHilogDevice device)
        {
            OpenHarmonyHilogInternalLog.Log("Reset processes");
            SetProcess(null);
        }

        /// <summary>
        /// Validate serialized settings here
        /// </summary>
        private void ValidateSettings()
        {
            var allMemoryTypes = (MemoryType[])Enum.GetValues(typeof(MemoryType));

            if (m_State.MemoryTypeEnabled == null || m_State.MemoryTypeEnabled.Length != allMemoryTypes.Length)
            {
                m_State.MemoryTypeEnabled = new bool[allMemoryTypes.Length];
                for (int i = 0; i < m_State.MemoryTypeEnabled.Length; i++)
                    m_State.MemoryTypeEnabled[i] = true;
            }

            m_State.MemoryWindowWidth = Mathf.Clamp(m_State.MemoryWindowWidth, kMinMemoryWindowWidth, kMaxMemoryWindowWidth);
        }

        internal void ClearEntries()
        {
            m_MaxEntries = m_Entries.Length;
            m_SelectedEntry = -1;
            m_EntryCount = 0;
            m_CurrentEntry = 0;
            m_RequestsInQueue = 0;

            m_UpperMemoryBoundry = 32 * 1000 * 1000;
            m_ExpectedProcessFromRequest = null;
            m_ExpectedDevice = null;

            m_MaxPSSCounting = m_AveragePSSCounting = 0;
            m_MinPSSCounting = ulong.MaxValue;
            m_EntryCountForAveragePSS = 0;
            m_RealtimeSinceStartup = Time.realtimeSinceStartup;
            m_TimeCounting = 0;
        }

        internal void SetExpectedDeviceAndProcess(IOpenHarmonyHilogDevice device, ProcessInformation process)
        {
            m_ExpectedDevice = device;
            m_ExpectedProcessFromRequest = process;
        }

        internal bool QueueMemoryRequest(IOpenHarmonyHilogDevice device, ProcessInformation process)
        {
            m_ExpectedDevice = device ?? SelectedDevice;
            m_ExpectedProcessFromRequest = process ?? SelectedProcess;

            if (m_ExpectedDevice == null || !IsHilogConnected)
            {
                var notification = "Fail to capture memory, please select a device before capture";
                ShowNotification(new GUIContent(notification));
                return false;
            }

            //If no a selected process, select the (process of) FOREGROUND application. 
            if (m_ExpectedProcessFromRequest == null || !m_ExpectedProcessFromRequest.IsAlive())
            {
                int topAbilityPid = 0;
                string topAbilityPackageName = string.Empty;
                if (!OpenHarmonyHilogUtilities.GetTopAbilityInfo(m_Runtime.Tools.HDC, m_ExpectedDevice, ref topAbilityPackageName, ref topAbilityPid))
                {
                    var notification = "Fail to capture memory, please open an application or select a running process before capture";
                    ShowNotification(new GUIContent(notification));
                    return false;
                }
                m_ExpectedProcessFromRequest = SelectedProcess = m_Runtime.UserSettings.CreateProcessInformation(topAbilityPackageName, topAbilityPid, m_ExpectedDevice);
            }

            // Don't make a memory request, if previous requests haven't finished yet
            // Otherwise async queue will grow bigger and bigger
            const int kMaxRequestsInQueue = 3;
            if (m_RequestsInQueue > kMaxRequestsInQueue)
                return false;
            m_RequestsInQueue++;
            m_Runtime.Dispatcher.Schedule(
                new OpenHarmonyHilogQueryMemoryInput()
                {
                    hdc = OpenHarmonyBridge.HDC.GetInstance(),
                    packageProcessId = m_ExpectedProcessFromRequest.processId,
                    packageName = m_ExpectedProcessFromRequest.name,
                    deviceId = m_ExpectedDevice.Id
                },
                QueryMemoryAsync,
                IntegrateQueryMemory,
                false);

            return true;
        }

        internal static string UInt64ToSizeString(UInt64 value)
        {
            if (value < 0)
                return "unknown";
            if (value == 0)
                return "0 Bytes";
            float val = (float)value;
            string[] scale = new string[] { "TB", "GB", "MB", "KB", "Bytes" };
            int idx = scale.Length - 1;
            while (val > 1000.0f && idx >= 0)
            {
                val /= 1000f;
                idx--;
            }

            if (idx < 0)
                return "<error>";

            return string.Format("{0:#.##} {1}", val, scale[idx]);
        }

        private static IOpenHarmonyHilogTaskResult QueryMemoryAsync(IOpenHarmonyHilogTaskInput input)
        {
            var workInput = ((OpenHarmonyHilogQueryMemoryInput)input);
            var hdc = workInput.hdc;

            if (hdc == null)
                throw new NullReferenceException("HDC interface has to be valid");

            // Note: Using process id you can query memory from system apps which are not packages.
            var cmd = "-t " + workInput.deviceId + " shell hidumper --mem " + workInput.packageProcessId;
            OpenHarmonyHilogInternalLog.Log("{0} {1}", hdc.GetHDCPath(), cmd);

            string outputMsg = string.Empty;
            try
            {
                outputMsg = hdc.Run(new[] { cmd }, $"Failed to query memory for {workInput.packageName} (PID = {workInput.packageProcessId}");
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log("Failed to query memory: \n" + ex.Message);
            }
            var result = new OpenHarmonyHilogQueryMemoryResult();
            result.deviceId = workInput.deviceId;
            result.packageName = workInput.packageName;
            result.packageProcessId = workInput.packageProcessId;
            result.contents = outputMsg;

            return result;
        }

        private OpenHarmonyMemoryStatistics AllocateMemoryStatistics()
        {
            m_LastAllocatedEntry = m_Entries[m_CurrentEntry++];
            if (m_CurrentEntry >= m_MaxEntries)
                m_CurrentEntry = 0;
            m_EntryCount = Math.Min(m_EntryCount + 1, m_MaxEntries);

            if (m_SelectedEntry >= 0 && m_EntryCount == m_MaxEntries)
                m_SelectedEntry--;
            return m_LastAllocatedEntry;
        }

        private void UpdateGeneralStats()
        {
            // Set the upper boundry depending on total memory from all groups
            foreach (var m in m_AllMemoryGroups)
            {
                UInt64 maxMemory = 0;
                for (int i = 0; i < m_EntryCount; i++)
                {
                    UInt64 localTotal = 0;
                    foreach (var t in GetOrderMemoryTypes())
                    {
                        if (!m_State.MemoryTypeEnabled[(int)t])
                            continue;
                        localTotal += m_Entries[ResolveEntryIndex(i)].GetValue(m_State.MemoryGroup, t);
                    }
                    maxMemory = Math.Max(maxMemory, localTotal);
                }
                // Keep boundry by 10% higher, so there would be visible room from the top of the window
                m_UpperMemoryBoundry = (UInt64)(1.1f * maxMemory);
            }
        }

        private void InjectFakeMemoryStatistics(UInt64 totalMemory)
        {
            var stats = AllocateMemoryStatistics();
            stats.SetPSSFakeData(totalMemory, totalMemory);
            stats.SetHeapAllocData(totalMemory, totalMemory);
            stats.SetHeapSizeData(totalMemory, totalMemory);
            UpdateGeneralStats();
        }

        private void IntegrateQueryMemory(IOpenHarmonyHilogTaskResult result)
        {
            var memoryResult = (OpenHarmonyHilogQueryMemoryResult)result;

            if (m_ExpectedProcessFromRequest == null || m_ExpectedDevice == null)
                return;

            if (memoryResult.packageProcessId != m_ExpectedProcessFromRequest.processId ||
                memoryResult.deviceId != m_ExpectedDevice.Id ||
                string.IsNullOrEmpty(memoryResult.contents))
                return;

            if (memoryResult.contents.Contains("No such process:"))
            {
                m_ExpectedProcessFromRequest.SetExited();
                Repaint();
                return;
            }

            // When selecting a new package (or switch other tabs, or several tabs are opening), there might be still few requests for other packages running on other threads
            // Ignore those
            m_RequestsInQueue--;
            if (m_RequestsInQueue < 0)
            {
                m_RequestsInQueue = 0;
                //throw new Exception("Receiving more memory results than requested ?");
            }

            var stats = AllocateMemoryStatistics();
            try
            {
                m_LastError = string.Empty;
                stats.Parse(memoryResult.contents);
            }
            catch (Exception ex)
            {
                m_LastError = ex.Message;
                stats.Clear();
                OpenHarmonyHilogInternalLog.Log(ex.Message);
            }
            UpdateGeneralStats();
            m_OnCounting?.Invoke();

            Repaint();
        }

        private float GetEntryWidth(Rect windowSize)
        {
            return windowSize.width / (m_MaxEntries - 1);
        }

        private int ResolveEntryIndex(int entry)
        {
            return (int)Mathf.Repeat(entry + m_CurrentEntry - m_EntryCount, m_MaxEntries);
        }

        private Color GetMemoryColor(MemoryType type)
        {
            Color color;
            if (m_MemoryTypeColors.TryGetValue(type, out color))
                return color;
            throw new NotImplementedException(type.ToString());
        }

        private void DoMemoryToggle(MemoryType type)
        {
            GUILayout.Space(10);
            GUILayout.BeginHorizontal();
            GUILayout.Space(10);
            Color oldColor = GUI.backgroundColor;
            var memory = m_ExpectedProcessFromRequest == null ? "0" : UInt64ToSizeString(m_LastAllocatedEntry.GetValue(m_State.MemoryGroup, type));
            var name = String.Format("{0} ({1})", type, memory);
            if (type == MemoryType.Total)
            {
                GUI.backgroundColor = Color.white;
                GUILayout.Toggle(true, name, OpenHarmonyHilogStyles.kSeriesLabel);
            }
            else
            {
                var enabled = m_State.MemoryTypeEnabled[(int)type];
                GUI.backgroundColor = enabled ? GetMemoryColor(type) : Color.black;
                EditorGUI.BeginChangeCheck();
                m_State.MemoryTypeEnabled[(int)type] = GUILayout.Toggle(enabled, name, OpenHarmonyHilogStyles.kSeriesLabel);
                if (EditorGUI.EndChangeCheck())
                    UpdateGeneralStats();
            }
            GUI.backgroundColor = oldColor;
            GUILayout.EndHorizontal();
        }

        internal void OnUpdate()
        {
            //if (this != EditorWindow.focusedWindow)
            //    return;

            var deviceQuery = m_Runtime.DeviceQuery;

            if (deviceQuery.FirstConnectedDevice == null)
                deviceQuery.UpdateConnectedDevicesList(false, SelectedDevice);

            if (deviceQuery.FirstConnectedDevice == null)
                return;

            if (SelectedDevice == null)
            {
                IOpenHarmonyHilogDevice selectedDevice;
                ProcessInformation selectedProcess;
                OpenHarmonyHilogUtilities.GetDeviceAndProcessFromSavedState(m_Runtime, SelectedProcess, out selectedDevice, out selectedProcess);
                if (selectedDevice == null || selectedDevice.State != IOpenHarmonyHilogDevice.DeviceState.Connected)
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


            if (IsHilogConnected && m_State.AutoCapture)
            {
                if ((DateTime.Now - m_TimeOfLastMemoryRequest).TotalMilliseconds > m_Runtime.Settings.MemoryRequestIntervalMS)
                {
                    m_TimeOfLastMemoryRequest = DateTime.Now;
                    QueueMemoryRequest(SelectedDevice, SelectedProcess);
                }
            }
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

            /*if (OpenHarmonyHilogContainerWindow.ContainerWindow.w_HilogMemoryWindowData == null)
            {
                OpenHarmonyHilogInternalLog.Log("MemoryWindowData was already destroyed.");
                return;
            }

            m_Data = m_Data ?? OpenHarmonyHilogContainerWindow.ContainerWindow.w_HilogMemoryWindowData;*/
            m_Runtime = m_Runtime ?? OpenHarmonyHilogContainerWindow.ContainerWindow.m_Runtime;

            m_Runtime.Closing += OnDisable;
            m_Runtime.Update += OnUpdate;
            SelectedDevice = null;
            m_Runtime.DeviceQuery.DeviceSelected += OnSelectedDevice;

            Init();
        }

        private void Init()
        {
            m_OrderMemoryTypesPSS = m_Runtime.StaticData.m_OrderMemoryTypesPSS;
            m_OrderMemoryTypesHeap = m_Runtime.StaticData.m_OrderMemoryTypesHeap;
            m_MemoryTypeColors = m_Runtime.StaticData.m_MemoryTypeColors;
            m_Material = m_Runtime.StaticData.m_Material;
            m_AllMemoryGroups = m_Runtime.StaticData.m_AllMemoryGroups;
            m_AllMemoryPageTypes = m_Runtime.StaticData.m_AllMemoryPageTypes;
            m_AllMemoryTypes = m_Runtime.StaticData.m_AllMemoryTypes;

            m_State = m_State ?? m_Data.m_State;
            m_Entries = m_Entries ?? m_Data.m_Entries;
            m_LastAllocatedEntry = m_LastAllocatedEntry ?? m_Data.m_LastAllocatedEntry;
            m_State.Reset(m_Runtime.UserSettings.MemoryViewerState);
            for (int i = 0; i < m_Entries.Length; i++)
                m_Entries[i].Clear();
            m_LastAllocatedEntry.Clear();

            ClearEntries();
            ValidateSettings();
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

            m_Runtime.Closing -= OnDisable;

            m_Runtime.DeviceQuery.DeviceSelected -= OnSelectedDevice;

            m_Runtime.Update -= OnUpdate;

            m_Runtime.UserSettings.MemoryViewerState = m_State;

            m_Runtime = null;
        }

        internal void DoGUI()
        {

            GUILayout.BeginVertical();
                GUILayout.BeginHorizontal();

                    OpenHarmonyHilogCommonGUIElements.HandleSelectedDeviceField(m_Runtime, ref m_SelectedDevice, ref m_SelectedProcess, HandleDeviceSelection);

                    GUILayout.Space(3);
                    OpenHarmonyHilogCommonGUIElements.HandleSelectedProcess(m_Runtime, ref m_SelectedDevice, ref m_SelectedProcess, HandleProcessSelection);

                    if (GUILayout.Button(OpenHarmonyHilogStyles.kIconClearMemeoryEntryButtonText, OpenHarmonyHilogStyles.toolbarButtonIcon))
                        ClearEntries();

                    m_State.AutoCapture = GUILayout.Toggle(m_State.AutoCapture, "Auto Capture");
                    if (!m_State.AutoCapture)
                    {
                        if (GUILayout.Button("Capture", EditorStyles.miniButton))
                            QueueMemoryRequest(m_ExpectedDevice, m_ExpectedProcessFromRequest);
                    }

                    if (!m_isCounting)
                    {
                        if (GUILayout.Button("Start Counting For a Period", OpenHarmonyHilogStyles.toolbarButton)) 
                        {
                            m_MaxPSSCounting = m_AveragePSSCounting = 0;
                            m_MinPSSCounting = ulong.MaxValue;
                            m_EntryCountForAveragePSS = 0;
                            m_RealtimeSinceStartup = Time.realtimeSinceStartup;
                            m_TimeCounting = 0;

                            m_isCounting = m_State.AutoCapture = QueueMemoryRequest(m_ExpectedDevice, m_ExpectedProcessFromRequest);
                            m_OnCounting -= HandleCountingMemoryStatistics;
                            m_OnCounting += HandleCountingMemoryStatistics;
                        }
                    }
                    else
                    {
                        if (GUILayout.Button("Stop Counting For a Period", OpenHarmonyHilogStyles.toolbarButton))
                        {
                            m_isCounting = m_State.AutoCapture = false;
                            m_OnCounting -= HandleCountingMemoryStatistics;
                        }
                    }

                GUILayout.EndHorizontal();

                GUILayout.BeginHorizontal();
                    GUILayout.BeginVertical(GUILayout.Width(m_State.MemoryWindowWidth));

                        GUILayout.Space(10);
                        GUILayout.BeginHorizontal();
                            GUILayout.Label("Group:");
                            EditorGUI.BeginChangeCheck();
                            m_State.MemoryGroup = (MemoryGroup)EditorGUILayout.EnumPopup(m_State.MemoryGroup);
                            if (EditorGUI.EndChangeCheck())
                            {
                                //If auto capture enable, reset the statistics and stop auto capture.
                                CalculateStaticsByGroupType(m_State.MemoryGroup);

                                UpdateGeneralStats();
                            }
                            GUILayout.EndHorizontal();

                            foreach (var m in GetOrderMemoryTypes())
                            {
                                DoMemoryToggle(m);
                            }

                            DoMemoryToggle(MemoryType.Total);

                            GUILayout.Space(10);

                            if (Unsupported.IsDeveloperMode())
                                DoDebuggingGUI();

                    GUILayout.EndVertical();
                    var rc = GUILayoutUtility.GetLastRect();

                    GUILayout.BeginVertical();
                        // Note: GUILayoutUtility.GetRect must be called for Layout event always
                        var upperBarHeight = Mathf.Clamp(this.position.height / 2, kMinMemoryWindowHeight, kMaxMemoryWindowHeight);
                        var size = GUILayoutUtility.GetRect(GUIContent.none, OpenHarmonyHilogStyles.internalLogStyle, GUILayout.Height(upperBarHeight));
                        size.height -= 4;

                        if (m_EntryCount > 0)
                            DoEntriesGUI(size);

                        DoGuidelinesGUI(size, m_UpperMemoryBoundry);

                        if (m_EntryCount > 0)
                            DoSelectedStatsGUI(size);

                        GUI.Box(new Rect(rc.x + 4, size.y, rc.width - 4, size.height + 1), GUIContent.none, EditorStyles.helpBox);
                        GUI.Box(new Rect(size.x, size.y, size.width + 1, size.height + 1), GUIContent.none, EditorStyles.helpBox);

                        if (m_ExpectedProcessFromRequest == null)
                            EditorGUI.HelpBox(size, "Select a package", MessageType.Info);
                        else if (!string.IsNullOrEmpty(m_LastError))
                        {
                            var trimmed = m_LastError;
                            const int maxErrorLength = 100;
                            if (trimmed.Length > maxErrorLength)
                                trimmed = trimmed.Substring(0, maxErrorLength) + "...";
                            EditorGUI.HelpBox(size, trimmed, MessageType.Error);
                        }

                    GUILayout.EndVertical();

                GUILayout.EndHorizontal();
                var log = string.Format(" Time: {0}s \n Max {4}: {1} \n Min {4}: {2} \n AVG: {3}", m_EntryCountForAveragePSS > 0 ? m_TimeCounting: 0,
                    m_EntryCountForAveragePSS > 0 ? UInt64ToSizeString(m_MaxPSSCounting) : 0,
                    m_EntryCountForAveragePSS > 0 ? UInt64ToSizeString(m_MinPSSCounting) : 0,
                    m_EntryCountForAveragePSS > 0 ? UInt64ToSizeString(m_AveragePSSCounting) : 0, 
                    MemoryGroupToName(m_State.MemoryGroup));
                EditorGUI.BeginDisabledGroup(true);
                EditorGUILayout.SelectableLabel(log, OpenHarmonyHilogStyles.arkUITreeStyle, GUILayout.ExpandHeight(true));
                EditorGUI.EndDisabledGroup();

            GUILayout.EndVertical();
        }

        private void HandleCountingMemoryStatistics()
        {
            var lastPSSMemoryCount = m_Entries[ResolveEntryIndex(m_CurrentEntry - 1)].GetValue(m_State.MemoryGroup, MemoryType.Total);
            m_MaxPSSCounting = lastPSSMemoryCount > m_MaxPSSCounting ? lastPSSMemoryCount : m_MaxPSSCounting;
            m_MinPSSCounting = lastPSSMemoryCount < m_MinPSSCounting ? lastPSSMemoryCount : m_MinPSSCounting;
            m_AveragePSSCounting = ((ulong)m_EntryCountForAveragePSS++ * m_AveragePSSCounting + lastPSSMemoryCount) / (ulong)m_EntryCountForAveragePSS;
            m_TimeCounting += Time.realtimeSinceStartup - m_RealtimeSinceStartup;
            m_RealtimeSinceStartup = Time.realtimeSinceStartup;
        }

        private void HandleDeviceSelection(int selectIndex)
        {
            m_Runtime.DeviceQuery.SelectDevice(ref m_SelectedDevice, m_Runtime.DeviceQuery.Devices.Values.ToArray()[selectIndex]);
            SelectedProcess = null;
        }

        private void HandleProcessSelection(ProcessInformation newProcess)
        {
            if ((SelectedProcess == null && newProcess == null) ||
                (newProcess != null && SelectedProcess != null && newProcess.name == SelectedProcess.name && newProcess.processId == SelectedProcess.processId))
                return;

            OpenHarmonyHilogInternalLog.Log("Selecting process {0}", newProcess == null ? "<null>" : newProcess.DisplayName);

            SelectedProcess = newProcess;
        }

        void OnGUI()
        {
            if (!OpenHarmonyBridge.OpenHarmonyExtensionsInstalled)
            {
                OpenHarmonyHilogUtilities.ShowOpenHarmonyIsNotInstalledMessage();
                return;
            }

            if (OpenHarmonyHilogContainerWindow.ContainerWindow.m_ApplySettings)
            {
                OpenHarmonyHilogUtilities.ApplySettings(m_Runtime, SelectedDevice);
                Repaint();
                OpenHarmonyHilogContainerWindow.ContainerWindow.m_ApplySettings = false;
            }

            DoGUI();
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

        private IReadOnlyList<ProcessInformation> ProcessesForSelectedDevice
        {
            get { return m_Runtime.UserSettings.GetKnownProcesses(SelectedDevice); }
        }

        private void SelectProcess(ProcessInformation newProcess)
        {
            if ((SelectedProcess == null && newProcess == null) ||
                (newProcess != null && SelectedProcess != null && newProcess.name == SelectedProcess.name && newProcess.processId == SelectedProcess.processId))
                return;

            OpenHarmonyHilogInternalLog.Log("Selecting process {0}", newProcess == null ? "<null>" : newProcess.DisplayName);

            SetProcess(newProcess);
        }

        private void SetProcess(ProcessInformation newProcess)
        {
            SelectedProcess = newProcess;
            ClearEntries();
            SetExpectedDeviceAndProcess(SelectedDevice, SelectedProcess);
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

        private UInt64 AggregateMemorySize(OpenHarmonyMemoryStatistics stats, MemoryType type)
        {
            UInt64 total = 0;
            MemoryType[] types = GetOrderMemoryTypes();
            for (int i = types.Length - 1; i >= 0; i--)
            {
                if (types[i] == type)
                    return total;
                if (!m_State.MemoryTypeEnabled[i])
                    continue;
                total += stats.GetValue(m_State.MemoryGroup, types[i]);
            }

            throw new Exception("Unhandled memory type: " + type);
        }

        private void DoGuidelinesGUI(Rect windowSize, UInt64 totalMemorySize)
        {
            if (Event.current.type != EventType.Repaint)
                return;

            m_Material.SetPass(0);
            var percentages = new[] { 0.4f, 0.8f };
            GL.Begin(GL.LINES);
            foreach (var p in percentages)
            {
                float y = windowSize.y + windowSize.height * (1.0f - p);
                GL.Color(Color.gray);
                GL.Vertex3(windowSize.x, y, 0);
                GL.Vertex3(windowSize.x + windowSize.width, y, 0);
            }
            GL.End();

            if (m_ExpectedProcessFromRequest == null)
                return;

            foreach (var p in percentages)
            {
                float y = windowSize.y + windowSize.height * (1.0f - p);
                var title = UInt64ToSizeString((UInt64)(totalMemorySize * p));
                OpenHarmonyHilogStyles.infoStyle.Draw(new Rect(windowSize.x, y, 100, 20), new GUIContent(title), 0);
            }
        }

        private void DoEntriesGUI(Rect windowSize)
        {

            m_Material.SetPass(0);

            // Triangle strip
            // 0  2
            // | /|
            // |/ |
            // 1  3
            var width = GetEntryWidth(windowSize);
            var multiplier = windowSize.height / m_UpperMemoryBoundry;
            var t = windowSize.y;
            var b = windowSize.height + windowSize.y;
            var xOffset = windowSize.x + windowSize.width - (m_EntryCount - 1) * width;

            foreach (var m in GetOrderMemoryTypes())
            {
                if (!m_State.MemoryTypeEnabled[(int)m])
                    continue;
                
                //Avoid unexpected drawing actions
                if(Event.current.type == EventType.Repaint)
                {
                    GL.Begin(GL.TRIANGLE_STRIP);
                    GL.Color(GetMemoryColor(m));

                    for (int i = 0; i < m_EntryCount; i++)
                    {
                        var idx = ResolveEntryIndex(i);
                        var agr = AggregateMemorySize(m_Entries[idx], m);
                        var val = m_Entries[idx].GetValue(m_State.MemoryGroup, m);
                        var x = xOffset + i * width;
                        var y1 = b - multiplier * (val + agr);
                        var y2 = b - multiplier * agr;
                        GL.Vertex3(x, y1, 0);
                        GL.Vertex3(x, y2, 0);
                    }
                    GL.End();
                }
            }
        }

        private void DoSelectedStatsGUI(Rect windowSize)
        {
            var e = Event.current;
            if (e.type == EventType.MouseDown && windowSize.Contains(e.mousePosition))
            {
                float wd = GetEntryWidth(windowSize);
                m_SelectedEntry = (int)((e.mousePosition.x - windowSize.x + wd * 0.5f) / wd);
                // Correct entry for cases where we don't have enough entries to fill the full array
                m_SelectedEntry += m_EntryCount - m_MaxEntries;
                Repaint();
            }

            if (m_SelectedEntry < 0)
                return;
            var width = GetEntryWidth(windowSize);
            var x = windowSize.x + windowSize.width - (m_EntryCount - 1) * width + m_SelectedEntry * width;
            var t = windowSize.y;
            var b = windowSize.height + windowSize.y;
            if (e.type == EventType.Repaint)
            {
                m_Material.SetPass(0);
                GL.Begin(GL.LINES);
                GL.Color(Color.white);
                GL.Vertex3(x, t, 0);
                GL.Vertex3(x, b, 0);
                GL.End();
            }

            var idx = ResolveEntryIndex(m_SelectedEntry);
            var info = new StringBuilder();

            int enabledCount = 0;
            foreach (var m in GetOrderMemoryTypes())
            {
                if (!m_State.MemoryTypeEnabled[(int)m])
                    continue;
                info.AppendLine(m.ToString() + " : " + UInt64ToSizeString(m_Entries[idx].GetValue(m_State.MemoryGroup, m)));
                enabledCount++;
            }

            info.AppendLine("Total: " + UInt64ToSizeString(m_Entries[idx].GetValue(m_State.MemoryGroup, MemoryType.Total)));

            const float kInfoWidth = 180;
            var infoX = x + 5;
            if (infoX + kInfoWidth > windowSize.x + windowSize.width)
                infoX -= kInfoWidth + 10;
            var rc = new Rect(infoX, t + 10, kInfoWidth, 19 * enabledCount + 30);
            GUI.Box(rc, GUIContent.none, GUI.skin.window);
            GUI.Label(rc, info.ToString());
        }

        void DoDebuggingGUI()
        {
            GUILayout.Space(20);
            GUILayout.Label("Developer Options", EditorStyles.boldLabel);
            const UInt64 kOneKiloByte = 1000;
            const UInt64 kOneMegaByte = kOneKiloByte * kOneKiloByte;
            const UInt64 kOneGigaByte = kOneKiloByte * kOneMegaByte;
            if (GUILayout.Button("Add 400MB", EditorStyles.miniButton))
                InjectFakeMemoryStatistics(400 * kOneMegaByte);
            if (GUILayout.Button("Add 2GB", EditorStyles.miniButton))
                InjectFakeMemoryStatistics(2 * kOneGigaByte);
            if (GUILayout.Button("Add 1000GB", EditorStyles.miniButton))
                InjectFakeMemoryStatistics(1000 * kOneGigaByte);
        }

        private string MemoryGroupToName(MemoryGroup type)
        {
            if (type == MemoryGroup.HeapAlloc)
                return "HeapAlloc";
            if (type == MemoryGroup.HeapSize)
                return "HeapSize";
            if (type == MemoryGroup.ProportionalSetSize)
                return "PSS";
            if (type == MemoryGroup.ResidentSetSize)
                return "RSS";
            return "Unknown Type";
        }

        private void CalculateStaticsByGroupType(MemoryGroup type)
        {
            m_MaxPSSCounting = m_AveragePSSCounting = 0;
            m_MinPSSCounting = ulong.MaxValue;
            m_EntryCountForAveragePSS = 0;

            for (int i = 0; i < m_EntryCount; i++)
            {
                var lastMemoryCount = m_Entries[ResolveEntryIndex(i)].GetValue(type, MemoryType.Total);

                m_MaxPSSCounting = lastMemoryCount > m_MaxPSSCounting ? lastMemoryCount : m_MaxPSSCounting;
                m_MinPSSCounting = lastMemoryCount < m_MinPSSCounting ? lastMemoryCount : m_MinPSSCounting;
                m_AveragePSSCounting = ((ulong)m_EntryCountForAveragePSS++ * m_AveragePSSCounting + lastMemoryCount) / (ulong)m_EntryCountForAveragePSS;
            }
        }
    }
}
