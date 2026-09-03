using System.Collections.Generic;

namespace Tuanjie.OpenHarmony.Hilog
{
    internal abstract class IOpenHarmonyHilogAbilityManager
    {
        internal virtual void StartOrResumePackage(string packageName, string abilityName = null) { }
        internal virtual void StopPackage(string packageName) { }
        internal virtual void StopProcess(int processId) { }
        //Only superuser can (root devices) can cause crash on applications.
        //internal virtual void CrashPackage(string packageName) { }
        //internal virtual void CrashProcess(int processId) { }
    }

    /// <summary>
    /// Expose Ability Manager commands
    /// For full list do HDC shell aa help
    /// </summary>
    internal class OpenHarmonyHilogAbilityManager : IOpenHarmonyHilogAbilityManager
    {
        OpenHarmonyBridge.HDC m_HDC;
        string m_DeviceId;
        internal OpenHarmonyHilogAbilityManager(OpenHarmonyBridge.HDC HDC, string deviceId)
        {
            m_HDC = HDC;
            m_DeviceId = deviceId;
        }

        //Start applications via hdc
        internal override void StartOrResumePackage(string packageName, string abilityName = null)
        {
            var args = new List<string>();
            args.AddRange(new[]
            {
                "-t",
                m_DeviceId,
                "shell",
             });

            args.AddRange(new[]
            {
                "aa",
                "start",
                "-a ",
                abilityName,
                "-b",
                packageName
            });

            m_HDC.Run(args.ToArray(), $"Failed to start package '{packageName}'");
        }

        internal override void StopPackage(string packageName)
        {
            var args = new[]
            {
                "-t",
                m_DeviceId,
                "shell",
                "aa",
                "force-stop",
                packageName
             };

            m_HDC.Run(args, $"Failed to stop package '{packageName}'");
        }

        internal override void StopProcess(int processId)
        {
            var packageName = OpenHarmonyHilogUtilities.GetProcessNameFromPid(m_HDC, m_DeviceId, processId);
            if (!string.IsNullOrEmpty(packageName))
                StopPackage(packageName);
        }
    }
}
