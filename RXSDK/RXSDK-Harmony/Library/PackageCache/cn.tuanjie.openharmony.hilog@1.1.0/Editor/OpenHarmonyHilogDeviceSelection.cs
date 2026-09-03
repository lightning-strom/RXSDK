using System;
using System.Linq;

namespace Tuanjie.OpenHarmony.Hilog
{
    /// <summary>
    /// Independent device selection from device query
    /// </summary>
    class OpenHarmonyHilogDeviceSelection : IDisposable
    {
        OpenHarmonyHilogRuntimeBase m_Runtime;
        IOpenHarmonyHilogDevice[] m_Devices;
        int m_SelectedDeviceIdx;
        IOpenHarmonyHilogDevice m_PreviousDeviceSelected;
        Action<IOpenHarmonyHilogDevice> m_OnNewDeviceSelected;

        public IOpenHarmonyHilogDevice SelectedDevice
        {
            get
            {
                if (m_SelectedDeviceIdx < 0 || m_SelectedDeviceIdx > m_Devices.Length - 1)
                    return null;
                return m_Devices[m_SelectedDeviceIdx];
            }
        }

        public OpenHarmonyHilogDeviceSelection(OpenHarmonyHilogRuntimeBase runtime, Action<IOpenHarmonyHilogDevice> onNewDeviceSelected)
        {
            m_Runtime = runtime;
            m_OnNewDeviceSelected = onNewDeviceSelected;
            m_Runtime.DeviceQuery.DevicesUpdated += OnDevicesUpdated;
            QueryDevices();
        }

        public void Dispose()
        {
            m_Runtime.DeviceQuery.DevicesUpdated -= OnDevicesUpdated;
        }

        private void QueryDevices()
        {
            m_Devices = m_Runtime.DeviceQuery.Devices.Where(m => m.Value.State == IOpenHarmonyHilogDevice.DeviceState.Connected).Select(m => m.Value).ToArray();
            if (m_Devices.Length == 0)
                m_SelectedDeviceIdx = -1;
            else
            {
                m_SelectedDeviceIdx = Math.Min(m_SelectedDeviceIdx, m_Devices.Length - 1);
                if (m_SelectedDeviceIdx < 0)
                    m_SelectedDeviceIdx = 0;
            }
        }

        private void OnDevicesUpdated()
        {
            QueryDevices();
            if (SelectedDevice != m_PreviousDeviceSelected)
            {
                m_OnNewDeviceSelected.Invoke(SelectedDevice);
                m_PreviousDeviceSelected = SelectedDevice;
            }
        }
    }
}
