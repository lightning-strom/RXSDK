using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEditor;
using System.Text;
using System.IO;

namespace Tuanjie.OpenHarmony.Hilog
{
    /// <summary>
    /// The interface to convert Stacktrace information
    /// Use Addr2line to Resolve. Configure symbols paths, regexs and extensions.
    /// </summary>
    internal class OpenHarmonyHilogStacktraceWindow : EditorWindow
    {
        string m_RedColor;
        string m_GreenColor;
        GUIContent symbolPaths;
        string[] kAddressResolveRegex;
        string[] kDefaultSymbolExtensions;

        OpenHarmonyHilogSymbolList m_SymbolList;
        OpenHarmonyHilogReordableListWithReset m_RegexList;
        OpenHarmonyHilogReordableListWithReset m_SymbolExtList;

        internal List<ReordableListItem> m_StacktraceResolveRegex;
        internal List<ReordableListItem> m_SymbolExtensions;
        internal List<ReordableListItem> m_SymbolPaths;
        internal List<ReordableListItem> StacktraceResolveRegex => m_StacktraceResolveRegex;
        internal List<ReordableListItem> SymbolExtensions => m_SymbolExtensions;
        internal List<ReordableListItem> SymbolPaths
        {
            get => m_SymbolPaths;
        }

        class UnresolvedAddresses
        {
            internal struct AddressKey
            {
                internal string ABI { set; get; }
                internal string Library { set; get; }
            }

            Dictionary<AddressKey, Dictionary<string, string>> m_Addresses = new Dictionary<AddressKey, Dictionary<string, string>>();

            private Dictionary<string, string> GetOrCreateAddressMap(AddressKey key)
            {
                Dictionary<string, string> addresses;
                if (m_Addresses.TryGetValue(key, out addresses))
                    return addresses;
                addresses = new Dictionary<string, string>();
                m_Addresses[key] = addresses;
                return addresses;
            }

            internal void CreateAddressEntry(AddressKey key, string address)
            {
                var addresses = GetOrCreateAddressMap(key);
                addresses[address] = string.Empty;
            }

            internal void SetAddressValue(AddressKey key, string address, string value)
            {
                var addresses = GetOrCreateAddressMap(key);
                addresses[address] = value;
            }

            internal string GetAddressValue(AddressKey key, string address)
            {
                var addresses = GetOrCreateAddressMap(key);
                string value = string.Empty;
                if (addresses.TryGetValue(address, out value))
                    return value;
                return string.Empty;
            }

            internal IReadOnlyList<AddressKey> GetKeys()
            {
                return m_Addresses.Keys.ToArray();
            }

            internal IReadOnlyList<string> GetAllAddresses(AddressKey key)
            {
                return m_Addresses[key].Keys.ToArray();
            }
        }

        enum WindowMode
        {
            OriginalLog,
            ResolvedLog
        }

        Vector2 m_ScrollPosition;
        string m_Text = String.Empty;
        string m_ResolvedStacktraces = String.Empty;

        private WindowMode m_WindowMode;

        private OpenHarmonyHilogRuntimeBase m_Runtime;

        internal void PostInstantiation()
        {
            titleContent = new GUIContent("Stacktrace Utility");
        }

        internal string ResolveAddresses(string[] lines,
            IReadOnlyList<ReordableListItem> regexes,
            IReadOnlyList<ReordableListItem> symbolPaths,
            IReadOnlyList<ReordableListItem> symbolExtensions,
            OpenHarmonyTools tools)
        {
            var output = string.Empty;
            // Calling addr2line for every address is costly, that's why we need to do it in batch
            var unresolved = new UnresolvedAddresses();
            foreach (var l in lines)
            {
                string address;
                string library;
                string abi;
                if (!OpenHarmonyHilogUtilities.ParseCrashLine(regexes, l, out abi, out address, out library))
                    continue;
                unresolved.CreateAddressEntry(new UnresolvedAddresses.AddressKey() { ABI = abi, Library = library }, address);
            }

            var keys = unresolved.GetKeys();
            foreach (var key in keys)
            {
                var addresses = unresolved.GetAllAddresses(key);
                var exts = symbolExtensions.GetEnabledValues();
                var symbolFile = OpenHarmonyHilogUtilities.GetSymbolFile(symbolPaths,
                    key.ABI,
                    key.Library,
                    exts);

                // Symbol file not found, set 'not found' messages for all addresses of this library
                if (string.IsNullOrEmpty(symbolFile))
                {
                    var value = $"<color={m_RedColor}>({Path.GetFileNameWithoutExtension(key.Library)}[{string.Join("|", exts)}] not found)</color>";
                    foreach (var a in addresses)
                        unresolved.SetAddressValue(key, a, value);
                    continue;
                }

                try
                {
                    var result = tools.RunAddr2Line(symbolFile, addresses.ToArray());

                    if (result.Length != addresses.Count)
                    {
                        return $"Failed to run addr2line, expected to receive {addresses.Count} addresses, but received {result.Length}";
                    }

                    for (int i = 0; i < addresses.Count; i++)
                    {
                        OpenHarmonyHilogInternalLog.Log($"{addresses[i]} ---> {result[i]}");
                        unresolved.SetAddressValue(key, addresses[i], $"<color={m_GreenColor}>({result[i].Trim()})</color>");
                    }
                }
                catch (Exception ex)
                {
                    return $"Exception while running addr2line:\n{ex.Message}";
                }
            }


            foreach (var l in lines)
            {
                string address;
                string library;
                string abi;
                if (!OpenHarmonyHilogUtilities.ParseCrashLine(regexes, l, out abi, out address, out library))
                {
                    output += l;
                }
                else
                {
                    output += l.Replace(address, address + " " + unresolved.GetAddressValue(new UnresolvedAddresses.AddressKey() { ABI = abi, Library = library }, address));
                }

                output += Environment.NewLine;
            }

            return output;
        }

