using System;
using UnityEditor;
using UnityEngine;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Tuanjie.OpenHarmony.Hilog
{
    /// <summary>
    /// The interface to show ArkUI information
    /// Show ArkUI tree on the editor or save it as a *.dump file (Text file).
    /// </summary>
    public class OpenHarmonyHilogArkUIWindow : EditorWindow
    {
        private string m_ArkUITree = "\n // arkui.dump文件内容片断: \n";
        private Vector2 scrollPos;
        private string arkUIDumapSavePath = string.Empty;
        private OpenHarmonyHilogRuntimeBase m_Runtime;

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

        internal void PostInstantiation()
        {
            titleContent = new GUIContent("ArkUI Dump");
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

                GUILayout.BeginHorizontal();
                    OpenHarmonyHilogCommonGUIElements.HandleSelectedDeviceField(m_Runtime, ref m_SelectedDevice, ref m_SelectedProcess, HandleDeviceSelection);

                    GUILayout.Space(3);

                    if (GUILayout.Button("Get ArkUI Dump on Screen", OpenHarmonyHilogStyles.toolbarButton))
                    {
                        GetArkUIDump(out m_ArkUITree);
                        GUI.FocusControl(null);
                    }

                    GUILayout.Space(3);

                    if (GUILayout.Button("Save", OpenHarmonyHilogStyles.toolbarButton))
                        SaveArkUIDump();

                GUILayout.EndHorizontal();

                scrollPos = EditorGUILayout.BeginScrollView(scrollPos);
                    //Set FontColor/BackgroundColor properties as corresponding colors(RGB). 
                    string pattern = @"(?<=Color.*?)#([0-9A-F]{6})";
                    string result = Regex.Replace(m_ArkUITree, pattern, @"<color=#$1><b>#$1</b></color>");
                    //Not allow to edit "result"
                    EditorGUILayout.TextArea(result, OpenHarmonyHilogStyles.arkUITreeStyle, GUILayout.ExpandHeight(true));
                EditorGUILayout.EndScrollView();

            GUILayout.EndVertical();
        }

        //Callback after selecting a certain device.
        private void HandleDeviceSelection(int selectIndex)
        {
            if(m_SelectedDevice != m_Runtime.DeviceQuery.Devices.Values.ToArray()[selectIndex])
                m_ArkUITree = "\n // arkui.dump文件内容片断: \n";
            m_Runtime.DeviceQuery.SelectDevice(ref m_SelectedDevice, m_Runtime.DeviceQuery.Devices.Values.ToArray()[selectIndex]);
            SelectedProcess = null;
        }

        //Get ArkUI Tree of the foreground application.
        private void GetArkUIDump(out string arkUITree)
        {
            int topAbilityPid = 0;
            string topAbilityPackageName = string.Empty;
            var selectedDevice = SelectedDevice;
            if (OpenHarmonyHilogUtilities.GetTopAbilityInfo(m_Runtime.Tools.HDC, selectedDevice, ref topAbilityPackageName, ref topAbilityPid))
                arkUITree = string.Format("\n // arkui.dump文件内容片断: \n {0}", OpenHarmonyHilogUtilities.GetArkUIDump(m_Runtime.Tools.HDC, selectedDevice, ref topAbilityPackageName, ref topAbilityPid));
            else
                arkUITree = "\n // arkui.dump文件内容片断: <color=#ff0000ff><b>没有前台应用存在</b></color> \n ";
        }

        //Get ArkUI Tree of the foreground application. And save it as a *.dump file (Text file).
        private void SaveArkUIDump()
        {
            try
            {
                arkUIDumapSavePath = EditorUtility.SaveFilePanel("Save ArkUI Dump", Directory.GetCurrentDirectory(), "arkui", "dump");
                if(arkUIDumapSavePath != string.Empty)
                {
                    var arkUITree = string.Empty;
                    GetArkUIDump(out arkUITree);
                    File.WriteAllText(arkUIDumapSavePath, arkUITree);
                }
            }
            catch(Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log($"Exception while saving ArkUI dump:\n{ex.Message}");
            }
        }

        internal void OnUpdate()
        {
            if (this != EditorWindow.focusedWindow)
                return;

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
                        deviceQuery.SelectDevice(ref m_SelectedDevice, selectedDevice, false);
                        SelectProcess(selectedProcess);
                    }
                }
            }
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
            
            m_ArkUITree = m_ArkUITree ?? "\n // arkui.dump文件内容片断: \n";
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
            m_Runtime = null;
        }

        private void OnSelectedDevice(IOpenHarmonyHilogDevice device)
        {
            if (device == null)
                return;

            if(focusedWindow != this)
                return;

            OpenHarmonyHilogInternalLog.Log("Reset processes");
            SelectedProcess = null;

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
    }
}
