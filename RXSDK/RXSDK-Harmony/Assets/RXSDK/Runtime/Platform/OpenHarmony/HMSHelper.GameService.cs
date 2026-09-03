using System;

namespace RXSDK
{
    public static partial class HMSAPI
    {
        public static void InitGameServiceOnUI(Action<string> callback)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            SetCallback("GamePlayerInit", callback);
            GetHMSGameServiceManager().Call("GamePlayerInitOnUI", "", GetJSCallback());
#else
            callback?.Invoke("{\"code\":0}");
#endif
        }

        public static void GamePlayerSaveOnUI(string thirdOpenId, string gamePlayerId = null)
        {
            var playerInfo = new System.Collections.Generic.Dictionary<string, object> { ["thirdOpenId"] = thirdOpenId };
            if (!string.IsNullOrEmpty(gamePlayerId))
                playerInfo["gamePlayerId"] = gamePlayerId;
            GetHMSGameServiceManager().Call("GamePlayerSaveOnUI", RXUtility.ObjectToJson(playerInfo), GetJSCallback());
        }

        public static void GamePlayerGetLocalOnUI()
        {
            GetHMSGameServiceManager().Call("GamePlayerGetLocalOnUI", GetJSCallback());
        }

        public static void GamePlayerBindPlayerOnUI(string thirdOpenId, string teamPlayerId = null, Action<string> callback = null)
        {
            if (callback != null)
                SetCallback("BindPlayer", callback);
            var playerInfo = new System.Collections.Generic.Dictionary<string, object> { ["thirdOpenId"] = thirdOpenId };
            if (!string.IsNullOrEmpty(teamPlayerId))
                playerInfo["teamPlayerId"] = teamPlayerId;
            GetHMSGameServiceManager().Call("GamePlayerBindPlayerOnUI", RXUtility.ObjectToJson(playerInfo), GetJSCallback());
        }

        public static void GamePlayerUnBindPlayerOnUI(string thirdOpenId, string teamPlayerId, Action<string> callback)
        {
            if (string.IsNullOrEmpty(thirdOpenId))
            {
                var msg = "UnBindPlayer thirdOpenId is null or empty error，please login first";
                Log.D(msg);
                callback?.Invoke("{\"code\":-1 ,\"msg\":" + msg + "}");
                return;
            }
            if (callback != null)
                SetCallback("UnBindPlayer", callback);
            var playerInfo = new System.Collections.Generic.Dictionary<string, object> { ["thirdOpenId"] = thirdOpenId };
            if (!string.IsNullOrEmpty(teamPlayerId))
                playerInfo["teamPlayerId"] = teamPlayerId;
            GetHMSGameServiceManager().Call("GamePlayerUnBindPlayerOnUI", RXUtility.ObjectToJson(playerInfo), GetJSCallback());
        }

        public static void GamePlayerVerifyLocalPlayerOnUI(string openID, bool? isRealName, Action<string> callback)
        {
#if UNITY_OPENHARMONY && (!UNITY_EDITOR)
            openID ??= PassportManager.Instance.CurrentLoginData?.openid;
            isRealName ??= PassportManager.Instance.CurrentLoginData?.IsRealName;
            var playerInfo = new System.Collections.Generic.Dictionary<string, object>
            {
                ["thirdOpenId"] = openID,
                ["isRealName"] = isRealName
            };
            SetCallback("VerifyLocalPlayer", callback);
            GetHMSGameServiceManager().Call("GamePlayerVerifyLocalPlayerOnUI", RXUtility.ObjectToJson(playerInfo), GetJSCallback());
#else
            callback?.Invoke("{\"code\":0}");
#endif
        }
    }
}
