#if UNITY_ANDROID
using RuiXue.Qoo.Impl;
using UnityEngine;
namespace RuiXue.Qoo.Impl
{
    internal class RXQooAndroid:IRXQoo
    {
        
        private static AndroidJavaClass _qooSdkHelper;
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _contextObj;

        public RXQooAndroid()
        {
            _qooSdkHelper = new AndroidJavaClass("com.ruixue.sdk.QooSdkHelper");
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
        }
        
        public void CheckLicense(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _qooSdkHelper.CallStatic("UnityCheckLicense", 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void RestorePurchases(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _qooSdkHelper.CallStatic("unityRestorePurchases", 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void Consume(string purchase_id, string token, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _qooSdkHelper.CallStatic("unityConsume", purchase_id, token, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void QueryProducts(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _qooSdkHelper.CallStatic("unityQueryProducts", 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void QueryProductInfo(string productIds, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _qooSdkHelper.CallStatic("unityQueryProductInfo", productIds, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void QueryProducts(int page, int size, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _qooSdkHelper.CallStatic("unityQueryProducts", page, size, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void OpenGameDetail()
        {
            _qooSdkHelper.CallStatic("openGameDetail", _contextObj);
        }

        public void LatestVersionCode(RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _qooSdkHelper.CallStatic("unityLatestVersionCode", new JsonCallbackJavaProxy(onResponse, onError));
        }

        public bool SetLocale(string eng)
        {
            return _qooSdkHelper.CallStatic<bool>("setLocale", eng);
        }

        public string GetDataFromResponse(string response)
        {
            return _qooSdkHelper.CallStatic<string>("getDataFromResponse", response);
        }
    }
}
#endif