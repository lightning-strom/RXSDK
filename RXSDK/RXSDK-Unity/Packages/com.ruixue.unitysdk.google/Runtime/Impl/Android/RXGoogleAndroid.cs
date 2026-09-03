#if UNITY_ANDROID
using System.Collections.Generic;
using UnityEngine;

namespace RuiXue.Google.Impl
{
    public class RXGoogleAndroid : IRXGoogle
    {
        public static AndroidJavaObject _googleSdkObj;
        public static AndroidJavaObject _googleSdkInstance;

        public RXGoogleAndroid()
        {
            _googleSdkObj = new AndroidJavaClass("com.ruixue.sdk.google.GoogleSdkWrapper");
            _googleSdkInstance = _googleSdkObj.CallStatic<AndroidJavaObject>("getInstance");
        }

        public void Regist(string clientID)
        {
            LogUtil.WarningNotSupport("Regist");
        }

        public void QueryProductDetailsAsync(List<string> skusList, RequestResponseDelegate onResponse, RequestErrorDelegate errorDelegate)
        {
            AndroidJavaObject javaList = JavaArrayListExtensionMethod.CreateJavaArrayList();
            
            foreach (var t in skusList)
            {
                javaList.Add(t);
            }
            
            _googleSdkInstance.Call("queryProductDetailsAsync", javaList, 
                new ConvertRXStringCallbackProxy(onResponse, errorDelegate));
        }
    }
}
#endif