#if UNITY_ANDROID
using System;
using System.Collections.Generic;
using UnityEngine;

namespace RuiXue.Firebase.Impl
{
    public class RXFirebaseAndroid : IRXFirebase
    {
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaObject _firebaseObj;
        private static AndroidJavaObject _firebaseAnalyticsObj;
        private static AndroidJavaObject _firebaseCrashObj;
        private static AndroidJavaObject _firebaseMsgServiceObj;

        public RXFirebaseAndroid()
        {
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            _firebaseObj = new AndroidJavaClass("com.ruixue.sdk.firebase.FirebaseSdkWrapper")
                .CallStatic<AndroidJavaObject>("getInstance");
        }

        public void InitFirebaseAnalytics()
        {
            LogUtil.Log("EventManager", "InitFirebaseAnalytics222");
            _firebaseObj.Call("initFirebaseAnalytics", _contextObj);
            _firebaseAnalyticsObj = _firebaseObj.Call<AndroidJavaObject>("getFirebaseAnalytics");
            _firebaseCrashObj = _firebaseObj.Call<AndroidJavaObject>("getFirebaseCrashlytics");
            _firebaseMsgServiceObj = new AndroidJavaClass("com.ruixue.sdk.firebase.push.FcmPushReceiver");
        }

        public void LogEvent(string name, Dictionary<string, object> param)
        {
            _firebaseAnalyticsObj.Call("logEvent", name, GetAndroidBundle(param));
        }

        public void SetDefaultEventParameters(Dictionary<string, object> param)
        {
            _firebaseAnalyticsObj.Call("setDefaultEventParameters", GetAndroidBundle(param));
        }

        public void SetUserProperty(string name, string value)
        {
            _firebaseAnalyticsObj.Call("setUserProperty", name, value);
        }

        public void SetAnalyticsUserId(string id)
        {
            _firebaseAnalyticsObj.Call("setAnalyticsUserId", id);
        }

        public void SetAnalyticsCollectionEnabled(bool enabled)
        {
            _firebaseAnalyticsObj.Call("setAnalyticsCollectionEnabled", enabled);
        }

        public void SetCustomKey(string key, string value)
        {
            _firebaseCrashObj.Call("setCustomKey", key, value);
        }

        public void SetCustomKey(string key, bool value)
        {
            _firebaseCrashObj.Call("setCustomKey", key, value);
        }

        public void SetCustomKey(string key, float value)
        {
            _firebaseCrashObj.Call("setCustomKey", key, value);
        }

        public void SetCustomKey(string key, int value)
        {
            _firebaseCrashObj.Call("setCustomKey", key, value);
        }

        public void SetCustomKey(string key, long value)
        {
            _firebaseCrashObj.Call("setCustomKey", key, value);
        }

        public void SetCustomKeys(Dictionary<string, object> keysAndValues)
        {
            _firebaseCrashObj.Call("setCustomKeys", GetAndroidCustomKeysAndValues(keysAndValues));
        }

        public void Log(string message)
        {
            _firebaseCrashObj.Call("log", message);
        }

        public void SetCrashUserId(string identifier)
        {
            _firebaseCrashObj.Call("setCrashUserId", identifier);
        }

        public void RecordException(Exception throwable)
        {
            AndroidJavaObject throwObj = new AndroidJavaObject("java.lang.Throwable", throwable.Message);
            _firebaseCrashObj.Call("recordException", throwObj);
        }

        public void SetCrashlyticsCollectionEnabled(bool enabled)
        {
            _firebaseCrashObj.Call("setCrashlyticsCollectionEnabled", enabled);
        }

        public void SetFCMCallBack(IRXFirebase.MessageReceivedDelegate messageReceived, 
            IRXFirebase.NewTokenDelegate newToken)
        {
            _firebaseMsgServiceObj.CallStatic("setFCMCallBack", 
                new MessageServiceProxy(messageReceived, newToken));
        }

        public void ClearFCMCallBack()
        {
            _firebaseMsgServiceObj.CallStatic("clearFCMCallBack");
        }

        private static AndroidJavaObject GetAndroidBundle(Dictionary<string, object> param)
        {
            AndroidJavaObject bundleObj = new AndroidJavaObject("android.os.Bundle");
            foreach (var item in param)
            {
                if (item.Value is bool) {
                    bundleObj.Call("putBoolean", item.Key, item.Value is bool ? (bool)item.Value : false);
                } else if (item.Value is int) {
                    bundleObj.Call("putInt", item.Key, item.Value is int ? (int)item.Value : 0);
                } else if (item.Value is long) {
                    bundleObj.Call("putLong", item.Key, item.Value is long);
                } else if (item.Value is double) {
                    bundleObj.Call("putDouble", item.Key, item.Value is double);
                } else if (item.Value is string) {
                    bundleObj.Call("putString", item.Key, item.Value as string);
                } else if (item.Value is float)
                {
                    bundleObj.Call("putFloat", item.Key, item.Value is float ? (float)item.Value : 0);
                }
                else {
                    throw new SystemException($"Unsupported type {item.Value.GetType()}");
                }
            }

            return bundleObj;
        }

        private static AndroidJavaObject GetAndroidCustomKeysAndValues(Dictionary<string, object> param)
        {
            AndroidJavaObject customKeysAndValues = new AndroidJavaObject("com.ruixue.sdk.firebase.data.RxCustomKeysAndValues$Builder");
            foreach (var item in param)
            {
                if (item.Value is bool) {
                    customKeysAndValues.Call<AndroidJavaObject>("putBoolean", item.Key, item.Value is bool ? (bool)item.Value : false);
                } else if (item.Value is int) {
                    customKeysAndValues.Call<AndroidJavaObject>("putInt", item.Key, item.Value is int ? (int)item.Value : 0);
                } else if (item.Value is long) {
                    customKeysAndValues.Call<AndroidJavaObject>("putLong", item.Key, item.Value is long);
                } else if (item.Value is double) {
                    customKeysAndValues.Call<AndroidJavaObject>("putDouble", item.Key, item.Value is double);
                } else if (item.Value is string) {
                    customKeysAndValues.Call<AndroidJavaObject>("putString", item.Key, item.Value as string);
                } else if (item.Value is float)
                {
                    customKeysAndValues.Call<AndroidJavaObject>("putFloat", item.Key, item.Value is float ? (float)item.Value : 0);
                }
                else {
                    throw new SystemException($"Unsupported type {item.Value.GetType()}");
                }
            }

            AndroidJavaObject obj = customKeysAndValues.Call<AndroidJavaObject>("build");
            return obj;
        }


    }
}
#endif