using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEditor;

namespace Tuanjie.OpenHarmony.Hilog
{
    internal enum OpenHarmonyHilogTagType
    {
        AllTags = 0,
        NoFilter = 1,
        TagControl = 3,
        FirstValidTag = 5 // Skip the options + separators
    }

    internal class OpenHarmonyHilogTags
    {
        internal static readonly string TagNameTuanjie = "Tuanjie";
        internal static readonly string TagNameCrash = "CRASH";
        internal static readonly string[] DefaultTagNames = new[] { TagNameTuanjie, TagNameCrash };

        internal string displayNameTag = "Tag: No Filter";

        private List<TagInformation> m_Entries = new List<TagInformation>(
            new[]
            {
                new TagInformation() { Name = "Filter by all listed tags", Selected = false },
                new TagInformation() { Name = "No Filter", Selected = true },
                new TagInformation() { Name = string.Empty, Selected = false },
                new TagInformation() { Name = "Tag Control...", Selected = false },
                new TagInformation() { Name = string.Empty, Selected = false },
                new TagInformation() { Name = TagNameTuanjie, Selected = false },
                new TagInformation() { Name = TagNameCrash, Selected = false },
            });

        public event Action TagSelectionChanged;

        private Rect m_TagButtonRect = new Rect();

        public List<TagInformation> Entries
        {
            get
            {
                return m_Entries;
            }
        }

        public OpenHarmonyHilogTags()
        {
            DisplayTagsNameInit();
        }

        public bool Add(string tag, bool isSelected = false)
        {
            if (string.IsNullOrEmpty(tag) || m_Entries.Where(t => tag.Equals(t.Name)).FirstOrDefault() != null)
                return false;

            m_Entries.Add(new TagInformation() { Name = tag, Selected = false });


            if (isSelected)
                TagSelected(null, null, m_Entries.Count - 1); // This will set the selected state.

            return true;
        }

        public bool Remove(int tagIndex)
        {
            if (tagIndex < (int)OpenHarmonyHilogTagType.FirstValidTag)
                return false;

            if (m_Entries[tagIndex].Selected)
                TagSelected(null, null, tagIndex); // Deselect it

            m_Entries.RemoveAt(tagIndex);

            return true;
        }

        public bool Remove(string tag)
        {
            for (int i = 0; i < m_Entries.Count; i++)
            {
                if (tag == m_Entries[i].Name)
                {
                    return Remove(i);
                }
            }
            return false;
        }

        public string[] GetSelectedTags(bool skipNoFilterIndex = false)
        {
            if (!skipNoFilterIndex && m_Entries[(int)OpenHarmonyHilogTagType.NoFilter].Selected)
                return null;

            var selectedTagNames = new List<string>(m_Entries.Count);
            for (int i = (int)OpenHarmonyHilogTagType.FirstValidTag; i < m_Entries.Count; i++)
            {
                if (m_Entries[i].Selected)
                {
                    selectedTagNames.Add(m_Entries[i].Name);
                }
            }

            return selectedTagNames.ToArray();
        }

        public void DoGUI(Rect rect, Rect tagButtonRect)
        {
            m_TagButtonRect = tagButtonRect;

            var separators = m_Entries.Select(t => string.IsNullOrEmpty(t.Name)).ToArray();
            var enabled = Enumerable.Repeat(true, m_Entries.Count).ToArray();
            var selectedTags = new List<int>();
            for (int i = 0; i < m_Entries.Count; ++i)
            {
                if (m_Entries[i].Selected)
                    selectedTags.Add(i);
            }

            EditorUtility.DisplayCustomMenuWithSeparators(new Rect(rect.x, rect.y + rect.height, 0, 0), m_Entries.Select(m => m.Name).ToArray(), enabled, separators, selectedTags.ToArray(), TagSelected, null);
        }

