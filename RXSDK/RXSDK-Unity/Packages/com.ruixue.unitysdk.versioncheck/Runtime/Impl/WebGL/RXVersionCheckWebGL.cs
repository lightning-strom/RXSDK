using System.Collections.Generic;
using System.Runtime.InteropServices;
using RuiXue.Impl;
using RuiXueLitJson;

#if UNITY_WEBGL
namespace RuiXue.VersionCheck.Impl
{
    public class RXVersionCheckWebGL:JsCallBackHandlerBase, IRXVersionCheck
    {
        public void UpdateApp(string version, string region, string type, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["clientversion"] = version,
                ["devicecode"]= "0",
                ["type"] = type
            };

            int regionId = 0;
            if (int.TryParse(region, out regionId))
            {
                data["region"] = regionId;
            }
            
            RegisterJsCallBack("rx_checkAppVersion", onResponse, onError);
            rx_checkAppVersion(data.ToJson());
        }

        public void CheckUpdateApp(string version, string region, string type, Dictionary<string, int> games, Dictionary<string, int> activities,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["clientversion"] = version,
                ["devicecode"]= "0",
                ["type"] = type
            };
            if (games != null && games.Count > 0)
            {
                data["games"] = JsonMapper.ToObject(JsonMapper.ToJson(games));
            }
            if (activities != null && activities.Count > 0)
            {
                data["activities"] = JsonMapper.ToObject(JsonMapper.ToJson(activities));;
            }
            
            int regionId = 0;
            if (int.TryParse(region, out regionId))
            {
                data["region"] = regionId;
            }
            
            RegisterJsCallBack("rx_checkVersion", onResponse, onError);
            rx_checkVersion(data.ToJson());
        }

        public void UpdateGame(string gameId, string gameVersion, string gameCheckVersion, string type,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["type"] = type
            };
            
            int.TryParse(gameId, out int gameIdInt);
            int.TryParse(gameVersion, out int gameVersionInt);
            int.TryParse(gameCheckVersion, out int gameCheckVersionInt);
            data["gameid"] = gameIdInt;
            data["gameversion"] = gameVersionInt;
            data["gamecheckversion"] = gameCheckVersionInt;
            
            RegisterJsCallBack("rx_checkGameVersion", onResponse, onError);
            rx_checkGameVersion(data.ToJson());
        }

        public void UpdateGameVersion(Dictionary<string, object> body,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RegisterJsCallBack("rx_updateGameVersion", onResponse, onError);
            rx_updateGameVersion(JsonMapper.ToJson(body ?? new Dictionary<string, object>()));
        }

        public void UpdateActivity(string activityShortname, string activityVersion, string activityCheckVersion, string type,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["activityshortname"] = activityShortname,
                ["type"] = type
            };
            
            int.TryParse(activityVersion, out int activityVersionInt);
            int.TryParse(activityCheckVersion, out int activityCheckVersionInt);
            data["activityversion"] = activityVersionInt;
            data["activitycheckversion"] = activityCheckVersionInt;
            
            RegisterJsCallBack("rx_checkActivityVersion", onResponse, onError);
            rx_checkActivityVersion(data.ToJson());
        }
        
        [DllImport("__Internal")]
        private static extern void rx_checkAppVersion(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_checkVersion(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_checkGameVersion(string json);

        [DllImport("__Internal")]
        private static extern void rx_updateGameVersion(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_checkActivityVersion(string json);
    }
}
#endif