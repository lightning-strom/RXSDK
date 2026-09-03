using UnityEngine;
using UnityEditor;

namespace Tuanjie.OpenHarmony.Hilog
{
    /// <summary>
    /// UI styles.
    /// Note: Don't use EditorStyles, since they're not initialized if Editor is ran in batch mode, for ex., tests
    /// </summary>
    static class OpenHarmonyHilogStyles
    {
        public const int kFontSize = 10;
        public const int kFixedHeight = kFontSize + 9;

        public static GUIStyle toolbarButtonIcon = new GUIStyle("toolbarButton") { fontSize = kFontSize, fixedHeight = kFixedHeight};
        public static GUIStyle toolbarButton = new GUIStyle("toolbarButton") { fontSize = kFontSize, fixedHeight = kFixedHeight};
        public static GUIStyle toolbarPopup = new GUIStyle("toolbarPopup") { fontSize = kFontSize, fixedHeight = kFixedHeight };
        public static GUIContent kAutoRunText = new GUIContent(L10n.Tr("Auto Run"), L10n.Tr("Automatically launch hilog window during build & run."));
        public static GUIStyle columnHeader = new GUIStyle("OL TITLE");
        public static GUIContent kScroll = new GUIContent(L10n.Tr("Scroll:"), L10n.Tr("Disabled - No scrolling\nScroll To End - Always scroll to end\nAuto - switch to 'scroll to end' when scrolling to the last message"));

        public static int kLogEntryFontSize = 11;
        public static int kLogEntryFixedHeight = kLogEntryFontSize + 5;
        public static GUIStyle background = new GUIStyle("CN EntryBackodd") { fixedHeight = kLogEntryFixedHeight };
        public static GUIStyle backgroundOdd = new GUIStyle("CN EntryBackodd") { fixedHeight = kLogEntryFixedHeight };
        public static GUIStyle backgroundEven = new GUIStyle("CN EntryBackEven") { fixedHeight = kLogEntryFixedHeight };

        public static readonly Vector2 kSmallIconSize = new Vector2(16, 16);
        public static GUIStyle infoSmallStyle = new GUIStyle("CN EntryInfoIconSmall") { fixedHeight = kLogEntryFixedHeight };
        public static GUIStyle warningSmallStyle = new GUIStyle("CN EntryWarnIconSmall") { fixedHeight = kLogEntryFixedHeight };
        public static GUIStyle errorSmallStyle = new GUIStyle("CN EntryErrorIconSmall") { fixedHeight = kLogEntryFixedHeight };
        public static GUIStyle priorityDefaultStyle = new GUIStyle("miniLabel")
        {
            fontSize = kLogEntryFontSize,
            fixedHeight = kLogEntryFixedHeight,
            padding = new RectOffset(0, 0, 1, 1),
            font = GetFont()
        };

        public static GUIStyle[] priorityStyles = new[]
        {
            new GUIStyle(priorityDefaultStyle) {},
            new GUIStyle(priorityDefaultStyle) {},
            new GUIStyle(priorityDefaultStyle) {},
            new GUIStyle(priorityDefaultStyle) { normal = new GUIStyleState() { textColor = Color.yellow } },
            new GUIStyle(priorityDefaultStyle) { normal = new GUIStyleState() { textColor = Color.red } },
            new GUIStyle(priorityDefaultStyle) { normal = new GUIStyleState() { textColor = Color.red } },
        };

        public const int kStatusBarFontSize = 13;
        public const int kLStatusBarFixedHeight = kStatusBarFontSize + 5;
        public static GUIStyle statusBarBackground = new GUIStyle("AppToolbar") { fixedHeight = kStatusBarFontSize };
        public static GUIStyle statusLabel = new GUIStyle("AppToolbar") { fontSize = kStatusBarFontSize, fixedHeight = kLStatusBarFixedHeight, richText = true };

        public const int kTagEntryFontSize = 11;
        public const int kTagEntryFixedHeight = kTagEntryFontSize + 7;
        public const int ktagToggleFixedWidth = 10;
        public static GUIStyle tagEntryBackground = new GUIStyle("CN EntryBackodd") { fixedHeight = kTagEntryFixedHeight };
        public static GUIStyle tagEntryBackgroundOdd = new GUIStyle("CN EntryBackodd") { fixedHeight = kTagEntryFixedHeight };
        public static GUIStyle tagEntryBackgroundEven = new GUIStyle("CN EntryBackEven") { fixedHeight = kTagEntryFixedHeight };
        public static GUIStyle tagEntryStyle = new GUIStyle("miniLabel") { fontSize = kTagEntryFontSize, fixedHeight = kTagEntryFixedHeight };
        public static GUIStyle tagToggleStyle = new GUIStyle("toggle") { fixedWidth = ktagToggleFixedWidth, fixedHeight = kTagEntryFixedHeight };
        public static GUIStyle tagButtonStyle = new GUIStyle("miniButton") { fixedHeight = kTagEntryFixedHeight };
        public static readonly GUIStyle kSeriesLabel = "ProfilerPaneSubLabel";

