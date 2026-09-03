using System;
using System.Collections.Generic;
using UnityEngine;


namespace RXSDK.Platform.OpenHarmony
{

    class HMSGameNearbyTransferImpl : TuanjieBridge, IGameNearbyTransfer
    {

        private readonly string _cName = "NearbyHandler.";

        public void Create(CreateParameters param, Action<RXResult<object>> callback)
        {
            string paramStr = RXUtility.ObjectToJson(param);

            Invoke<object>(_cName + System.Reflection.MethodBase.GetCurrentMethod().Name, paramStr, callback);
        }

        public void RegisterCallback(Action<RXResult<object>> callback)
        {
            Invoke<object>(_cName + System.Reflection.MethodBase.GetCurrentMethod().Name, null, callback, int.MaxValue);
        }

        public void UnregisterCallback()
        {
            Invoke<object>(_cName + System.Reflection.MethodBase.GetCurrentMethod().Name);
        }

        public void PublishNearbyGame(Action<RXResult<object>> callback)
        {
            Invoke<object>(_cName + System.Reflection.MethodBase.GetCurrentMethod().Name, null, callback);
        }

        public void AutoBindNearbyGame(Action<RXResult<object>> callback)
        {
            Invoke<object>(_cName + System.Reflection.MethodBase.GetCurrentMethod().Name, null, callback);
        }

        public void Discovery(Action<RXResult<DiscoveryResult>> callback)
        {
            Invoke(_cName + System.Reflection.MethodBase.GetCurrentMethod().Name, null, callback, int.MaxValue);
        }

        public void BindNearbyGame(NearbyGameDevice device, Action<RXResult<object>> callback)
        {
            string paramStr = RXUtility.ObjectToJson(device);
            Log.D("Nearby BindNearbyGame invoked :" + paramStr);
            Invoke<object>(_cName + System.Reflection.MethodBase.GetCurrentMethod().Name, paramStr, callback);
        }

        public void SendPackageInfo(PackageInfo packageInfo, Action<RXResult<object>> callback)
        {
            string paramStr = RXUtility.ObjectToJson(packageInfo);
            Log.D("Nearby SendPackageInfo invoked :" + paramStr);
            Invoke<object>(_cName + System.Reflection.MethodBase.GetCurrentMethod().Name, paramStr, callback);
        }

        public void ReplyPackageInfoResult(PackageInfoResult packageInfoResult, Action<RXResult<object>> callback)
        {
            string paramStr = RXUtility.ObjectToJson(packageInfoResult);
            Log.D("Nearby ReplyPackageInfoResult invoked :" + paramStr);
            Invoke<object>(_cName + System.Reflection.MethodBase.GetCurrentMethod().Name, paramStr, callback);
        }

        public void TransferPackageData(PackageData packageData, Action<RXResult<object>> callback)
        {
            string paramStr = RXUtility.ObjectToJson(packageData);
            Log.D("Nearby ReplyPackageInfoResult invoked :" + paramStr);
            Invoke<object>(_cName + System.Reflection.MethodBase.GetCurrentMethod().Name, paramStr, callback);
        }

        public void Destroy(Action<RXResult<object>> callback)
        {
            Invoke<object>(_cName + System.Reflection.MethodBase.GetCurrentMethod().Name, null, callback);
        }


    }

}
