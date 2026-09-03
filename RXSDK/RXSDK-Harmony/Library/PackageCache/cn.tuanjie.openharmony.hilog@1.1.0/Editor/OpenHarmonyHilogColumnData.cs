using System;
using UnityEngine;

namespace Tuanjie.OpenHarmony.Hilog
{
    [Serializable]
    internal class ColumnData
    {
        [NonSerialized]
        public GUIContent content;

        public float width;

        [NonSerialized]
        // Updated automatically when we're moving the splitter
        public Rect itemSize = Rect.zero;

        [NonSerialized]
        public bool splitterDragging;

        [NonSerialized]
        public float splitterDragStartMouseValue;

        [NonSerialized]
        public float splitterDragStartWidthValue;

        public bool enabled = true;
    }
}
