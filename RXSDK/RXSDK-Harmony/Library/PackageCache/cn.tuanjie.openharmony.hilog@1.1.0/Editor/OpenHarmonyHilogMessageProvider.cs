using System.Diagnostics;
using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using UnityEditor;
using System.Collections.Generic;
using System.IO;

namespace Tuanjie.OpenHarmony.Hilog
{
    internal abstract class OpenHarmonyHilogMessageProviderBase
    {
        protected OpenHarmonyBridge.HDC m_HDC;
        protected Priority m_Priority;
        protected int m_PackageID;
        protected string m_LogPrintFormat;
        protected IOpenHarmonyHilogDevice m_Device;
        protected Action<string> m_LogCallbackAction;

        protected System.Timers.Timer m_CheckHilogOutputTimeoutTimer;
        protected System.Timers.Timer m_CheckHDCRunningTimer;
        protected DateTime m_LastLogTime;

        internal OpenHarmonyHilogMessageProviderBase(OpenHarmonyBridge.HDC HDC, Priority priority, int packageID, string logPrintFormat, IOpenHarmonyHilogDevice device, Action<string> logCallbackAction)
        {
            m_HDC = HDC;
            m_Priority = priority;
            m_PackageID = packageID;
            m_LogPrintFormat = logPrintFormat;
            m_Device = device;
            m_LogCallbackAction = logCallbackAction;
        }

        public abstract void Start();
        public abstract void Stop();
        public abstract void Kill();
        public abstract bool HasExited { get; set; }
    }

    internal class OpenHarmonyHilogMessageProvider : OpenHarmonyHilogMessageProviderBase
    {
        private Process m_HilogProcess;

        internal OpenHarmonyHilogMessageProvider(OpenHarmonyBridge.HDC HDC, Priority priority, int packageID, string logPrintFormat, IOpenHarmonyHilogDevice device, Action<string> logCallbackAction)
            : base(HDC, priority, packageID, logPrintFormat, device, logCallbackAction)
        {
        }

        private string PriorityEnumToString(Priority priority)
        {
            //In OpenHarmony, there is not a level called "Verbose"
            if (priority == 0)
                return string.Empty;
            return string.Format("--level {0}", priority.ToString().Substring(0, 1));
        }

        private string HilogArguments()
        {
            var filterArg = string.Empty;
            // Note: We're doing the filtering manually and never ask hilog to do it.
            //       This allows us to perform filtering even when hilog is disconnected
            //       Previously hilog filtering was being done with --regex "<regex_expression>"
            var priority = PriorityEnumToString(m_Priority);
            if (m_PackageID > 0)
                return string.Format("-t {0} shell hilog --pid {1} --format {2} {3} {4}", m_Device.Id, m_PackageID, m_LogPrintFormat, priority, filterArg);

            return string.Format("-t {0} shell hilog --format {1} {2} {3} ", m_Device.Id, m_LogPrintFormat, priority, filterArg);
        }

