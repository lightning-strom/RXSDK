using System;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEngine;

namespace Tuanjie.OpenHarmony.Hilog
{
    internal static class OpenHarmonyHilogCommonGUIElements
    {
        internal static OpenHarmonyHilogRuntimeBase m_Runtime;

        //Show device selection GUI
        #region SelectedDeviceFieldGUI

        internal static Rect m_IpWindowScreenRect;
        internal static void HandleSelectedDeviceField(OpenHarmonyHilogRuntimeBase runtime, ref IOpenHarmonyHilogDevice device, ref ProcessInformation process, Action<int> action = null)
        {
            m_Runtime = runtime;
            var selectedDevice = device;
            var currentSelectedDevice = selectedDevice == null ? "No device" : selectedDevice.DisplayName;
            GUILayout.Label(new GUIContent(currentSelectedDevice, "Select openharmony device"), OpenHarmonyHilogStyles.toolbarPopup, GUILayout.MinWidth(120), GUILayout.MaxWidth(240));
            var rect = GUILayoutUtility.GetLastRect();
            if (Event.current.type == EventType.MouseDown && rect.Contains(Event.current.mousePosition))
            {
                // Only update device list, when we select this UI item
                m_Runtime.DeviceQuery.UpdateConnectedDevicesList(true, selectedDevice);

                var names = m_Runtime.DeviceQuery.Devices.Select(m => new GUIContent(m.Value.ShortDisplayName)).ToList();
                names.Add(GUIContent.none);
                // Add <Enter IP> as last field to let user connect through wifi.
                names.Add(new GUIContent("Other connection options..."));

                // Store the screen-space place that we should show the OpenHarmonyHilogIPWindow.
                m_IpWindowScreenRect = GUIUtility.GUIToScreenRect(rect);

                int selectedIndex = -1;
                selectedDevice = device;
                for (int i = 0; i < names.Count && selectedDevice != null; i++)
                {
                    if (selectedDevice.Id == names[i].text)
                    {
                        selectedIndex = i;
                        break;
                    }
                }

                m_Runtime.AddAction2OnDeviceSelected(action);
                EditorUtility.DisplayCustomMenu(new Rect(rect.x, rect.yMax, 0, 0), names.ToArray(), CheckDeviceEnabled, selectedIndex, DeviceSelection, null);
            }
        }

        private static bool CheckDeviceEnabled(int index)
        {
            // Enable items like <Enter IP>
            var devices = m_Runtime.DeviceQuery.Devices;
            if (index >= devices.Count)
                return true;
            return devices.Values.ToArray()[index].State == IOpenHarmonyHilogDevice.DeviceState.Connected;
        }

        private static void DeviceSelection(object userData, string[] options, int selected)
        {
            var devices = m_Runtime.DeviceQuery.Devices;
            if (selected >= m_Runtime.DeviceQuery.Devices.Count)
            {
                OpenHarmonyHilogIPWindow.Show(m_Runtime, m_IpWindowScreenRect);
                return;
            }
            m_Runtime.SelectDevice(selected);
        }
        #endregion

        //Show process selection GUI
        #region SelectProcessIDGUI

        internal static void HandleSelectedProcess(OpenHarmonyHilogRuntimeBase runtime, ref IOpenHarmonyHilogDevice device, ref ProcessInformation process, Action<ProcessInformation> action)
        {
            m_Runtime = runtime;
            var ProcessesForSelectedDevice = m_Runtime.UserSettings.GetKnownProcesses(device);
            // We always keep track the list of following packages:
            // * No Filter
            // * Package defined from player settings
            // * Package which is from top ability on phone and if it's not the one from player settings
            var displayName = process != null && process.processId != 0 ? process.DisplayName : "No Filter";
            GUILayout.Label(new GUIContent(displayName, "Select package name"), OpenHarmonyHilogStyles.toolbarPopup, GUILayout.MinWidth(60));
            var rect = GUILayoutUtility.GetLastRect();
            if (Event.current.type == EventType.MouseDown && rect.Contains(Event.current.mousePosition))
            {
                if (device == null)
                    return;

                UpdateDebuggablePackages(ref device, ref process, ProcessesForSelectedDevice);

                var processes = new List<ProcessInformation>(ProcessesForSelectedDevice);

                var appName = PlayerSettings.applicationIdentifier;
                processes.Sort(delegate (ProcessInformation x, ProcessInformation y)
                {
                    if (x.name == appName && !x.exited)
                        return -1;
                    if (y.name == appName && !y.exited)
                        return 1;
                    if (x.exited && !y.exited)
                        return 1;
                    if (!x.exited && y.exited)
                        return -1;
                    return 0;
                });

                // Add No Filter "package"
                processes.Insert(0, null);

                var names = new GUIContent[processes.Count];
                int selectedProcessId = process == null || process.processId == 0 ? 0 : -1;
                for (int i = 0; i < processes.Count; i++)
                {
                    // Note: Some processes are named like /system/bin/something, this creates problems with Unity GUI, since it treats / in special way
                    names[i] = new GUIContent(processes[i] == null ? "No Filter" : OpenHarmonyHilogUtilities.FixSlashesForIMGUI(processes[i].DisplayName));

                    if (processes[i] != null && process != null && process.name == processes[i].name && process.processId == processes[i].processId)
                        selectedProcessId = i;
                }

                m_Runtime.AddAction2OnProcessSelected(action);
                EditorUtility.DisplayCustomMenu(
                    new Rect(rect.x, rect.yMax, 0, 0),
                    names,
                    selectedProcessId,
                    ProcessSelection, processes.ToArray());
            }
        }
        private static void ProcessSelection(object userData, string[] options, int selected)
        {
            var processes = userData as ProcessInformation[];
            m_Runtime.SelectProcess(processes[selected]);
        }
        private static void UpdateDebuggablePackages(ref IOpenHarmonyHilogDevice device, ref ProcessInformation process, IReadOnlyList<ProcessInformation> ProcessesForSelectedDevice)
        {
            // When running test Tools don't exist
            if (m_Runtime.Tools == null)
                return;
            var startTime = DateTime.Now;
            var packagePIDCache = new Dictionary<string, int>();
            CheckIfProcessExited(packagePIDCache, ref device, ProcessesForSelectedDevice);

            int topAbilityPid = 0;
            string topAbilityPackageName = string.Empty;
            bool checkProjectPackage = true;
            var selectedDevice = device;
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

            m_Runtime.UserSettings.CleanupDeadProcessesForDevice(device, m_Runtime.Settings.MaxExitedPackagesToShow);
            OpenHarmonyHilogInternalLog.Log("UpdateDebuggablePackages finished in " + (DateTime.Now - startTime).Milliseconds + " ms");
        }

        private static void CheckIfProcessExited(Dictionary<string, int> cache, ref IOpenHarmonyHilogDevice device, IReadOnlyList<ProcessInformation> ProcessesForSelectedDevice)
        {
            foreach (var process in ProcessesForSelectedDevice)
            {
                if (process == null || process.processId <= 0)
                    continue;

                if (GetPidFromPackageName(cache, process.name, device) != process.processId)
                {
                    process.SetExited();
                }
                else
                {
                    process.SetAlive();
                }
            }
        }

        private static int GetPidFromPackageName(Dictionary<string, int> cache, string packageName, IOpenHarmonyHilogDevice device)
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
        #endregion
    }
}

