using System;
using System.Collections.Generic;
using UnityEditor;
using System.Text;
using UnityEngine;
using System.Linq;
using System.Threading.Tasks;
using UnityEditor.IMGUI.Controls;
using System.Threading;
using Tuanjie.OpenHarmony.Hilog;
using System.Reflection;

namespace Tuanjie.OpenHarmony.Hilog
{
    internal enum PerformanceBlockType
    {
        GPUUsage,
        GPUFrequency,
        ProcCpuUsage,
        ProcCpuLoad,
        ProcSCpuUsage,
        ProcUCpuUsage,
        Memory,
        FPS,
        GPUThermal,
        SOCThermal,
        BatteryConsumption,
        BatteryVoltage,
        NetworkDown,
        NetworkUp
    }

    internal static class OpenHarmonyHilogPerformanceStyles
    {
        internal static string titleHexColor = "";
        internal static string gpuUsageHexColor = "#4185CA";
        internal static string gpuFrequencyHexColor = "#76B9D7";
        internal static string procCpuUsageHexColor = "#F56A20";
        internal static string procCpuLoadHexColor = "#FF9F36";
        internal static string procSCpuUsageHexColor = "#FFD48D";
        internal static string procUCpuUsageHexColor = "#D2924B";
        internal static string memoryHexColor = "#B98FC7";
        internal static string fpsHexColor = "#3EAD48";

        internal static string gpuThermalHexColor = "#EA6363";
        internal static string socThermalHexColor = "#D1C88F";

        internal static string batteryConsumeHexColor = "#398EA0";
        internal static string batteryVoltageHexColor = "#FF7F00";

        internal static string networkDownHexColor = "#50E3C2";
        internal static string networkUpHexColor = "#98A8D5";

        internal static string nativeHeapColor = "#5A3A74";

        internal static string arkTsHeapColor = "#8053A3";

        internal static string glMemoryColor = "#B39ACF";

        internal static string graphMemoryColor = "#345ABC";

        internal static string stackMemoryColor = "#4E7BA6";

        internal static string guardMemoryColor = "#729BC2";

        internal static string anonPageOtherMemoryColor = "#6F3A3A";

        internal static string hapOtherMemoryColor = "#8C4A4A";

        internal static string soOtherMemoryColor = "#B94742";

        internal static string devOtherMemoryColor = "#D87B5F";

        internal static string filePage_OtherMemoryColor = "#E6A56A";

        internal static string totalMemoryColor = "#FFDD67";

        internal static string[] memoryColorList = new string[] { nativeHeapColor, arkTsHeapColor, glMemoryColor, graphMemoryColor, stackMemoryColor, guardMemoryColor, anonPageOtherMemoryColor, hapOtherMemoryColor
            ,soOtherMemoryColor, devOtherMemoryColor, filePage_OtherMemoryColor, totalMemoryColor};
    }
    
    internal class PerformanceBlockData
    {
        public string name;
        public string colorStr;

        public int id;

        public int depth;

        public bool enable;

        public bool isTitle = false;

        public Color color;

        public Vector2 textSize;

        public double startTraceTime;

        public float minPerformanceValue = Mathf.Infinity;

        public float maxPerformanceValue = -1;

        public float averagePerformanceValue = 0;

        public bool presentAvgValue = true;

        public Queue<float> performanceValueQueue;

        public Queue<int> performanceTimeQueue;

        public Dictionary<int, float> timeToPerformanceValue;

        private bool needToUpdateDict = true;

        public int dataSize;

        public List<PerformanceBlockData> relateChildren = new List<PerformanceBlockData>();

        // Multiple Node Draw In Same Block
        public List<PerformanceBlockData> subGraph = new List<PerformanceBlockData>();

        public List<string> groupKeyWords = new List<string>();

        public int selectGroupIndex = 0;

        public string unit = "";

        protected int numberBase = 1;

        public int blockSizeCount = 1;

        public float GetMinPerformancePresentValue()
        {
            return minPerformanceValue / (numberBase * 1.0f);
        }

        public float GetMaxPerformancePresentValue()
        {
            return maxPerformanceValue / (numberBase * 1.0f);
        }

        public float GetAvgPerformancePresentValue()
        {
            return averagePerformanceValue / (numberBase * 1.0f);
        }

        public void SetNumberBase(int newBase)
        {
            numberBase = newBase;
        }

        public int GetBlockSizeCount()
        {
            return blockSizeCount;
        }

        public int GetBlockTextHegihtCount()
        {
            int height = 1;

            for (int i = 0; i < subGraph.Count; i++)
            {
                if (subGraph[i].enable)
                {
                    height += 1;
                }
            }
            return height;
        }

        public PerformanceBlockData(int id, int depth, string name, string colorStr, int dataSize, bool enableByDefault)
        {
            this.id = id;
            this.depth = depth;
            this.name = name;
            this.colorStr = colorStr;
            enable = enableByDefault;

            this.isTitle = string.IsNullOrEmpty(colorStr);

            if (!isTitle)
            {
                Color sideBarColor;

                ColorUtility.TryParseHtmlString(colorStr, out sideBarColor);

                this.color = sideBarColor;

                textSize = EditorStyles.boldLabel.CalcSize(new GUIContent(this.name));

                performanceValueQueue = new Queue<float>();

                performanceTimeQueue = new Queue<int>();

                this.dataSize = dataSize;
            }

            startTraceTime = EditorApplication.timeSinceStartup;
        }

        public bool shouldShowInInfoNode()
        {
            if (!isTitle)
            {
                return enable;
            }

            foreach (var child in relateChildren)
            {
                if (child.shouldShowInInfoNode())
                {
                    return true;
                }
            }

            return false;
        }

        public void SetChildrenList(List<PerformanceBlockData> childList)
        {
            relateChildren = childList;
        }

        public virtual void OnNewDataEnter(int time, float value)
        {
            performanceTimeQueue.Enqueue(time);

            performanceValueQueue.Enqueue(value);

            float[] queueArray = performanceValueQueue.ToArray();

            var pair = GetArrayMinMax(queueArray);

            maxPerformanceValue = pair.Item2;
            minPerformanceValue = pair.Item1;
            averagePerformanceValue = pair.Item3;

            if (maxPerformanceValue == minPerformanceValue)
            {
                float currentMax = maxPerformanceValue;

                maxPerformanceValue = Mathf.Abs(currentMax + 1);

                minPerformanceValue = 0;// -Mathf.Abs(currentMax + 1);
            }

            if (performanceValueQueue.Count > dataSize)
            {
                int oldTime = performanceTimeQueue.Dequeue();
                float oldValue = performanceValueQueue.Dequeue();
            }

            needToUpdateDict = true;
        }

        public virtual float GetValueByTimeStamp(int time)
        {
            int[] timeList = performanceTimeQueue.ToArray();

            float[] valueList = performanceValueQueue.ToArray();

            if (needToUpdateDict)
            {
                timeToPerformanceValue = new Dictionary<int, float>();

                for (int i = 0; i < timeList.Length; i++)
                {
                    if(!timeToPerformanceValue.ContainsKey(timeList[i]))
                        timeToPerformanceValue.Add(timeList[i], valueList[i]);
                    else
                    {
                        timeToPerformanceValue[timeList[i]] = valueList[i];
                    }
                }

                needToUpdateDict = false;
            }


            if (timeToPerformanceValue.ContainsKey(time))
            {
                return timeToPerformanceValue[time] / (numberBase * 1.0f);
            }
            
            return -1;
        }

        (float, float, float) GetArrayMinMax(float[] arrayMinMax)
        {
            float min = Mathf.Infinity;
            float max = -Mathf.Infinity;

            float total = 0;

            for (int i = 0; i < arrayMinMax.Length; i++)
            {
                if (arrayMinMax[i] < min)
                {
                    min = arrayMinMax[i];
                }

                if (arrayMinMax[i] > max)
                {
                    max = arrayMinMax[i];
                }

                total += arrayMinMax[i];
            }

            float average = total / arrayMinMax.Length;

            return (min, max, average);
        }

        public void ResetData()
        {
            if (performanceTimeQueue != null)
                performanceTimeQueue.Clear();

            if (performanceValueQueue != null)
                performanceValueQueue.Clear();

            minPerformanceValue = Mathf.Infinity;
            maxPerformanceValue = -1;
        }
    }

    internal class MemoryBlockSubGraph : PerformanceBlockData
    {
        public MemoryBlockSubGraph(int id, int depth, string name, string colorStr, int dataSize, bool enableByDefault) :
            base(id, depth, name, colorStr, dataSize, enableByDefault)
        {
        }

        public override void OnNewDataEnter(int time, float value)
        {
            timeToPerformanceValue = new Dictionary<int, float>();

            timeToPerformanceValue.Add(time, value);
        }

        public override float GetValueByTimeStamp(int time)
        {
            if (timeToPerformanceValue != null && timeToPerformanceValue.ContainsKey(time))
            {
                return timeToPerformanceValue[time] / (numberBase * 1.0f);
            }

            return -1;
        }
    }

    internal class PerformanceTreeView : TreeView
    {
        static class Styles
        {
            public static GUIStyle background = "RL Background";
            public static GUIStyle headerBackground = "RL Header";
        }

        private List<TreeViewItem> treeViewItems;

        private TreeViewItem rootNode;

        private List<PerformanceBlockData> dataBlockList;

        public PerformanceTreeView(TreeViewState state, List<PerformanceBlockData> dataList) : base(state)
        {
            dataBlockList = dataList;

            Reload();
        }

        protected override TreeViewItem BuildRoot()
        {
            rootNode = new TreeViewItem(-1, -1);

            treeViewItems = new List<TreeViewItem>();

            foreach (var block in dataBlockList)
            {
                TreeViewItem item = new TreeViewItem(block.id, block.depth, block.name);
                treeViewItems.Add(item);
            }

            SetupParentsAndChildrenFromDepths(rootNode, treeViewItems);

            for (int i = 0; i < treeViewItems.Count; i++)
            {
                TreeViewItem item = treeViewItems[i];
                PerformanceBlockData data = dataBlockList[i];
                if (item.hasChildren)
                {
                    SetExpanded(item.id, data.enable);
                }
            }

            return rootNode;
        }

