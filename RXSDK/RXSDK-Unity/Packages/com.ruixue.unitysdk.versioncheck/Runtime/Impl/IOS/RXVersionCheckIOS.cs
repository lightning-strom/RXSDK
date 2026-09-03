using System.Collections.Generic;
using System.Runtime.InteropServices;
#if UNITY_IOS
namespace RuiXue.VersionCheck.Impl
{
    internal class RXVersionCheckIOS :IRXVersionCheck
    {
        public void UpdateApp(string version, string region, string type, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_checkUpdate_App", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_checkUpdate_App(region, version, type, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void CheckUpdateApp(string version, string region, string type, Dictionary<string, int> games, Dictionary<string, int> activities,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_checkUpdate_AppCustom", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            string jsonGames = RXJsonUtil.ToJson(games);
            string jsonActivities = RXJsonUtil.ToJson(activities);

            ios_checkUpdate_AppCustom(region, version, jsonGames, jsonActivities, type, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void UpdateGame(string gameId, string gameVersion, string gameCheckVersion, string type,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_checkUpdate_Game", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

           ios_checkUpdate_Game(gameId, gameVersion, gameCheckVersion, type, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void UpdateGameVersion(Dictionary<string, object> body,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_updateGameVersion", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            string jsonBody = RXJsonUtil.ToJson(body ?? new Dictionary<string, object>());
            ios_updateGameVersion(jsonBody, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void UpdateActivity(string activityShortname, string activityVersion, string activityCheckVersion, string type,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_checkUpdate_Activity", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });

            ios_checkUpdate_Activity(activityVersion, activityCheckVersion, activityShortname, type, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }
        
       // 大厅更新检查（GET版本，不返回下载地址）
        [DllImport("__Internal")]
        private static extern void ios_checkUpdate_App(string region,
            string client_version,
            string type,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 大厅更新检查（POST版本，返回下载地址）
        [DllImport("__Internal")]
        private static extern void ios_checkUpdate_AppCustom(string region,
            string client_version,
            string games,
            string activities,
            string type,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 活动更新检查
        [DllImport("__Internal")]
        private static extern void ios_checkUpdate_Activity(string game_version,
            string game_check_version,
            string short_name,
            string type,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 游戏更新检查
        [DllImport("__Internal")]
        private static extern void ios_checkUpdate_Game(string game_id,
            string game_version,
            string game_check_version,
            string type,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);

// 游戏版本检查 v2
        [DllImport("__Internal")]
        private static extern void ios_updateGameVersion(string body,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);
        
    }
}
#endif