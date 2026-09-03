using UnityEngine;
using UnityEditor;
using System.Text.RegularExpressions;
using System;
using System.Threading.Tasks;

namespace Tuanjie.OpenHarmony.Hilog
{
    internal class OpenHarmonyHilogIPWindow : EditorWindow
    {
        internal static Regex kIPRegex = new Regex(@"\s+(?<ip>\d+\.\d+\.\d+\.\d+)");
        private OpenHarmonyHilogRuntimeBase m_Runtime;
        internal static string m_IpString;
        internal static string m_PortString = "42107";
        private Vector2 m_DevicesScrollPosition = Vector2.zero;
        private Rect m_DeviceScrollRect = new Rect();

        private const string kOpenHarmonyHilogLastIp = "OpenHarmonyHilogLastIp";
        private const string kOpenHarmonyHilogLastPort = "OpenHarmonyHilogLastPort";

        private GUIContent kConnect = new GUIContent(L10n.Tr("Connect"), L10n.Tr("Sets the target device to listen for a TCP/IP connection on port 42107 and connects to it via IP address."));
        private GUIContent kDisconnect = new GUIContent(L10n.Tr("Disconnect"));

        private bool refreshDevices = false;

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

        public static void Show(OpenHarmonyHilogRuntimeBase runtime, Rect screenRect)
        {
            OpenHarmonyHilogIPWindow win = EditorWindow.GetWindow<OpenHarmonyHilogIPWindow>(true, "Other connection options");
            win.position = new Rect(screenRect.x, screenRect.y, 700, 200);
        }

        void OnEnable()
        {
            if (!OpenHarmonyBridge.OpenHarmonyExtensionsInstalled)
                return;
            if (m_Runtime == null)
                m_Runtime = OpenHarmonyHilogManager.instance.Runtime;
            m_IpString = EditorPrefs.GetString(kOpenHarmonyHilogLastIp, "");
            m_PortString = EditorPrefs.GetString(kOpenHarmonyHilogLastPort, "42107");

            m_Runtime.DeviceQuery.DevicesUpdated += DevicesUpdated;
            m_Runtime.Closing += OnDisable;

            // Disable progress bar just in case, if we have a stale process hanging where we peform hdc connect
            EditorUtility.ClearProgressBar();
        }

        private void OnDisable()
        {
            if (!OpenHarmonyBridge.OpenHarmonyExtensionsInstalled)
                return;
            if (m_Runtime == null)
                return;
            m_Runtime.DeviceQuery.DevicesUpdated -= DevicesUpdated;
            m_Runtime = null;
        }

        private void DevicesUpdated()
        {
            Repaint();
        }

        /// <summary>
        /// Connect to the device by ip address.
        /// Step: 1: tmode port, change to Wi-Fi mode; 2: tconn ip:port, connect to the device
        /// </summary>
        /// <param name="ip"> The ip address of the device that needs to be connected. Port can be included like 'device_ip_address:port'. Both IPV4 and IPV6 are supported. </param>
        public void ConnectDevice(string ip, string port)
        {
            EditorUtility.DisplayProgressBar("Connecting", "Connecting to " + ip + ":" + port, 0.0f);
            m_Runtime.Dispatcher.Schedule(new OpenHarmonyHilogConnectToDeviceInput() { hdc = m_Runtime.Tools.HDC, ip = ip, port = port },
               OpenHarmonyHilogConnectToDeviceTask.Execute, IntegrateConnectToDevice, false);
        }

        public void SetTCPIPAndConnectDevice(string deviceId, string ip, string port)
        {
            EditorUtility.DisplayProgressBar("Connecting",
                string.Join("\n", new string[]
                {
                    "Set listening port to " + port + ". Connecting to " + ip + ":" + port,
                }), 0.0f);
            m_Runtime.Dispatcher.Schedule(new OpenHarmonyHilogConnectToDeviceInput() { hdc = m_Runtime.Tools.HDC, ip = ip, port = port, deviceId = deviceId, setListeningPort = true }, 
                OpenHarmonyHilogConnectToDeviceTask.Execute, IntegrateConnectToDevice, false);
        }

