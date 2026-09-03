using System;
using UnityEditor;
using UnityEngine;
using System.Threading.Tasks;
using static Tuanjie.OpenHarmony.Hilog.EditorGUIBridge;
using System.Collections.Generic;
using System.Threading;

namespace Tuanjie.OpenHarmony.Hilog
{
    /// <summary>
    /// The interface to show ArkUI information
    /// Show ArkUI tree on the editor or save it as a *.dump file (Text file).
    /// </summary>
    public class OpenHarmonyHilogDeviceInfoWindow : EditorWindow
    {
        class OpenHarmonyHilogQueryDeviceInfoInput : IOpenHarmonyHilogTaskInput
        {
            internal OpenHarmonyBridge.HDC hdc;
            internal string deviceId;
            internal string command;
        }

        class OpenHarmonyHilogQueryDeviceInfoResult : IOpenHarmonyHilogTaskResult
        {
            internal string deviceId;
            internal string content;
        }

        private Vector2 scrollPos;

        private OpenHarmonyHilogRuntimeBase m_Runtime;

        #region GUIContent GUIStyles And Texture2D

        private Texture2D kSimulator;

        private Texture2D kTick;

        private Texture2D kBackground;

        private Texture2D kBatteryBackground;

        private Texture2D kBatteryGroup;

        private Texture2D kBatteryBG;

        private Texture2D kBatteryFG;

        private Texture2D kBatteryEF;

        private GUIStyle boldTextType;

        private GUIStyle boldTitleType;

        private GUIStyle boldFeatureType;

        private GUIStyle boldSideDigitType;

        private GUIStyle boldNumberType;
        #endregion

        private float powerNumber = 0f;

        private int powerIncreaseDir = 1;

        Texture deviceBasicInfoImage;

        public object dockerWithButtonRef;

        #region Show Content Set

        string deviceTypeName = "";

        string deviceFullName = "";

        string deviceModel = "";

        string deviceName = "";

        string deviceSN = "";

        string deviceVersion = "";

        string deviceScreenResolution = "";

        string deviceScreenRefreshRate = "";

        string deviceCPUNumber = "";

        string deviceCPUMax = "";

        string deviceCPUMin = "";

        string deviceCPUClusterName = "";

        string deviceGPUMaxFrequency = "";

        string deviceGPUMinFrequency = "";

        string deviceNetworkDown = "0";

        string deviceNetworkUp = "0";

        string deviceGPUThermal = "0";

        string deviceSOCThermal = "0";

        string devicePowerVoltage = "0";

        #endregion

        double lastPullTime = 0f;

        int m_RequestsInQueue = 0;

        int maxRequestsInQueue = 4;

        bool needRepaint = false;

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

        private string lastTraceDevieId = "";

        private System.Diagnostics.Process currentHDCProcess = null;

        internal void PostInstantiation()
        {
            titleContent = new GUIContent("Device Info");
            RefreshProcessAndCounter();
        }

