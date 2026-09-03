using System.Collections.Generic;

namespace RuiXue.VersionCheck.Impl
{
    internal class RXVersionCheckNotSupport:IRXVersionCheck
    {
        public void UpdateApp(string version, string region, string type, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("UpdateApp");
        }

        public void CheckUpdateApp(string version, string region, string type, Dictionary<string, int> games, Dictionary<string, int> activities,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("CheckUpdateApp");
        }

        public void UpdateGame(string gameId, string gameVersion, string gameCheckVersion, string type,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("UpdateGame");
        }

        public void UpdateGameVersion(Dictionary<string, object> body,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("UpdateGameVersion");
        }

        public void UpdateActivity(string activityShortname, string activityVersion, string activityCheckVersion, string type,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("UpdateActivity");
        }
    }
}