        protected override void RowGUI(RowGUIArgs args)
        {
            var contentIndent = GetContentIndent(args.item);
            // Background
            var bgRect = args.rowRect;
            bgRect.x = contentIndent;
            bgRect.width = Mathf.Max(bgRect.width - contentIndent, 155f) - 5f;
            bgRect.yMin += 2f;
            bgRect.yMax -= 2f;
            //DrawItemBackground(bgRect);

            // Custom label
            var headerRect = bgRect;
            headerRect.xMin += 5f;
            headerRect.xMax -= 10f;
            headerRect.height = Styles.headerBackground.fixedHeight;
            HeaderGUI(headerRect, args.label, args.item);

            if (Event.current.type == EventType.MouseDown && args.rowRect.Contains(Event.current.mousePosition))
            {
                SelectionChanged(new List<int> { args.item.id });
                Event.current.Use();
            }
        }

        protected override void SelectionChanged(IList<int> selectedIds)
        {
            base.SelectionChanged(selectedIds);

            foreach (var id in selectedIds)
            {
                var item = FindItem(id, rootItem);
                if (item.hasChildren)
                {
                    bool currentIsExpanded = IsExpanded(id);

                    SetExpanded(id, !currentIsExpanded);

                    string nodeName = item.displayName;

                    bool isCpuNode = nodeName.StartsWith("CPU") && nodeName.EndsWith("CPU");

                    List<int> tickId = new List<int>();

                    foreach(var child in item.children)
                    {
                        dataBlockList[child.id].enable = !currentIsExpanded;
                    }
                }
            }
        }

        void HeaderGUI(Rect headerRect, string label, TreeViewItem item)
        {
            headerRect.y += 1f;

            Rect toggleRect = headerRect;
            toggleRect.width = 16;
            int offset = 0;

            if (!item.hasChildren)
            {
                // Do toggle
                offset = 22;
                EditorGUI.BeginChangeCheck();
                bool newStatus = EditorGUI.Toggle(toggleRect, dataBlockList[item.id].enable); // hide when outside cell rect

                if (newStatus != dataBlockList[item.id].enable && newStatus)
                {
                    dataBlockList[item.id].startTraceTime = EditorApplication.timeSinceStartup;
                    dataBlockList[item.id].ResetData();
                }

                dataBlockList[item.id].enable = newStatus;
                if (EditorGUI.EndChangeCheck())
                    RefreshCustomRowHeights();

                Rect sideBar = headerRect;

                sideBar.x += 16f;

                sideBar.y += 2f;

                sideBar.width = 4f;

                sideBar.height *= 0.6f;

                Color originColor = GUI.color;

                GUI.color = dataBlockList[item.id].color;

                EditorGUI.DrawRect(sideBar, Color.white);

                GUI.color = originColor;
            }


            Rect labelRect = headerRect;
            labelRect.xMin += offset + 2f;

            labelRect.y -= item.hasChildren ? 4 : 2;
            GUI.Label(labelRect, label, EditorStyles.boldLabel);
        }

        protected override float GetCustomRowHeight(int row, TreeViewItem item)
        {
            return 20f;
        }
    }

    /// <summary>
    /// The interface to capture performance information (of a certain process).
    /// Collect statistics of (MAX, MIN, AVG) performance usage of a process.
    /// </summary>
    internal class OpenHarmonyHilogPerformanceWindow : EditorWindow
    {

        class OpenHarmonyHilogQueryPerformanceInput : IOpenHarmonyHilogTaskInput
        {
            internal OpenHarmonyBridge.HDC hdc;
            internal int packageProcessId;
            internal string packageName;
            internal string deviceId;
            internal string command;
        }

        class OpenHarmonyHilogQueryPerformanceResult : IOpenHarmonyHilogTaskResult
        {
            internal int packageProcessId;
            internal string packageName;
            internal string contents;
            internal string deviceId;
        }

        private OpenHarmonyHilogRuntimeBase m_Runtime;
        private OpenHarmonyHilogPerformanceMemoryData m_Data;

        private Vector2 scrollPos;
        private TreeViewState treeViewState;
        private PerformanceTreeView performanceTreeView;

        private GUIStyle minMaxTestStyle;

        private GUIStyle minMaxUnitStyle;

        private GUIStyle avgTestStyle;

        private List<PerformanceBlockData> performanceBlockDatas = new List<PerformanceBlockData>();

        private Dictionary<PerformanceBlockType, PerformanceBlockData> performanceBlockDataDict = new Dictionary<PerformanceBlockType, PerformanceBlockData>();

        private List<PerformanceBlockData> cpuRelatePerformanceBlock = new List<PerformanceBlockData>();

        private List<PerformanceBlockData> rootPerformanceBlockList = new List<PerformanceBlockData>();

        private double timerWhenEnable;

        private int blockDataStoreSize = 30;

        private double timeDuration = 0;

        private double lastUpdateTime = 0;

        private int currentSelectTimeStamp = -1;

        private int currentSelectMouseX = -1;

        private int currentSelectMouseY = -1;

        private bool canTriggerMemoryProfile = false;

        private System.Diagnostics.Process currentHDCProcess;

        private bool needRepaint = false;

        Queue<string> performanceQueryResultQueue = new Queue<string>();

        StringBuilder lastQueryResult = new StringBuilder();

        int lastQueryTime = 0;

        Rect centerRect;

        // Memory Relate
        int m_LastMemoryIndex = 0;
        private OpenHarmonyMemoryStatistics[] m_MemoryEntries = null;

        const float kMaxPerformanceWindowHeight = 4000.0f;
        const float kMinPerformanceWindowWidth = 200.0f;

        private int m_RequestsInQueue = 0;

        private bool isInQueryStatus = false;

        private int maxAPeriodOfTime = 180;

        private int currentMaxPeriodTime = 0;
        private float m_TimeCounting = 0;

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
        private string m_LastError;

        internal void PostInstantiation(OpenHarmonyHilogPerformanceMemoryData data)
        {
            titleContent = new GUIContent("Performance");
            StopQueryPerformance();
            m_Data = data;
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

        }

        internal void SetExpectedDeviceAndProcess(IOpenHarmonyHilogDevice device, ProcessInformation process)
        {
            m_ExpectedDevice = device;
            m_ExpectedProcessFromRequest = process;
        }

        internal bool QueueMemoryRequest()
        {
            // Don't make a memory request, if previous requests haven't finished yet
            // Otherwise async queue will grow bigger and bigger
            const int kMaxRequestsInQueue = 3;
            //if (m_RequestsInQueue > kMaxRequestsInQueue)
            //    return false;
            m_RequestsInQueue++;
            m_Runtime.Dispatcher.Schedule(
                new OpenHarmonyHilogQueryPerformanceInput()
                {
                    hdc = OpenHarmonyBridge.HDC.GetInstance(),
                    packageProcessId = SelectedProcess.processId,
                    packageName = SelectedProcess.name,
                    deviceId = SelectedDevice.Id
                },
                QueryMemoryAsync,
                IntegrateQueryMemory,
                false);

            return true;
        }

        private IOpenHarmonyHilogTaskResult QueryCommandWithContinuoursOutputAsync(IOpenHarmonyHilogTaskInput input)
        {
            var workInput = ((OpenHarmonyHilogQueryPerformanceInput)input);
            var hdc = workInput.hdc;
            string command = workInput.command;
            string packageName = workInput.packageName;

            if (hdc == null)
                throw new NullReferenceException("HDC interface has to be valid");

            // Note: Using process id you can query memory from system apps which are not packages.
            var cmd = "-t " + workInput.deviceId;

            if (!string.IsNullOrEmpty(packageName))
            {
                cmd += " -PKG " + packageName + " -f ";
            }

            cmd = command + " " + cmd;

            OpenHarmonyHilogInternalLog.Log("{0} {1}", hdc.GetHDCPath(), cmd);

            string outputMsg = string.Empty;

            try
            {
                hdc.RunWithContinuousOutput(new[] { cmd }, $"Failed to query deviceInfo for {workInput.deviceId}", new System.Diagnostics.DataReceivedEventHandler(this.IntegrateQueryPerformanceContinuously));
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log("Failed to query memory: \n" + ex.Message);
            }

            var result = new OpenHarmonyHilogQueryPerformanceResult();
            result.deviceId = workInput.deviceId;
            result.packageProcessId = workInput.packageProcessId;
            result.packageName = packageName;
            result.contents = outputMsg;

            return result;
        }

        void ClearAllData()
        {
            foreach (var block in performanceBlockDatas)
            {
                block.ResetData();

                foreach (var child in block.relateChildren)
                {
                    child.ResetData();
                }

                foreach (var subGraph in block.subGraph)
                {
                    subGraph.ResetData();
                }
            }
        }

        void StopQueryPerformance()
        {
            isInQueryStatus = false;

            canTriggerMemoryProfile = false;

            CloseCurrentProcess();

            currentHDCProcess = null;
        }

        void CloseCurrentProcess()
        {
            if (currentHDCProcess != null)
            {
                try
                {
                    currentHDCProcess.CancelOutputRead();
                    currentHDCProcess.Kill();
                }
                catch (System.InvalidOperationException e)
                {
                    //Avoid No process is associated with this object
                }
            }
        }

        public void IntegrateQueryPerformanceContinuously(object process, System.Diagnostics.DataReceivedEventArgs e)
        {
            System.Diagnostics.Process inputProcess = (System.Diagnostics.Process)process;

            if (!inputProcess.Equals(currentHDCProcess))
            {
                CloseCurrentProcess();

                currentHDCProcess = inputProcess;
            }

            string line = e.Data;

            if (!String.IsNullOrEmpty(line))
            {
                if (line.Contains("timestamp"))
                {
                    string lastLine = lastQueryResult.ToString();

                    if (!string.IsNullOrEmpty(lastLine))
                    {
                        performanceQueryResultQueue.Enqueue(lastLine);

                        lastQueryResult.Clear();
                    }
                }
                else
                {
                    lastQueryResult.Append(line);
                }

                lastQueryResult.Append("\n");
            }
        }