        void RefreshProcessAndCounter()
        {
            m_RequestsInQueue = 0;

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

        private void OnGUI()
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

            GUILayout.BeginVertical();

            //scrollPos = EditorGUILayout.BeginScrollView(scrollPos);

            GUILayout.BeginHorizontal();

            float windowWidth = 361;

            Rect bgRect = new Rect(10, 20, windowWidth, 360);

            GUI.DrawTexture(bgRect, kBackground);

            Rect leftSquare = EditorGUILayout.BeginVertical(GUILayout.MaxWidth(windowWidth), GUILayout.MaxHeight(319));
            {
                GUILayout.Space(30);

                GUILayout.BeginHorizontal();

                //GUILayout.Box(kSimulator, GUILayout.MaxWidth(20), GUILayout.MinWidth(20));

                //GUI.DrawTexture(new Rect(10,5,16,16), kSimulator);

                GUILayout.Space(54);

                EditorGUILayout.LabelField("Device Basic Info", boldTitleType);

                Rect labelRect = GUILayoutUtility.GetLastRect();

                Rect simulatorRect = new Rect(labelRect.x - 20, labelRect.y, 16, 16);

                GUI.DrawTexture(simulatorRect, kSimulator);

                GUILayout.EndHorizontal();

                //GUILayout.Space(1);

                GUILayout.BeginHorizontal();

                GUILayout.Space(64);

                EditorGUILayout.LabelField("Device & System Info :", boldTextType);

                labelRect = GUILayoutUtility.GetLastRect();

                Rect kickRect = new Rect(labelRect.x - 16, labelRect.y, 8, 8);

                GUI.DrawTexture(kickRect, kTick);

                GUILayout.EndHorizontal();

                CreateLabelGUI(new Vector2(80, 1), "Device type name : ", deviceTypeName, "#5070C1", boldTextType);
                CreateLabelGUI(new Vector2(80, 1), "Device full name : ", deviceFullName, "#5070C1", boldTextType);
                CreateLabelGUI(new Vector2(80, 1), "Model : ", deviceModel, "#5070C1", boldTextType);
                CreateLabelGUI(new Vector2(80, 1), "Name : ", deviceName, "#5070C1",boldTextType);
                CreateLabelGUI(new Vector2(80, 1), "SN : ", deviceSN, "#5070C1", boldTextType);
                CreateLabelGUI(new Vector2(80, 1), "Version : ", deviceVersion, "#5070C1", boldTextType);

                //GUILayout.Space(2);

                GUILayout.BeginHorizontal();

                GUILayout.Space(64);

                EditorGUILayout.LabelField("Screen Info :", boldTextType);

                labelRect = GUILayoutUtility.GetLastRect();

                kickRect = new Rect(labelRect.x - 16, labelRect.y, 8, 8);

                GUI.DrawTexture(kickRect, kTick);

                GUILayout.EndHorizontal();

                CreateLabelGUI(new Vector2(80, 1), "Screen resolution (activeMode) : ", deviceScreenResolution, "#5070C1", boldTextType);
                CreateLabelGUI(new Vector2(80, 1), "Screen refresh rate (refreshrate) : ", deviceScreenRefreshRate, "#5070C1", boldTextType);

                //GUILayout.Space(2);

                GUILayout.BeginHorizontal();

                GUILayout.Space(64);

                EditorGUILayout.LabelField("CPU Info :", boldTextType);

                labelRect = GUILayoutUtility.GetLastRect();

                kickRect = new Rect(labelRect.x - 16, labelRect.y, 8, 8);

                GUI.DrawTexture(kickRect, kTick);

                GUILayout.EndHorizontal();

                CreateLabelGUI(new Vector2(80, 1), "CPU number (cpu_c1_cluster) : ", deviceCPUNumber, "#5070C1", boldTextType);
                CreateLabelGUI(new Vector2(80, 1), "CPU max (cpu_c1_cluster) : ", deviceCPUMax, "#5070C1", boldTextType);
                CreateLabelGUI(new Vector2(80, 1), "CPU min (cpu_c1_min) : ", deviceCPUMin, "#5070C1", boldTextType);
                CreateLabelGUI(new Vector2(80, 1), "CPU cluster name : ", deviceCPUClusterName, "#5070C1", boldTextType);

                GUILayout.Space(2);

                GUILayout.BeginHorizontal();

                GUILayout.Space(64);

                EditorGUILayout.LabelField("GPU Info :", boldTextType);

                labelRect = GUILayoutUtility.GetLastRect();

                kickRect = new Rect(labelRect.x - 16, labelRect.y + 5, 8, 8);

                GUI.DrawTexture(kickRect, kTick);

                GUILayout.EndHorizontal();

                CreateLabelGUI(new Vector2(80, 1), "GPU Frequency : ", deviceGPUMaxFrequency, "#5070C1", boldTextType);
                CreateLabelGUI(new Vector2(80, 1), "GPU Load : ", deviceGPUMinFrequency, "#5070C1", boldTextType);

            }

            EditorGUILayout.EndVertical();

            //leftSquare.position = new Vector2(10, 10);

            //leftSquare.size = new Vector2(361, 319);

            Rect batteryBgRect = new Rect(10, 380, windowWidth, 118);

            GUI.DrawTexture(batteryBgRect, kBatteryBackground);

            GUILayout.Space(-310);

            Rect rightSquare = EditorGUILayout.BeginVertical(GUILayout.MaxWidth(361), GUILayout.MaxHeight(118));
            {
                GUILayout.Space(390);

                EditorGUILayout.LabelField("Battery Info", boldTitleType);

                Rect labelRect = GUILayoutUtility.GetLastRect();

                Rect groupRect = new Rect(labelRect.x - 20, labelRect.y, 16, 16);

                GUI.DrawTexture(groupRect, kBatteryGroup);

                float wordOffsetK = -5;

                GUILayout.Space(wordOffsetK);

                CreateLabelGUI(new Vector2(120, 5), "Battery voltage : ", "", "#5070C1", boldTitleType);

                Rect lastLabelRect = GUILayoutUtility.GetLastRect();

                Rect batteryAmount = new Rect(lastLabelRect.x, lastLabelRect.y - wordOffsetK, 94, 70);

                GUI.DrawTexture(batteryAmount, kBatteryBG);

                Color origin = GUI.color;

                GUI.color = DecidePowerAmountColor(powerNumber);

                Rect batteryEffectRect = batteryAmount;

                float ratio = (powerNumber / 100.0f);

                float inverseRatio = 1 - (powerNumber / 100.0f);

                float offset = Mathf.Lerp(-20, 20, inverseRatio);

                batteryEffectRect.y += offset;

                Rect batteryMaskRect = batteryAmount;

                batteryMaskRect.x += 10;

                batteryMaskRect.width = 70;

                batteryMaskRect.height = (40 - inverseRatio * 40);

                batteryMaskRect.y += 55 - batteryMaskRect.height;

                EditorGUI.DrawRect(batteryMaskRect, Color.white);

                GUI.DrawTexture(batteryEffectRect, kBatteryEF);

                Color foreGroundColor = Color.white;

                foreGroundColor.a = 0.5f;

                GUI.color = foreGroundColor;

                GUI.DrawTexture(batteryAmount, kBatteryFG);

                GUI.color = origin;

                GUILayout.Space(5);

                Rect batteryCenterAmount = batteryAmount;

                string powerNumberStr = DecidePowerAmountText(powerNumber);

                GUIContent powerNumberGUI = new GUIContent(powerNumberStr + "%");

                Vector2 size = boldTitleType.CalcSize(powerNumberGUI);

                batteryCenterAmount.x += 20;// size.x / 2;

                batteryCenterAmount.y -= size.y / 2;

                EditorGUI.LabelField(batteryCenterAmount, powerNumberGUI, boldNumberType);

                GUILayout.Space(-5);
                
                Vector2 voltageSize = CreateLabelGUI(new Vector2(120, 5), "", devicePowerVoltage, "#5070C1", boldFeatureType);

                Rect batteryVoltageRect = GUILayoutUtility.GetLastRect();

                batteryVoltageRect.x += 120 + voltageSize.x;

                batteryVoltageRect.y += 8;

                EditorGUI.LabelField(batteryVoltageRect, "<color=\"#5070C1\">v</color>", boldSideDigitType);

                GUILayout.Space(-10);

                CreateLabelGUI(new Vector2(120, 5), "", "Realtime data", "#5070C1", boldTextType);

            }

            EditorGUILayout.EndVertical();

            rightSquare.position = new Vector2(10, 380);

            rightSquare.size = new Vector2(windowWidth, 118);

            GUILayout.EndHorizontal();

            GUILayout.BeginHorizontal();

            CreateFeatureGUI(new Vector2(50, 20), 2, "Network Down", deviceNetworkDown, "Realtime data", "#50E3C2", "kb/s", true, boldTitleType, boldFeatureType);

            CreateFeatureGUI(new Vector2(-30, 20), 2, "Network Up", deviceNetworkUp, "Realtime data", "#5070C1", "kb/s",true, boldTitleType, boldFeatureType);

            GUILayout.EndHorizontal();

            GUILayout.BeginHorizontal();

            CreateFeatureGUI(new Vector2(50, 20), 2, "GPU Thermal", deviceGPUThermal, "Realtime data", "#EA6363", "°C", false, boldTitleType, boldFeatureType);

            CreateFeatureGUI(new Vector2(-30, 20), 2, "SOC Thermal", deviceSOCThermal, "Realtime data", "#D1C88F", "°C", false, boldTitleType, boldFeatureType);

            GUILayout.EndHorizontal();

            //CreateFeatureGUI(new Vector2(0, 0), 5, "Network Up", "XXX", "Realtime data", "#5070C1", boldTitleType, boldFeatureType);

            //CreateFeatureGUI(new Vector2(0, 0), 5, "GPU Thermal", "XXX", "Realtime data", "#EA6363", boldTitleType, boldFeatureType);

            //CreateFeatureGUI(new Vector2(0, 0), 5, "SOC Thermal", "XXX", "Realtime data", "#D1C88F", boldTitleType, boldFeatureType);

            //EditorGUILayout.EndScrollView();

            GUILayout.EndVertical();
        }

