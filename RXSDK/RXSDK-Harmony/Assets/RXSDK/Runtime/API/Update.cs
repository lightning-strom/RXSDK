using System;
using System.Collections.Generic;
using RXSDK.Net;

namespace RXSDK
{
    public static class UpdateAPI
    {
        public static string HandlePath(string path)
        {
            Dictionary<string, object> queryMap = new()
            {
                { "local_country", DeviceUtility.GetCountry() }
            };
            path = UrlUtility.AddQueryStringToUrl(path, queryMap);
            return path;
        }

        public static void UpdateGameVersion(Dictionary<string, object> queryMap, Action<int, object, string> callback)
        {
            string path = "v1/vcapi/update_module_version";
            queryMap ??= new Dictionary<string, object>();
            API.PostUnAuth(path, queryMap, UserActionTracer.CheckUpdateIntercept(callback));
        }

        public static void CheckUpdateApp(string version, int region, string type, Dictionary<string, object> queryMap, Action<int, object, string> callback, string method = "GET")
        {
            string productId = SDKConfig.Instance.ProductId;
            string channelId = SDKConfig.Instance.ChannelId;
            string deviceCode = DeviceUtility.GetDeviceCode();
            string path = $"v1/vcapi/update/{productId}/{channelId}/{version}/{deviceCode}/{region}";
            queryMap ??= new Dictionary<string, object>();
            if (!string.IsNullOrEmpty(type))
                queryMap.TryAdd("type", type);

            RXWebRequest.Create(HandlePath(path)).SetNeedLogin(false).RequestAsync(RXWebRequest.DefaultCoroutineHost, UserActionTracer.CheckUpdateIntercept(callback), method, queryMap);

        }

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void CheckUpdateGame(int gameId, int gameVersion, int gameCheckVersion, Dictionary<string, object> queryMap, Action<int, object, string> callback)
        {
            string path = $"v1/vcapi/update_game/{gameId}/{gameVersion}/{gameCheckVersion}";
            queryMap ??= new Dictionary<string, object>();
            if (!queryMap.ContainsKey("type"))
            {
                queryMap.Add("type", "js");
            }

            RXWebRequest.Create(HandlePath(path)).SetNeedLogin(false).GetAsync(RXWebRequest.DefaultCoroutineHost, UserActionTracer.CheckUpdateIntercept(callback), queryMap);
        }

        // [Obsolete("This method callback type is deprecated. Please use RXCallback type instead.")]
        public static void CheckUpdateActivity(string activityShortname, int activityVersion, int activityCheckVersion, Dictionary<string, object> queryMap, Action<int, object, string> callback)
        {
            string path = $"v1/vcapi/update_activity/{activityShortname}/{activityVersion}/{activityCheckVersion}";
            queryMap ??= new Dictionary<string, object>();
            if (!queryMap.ContainsKey("type"))
            {
                queryMap.Add("type", "js");
            }

            RXWebRequest.Create(HandlePath(path)).SetNeedLogin(false).GetAsync(RXWebRequest.DefaultCoroutineHost, UserActionTracer.CheckUpdateIntercept(callback), queryMap);
        }
    }
}