using System;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

namespace Tuanjie.OpenHarmony.Hilog
{
    /// <summary>
    /// Some variables shared between objects of "OpenHarmonyHilogConsoleWindow" and "OpenHarmonyHilogMemoryWindow"
    /// </summary>
    public class OpenHarmonyHilogWindowsStaticData
    {
        internal MemoryType[] m_OrderMemoryTypesPSS = new[]
        {
            MemoryType.Native_Heap,
            MemoryType.Ark_Ts_Heap,
            MemoryType.GL,
            MemoryType.Graph,
            MemoryType.Stack,
            MemoryType.Guard,
            MemoryType.AnonPage_Other,
            MemoryType.hap,
            MemoryType.so,
            MemoryType.Dev,
            MemoryType.FilePage_Other
        };

        internal MemoryType[] m_OrderMemoryTypesHeap = new[]
        {
            MemoryType.Native_Heap,
            //HDC does not track the overall memory usage of Ark_Ts_Heap.
            MemoryType.Ark_Ts_Heap,
        };

        internal Dictionary<MemoryType, Color> m_MemoryTypeColors = new Dictionary<MemoryType, Color>() {
            { MemoryType.Native_Heap, Color.red },
            { MemoryType.Ark_Ts_Heap, Color.yellow },
            { MemoryType.GL, Color.blue },
            { MemoryType.Stack, Color.cyan },
            { MemoryType.Graph, Color.green },
            { MemoryType.Guard, Color.grey },
            { MemoryType.AnonPage_Other, Color.magenta },
            { MemoryType.hap, Color.gray },
            { MemoryType.so, new Color(0.35F, 0.67F, 0.23F) },
            { MemoryType.Dev, new Color(0.87F, 0.54F, 0.22F) },
            { MemoryType.FilePage_Other, new Color(0.25F, 0.44F, 0.0F) },
            { MemoryType.Total, Color.white }
        };

        internal Material m_Material = (Material)EditorGUIUtility.LoadRequired("SceneView/HandleLines.mat");

        internal MemoryGroup[] m_AllMemoryGroups = (MemoryGroup[])Enum.GetValues(typeof(MemoryGroup));

        internal MemoryPageType[] m_AllMemoryPageTypes = (MemoryPageType[])Enum.GetValues(typeof(MemoryPageType));

        internal MemoryType[] m_AllMemoryTypes = (MemoryType[])Enum.GetValues(typeof(MemoryType));

        private string kAutoShowHilogDuringBuildRun = "AutoShowHilogDuringBuildRun";
        internal bool ShowDuringBuildRun
        {
            get
            {
                return EditorPrefs.GetBool(kAutoShowHilogDuringBuildRun, true);
            }
            set
            {
                EditorPrefs.SetBool(kAutoShowHilogDuringBuildRun, value);
            }
        }

        internal readonly string m_RedColor = "#ff0000ff";
        internal readonly string m_GreenColor = "#00ff00ff";
        internal GUIContent symbolPaths = new GUIContent("Symbol Paths", "Configure symbol paths, used for resolving stack traces.");
        internal readonly string[] kAddressResolveRegex =
        {
            @"\s*#\d{2}\s*pc\s(?<address>[a-fA-F0-9x-x]+).*\/(?<abi>\S+)\/(?<libName>lib.*)\.so",
            @".*at (?<libName>lib.*)\.0x(?<address>[a-fA-F0-9]+)\(Native Method\)"
        };
        internal readonly string[] kDefaultSymbolExtensions = { ".so", ".so.sym", ".sym.so", ".so.dbg", ".dbg.so" };
    }
}
