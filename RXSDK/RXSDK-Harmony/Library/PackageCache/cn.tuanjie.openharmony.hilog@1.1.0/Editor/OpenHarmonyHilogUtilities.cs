using System;
using System.IO;
using System.Text.RegularExpressions;
using UnityEngine;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Tuanjie.OpenHarmony.Hilog
{
    internal static class OpenHarmonyHilogUtilities
    {
        internal static readonly string kAbiArm64 = "arm64-v8a";
        internal static readonly string kAbiArmV7 = "armeabi-v7a";
        internal static readonly string kAbiX86 = "x86";
        internal static readonly string kAbiX86_64 = "x86-64";

        /// <summary>
        /// Get the top ability on the given device.
        /// </summary>
        public static bool GetTopAbilityInfo(OpenHarmonyBridge.HDC HDC, IOpenHarmonyHilogDevice device, ref string packageName, ref int packagePid)
        {
            if (device == null)
                return false;
            try
            {
                // hidumper -s AbilityManagerService -a -a: list all ability information
                // sed '/ExtensionRecords:/,$d' : list apps are running (in background/foreground)
                // grep \'bundle name\' | paste -d' ' - - : combine "bundle name" and "app state" into one line
                // grep '#FOREGROUND': return the line of foreground app.
                var cmd = string.Empty;
                if(device.BelowVersion5)
                    cmd = "-t " + device.Id + " shell  \" hidumper -s AbilityManagerService -a -a | sed '/ExtensionRecords:/,$d' | grep -E \'bundle name|app state\' | paste -d' ' - - | grep '#FOREGROUND' \"";
                else
                    //For some devices over version 5.0, the 'sed'/'grep' cannot be used in the output of hidumper.
                    cmd = "-t " + device.Id + " shell  \" hidumper -s AbilityManagerService -a -a \"";
                OpenHarmonyHilogInternalLog.Log("{0} {1}", HDC.GetHDCPath(), cmd);
                var output = HDC.Run(new[] { cmd }, "Unable to get the top ability.");
                if(OpenHarmonyHilogUtilities.ParseTopAbilityPackageInfo(output, out packageName, device.BelowVersion5))
                {
                    packagePid = GetPidFromPackageName(HDC, device, packageName);
                }
                return packagePid > 0;
            }
            catch (Exception)
            {
                return false;
            }
        }

        /// <summary>
        /// Return the pid of the given package on the given device.
        /// </summary>
        public static int GetPidFromPackageName(OpenHarmonyBridge.HDC HDC, IOpenHarmonyHilogDevice device, string packageName)
        {
            if (device == null)
                return -1;

            try
            {
                string cmd = null;
                //Not sure if all OpenHarmony devices support command "pidof"
                cmd = string.Format("-t {0} shell pidof -s {1}", device.Id, packageName);

                var output = HDC.Run(new[] { cmd }, "Unable to get the pid of the given packages.");
                if (string.IsNullOrEmpty(output))
                    return -1;

                return int.Parse(output);
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log($"Failed to get process id for {packageName}:\n{ex.Message}");
                return -1;
            }
        }

        /// <summary>
        /// Return the bundle name of the given package on the given pid and device.
        /// </summary>
        public static string GetProcessNameFromPid(OpenHarmonyBridge.HDC HDC, IOpenHarmonyHilogDevice device, int processId)
        {
            if (device == null)
                return string.Empty;

            return GetProcessNameFromPid(HDC, device.Id, processId);
        }

        /// <summary>
        /// Return the bundle name of the given package on the given pid and device.
        /// </summary>
        public static string GetProcessNameFromPid(OpenHarmonyBridge.HDC HDC, string deviceId, int processId)
        {

            try
            {
                // Find bundle name in all process in the system 
                string cmd = string.Format("-t {0} shell \" ps -f | grep -E '^[^[:space:]]+[[:space:]]+{1}\\b' \" ", deviceId, processId);
                var output = HDC.Run(new[] { cmd }, "Unable to get the process name for pid " + processId);
                if (string.IsNullOrEmpty(output))
                    return string.Empty;

                var packageName = string.Empty;
                var reg = new Regex(@"^(?:\S+\s+){7}(?<packageName>\S+)");
                var match = reg.Match(output);
                if (!match.Success)
                {
                    OpenHarmonyHilogInternalLog.Log("Match '{0}' failed.", output);
                    return string.Empty;
                }

                packageName = match.Groups["packageName"].Value;
                return packageName;
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log(ex.Message);
                return string.Empty;
            }
        }

        /// <summary>
        /// Return the bundle name of the given package on the given pid and device.
        /// </summary>
        public static bool ParseTopAbilityPackageInfo(string commandOutput, out string packageName, bool belowVersion5 = true)
        {
            packageName = string.Empty;

            if (string.IsNullOrEmpty(commandOutput))
            {
                OpenHarmonyHilogInternalLog.Log("Cannot find top ability.");
                return false;
            }

            //For devices whose system version over 5.0.0 need a further procedure
            if (!belowVersion5)
            {
                commandOutput = ProcessAbilityManagerInfo(commandOutput);
                packageName = commandOutput;
                return !string.Equals(packageName, String.Empty);
            }

            var reg = new Regex(@"\[(?<packageName>.+?)\]");
            var match = reg.Match(commandOutput);
            if (!match.Success)
            {
                OpenHarmonyHilogInternalLog.Log("Match '{0}' failed.", commandOutput);
                return false;
            }

            packageName = match.Groups["packageName"].Value;
            return true;
        }

        /// <summary>
        /// For devices whose system version over 5.0.0, found first bundle name before "#FOREGROUND" and "ExtensionRecords"
        /// </summary>
        public static string ProcessAbilityManagerInfo(string commandOutput)
        {
            var lastIndex = commandOutput.IndexOf("ExtensionRecords");
            commandOutput = commandOutput.Substring(0, lastIndex + 1);
            lastIndex = commandOutput.IndexOf("#FOREGROUND");
            commandOutput = commandOutput.Substring(0, lastIndex + 1);
            var reg = new Regex(@"bundle name \[(?<packageName>.+?)\]");
            MatchCollection matches = reg.Matches(commandOutput);
            if (matches.Count < 1)
            {
                OpenHarmonyHilogInternalLog.Log("Match '{0}' failed.", commandOutput);
                return string.Empty;
            }

            return matches[matches.Count - 1].Groups["packageName"].Value;
        }

        /// <summary>
        /// Convert string "version" to System.Version "version"
        /// </summary>
        public static Version ParseVersion(string versionString)
        {
            var regex = new Regex(@"\d+\.\d+\.\d+\.\d+");
            Match match = regex.Match(versionString);
            if (match.Success)
            {
                versionString = match.Value;
            }
#if NET_2_0
            return ParseVersionLegacy(versionString);
#else
            var vals = versionString.Split('.');
            // Version.TryParse isn't capable of parsing digits without dots, for ex., 1
            if (vals.Length == 1)
            {
                int n;
                if (!int.TryParse(vals[0], out n))
                {
                    OpenHarmonyHilogInternalLog.Log("Failed to parse openharmony OS version '{0}'", versionString);
                    return new Version(0, 0);
                }
                return new Version(n, 0);
            }

            Version version;
            if (!Version.TryParse(versionString, out version))
            {
                OpenHarmonyHilogInternalLog.Log("Failed to parse openharmony OS version '{0}'", versionString);
                return new Version(0, 0);
            }
            return version;
#endif
        }

        /// <summary>
        /// Returns symbol file by checking following extensions, for ex., if you're searching for libtuanjie.so symbol file, it will first try to:
        /// - libtuanjie.so
        /// - libtuanjie.sym.so
        /// - libtuanjie.dbg.so
        /// </summary>
        /// <param name="symbolPath"></param>
        /// <param name="libraryFile"></param>
        /// <returns></returns>
        internal static string GetSymbolFile(string symbolPath, string libraryFile, string[] extensionsToTry)
        {
            var fullPath = Path.GetFullPath(Path.Combine(symbolPath, libraryFile));
            if (File.Exists(fullPath))
                return fullPath;

            foreach (var e in extensionsToTry)
            {
                // Try sym.so extension
                fullPath = Path.GetFullPath(Path.Combine(symbolPath, Path.GetFileNameWithoutExtension(libraryFile) + e));
                if (File.Exists(fullPath))
                    return fullPath;
            }

            return string.Empty;
        }

        internal static string GetSymbolFile(IReadOnlyList<ReordableListItem> symbolPaths, string abi, string libraryFile, string[] extensionsToTry)
        {
            foreach (var symbolPath in symbolPaths)
            {
                if (!symbolPath.Enabled)
                    continue;

                if (!string.IsNullOrEmpty(abi))
                {
                    var fileWithABI = GetSymbolFile(Path.Combine(symbolPath.Name, abi), libraryFile, extensionsToTry);
                    if (!string.IsNullOrEmpty(fileWithABI))
                        return fileWithABI;
                }

                var file = GetSymbolFile(symbolPath.Name, libraryFile, extensionsToTry);
                if (!string.IsNullOrEmpty(file))
                    return file;
            }

            return string.Empty;
        }

        internal static bool ParseCrashLine(IReadOnlyList<ReordableListItem> regexs, string msg, out string abi, out string address, out string libName)
        {
            abi = string.Empty;
            foreach (var regexItem in regexs)
            {
                if (!regexItem.Enabled)
                    continue;

                var match = new Regex(regexItem.Name).Match(msg);
                if (match.Success)
                {
                    var rawAbi = match.Groups["abi"].Value;
                    if (!string.IsNullOrEmpty(rawAbi))
                    {
                        if (rawAbi.Equals("arm"))
                            abi = kAbiArmV7;
                        else if (rawAbi.Equals("arm64"))
                            abi = kAbiArm64;
                        else if (rawAbi.Equals("x86"))
                            abi = kAbiX86;
                        else if (rawAbi.Equals("x86_64"))
                            abi = kAbiX86_64;
                    }

                    address = match.Groups["address"].Value;
                    libName = match.Groups["libName"].Value + ".so";
                    return true;
                }
            }

            address = null;
            libName = null;
            return false;
        }

        internal static void ShowOpenHarmonyIsNotInstalledMessage()
        {
            UnityEditor.EditorGUILayout.HelpBox("OpenHarmony Hilog requires OpenHarmony support to be installed.", UnityEditor.MessageType.Info);
        }

        internal static void ApplySettings(OpenHarmonyHilogRuntimeBase runtime, IOpenHarmonyHilogDevice device, OpenHarmonyHilog hilog = null)
        {
            if (runtime == null)
                throw new ArgumentNullException("OpenHarmonyHilogRuntimeBase is null");
            var settings = runtime.Settings;
            var userSettings = runtime.UserSettings;
            var selectedDevice = device;

            int fixedHeight = settings.MessageFontSize + 5;
            OpenHarmonyHilogStyles.kLogEntryFontSize = settings.MessageFontSize;
            OpenHarmonyHilogStyles.kLogEntryFixedHeight = fixedHeight;
            OpenHarmonyHilogStyles.background.fixedHeight = fixedHeight;
            OpenHarmonyHilogStyles.backgroundEven.fixedHeight = fixedHeight;
            OpenHarmonyHilogStyles.backgroundOdd.fixedHeight = fixedHeight;
            OpenHarmonyHilogStyles.priorityDefaultStyle.font = settings.MessageFont;
            OpenHarmonyHilogStyles.priorityDefaultStyle.fontSize = settings.MessageFontSize;
            OpenHarmonyHilogStyles.priorityDefaultStyle.fixedHeight = fixedHeight;
            foreach (var p in (Priority[])Enum.GetValues(typeof(Priority)))
            {
                OpenHarmonyHilogStyles.priorityStyles[(int)p].normal.textColor = settings.GetMessageColor(p);
                OpenHarmonyHilogStyles.priorityStyles[(int)p].font = settings.MessageFont;
                OpenHarmonyHilogStyles.priorityStyles[(int)p].fontSize = settings.MessageFontSize;
                OpenHarmonyHilogStyles.priorityStyles[(int)p].fixedHeight = fixedHeight;
            }

            hilog?.StripFilteredEntriesIfNeeded();
            hilog?.StripRawEntriesIfNeeded();
            userSettings.CleanupDeadProcessesForDevice(selectedDevice, settings.MaxExitedPackagesToShow);
        }

        // When we use / in context menu, this creates submenu, which is no good
        // Replace it with unicode slash, while it won't display this in pretty way, it's still better than not displaying anything
        internal static string FixSlashesForIMGUI(string value)
        {
            return value.Replace("/", " \u2215");
        }

        internal static string[] GetEnabledValues(this IReadOnlyList<ReordableListItem> list)
        {
            return list.Where(i => i.Enabled).Select(i => i.Name).ToArray();
        }

        internal static bool HasCtrlOrCmdModifier(this Event e)
        {
            return (e.modifiers & (Application.platform == RuntimePlatform.OSXEditor ? EventModifiers.Command : EventModifiers.Control)) != 0;
        }

        /// <summary>
        /// Convert string "version" to System.Version "version"
        /// </summary>
        internal static string GetArkUIDump(OpenHarmonyBridge.HDC HDC, IOpenHarmonyHilogDevice device, ref string packageName, ref int packagePid)
        {
            if (HDC == null)
                throw new NullReferenceException("HDC interface has to be valid");

            // hidumper -s WindowManagerService -a -a: list all window information in the system
            // grep -E '^[^[:space:]]+[[:space:]]+ +[^[:space:]]+[[:space:]]+ +{1}\\b': return line the third segment is {packagePid}
            var cmd = string.Empty;
            if (device.BelowVersion5) 
                cmd = string.Format("-t {0} shell \"hidumper -s WindowManagerService -a -a | grep -E '^[^[:space:]]+[[:space:]]+ +[^[:space:]]+[[:space:]]+ +{1}\\b' \" ", device.Id, packagePid);
            else
                //For some devices over version 5.0, the 'sed'/'grep' cannot be used in the output of hidumper.
                cmd = string.Format("-t {0} shell \"hidumper -s WindowManagerService -a -a\"", device.Id);

            OpenHarmonyHilogInternalLog.Log("{0} {1}", HDC.GetHDCPath(), cmd);

            string outputMsg = string.Empty;
            try
            {
                outputMsg = HDC.Run(new[] { cmd }, $"Failed to query window id {null}");
                OpenHarmonyHilogInternalLog.Log("{0} output: {1}", HDC.GetHDCPath(), outputMsg);
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log("Failed to query window id: \n" + ex.Message);
            }

            Regex reg;
            if (!device.BelowVersion5)
            {
                string pattern = string.Format(@"\S+\s+\S+\s+({0})\s+(?<WinID>\S+)", packagePid);
                reg = new Regex(pattern, RegexOptions.Singleline);
            }
            else
                reg = new Regex(@"^(?:\S+\s+){3}(?<WinID>\S+)");
            var matchWinID = reg.Match(outputMsg);
            if (!matchWinID.Success)
            {
                OpenHarmonyHilogInternalLog.Log("Match '{0}' failed.", outputMsg);
                return string.Empty;
            }

            var winID = matchWinID.Groups["WinID"].Value;
            cmd = string.Format("-t {0} shell \"hidumper -s WindowManagerService -a '-w {1} -element -c' \" ", device.Id, winID);

            try
            {
                outputMsg = HDC.Run(new[] { cmd }, $"Failed to find Ark UI Tree for {packageName} (WinID = {winID}");
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log("Failed to find window id: \n" + ex.Message);
            }

            outputMsg = outputMsg.Replace("\r", "");

            // Instead of shown in terminal interface, root devices save ArkUI dump in local "arkui.dump" file.
            if (outputMsg.Contains("dumpFilePath"))
            {
                cmd = string.Format("-t {0} shell \" find /data/ -name arkui.dump | grep '{1}' \" ", device.Id, packageName);

                try
                {
                    outputMsg = HDC.Run(new[] { cmd }, $"Failed to find Ark UI Dump file for {packageName}");
                    outputMsg = outputMsg.Replace("\r\n", "");
                }
                catch (Exception ex)
                {
                    OpenHarmonyHilogInternalLog.Log("Failed to find Ark UI Dump file: \n" + ex.Message);
                    return string.Empty;
                }


                var tempArkUIDumapFilePath = $"temp-{packageName}-arkui.dump";
                //Receive *.dump files from devices
                cmd = string.Format("-t {0} file recv {1} {2}", device.Id, outputMsg, tempArkUIDumapFilePath);
                try
                {
                    outputMsg = HDC.Run(new[] { cmd }, $"Failed to receive arkui.dump file from the device {device.Id} to {tempArkUIDumapFilePath} for {packageName}");
                }
                catch (Exception ex)
                {
                    OpenHarmonyHilogInternalLog.Log("Failed to receive arkui.dump file: \n" + ex.Message);
                    return string.Empty;
                }

                var path = Path.Combine(OpenHarmonyBridge.OpenHarmonySDKRoot.sdkRootPath, tempArkUIDumapFilePath);
                if(!File.Exists(path))
                {
                    OpenHarmonyHilogInternalLog.Log($"Failed to find temp-{packageName}-arkui.dump file: \n");
                    return string.Empty;
                }

                outputMsg = File.ReadAllText(path);
                File.Delete(path);
                return outputMsg;
            }

            reg = new Regex(@"(?<ArkUITree>\|\->.*)", RegexOptions.Singleline);
            var matchArkUITree = reg.Match(outputMsg);
            if (!matchArkUITree.Success)
            {
                OpenHarmonyHilogInternalLog.Log("Match '{0}' failed.", outputMsg);
                return string.Format("<color=#ff0000ff><b>No information found for the ArkUI Tree of package: {0} (pid: {1}; winId: {2}) </b></color> " +
                                     "\n 请检查前台应用中的ArkUI组件是否存在，或确保前台应用不是系统应用。", packageName, packagePid, winID);
            }

            outputMsg = matchArkUITree.Groups["ArkUITree"].Value;
            return outputMsg;
        }

        private static string GetWinID(string msg, int pid)
        {
            string pattern = string.Format(@"\S+\s+\S+\s+({0})\s+(?<WinID>\S+)", pid);
            var reg = new Regex(pattern, RegexOptions.Singleline);
            var matchArkUITree = reg.Match(msg);
            if (!matchArkUITree.Success)
            {
                OpenHarmonyHilogInternalLog.Log("Match '{0}' failed.", msg);
                return string.Empty;
            }

            msg = matchArkUITree.Groups["WinID"].Value;
            return msg;
        }

        internal static void GetDeviceAndProcessFromSavedState(OpenHarmonyHilogRuntimeBase m_Runtime, ProcessInformation SelectedProcess, out IOpenHarmonyHilogDevice savedDevice, out ProcessInformation savedProcess)
        {
            savedDevice = null;
            savedProcess = null;

            var settings = m_Runtime.UserSettings;

            if (!settings.LastSelectedDeviceIdValid)
                return;

            var savedDeviceId = settings.LastSelectedDeviceId;
            savedDevice = m_Runtime.DeviceQuery.GetDevice(savedDeviceId);
            savedProcess = SelectedProcess;
        }

        internal static string PriorityEnumToString(Priority priority)
        {
            switch (priority)
            {
                case Priority.Debug: return "D";
                case Priority.Info: return "I";
                case Priority.Warn: return "W";
                case Priority.Error: return "E";
                case Priority.Fatal: return "F";

                default:
                {
                    OpenHarmonyHilogInternalLog.Log(string.Format("Invalid `priority` ({0}) in log entry.", priority));
                    return "V";
                }
                
            }
        }

        internal static Priority PriorityStringToEnum(string priority)
        {
            switch (priority)
            {
                case "D": return Priority.Debug;
                case "I": return Priority.Info;
                case "W": return Priority.Warn;
                case "E": return Priority.Error;
                case "F": return Priority.Fatal;

                default:
                {
                    OpenHarmonyHilogInternalLog.Log(string.Format("Invalid `string` ({0}) in log entry.", priority));
                    return Priority.Debug;
                }
            }
        }

        //Sometimes the latest version of hdc.exe (3.0.0) cannot send commands to connected devices, reboot the hdc server to fix.
        //May be obsolete if new version is out.
        public static void CheckAndRebootHDC(OpenHarmonyBridge.HDC hdc)
        {
            var hdcVersion = hdc.GetHDCVersion();

            if (hdcVersion >= 12)
            {
                hdc.Run(new[] { "kill -9" }, $"Failed to kill hdc server.");
                hdc.Run(new[] { "start" }, $"Failed to start hdc server.");
            }
        }

        /// <summary>
        /// Add reminder to if incompatible version hdc used.
        /// </summary>
        public static string HDCVersionReminder(int deviceSdkVersion, OpenHarmonyBridge.HDC hdc)
        {
            var hdcSdkVersion = hdc.GetHDCVersion();
            if(hdcSdkVersion < deviceSdkVersion)
                return string.Format("(Device SDK Version: {0}; HDC SDK Version:{1}. Update Required)", deviceSdkVersion, hdcSdkVersion);
            else if (deviceSdkVersion == -1)
                return string.Format("(HDC SDK Version: {0}, version is too low. Update Required)", hdcSdkVersion);
            else
                return String.Empty;
        }

        /// <summary>
        /// Check if the device is connected.
        /// </summary>
        public static bool CheckCommandSuccess(string msg)
        {
            return (msg.Contains("Not match target founded") || msg.Contains("Device not founded") || msg.Contains("connect failed") || msg.Contains("Bind tartget session is dead"));
        }

        //The hdc can access devices with higher version of sdk, but fails to send commands to them. Take the device as "Disconnected"
        public static bool CheckSendCommandSuccess(OpenHarmonyBridge.HDC hdc, string id)
        {
            var HDCOutput = string.Empty;

            Task<string> task = Task<string>.Factory.StartNew(() =>
            {
                return hdc.Run(new[] { "-t", id, "jpid" }, $"Failed to connect to {id}.");
            });


            if (task.Wait(2000))
            {
                HDCOutput = task.Result;
            }
            else
            {
                //Disabling the Wi-Fi connection mode from the device side may cause the HDC to hang indefinitely.
                //A timer is added to forcibly terminate the unresponsive HDC process.
                OpenHarmonyHilogInternalLog.Log(string.Format("Command: hdc -t {0} jpid is timeout. Considering as \"Not match target founded\"", id));
                DisconnectDevices(hdc, id);
                return true;
            }

            return CheckCommandSuccess(HDCOutput);
        }

        //Manually disable the Wi-Fi connection, in the "settings" interface of devices with some versions of system, misleads the hdc process the devices are reachable, although they have already been disconnected in pratice.
        //Therefore, we disconnect those fake connections manaully.
        public static void DisconnectDevices(OpenHarmonyBridge.HDC hdc, string id)
        {
            var cmd = string.Empty;
            try
            {
                //cmd = string.Format("tconn {0}", id);
                cmd = "kill -9";
                hdc.Run(new[] { cmd }, "Unable to connect to " + id);
                cmd = "start";
                hdc.Run(new[] { cmd }, "Unable to connect to " + id);
            }
            catch (Exception e)
            {
                OpenHarmonyHilogInternalLog.Log(string.Format("Command: {0} fails: {1}", cmd, e.Message));
                throw;
            }
        }

    }
}
