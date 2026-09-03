using System;
using System.IO;
using System.Linq;
using UnityEngine;

namespace Tuanjie.OpenHarmony.Hilog
{
    internal class OpenHarmonyTools
    {
        private string m_Addr2LinePath;
        private string m_NMPath;
        private string m_ReadElfPath;
        private OpenHarmonyBridge.HDC m_HDC;

        private void ResolvePathsIfNeeded()
        {
            var m_SDKDirectory = OpenHarmonyBridge.OpenHarmonySDKRoot.sdkRootPath;

            var binPath = Paths.Combine(m_SDKDirectory, "native", "llvm", "bin");

            m_NMPath = Path.Combine(binPath, "llvm-nm");
            m_Addr2LinePath = Path.Combine(binPath, "llvm-addr2line");
            m_ReadElfPath = Path.Combine(binPath, "llvm-readelf");

            if (Application.platform == RuntimePlatform.WindowsEditor)
            {
                m_Addr2LinePath += ".exe";
                m_NMPath += ".exe";
                m_ReadElfPath += ".exe";
            }
        }

        internal void ValidateResult(ShellReturnInfo result)
        {
            if (result.GetExitCode() == 0)
                return;
            throw new System.Exception(string.Format("{0} {1}\nreturned with exit code {2}\nWorking Directory:\n{3}\nStandardOutput:\n{4}\nStandardError:\n{5}",
                result.GetStartInfo().FileName, result.GetStartInfo().Arguments,
                result.GetExitCode(),
                result.GetStartInfo().WorkingDirectory,
                result.GetStandardErr(),
                result.GetStandardOut()));
        }

        internal string[] RunAddr2Line(string symbolFilePath, string[] addresses)
        {
            ResolvePathsIfNeeded();

            // Addr2Line is important for us, so show an error, if it's not found
            if (!File.Exists(m_Addr2LinePath))
                throw new Exception("Failed to locate " + m_Addr2LinePath);

            // https://sourceware.org/binutils/docs/binutils/addr2line.html
            var args = "-C -f -p -e \"" + symbolFilePath + "\" " + string.Join(" ", addresses.ToArray());
            OpenHarmonyHilogInternalLog.Log($"\"{m_Addr2LinePath}\" {args}");
            var result = Shell.RunProcess(
                m_Addr2LinePath, args);
            ValidateResult(result);
            return result.GetStandardOut().Split(new[] { '\n', '\r' }, System.StringSplitOptions.RemoveEmptyEntries);
        }

        internal OpenHarmonyBridge.HDC HDC
        {
            get
            {
                if (m_HDC == null)
                    m_HDC = OpenHarmonyBridge.HDC.GetInstance();

                return m_HDC;
            }
        }
    }
}