        public override void Start()
        {
            var systemDirectory = string.Empty;
            var powerShellPath = string.Empty;

            //Create terminal to call hdc, as the hdc process, unlike adb, terminates if commands finish.
            //Besides, the hdc process also meets some unexpected crashes.
#if UNITY_EDITOR_WIN
            systemDirectory = Environment.GetFolderPath(Environment.SpecialFolder.System);
            powerShellPath = System.IO.Path.Combine(systemDirectory, "cmd.exe");
#elif UNITY_EDITOR_OSX || UNITY_EDITOR_LINUX
            powerShellPath = "/bin/bash";
#endif

            try
            {
                string commands = string.Format(" \"{0}\" {1}", m_HDC.GetHDCPath(), HilogArguments());

                if (m_HilogProcess == null)
                {
                    m_HilogProcess = new Process();
                    m_HilogProcess.StartInfo.FileName = powerShellPath;
                    m_HilogProcess.StartInfo.StandardOutputEncoding = Encoding.UTF8;
                    m_HilogProcess.StartInfo.RedirectStandardError = true;
                    m_HilogProcess.StartInfo.RedirectStandardOutput = true;
                    m_HilogProcess.StartInfo.RedirectStandardInput = true;
                    m_HilogProcess.StartInfo.UseShellExecute = false;
                    m_HilogProcess.StartInfo.CreateNoWindow = true;
                    m_HilogProcess.OutputDataReceived += OutputDataReceived;
                    m_HilogProcess.ErrorDataReceived += ErrorDataReceived;
                    m_HilogProcess.Start();

                    m_HilogProcess.BeginOutputReadLine();
                    m_HilogProcess.BeginErrorReadLine();

                    m_CheckHilogOutputTimeoutTimer = new System.Timers.Timer(1000);
                    m_CheckHilogOutputTimeoutTimer.Elapsed += CheckDeviceConnection;
                    m_CheckHilogOutputTimeoutTimer.AutoReset = true;
                    m_LastLogTime = DateTime.Now;
                }

                m_HilogProcess.StandardInput.WriteLine(commands);
                m_HilogProcess.StandardInput.AutoFlush = true;
                HasExited = false;
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log("Fail to run hilog commands in the shell: " + ex.Message);
                HasExited = true;
                return;
            }

            //Check if hilog is running, as it may crash when starting.
            m_CheckHDCRunningTimer = new System.Timers.Timer(500);
            m_CheckHDCRunningTimer.Elapsed += (sender, e) =>
            {
                var HDCOutput = m_HDC.Run(new[] { "-t", m_Device.Id, "jpid" }, $"Failed to connect to {m_Device.Id}.");
                HasExited = HDCOutput.Contains("Not match target founded") || HDCOutput.Contains("Device not founded") || HDCOutput.Contains("connect failed") || HDCOutput.Contains("version is too low");
                //Avoid checking hdc.exe every half second, it causes significant perfomrance problem.
                m_CheckHDCRunningTimer.Stop();
            };
            m_CheckHDCRunningTimer.Start();
        }

        public override void Stop()
        {
            if (m_HilogProcess != null && !HasExited)
            {
                foreach (var node in Process.GetProcessesByName("hdc"))
                {
                    node.Kill();
                }
                m_HilogProcess.Kill();
            }

            m_HilogProcess = null;
        }

        public override void Kill()
        {
            // NOTE: DONT CALL CLOSE, or "terminal" process will stay alive all the time
            OpenHarmonyHilogInternalLog.Log("Stopping hilog (process id {0})", m_HilogProcess.Id);
            //As the hdc is running in the terminal, the terminal process will not be killed if the hdc is still alive.
            if (!m_HilogProcess.HasExited)
                ProcessHelper.KillProcess(m_HilogProcess);
        }

        internal bool m_HasExited;

        public override bool HasExited
        {
            get
            {
                return m_HasExited || m_HilogProcess.HasExited;
            }
            set
            {
                m_HasExited = value;
            }
        }

        private void OutputDataReceived(object sender, DataReceivedEventArgs e)
        {
            if (!string.IsNullOrEmpty(e.Data))
            {
                m_LogCallbackAction(e.Data);
                m_LastLogTime = DateTime.Now;
            }

            //Timer to check if devices (printing logs) are still connected.
            if (!m_CheckHilogOutputTimeoutTimer.Enabled)
            {
                m_CheckHilogOutputTimeoutTimer.Start();
            }
        }

