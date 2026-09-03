using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace Tuanjie.OpenHarmony.Hilog
{
    internal class OpenHarmonyHilogRetrieveDeviceIdsInput : IOpenHarmonyHilogTaskInput
    {
        internal OpenHarmonyBridge.HDC HDC;
        internal bool notifyListeners;
    }

    internal class OpenHarmonyHilogRetrieveDeviceIdsResult : IOpenHarmonyHilogTaskResult
    {
        internal struct DeviceInfo
        {
            internal string id;
            internal IOpenHarmonyHilogDevice.DeviceState state;
        }

        internal List<DeviceInfo> deviceInfo = new List<DeviceInfo>();
        internal bool notifyListeners;
        internal IOpenHarmonyHilogDevice m_SelectedDevice;
    }

    abstract class OpenHarmonyHilogDeviceQueryBase
    {
        //Sometimes the device information does not contain the string segment of "host", so we cannot distinguish "COM3            UART    Ready           hdc" from devices information
        internal static Regex kDeviceInfoRegex = new Regex(@"(?<id>^[a-zA-Z0-9.:]+)\s+(?<UART>\S+)\s+(?<state>\S+)\s+");

        protected Dictionary<string, IOpenHarmonyHilogDevice> m_Devices = new Dictionary<string, IOpenHarmonyHilogDevice>();
        protected OpenHarmonyHilogRuntimeBase m_Runtime;

        internal event Action<IOpenHarmonyHilogDevice> DeviceSelected;
        internal event Action DevicesUpdated;

        internal IReadOnlyDictionary<string, IOpenHarmonyHilogDevice> Devices
        {
            get
            {
                return m_Devices;
            }
        }

        internal IOpenHarmonyHilogDevice FirstConnectedDevice
        {
            get
            {
                foreach (var d in m_Devices)
                {
                    if (d.Value.State != IOpenHarmonyHilogDevice.DeviceState.Connected)
                        continue;
                    return d.Value;
                }
                return null;
            }
        }

        internal OpenHarmonyHilogDeviceQueryBase(OpenHarmonyHilogRuntimeBase runtime)
        {
            m_Runtime = runtime;
        }

        internal void SelectDevice(ref IOpenHarmonyHilogDevice tabSelectedDevice, IOpenHarmonyHilogDevice currentSelectedDevice, bool notifyListeners = true)
        {
            if (tabSelectedDevice == currentSelectedDevice)
                return;

            if (currentSelectedDevice != null && currentSelectedDevice.State != IOpenHarmonyHilogDevice.DeviceState.Connected)
            {
                OpenHarmonyHilogInternalLog.Log("Trying to select device which is not connected: " + currentSelectedDevice.Id);
                if (tabSelectedDevice == null)
                    return;

                tabSelectedDevice = null;
            }
            else
            {
                tabSelectedDevice = currentSelectedDevice;
            }

            if (tabSelectedDevice != null && !m_Devices.Keys.Contains(tabSelectedDevice.Id))
                throw new Exception("Selected device is not among our listed devices");

            m_Runtime.UserSettings.LastSelectedDeviceId = tabSelectedDevice != null ? tabSelectedDevice.Id : "";

            if (notifyListeners)
                DeviceSelected?.Invoke(tabSelectedDevice);
        }

        internal static bool ParseDeviceInfo(string input, out string id, out IOpenHarmonyHilogDevice.DeviceState state)
        {
            var result = kDeviceInfoRegex.Match(input);
            //!result.Groups["UART"].Value.Equals("UART") is used to exclude the line "COM3            UART    Ready           hdc"
            if ((result.Success) && !result.Groups["UART"].Value.Equals("UART"))
            {
                id = result.Groups["id"].Value;
                var stateValue = result.Groups["state"].Value.ToLowerInvariant();
                if (stateValue.Equals("connected"))
                    state = IOpenHarmonyHilogDevice.DeviceState.Connected;
                else if (stateValue.Equals("offline"))
                    state = IOpenHarmonyHilogDevice.DeviceState.Disconnected;
                else if (stateValue.Equals("unauthorized"))
                    state = IOpenHarmonyHilogDevice.DeviceState.Unauthorized;
                else
                    state = IOpenHarmonyHilogDevice.DeviceState.Unknown;
                return true;
            }
            else
            {
                id = input;
                state = IOpenHarmonyHilogDevice.DeviceState.Unknown;
                return false;
            }
        }

        internal IOpenHarmonyHilogDevice GetDevice(string deviceId)
        {
            IOpenHarmonyHilogDevice device;
            if (m_Devices.TryGetValue(deviceId, out device))
            {
                return device;
            }
            return null;
        }

        protected void IntegrateQueryDevices(IOpenHarmonyHilogTaskResult result)
        {
 
            var deviceIdsResult = ((OpenHarmonyHilogRetrieveDeviceIdsResult)result);
            var deviceInfos = deviceIdsResult.deviceInfo;
            var selectedDevice = deviceIdsResult.m_SelectedDevice;

            foreach (var d in m_Devices)
            {
                //Keep devices connected via Wi-Fi remain in the Device Selection Box when hdc.exe restart.
                d.Value.UpdateState(d.Value.ConnectionType == IOpenHarmonyHilogDevice.DeviceConnectionType.Network? d.Value.State : IOpenHarmonyHilogDevice.DeviceState.Disconnected);
            }

            foreach (var info in deviceInfos)
            {
                GetOrCreateDevice(info.id, info.state);
            }

            // If our selected device was removed, deselect it
            if (selectedDevice != null && selectedDevice.State != IOpenHarmonyHilogDevice.DeviceState.Connected)
            {
                selectedDevice = null;
                if (deviceIdsResult.notifyListeners)
                    DeviceSelected?.Invoke(selectedDevice);
            }

            if (selectedDevice != null)
            {
                if (selectedDevice != m_Devices[selectedDevice.Id])
                    throw new Exception("The selected device is not among our list of devices");
            }

            DevicesUpdated?.Invoke();
        }

        private IOpenHarmonyHilogDevice GetOrCreateDevice(string deviceId, IOpenHarmonyHilogDevice.DeviceState state)
        {
            IOpenHarmonyHilogDevice device;
            if (OpenHarmonyHilogUtilities.CheckSendCommandSuccess(m_Runtime.Tools.HDC, deviceId))
                state = IOpenHarmonyHilogDevice.DeviceState.Disconnected;

            if (m_Devices.TryGetValue(deviceId, out device))
            {
                device.UpdateState(state);
                return device;
            }

            device = CreateDevice(deviceId);
            device.UpdateState(state);
            m_Devices[deviceId] = device;

            return device;
        }

        internal abstract void UpdateConnectedDevicesList(bool synchronous, IOpenHarmonyHilogDevice m_TabSelectedDevice);

        protected abstract IOpenHarmonyHilogDevice CreateDevice(string deviceId);
    }


    class OpenHarmonyHilogDeviceQuery : OpenHarmonyHilogDeviceQueryBase
    {
        protected const int kMillisecondsBetweenConsecutiveDeviceChecks = 1000;
        protected DateTime m_TimeOfLastDeviceListUpdate;

        internal OpenHarmonyHilogDeviceQuery(OpenHarmonyHilogRuntimeBase runtime)
            : base(runtime)
        {
            m_TimeOfLastDeviceListUpdate = DateTime.Now;
        }

        internal override void UpdateConnectedDevicesList(bool synchronous, IOpenHarmonyHilogDevice m_TabSelectedDevice)
        {
            if ((DateTime.Now - m_TimeOfLastDeviceListUpdate).TotalMilliseconds < kMillisecondsBetweenConsecutiveDeviceChecks && !synchronous)
                return;
            m_TimeOfLastDeviceListUpdate = DateTime.Now;

            m_Runtime.Dispatcher.Schedule(new OpenHarmonyHilogRetrieveDeviceIdsInput() { HDC = m_Runtime.Tools.HDC, notifyListeners = true }, QueryDevicesAsync, IntegrateQueryDevices, synchronous, m_TabSelectedDevice);
        }

        private static IOpenHarmonyHilogTaskResult QueryDevicesAsync(IOpenHarmonyHilogTaskInput input)
        {
            var HDC = ((OpenHarmonyHilogRetrieveDeviceIdsInput)input).HDC;

            if (HDC == null)
                throw new NullReferenceException("HDC interface has to be valid");

            var result = new OpenHarmonyHilogRetrieveDeviceIdsResult();
            result.notifyListeners = ((OpenHarmonyHilogRetrieveDeviceIdsInput)input).notifyListeners;

            try
            {
                var HDCOutput = HDC.Run(new[] { "list targets -v" }, "Unable to list connected devices. ");
                foreach (var line in HDCOutput.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries).Select(line => line.Trim()))
                {
                    OpenHarmonyHilogInternalLog.Log(" " + line);
                    OpenHarmonyHilogRetrieveDeviceIdsResult.DeviceInfo info;
                    if (ParseDeviceInfo(line, out info.id, out info.state))
                        result.deviceInfo.Add(info);
                }
            }
            catch (Exception ex)
            {
                OpenHarmonyHilogInternalLog.Log(ex.Message);
                result.deviceInfo = new List<OpenHarmonyHilogRetrieveDeviceIdsResult.DeviceInfo>();
            }

            return result;
        }

        protected override IOpenHarmonyHilogDevice CreateDevice(string deviceId)
        {
            return new OpenHarmonyHilogDevice(m_Runtime.Tools.HDC, deviceId);
        }
    }
}
