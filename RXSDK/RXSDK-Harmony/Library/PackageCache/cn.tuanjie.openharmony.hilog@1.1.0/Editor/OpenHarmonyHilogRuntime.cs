using System;
using UnityEditor;
using System.IO;


namespace Tuanjie.OpenHarmony.Hilog
{
    internal abstract class OpenHarmonyHilogRuntimeBase
    {
        protected OpenHarmonyHilogDispatcher m_Dispatcher;
        protected OpenHarmonyHilogSettings m_Settings;
        protected OpenHarmonyHilogUserSettings m_UserSettings;
        protected OpenHarmonyTools m_Tools;
        protected OpenHarmonyHilogDeviceQueryBase m_DeviceQuery;
        protected OpenHarmonyHilogWindowsStaticData m_StaticData;
        internal bool m_Initialized;

        protected abstract string UserSettingsPath { get; }

        private void ValidateIsInitialized()
        {
            if (!m_Initialized)
                throw new Exception("Runtime is not initialized");
        }

        public OpenHarmonyHilogDispatcher Dispatcher
        {
            get { ValidateIsInitialized(); return m_Dispatcher; }
        }

        public OpenHarmonyHilogSettings Settings
        {
            get { ValidateIsInitialized(); return m_Settings; }
        }

        public OpenHarmonyHilogUserSettings UserSettings
        {
            get { ValidateIsInitialized(); return m_UserSettings; }
        }

        public OpenHarmonyTools Tools
        {
            get { ValidateIsInitialized(); return m_Tools; }
        }

        public OpenHarmonyHilogDeviceQueryBase DeviceQuery
        {
            get { ValidateIsInitialized(); return m_DeviceQuery; }
        }

        public OpenHarmonyHilogWindowsStaticData StaticData
        {
            get { ValidateIsInitialized(); return m_StaticData; }
        }

        public event Action<int> OnDeviceSelected;

        public void SelectDevice(int selectIndex)
        {
            OnDeviceSelected?.Invoke(selectIndex);
            OnDeviceSelected = null;
        }

        public void AddAction2OnDeviceSelected(Action<int> action)
        {
            OnDeviceSelected = null;
            OnDeviceSelected += action;
        }

        public event Action<ProcessInformation> OnProcessSelected;

        public void SelectProcess(ProcessInformation newProcess)
        {
            OnProcessSelected?.Invoke(newProcess);
            OnProcessSelected = null;
        }

        public void AddAction2OnProcessSelected(Action<ProcessInformation> action)
        {
            OnProcessSelected = null;
            OnProcessSelected += action;
        }

        public abstract OpenHarmonyHilogMessageProviderBase CreateMessageProvider(OpenHarmonyBridge.HDC HDC, Priority priority, int processId, string logPrintFormat, IOpenHarmonyHilogDevice device, Action<string> logCallbackAction);
        protected abstract OpenHarmonyHilogDeviceQueryBase CreateDeviceQuery();
        protected abstract OpenHarmonyHilogSettings LoadEditorSettings();
        protected abstract OpenHarmonyTools CreateOpenHarmonyTools();
        protected abstract void SaveEditorSettings(OpenHarmonyHilogSettings settings);

        public virtual void Initialize()
        {
            m_Dispatcher = new OpenHarmonyHilogDispatcher(this);
            m_Dispatcher.Initialize();

            m_Settings = LoadEditorSettings();

            Directory.CreateDirectory(Path.GetDirectoryName(UserSettingsPath));
            m_UserSettings = OpenHarmonyHilogUserSettings.Load(UserSettingsPath);
            if (m_UserSettings == null)
            {
                m_UserSettings = new OpenHarmonyHilogUserSettings();
                m_UserSettings.Reset();
            }

            m_Tools = CreateOpenHarmonyTools();
            m_DeviceQuery = CreateDeviceQuery();

            m_StaticData = new OpenHarmonyHilogWindowsStaticData();

            m_Initialized = true;
        }

        public virtual void Shutdown()
        {
            Closing?.Invoke();
            // ProjectSettings is accessing some information from runtime during save
            OpenHarmonyHilogUserSettings.Save(m_UserSettings, UserSettingsPath, this);
            SaveEditorSettings(m_Settings);

            m_Initialized = false;
            m_Settings = null;
            m_UserSettings = null;
            m_Tools = null;
            m_Dispatcher.Shutdown();
            m_Dispatcher = null;
        }

        public void OnUpdate()
        {
            Update?.Invoke();
        }

        public event Action Update;
        public event Action Closing;
    }

    internal class OpenHarmonyHilogRuntime : OpenHarmonyHilogRuntimeBase
    {
        private static readonly string kUserSettingsPath = Path.Combine("UserSettings", "OpenHarmonyHilogSettings.asset");

        protected override string UserSettingsPath { get => kUserSettingsPath; }

        private bool m_SubscribeToEditorUpdate;

        internal OpenHarmonyHilogRuntime(bool subscribeToEditorUpdate = true)
        {
            m_SubscribeToEditorUpdate = subscribeToEditorUpdate;
        }

        public override OpenHarmonyHilogMessageProviderBase CreateMessageProvider(OpenHarmonyBridge.HDC HDC, Priority priority, int processId, string logPrintFormat, IOpenHarmonyHilogDevice device, Action<string> logCallbackAction)
        {
            return new OpenHarmonyHilogMessageProvider(HDC, priority, processId, logPrintFormat, device, logCallbackAction);
        }

        public override void Initialize()
        {
            if (m_SubscribeToEditorUpdate)
                EditorApplication.update += OnUpdate;
            base.Initialize();
        }

        public override void Shutdown()
        {
            base.Shutdown();
            if (m_SubscribeToEditorUpdate)
                EditorApplication.update -= OnUpdate;
        }

        protected override OpenHarmonyHilogDeviceQueryBase CreateDeviceQuery()
        {
            return new OpenHarmonyHilogDeviceQuery(this);
        }

        protected override OpenHarmonyTools CreateOpenHarmonyTools()
        {
            return new OpenHarmonyTools();
        }

        protected override OpenHarmonyHilogSettings LoadEditorSettings()
        {
            return OpenHarmonyHilogSettings.Load();
        }

        protected override void SaveEditorSettings(OpenHarmonyHilogSettings settings)
        {
            OpenHarmonyHilogSettings.Save(settings);
        }
    }
}
