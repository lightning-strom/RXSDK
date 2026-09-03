using System.Collections.Generic;
using System;
using System.Text.RegularExpressions;
using System.Linq;
using System.Threading.Tasks;
using UnityEditor;
using UnityEngine;

namespace Tuanjie.OpenHarmony.Hilog
{
    internal class OpenHarmonyHilog
    {
        private OpenHarmonyHilogRuntimeBase m_Runtime;
        private OpenHarmonyBridge.HDC HDC;

        private readonly IOpenHarmonyHilogDevice m_Device;
        private readonly int m_ProcessId;
        private readonly Priority m_MessagePriority;
        private readonly string[] m_Tags;
        private readonly HilogFilterOptions m_FilterOptions;
        private FilterOptions m_LastUsedFilterOptions;
        private List<HilogEntry> m_RawLogEntries = new List<HilogEntry>();
        private List<HilogEntry> m_FilteredLogEntries = new List<HilogEntry>();

        public IOpenHarmonyHilogDevice Device { get { return m_Device; } }

        public int PackagePid { get { return m_ProcessId; } }

        public Priority MessagePriority { get { return m_MessagePriority; } }

        public string[] Tags { get { return m_Tags; } }

        public event Action<IReadOnlyList<HilogEntry>> FilteredLogEntriesAdded;

        public event Action<IOpenHarmonyHilogDevice> Disconnected;

        public event Action<IOpenHarmonyHilogDevice> Connected;

        private OpenHarmonyHilogMessageProviderBase m_MessageProvider;

        private List<string> m_CachedLogLines = new List<string>();

        public IReadOnlyList<HilogEntry> RawEntries => m_RawLogEntries;
        public IReadOnlyList<HilogEntry> FilteredEntries => m_FilteredLogEntries;
        public IReadOnlyList<HilogEntry> GetSelectedFilteredEntries(out int minIndex, out int maxIndex)
        {
            minIndex = int.MaxValue;
            maxIndex = int.MinValue;

            var selectedEntries = new List<HilogEntry>(FilteredEntries.Count);
            for (int i = 0; i < FilteredEntries.Count; i++)
            {
                if (!FilteredEntries[i].Selected)
                    continue;

                if (i < minIndex)
                    minIndex = i;
                if (i > maxIndex)
                    maxIndex = i;
                selectedEntries.Add(FilteredEntries[i]);
            }

            return selectedEntries;
        }

        public void ClearSelectedEntries()
        {
            foreach (var e in RawEntries)
                e.Selected = false;
        }

        public void SelectAllFilteredEntries()
        {
            // Note: we're deselecting all raw entries first, to cover this scenario:
            // - Suppose we have 10 entries
            // - Select All
            // - Set filter which would make 5 filtered entries from those 10
            // - Select All
            // - Clear filter
            // - 10 entries are now visible, but selected are only 5, not 10
            ClearSelectedEntries();

            foreach (var e in FilteredEntries)
                e.Selected = true;
        }

        public FilterOptions FilterOptions => m_FilterOptions;

        public bool IsConnected
        {
            get
            {
                if (m_MessageProvider == null)
                    return false;
                try
                {
                    if (m_MessageProvider.HasExited)
                        return false;

                    if (m_Device == null)
                        return false;

                    return m_Device.State == IOpenHarmonyHilogDevice.DeviceState.Connected;
                }
                catch (Exception ex)
                {
                    Debug.LogError(ex.Message);
                    return false;
                }
            }
        }

        public OpenHarmonyHilogMessageProviderBase MessageProvider
        {
            get { return m_MessageProvider; }
        }

        public OpenHarmonyHilog(OpenHarmonyHilogRuntimeBase runtime,
            OpenHarmonyBridge.HDC HDC,
            IOpenHarmonyHilogDevice device,
            int processId,
            Priority priority,
            FilterOptions filterOptions,
            string[] tags)
        {
            this.m_Runtime = runtime;
            this.HDC = HDC;
            this.m_Device = device;
            this.m_ProcessId = processId;
            this.m_MessagePriority = priority;
            this.m_FilterOptions = new HilogFilterOptions(filterOptions);
            this.m_LastUsedFilterOptions = new FilterOptions(m_FilterOptions);
            this.m_Tags = tags;

            m_FilterOptions.OnFilterChanged = OnFilterChanged;

            HilogEntry.SetTimeFormat(m_Device.SupportYearFormat ? HilogEntry.kTimeFormatWithYear : HilogEntry.kTimeFormatWithoutYear);
        }

