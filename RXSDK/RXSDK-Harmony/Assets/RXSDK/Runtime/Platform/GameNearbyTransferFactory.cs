using System;

namespace RXSDK.Platform
{

    class GameNearbyTransferFactory
    {
        private static IGameNearbyTransfer _instance;
        private static readonly object _lock = new();
        public static IGameNearbyTransfer Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (_lock)
                    {
                        _instance = CreatePlatformInstance();
                    }
                }
                return _instance;
            }
        }


        private static IGameNearbyTransfer CreatePlatformInstance()
        {


#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            return new OpenHarmony.HMSGameNearbyTransferImpl();
#else
            return new GameNearbyTransferDefault();
#endif
        }


        public static void SetInstance(IGameNearbyTransfer instance)
        {
            lock (_lock)
            {
                _instance = instance;
            }
        }
    }
    class GameNearbyTransferDefault : IGameNearbyTransfer
    {

        public void AutoBindNearbyGame(Action<RXResult<object>> callback)
        {
            Log.D("NotImplementedException:" + System.Reflection.MethodBase.GetCurrentMethod().Name);
        }

        public void BindNearbyGame(NearbyGameDevice device, Action<RXResult<object>> callback)
        {
            Log.D("NotImplementedException:" + System.Reflection.MethodBase.GetCurrentMethod().Name);
        }

        public void Create(CreateParameters param, Action<RXResult<object>> callback)
        {
            Log.D("NotImplementedException:" + System.Reflection.MethodBase.GetCurrentMethod().Name);
        }

        public void Destroy(Action<RXResult<object>> callback)
        {
            Log.D("NotImplementedException:" + System.Reflection.MethodBase.GetCurrentMethod().Name);
        }


        public void Discovery(Action<RXResult<DiscoveryResult>> callback)
        {
            Log.D("NotImplementedException:" + System.Reflection.MethodBase.GetCurrentMethod().Name);
        }

        public void PublishNearbyGame(Action<RXResult<object>> callback)
        {
            Log.D("NotImplementedException:" + System.Reflection.MethodBase.GetCurrentMethod().Name);
        }

        public void RegisterCallback(Action<RXResult<object>> callback)
        {
            Log.D("NotImplementedException:" + System.Reflection.MethodBase.GetCurrentMethod().Name);
        }

        public void ReplyPackageInfoResult(PackageInfoResult packageInfoResult, Action<RXResult<object>> callback)
        {
            Log.D("NotImplementedException:" + System.Reflection.MethodBase.GetCurrentMethod().Name);
        }

        public void SendPackageInfo(PackageInfo packageInfo, Action<RXResult<object>> callback)
        {
            Log.D("NotImplementedException:" + System.Reflection.MethodBase.GetCurrentMethod().Name);
        }

        public void TransferPackageData(PackageData packageData, Action<RXResult<object>> callback)
        {
            Log.D("NotImplementedException:" + System.Reflection.MethodBase.GetCurrentMethod().Name);
        }

        public void UnregisterCallback()
        {
            Log.D("NotImplementedException:" + System.Reflection.MethodBase.GetCurrentMethod().Name);
        }
    }

}