        private string DecidePowerAmountText(float power)
        {
            string powerNumberStr = power.ToString(".00");

            string[] powerNumberStrList = powerNumberStr.Split('.');
            if (powerNumberStrList[0].Length < 2)
            {
                for (int i = 0; i < (2 - powerNumberStrList[0].Length); i++)
                {
                    powerNumberStr = "0" + powerNumberStr;
                }
            }
            else if (powerNumberStrList[0].Equals("100"))
            {
                powerNumberStr = "100.0";
            }

            return powerNumberStr;
        }

        private Color DecidePowerAmountColor(float power)
        {
            Color result = Color.red;

            float split1 = 10;

            float split2 = 60;

            float split3 = 90;

            if(power < split1)
            {
                result = Color.red;
            }
            else if(power >= split1 && power < split2)
            {
                float ratio = (power - split1) / (split2 - split1);
                result = Color.Lerp(Color.red, Color.yellow, ratio);
            }
            else if (power >= split2 && power < split3)
            {
                float ratio = (power - split2) / (split3 - split2);
                result = Color.Lerp(Color.yellow, Color.green, ratio);
            }
            else if (power >= split3)
            {
                result = Color.green;
            }

            result.a = 0.4f;

            return result;
        }

        private Vector2 CreateLabelGUI(Vector2 spaceLeftAndTop, string label,string content,string color, GUIStyle textStyle)
        {
            //GUILayout.Space(spaceLeftAndTop.y);

            GUILayout.BeginHorizontal();

            GUILayout.Space(spaceLeftAndTop.x);

            string richText = label + "<color=" + color + ">" + content + "</color>";

            Vector2 size = textStyle.CalcSize(new GUIContent(content));

            EditorGUILayout.LabelField(richText, textStyle,GUILayout.MinHeight(size.y));

            GUILayout.EndHorizontal();

            return size;
        }

