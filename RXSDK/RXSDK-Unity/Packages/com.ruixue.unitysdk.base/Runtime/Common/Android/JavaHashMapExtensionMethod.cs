#if UNITY_ANDROID
using UnityEngine;
using System;

namespace RuiXue
{
    public static class JavaHashMapExtensionMethod
    {
        public static AndroidJavaObject CreateJavaHashMap()
        {
            return new AndroidJavaObject("java.util.HashMap");
        }

        public static void Put(this AndroidJavaObject source, string key, string str)
        {
            source.Call<AndroidJavaObject>("put", key, str);

        }

        public static void Put(this AndroidJavaObject source, string key, bool boo)
        {
            AndroidJavaClass booleanObj = new AndroidJavaClass("java.lang.Boolean");
            source.Call<AndroidJavaObject>("put", key, booleanObj.CallStatic<AndroidJavaObject>("valueOf", boo));
        }


        public static void Put(this AndroidJavaObject source, string key, int num)
        {
            AndroidJavaClass integerObj = new AndroidJavaClass("java.lang.Integer");
            source.Call<AndroidJavaObject>("put", key, integerObj.CallStatic<AndroidJavaObject>("valueOf", num));
        }

        public static void Put(this AndroidJavaObject source, string key, long num)
        {
            AndroidJavaClass integerObj = new AndroidJavaClass("java.lang.Long");
            source.Call<AndroidJavaObject>("put", key, integerObj.CallStatic<AndroidJavaObject>("valueOf", num));
        }

        public static void Put(this AndroidJavaObject source, string key, AndroidJavaObject androidJavaObject)
        {
            source.Call<AndroidJavaObject>("put", key, androidJavaObject);
        }

        public static void Put(this AndroidJavaObject source, string key, AndroidJavaObject[] androidJavaObject)
        {
            source.Call<AndroidJavaObject>("put", key, androidJavaObject);
        }

        public static void PutAll(this AndroidJavaObject source, AndroidJavaObject androidJavaObject)
        {
            source.Call("putAll", androidJavaObject);
        }

        public static E Get<E>(this AndroidJavaObject source, string key)
        {   
            return source.Call<E>("get", key);
        }

        public static bool ContainsKey(this AndroidJavaObject source, string key)
        {
            return source.Call<bool>("containsKey", key);
        }
    } 
}

#endif
