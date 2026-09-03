using System.Collections.Generic;
using System;
using UnityEditor;
using UnityEngine;

namespace Tuanjie.OpenHarmony.Hilog
{
    [Serializable]
    internal class OpenHarmonyHilogSettings
    {
        // Bump this version, whenever adding a new property or changing default
        // This will force settings to be reset
        private const int kVersion = 1;

        internal static string kSettingsName = "OpenHarmonyHilogSettings" + kVersion;

        // Since querying memory from device is a lengthy operation, here's a cap 500 ms, setting it too low  will make memory request to be delayed
        internal static int kMinMemoryRequestIntervalMS = 500;

        [SerializeField]
        private int m_MemoryRequestInterval;

        [SerializeField]
        private int m_MaxCachedMessageCount;

        [SerializeField]
        private int m_MaxDisplayedMessageCount;

        [SerializeField]
        private Font m_MessageFont;

        [SerializeField]
        private int m_MessageFontSize;

        [SerializeField]
        private List<Color> m_MessageColorsProSkin;

        [SerializeField]
        private List<Color> m_MessageColorsFreeSkin;

        [SerializeField] private ColumnData[] m_ColumnData;

        [SerializeField]
        private int m_MaxExitedPackagesToShow;

        internal int MemoryRequestIntervalMS
        {
            set
            {
                int correctedValue = value;
                if (correctedValue < kMinMemoryRequestIntervalMS)
                    correctedValue = kMinMemoryRequestIntervalMS;
                if (m_MemoryRequestInterval == correctedValue)
                    return;
                m_MemoryRequestInterval = correctedValue;
                InvokeOnSettingsChanged();
            }
            get
            {
                return m_MemoryRequestInterval;
            }
        }

        internal int MaxCachedMessageCount
        {
            set
            {
                if (m_MaxCachedMessageCount == value)
                    return;
                m_MaxCachedMessageCount = value;
                m_MaxDisplayedMessageCount = ValidateDisplayedMessageCount(m_MaxDisplayedMessageCount);
                InvokeOnSettingsChanged();
            }
            get
            {
                return m_MaxCachedMessageCount;
            }
        }

        internal int MaxDisplayedMessageCount
        {
            set
            {
                value = ValidateDisplayedMessageCount(value);
                if (m_MaxDisplayedMessageCount == value)
                    return;
                m_MaxDisplayedMessageCount = value;
                InvokeOnSettingsChanged();
            }
            get
            {
                return m_MaxDisplayedMessageCount;
            }
        }

        private int ValidateDisplayedMessageCount(int newDisplayedMessageCount)
        {
            if (MaxCachedMessageCount > 0)
                newDisplayedMessageCount = Math.Min(newDisplayedMessageCount, MaxCachedMessageCount);
            return newDisplayedMessageCount;
        }

        internal int MaxExitedPackagesToShow
        {
            set
            {
                if (m_MaxExitedPackagesToShow == value)
                    return;
                m_MaxExitedPackagesToShow = value;
                InvokeOnSettingsChanged();
            }
            get
            {
                return m_MaxExitedPackagesToShow;
            }
        }
        internal Font MessageFont
        {
            set
            {
                if (m_MessageFont == value)
                    return;
                m_MessageFont = value;
                InvokeOnSettingsChanged();
            }
            get
            {
                return m_MessageFont;
            }
        }

        internal int MessageFontSize
        {
            set
            {
                if (m_MessageFontSize == value)
                    return;
                m_MessageFontSize = value;
                InvokeOnSettingsChanged();
            }
            get
            {
                return m_MessageFontSize;
            }
        }

        internal void SetMessageColor(Priority priority, Color color)
        {
            var messages = EditorGUIUtility.isProSkin ? m_MessageColorsProSkin : m_MessageColorsFreeSkin;

            // Populate the color list if needed
            while ((int)priority >= messages.Count)
                messages.Add(GetDefaultColor(priority, EditorGUIUtility.isProSkin));

            if (messages[(int)priority] == color)
                return;
            messages[(int)priority] = color;
            InvokeOnSettingsChanged();
        }

        internal Color GetMessageColor(Priority priority)
        {
            var messages = EditorGUIUtility.isProSkin ? m_MessageColorsProSkin : m_MessageColorsFreeSkin;
            if ((int)priority < messages.Count)
                return messages[(int)priority];
            return GetDefaultColor(priority, EditorGUIUtility.isProSkin);
        }

