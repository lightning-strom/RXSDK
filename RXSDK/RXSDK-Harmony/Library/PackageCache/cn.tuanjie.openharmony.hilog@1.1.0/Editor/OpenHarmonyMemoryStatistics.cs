using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.RegularExpressions;


namespace Tuanjie.OpenHarmony.Hilog
{
    /// <summary>
    /// Types of memory usage defined by "OpenHarmony Hilog".
    /// </summary>
    internal enum MemoryGroup
    {
        ResidentSetSize,
        ProportionalSetSize,
        HeapAlloc,
        HeapSize
    }

    /// <summary>
    /// Types of memory usage collected by hdc.
    /// </summary>
    internal enum MemoryPageType
    {
        Pss_Total,
        Shared_Clean,
        Shared_Dirty,
        Private_Clean,
        Private_Dirty,
        Swap_Total,
        SwapPss_Total,
        Heap_Size,
        Heap_Alloc,
        Heap_Free
    }

    /// <summary>
    /// Types of memory usage collected by hdc.
    /// </summary>
    internal enum MemoryType
    {
        //Unknown = 0,
        Native_Heap = 0,
        Ark_Ts_Heap = 1,
        GL = 2,
        Graph = 3,
        Stack = 4,
        Guard = 5,
        AnonPage_Other = 6,
        hap = 7,
        so = 8,
        Dev = 9,
        FilePage_Other = 10,
        Total = 11
    }


    internal class OpenHarmonyMemoryStatistics
    {
        private const UInt64 kOneKiloByte = 1000;
        private MemoryGroup[] m_AllMemoryGroups;
        private MemoryPageType[] m_AllMemoryPageTypes;
        private MemoryType[] m_AllMemoryTypes;
        private Dictionary<MemoryType, UInt64>[] m_Data;

        private string MemoryTypeToName(MemoryType type)
        {
            if (type == MemoryType.GL)
                return "GL";
            if (type == MemoryType.Graph)
                return "Graph";
            if (type == MemoryType.Ark_Ts_Heap)
                return "ark ts heap";
            if (type == MemoryType.Guard)
                return "guard";
            if (type == MemoryType.Native_Heap)
                return "native heap";
            if (type == MemoryType.AnonPage_Other)
                return "AnonPage other";
            if (type == MemoryType.Stack)
                return "stack";
            if (type == MemoryType.hap)
                return ".hap";
            if (type == MemoryType.so)
                return ".so";
            if (type == MemoryType.Dev)
                return "dev";
            if (type == MemoryType.FilePage_Other)
                return "FilePage other";
            if (type == MemoryType.Total)
                return "Total";
            return string.Empty;
        }

        internal OpenHarmonyMemoryStatistics(MemoryGroup[] memoryGroups, MemoryPageType[] memoryPageTypes, MemoryType[] memoryTypes)
        {
            m_AllMemoryGroups = memoryGroups;
            m_AllMemoryPageTypes = memoryPageTypes;
            m_AllMemoryTypes = memoryTypes;
            m_Data = new Dictionary<MemoryType, UInt64>[m_AllMemoryPageTypes.Length];
            foreach (var g in m_AllMemoryPageTypes)
            {
                m_Data[(int)g] = new Dictionary<MemoryType, UInt64>();
            }
        }

        internal void Clear()
        {
            foreach (var g in m_AllMemoryGroups)
            {
                m_Data[(int)g].Clear();
            }
        }

        /// <summary>
        /// Some number values are in format like this 3(6)
        /// We need to convert those to 3
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private string FixNumberValue(string value)
        {
            int index = value.IndexOf("(");
            return index == -1 ? value : value.Substring(0, index);
        }