        void ConsumeQueryResult()
        {
            if (performanceQueryResultQueue.Count <= 0)
                return;

            string result = performanceQueryResultQueue.Dequeue();

            string[] lineList = result.Split('\n');

            List<string> cpuInfoRelate = new List<string>();

            foreach (var line in lineList)
            {
                if (!String.IsNullOrEmpty(line))
                {
                    if (line.Contains(':'))
                    {
                        Dictionary<string, string> deviceInfoDict = new Dictionary<string, string>();

                        string[] valueSplit = line.Split(' ');

                        valueSplit[0] = valueSplit[0].Trim();

                        valueSplit[1] = valueSplit[1].Trim();

                        if (valueSplit[1].Contains("="))
                        {
                            string[] keyValueSplit = valueSplit[1].Split("=");

                            string key = keyValueSplit[0].Trim();

                            string value = keyValueSplit[1].Trim();

                            if (key.StartsWith("cpu") && Char.IsDigit(key[3]))
                            {
                                string cpuIdStr = Char.IsDigit(key[4]) ? (key[3] + "" + key[4] + "") : (key[3] + "");

                                int cpuId = int.Parse(cpuIdStr);

                                int offset = cpuId * 9;

                                string prefix = "cpu" + cpuId;

                                if (key.EndsWith(prefix + "Usage"))
                                {
                                    float fValue = (float)double.Parse(value);

                                    int cpuRelativeId = offset + 0;

                                    cpuRelatePerformanceBlock[cpuRelativeId].OnNewDataEnter(lastQueryTime, fValue);

                                }
                                else if (key.EndsWith(prefix + "Frequency"))
                                {
                                    float fValue = (float)double.Parse(value);

                                    int cpuRelativeId = offset + 1;

                                    cpuRelatePerformanceBlock[cpuRelativeId].OnNewDataEnter(lastQueryTime, fValue);
                                }
                                else if (key.EndsWith(prefix + "idleUsage"))
                                {
                                    float fValue = (float)double.Parse(value);

                                    int cpuRelativeId = offset + 2;

                                    cpuRelatePerformanceBlock[cpuRelativeId].OnNewDataEnter(lastQueryTime, fValue);
                                }
                                else if (key.EndsWith(prefix + "ioWaitUsage"))
                                {
                                    float fValue = (float)double.Parse(value);

                                    int cpuRelativeId = offset + 3;

                                    cpuRelatePerformanceBlock[cpuRelativeId].OnNewDataEnter(lastQueryTime, fValue);
                                }
                                else if (key.EndsWith(prefix + "irqUsage"))
                                {
                                    float fValue = (float)double.Parse(value);

                                    int cpuRelativeId = offset + 4;

                                    cpuRelatePerformanceBlock[cpuRelativeId].OnNewDataEnter(lastQueryTime, fValue);
                                }
                                else if (key.EndsWith(prefix + "niceUsage"))
                                {
                                    float fValue = (float)double.Parse(value);

                                    int cpuRelativeId = offset + 5;

                                    cpuRelatePerformanceBlock[cpuRelativeId].OnNewDataEnter(lastQueryTime, fValue);
                                }
                                else if (key.EndsWith(prefix + "softIrqUsage"))
                                {
                                    float fValue = (float)double.Parse(value);

                                    int cpuRelativeId = offset + 6;

                                    cpuRelatePerformanceBlock[cpuRelativeId].OnNewDataEnter(lastQueryTime, fValue);
                                }
                                else if (key.EndsWith(prefix + "systemUsage"))
                                {
                                    float fValue = (float)double.Parse(value);

                                    int cpuRelativeId = offset + 7;

                                    cpuRelatePerformanceBlock[cpuRelativeId].OnNewDataEnter(lastQueryTime, fValue);
                                }
                                else if (key.EndsWith(prefix + "userUsage"))
                                {
                                    float fValue = (float)double.Parse(value);

                                    int cpuRelativeId = offset + 8;

                                    cpuRelatePerformanceBlock[cpuRelativeId].OnNewDataEnter(lastQueryTime, fValue);
                                }
                            }
                            else
                            {
                                deviceInfoDict.Add(keyValueSplit[0], keyValueSplit[1]);
                            }
                        }

                        if (deviceInfoDict.Count > 0)
                        {
                            if (deviceInfoDict.ContainsKey("ProcCpuLoad"))
                            {
                                double deviceCPULoad = double.Parse(deviceInfoDict["ProcCpuLoad"]);
                                performanceBlockDataDict[PerformanceBlockType.ProcCpuLoad].OnNewDataEnter(lastQueryTime, (float)deviceCPULoad);
                            }
                            else if (deviceInfoDict.ContainsKey("ProcCpuUsage"))
                            {
                                double deviceCPUUsage = double.Parse(deviceInfoDict["ProcCpuUsage"]);
                                performanceBlockDataDict[PerformanceBlockType.ProcCpuUsage].OnNewDataEnter(lastQueryTime, (float)deviceCPUUsage);
                            }
                            else if (deviceInfoDict.ContainsKey("ProcSCpuUsage"))
                            {
                                double deviceSCPUUsage = double.Parse(deviceInfoDict["ProcSCpuUsage"]);
                                performanceBlockDataDict[PerformanceBlockType.ProcSCpuUsage].OnNewDataEnter(lastQueryTime, (float)deviceSCPUUsage);
                            }
                            else if (deviceInfoDict.ContainsKey("ProcUCpuUsage"))
                            {
                                double deviceUCPUUsage = double.Parse(deviceInfoDict["ProcUCpuUsage"]);
                                performanceBlockDataDict[PerformanceBlockType.ProcUCpuUsage].OnNewDataEnter(lastQueryTime, (float)deviceUCPUUsage);
                            }
                            else if (deviceInfoDict.ContainsKey("gpuLoad"))
                            {
                                double deviceGPULoad = double.Parse(deviceInfoDict["gpuLoad"]);
                                performanceBlockDataDict[PerformanceBlockType.GPUUsage].OnNewDataEnter(lastQueryTime, (float)deviceGPULoad);
                            }

                            else if (deviceInfoDict.ContainsKey("gpuFrequency"))
                            {
                                double deviceGPUFrequency = double.Parse(deviceInfoDict["gpuFrequency"]);
                                performanceBlockDataDict[PerformanceBlockType.GPUFrequency].OnNewDataEnter(lastQueryTime, (float)deviceGPUFrequency);
                            }
                            else if (deviceInfoDict.ContainsKey("gpu"))
                            {
                                double deviceGPUNum = double.Parse(deviceInfoDict["gpu"]);
                                performanceBlockDataDict[PerformanceBlockType.GPUThermal].OnNewDataEnter(lastQueryTime, (float)deviceGPUNum);
                            }
                            else if (deviceInfoDict.ContainsKey("soc_thermal"))
                            {
                                double deviceSOCNum = double.Parse(deviceInfoDict["soc_thermal"]);
                                performanceBlockDataDict[PerformanceBlockType.SOCThermal].OnNewDataEnter(lastQueryTime, (float)deviceSOCNum);
                            }
                            else if (deviceInfoDict.ContainsKey("networkDown"))
                            {
                                float deviceNetworkNum = float.Parse(deviceInfoDict["networkDown"]) / 8.0f / 1024.0f;

                                performanceBlockDataDict[PerformanceBlockType.NetworkDown].OnNewDataEnter(lastQueryTime, (float)deviceNetworkNum);
                            }
                            else if (deviceInfoDict.ContainsKey("networkUp"))
                            {
                                double deviceNetworkNum = double.Parse(deviceInfoDict["networkUp"]) / 8.0f / 1024.0f;
                                performanceBlockDataDict[PerformanceBlockType.NetworkUp].OnNewDataEnter(lastQueryTime, (float)deviceNetworkNum);
                            }
                            else if (deviceInfoDict.ContainsKey("fps"))
                            {
                                double fpsNum = double.Parse(deviceInfoDict["fps"]);
                                performanceBlockDataDict[PerformanceBlockType.FPS].OnNewDataEnter(lastQueryTime, (float)fpsNum);
                            }
                            else if (deviceInfoDict.ContainsKey("voltageNow"))
                            {
                                double voltageNowNum = double.Parse(deviceInfoDict["voltageNow"]);
                                performanceBlockDataDict[PerformanceBlockType.BatteryVoltage].OnNewDataEnter(lastQueryTime, (float)voltageNowNum);
                            }
                            else if (deviceInfoDict.ContainsKey("currentNow"))
                            {
                                float voltageNowNum = Mathf.Abs((float)double.Parse(deviceInfoDict["currentNow"]));
                                performanceBlockDataDict[PerformanceBlockType.BatteryConsumption].OnNewDataEnter(lastQueryTime, voltageNowNum);
                            }
                        }
                    }
                }
            }

            int lastIndex = (m_LastMemoryIndex - 1 + m_MemoryEntries.Length) % m_MemoryEntries.Length;
            performanceBlockDataDict[PerformanceBlockType.Memory].OnNewDataEnter(lastQueryTime, lastIndex);

            lastQueryTime += 1;
        }

        private static IOpenHarmonyHilogTaskResult QueryMemoryAsync(IOpenHarmonyHilogTaskInput input)
        {
            var workInput = ((OpenHarmonyHilogQueryPerformanceInput)input);
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
            var result = new OpenHarmonyHilogQueryPerformanceResult();
            result.deviceId = workInput.deviceId;
            result.packageName = workInput.packageName;
            result.packageProcessId = workInput.packageProcessId;
            result.contents = outputMsg;

            return result;
        }

        private void IntegrateQueryMemory(IOpenHarmonyHilogTaskResult result)
        {
            var memoryResult = (OpenHarmonyHilogQueryPerformanceResult)result;

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

            OpenHarmonyMemoryStatistics stats = m_MemoryEntries[m_LastMemoryIndex];

            m_LastMemoryIndex++;

            m_LastMemoryIndex = m_LastMemoryIndex % m_MemoryEntries.Length;

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
            //UpdateGeneralStats();
            m_OnCounting?.Invoke();

            //Repaint();
        }

        internal void OnUpdate()
        {
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

            if (isInQueryStatus)
            {
                timeDuration = EditorApplication.timeSinceStartup - timerWhenEnable;
            }

            if (canTriggerMemoryProfile && (timeDuration - lastUpdateTime) >= 0.2f)
            {
                if (SelectedDevice != null && SelectedProcess != null)
                    QueueMemoryRequest();

                canTriggerMemoryProfile = false;
            }

            if ((timeDuration - lastUpdateTime) >= 1)
            {
                if (isInQueryStatus)
                {
                    ConsumeQueryResult();

                    canTriggerMemoryProfile = true;

                    performanceQueryResultQueue.Clear();
                }

                needRepaint = true;

                if (currentMaxPeriodTime > 0)
                {
                    m_TimeCounting++;

                    if (m_TimeCounting == currentMaxPeriodTime)
                    {
                        StopQueryPerformance();
                    }
                }

                lastUpdateTime = timeDuration;
            }


            if (needRepaint)
            {
                Repaint();

                needRepaint = false;
            }
        }