        void ResolveStacktraces()
        {
            m_ResolvedStacktraces = String.Empty;
            if (string.IsNullOrEmpty(m_Text))
            {
                m_ResolvedStacktraces = $"<color={m_RedColor}>Please add some log with addresses first.</color>";
                return;
            }

            if (StacktraceResolveRegex.Count == 0)
            {
                m_ResolvedStacktraces = $"<color={m_RedColor}>No stacktrace regular expressions found.\nClick <b>Configure Regex</b> and configure Stacktrace Regex.</color>";
                return;
            }

            if (SymbolPaths.Count == 0)
            {
                m_ResolvedStacktraces = $"<color={m_RedColor}>At least one symbol path needs to be specified.\nClick Configure Symbol Paths and add the necessary symbol path.</color>";
                return;
            }


            var lines = m_Text.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
            m_ResolvedStacktraces = ResolveAddresses(lines,
                StacktraceResolveRegex,
                SymbolPaths,
                SymbolExtensions,
                m_Runtime.Tools);
        }

        private void OnEnable()
        {
            if (!OpenHarmonyBridge.OpenHarmonyExtensionsInstalled)
                return;
            if(OpenHarmonyHilogContainerWindow.ContainerWindow.m_Runtime == null)
                return;

            m_Runtime = OpenHarmonyHilogContainerWindow.ContainerWindow.m_Runtime;
            if (string.IsNullOrEmpty(m_Text))
            {
                var placeholder = new StringBuilder();
                placeholder.AppendLine("Copy paste log with address and click Resolve Stacktraces");
                placeholder.AppendLine("For example:");
                placeholder.AppendLine("2019-05-17 12:00:58.830 30759-30803/? E/CRASH: \t#00  pc 002983fc  /data/app/com.mygame==/lib/arm/libtuanjie.so");
                m_Text = placeholder.ToString();
            }

            //Init
            m_RedColor = m_Runtime.StaticData.m_RedColor;
            m_GreenColor = m_Runtime.StaticData.m_GreenColor;
            symbolPaths = m_Runtime.StaticData.symbolPaths;
            m_SymbolPaths = m_Runtime.UserSettings.SymbolPaths;
            kAddressResolveRegex = m_Runtime.StaticData.kAddressResolveRegex;
            kDefaultSymbolExtensions = m_Runtime.StaticData.kDefaultSymbolExtensions;
            if (m_SymbolPaths == null || m_SymbolPaths.Count == 0)
                ResetSymbolPaths();
            ResetSymbolExtensions();
            ResetStacktraceResolveRegex();
        }

        private void SelectWindowMode(WindowMode mode)
        {
            m_WindowMode = mode;

            GUIUtility.keyboardControl = 0;
            GUIUtility.hotControl = 0;
            GUI.FocusControl(string.Empty);
            Repaint();
        }

        void DoInfoGUI()
        {
            EditorGUILayout.BeginVertical(GUILayout.Width(100));
            GUILayout.Space(3);
            if (GUILayout.Button("Resolve Stacktraces"))
            {
                // Note: Must be executed before ResolveStacktraces, otherwise m_Text might contain old data
                SelectWindowMode(WindowMode.ResolvedLog);

                ResolveStacktraces();
            }
            var oldAlign = GUI.skin.button.alignment;
            GUI.skin.button.alignment = TextAnchor.MiddleLeft;
            GUI.skin.button.alignment = oldAlign;
            EditorGUILayout.EndVertical();
        }

