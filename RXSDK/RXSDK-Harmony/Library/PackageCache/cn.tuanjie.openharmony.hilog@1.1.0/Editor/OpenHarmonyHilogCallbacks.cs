using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;

namespace Tuanjie.OpenHarmony.Hilog
{
    // When "Auto Run" is enabled, automatically show an "OpenHarmony Hilog" interface after the success of "Build and Run".
    internal class OpenHarmonyHilogCallbacks : IPostprocessBuildWithReport
    {
        public int callbackOrder { get { return 0; } }

        public void OnPostprocessBuild(BuildReport report)
        {
            if ((report.summary.options & BuildOptions.AutoRunPlayer) != 0 &&
                report.summary.platform == BuildTarget.OpenHarmony)
                OpenHarmonyHilogContainerWindow.ShowNewOrExisting(true);
        }
    }
}
