using UnityEditor;


namespace Tuanjie.OpenHarmony.Hilog
{
    internal class OpenHarmonyHilogManager : ScriptableSingleton<OpenHarmonyHilogManager>
    {
        private OpenHarmonyHilogRuntimeBase m_Runtime;

        internal void OnEnable()
        {
            Initialize();
        }

        internal void OnDisable()
        {
            if (m_Runtime != null)
            {
                m_Runtime.Shutdown();
                m_Runtime = null;
            }
        }

        private void Initialize()
        {
            if (!OpenHarmonyBridge.OpenHarmonyExtensionsInstalled)
                return;

            if(m_Runtime != null && m_Runtime.m_Initialized == true)
                return;

            m_Runtime = new OpenHarmonyHilogRuntime();
            m_Runtime.Initialize();

        }

        internal OpenHarmonyHilogRuntimeBase Runtime
        {
            get
            {
                Initialize();
                return m_Runtime;
            }
        }
    }
}