        // Change a connected device to USB mode from Wi-Fi mode.
        private void DisconnectDevice(IOpenHarmonyHilogDevice device)
        {
            var cmd = string.Format("-t {0} tmode usb", device.Id);
            m_Runtime.Tools.HDC.Run(new[] { cmd }, "Failed to disconnect (change to USB mode)" + device.Id);
            device.UpdateState(IOpenHarmonyHilogDevice.DeviceState.Disconnected);
        }

        private static IOpenHarmonyHilogTaskResult DisconnectDevice(IOpenHarmonyHilogTaskInput input)
        {
            var result = new OpenHarmonyHilogConnectToDeviceResult();

            try
            {
                var workInput = ((OpenHarmonyHilogConnectToDeviceInput)input);
                var HDC = workInput.hdc;

                if (HDC == null)
                    throw new NullReferenceException("HDC interface has to be valid");

                var ip = workInput.ip;
                var port = workInput.port;
                string cmd;

                if (ip.Contains("Failed to get IP address"))
                    throw new NullReferenceException("IP address has to be found");

                cmd = string.Format("-t {0}:{1} tmode usb", ip, port);
                OpenHarmonyHilogInternalLog.Log("hdc {0}", cmd);
                var outputMsg = HDC.Run(new[] { cmd }, "Failed to disconnect (change to USB mode)" + ip + port);

                result.message = outputMsg;
                result.success = true;
                if (outputMsg == string.Empty || outputMsg.StartsWith("[Fail]") || outputMsg.Contains("connect failed status"))
                {
                    throw new NullReferenceException(outputMsg);
                }
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log(ex.Message);
                result.success = false;
                result.message = ex.Message;
            }
            return result;
        }


        private async void IntegrateConnectToDevice(IOpenHarmonyHilogTaskResult result)
        {
            var r = (OpenHarmonyHilogConnectToDeviceResult)result;
            if (r.success)
            {
                var deviceID = string.Format("{0}:{1}", r.ip, r.port);
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
                    r.message = string.Format("Device {0} was set to {1}:{2}, but the connection attempt failed. Please manually connect to {1}:{2}.", r.deviceID, r.ip, r.port);
                    r.success = false;
                    m_IpString = r.ip;
                    m_PortString = r.port;
                }
                else
                {
                    r.success = true;
                    refreshDevices = true;
                }
            }

            OpenHarmonyHilogInternalLog.Log(r.message);
            EditorUtility.ClearProgressBar();
            EditorUtility.DisplayDialog(r.success ? "Success" : "Failure", r.message, "Ok");
        }

        internal static string ParseIPAddress(string input)
        {
            var result = kIPRegex.Match(input);
            if (result.Success)
                return result.Groups["ip"].Value;
            return null;
        }

        string CopyIP(IOpenHarmonyHilogDevice device)
        {
            var command = string.Empty;
            if(device.BelowVersion5)
                command = string.Format("-t {0} shell ip route", device.Id);
            else
                //grep -A 1 'Local Address' | grep -v 'Local Address': return the next line after the line that contains 'Local Address'
                command = string.Format("-t {0} shell \" netstat | grep -A 1 'Local Address' | grep -v 'Local Address'  \"", device.Id);
            var result = m_Runtime.Tools.HDC.Run(new[] { command }, "Failed to query ip");
            var ip = ParseIPAddress(result);
            return string.IsNullOrEmpty(ip) ? "Failed to get IP address" : ip;
        }

