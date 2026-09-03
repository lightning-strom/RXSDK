using System;

namespace RXSDK.Platform
{
    /// <summary>
    /// 近场传输服务接口。DTO/枚举见 GameNearbyTransferTypes.cs。
    /// </summary>
    public interface IGameNearbyTransfer
    {
        void Create(CreateParameters param, Action<RXResult<object>> callback);
        void RegisterCallback(Action<RXResult<object>> callback);
        void UnregisterCallback();
        void PublishNearbyGame(Action<RXResult<object>> callback);
        void AutoBindNearbyGame(Action<RXResult<object>> callback);
        void Discovery(Action<RXResult<DiscoveryResult>> callback);
        void BindNearbyGame(NearbyGameDevice device, Action<RXResult<object>> callback);
        void SendPackageInfo(PackageInfo packageInfo, Action<RXResult<object>> callback);
        void ReplyPackageInfoResult(PackageInfoResult packageInfoResult, Action<RXResult<object>> callback);
        void TransferPackageData(PackageData packageData, Action<RXResult<object>> callback);
        void Destroy(Action<RXResult<object>> callback);
    }
}
