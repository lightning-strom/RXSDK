using System.Collections.Generic;
using RuiXue.VersionCheck.Impl;

namespace RuiXue.VersionCheck
{
    public static class RXVersionCheck
    {
#if UNITY_ANDROID
        private static readonly IRXVersionCheck _sdk = new RXVersionCheckAndroid();
#elif UNITY_IOS
        private static readonly IRXVersionCheck _sdk = new RXVersionCheckIOS();
#elif UNITY_WEBGL
        private static readonly IRXVersionCheck _sdk = new RXVersionCheckWebGL();
#else
        private static readonly IRXVersionCheck _sdk = new RXVersionCheckNotSupport();
#endif

        /// <summary>
        /// 产品包版本检查（通用）
        /// </summary>
        /// <param name="version"></param>
        /// <param name="region"></param>
        /// <param name="type"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        /// <param name="channelCallback"></param>
        public static void UpdateApp(string version, string region, string type,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.UpdateApp(version, region, type, onResponse, onError);
        }

        /// <summary>
        /// 产品包版本检查（自定义）
        /// </summary>
        /// <param name="version"></param>
        /// <param name="region"></param>
        /// <param name="type"></param>
        /// <param name="games"></param>
        /// <param name="activities"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        /// <param name="channelCallback"></param>
        public static void CheckUpdateApp(string version, string region, string type, Dictionary<string, int> games, Dictionary<string, int> activities,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.CheckUpdateApp(version, region, type, games, activities, onResponse, onError);
        }

        /// <summary>
        /// 游戏更新检查
        /// </summary>
        /// <param name="gameId"></param>
        /// <param name="gameVersion"></param>
        /// <param name="gameCheckVersion"></param>
        /// <param name="type"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        /// <param name="channelCallback"></param>
        public static void UpdateGame(string gameId, string gameVersion, string gameCheckVersion,
            string type, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.UpdateGame(gameId, gameVersion, gameCheckVersion, type, onResponse, onError);
        }

        /// <summary>
        /// 游戏版本检查 v2
        /// </summary>
        /// <param name="moduleTag"></param>
        /// <param name="categoryTag"></param>
        /// <param name="clientVersion"></param>
        /// <param name="checkVersion"></param>
        /// <param name="type"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void UpdateGameVersion(string moduleTag, string categoryTag,
            int clientVersion, int checkVersion, string type,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            UpdateGameVersion(new List<VersionCheckModule>
            {
                new VersionCheckModule(moduleTag, categoryTag, clientVersion, checkVersion)
            }, type, onResponse, onError);
        }

        /// <summary>
        /// 游戏版本检查 v2
        /// </summary>
        /// <param name="modules"></param>
        /// <param name="type"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void UpdateGameVersion(List<VersionCheckModule> modules, string type,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            Dictionary<string, object> body = new Dictionary<string, object>
            {
                { "modules", modules }
            };
            if (!string.IsNullOrEmpty(type))
            {
                body.Add("type", type);
            }
            _sdk.UpdateGameVersion(body, onResponse, onError);
        }

        /// <summary>
        /// 活动更新检查
        /// </summary>
        /// <param name="activityShortname"></param>
        /// <param name="activityVersion"></param>
        /// <param name="activityCheckVersion"></param>
        /// <param name="type"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        /// <param name="channelCallback"></param>
        public static void UpdateActivity(string activityShortname, string activityVersion, string activityCheckVersion,
            string type, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.UpdateActivity(activityShortname, activityVersion, activityCheckVersion, 
                type, onResponse, onError);
        }

    }
}