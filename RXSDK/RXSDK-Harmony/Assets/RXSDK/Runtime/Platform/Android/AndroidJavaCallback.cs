using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;

namespace RXSDK
{
    public class AndroidJavaCallback
    {
        private static readonly string JSON_CLASS = "org.json.JSONObject";
        private static readonly AndroidJavaClass sdkClass = new("cn.ruixue.android");

        private static readonly AndroidJavaObject unityAPIInstance = new("cn.ruixue.engine");
        public static readonly string java_interface = "com.ruixue.SDKCallbackListener";

        /// <summary>
        /// Convert Dictionary object to JSONObject in Java.
        /// </summary>
        /// <returns>The JSONObject instance.</returns>
        /// <param name="data">The Dictionary containing some data </param>
        private static AndroidJavaObject getJSONObject(Dictionary<string, object> data)
        {
            if (data == null)
            {
                return null;
            }

            string dataString = JsonConvert.SerializeObject(data);

            try
            {
                return new AndroidJavaObject(JSON_CLASS, dataString);
            }
            catch
            {
            }
            return null;
        }
        class AndroidCallbackListener<T> : AndroidJavaProxy
        {
            readonly Action<RXResult<T>> mCallback;
            public AndroidCallbackListener(Action<RXResult<T>> callback) : base(java_interface)
            {
                mCallback = callback;
            }

            //实现接口中的方法
            public void OnSDKInited(string msg)
            {
                mCallback.Invoke(JsonConvert.DeserializeObject<RXResult<T>>(msg));
                Log.D("OnSDKInited:" + msg);
                // unityAPIInstance.Call

            }
            public void OnLogined(string token)
            {
                Log.D("OnLogined:" + token);
            }
            public void OnLoginOut()
            {
                // Log.D("OnLoginOut.);
            }

            public void OnSwitchAccount()
            {
                // Log.D("OnLoginOut.);
            }
        }
    }
}