        void StartQueryExpected(IOpenHarmonyHilogDevice device, ProcessInformation process)
        {
            m_ExpectedDevice = device ?? SelectedDevice;
            m_ExpectedProcessFromRequest = process ?? SelectedProcess;

            if (m_ExpectedDevice == null || !IsHilogConnected)
            {
                var notification = "Fail to capture performance, please select a device before capture";
                ShowNotification(new GUIContent(notification));
                return;
            }

            //If no a selected process, select the (process of) FOREGROUND application. 
            if (m_ExpectedProcessFromRequest == null || !m_ExpectedProcessFromRequest.IsAlive())
            {
                int topAbilityPid = 0;
                string topAbilityPackageName = string.Empty;
                if (!OpenHarmonyHilogUtilities.GetTopAbilityInfo(m_Runtime.Tools.HDC, m_ExpectedDevice, ref topAbilityPackageName, ref topAbilityPid))
                {
                    var notification = "Fail to capture performance, please open an application or select a running process before capture";
                    ShowNotification(new GUIContent(notification));
                    return;
                }
                m_ExpectedProcessFromRequest = SelectedProcess = m_Runtime.UserSettings.CreateProcessInformation(topAbilityPackageName, topAbilityPid, m_ExpectedDevice);
            }

            ThreadPool.QueueUserWorkItem(QueryPerformanceThread);

            lastQueryResult.Clear();

            timeDuration = EditorApplication.timeSinceStartup - timerWhenEnable;

            lastQueryTime = (int)Math.Round(timeDuration, MidpointRounding.AwayFromZero);

            lastUpdateTime = lastQueryTime;

            isInQueryStatus = true;

            canTriggerMemoryProfile = true;
        }

        void QueryPerformanceThread(object o)
        {
            OpenHarmonyHilogQueryPerformanceInput performanceInput = new OpenHarmonyHilogQueryPerformanceInput()
            {
                hdc = OpenHarmonyBridge.HDC.GetInstance(),
                deviceId = m_ExpectedDevice.Id,
                packageProcessId = m_ExpectedProcessFromRequest.processId,
                packageName = SelectedProcess.name,
                command = " shell SP_daemon -N 10000000 -net -p -c -g"
            };

            QueryCommandWithContinuoursOutputAsync(performanceInput);
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

            m_Runtime = m_Runtime ?? OpenHarmonyHilogContainerWindow.ContainerWindow.m_Runtime;
            m_Data = m_Data ?? OpenHarmonyHilogContainerWindow.ContainerWindow.w_HilogPerformanceMemoryData;

            m_Runtime.Closing += OnDisable;
            m_Runtime.Update += OnUpdate;
            SelectedDevice = null;
            m_Runtime.DeviceQuery.DeviceSelected += OnSelectedDevice;

            cpuRelatePerformanceBlock.Clear();
            performanceBlockDataDict.Clear();
            performanceBlockDatas.Clear();

            PerformanceBlockData current = null;

            int currentIndex = 0;
            int currentTileIndex = currentIndex;

            PerformanceBlockData titleNode = new PerformanceBlockData(currentIndex++, 0, "System", OpenHarmonyHilogPerformanceStyles.titleHexColor, blockDataStoreSize, true);
            currentTileIndex = currentIndex;

            performanceBlockDatas.Add(titleNode);

            current = new PerformanceBlockData(currentIndex++, 1, "GPU Usage", OpenHarmonyHilogPerformanceStyles.gpuUsageHexColor, blockDataStoreSize, true);
            current.unit = "%";
            performanceBlockDataDict.Add(PerformanceBlockType.GPUUsage, current);
            performanceBlockDatas.Add(current);

            current = new PerformanceBlockData(currentIndex++, 1, "GPU Frequency", OpenHarmonyHilogPerformanceStyles.gpuFrequencyHexColor, blockDataStoreSize, true);
            current.SetNumberBase(1000000);
            current.unit = "MHz";
            performanceBlockDataDict.Add(PerformanceBlockType.GPUFrequency, current);
            performanceBlockDatas.Add(current);

            List<PerformanceBlockData> childNodeList = new List<PerformanceBlockData>();

            for (int c = currentTileIndex; c < currentIndex; c++)
            {
                childNodeList.Add(performanceBlockDatas[c]);
            }
            titleNode.SetChildrenList(new List<PerformanceBlockData> { performanceBlockDatas[1], performanceBlockDatas[2] });

            titleNode.SetChildrenList(childNodeList);

            rootPerformanceBlockList.Add(titleNode);

            titleNode = new PerformanceBlockData(currentIndex++, 0, "Package", OpenHarmonyHilogPerformanceStyles.titleHexColor, blockDataStoreSize, true);
            currentTileIndex = currentIndex;

            performanceBlockDatas.Add(titleNode);

            current = new PerformanceBlockData(currentIndex++, 1, "ProcCpuUsage", OpenHarmonyHilogPerformanceStyles.procCpuUsageHexColor, blockDataStoreSize, true);
            current.unit = "%";
            performanceBlockDataDict.Add(PerformanceBlockType.ProcCpuUsage, current);
            performanceBlockDatas.Add(current);

            current = new PerformanceBlockData(currentIndex++, 1, "ProcCpuLoad", OpenHarmonyHilogPerformanceStyles.procCpuLoadHexColor, blockDataStoreSize, true);
            current.unit = "%";
            performanceBlockDataDict.Add(PerformanceBlockType.ProcCpuLoad, current);
            performanceBlockDatas.Add(current);

            current = new PerformanceBlockData(currentIndex++, 1, "ProcSCpuUsage", OpenHarmonyHilogPerformanceStyles.procSCpuUsageHexColor, blockDataStoreSize, true);
            current.unit = "%";
            performanceBlockDataDict.Add(PerformanceBlockType.ProcSCpuUsage, current);
            performanceBlockDatas.Add(current);

            current = new PerformanceBlockData(currentIndex++, 1, "ProcUCpuUsage", OpenHarmonyHilogPerformanceStyles.procUCpuUsageHexColor, blockDataStoreSize, true);
            current.unit = "%";
            performanceBlockDataDict.Add(PerformanceBlockType.ProcUCpuUsage, current);
            performanceBlockDatas.Add(current);

            current = new PerformanceBlockData(currentIndex++, 1, "Memory", OpenHarmonyHilogPerformanceStyles.memoryHexColor, blockDataStoreSize, true);
            current.blockSizeCount = 2;
            current.unit = "kb";
            current.SetNumberBase(8 * 1024);
            current.presentAvgValue = false;

            int relativeSubIndex = 0;

            foreach (var type in m_Runtime.StaticData.m_AllMemoryTypes)
            {
                string newColorStr = OpenHarmonyHilogPerformanceStyles.memoryColorList[relativeSubIndex];

                MemoryBlockSubGraph inner = new MemoryBlockSubGraph((int)type, 1, Enum.GetName(typeof(MemoryType), type), newColorStr, blockDataStoreSize, true);
                inner.unit = "kb";
                inner.SetNumberBase(8 * 1024);
                inner.enable = true;

                current.subGraph.Add(inner);

                relativeSubIndex++;
            }



            foreach (var type in m_Runtime.StaticData.m_AllMemoryPageTypes)
            {
                current.groupKeyWords.Add(Enum.GetName(typeof(MemoryPageType), type));
            }

            performanceBlockDataDict.Add(PerformanceBlockType.Memory, current);
            performanceBlockDatas.Add(current);

            var titleNode2 = new PerformanceBlockData(currentIndex++, 1, "CPU Detail Info", OpenHarmonyHilogPerformanceStyles.titleHexColor, blockDataStoreSize, true);
            performanceBlockDatas.Add(titleNode2);

            int nextBlockIndex = currentIndex;

            List<PerformanceBlockData> cpuRootNodeList = new List<PerformanceBlockData>();

            Color currentCPUColor;

            ColorUtility.TryParseHtmlString(OpenHarmonyHilogPerformanceStyles.procUCpuUsageHexColor, out currentCPUColor);

            for (int cpuIndex = 0; cpuIndex < 12; cpuIndex++)
            {
                var titleCPUNode = new PerformanceBlockData(nextBlockIndex++, 2, "CPU " + cpuIndex + " Detail", OpenHarmonyHilogPerformanceStyles.titleHexColor, blockDataStoreSize, false);

                performanceBlockDatas.Add(titleCPUNode);

                cpuRootNodeList.Add(titleCPUNode);

                currentCPUColor.r = 1 - 0.08f * cpuIndex;

                string newColorStr = "#" + ColorUtility.ToHtmlStringRGB(currentCPUColor);

                PerformanceBlockData currentU = new PerformanceBlockData(nextBlockIndex++, 3, "CPU " + cpuIndex + " Usage", newColorStr, blockDataStoreSize, false);
                currentU.unit = "%";
                performanceBlockDatas.Add(currentU);

                PerformanceBlockData currentF = new PerformanceBlockData(nextBlockIndex++, 3, "CPU " + cpuIndex + " Frequency", newColorStr, blockDataStoreSize, false);
                currentF.SetNumberBase(1000000);
                currentF.unit = "GHz";
                performanceBlockDatas.Add(currentF);

                PerformanceBlockData currentIdle = new PerformanceBlockData(nextBlockIndex++, 3, "CPU " + cpuIndex + " idleUsage", newColorStr, blockDataStoreSize, false);
                currentIdle.unit = "%";
                performanceBlockDatas.Add(currentIdle);

                PerformanceBlockData currentIo = new PerformanceBlockData(nextBlockIndex++, 3, "CPU " + cpuIndex + " ioWaitUsage", newColorStr, blockDataStoreSize, false);
                currentIo.unit = "%";
                performanceBlockDatas.Add(currentIo);

                PerformanceBlockData currentIrq = new PerformanceBlockData(nextBlockIndex++, 3, "CPU " + cpuIndex + " irqUsage", newColorStr, blockDataStoreSize, false);
                currentIrq.unit = "%";
                performanceBlockDatas.Add(currentIrq);

                PerformanceBlockData currentNice = new PerformanceBlockData(nextBlockIndex++, 3, "CPU " + cpuIndex + " niceUsage", newColorStr, blockDataStoreSize, false);
                currentNice.unit = "%";
                performanceBlockDatas.Add(currentNice);

                PerformanceBlockData currentSoftIrq = new PerformanceBlockData(nextBlockIndex++, 3, "CPU " + cpuIndex + " softIrqUsage", newColorStr, blockDataStoreSize, false);
                currentSoftIrq.unit = "%";
                performanceBlockDatas.Add(currentSoftIrq);

                PerformanceBlockData currentSystemUsage = new PerformanceBlockData(nextBlockIndex++, 3, "CPU " + cpuIndex + " systemUsage", newColorStr, blockDataStoreSize, false);
                currentSystemUsage.unit = "%";
                performanceBlockDatas.Add(currentSystemUsage);

                PerformanceBlockData currentUserUsage = new PerformanceBlockData(nextBlockIndex++, 3, "CPU " + cpuIndex + " userUsage", newColorStr, blockDataStoreSize, false);
                currentUserUsage.unit = "%";
                performanceBlockDatas.Add(currentUserUsage);

                List<PerformanceBlockData> currentList = new List<PerformanceBlockData> { currentU, currentF, currentIdle, currentIo, currentIrq, currentNice, currentSoftIrq, currentSystemUsage, currentUserUsage };

                titleCPUNode.SetChildrenList(currentList);

                cpuRelatePerformanceBlock.AddRange(currentList);
            }

            titleNode2.SetChildrenList(cpuRootNodeList);

            childNodeList = new List<PerformanceBlockData>();

            for (int c = currentTileIndex; c < currentIndex; c++)
            {
                childNodeList.Add(performanceBlockDatas[c]);
            }

            titleNode.SetChildrenList(childNodeList);

            rootPerformanceBlockList.Add(titleNode);

            currentIndex = nextBlockIndex;

            titleNode = new PerformanceBlockData(currentIndex++, 0, "Others", OpenHarmonyHilogPerformanceStyles.titleHexColor, blockDataStoreSize, true);
            currentTileIndex = currentIndex;

            performanceBlockDatas.Add(titleNode);

            current = new PerformanceBlockData(currentIndex++, 1, "FPS", OpenHarmonyHilogPerformanceStyles.fpsHexColor, blockDataStoreSize, true);
            performanceBlockDataDict.Add(PerformanceBlockType.FPS, current);
            performanceBlockDatas.Add(current);

            current = new PerformanceBlockData(currentIndex++, 1, "GPU Thermal", OpenHarmonyHilogPerformanceStyles.gpuThermalHexColor, blockDataStoreSize, true);
            current.unit = "°C";
            performanceBlockDataDict.Add(PerformanceBlockType.GPUThermal, current);
            performanceBlockDatas.Add(current);

            current = new PerformanceBlockData(currentIndex++, 1, "SOC Thermal", OpenHarmonyHilogPerformanceStyles.socThermalHexColor, blockDataStoreSize, true);
            current.unit = "°C";
            performanceBlockDataDict.Add(PerformanceBlockType.SOCThermal, current);
            performanceBlockDatas.Add(current);

            current = new PerformanceBlockData(currentIndex++, 1, "Battery Consumption", OpenHarmonyHilogPerformanceStyles.batteryConsumeHexColor, blockDataStoreSize, true);
            current.unit = "mAh";
            performanceBlockDataDict.Add(PerformanceBlockType.BatteryConsumption, current);
            performanceBlockDatas.Add(current);

            current = new PerformanceBlockData(currentIndex++, 1, "Battery Voltage", OpenHarmonyHilogPerformanceStyles.batteryVoltageHexColor, blockDataStoreSize, true);

            current.unit = "v";
            current.SetNumberBase(1000000);
            performanceBlockDataDict.Add(PerformanceBlockType.BatteryVoltage, current);
            performanceBlockDatas.Add(current);

            current = new PerformanceBlockData(currentIndex++, 1, "Network Down", OpenHarmonyHilogPerformanceStyles.networkDownHexColor, blockDataStoreSize, true);
            current.unit = "kb/s";
            performanceBlockDataDict.Add(PerformanceBlockType.NetworkDown, current);
            performanceBlockDatas.Add(current);

            current = new PerformanceBlockData(currentIndex++, 1, "Network Up", OpenHarmonyHilogPerformanceStyles.networkUpHexColor, blockDataStoreSize, true);
            current.unit = "kb/s";
            performanceBlockDataDict.Add(PerformanceBlockType.NetworkUp, current);
            performanceBlockDatas.Add(current);

            childNodeList = new List<PerformanceBlockData>();

            for (int c = currentTileIndex; c < currentIndex; c++)
            {
                childNodeList.Add(performanceBlockDatas[c]);
            }

            titleNode.SetChildrenList(childNodeList);

            rootPerformanceBlockList.Add(titleNode);

            if (treeViewState == null)
            {
                treeViewState = new TreeViewState();
            }

            performanceTreeView = new PerformanceTreeView(treeViewState, performanceBlockDatas);

            minMaxTestStyle = new GUIStyle(EditorStyles.miniLabel);

            minMaxTestStyle.fontSize = 9;

            minMaxUnitStyle = new GUIStyle(EditorStyles.miniBoldLabel);

            minMaxUnitStyle.fontSize = 9;

            avgTestStyle = new GUIStyle(EditorStyles.boldLabel);

            avgTestStyle.fontSize = 9;

            timerWhenEnable = EditorApplication.timeSinceStartup;

            m_MemoryEntries = m_MemoryEntries ?? m_Data.m_Entries;

            m_OnCounting += HandleCountingMemoryStatistics;

            Init();
        }