        void OnGUI()
        {
            if (!OpenHarmonyBridge.OpenHarmonyExtensionsInstalled)
            {
                OpenHarmonyHilogUtilities.ShowOpenHarmonyIsNotInstalledMessage();
                return;
            }

            GUILayout.BeginVertical();
                GUILayout.BeginHorizontal();
                    GUILayout.BeginVertical();
                        EditorGUI.BeginChangeCheck();
                        m_WindowMode = (WindowMode)GUILayout.Toolbar((int)m_WindowMode, new[] { new GUIContent("Original"), new GUIContent("Resolved"), }, "LargeButton", GUI.ToolbarButtonSize.Fixed, GUILayout.ExpandWidth(true));
                        if (EditorGUI.EndChangeCheck())
                            SelectWindowMode(m_WindowMode);

                        m_ScrollPosition = EditorGUILayout.BeginScrollView(m_ScrollPosition);
                        GUI.SetNextControlName(WindowMode.ResolvedLog.ToString());
                        switch (m_WindowMode)
                        {
                            case WindowMode.ResolvedLog:
                                // Note: Not using EditorGUILayout.SelectableLabel, because scrollbars are not working correctly
                                EditorGUILayout.TextArea(m_ResolvedStacktraces, OpenHarmonyHilogStyles.resolvedStacktraceStyle, GUILayout.ExpandHeight(true));
                                break;
                            case WindowMode.OriginalLog:
                                m_Text = EditorGUILayout.TextArea(m_Text, OpenHarmonyHilogStyles.stacktraceStyle, GUILayout.ExpandHeight(true));
                                break;
                        }

                        EditorGUILayout.EndScrollView();
                    GUILayout.EndVertical();
                    DoInfoGUI();
                GUILayout.EndHorizontal();


                GUILayout.BeginHorizontal();
                    GUILayout.BeginVertical();
                        EditorGUILayout.LabelField(symbolPaths, EditorStyles.boldLabel);
                        if (m_SymbolList == null)
                            m_SymbolList = new OpenHarmonyHilogSymbolList(SymbolPaths, ()=> ResetSymbolPaths());
                        m_SymbolList.OnGUI(150.0f);

                        if (m_RegexList == null || m_SymbolExtList == null)
                        {
                            m_RegexList = new OpenHarmonyHilogReordableListWithReset(StacktraceResolveRegex, () => ResetStacktraceResolveRegex());
                            m_SymbolExtList = new OpenHarmonyHilogReordableListWithReset(SymbolExtensions, () => ResetSymbolExtensions());
                        }

                        EditorGUILayout.LabelField(OpenHarmonyHilogSettingsProvider.Styles.stactraceRegex, EditorStyles.boldLabel);
                        m_RegexList.OnGUI(150.0f);
                    GUILayout.EndVertical();

                    GUILayout.BeginVertical();
                        EditorGUILayout.LabelField(OpenHarmonyHilogSettingsProvider.Styles.symbolExtensions, EditorStyles.boldLabel);
                        m_SymbolExtList.OnGUI(150.0f);
                    GUILayout.EndVertical();
                GUILayout.EndHorizontal();
            GUILayout.EndVertical();
        }

        internal void ResetStacktraceResolveRegex()
        {
            // Note: Don't create new instance, if not necessary
            // Since some classes might be using it
            if (m_StacktraceResolveRegex == null)
                m_StacktraceResolveRegex = new List<ReordableListItem>();
            m_StacktraceResolveRegex.Clear();
            foreach (var r in kAddressResolveRegex)
            {
                m_StacktraceResolveRegex.Add(new ReordableListItem() { Name = r, Enabled = true });
            }
        }

        internal void ResetSymbolExtensions()
        {
            if (m_SymbolExtensions == null)
                m_SymbolExtensions = new List<ReordableListItem>();
            m_SymbolExtensions.Clear();
            foreach (var e in kDefaultSymbolExtensions)
            {
                m_SymbolExtensions.Add(new ReordableListItem() { Name = e, Enabled = true });
            }
        }

        internal void ResetSymbolPaths()
        {
            if (m_SymbolPaths == null)
                m_SymbolPaths = new List<ReordableListItem>();
            m_SymbolPaths.Clear();
            var path = Path.GetFullPath(Paths.Combine(BuildPipeline.GetPlaybackEngineDirectory(BuildTarget.OpenHarmony, BuildOptions.None), "Variations", "il2cpp", "Release", "Symbols"));
            m_SymbolPaths.Add(new ReordableListItem() { Name = path, Enabled = true });
        }

        void OnDisable()
        {
            m_Runtime.UserSettings.SymbolPaths = m_SymbolPaths;
        }
    }
}
