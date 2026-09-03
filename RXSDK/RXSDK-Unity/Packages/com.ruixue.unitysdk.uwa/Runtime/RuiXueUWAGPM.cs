namespace RuiXue.UWA
{
    public class RuiXueUWAGPM
    {
        public static void StaticInit(string url, string appID, string appVersion,
            string channel = "", bool debug = false)
        {
            UWAGPM.StaticInit(url, appID, appVersion, channel, debug);
        }

        public static int GetRegisterState()
        {
            return UWAGPM.GetRegisterState();
        }

        public static void ChangeScene(string sceneName)
        {
            UWAGPM.ChangeScene(sceneName);
        }

        public static void SetNetworkLatency(uint value)
        {
            UWAGPM.Metric.NetworkLatency = value;
        }

        public static void SetUser(string userId)
        {
            UWAGPM.SetUser(userId);
        }

        public static void SetUserId(string userId)
        {
            UWAGPM.SetUserId(userId);
        }

        public static void SetQuality(int quality)
        {
            UWAGPM.SetQuality(quality);
        }

        public static void BeginSceneLoad(string sceneName)
        {
            UWAGPM.BeginSceneLoad(sceneName);
        }

        public static void EndSceneLoad()
        {
            UWAGPM.EndSceneLoad();
        }

        public static void BeginIgnore()
        {
            UWAGPM.BeginIgnore();
        }

        public static void EndIgnore()
        {
            UWAGPM.EndIgnore();
        }

        public static string GetSDKInfo(UWAGPM.SDKInfoType type)
        {
            return UWAGPM.GetSDKInfo(type);
        }

        public static float GetSDKData(UWAGPM.SDKMetricType type)
        {
            return UWAGPM.GetSDKData(type);
        }

        public static void SetScreenShotRatio(float ratio)
        {
            UWAGPM.SetScreenShotRatio(ratio);
        }


    }
}