        private void Init()
        {
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

            m_OnCounting -= HandleCountingMemoryStatistics;

            m_Runtime = null;

            StopQueryPerformance();

            SelectedDevice = null;

            SelectedProcess = null;
        }

        internal void DoGUI()
        {
            GUILayout.BeginVertical();
            GUILayout.BeginHorizontal();

            OpenHarmonyHilogCommonGUIElements.HandleSelectedDeviceField(m_Runtime, ref m_SelectedDevice, ref m_SelectedProcess, HandleDeviceSelection);

            GUILayout.Space(3);
            OpenHarmonyHilogCommonGUIElements.HandleSelectedProcess(m_Runtime, ref m_SelectedDevice, ref m_SelectedProcess, HandleProcessSelection);

            if (!isInQueryStatus)
            {
                if (GUILayout.Button(OpenHarmonyHilogStyles.kPerformancePlay, OpenHarmonyHilogStyles.toolbarButton, GUILayout.MinWidth(40), GUILayout.MaxWidth(120)))
                {
                    StartQueryExpected(SelectedDevice, SelectedProcess);
                    currentMaxPeriodTime = 0;
                }
            }
            else
            {
                if (GUILayout.Button(OpenHarmonyHilogStyles.kPerformanceDisconnect, OpenHarmonyHilogStyles.toolbarButton, GUILayout.MinWidth(40), GUILayout.MaxWidth(120)))
                {
                    StopQueryPerformance();
                }
            }

            if (GUILayout.Button(OpenHarmonyHilogStyles.kPerformanceReconnect, OpenHarmonyHilogStyles.toolbarButton, GUILayout.MinWidth(40), GUILayout.MaxWidth(120)))
            {
                StopQueryPerformance();
                ClearAllData();
                StartQueryExpected(SelectedDevice, SelectedProcess);
                currentMaxPeriodTime = 0;
            }

            if (GUILayout.Button(OpenHarmonyHilogStyles.kPerformanceClearButtonText, OpenHarmonyHilogStyles.toolbarButton, GUILayout.MinWidth(40), GUILayout.MaxWidth(120)))
            {
                ClearAllData();
            }

            GUILayout.EndHorizontal();

            scrollPos = GUILayout.BeginScrollView(scrollPos);
            GUILayout.BeginHorizontal();

            GUILayout.BeginVertical(GUILayout.Width(kMinPerformanceWindowWidth));
            GUILayout.Space(10);
            var deviceSelectRect = GUILayoutUtility.GetLastRect();
            GUILayout.BeginHorizontal();

            performanceTreeView.OnGUI(new Rect(scrollPos.x, scrollPos.y + 5, kMinPerformanceWindowWidth, position.height));
            GUILayout.EndHorizontal();
            GUILayout.EndVertical();
            var rc = GUILayoutUtility.GetLastRect();
            GUI.backgroundColor = Color.black;

            GUILayout.BeginVertical();

            List<int> validBlock = GetValidBlockId();

            float textGap = GetMaxTextWidth(validBlock) + 13;

            int blockCount = 0;

            foreach (var index in validBlock)
            {
                blockCount += performanceBlockDatas[index].GetBlockSizeCount();
            }

            blockCount = blockCount == 0 ? 1 : blockCount;

            float averagesize = this.position.height / blockCount;

            averagesize = Mathf.Clamp(averagesize, 200, this.position.height / 2f);

            var upperBarHeight = Mathf.Clamp(this.position.height, blockCount * averagesize + 80, kMaxPerformanceWindowHeight);
            var size = GUILayoutUtility.GetRect(GUIContent.none, OpenHarmonyHilogStyles.internalLogStyle, GUILayout.Height(upperBarHeight));
            size.height -= 4;

            GUI.Box(new Rect(rc.x + 4, size.y, rc.width - 4, size.height + 1), GUIContent.none, EditorStyles.helpBox);
            GUI.Box(new Rect(size.x, size.y, size.width + 1, size.height + 1), GUIContent.none, EditorStyles.helpBox);

            centerRect = size;

            centerRect.y = 40;

            centerRect.x += textGap;

            centerRect.width -= textGap;

            float gap = centerRect.width / 30;

            Rect titleRect = centerRect;

            titleRect.y = scrollPos.y + 40;

            Dictionary<int, int> timeToStartPos = DrawTitle(titleRect, gap);

            int[] keysArray = new int[timeToStartPos.Count];
            timeToStartPos.Keys.CopyTo(keysArray, 0);

            Array.Sort(keysArray);

            centerRect.width += textGap;

            centerRect.x -= textGap;

            centerRect.y += 20;

            List<Rect> blockRect = DecideBlockSize(centerRect, averagesize, validBlock);

            for (int i = 0; i < blockRect.Count; i++)
            {
                Rect currentBlockRect = blockRect[i];

                if (!centerRect.Contains(currentBlockRect.position))
                {
                    continue;
                }

                int validId = validBlock[i];

                DrawEachSideBar(blockRect[i], performanceBlockDatas[validId]);

                if (SelectedDevice == null)
                {
                    continue;
                }

                int blockTime = (int)(performanceBlockDatas[validId].startTraceTime - timerWhenEnable);

                if (timeToStartPos.ContainsKey(blockTime))
                {
                    currentBlockRect.x = timeToStartPos[blockTime];

                    currentBlockRect.width = (centerRect.x + centerRect.width) - currentBlockRect.x;

                    DrawEachBlock(currentBlockRect, performanceBlockDatas[validId], timeToStartPos);
                }
                else if (keysArray.Length > 0)
                {
                    currentBlockRect.x = timeToStartPos[keysArray[0]];

                    currentBlockRect.width = (centerRect.x + centerRect.width) - currentBlockRect.x;

                    DrawEachBlock(currentBlockRect, performanceBlockDatas[validId], timeToStartPos);
                }

            }

            if (timeToStartPos.Count > 0)
                DoSelectedStatsGUI(size, timeToStartPos, gap);

            if (timeToStartPos.ContainsKey(currentSelectTimeStamp))
            {
                Rect verticalLineRect = size;

                verticalLineRect.width = 4;

                verticalLineRect.x = timeToStartPos[currentSelectTimeStamp] + verticalLineRect.width / 2;

                DrawVerticalLine(verticalLineRect);

                int kInfoWidth = 300;

                var infoX = verticalLineRect.x + 20;
                if (infoX + kInfoWidth > centerRect.x + centerRect.width)
                    infoX -= kInfoWidth + 40;

                Vector2 textHeight = EditorStyles.boldLabel.CalcSize(new GUIContent("System"));

                int validNodeCount = 0;

                foreach (var node in performanceBlockDatas)
                {
                    if (node.shouldShowInInfoNode())
                    {
                        validNodeCount += node.GetBlockTextHegihtCount();
                    }
                }

                validNodeCount += 4;

                Rect infoRect = new Rect(currentSelectMouseX, currentSelectMouseY, kInfoWidth, validNodeCount * textHeight.y + 20);

                Color origin = GUI.color;

                Color originBGColor = GUI.backgroundColor;

                GUI.backgroundColor = new Color(0.7f, 0.7f, 0.7f);

                GUI.Box(infoRect, GUIContent.none, GUI.skin.window);

                infoRect.x += 40f;

                infoRect.y += 20f;

                Rect originInfoRect = infoRect;

                Rect timeTextRect = infoRect;

                string currentTimeStr = "Timestamp : ";

                GUIContent currentTimeStrGUIContent = new GUIContent(currentTimeStr);

                string currentTimeLabelStr = currentSelectTimeStamp + "s";

                GUIContent currentTimeLabelGUIContent = new GUIContent(currentTimeLabelStr);

                Vector2 textSize = EditorStyles.boldLabel.CalcSize(currentTimeStrGUIContent);

                timeTextRect.width = textSize.x;

                timeTextRect.height = textSize.y;

                GUI.Label(timeTextRect, currentTimeStrGUIContent, EditorStyles.boldLabel);

                textSize = EditorStyles.boldLabel.CalcSize(currentTimeLabelGUIContent);

                timeTextRect.x += 2 + timeTextRect.width;

                timeTextRect.width = textSize.x;

                timeTextRect.height = textSize.y;

                GUI.color = Color.red;

                GUI.Label(timeTextRect, currentTimeLabelGUIContent, EditorStyles.boldLabel);

                GUI.color = origin;

                infoRect.y += timeTextRect.height + 2;

                foreach (var root in rootPerformanceBlockList)
                {
                    infoRect = DrawBlockDataInInfoWindow(infoRect, root, currentSelectTimeStamp);

                    infoRect.x = originInfoRect.x;

                    infoRect.y += textHeight.y;
                }
                GUI.backgroundColor = originBGColor;


            }

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

            GUILayout.EndVertical();

            EditorGUILayout.EndScrollView();
        }