        void OnGUI()
        {
            if (!OpenHarmonyBridge.OpenHarmonyExtensionsInstalled)
            {
                OpenHarmonyHilogUtilities.ShowOpenHarmonyIsNotInstalledMessage();
                return;
            }

            if (refreshDevices)
            {
                m_Runtime.DeviceQuery.UpdateConnectedDevicesList(true, SelectedDevice);
                GUIUtility.keyboardControl = 0;
                GUIUtility.hotControl = 0;
                refreshDevices = false;
            }

            EditorGUILayout.BeginVertical();
            {
                EditorGUILayout.LabelField("Available devices:", EditorStyles.boldLabel);
                GUI.Box(m_DeviceScrollRect, GUIContent.none, EditorStyles.helpBox);
                m_DevicesScrollPosition = EditorGUILayout.BeginScrollView(m_DevicesScrollPosition);
                foreach (var deviceValue in m_Runtime.DeviceQuery.Devices)
                {
                    var device = deviceValue.Value;
                    EditorGUILayout.BeginHorizontal();
                        EditorGUILayout.LabelField(device.DisplayName, EditorStyles.label);

                        EditorGUI.BeginDisabledGroup(device.State != IOpenHarmonyHilogDevice.DeviceState.Connected);
                        if (GUILayout.Button(" Copy IP ", GUILayout.ExpandWidth(false)))
                        {
                            m_IpString = CopyIP(device);
                            EditorGUIUtility.systemCopyBuffer = m_IpString;
                            GUIUtility.keyboardControl = 0;
                            GUIUtility.hotControl = 0;
                            Repaint();
                        }

                        float connectButtoSize = 100.0f;
                        if (device.ConnectionType == IOpenHarmonyHilogDevice.DeviceConnectionType.Network)
                        {
                            if (GUILayout.Button(kDisconnect, GUILayout.Width(connectButtoSize)))
                            {
                                DisconnectDevice(device);
                                refreshDevices = true;
                            }
                        }
                        else
                        {
                            if (GUILayout.Button(kConnect, GUILayout.Width(connectButtoSize)))
                            {
                                m_PortString = "42107";
                                SetTCPIPAndConnectDevice(device.Id, CopyIP(device), m_PortString);
                            }
                        }
                        EditorGUI.EndDisabledGroup();

                        var rc = GUILayoutUtility.GetLastRect();
                        var orgColor = GUI.color;
                        GUI.color = Color.black;
                        if (Event.current.type == EventType.Repaint)
                            GUI.DrawTexture(new Rect(0, rc.y + rc.height, m_DeviceScrollRect.width, 1), EditorGUIUtility.whiteTexture);
                        GUI.color = orgColor;
                    EditorGUILayout.EndHorizontal();
                }
                EditorGUILayout.EndScrollView();
                if (Event.current.type == EventType.Repaint)
                    m_DeviceScrollRect = GUILayoutUtility.GetLastRect();
                GUILayout.Space(5);
                EditorGUILayout.BeginHorizontal();
                EditorGUILayout.LabelField("IP", EditorStyles.boldLabel);
                EditorGUILayout.LabelField("Port", EditorStyles.boldLabel, GUILayout.Width(100));
                EditorGUILayout.EndHorizontal();
                EditorGUILayout.BeginHorizontal();
                m_IpString = EditorGUILayout.TextField(m_IpString);
                m_PortString = EditorGUILayout.TextField(m_PortString, GUILayout.Width(100));
                EditorGUILayout.EndHorizontal();

                EditorGUILayout.BeginHorizontal();

                EditorGUI.BeginDisabledGroup(string.IsNullOrEmpty(m_IpString));
                if (GUILayout.Button("Connect"))
                {
                    EditorPrefs.SetString(kOpenHarmonyHilogLastIp, m_IpString);
                    EditorPrefs.SetString(kOpenHarmonyHilogLastPort, m_PortString);
                    ConnectDevice(m_IpString, m_PortString);
                    m_Runtime.DeviceQuery.UpdateConnectedDevicesList(false, SelectedDevice);
                    Repaint();
                }
                EditorGUI.EndDisabledGroup();
                if (GUILayout.Button("Refresh Devices"))
                {
                    m_Runtime.DeviceQuery.UpdateConnectedDevicesList(false, SelectedDevice);
                }

                EditorGUILayout.EndHorizontal();
            }
            EditorGUILayout.EndVertical();
        }
    }
}
