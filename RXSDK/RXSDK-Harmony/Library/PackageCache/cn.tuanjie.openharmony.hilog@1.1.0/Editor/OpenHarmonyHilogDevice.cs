using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace Tuanjie.OpenHarmony.Hilog
{
    internal abstract class IOpenHarmonyHilogDevice
    {
        internal IOpenHarmonyHilogAbilityManager m_AbilityManager;
        internal static Regex kNetworkDeviceRegex = new Regex(@"^.*:\d{1,5}$");

        private DeviceState m_State;
        internal enum DeviceConnectionType
        {
            USB,
            Network
        }

        internal enum DeviceState
        {
            Connected,
            Disconnected,
            Unauthorized,
            Unknown
        }

        // Check if it is OpenHarmony 5 or above due to changes of "user" privilege:
        // 1: 'ip route'; Use "netstat" instead.
        internal static readonly Version kOpenHarmonyVersion5 = new Version(5, 0);

        internal IOpenHarmonyHilogAbilityManager AbilityManager => m_AbilityManager;

        internal abstract int APILevel { get; }

        internal abstract string Manufacturer { get; }

        internal abstract string Model { get; }

        internal abstract Version OSVersion { get; }

        internal abstract string ABI { get; }

        internal abstract string Id { get; }

        internal abstract string DisplayName { get; }

        internal abstract string ShortDisplayName { get; }

        protected abstract string GetTagPriorityAsString(string tag);

        protected abstract void SetTagPriorityAsString(string tag, string priority);

        internal Priority GetTagPriority(string tag)
        {
            var output = GetTagPriorityAsString(tag);
            // Note: output can be just \r\n (Happened on Google Pixel 2 OpenHarmony 10)
            if (string.IsNullOrEmpty(output) || string.IsNullOrEmpty(output.Trim()))
                return Priority.Debug;

            return OpenHarmonyHilogUtilities.PriorityStringToEnum(output);
        }

        internal void SetTagPriority(string tag, Priority priority)
        {
            SetTagPriorityAsString(tag, OpenHarmonyHilogUtilities.PriorityEnumToString(priority));
        }

        internal virtual void UninstallPackage(string packageName) { }

        internal bool SupportsFilteringByPid
        {
            //It seems that filtering logs via "--pid" misses last few logs in some cases.
            get { return false; }
        }

        internal bool SupportYearFormat
        {
            get { return true; }
        }

        internal bool BelowVersion5
        {
            get { return OSVersion < kOpenHarmonyVersion5; }
        }

        internal DeviceConnectionType ConnectionType
        {
            get
            {
                return kNetworkDeviceRegex.Match(Id).Success ? DeviceConnectionType.Network : DeviceConnectionType.USB;
            }
        }

        internal DeviceState State
        {
            get { return m_State; }
        }

        internal void UpdateState(DeviceState state)
        {
            m_State = state;
        }

        internal IOpenHarmonyHilogDevice(IOpenHarmonyHilogAbilityManager AbilityManager)
        {
            m_State = DeviceState.Unknown;
            m_AbilityManager = AbilityManager;
        }
    }

    internal class OpenHarmonyHilogDevice : IOpenHarmonyHilogDevice
    {
        private string m_Id;
        private OpenHarmonyBridge.HDC m_HDC;
        private Version m_Version;
        private string m_DisplayName;


        internal OpenHarmonyHilogDevice(OpenHarmonyBridge.HDC HDC, string deviceId)
            : base(new OpenHarmonyHilogAbilityManager(HDC, deviceId))
        {
            m_HDC = HDC;
            m_Id = deviceId;
        }

        internal override int APILevel
        {
            get
            {
                var value = -1;
                if (int.TryParse(Properties["const.ohos.apiversion"], out value))
                    return value;
                else
                    return -1;
            }
        }

        internal override string Manufacturer
        {
            get
            {
                return Properties["const.product.manufacturer"] ?? string.Empty;
            }
        }

        internal override string Model
        {
            get
            {
                return Properties["const.product.model"] ?? string.Empty;
            }
        }

        internal override Version OSVersion
        {
            get
            {
                if (m_Version == null)
                {
                    var versionString = Properties["const.product.software.version"];
                    m_Version = OpenHarmonyHilogUtilities.ParseVersion(versionString);
                }

                return m_Version ?? new Version();
            }
        }

        internal override string ABI
        {
            get
            {
                return Properties["const.product.cpu.abilist"] ?? string.Empty;
            }
        }

        internal override string Id
        {
            get { return m_Id; }
        }

        internal override string DisplayName
        {
            get
            {
                if (State != DeviceState.Connected)
                    return Id + " (" + State.ToString() + ")";
                else
                {
                    if (m_DisplayName != null)
                        return m_DisplayName;

                    if (string.Equals(Manufacturer, string.Empty)
                        || string.Equals(Manufacturer, string.Empty)
                        || string.Equals(OSVersion.ToString(), string.Empty)
                        || string.Equals(ABI, string.Empty)
                        || APILevel == -1)
                    {
                        m_DisplayName = null;
                        return $" {Id}";
                    }

                    m_DisplayName = $"{Manufacturer} {Model} (version: {OSVersion}, abi: {ABI}, sdk: {APILevel}, id: {Id})";
                    return m_DisplayName;
                }
            }
        }

        internal override string ShortDisplayName
        {
            get
            {
                var shortName = Manufacturer.Length > 0 ? $"{Manufacturer} {Model} ({Id})" : Id;
                if (State != DeviceState.Connected)
                    return $"{shortName} ({State})";
                else
                    return shortName;
            }
        }

        protected override string GetTagPriorityAsString(string tag)
        {
            if (State != DeviceState.Connected)
                return string.Empty;

            var args = $"-t {Id} shell \"param get hilog.loggable.tag.{tag}\"";
            var output = m_HDC.Run(new[] { args }, $"Failed to get priority for tag '{tag}'");
            if(output.Contains("fail") || output.Contains("Invalid"))
                return string.Empty;
            return output.Replace("\r\n", "");
        }

        protected override void SetTagPriorityAsString(string tag, string priority)
        {
            if (State != DeviceState.Connected)
                return;
            var args = $"-t {Id} shell \"hilog -b {priority} -T {tag}\"";
            m_HDC.Run(new[] { args }, $"Failed to set priority '{priority}' for tag '{tag}'");
        }

        internal override void UninstallPackage(string packageName)
        {
            var args = new[]
{
                "-t",
                Id,
                "shell bm -n ",
                packageName
             };

            m_HDC.Run(args, $"Failed to uninstall package '{packageName}'");
        }

        public class PropertiesTable<TValue>
        {
            internal readonly Dictionary<string, TValue> m_Dictionary;
            internal readonly TValue m_DefaultValue;

            internal PropertiesTable(Dictionary<string, TValue> dictionary, TValue defaultValue)
            {
                m_Dictionary = dictionary;
                m_DefaultValue = defaultValue;
            }

            public TValue this[string key]
            {
                get
                {
                    TValue result;
                    if (!m_Dictionary.TryGetValue(key, out result))
                        result = m_DefaultValue;
                    return result;
                }
            }
        }

        PropertiesTable<string> m_Properties;
        public PropertiesTable<string> Properties
        {
            get
            {
                if (m_Properties != null && m_Properties.m_Dictionary.Count != 0)
                    return m_Properties;

                var properties = new Dictionary<string, string>();
                var cmd = string.Format("-t {0} shell param get", m_Id);
                var stdout = m_HDC.Run(new[] { cmd }, "Failed to Get properties for the device " + m_Id);
                OpenHarmonyHilogInternalLog.Log("For device {0}, {1}", m_Id, stdout);

                if (stdout.Contains("version is too low") || OpenHarmonyHilogUtilities.CheckCommandSuccess(stdout))
                {
                    OpenHarmonyHilogUtilities.CheckAndRebootHDC(m_HDC);
                    stdout = String.Empty;
                }
                ParseProperties(stdout, ref properties);
                return m_Properties = new PropertiesTable<string>(properties, "");
            }
        }

        private void ParseProperties(string strVal, ref Dictionary<string, string> properties)
        {
            foreach (var line in strVal.Split('\r', '\n'))
            {
                var trimmedLine = line.Trim();
                if (trimmedLine.Length == 0)
                {
                    continue;
                }

                var tokens = trimmedLine.Split("=");
                if (tokens.Length > 1)
                {
                    properties[tokens[0].Trim()] = tokens[1].Trim();
                }
                else if (tokens.Length > 0)
                {
                    properties[tokens[0].Trim()] = "";
                }
            }
        }
    }
}