        private void CreateFeatureGUI(Vector2 spaceLeftAndTop, float gapSize, string label, string content, string subContent, string color, string unitText, bool hasDigit, GUIStyle textStyle1, GUIStyle textStyle2)
        {
            GUILayout.Space(spaceLeftAndTop.x);

            Rect bottomSquare = EditorGUILayout.BeginVertical(GUILayout.MaxWidth(130), GUILayout.MaxHeight(100));
            {
                GUILayout.Space(spaceLeftAndTop.y);

                GUILayout.BeginHorizontal();

                GUILayout.BeginVertical();

                //GUILayout.Space(spaceLeftAndTop.y);

                GUILayout.BeginHorizontal();

                GUILayout.Space(gapSize);

                Vector2 labelSize = textStyle1.CalcSize(new GUIContent(label));

                EditorGUILayout.LabelField(label, textStyle1, GUILayout.MinHeight(labelSize.y));

                //--------------------------------------------------------------------------------

                Color origin = GUI.color;

                Color sideBarColor;

                ColorUtility.TryParseHtmlString(color, out sideBarColor);

                GUI.color = sideBarColor;

                Rect lastRect = GUILayoutUtility.GetLastRect();

                Rect sideBarRect = new Rect(lastRect.x - 20, lastRect.y, 5, 90);

                EditorGUI.DrawRect(sideBarRect, Color.white);

                GUI.color = origin;

                //--------------------------------------------------------------------------------

                GUILayout.EndHorizontal();

                GUILayout.BeginHorizontal();

                GUILayout.Space(gapSize);

                string[] contentSplit = content.Split('.');

                string digitContent = "";

                if (contentSplit.Length == 2)
                {
                    content = contentSplit[0];

                    if (hasDigit)
                    {
                        content += ".";

                        digitContent = contentSplit[1];
                    }
                }

                string richText = "<color=" + color + ">" + content + "</color>";

                Vector2 size = textStyle2.CalcSize(new GUIContent(content));

                EditorGUILayout.LabelField(richText, textStyle2, GUILayout.MinHeight(size.y), GUILayout.MaxWidth(size.x + 10));

                GUILayout.Space(-10);

                digitContent += unitText;

                GUILayout.BeginVertical();

                Vector2 sizeDigit = boldSideDigitType.CalcSize(new GUIContent(digitContent));

                GUILayout.Space(size.y - sizeDigit.y - 5);

                string richDigitText = "<color=" + color + ">" + digitContent + "</color>";

                //Vector2 sizeDigit = boldSideDigitType.CalcSize(new GUIContent(digitContent));

                EditorGUILayout.LabelField(richDigitText, boldSideDigitType, GUILayout.MinHeight(sizeDigit.y), GUILayout.MaxWidth(sizeDigit.x));

                GUILayout.EndVertical();

                GUILayout.EndHorizontal();

                GUILayout.BeginHorizontal();

                GUILayout.Space(gapSize);

                string subRichText = "<color=" + color + ">" + subContent + "</color>";

                Vector2 size2 = boldTextType.CalcSize(new GUIContent(subContent));

                EditorGUILayout.LabelField(subRichText, boldTextType, GUILayout.MinHeight(size2.y));

                GUILayout.EndHorizontal();

                GUILayout.EndVertical();

                GUILayout.EndHorizontal();
            }

            GUILayout.EndVertical();
        }

