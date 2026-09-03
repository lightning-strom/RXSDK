using System.Collections.Generic;

namespace RuiXue.VersionCheck.Impl
{
    internal interface IRXVersionCheck
    {
        /// <summary>
        /// 产品包版本检查（通用）
        /// </summary>
        /// <param name="version"></param>
        /// <param name="region"></param>
        /// <param name="type"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        /// <param name="channelCallback"></param>
        public void UpdateApp(string version, string region,string type,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

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
        public void CheckUpdateApp(string version, string region, string type, Dictionary<string, int> games, Dictionary<string, int> activities,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

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
        public void UpdateGame(string gameId, string gameVersion, string gameCheckVersion, string type, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 游戏版本检查 v2
        /// </summary>
        /// <param name="body"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void UpdateGameVersion(Dictionary<string, object> body,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

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
        public void UpdateActivity(string activityShortname, string activityVersion, string activityCheckVersion,
            string type, RequestResponseDelegate onResponse, RequestErrorDelegate onError);
        
        
    }
}