        public void TagSelected(object userData, string[] options, int selectedIndex)
        {
            var tagName = string.Empty;
            if (selectedIndex == (int)OpenHarmonyHilogTagType.AllTags)
            {
                // Deselect *No Filter* and select all others.
                UpdateTagFilterBasedOnNoFilterOption(false);
                tagName = "All listed Tags";
            }
            else if (selectedIndex == (int)OpenHarmonyHilogTagType.NoFilter)
            {
                if (!m_Entries[(int)OpenHarmonyHilogTagType.NoFilter].Selected)
                {
                    // Select *No Filter*, deselect all others.
                    UpdateTagFilterBasedOnNoFilterOption(true);
                    tagName = "No Filter";
                }
                else
                {
                    // Deselect *No Filter*, select all others.
                    UpdateTagFilterBasedOnNoFilterOption(false);
                    tagName = "All listed Tags";
                }
            }
            else if (selectedIndex == (int)OpenHarmonyHilogTagType.TagControl)
            {
                PopupWindow.Show(new Rect(m_TagButtonRect.x + 2, m_TagButtonRect.y + m_TagButtonRect.height * 2, 0, 0), new OpenHarmonyHilogTagListPopup(this));
                return;
            }
            else
            {
                m_Entries[selectedIndex].Selected = !m_Entries[selectedIndex].Selected;
                m_Entries[(int)OpenHarmonyHilogTagType.NoFilter].Selected = !(GetSelectedTags(true).Length > 0);
            }

            if (tagName.Equals(string.Empty))
            {
                var tags = GetSelectedTags(true);
                var tagsLength = tags.Length;
                if (tagsLength > 1)
                    tagName = string.Format("{0} ...", tags[0]);
                else
                    tagName = tagsLength > 0 ? tags[0] : "No Filter";
            }

            DisplayTagsNameChange(tagName);

            TagSelectionChanged?.Invoke();
        }

        private void DisplayTagsNameChange(string tagName)
        {
            displayNameTag = string.Format("Tags: {0}", tagName);
        }

        private void UpdateTagFilterBasedOnNoFilterOption(bool isNoFilterSelected)
        {
            m_Entries[(int)OpenHarmonyHilogTagType.NoFilter].Selected = isNoFilterSelected;

            for (int i = (int)OpenHarmonyHilogTagType.FirstValidTag; i < m_Entries.Count; i++)
                m_Entries[i].Selected = !isNoFilterSelected;
        }

        public override string ToString()
        {
            if (m_Entries[(int)OpenHarmonyHilogTagType.NoFilter].Selected)
                return string.Empty;


            var tags = "";
            int tagsFound = 0;
            for (int i = (int)OpenHarmonyHilogTagType.FirstValidTag; i < m_Entries.Count; i++)
            {
                if (!m_Entries[i].Selected)
                    continue;

                if (tagsFound > 0)
                    tags += ", ";

                if (tagsFound >= 3)
                {
                    tags += "...";
                    return tags;
                }

                tags += m_Entries[i].Name;
                tagsFound++;
            }

            return tags;
        }

        private void DisplayTagsNameInit()
        {
            UpdateTagFilterBasedOnNoFilterOption(true);
            displayNameTag = string.Format("Tag: No Filter");
        }
    }

    internal class OpenHarmonyHilogTagListPopup : PopupWindowContent
    {
        private OpenHarmonyHilogTags m_Tags = null;
        private int m_SelectedTagIndex = -1;
        private string m_InputTagName = String.Empty;
        private const string kTagInputTextFieldControlId = "TagInputTextFieldControl";
        private static GUIContent kIconToolbarMinus = EditorGUIUtility.TrIconContent("Toolbar Minus", "Remove from list");

        public Vector2 m_ScrollPosition = Vector2.zero;

        public OpenHarmonyHilogTagListPopup(OpenHarmonyHilogTags tags)
        {
            m_Tags = tags;
        }

        public override Vector2 GetWindowSize()
        {
            return new Vector2(300, 200);
        }