        internal void OnUpdate()
        {
            var deviceQuery = m_Runtime.DeviceQuery;

            string deviceId = m_Runtime.UserSettings.LastSelectedDeviceId;

            if (!lastTraceDevieId.Equals(deviceId) && !string.IsNullOrEmpty(deviceId))
            {
                lastTraceDevieId = deviceId;

                m_Runtime.Dispatcher.Schedule(
                new OpenHarmonyHilogQueryDeviceInfoInput()
                {
                    hdc = OpenHarmonyBridge.HDC.GetInstance(),
                    deviceId = deviceId,
                    command = " shell SP_daemon -deviceinfo"
                },
                QueryCommandAsync,
                IntegrateQueryDeviceInfo,
                true);

                m_Runtime.Dispatcher.Schedule(
                new OpenHarmonyHilogQueryDeviceInfoInput()
                {
                   hdc = OpenHarmonyBridge.HDC.GetInstance(),
                   deviceId = deviceId,
                   command = " shell SP_daemon -screen"
                },
                QueryCommandAsync,
                IntegrateQueryDeviceResolution,
                true);

                RefreshProcessAndCounter();
            }

            double deltaTime = EditorApplication.timeSinceStartup - lastPullTime;

            if(deltaTime > 4f && !string.IsNullOrEmpty(deviceId))
            {
                m_Runtime.Dispatcher.Schedule(
                new OpenHarmonyHilogQueryDeviceInfoInput()
                {
                    hdc = OpenHarmonyBridge.HDC.GetInstance(),
                    deviceId = deviceId,
                    command = " shell hidumper -s BatteryService -a -i"
                },
                QueryCommandAsync,
                IntegrateQueryDeviceBatteryAmount,
                true);

                lastPullTime = EditorApplication.timeSinceStartup;
            }

            if (m_RequestsInQueue < 1 && !string.IsNullOrEmpty(deviceId))
            {
                /*m_Runtime.Dispatcher.Schedule(
                new OpenHarmonyHilogQueryDeviceInfoInput()
                {
                    hdc = OpenHarmonyBridge.HDC.GetInstance(),
                    deviceId = deviceId,
                    command = " shell SP_daemon -N 36000 -t -net -p"
                },
                QueryCommandWithContinuoursOutputAsync,
                IntegrateQueryDeviceNetAndThermal,
                false);*/

                ThreadPool.QueueUserWorkItem(QueryDeviceInfoThread);

                m_RequestsInQueue += 1;
            }

            if (needRepaint)
            {
                Repaint();

                needRepaint = false;
            }
        }

        void QueryDeviceInfoThread(object o)
        {
            OpenHarmonyHilogQueryDeviceInfoInput deviceInput = new OpenHarmonyHilogQueryDeviceInfoInput()
            {
                hdc = OpenHarmonyBridge.HDC.GetInstance(),
                deviceId = m_Runtime.UserSettings.LastSelectedDeviceId,
                command = " shell SP_daemon -N 36000 -t -net -p"
            };

            QueryCommandWithContinuoursOutputAsync(deviceInput);
        }