        private void ClearEntries()
        {
            m_RawLogEntries.Clear();
            m_FilteredLogEntries.Clear();
        }

        internal bool CanReuseFilteredResults()
        {
            if (m_LastUsedFilterOptions.UseRegularExpressions ||
                m_FilterOptions.UseRegularExpressions)
                return false;

            // When changing match case from true to false, the previous set might not enough for new results
            // But previous set will might be enough when changing Match Case from false to true
            if (m_LastUsedFilterOptions.MatchCase != m_FilterOptions.MatchCase &&
                m_LastUsedFilterOptions.MatchCase &&
                !m_FilterOptions.MatchCase)
                return false;

            return m_FilterOptions.Filter.IndexOf(m_LastUsedFilterOptions.Filter, StringComparison.InvariantCultureIgnoreCase) != -1;
        }

        private void OnFilterChanged()
        {
            // Optimization, reuse previous results if possible
            if (CanReuseFilteredResults())
            {
                FilterEntriesUsingFilteredEntries(m_FilteredLogEntries);
            }
            else
            {
                m_FilteredLogEntries.Clear();
                FilterEntriesUsingRawEntries(m_RawLogEntries);
            }

            m_LastUsedFilterOptions.Filter = m_FilterOptions.Filter;
            m_LastUsedFilterOptions.UseRegularExpressions = m_FilterOptions.UseRegularExpressions;
            m_LastUsedFilterOptions.MatchCase = m_FilterOptions.MatchCase;
        }

        internal void Start()
        {
            if (m_Device.ConnectionType == IOpenHarmonyHilogDevice.DeviceConnectionType.Network)
            {
                EditorUtility.DisplayProgressBar("Connecting", "Connecting to " + m_Device.Id, 0.0f);
                m_Runtime.Dispatcher.Schedule(new OpenHarmonyHilogConnectToDeviceInput() { hdc = m_Runtime.Tools.HDC, deviceId = m_Device.Id },
                    OpenHarmonyHilogReconnectToDeviceTask.Execute, IntegrateReconnectToDevice, false);
                //Pause the thread 5s waiting for the finish of Wi-Fi connection, as it is asynchronous in case of the blocking of Unity Editor. 
                System.Threading.Thread.Sleep(5000);
            }

            m_Runtime.Update += OnUpdate;
            m_MessageProvider = m_Runtime.CreateMessageProvider(HDC, MessagePriority, m_Device.SupportsFilteringByPid ? PackagePid : 0, LogPrintFormat, m_Device, OnDataReceived);
            m_MessageProvider.Start();

            Connected?.Invoke(Device);
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
                    m_Device.UpdateState(IOpenHarmonyHilogDevice.DeviceState.Disconnected);
                }
                else
                {
                    r.success = true;
                    m_Device.UpdateState(IOpenHarmonyHilogDevice.DeviceState.Connected);
                }
            }

