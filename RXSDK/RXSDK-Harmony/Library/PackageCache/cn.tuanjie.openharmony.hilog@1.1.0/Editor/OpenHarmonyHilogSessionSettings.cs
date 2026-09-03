using UnityEditor;

namespace Tuanjie.OpenHarmony.Hilog
{
    /// <summary>
    /// Settings which only persist during the Editor session.
    /// </summary>
    internal static class OpenHarmonyHilogSessionSettings
    {
        private static string GetName(string name)
        {
            return $"{nameof(OpenHarmonyHilogSessionSettings)}.{name}";
        }

        internal static bool ShowTagPriorityErrors
        {
            set => SessionState.SetBool(GetName(nameof(ShowTagPriorityErrors)), value);
            get => SessionState.GetBool(GetName(nameof(ShowTagPriorityErrors)), true);
        }
    }
}