        public static GUIStyle stacktraceStyle = new GUIStyle("textArea")
        {
            fontSize = kLogEntryFontSize,
            font = GetFont(),
            richText = true,
            wordWrap = false
        };

        public static GUIStyle resolvedStacktraceStyle = new GUIStyle("textArea")
        {
            fontSize = kLogEntryFontSize,
            font = GetFont(),
            fontStyle = FontStyle.BoldAndItalic,
            richText = true,
            wordWrap = false,
        };

        public static GUIStyle infoStyle = new GUIStyle("label")
        {
            fontSize = kLogEntryFontSize,
            font = GetFont()
        };

        public static GUIStyle errorStyle = new GUIStyle("label")
        {
            fontSize = kLogEntryFontSize,
            font = GetFont(),
            normal = new GUIStyleState() { textColor = Color.red }
        };

        public static GUIStyle internalLogStyle = new GUIStyle("CN EntryBackodd")
        {
            fixedHeight = 13,
            fontSize = 13,
            padding = new RectOffset(0, 0, 0, 0),
            margin = new RectOffset(0, 0, 0, 0),
            font = GetFont()
        };

        public static GUIStyle arkUITreeStyle = new GUIStyle("textArea")
        {
            fontSize = kLogEntryFixedHeight,
            font = GetFont(),
            richText = true,
            wordWrap = false,
        };


        public static Font GetFont()
        {
            return (Font)EditorGUIUtility.LoadRequired("Packages/cn.tuanjie.openharmony.hilog/Editor/Fonts/consola.ttf");
        }

        internal class StatusWheel
        {
            GUIContent[] m_StatusWheel = new GUIContent[12];
            public StatusWheel()
            {
                for (int i = 0; i < m_StatusWheel.Length; i++)
                    m_StatusWheel[i] = EditorGUIUtility.IconContent("WaitSpin" + i.ToString("00"));
            }

            public GUIContent GetContent(int index)
            {
                return m_StatusWheel[index];
            }

            public int GetMaxIndex()
            {
                return m_StatusWheel.Length - 1;
            }
        }

        private static StatusWheel m_StatusWheel;
        internal static StatusWheel Status
        {
            get
            {
                if (m_StatusWheel == null)
                    m_StatusWheel = new StatusWheel();

                return m_StatusWheel;
            }
        }

        public static readonly GUIStyle StatusIcon = "toolbarButton";

        public static Texture2D LoadIcon(string name)
        {
            var tex = (Texture2D)EditorGUIUtility.Load($"Packages/cn.tuanjie.openharmony.hilog/Editor/Textures/{name}.png");

            return tex;
        }

        internal static GUIContent kIconToolbarDown = new GUIContent(LoadIcon("DownArrow"));
        internal static GUIContent kIconToolbarUp = new GUIContent(LoadIcon("UpArrow"));
        internal static GUIContent kIconReset = new GUIContent(LoadIcon("Reset"), "Reset");
        internal static GUIContent kIconReconnect = new GUIContent(LoadIcon("Reset"), "Restart HiLog Process.");
        internal static GUIContent kIconDisconnect = new GUIContent(LoadIcon("Disconnect"), "Stop HiLog Process");
        internal static GUIContent kIconClearButtonText = new GUIContent(LoadIcon("Clear"), "Clear HiLog by executing hdc with hilog -r");

        internal static GUIContent kPerformancePlay = new GUIContent(LoadIcon("PlayIcon"), "Start Performance Process.");
        internal static GUIContent kPerformanceReconnect = new GUIContent(LoadIcon("Reset"), "Restart Performance Process.");
        internal static GUIContent kPerformanceDisconnect = new GUIContent(LoadIcon("Disconnect"), "Stop Performance Process");
        internal static GUIContent kPerformanceClearButtonText = new GUIContent(LoadIcon("Clear"), "Clear Performance Data");

        internal static GUIContent kIconClearMemeoryEntryButtonText = new GUIContent(LoadIcon("Clear"), "Clear captured memory data");
        internal static GUIContent kIconMatchCase = new GUIContent(LoadIcon("MatchCase"), "Match Case");
        internal static GUIContent kIconRegex = new GUIContent(LoadIcon("Regex"), "Regex");

        internal static Texture2D kSimulator_DeviceInfo = LoadIcon("Simulator_DeviceInfo");

        internal static Texture2D kTick_DeviceInfo = LoadIcon("Tick_DeviceInfo");

        internal static Texture2D kBackground_DeviceInfo = LoadIcon("Background_DeviceInfo");

        internal static Texture2D kBatteryBackground_DeviceInfo = LoadIcon("BatteryBackground_DeviceInfo");

        internal static Texture2D kBatteryGroup_DeviceInfo = LoadIcon("BatteryGroup_DeviceInfo");

        internal static Texture2D kBatteryBG_DeviceInfo = LoadIcon("BatteryAmountBG_DeviceInfo");

        internal static Texture2D kBatteryFG_DeviceInfo = LoadIcon("BatteryAmountFG_DeviceInfo");

        internal static Texture2D kBatteryEF_DeviceInfo = LoadIcon("BatteryAmountEF_DeviceInfo");

    }
}