            OpenHarmonyHilogInternalLog.Log(r.message);
            EditorUtility.ClearProgressBar();
            EditorUtility.DisplayDialog(r.success ? "Success" : "Failure", r.message, "Ok");
        }

        internal void Stop()
        {
            m_CachedLogLines.Clear();
            if (m_Runtime != null)
                m_Runtime.Update -= OnUpdate;
            if (m_MessageProvider != null)
            {
                // NOTE: DONT CALL CLOSE
                m_MessageProvider.Kill();
            }

            m_MessageProvider = null;
        }

        internal void Clear()
        {
            if (m_MessageProvider != null)
                throw new InvalidOperationException("Cannot clear hilog when hdc process is alive.");

            if (m_Device.State == IOpenHarmonyHilogDevice.DeviceState.Connected)
            {
                //clear hilog buffer
                var HDCOutput = HDC.Run(new[] { "-t", Device.Id, "shell hilog", "-r" }, "Failed to clear hilog.");
            }
            else
            {
                OpenHarmonyHilogInternalLog.Log($"Device {Device.Id} is not connected (State: {m_Device.State}), cannot clear messages");
            }

            ClearEntries();
        }

        void OnUpdate()
        {
            if (m_MessageProvider == null)
                return;

            if (m_MessageProvider.HasExited)
            {
                Stop();

                Disconnected?.Invoke(Device);

                return;
            }

            ProcessCachedLogLines();
        }

        void ProcessCachedLogLines()
        {
            List<HilogEntry> entries = new List<HilogEntry>();
            lock (m_CachedLogLines)
            {
                if (m_CachedLogLines.Count == 0)
                    return;

                var needFilterByPid = !m_Device.SupportsFilteringByPid && PackagePid > 0;
                var needFilterByTags = Tags != null && Tags.Length > 0;
                Regex regex = LogParseRegex;
                foreach (var logLine in m_CachedLogLines)
                {
                    var m = regex.Match(logLine??string.Empty);
                    if (!m.Success)
                        continue;

                    if (needFilterByPid && Int32.Parse(m.Groups["pid"].Value) != PackagePid)
                        continue;

                    if (needFilterByTags && !MatchTagsFilter(m.Groups["tag"].Value))
                        continue;

                    entries.Add(ParseLogEntry(m));
                }
                m_CachedLogLines.Clear();
            }

            if (entries.Count == 0)
                return;

            m_RawLogEntries.AddRange(entries);

            StripRawEntriesIfNeeded();

            FilterEntriesUsingRawEntries(entries);
        }

        public void StripRawEntriesIfNeeded()
        {
            var rawMaxCount = m_Runtime.Settings.MaxCachedMessageCount;
            if (rawMaxCount > 0 && m_RawLogEntries.Count > rawMaxCount)
                m_RawLogEntries.RemoveRange(0, m_RawLogEntries.Count - rawMaxCount);
        }

        public void StripFilteredEntriesIfNeeded()
        {
            var filteredMaxCount = m_Runtime.Settings.MaxDisplayedMessageCount;
            if (filteredMaxCount > 0 && m_FilteredLogEntries.Count > filteredMaxCount)
                m_FilteredLogEntries.RemoveRange(0, m_FilteredLogEntries.Count - filteredMaxCount);
        }

        private List<HilogEntry> FilterEntries(IReadOnlyList<HilogEntry> unfilteredEntries)
        {
            // Set capacity 10% for filtered entries from unfiltered entries to minimize unneeded allocations
            var filteredEntries = new List<HilogEntry>(unfilteredEntries.Count / 10);
            foreach (var entry in unfilteredEntries)
            {
                if (!m_FilterOptions.Matches(entry.message))
                    continue;
                filteredEntries.Add(entry);
            }

            return filteredEntries;
        }

        private void FilterEntriesUsingRawEntries(IReadOnlyList<HilogEntry> unfilteredEntries)
        {
            IReadOnlyList<HilogEntry> filteredEntries;
            if (string.IsNullOrEmpty(m_FilterOptions.Filter))
            {
                filteredEntries = unfilteredEntries.ToList();
            }
            else
            {
                filteredEntries = FilterEntries(unfilteredEntries);
            }

            if (filteredEntries.Count == 0)
                return;

            m_FilteredLogEntries.AddRange(filteredEntries);
            FilteredLogEntriesAdded?.Invoke(filteredEntries);

            StripFilteredEntriesIfNeeded();
        }

        private void FilterEntriesUsingFilteredEntries(IReadOnlyList<HilogEntry> unfilteredEntries)
        {
            if (string.IsNullOrEmpty(m_FilterOptions.Filter))
                return;

            var filteredEntries = FilterEntries(unfilteredEntries);
            m_FilteredLogEntries = filteredEntries;
            if (filteredEntries.Count == 0)
                return;
            FilteredLogEntriesAdded?.Invoke(filteredEntries);

            // No need to strip, since filtering from filtered entries, can only shrink the list, but not grow
        }

        private HilogEntry LogEntryParserErrorFor(string msg)
        {
            return new HilogEntry(msg);
        }

        private bool MatchTagsFilter(string tagInMsg)
        {
            return Tags.Contains(tagInMsg);
        }

        private HilogEntry ParseLogEntry(Match m)
        {
            DateTime dateTime;
            var dateValue = m.Groups["date"].Value;
            if (LogPrintFormat == kThreadTime)
                dateValue = "1999-" + dateValue;

            try
            {
                dateTime = DateTime.Parse(dateValue);
            }
            catch (Exception ex)
            {
                dateTime = new DateTime();
                OpenHarmonyHilogInternalLog.Log("Failed to parse date: " + dateValue + "\n" + ex.Message);
            }

            var entry = new HilogEntry(
                dateTime,
                Int32.Parse(m.Groups["pid"].Value),
                Int32.Parse(m.Groups["tid"].Value),
                OpenHarmonyHilogUtilities.PriorityStringToEnum(m.Groups["priority"].Value),
                m.Groups["tag"].Value,
                m.Groups["msg"].Value);

            return entry;
        }

        private void OnDataReceived(string message)
        {
            if (string.IsNullOrEmpty(message))
                return;

            lock (m_CachedLogLines)
            {
                m_CachedLogLines.Add(message);
            }
        }

        private static int s_DebuggingMessageId;

        private void DbgAddLogLines(int count)
        {
            var entries = new List<HilogEntry>(count);
            for (int i = 0; i < count; i++)
            {
                var pid = 123;
                var tid = 234;
                OnDataReceived($"2022-01-31 12:43:40.003   {pid}   {tid} I DummyTag: Dummy Message {s_DebuggingMessageId}");
                s_DebuggingMessageId++;
            }

            ProcessCachedLogLines();
        }
        internal void DoDebuggingGUI()
        {
            if (GUILayout.Button("Add Log line", OpenHarmonyHilogStyles.toolbarButton))
            {
                DbgAddLogLines(1);
            }
            if (GUILayout.Button("Add Log lines", OpenHarmonyHilogStyles.toolbarButton))
            {
                DbgAddLogLines(10000);
            }
            GUILayout.Label($"Raw: {m_RawLogEntries.Count} Filtered: {m_FilteredLogEntries.Count}");
        }

        internal Regex LogParseRegex
        {
            get { return m_Device.SupportYearFormat ? m_HilogEntryYearRegex : m_HilogEntryThreadTimeRegex; }
        }

        /// <summary>
        /// Returns log print format used with HDC hilog --format LogPrintFormat
        /// </summary>
        internal string LogPrintFormat
        {
            get { return m_Device.SupportYearFormat ? kYearTime : kThreadTime; }
        }

        internal static Regex m_CrashMessageRegex = new Regex(@"^\s*#\d{2}\s*pc\s([a-fA-F0-9]{8}).*(libtuanjie\.so|libmain\.so)", RegexOptions.Compiled);
        // Regex for messages produced via 'hdc hilog -format year'
        internal static Regex m_HilogEntryYearRegex = new Regex(@"(?<date>\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d{3})\s+(?<pid>\d+)\s+(?<tid>\d+)\s+(?<priority>[DIWEF])\s+(?<tag>.+?)\s*:\s(?<msg>.*)", RegexOptions.Compiled);

        // Regex for messages produced via 'hdc hilog --format time'
        internal static Regex m_HilogEntryThreadTimeRegex = new Regex(@"(?<date>\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\.\d{3})\s+(?<pid>\d+)\s+(?<tid>\d+)\s+(?<priority>[DIWEF])\s+(?<tag>.+?)\s*:\s(?<msg>.*)", RegexOptions.Compiled);


        internal static readonly int kTuanjieHashCode = "Tuanjie".GetHashCode();
        internal static readonly int kCrashHashCode = "CRASH".GetHashCode();
        internal static readonly int kDebugHashCode = "DEBUG".GetHashCode();

        // Log PrintFormats
        internal const string kThreadTime = "time";
        internal const string kYearTime = "year";
    }
}