        Rect DrawBlockDataInInfoWindow(Rect rootRect, PerformanceBlockData root, int timeStamp)
        {
            Rect nameRect = rootRect;

            Color origin = GUI.color;

            if (root.shouldShowInInfoNode())
            {
                if (root.isTitle)
                {
                    GUI.color = Color.white;

                    Rect simulatorRect = new Rect(nameRect.x - 10, nameRect.y, 8, 8);

                    GUI.DrawTexture(simulatorRect, OpenHarmonyHilogStyles.kTick_DeviceInfo);

                    GUI.color = Color.grey;

                    string content = root.name + " : ";

                    Vector2 textSize = EditorStyles.boldLabel.CalcSize(new GUIContent(content));

                    nameRect.width = textSize.x;

                    nameRect.height = textSize.y;

                    GUI.Label(nameRect, content, EditorStyles.boldLabel);

                    float originX = nameRect.x;

                    nameRect.x += 20;

                    nameRect.y += textSize.y;

                    foreach (var child in root.relateChildren)
                    {
                        nameRect = DrawBlockDataInInfoWindow(nameRect, child, timeStamp);
                    }

                    nameRect.x = originX;

                    GUI.color = origin;
                }
                else
                {
                    GUI.color = Color.grey;

                    string content = root.name + " : ";

                    string value = root.subGraph.Count > 0 ? "" : root.GetValueByTimeStamp(timeStamp).ToString(".00");

                    Vector2 textSize = EditorStyles.boldLabel.CalcSize(new GUIContent(content));

                    nameRect.width = textSize.x;

                    nameRect.height = textSize.y;

                    GUI.Label(nameRect, content, EditorStyles.boldLabel);

                    Vector2 valueSize = EditorStyles.boldLabel.CalcSize(new GUIContent(value));

                    Rect valueRect = nameRect;

                    valueRect.x += textSize.x;

                    valueRect.width = valueSize.x;

                    GUI.color = Color.white;

                    GUI.Label(valueRect, value, EditorStyles.boldLabel);

                    Rect unitRect = valueRect;

                    nameRect.y += textSize.y;

                    Vector2 unitSize = minMaxUnitStyle.CalcSize(new GUIContent(root.unit));

                    unitRect.x += valueSize.x + 1;

                    unitRect.y += valueSize.y - unitSize.y;

                    unitRect.width = unitSize.x;

                    unitRect.height = unitSize.y;

                    GUI.color = new Color(0.5f, 0.5f, 0f);

                    if (!string.IsNullOrEmpty(value))
                    {
                        GUI.Label(unitRect, root.unit, minMaxUnitStyle);
                    }

                    if (root.subGraph.Count > 0)
                    {
                        float originX = nameRect.x;

                        nameRect.x += 20;

                        foreach (var subGraph in root.subGraph)
                        {
                            if (subGraph.enable)
                            {
                                string subGraphContent = subGraph.name + " : ";

                                GUIContent subGraphName = new GUIContent(subGraphContent);

                                Vector2 subGraphSize = EditorStyles.boldLabel.CalcSize(new GUIContent(subGraphName));

                                nameRect.width = subGraphSize.x;

                                nameRect.height = subGraphSize.y;

                                GUI.color = Color.grey;

                                GUI.Label(nameRect, subGraphContent, EditorStyles.boldLabel);

                                subGraphContent = subGraph.GetValueByTimeStamp(timeStamp) + "";

                                subGraphSize = EditorStyles.boldLabel.CalcSize(new GUIContent(subGraphContent));

                                Rect subValueRect = nameRect;

                                subValueRect.width = subGraphSize.x;

                                subValueRect.height = subGraphSize.y;

                                subValueRect.x += nameRect.width + 2;

                                GUI.color = Color.white;

                                GUI.Label(subValueRect, subGraphContent, EditorStyles.boldLabel);

                                Rect unitRect2 = subValueRect;

                                Vector2 unitSize2 = minMaxUnitStyle.CalcSize(new GUIContent(subGraph.unit));

                                unitRect2.x += subValueRect.width + 1;

                                unitRect2.y += subValueRect.height - unitSize2.y;

                                unitRect2.width = unitSize2.x;

                                unitRect2.height = unitSize2.y;

                                GUI.color = new Color(0.5f, 0.5f, 0f);

                                GUI.Label(unitRect2, subGraph.unit, minMaxUnitStyle);

                                nameRect.y += nameRect.height;
                            }
                        }

                        nameRect.x = originX;
                    }
                }
            }

            GUI.color = origin;

            return nameRect;
        }

        List<int> GetValidBlockId()
        {
            List<int> result = new List<int>();

            foreach (var block in performanceBlockDatas)
            {
                if (!block.isTitle && block.enable)
                {
                    result.Add(block.id);
                }
            }

            return result;
        }

        List<Rect> DecideBlockSize(Rect rect, float blockHeight, List<int> validBlock)
        {
            List<Rect> result = new List<Rect>();

            int blockCount = validBlock.Count;

            float rectY = rect.y;

            for (int i = 0; i < blockCount; i++)
            {
                var blockId = validBlock[i];

                var data = performanceBlockDatas[blockId];

                Rect backRect = new Rect(rect.x, (int)rectY, rect.width, data.GetBlockSizeCount() * blockHeight);

                rectY += data.GetBlockSizeCount() * blockHeight;

                result.Add(backRect);
            }

            return result;
        }

        float GetMaxTextWidth(List<int> validIdList)
        {
            float maxWidth = 0;

            for (int i = 0; i < validIdList.Count; i++)
            {
                float currentTextWidth = performanceBlockDatas[validIdList[i]].textSize.x;

                if (currentTextWidth > maxWidth)
                {
                    maxWidth = currentTextWidth;
                }
            }

            return maxWidth;

        }

        Dictionary<int, int> DrawTitle(Rect titleRect, float gap)
        {
            List<int> titleIndexList = new List<int>();

            Color origin = GUI.color;

            titleRect.x -= 10;

            titleRect.width -= 10;

            Rect smallTagRect = titleRect;

            smallTagRect.y -= 5;

            smallTagRect.width = 2;

            smallTagRect.height = 5;

            float titleRectWidth = titleRect.width;

            float initX = titleRectWidth % gap;

            int count = (int)(titleRectWidth / gap);

            float accumulateGap = initX;

            for (int j = 0; j <= count; j++)
            {
                Rect offset = smallTagRect;

                offset.x += accumulateGap;

                GUI.color = Color.grey;

                if (j != 0)
                {
                    EditorGUI.DrawRect(offset, Color.white);
                }

                accumulateGap += gap;

                titleIndexList.Add((int)accumulateGap);
            }

            DrawLine(titleRect);

            GUI.color = origin;

            Dictionary<int, int> timeToStartPos = DrawTitleTime(smallTagRect, titleIndexList);

            return timeToStartPos;
        }