        private void CheckDeviceConnection(object sender, ElapsedEventArgs e)
        {
            if (!HasExited && (DateTime.Now - m_LastLogTime).TotalMilliseconds > 1500d)
            {
                OpenHarmonyHilogInternalLog.Log("{0} -t {1} jpid", m_HDC.GetHDCPath(), m_Device.Id);
                string HDCOutput = string.Empty;

                Task<string> task = Task.Run(() =>
                {
                    return m_HDC.Run(new[] { "-t", m_Device.Id, "jpid" }, $"Failed to connect to {m_Device.Id}.");
                });

                try
                {
                    HDCOutput = task.Wait(2000) ? task.Result : throw new TimeoutException();
                }
                catch (TimeoutException)
                {
                    //Disabling the Wi-Fi connection mode from the device side may cause the HDC to hang indefinitely.
                    //A timer is added to forcibly terminate the unresponsive HDC process.
                    HasExited = true;
                    m_CheckHilogOutputTimeoutTimer.Stop();
                    m_Device.UpdateState(IOpenHarmonyHilogDevice.DeviceState.Disconnected);
                    OpenHarmonyHilogInternalLog.Log($"Command timeout. Considering as \"Not match target founded\"");
                }
                catch (Exception ex)
                {
                    OpenHarmonyHilogInternalLog.Log($"Error executing command: {ex.Message}");
                }

                OpenHarmonyHilogInternalLog.Log(HDCOutput);
                HasExited = HDCOutput.Contains("Not match target founded") ||
                            HDCOutput.Contains("Device not founded") ||
                            HDCOutput.Contains("connect failed");

                if (HasExited)
                {
                    m_CheckHilogOutputTimeoutTimer.Stop();
                }
                else
                {
                    m_LastLogTime = DateTime.Now;
                }
            }
        }

        private void ErrorDataReceived(object sender, DataReceivedEventArgs e)
        {
            if (!string.IsNullOrEmpty(e.Data))
            {
                OpenHarmonyHilogInternalLog.Log(string.Format(" command \" \"{0}\" {1} \" fails to execute", m_HDC.GetHDCPath(), HilogArguments()));
                HasExited = true;
                m_CheckHilogOutputTimeoutTimer.Stop();
            }
        }
    }

    public static class ProcessHelper
    {

        public static void KillProcess(this Process process)
        {
            var cmd = string.Empty;
#if UNITY_EDITOR_WIN
            cmd = string.Format("/T /F /PID {0}", process.Id);
            RunCommand("taskkill", cmd, out string output);
#elif UNITY_EDITOR_OSX || UNITY_EDITOR_LINUX
            var childrenIds = new HashSet<int>();
            GetChildrenIds(process.Id, childrenIds);
            foreach (var childId in childrenIds)
            {
                cmd = string.Format("-TERM {0}", childId);
                RunCommand("kill", cmd, out string output);
            }
#endif
        }

        public static bool RunCommand(string fileName, string cmd, out string output)
        {
            var process = new Process();
            process.StartInfo.FileName = fileName;
            process.StartInfo.Arguments = cmd;
            process.StartInfo.StandardOutputEncoding = Encoding.UTF8;
            process.StartInfo.RedirectStandardError = true;
            process.StartInfo.RedirectStandardOutput = true;
            process.StartInfo.RedirectStandardInput = true;
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.CreateNoWindow = true;

            process.Start();

            if (process.WaitForExit(30))
            {
                output = process.StandardOutput.ReadToEnd();
                OpenHarmonyHilogInternalLog.Log("Command \"{0} {1}\" execution is successful, Result \"{2}\"", fileName, cmd, output);
            }
            else
            {
                output = string.Empty;
                if (!process.HasExited)
                {
                    process.Kill();
                    OpenHarmonyHilogInternalLog.Log(string.Format("Command \"{0} {1}\" execution fails: {2}", fileName, cmd, process.StandardError.ReadToEnd()));
                }
            }

            return process.ExitCode == 0;
        }

        public static void GetChildrenIds(int parentId, HashSet<int> childrenIds)
        {
            var cmd = string.Empty;
            cmd = string.Format("-P {0}", parentId);
            if(RunCommand("pgrep", cmd, out string output))
            {
                if (string.IsNullOrEmpty(output))
                    return;
                var reader = new StringReader(output);
                var text = reader.ReadLine();
                while (text != null)
                {
                    int id;
                    if (int.TryParse(text, out id))
                        GetChildrenIds(id, childrenIds);
                    text = reader.ReadLine();
                }
            }
            childrenIds.Add(parentId);
        }
    }
}