#if UNITY_ANDROID
using UnityEngine;

namespace RuiXue
{
    public static class JavaArrayListExtensionMethod
    {
        public static AndroidJavaObject CreateJavaArrayList()
        {
            return new AndroidJavaObject("java.util.ArrayList");
        }
        
        public static void Add(this AndroidJavaObject source, string str)
        {
            source.Call<bool>("add", str);

        }

        public static void Add(this AndroidJavaObject source, bool boo)
        {
            AndroidJavaClass booleanObj = new AndroidJavaClass("java.lang.Boolean");
            source.Call<bool>("add", 
                booleanObj.CallStatic<AndroidJavaObject>("valueOf", boo));
        }


        public static void Add(this AndroidJavaObject source, int num)
        {
            AndroidJavaClass integerObj = new AndroidJavaClass("java.lang.Integer");
            source.Call<bool>("add",
                integerObj.CallStatic<AndroidJavaObject>("valueOf", num));
        }

        public static void Add(this AndroidJavaObject source, AndroidJavaObject androidJavaObject)
        {
            source.Call<bool>("add", androidJavaObject);
        }

        public static void Add(this AndroidJavaObject source, AndroidJavaObject[] androidJavaObject)
        {
            source.Call<bool>("add", androidJavaObject);
        }

        public static void AddAll(this AndroidJavaObject source, AndroidJavaObject androidJavaObject)
        {
            source.Call<bool>("addAll", androidJavaObject);
        }
        
    }
}

#endif