        Dictionary<int, int> DrawTitleTime(Rect lastRect, List<int> index)
        {
            Dictionary<int, int> timeToStartPos = new Dictionary<int, int>();

            int time = (int)(lastQueryTime);

            int forLoopTime = Mathf.Min(time + 1, index.Count);

            for (int i = 0; i < forLoopTime; i++)
            {
                Rect offset = lastRect;

                int realTimeInt = (time - i);

                string timeContent = realTimeInt + "s";

                offset.x += index[index.Count - 1 - i];

                timeToStartPos.Add(realTimeInt, (int)offset.x);

                Vector2 smallMaxWordSize = minMaxTestStyle.CalcSize(new GUIContent(timeContent));

                offset.y -= smallMaxWordSize.y;

                offset.x -= smallMaxWordSize.x / 2;

                offset.width = smallMaxWordSize.x;

                offset.height = smallMaxWordSize.y;

                GUI.Label(offset, timeContent, minMaxTestStyle);
            }

            return timeToStartPos;
        }

        void DrawLine(Rect windowRect)
        {
            GUI.color = new Color(0.83f, 0.78f, 0.78f);

            Rect lineRect = windowRect;

            lineRect.height = 1;

            EditorGUI.DrawRect(lineRect, Color.grey);
        }

        void DrawVerticalLine(Rect windowRect)
        {
            GUI.color = new Color(0.83f, 0.78f, 0.78f);

            Rect lineRect = windowRect;

            lineRect.width = 1;

            EditorGUI.DrawRect(lineRect, Color.white);
        }

        void DrawEachSideBar(Rect rect, PerformanceBlockData data)
        {
            Color originColor = GUI.color;

            Rect sideBarRect = rect;

            sideBarRect.x += 5;

            sideBarRect.width = 5f;

            sideBarRect.height *= 0.7f;

            sideBarRect.y = rect.y + (rect.height - sideBarRect.height) / 2;

            Color bgColor = data.color;

            GUI.color = bgColor;

            EditorGUI.DrawRect(sideBarRect, Color.white);

            Rect nameRect = sideBarRect;

            nameRect.x += 10;

            nameRect.width = rect.width;

            GUI.color = Color.white;

            Vector2 textSize = EditorStyles.boldLabel.CalcSize(new GUIContent(data.name));

            nameRect.width = textSize.x;

            nameRect.height = textSize.y;

            GUI.Label(nameRect, data.name, EditorStyles.boldLabel);

            if (data.presentAvgValue)
            {
                string avgNum = "AVG: " + data.GetAvgPerformancePresentValue().ToString(".00") + data.unit;

                Vector2 avgTextSize = EditorStyles.boldLabel.CalcSize(new GUIContent(avgNum));

                Rect avgRect = sideBarRect;

                avgRect.x += sideBarRect.width + 10;

                avgRect.y += sideBarRect.height;

                avgRect.y -= avgTextSize.y;

                avgRect.width = avgTextSize.x;

                avgRect.height = avgTextSize.y;

                GUI.Label(avgRect, avgNum, avgTestStyle);
            }

            if (data.subGraph.Count > 0)
            {
                Rect groupRect = nameRect;

                groupRect.y += Mathf.Min(20, 0.1f * rect.height);

                groupRect.width = Mathf.Max(110, rect.width * 0.09f);

                groupRect.height = Mathf.Min(500, rect.height * 0.6f);

                Color groupRectColor;

                ColorUtility.TryParseHtmlString("#404040", out groupRectColor);

                EditorGUI.DrawRect(groupRect, groupRectColor);

                GUI.Label(nameRect, data.name, EditorStyles.boldLabel);

                GUIContent groupContent = new GUIContent("Group :");

                Vector2 groupWordSize = EditorStyles.label.CalcSize(groupContent);

                Rect groupLabelRect = groupRect;

                groupLabelRect.x += 5;

                groupLabelRect.y += 5;

                groupLabelRect.width = groupWordSize.x;

                groupLabelRect.height = groupWordSize.y;

                GUI.Label(groupLabelRect, groupContent, EditorStyles.label);

                Rect selectionRect = groupLabelRect;

                selectionRect.y += 5 + groupLabelRect.height;

                selectionRect.width = groupRect.width - 10;

                GUI.backgroundColor = Color.white;

                List<string> selectionKeyList = new List<string>();

                for (int i = 0; i < data.groupKeyWords.Count; i++)
                {
                    selectionKeyList.Add(data.groupKeyWords[i]);
                }

                data.selectGroupIndex = EditorGUI.Popup(selectionRect, "", data.selectGroupIndex, selectionKeyList.ToArray());

                Rect startNameLabel = selectionRect;

                startNameLabel.y += 30;

                float currentMaxWidth = 0;

                float originY = startNameLabel.y;

                for (int i = 0; i < data.subGraph.Count; i++)
                {
                    Rect groupKeyRect = startNameLabel;

                    string content = data.subGraph[i].name;
                    GUIContent guiContent = new GUIContent(content);
                    Vector2 wordSize = minMaxTestStyle.CalcSize(guiContent);

                    if (wordSize.x > currentMaxWidth)
                    {
                        currentMaxWidth = wordSize.x;
                    }

                    Rect toggleRect = groupKeyRect;

                    data.subGraph[i].enable = EditorGUI.Toggle(toggleRect, data.subGraph[i].enable); // hide when outside cell rect

                    groupKeyRect.x += 20;

                    groupKeyRect.width = wordSize.x;

                    groupKeyRect.height = wordSize.y;

                    GUI.Label(groupKeyRect, guiContent, minMaxTestStyle);

                    startNameLabel.y += 2 + groupKeyRect.height;

                    Rect colorRect = groupKeyRect;

                    colorRect.x -= 5;

                    colorRect.width = 5;

                    Color currentColor = data.subGraph[i].color;

                    EditorGUI.DrawRect(colorRect, currentColor);
                }
            }

            GUI.color = originColor;
        }

        void DrawEachBlock(Rect rect, PerformanceBlockData data, Dictionary<int, int> timeToStartPos)
        {
            if (data.subGraph.Count == 0)
            {
                DrawEachNormalBlock(rect, data, timeToStartPos);
            }
            else
            {
                DrawMemoryBlock(rect, data, timeToStartPos);
            }
        }

        void DawLineGraph(float heightPosDiff, float heightStartPosY, Dictionary<int, (bool, Vector2)> pointPosList, Color lineColor)
        {
            float lineWidth = Mathf.Max(3f, heightPosDiff * 0.01f);

            List<int> keys = new List<int>(pointPosList.Keys);

            keys.Sort();

            bool lastNodeValid = false;

            for(int i = 0; i < keys.Count; i++)
            {
                var currentNode = pointPosList[keys[i]];

                if(!lastNodeValid && currentNode.Item1)
                {
                    GL.Begin(GL.TRIANGLE_STRIP);
                }

                lastNodeValid = currentNode.Item1;

                if (lastNodeValid)
                {
                    Vector2 point = currentNode.Item2;
                    GL.Color(lineColor);
                    GL.Vertex3(point.x, point.y, 0);
                    GL.Color(lineColor);
                    GL.Vertex3(point.x, point.y + lineWidth, 0);
                }

                int nextIndex = i + 1;

                if(i == (keys.Count - 1) || nextIndex < (keys.Count - 1) && lastNodeValid && !pointPosList[keys[nextIndex]].Item1)
                {
                    GL.End();
                }
            }

            lastNodeValid = false;

            Color lineBGColor = lineColor;

            for (int i = 0; i < keys.Count; i++)
            {
                var currentNode = pointPosList[keys[i]];

                if (!lastNodeValid && currentNode.Item1)
                {
                    GL.Begin(GL.TRIANGLE_STRIP);
                }

                lastNodeValid = currentNode.Item1;

                if (lastNodeValid)
                {
                    Vector2 point = currentNode.Item2;
                    float alpha = (heightStartPosY - point.y) / heightPosDiff * 0.7f;

                    lineBGColor.a = alpha;

                    GL.Color(lineBGColor);
                    GL.Vertex3(point.x, point.y, 0);

                    lineBGColor.a = 0;
                    GL.Color(lineBGColor);
                    GL.Vertex3(point.x, heightStartPosY, 0);
                }

                int nextIndex = i + 1;

                if (i == (keys.Count - 1) || nextIndex < (keys.Count - 1) && lastNodeValid && !pointPosList[keys[nextIndex]].Item1)
                {
                    GL.End();
                }
            }
        }

        void DrawEachNormalBlock(Rect rect, PerformanceBlockData data, Dictionary<int, int> timeToStartPos)
        {
            Color originColor = GUI.color;

            GUI.color = Color.white;

            Vector2 heightPosBetweenTwoLine = new Vector2(0, 0);

            Rect backgroundRect = rect;

            Rect upperLineRect = backgroundRect;

            upperLineRect.y += backgroundRect.height * 0.1f;

            heightPosBetweenTwoLine.x = upperLineRect.y;

            DrawLine(upperLineRect);

            string maxContent = "Max : " + data.GetMaxPerformancePresentValue().ToString(".00") + data.unit;

            Vector2 smallMaxWordSize = minMaxTestStyle.CalcSize(new GUIContent(maxContent));

            Rect maxWorldRect = upperLineRect;

            maxWorldRect.x += 3;

            maxWorldRect.y += 3;

            maxWorldRect.width = smallMaxWordSize.x;

            maxWorldRect.height = smallMaxWordSize.y;

            GUI.Label(maxWorldRect, maxContent, minMaxTestStyle);

            string minContent = "Min : " + data.GetMinPerformancePresentValue().ToString(".00") + data.unit;

            Vector2 smallMinWordSize = minMaxTestStyle.CalcSize(new GUIContent(minContent));

            upperLineRect.y -= backgroundRect.height * 0.2f;

            upperLineRect.y += rect.height;

            Rect minWorldRect = upperLineRect;

            minWorldRect.x += 3;

            minWorldRect.y -= 3;

            minWorldRect.y -= smallMinWordSize.y;

            minWorldRect.width = smallMinWordSize.x;

            minWorldRect.height = smallMinWordSize.y;

            GUI.Label(minWorldRect, minContent, minMaxTestStyle);

            DrawLine(upperLineRect);

            heightPosBetweenTwoLine.y = upperLineRect.y;

            float rectWidth = (heightPosBetweenTwoLine.y - heightPosBetweenTwoLine.x);

            //heightPosBetweenTwoLine.x += rectWidth * 0.2f;

            //heightPosBetweenTwoLine.y -= rectWidth * 0.2f;

            Color bgColor = data.color;

            GUI.color = bgColor;

            bgColor.a = 0.2f;

            GUI.color = bgColor;

            GUI.color = originColor;

            int[] timeList = data.performanceTimeQueue.ToArray();

            float[] valueList = data.performanceValueQueue.ToArray();

            Dictionary<int, (bool, Vector2)> timeToLinePoint = new Dictionary<int, (bool, Vector2)>();

            foreach(var pair in timeToStartPos)
            {
                timeToLinePoint.Add(pair.Key, (false, Vector2.zero));
            }

            for (int i = 0; i < timeList.Length - 1; i++)
            {
                int pointTime = (int)timeList[i];

                float value = valueList[i];

                if (timeToStartPos.ContainsKey(pointTime))
                {
                    float x = timeToStartPos[pointTime];

                    float y = heightPosBetweenTwoLine.y - (value - data.minPerformanceValue) / (data.maxPerformanceValue - data.minPerformanceValue) * (heightPosBetweenTwoLine.y - heightPosBetweenTwoLine.x);

                    timeToLinePoint[pointTime] = (true, new Vector2(x, y));
                }
            }

            float heightPosDiff = heightPosBetweenTwoLine.y - heightPosBetweenTwoLine.x;

            DawLineGraph(heightPosDiff, heightPosBetweenTwoLine.y, timeToLinePoint, data.color);
        }

