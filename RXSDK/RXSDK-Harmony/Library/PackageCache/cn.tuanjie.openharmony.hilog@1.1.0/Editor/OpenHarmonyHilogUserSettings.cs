using System;
using System.IO;
using UnityEngine;
using System.Collections.Generic;
using System.Linq;

namespace Tuanjie.OpenHarmony.Hilog
{
    [Serializable]
    internal class OpenHarmonyHilogUserSettings
    {
        [SerializeField]
        private string m_SelectedDeviceId;
        [SerializeField]
        private ProcessInformation m_SelectedProcess;
        [SerializeField]
        private Priority m_SelectedPriority;
        private Dictionary<string, List<ProcessInformation>> m_KnownProcesses;
        [SerializeField]
        private List<ProcessInformation> m_KnownProcessesForSerialization;
        [SerializeField]
        private OpenHarmonyHilogTags m_Tags;
        [SerializeField]
        private OpenHarmonyHilogMemoryWindowState m_MemoryViewerState;
        [SerializeField]
        private FilterOptions m_FilterOptions;
        [SerializeField]
        private List<ReordableListItem> m_SymbolPaths;

        [SerializeField]
        private AutoScroll m_AutoScroll;

        public string LastSelectedDeviceId
        {
            set
            {
                m_SelectedDeviceId = value;
            }
            get
            {
                return m_SelectedDeviceId;
            }
        }

        public bool LastSelectedDeviceIdValid
        {
            get
            {
                return !string.IsNullOrEmpty(m_SelectedDeviceId);
            }
        }

        public bool SelectedPackageValid
        {
            get
            {
                return m_SelectedProcess != null &&
                    !string.IsNullOrEmpty(m_SelectedProcess.deviceId) &&
                    m_SelectedProcess.processId > 0;
            }
        }

        public Priority SelectedPriority
        {
            set
            {
                m_SelectedPriority = value;
            }
            get
            {
                return m_SelectedPriority;
            }
        }

        public AutoScroll AutoScroll { set => m_AutoScroll = value; get => m_AutoScroll; }

        private void RefreshProcessesForSerialization()
        {
            m_KnownProcessesForSerialization = new List<ProcessInformation>();
            foreach (var p in m_KnownProcesses)
            {
                m_KnownProcessesForSerialization.AddRange(p.Value);
            }
        }

        public IReadOnlyList<ProcessInformation> GetKnownProcesses(IOpenHarmonyHilogDevice device)
        {
            return GetOrCreateProcessForDevice(device);
        }

        private List<ProcessInformation> GetOrCreateProcessForDevice(IOpenHarmonyHilogDevice device)
        {
            if (device == null)
                return new List<ProcessInformation>();

            List<ProcessInformation> processes = null;
            if (!m_KnownProcesses.TryGetValue(device.Id, out processes))
            {
                processes = new List<ProcessInformation>();
                m_KnownProcesses[device.Id] = processes;
            }
            return processes;
        }

        public void CleanupDeadProcessesForDevice(IOpenHarmonyHilogDevice device, int maxExitedPackagesToShow)
        {
            if (device == null)
                return;

            List<ProcessInformation> processes = null;
            if (!m_KnownProcesses.TryGetValue(device.Id, out processes))
                return;

            int deadProcessCount = 0;

            for (int i = 0; i < processes.Count; i++)
            {
                if (processes[i].IsAlive() == false)
                    deadProcessCount++;
            }

            // Need to remove the package which were added first, since they are the oldest packages
            int deadProcessesToRemove = deadProcessCount - maxExitedPackagesToShow;
            if (deadProcessesToRemove <= 0)
                return;

            for (int i = 0; i < processes.Count && deadProcessesToRemove > 0;)
            {
                if (processes[i].IsAlive())
                {
                    i++;
                    continue;
                }

                deadProcessesToRemove--;
                processes.RemoveAt(i);
            }

            RefreshProcessesForSerialization();
        }

        public ProcessInformation CreateProcessInformation(string processName, int pid, IOpenHarmonyHilogDevice device)
        {
            if (pid <= 0)
                return null;

            if (device == null)
            {
                Debug.LogError("Cannot create package information, since there's no OpenHarmony device connected.");
                return null;
            }

            var processes = GetOrCreateProcessForDevice(device);
            ProcessInformation info = processes.FirstOrDefault(package => package.processId == pid);
            if (info != null)
                return info;

            var newProcess = new ProcessInformation()
            {
                name = processName,
                processId = pid,
                deviceId = device.Id
            };

            //At most 4 recorded processes for each device
            if (processes.Count >= 4)
                processes.RemoveAt(0);
            processes.Add(newProcess);
            RefreshProcessesForSerialization();
            return newProcess;
        }

        private static Dictionary<string, List<ProcessInformation>> ProcessesToDictionary(List<ProcessInformation> allPackages)
        {
            var dictionaryProcesses = new Dictionary<string, List<ProcessInformation>>();
            foreach (var p in allPackages)
            {
                List<ProcessInformation> processes;
                if (!dictionaryProcesses.TryGetValue(p.deviceId, out processes))
                {
                    processes = new List<ProcessInformation>();
                    dictionaryProcesses[p.deviceId] = processes;
                }
                processes.Add(p);
            }

            return dictionaryProcesses;
        }

        public OpenHarmonyHilogTags Tags
        {
            set
            {
                m_Tags = value;
            }
            get
            {
                return m_Tags;
            }
        }

        public OpenHarmonyHilogMemoryWindowState MemoryViewerState
        {
            set
            {
                m_MemoryViewerState = value;
            }
            get
            {
                return m_MemoryViewerState;
            }
        }

        public FilterOptions FilterOptions
        {
            set
            {
                m_FilterOptions = value;
            }
            get
            {
                return m_FilterOptions;
            }
        }

        public List<ReordableListItem> SymbolPaths
        {
            set
            {
                m_SymbolPaths = value;
            }
            get
            {
                return m_SymbolPaths;
            }
        }

        internal OpenHarmonyHilogUserSettings()
        {
            Reset();
        }

        internal void Reset()
        {
            m_SelectedDeviceId = string.Empty;
            m_SelectedPriority = Priority.Verbose;
            m_Tags = new OpenHarmonyHilogTags();
            m_KnownProcesses = new Dictionary<string, List<ProcessInformation>>();
            m_MemoryViewerState = new OpenHarmonyHilogMemoryWindowState();
            m_SymbolPaths = new List<ReordableListItem>();
            m_FilterOptions = new FilterOptions();
        }

        internal static OpenHarmonyHilogUserSettings Load(string path)
        {
            if (!File.Exists(path))
                return null;

            var jsonString = File.ReadAllText(path);
            if (string.IsNullOrEmpty(jsonString))
                return null;

            try
            {
                var settings = new OpenHarmonyHilogUserSettings();
                JsonUtility.FromJsonOverwrite(jsonString, settings);
                settings.m_KnownProcesses = ProcessesToDictionary(settings.m_KnownProcessesForSerialization);
                return settings;
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log("Load Preferences from Json failed: " + ex.Message);
            }
            return null;
        }

        internal static void Save(OpenHarmonyHilogUserSettings settings, string path, OpenHarmonyHilogRuntimeBase runtime)
        {
            if (settings == null)
                throw new NullReferenceException(nameof(settings));

            var jsonString = JsonUtility.ToJson(settings, true);
            if (string.IsNullOrEmpty(jsonString))
                return;

            File.WriteAllText(path, jsonString);
        }
    }
}
