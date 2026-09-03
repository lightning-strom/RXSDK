using System;
using System.Collections.Generic;
using RXSDK.Data;
using RXSDK.Net;

namespace RXSDK
{
    static class API
    {

        public static void Post(string path, DataBean data, RXCallback<object> callback)
        {
            RXWebRequest rXWebRequest = RXWebRequest.Create(path);
            rXWebRequest.SetPostData(data);
            rXWebRequest.PostAsync(RXWebRequest.DefaultCoroutineHost, callback);
        }

        public static void Post(string path, Dictionary<string, object> args, RXCallback<object> callback = null)
        {
            RXWebRequest rXWebRequest = RXWebRequest.Create(path);
            rXWebRequest.SetPostData(args);
            rXWebRequest.PostAsync(RXWebRequest.DefaultCoroutineHost, callback);
        }

        public static void PostUnAuth(string path, Dictionary<string, object> args, RXCallback<object> callback = null)
        {
            RXWebRequest rXWebRequest = RXWebRequest.Create(path);
            rXWebRequest.SetPostData(args);
            rXWebRequest.NeedLogin = false;
            rXWebRequest.PostAsync(RXWebRequest.DefaultCoroutineHost, callback);
        }
        public static void Get(string path, Dictionary<string, object> keyValuePairs, RXCallback<object> callback)
        {
            RXWebRequest rXWebRequest = RXWebRequest.Create(path);
            rXWebRequest.GetAsync(RXWebRequest.DefaultCoroutineHost, callback, keyValuePairs);
        }
        public static void GetUnAuth(string path, Dictionary<string, object> keyValuePairs, RXCallback<object> callback)
        {
            RXWebRequest rXWebRequest = RXWebRequest.Create(path);
            rXWebRequest.NeedLogin = false;
            rXWebRequest.GetAsync(RXWebRequest.DefaultCoroutineHost, callback, keyValuePairs);
        }

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void Post(string path, DataBean data, Action<int, object, string> callback)
        {
            Post(path, data, RXUtility.ToRXCallback(callback));
        }

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void Post(string path, Dictionary<string, object> args, Action<int, object, string> callback)
        {
            Post(path, args, RXUtility.ToRXCallback(callback));

        }
        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void PostUnAuth(string path, Dictionary<string, object> args, Action<int, object, string> callback)
        {
            PostUnAuth(path, args, RXUtility.ToRXCallback(callback));

        }
        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void Get(string path, Dictionary<string, object> keyValuePairs, Action<int, object, string> callback)
        {
            Get(path, keyValuePairs, RXUtility.ToRXCallback(callback));

        }
        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void GetUnAuth(string path, Dictionary<string, object> keyValuePairs, Action<int, object, string> callback)
        {
            GetUnAuth(path, keyValuePairs, RXUtility.ToRXCallback(callback));
        }


    }
}