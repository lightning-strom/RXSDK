using System.Collections.Generic;

namespace RXSDK.Platform
{
    /// <summary>近场传输事件类型 字符串常量（与 TS 原始值一致）</summary>
    public static class NearbyEventType
    {
        public const string Init = "init";
        public const string ConnectNotify = "connectNotify";
        public const string Discovery = "discovery";
        public const string Error = "error";
        public const string TransferNotify = "transferNotify";
        public const string TransferPackageData = "transferPackageData";
        public const string ReceivePackageInfo = "receivePackageInfo";
        public const string ReplyPackageInfoResult = "replyPackageInfoResult";
        public const string SendPackageInfo = "sendPackageInfo";
        public const string Destroy = "destroy";
        public const string AutoBindNearbyGame = "autoBindNearbyGame";
        public const string PublishNearbyGame = "publishNearbyGame";
        public const string BindNearbyGame = "bindNearbyGame";
    }

    /// <summary>创建参数（初始化附近传输服务的入参）</summary>
    public class CreateParameters
    {
        public string moduleName = string.Empty;
        public string abilityName = string.Empty;
        public bool needShowSystemUI;
        public Mode mode;
    }

    /// <summary>连接相关通知（接收连接状态变更的回调数据）</summary>
    public class ConnectNotification
    {
        public ConnectState connectState;
        public string message;
        public string remoteDeviceName;
    }

    /// <summary>绑定附近传输服务的参数</summary>
    public class BindParameters
    {
        public string deviceId = string.Empty;
        public string networkId = string.Empty;
    }

    /// <summary>已发现设备的信息</summary>
    public class NearbyGameDevice
    {
        public string deviceName = string.Empty;
        public string deviceId = string.Empty;
        public string networkId = string.Empty;
    }

    /// <summary>发现设备结果</summary>
    public class DiscoveryResult
    {
        public List<NearbyGameDevice> nearbyGameDevices = new();
    }

    /// <summary>附近传输服务的连接模式</summary>
    public enum Mode
    {
        API = 1,
        KNOCK = 2
    }

    /// <summary>创建服务结果</summary>
    public class CreateResult
    {
        public string localDeviceName = string.Empty;
    }

    /// <summary>连接状态</summary>
    public enum ConnectState
    {
        CONNECTED = 0,
        DISCONNECTED = 1
    }

    /// <summary>传输相关通知</summary>
    public class TransferNotification
    {
        public TransferState transferState;
        public TransferInfo transferInfo = new();
        public string fileStoragePath;
    }

    /// <summary>包传输状态</summary>
    public enum TransferState
    {
        SEND_START = 0,
        SEND_PROCESS = 1,
        SEND_FINISH = 2,
        SEND_ERROR = 3,
        RECEIVE_START = 4,
        RECEIVE_PROCESS = 5,
        RECEIVE_FINISH = 6,
        RECEIVE_ERROR = 7
    }

    /// <summary>文件信息</summary>
    public class FileInfo
    {
        public string path = string.Empty;
        public string hash;
    }

    /// <summary>包信息（传输包的整体信息）</summary>
    public class PackageInfo
    {
        public string name;
        public string version;
        public List<FileInfo> files;
        public string extraData;
    }

    /// <summary>包文件信息（源路径与目标路径映射）</summary>
    public class PackageFile
    {
        public string srcPath = string.Empty;
        public string destPath = string.Empty;
    }

    /// <summary>包数据（用于传输的完整数据）</summary>
    public class PackageData
    {
        public string name;
        public string version;
        public List<PackageFile> files = new();
    }

    /// <summary>通用接口调用返回结果</summary>
    public class ReturnResult
    {
        public int code;
        public string message;
    }

    /// <summary>包信息对比结果码</summary>
    public enum PackageInfoResultCode
    {
        ERROR = -1,
        PACKAGE_AVAILABLE_COMPARED = 0,
        PACKAGE_UNAVAILABLE_COMPARED = 1
    }

    /// <summary>包信息对比结果</summary>
    public class PackageInfoResult
    {
        public PackageInfoResultCode packageInfoResultCode;
        public string message;
    }

    /// <summary>传输相关信息（进度、速度等）</summary>
    public class TransferInfo
    {
        public int expectedTime;
        public long transferredPackageSize;
        public long totalPackageSize;
        public long rate;
    }

    /// <summary>附近传输错误码</summary>
    public enum NearbyTransferErrorCode
    {
        INTERNAL_ERROR = 1018300001,
        AUTH_FAILED = 1018300002,
        INVALID_REQUEST = 1018300003,
        NO_SERVICE_AVAILABLE = 1018300004,
        WLAN_BLUETOOTH_MUST_BE_ON = 1018300005,
        PUBLISH_FAILED = 1018300006,
        DISCOVERY_FAILED = 1018300007,
        INVALID_PARAMETER = 1018300008
    }
}