        void DoTagListGUI(float entryMargin)
        {
            var currentEvent = Event.current;
            var buttonWidth = 25;
            GUILayout.BeginHorizontal();
            m_ScrollPosition = GUILayout.BeginScrollView(m_ScrollPosition, false, false, GUIStyle.none, GUI.skin.verticalScrollbar, GUILayout.ExpandWidth(true));

            for (int i = (int)OpenHarmonyHilogTagType.FirstValidTag; i < m_Tags.Entries.Count; ++i)
            {
                EditorGUILayout.BeginHorizontal();

                var t = m_Tags.Entries[i];

                var labelStyle = OpenHarmonyHilogStyles.tagEntryStyle;
                var toggleStyle = OpenHarmonyHilogStyles.tagToggleStyle;
                var buttonStyle = OpenHarmonyHilogStyles.tagButtonStyle;

                var labelRect = GUILayoutUtility.GetRect(new GUIContent(t.Name), labelStyle);
                var toggleRect = GUILayoutUtility.GetRect(GUIContent.none, toggleStyle, GUILayout.Width(buttonWidth));
                var buttonRect = GUILayoutUtility.GetRect(kIconToolbarMinus, buttonStyle, GUILayout.Width(buttonWidth));

                var itemRect = new Rect(labelRect.x, labelRect.y, buttonRect.max.x - labelRect.min.x, buttonRect.max.y - labelRect.min.y);
                if (currentEvent.type == EventType.Repaint)
                {
                    if (m_SelectedTagIndex == i)
                        OpenHarmonyHilogStyles.tagEntryBackground.Draw(itemRect, false, false, true, false);
                    else
                    {
                        if (i % 2 == 0)
                            OpenHarmonyHilogStyles.tagEntryBackgroundEven.Draw(itemRect, false, false, false, false);
                        else
                            OpenHarmonyHilogStyles.tagEntryBackgroundOdd.Draw(itemRect, false, false, false, false);
                    }
                }
                else
                {
                    var selectableRect = itemRect;
                    selectableRect.width = toggleRect.min.x - labelRect.min.x;
                    DoMouseEvent(selectableRect, i);
                }

                GUI.Label(labelRect, new GUIContent(t.Name), labelStyle);
                var toggled = GUI.Toggle(toggleRect, t.Selected, String.Empty, toggleStyle);
                if (toggled != t.Selected)
                {
                    m_Tags.TagSelected(null, null, i);
                    GUIUtility.keyboardControl = 0;
                }

                // Draw the remove button.
                if (GUI.Button(buttonRect, kIconToolbarMinus, buttonStyle))
                {
                    RemoveSelected(i);
                    GUIUtility.keyboardControl = 0;
                }
                EditorGUILayout.EndHorizontal();
            }

            GUILayout.EndScrollView();
            var rc = GUILayoutUtility.GetLastRect();
            GUILayout.Space(4);
            GUILayout.EndHorizontal();
            GUI.Box(new Rect(rc.x + 4, rc.y, rc.width - 4, rc.height), GUIContent.none, EditorStyles.helpBox);
            GUILayout.Space(entryMargin);
        }

        public override void OnGUI(Rect rect)
        {
            var currentEvent = Event.current;
            bool hitEnter = currentEvent.type == EventType.KeyDown && (currentEvent.keyCode == KeyCode.Return || currentEvent.keyCode == KeyCode.KeypadEnter);

            const float kEntryMargin = 8;
            EditorGUILayout.BeginVertical();
            GUILayout.Space(kEntryMargin);

            // Draw the input field & "Add" Button.
            EditorGUILayout.BeginHorizontal(GUILayout.ExpandWidth(true));
            GUI.SetNextControlName(kTagInputTextFieldControlId);
            m_InputTagName = EditorGUILayout.TextField(m_InputTagName, GUILayout.Height(OpenHarmonyHilogStyles.kTagEntryFixedHeight + 2));
            var trimmedTagName = m_InputTagName.Trim();
            if (trimmedTagName.Length > 23)
            {
                GUILayout.Space(kEntryMargin + 2);
                EditorGUILayout.EndHorizontal();
                EditorGUILayout.BeginHorizontal();
                GUILayout.Space(kEntryMargin + 7);
                EditorGUILayout.HelpBox("The logging tag can be at most 23 characters, was " + trimmedTagName.Length + " .", MessageType.Warning);
            }
            else
            {
                if (GUILayout.Button("Add", GUILayout.Width(40)) || (hitEnter && GUI.GetNameOfFocusedControl() == kTagInputTextFieldControlId))
                {
                    if (!string.IsNullOrEmpty(trimmedTagName))
                    {
                        m_Tags.Add(trimmedTagName);
                        m_InputTagName = string.Empty;
                        GUIUtility.keyboardControl = 0; // Have to remove the focus from the input text field to clear it.
                    }
                }
            }
            GUILayout.Space(4);
            EditorGUILayout.EndHorizontal();
            DoTagListGUI(kEntryMargin);
            EditorGUILayout.EndVertical();
        }

        private void DoMouseEvent(Rect rect, int tagIndex)
        {
            var e = Event.current;
            if (e.type == EventType.MouseDown && rect.Contains(e.mousePosition))
            {
                switch (e.button)
                {
                    case 0:
                        m_SelectedTagIndex = (m_SelectedTagIndex == tagIndex) ? -1 : tagIndex;
                        e.Use();
                        GUIUtility.keyboardControl = 0;
                        break;
                }
            }
        }

        public bool RemoveSelected(int tagIndex)
        {
            if (tagIndex < 0 || tagIndex >= m_Tags.Entries.Count)
                return false;

            // Simply reset to no selected.
            m_SelectedTagIndex = -1;
            m_Tags.Remove(tagIndex);

            return true;
        }
    }
}
