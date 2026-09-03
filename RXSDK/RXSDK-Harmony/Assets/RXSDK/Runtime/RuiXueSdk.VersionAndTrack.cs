using System;
using System.Collections.Generic;

namespace RXSDK
{
    /// <summary>RuiXueSdk 版本更新、分享、埋点、商业化场景 API</summary>
    public partial class RuiXueSdk
    {
        #region Version API

        [Obsolete("Use RXCallback overload.")]
        public static void UpdateGameVersion(Dictionary<string, object> queryMap, Action<int, object, string> callback)
        {
            UpdateAPI.UpdateGameVersion(queryMap, callback);
        }

        public static void CheckUpdateApp(string version, int region, string type, Dictionary<string, object> queryMap, Action<int, object, string> callback, string method = "GET")
        {
            UpdateAPI.CheckUpdateApp(version, region, type, queryMap, callback, method);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void CheckUpdateGame(int gameId, int gameVersion, int gameCheckVersion, Dictionary<string, object> queryMap, Action<int, object, string> callback)
        {
            UpdateAPI.CheckUpdateGame(gameId, gameVersion, gameCheckVersion, queryMap, callback);
        }

        [Obsolete("Use RXCallback overload.")]
        public static void CheckUpdateActivity(string activityShortname, int activityVersion, int activityCheckVersion, Dictionary<string, object> queryMap, Action<int, object, string> callback)
        {
            UpdateAPI.CheckUpdateActivity(activityShortname, activityVersion, activityCheckVersion, queryMap, callback);
        }

        #endregion

        #region Share

        public static void Share(RXShareConfig rXShareConfig, RXCallback<object> callback)
        {
            ShareAPI.Share(rXShareConfig, callback);
        }

        #endregion

        #region Track

        public static void SetPublicProperties(Dictionary<string, Dictionary<string, object>> publicPro)
        {
            HadoopManager.Instance.PublicProperties = publicPro;
        }

        public static void UpdatePublicProperties(string eventName, Dictionary<string, object> properties)
        {
            HadoopManager.Instance.UpdatePublicProperties(eventName, properties);
        }

        public static void DeletePublicProperties(string key)
        {
            HadoopManager.Instance.DeletePublicProperties(key);
        }

        public static bool Track(string eventName, Dictionary<string, object> keyValuePairs, string distinctId = null)
        {
            return HadoopManager.Instance.Track(Instance, eventName, keyValuePairs, distinctId);
        }

        public static void ReportWindowExposure(Dictionary<string, object> properties, string distinctId = null)
        {
            HadoopManager.Instance.TrackAtTime(Instance, "#window_exposure", properties, distinctId);
        }

        public static void GetOperationScene(RXCallback<object> callback)
        {
            API.Post(APIPath.DATA_OPERATION_SCENE, (Dictionary<string, object>)null, callback);
        }

        #endregion
    }
}