        internal ColumnData[] ColumnData
        {
            get
            {
                return m_ColumnData;
            }
        }

        internal Action<OpenHarmonyHilogSettings> OnSettingsChanged;

        internal OpenHarmonyHilogSettings()
        {
            Reset();
        }

        internal void Reset()
        {
            m_MemoryRequestInterval = 500;
            m_MaxCachedMessageCount = 60000;
            m_MaxDisplayedMessageCount = 60000;
            m_MessageFont = AssetDatabase.LoadAssetAtPath<Font>("Packages/cn.tuanjie.openharmony.hilog/Editor/Fonts/consola.ttf");
            m_MessageFontSize = 11;
            m_MaxExitedPackagesToShow = 4;
            if (Enum.GetValues(typeof(Priority)).Length != 6)
                throw new Exception("Unexpected length of Priority enum.");

            m_MessageColorsProSkin = new List<Color>();
            m_MessageColorsFreeSkin = new List<Color>();
            foreach (var p in (Priority[])Enum.GetValues(typeof(Priority)))
            {
                m_MessageColorsProSkin.Add(GetDefaultColor(p, true));
                m_MessageColorsFreeSkin.Add(GetDefaultColor(p, false));
            }

            m_ColumnData = GetColumns();

            InvokeOnSettingsChanged();
        }

        private static ColumnData[] GetColumns()
        {
            var columns = new ColumnData[]
            {
                new ColumnData() {content = new GUIContent(""), width = 30.0f },
                new ColumnData() {content = EditorGUIUtility.TrTextContent("Time", "Time when event occured"), width = 160.0f },
                new ColumnData() {content = EditorGUIUtility.TrTextContent("Pid", "Process Id"), width = 50.0f  },
                new ColumnData() {content = EditorGUIUtility.TrTextContent("Tid", "Thread Id"), width = 50.0f  },
                new ColumnData() {content = EditorGUIUtility.TrTextContent("Priority", "Priority (Left click to select different priorities)"), width = 50.0f  },
                new ColumnData() {content = EditorGUIUtility.TrTextContent("Tag", "Tag (Left click to select different tags)"), width = 50.0f  },
                new ColumnData() {content = EditorGUIUtility.TrTextContent("Message", ""), width = -1  },
            };

            var expectedColumnLength = Enum.GetValues(typeof(OpenHarmonyHilogConsoleWindow.Column)).Length;
            if (columns.Length != expectedColumnLength)
                throw new Exception($"Expected {expectedColumnLength} columns, but had {columns.Length}");
            return columns;
        }

        private Color GetDefaultColor(Priority priority, bool isProSkin)
        {
            if (Enum.GetValues(typeof(Priority)).Length != 6)
                throw new Exception("Unexpected length of Priority enum.");

            if (isProSkin)
            {
                return new[]
                {
                    Color.white,
                    Color.white,
                    Color.white,
                    Color.yellow,
                    Color.red,
                    Color.red
                }[(int)priority];
            }
            else
            {
                return new[]
                {
                    Color.black,
                    Color.black,
                    Color.black,
                    new Color(0.3f, 0.3f, 0.0f),
                    Color.red,
                    Color.red
                }[(int)priority];
            }
        }

        private void InvokeOnSettingsChanged()
        {
            if (OnSettingsChanged == null)
                return;
            OnSettingsChanged(this);
        }

        private void Validate()
        {
            var defaultColumnData = GetColumns();
            if (m_ColumnData == null || m_ColumnData.Length != defaultColumnData.Length)
                m_ColumnData = defaultColumnData;
        }

        internal static OpenHarmonyHilogSettings Load()
        {
            var settings = new OpenHarmonyHilogSettings();

            var data = EditorPrefs.GetString(kSettingsName, "");
            if (string.IsNullOrEmpty(data))
                return settings;

            try
            {
                EditorJsonUtility.FromJsonOverwrite(data, settings);
                settings.Validate();
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log("Load OpenHarmony Hilog Settings from Json failed: " + ex.Message);
            }
            return settings;
        }

        internal static void Save(OpenHarmonyHilogSettings settings)
        {
            if (settings == null)
                throw new NullReferenceException("OpenHarmony hilog settings value was null");

            var data = EditorJsonUtility.ToJson(settings);
            EditorPrefs.SetString(kSettingsName, data);
        }
    }
}