        void DrawMemoryBlock(Rect rect, PerformanceBlockData data, Dictionary<int, int> timeToStartPos)
        {
            List<int> validFrameList = new List<int>();

            List<int> validTimeList = new List<int>();

            foreach (var pair in timeToStartPos)
            {
                int time = pair.Key;

                int validId = (int)data.GetValueByTimeStamp(time);

                if (validId >= 0)
                {
                    validTimeList.Add(pair.Key);
                    validFrameList.Add(validId);
                }
            }
            int selectGroup = data.selectGroupIndex;

            List<List<List<float>>> timeToMemoryPageToMemoryTypeDict = new List<List<List<float>>>();

            foreach (int frame in validFrameList)
            {
                OpenHarmonyMemoryStatistics currentFrame = m_MemoryEntries[frame];

                List<List<float>> pageValue = new List<List<float>>();

                foreach (var memoryPageType in m_Runtime.StaticData.m_AllMemoryPageTypes)
                {
                    List<float> memoryPageValue = new List<float>();

                    foreach (var memoryType in m_Runtime.StaticData.m_AllMemoryTypes)
                    {
                        float current = (float)currentFrame.GetValue(memoryPageType, memoryType);

                        memoryPageValue.Add(current);
                    }

                    pageValue.Add(memoryPageValue);
                }
                timeToMemoryPageToMemoryTypeDict.Add(pageValue);
            }

            List<float> maxValueInSelect = new List<float>();

            foreach (var list in timeToMemoryPageToMemoryTypeDict)
            {
                List<float> totalList = list[selectGroup];

                float currentTotal = totalList[totalList.Count - 1];

                maxValueInSelect.Add(currentTotal);
            }

            data.maxPerformanceValue = maxValueInSelect.Count > 0 ? maxValueInSelect.Max() : 0;

            data.minPerformanceValue = -1;

            Color originColor = GUI.color;

            GUI.color = Color.white;

            Vector2 heightPosBetweenTwoLine = new Vector2(0, 0);

            Rect backgroundRect = rect;

            Rect upperLineRect = backgroundRect;

            upperLineRect.y += backgroundRect.height * 0.1f;

            heightPosBetweenTwoLine.x = upperLineRect.y;

            DrawLine(upperLineRect);

            string maxContent = "Max : " + data.GetMaxPerformancePresentValue().ToString(".00") + data.unit;

            Vector2 smallMaxWordSize = minMaxTestStyle.CalcSize(new GUIContent(maxContent));

            Rect maxWorldRect = upperLineRect;

            maxWorldRect.x += 3;

            maxWorldRect.y += 3;

            maxWorldRect.width = smallMaxWordSize.x;

            maxWorldRect.height = smallMaxWordSize.y;

            GUI.Label(maxWorldRect, maxContent, minMaxTestStyle);

            string minContent = "Min : " + data.GetMinPerformancePresentValue().ToString(".00") + data.unit;

            Vector2 smallMinWordSize = minMaxTestStyle.CalcSize(new GUIContent(minContent));

            upperLineRect.y -= backgroundRect.height * 0.2f;

            upperLineRect.y += rect.height;

            Rect minWorldRect = upperLineRect;

            minWorldRect.x += 3;

            minWorldRect.y -= 3;

            minWorldRect.y -= smallMinWordSize.y;

            minWorldRect.width = smallMinWordSize.x;

            minWorldRect.height = smallMinWordSize.y;

            GUI.Label(minWorldRect, minContent, minMaxTestStyle);

            DrawLine(upperLineRect);

            heightPosBetweenTwoLine.y = upperLineRect.y;

            float rectWidth = (heightPosBetweenTwoLine.y - heightPosBetweenTwoLine.x);

            //heightPosBetweenTwoLine.x += rectWidth * 0.2f;

            //heightPosBetweenTwoLine.y -= rectWidth * 0.2f;

            Color bgColor = data.color;

            GUI.color = bgColor;

            bgColor.a = 0.2f;

            GUI.color = bgColor;

            GUI.color = originColor;

            int[] timeList = validTimeList.ToArray();

            List<List<float>> valueLists = new List<List<float>>();

            foreach (var memoryType in m_Runtime.StaticData.m_AllMemoryTypes)
            {
                valueLists.Add(new List<float>());
            }

            for (int i = 0; i < timeList.Length - 1; i++)
            {
                int pointTime = (int)timeList[i];

                var frameData = timeToMemoryPageToMemoryTypeDict[i];

                var groupData = frameData[selectGroup];

                for (int j = 0; j < groupData.Count; j++)
                {
                    valueLists[j].Add(groupData[j]);
                }
            }

            Dictionary<int, (bool, Vector2)> timeToLinePoint = new Dictionary<int, (bool, Vector2)>();

            foreach (var pair in timeToStartPos)
            {
                timeToLinePoint.Add(pair.Key, (false, Vector2.zero));
            }

            for (int v = 0; v < valueLists.Count; v++)
            {
                if (data.subGraph[v].enable)
                {
                    float[] valueList = valueLists[v].ToArray();

                    for (int i = 0; i < timeList.Length - 1; i++)
                    {
                        int pointTime = (int)timeList[i];

                        float value = valueList[i];

                        if (timeToStartPos.ContainsKey(pointTime))
                        {
                            float x = timeToStartPos[pointTime];

                            float y = heightPosBetweenTwoLine.y - (value - data.minPerformanceValue) / (data.maxPerformanceValue - data.minPerformanceValue) * (heightPosBetweenTwoLine.y - heightPosBetweenTwoLine.x);

                            timeToLinePoint[pointTime] = (true, new Vector2(x, y));
                        }
                    }

                    float heightPosDiff = heightPosBetweenTwoLine.y - heightPosBetweenTwoLine.x;

                    DawLineGraph(heightPosDiff, heightPosBetweenTwoLine.y, timeToLinePoint, data.subGraph[v].color);
                }
            }
        }



        private void HandleCountingMemoryStatistics()
        {
            
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

            ClearAllData();
            StopQueryPerformance();

            SelectedProcess = newProcess;
        }

        void OnGUI()
        {
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

        private void DoSelectedStatsGUI(Rect windowSize, Dictionary<int, int> timeToStartPos, float gap)
        {
            var e = Event.current;
            if ((e.type == EventType.MouseDown) && windowSize.Contains(e.mousePosition))
            {
                int mousePosX = (int)e.mousePosition.x;

                float minDistance = Mathf.Infinity;

                int targetPosX = -1;

                currentSelectTimeStamp = -1;

                foreach (var pair in timeToStartPos)
                {
                    float posDiff = Mathf.Abs(pair.Value - mousePosX);

                    if (posDiff < minDistance)
                    {
                        minDistance = posDiff;

                        targetPosX = pair.Value;

                        currentSelectTimeStamp = pair.Key;

                        int kInfoWidth = 300;

                        float verticalLineRectX = timeToStartPos[currentSelectTimeStamp] + 2;

                        var infoX = verticalLineRectX;
                        if (infoX + kInfoWidth > centerRect.x + centerRect.width)
                            infoX -= kInfoWidth + 40;

                        currentSelectMouseX = (int)infoX;

                        currentSelectMouseY = (int)e.mousePosition.y;

                        PerformanceBlockData memoryBlock = performanceBlockDataDict[PerformanceBlockType.Memory];

                        int validId = (int)memoryBlock.GetValueByTimeStamp(currentSelectTimeStamp);

                        if (validId >= 0)
                        {
                            foreach (var type in m_Runtime.StaticData.m_AllMemoryTypes)
                            {
                                int typeIndex = (int)type;

                                OpenHarmonyMemoryStatistics relateMemoryBlock = m_MemoryEntries[validId];

                                float value = relateMemoryBlock.GetValue((MemoryPageType)memoryBlock.selectGroupIndex, type);

                                memoryBlock.subGraph[typeIndex].OnNewDataEnter(currentSelectTimeStamp, value);
                            }
                        }
                    }
                }

                if (!(targetPosX > 0 && minDistance <= gap))
                {
                    currentSelectTimeStamp = -1;
                }

                Repaint();
            }
        }
    }
}

internal class OpenHarmonyHilogPerformanceMemoryData
{
    const int kMaxEntries = 30;
    internal OpenHarmonyMemoryStatistics[] m_Entries = new OpenHarmonyMemoryStatistics[kMaxEntries];

    internal OpenHarmonyHilogPerformanceMemoryData(OpenHarmonyHilogRuntimeBase runtime)
    {
        var m_AllMemoryGroups = runtime.StaticData.m_AllMemoryGroups;
        var m_AllMemoryPageTypes = runtime.StaticData.m_AllMemoryPageTypes;
        var m_AllMemoryTypes = runtime.StaticData.m_AllMemoryTypes;
        for (int i = 0; i < kMaxEntries; i++)
            m_Entries[i] = new OpenHarmonyMemoryStatistics(m_AllMemoryGroups, m_AllMemoryPageTypes, m_AllMemoryTypes);
    }
}