        private void SelectProcess(ProcessInformation newProcess)
        {
            if ((SelectedProcess == null && newProcess == null) ||
                (newProcess != null && SelectedProcess != null && newProcess.name == SelectedProcess.name && newProcess.processId == SelectedProcess.processId))
                return;

            OpenHarmonyHilogInternalLog.Log("Selecting process {0}", newProcess == null ? "<null>" : newProcess.DisplayName);

            SelectedProcess = newProcess;
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

            if (m_Runtime == null)
                m_Runtime = OpenHarmonyHilogContainerWindow.ContainerWindow.m_Runtime;

            m_Runtime.Closing += OnDisable;

            SelectedDevice = null;

            m_Runtime.DeviceQuery.DeviceSelected += OnSelectedDevice;

            m_Runtime.Update += OnUpdate;

            kSimulator = OpenHarmonyHilogStyles.kSimulator_DeviceInfo;

            kTick = OpenHarmonyHilogStyles.kTick_DeviceInfo;

            kBackground = OpenHarmonyHilogStyles.kBackground_DeviceInfo;

            kBatteryBackground = OpenHarmonyHilogStyles.kBatteryBackground_DeviceInfo;

            kBatteryGroup = OpenHarmonyHilogStyles.kBatteryGroup_DeviceInfo;

            kBatteryEF = OpenHarmonyHilogStyles.kBatteryEF_DeviceInfo;

            kBatteryBG = OpenHarmonyHilogStyles.kBatteryBG_DeviceInfo;

            kBatteryFG = OpenHarmonyHilogStyles.kBatteryFG_DeviceInfo;

            boldTextType = new GUIStyle(EditorStyles.boldLabel);

            boldTextType.fontSize = 9;

            boldTextType.stretchWidth = false;

            boldTextType.richText = true;

            boldTextType.margin = new RectOffset(0, 0, -3, -3);

            boldTextType.wordWrap = true;

            boldTitleType = new GUIStyle(EditorStyles.boldLabel);

            boldTitleType.fontSize = 10;

            boldTitleType.richText = true;

            boldNumberType = new GUIStyle(EditorStyles.boldLabel);

            boldNumberType.fontSize = 13;

            boldNumberType.richText = true;

            boldFeatureType = new GUIStyle(EditorStyles.boldLabel);

            boldFeatureType.fontSize = 50;

            boldFeatureType.richText = true;

            boldSideDigitType  = new GUIStyle(EditorStyles.boldLabel);

            boldSideDigitType.fontSize = 20;

            boldSideDigitType.richText = true;
        }

        private static IOpenHarmonyHilogTaskResult QueryCommandAsync(IOpenHarmonyHilogTaskInput input)
        {
            var workInput = ((OpenHarmonyHilogQueryDeviceInfoInput)input);
            var hdc = workInput.hdc;
            string command = workInput.command;

            if (hdc == null)
                throw new NullReferenceException("HDC interface has to be valid");
            // Note: Using process id you can query memory from system apps which are not packages.
            var cmd = "-t " + workInput.deviceId + command;
            OpenHarmonyHilogInternalLog.Log("{0} {1}", hdc.GetHDCPath(), cmd);

            string outputMsg = string.Empty;
            try
            {
                System.Diagnostics.Stopwatch sw = new System.Diagnostics.Stopwatch();

                outputMsg = hdc.Run(new[] { cmd }, $"Failed to query deviceInfo for {workInput.deviceId}");
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log("Failed to query deviceInfo: \n" + ex.Message);
            }

            var result = new OpenHarmonyHilogQueryDeviceInfoResult();
            result.deviceId = workInput.deviceId;
            result.content = outputMsg;

            return result;
        }

        private IOpenHarmonyHilogTaskResult QueryCommandWithContinuoursOutputAsync(IOpenHarmonyHilogTaskInput input)
        {
            var workInput = ((OpenHarmonyHilogQueryDeviceInfoInput)input);
            var hdc = workInput.hdc;
            string command = workInput.command;

            if (hdc == null)
                throw new NullReferenceException("HDC interface has to be valid");

            // Note: Using process id you can query memory from system apps which are not packages.
            var cmd = "-t " + workInput.deviceId + command;
            OpenHarmonyHilogInternalLog.Log("{0} {1}", hdc.GetHDCPath(), cmd);

            string outputMsg = string.Empty;

            try
            {
                hdc.RunWithContinuousOutput(new[] { cmd }, $"Failed to query deviceInfo for {workInput.deviceId}", new System.Diagnostics.DataReceivedEventHandler(this.IntegrateQueryDeviceNetAndThermalContinuously));
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log("Failed to query memory: \n" + ex.Message);
            }

            var result = new OpenHarmonyHilogQueryDeviceInfoResult();
            result.deviceId = workInput.deviceId;
            result.content = outputMsg;

            return result;
        }