        internal void ParseHeapInformation(string heapInformation)
        {

            var postFix = @"\s+(?<Pss_Total>\d+)\s+(?<Shared_Clean>\d+)\s+(?<Shared_Dirty>\d+)\s+(?<Private_Clean>\d+)\s+(?<Private_Dirty>\d+)\s+(?<Swap_Total>\d+)\s+(?<SwapPss_Total>\d+)\s+(?<Heap_Size>\d+)\s+(?<Heap_Alloc>\d+)\s+(?<Heap_Free>\d+)\s+";
            foreach (MemoryType type in m_AllMemoryTypes)
            {
                var typeName = MemoryTypeToName(type);
                Regex typeRegex = new Regex(typeName + postFix, RegexOptions.IgnoreCase);

                var match = typeRegex.Match(heapInformation);
                if (!match.Success)
                    continue;

                var group = match.Groups;
                foreach (MemoryPageType page in m_AllMemoryPageTypes)
                {
                    var value = UInt64.Parse(FixNumberValue(group[page.ToString()].Value)) * kOneKiloByte;
                    SetValue(page, type, value);
                }
            }
        }

        internal UInt64 GetValue(MemoryGroup group, MemoryType type)
        {
            switch (group)
            {
                //Resident = Shared + Private
                case MemoryGroup.ResidentSetSize:
                    {
                        UInt64 value0;
                        UInt64 value1;
                        UInt64 value2;
                        UInt64 value3;
                        if (m_Data[(int)MemoryPageType.Shared_Clean].TryGetValue(type, out value0)
                            && m_Data[(int)MemoryPageType.Shared_Dirty].TryGetValue(type, out value1)
                            && m_Data[(int)MemoryPageType.Private_Clean].TryGetValue(type, out value2)
                            && m_Data[(int)MemoryPageType.Private_Dirty].TryGetValue(type, out value3))
                            return value0 + value1 + value2 + value3;
                        break;
                    }
                case MemoryGroup.ProportionalSetSize:
                    {
                        UInt64 value;
                        if (m_Data[(int)MemoryPageType.Pss_Total].TryGetValue(type, out value))
                            return value;
                        break;
                    }
                case MemoryGroup.HeapAlloc:
                    {
                        UInt64 value;
                        if (m_Data[(int)MemoryPageType.Heap_Alloc].TryGetValue(type, out value))
                            return value;
                        break;
                    }
                case MemoryGroup.HeapSize:
                    {
                        UInt64 value;
                        if (m_Data[(int)MemoryPageType.Heap_Size].TryGetValue(type, out value))
                            return value;
                        break;
                    }
                default:
                    {
                        break;
                    }
            }

            return 0;
        }

        internal void SetValue(MemoryPageType page, MemoryType type, UInt64 value)
        {
            m_Data[(int)page][type] = value;
        }

        internal UInt64 GetValue(MemoryPageType page, MemoryType type)
        {
            var dict = m_Data[(int)page];

            if(dict.ContainsKey(type))
                return m_Data[(int)page][type];

            return 0;
        }

        /// <summary>
        /// Parses contents from command 'hdc shell dumpsys meminfo package_name'
        /// </summary>
        /// <param name="contents"></param>
        /// <returns></returns>
        internal void Parse(string contents)
        {
            contents = contents.Replace("\r", "");
            ParseHeapInformation(contents);
        }

        internal void SetPSSFakeData(UInt64 totalMemory, UInt64 nativeHeap)
        {
            SetValue(MemoryPageType.Pss_Total, MemoryType.Total, totalMemory);
            SetValue(MemoryPageType.Pss_Total, MemoryType.Native_Heap, nativeHeap);
        }

        internal void SetHeapAllocData(UInt64 totalMemory, UInt64 nativeHeap)
        {
            SetValue(MemoryPageType.Heap_Alloc, MemoryType.Total, totalMemory);
            SetValue(MemoryPageType.Heap_Alloc, MemoryType.Native_Heap, nativeHeap);
        }

        internal void SetHeapSizeData(UInt64 totalMemory, UInt64 nativeHeap)
        {
            SetValue(MemoryPageType.Heap_Size, MemoryType.Total, totalMemory);
            SetValue(MemoryPageType.Heap_Size, MemoryType.Native_Heap, nativeHeap);
        }
    }
}