        public void IntegrateQueryDeviceNetAndThermalContinuously(object process, System.Diagnostics.DataReceivedEventArgs e)
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
                if (line.Contains(':'))
                {
                    Dictionary<string, string> deviceInfoDict = new Dictionary<string, string>();

                    string[] valueSplit = line.Split(' ');

                    valueSplit[0] = valueSplit[0].Trim();

                    valueSplit[1] = valueSplit[1].Trim();

                    if (valueSplit[1].Contains("="))
                    {
                        string[] keyValueSplit = valueSplit[1].Split("=");

                        deviceInfoDict.Add(keyValueSplit[0], keyValueSplit[1]);
                    }

                    if (deviceInfoDict.Count > 0)
                    {
                        if (deviceInfoDict.ContainsKey("gpu"))
                        {
                            double deviceGPUNum = double.Parse(deviceInfoDict["gpu"]);
                            deviceGPUThermal = deviceGPUNum.ToString("00.00");
                            needRepaint = true;
                        }

                        if (deviceInfoDict.ContainsKey("soc_thermal"))
                        {
                            double deviceSOCNum = double.Parse(deviceInfoDict["soc_thermal"]);
                            deviceSOCThermal = deviceSOCNum.ToString("00.00");
                            needRepaint = true;
                        }

                        if (deviceInfoDict.ContainsKey("networkDown"))
                        {
                            double deviceNetworkNum = double.Parse(deviceInfoDict["networkDown"]) / 8.0f / 1024.0f;
                            deviceNetworkDown = deviceNetworkNum.ToString("00.00");
                            needRepaint = true;
                        }

                        if (deviceInfoDict.ContainsKey("networkUp"))
                        {
                            double deviceNetworkNum = double.Parse(deviceInfoDict["networkUp"]) / 8.0f / 1024.0f;
                            deviceNetworkUp = deviceNetworkNum.ToString("00.00");
                            needRepaint = true;
                        }

                        if (deviceInfoDict.ContainsKey("voltageNow"))
                        {
                            double voltageNowNum = double.Parse(deviceInfoDict["voltageNow"]) / 1000000.0f;
                            devicePowerVoltage = voltageNowNum.ToString("0.00");
                            needRepaint = true;
                        }
                    }
                }
            }
        }

        private void IntegrateQueryDeviceInfo(IOpenHarmonyHilogTaskResult result)
        {
            OpenHarmonyHilogQueryDeviceInfoResult deviceInfoRawResult = (OpenHarmonyHilogQueryDeviceInfoResult)result;

            string content = deviceInfoRawResult.content;

            if (!string.IsNullOrEmpty(content))
            {
                Dictionary<string,string> deviceInfoDict = new Dictionary<string,string>();

                string[] lines = content.Split('\n');

                foreach (string line in lines)
                {
                    if (line.Contains(':'))
                    {
                        string[] keyValueSplit = line.Split(':');

                        deviceInfoDict.Add(keyValueSplit[0], keyValueSplit[1]);
                    }
                }

                if (deviceInfoDict.ContainsKey("deviceTypeName"))
                {
                    deviceTypeName = deviceInfoDict["deviceTypeName"];
                }

                if (deviceInfoDict.ContainsKey("fullName"))
                {
                    deviceFullName = deviceInfoDict["fullName"];
                }

                if (deviceInfoDict.ContainsKey("fullname"))
                {
                    deviceFullName = deviceInfoDict["fullname"];
                }

                if (deviceInfoDict.ContainsKey("model"))
                {
                    deviceModel = deviceInfoDict["model"];
                }

                if (deviceInfoDict.ContainsKey("name"))
                {
                    deviceName = deviceInfoDict["name"];
                }

                if (deviceInfoDict.ContainsKey("sn"))
                {
                    deviceSN = deviceInfoDict["sn"];
                }

                if (deviceInfoDict.ContainsKey("version"))
                {
                    deviceVersion = deviceInfoDict["version"];
                }

                if (deviceInfoDict.ContainsKey("cpu_c1_cluster"))
                {
                    string clusterValue = deviceInfoDict["cpu_c1_cluster"];

                    string clusterValueTrim = clusterValue.Trim();

                    string[] clusterList = clusterValueTrim.Split(" ");

                    deviceCPUNumber = clusterList.Length + "(" + clusterValue + ")";
                }

                if (deviceInfoDict.ContainsKey("cpu_c1_max"))
                {
                    deviceCPUMax = deviceInfoDict["cpu_c1_max"];
                }

                if (deviceInfoDict.ContainsKey("cpu_c1_min"))
                {
                    deviceCPUMin = deviceInfoDict["cpu_c1_min"];
                }

                if (deviceInfoDict.ContainsKey("cpu_cluster_name"))
                {
                    deviceCPUClusterName = deviceInfoDict["cpu_cluster_name"];
                }

                if (deviceInfoDict.ContainsKey("gpu_max_freq"))
                {
                    deviceGPUMaxFrequency = deviceInfoDict["gpu_max_freq"];
                }

                if (deviceInfoDict.ContainsKey("gpu_min_freq"))
                {
                    deviceGPUMinFrequency = deviceInfoDict["gpu_min_freq"];
                }
            }

            Repaint();
        }

        private void IntegrateQueryDeviceResolution(IOpenHarmonyHilogTaskResult result)
        {
            OpenHarmonyHilogQueryDeviceInfoResult deviceInfoRawResult = (OpenHarmonyHilogQueryDeviceInfoResult)result;

            string content = deviceInfoRawResult.content;

            if (!string.IsNullOrEmpty(content))
            {
                Dictionary<string, string> deviceInfoDict = new Dictionary<string, string>();

                string[] lines = content.Split('\n');

                foreach (string line in lines)
                {
                    if (line.Contains(':'))
                    {
                        string[] valueSplit = line.Split(',');

                        valueSplit[0] = valueSplit[0].Trim();

                        valueSplit[1] = valueSplit[1].Trim();

                        if (valueSplit[0].Contains(":"))
                        {
                            string[] keyValueSplit = valueSplit[0].Split(":");

                            if(!deviceInfoDict.ContainsKey(keyValueSplit[0]))
                                deviceInfoDict.Add(keyValueSplit[0], keyValueSplit[1]);
                        }

                        if (valueSplit[1].Contains("="))
                        {
                            string[] keyValueSplit = valueSplit[1].Split("=");

                            deviceInfoDict.Add(keyValueSplit[0], keyValueSplit[1]);
                        }
                    }
                }

                if (deviceInfoDict.ContainsKey("activeMode"))
                {
                    deviceScreenResolution = deviceInfoDict["activeMode"];
                }

                if (deviceInfoDict.ContainsKey("refreshrate"))
                {
                    deviceScreenRefreshRate = deviceInfoDict["refreshrate"];
                }

            }
            Repaint();
        }

        private void IntegrateQueryDeviceBatteryAmount(IOpenHarmonyHilogTaskResult result)
        {
            OpenHarmonyHilogQueryDeviceInfoResult deviceInfoRawResult = (OpenHarmonyHilogQueryDeviceInfoResult)result;

            string content = deviceInfoRawResult.content;

            if (!string.IsNullOrEmpty(content))
            {
                Dictionary<string, string> deviceInfoDict = new Dictionary<string, string>();

                string[] lines = content.Split('\n');

                foreach (string line in lines)
                {
                    if (line.Contains(':'))
                    {
                        string[] valueSplit = line.Split(':');

                        valueSplit[0] = valueSplit[0].Trim();

                        valueSplit[1] = valueSplit[1].Trim();

                        if (!deviceInfoDict.ContainsKey(valueSplit[0]))
                            deviceInfoDict.Add(valueSplit[0], valueSplit[1]);
                    }
                }

                if (deviceInfoDict.ContainsKey("capacity"))
                {
                    powerNumber = float.Parse(deviceInfoDict["capacity"]);
                }

                if(deviceInfoDict.ContainsKey("totalEnergy") && deviceInfoDict.ContainsKey("remainingEnergy"))
                {
                    float total = float.Parse(deviceInfoDict["totalEnergy"]);

                    float remain = float.Parse(deviceInfoDict["remainingEnergy"]);

                    powerNumber = remain / total * 100.0f;
                }
            }
            Repaint();
        }

        private void IntegrateQueryDeviceNetAndThermal(IOpenHarmonyHilogTaskResult result)
        {
            OpenHarmonyHilogQueryDeviceInfoResult deviceInfoRawResult = (OpenHarmonyHilogQueryDeviceInfoResult)result;

            string content = deviceInfoRawResult.content;

            Repaint();
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

            if(dockerWithButtonRef != null)
            {
                EditorDockAreaWithToggle.SetToggleStatus(dockerWithButtonRef,false);
            }

            m_Runtime.Closing -= OnDisable;

            m_Runtime.DeviceQuery.DeviceSelected -= OnSelectedDevice;

            m_Runtime.Update -= OnUpdate;
            m_Runtime = null;

            RefreshProcessAndCounter();
        }

        private void OnSelectedDevice(IOpenHarmonyHilogDevice device)
        {
            if (device == null)
                return;

            SelectedDevice = device;
        }
    }
}
