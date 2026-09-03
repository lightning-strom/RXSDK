#if UNITY_ANDROID
using UnityEngine;

namespace RuiXue.Rank.Impl
{
    internal class RXRankAndroid : IRXRank
    {
        
        private static AndroidJavaClass _unityPlayer;
        private static AndroidJavaObject _rxSdkObj;
        private static AndroidJavaObject _contextObj;
        private static AndroidJavaObject _rxApiObj;
        private static AndroidJavaClass _jSONUtil;

        public RXRankAndroid()
        {
            _unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
            _rxSdkObj = new AndroidJavaClass("com.ruixue.RuiXueSdk");
            _contextObj = _unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
            _rxApiObj = _rxSdkObj.CallStatic<AndroidJavaObject>("getRXSdkApi");
            _jSONUtil = new AndroidJavaClass("com.ruixue.utils.JSONUtil");
        }

        public void AddScore(string rank_id, int score, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("addScore", rank_id, score, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void SetScore(string rank_id, int score, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("setScore", rank_id, score, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void QueryUserRank(string rank_id, string open_id, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("queryUserRank", rank_id, open_id, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void GetRankList(string rank_id, int start_rank, int end_rank, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("getRankList", rank_id, start_rank, end_rank, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }

        public void FriendsRank(string rank_id, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _rxApiObj.Call("friendsRank", rank_id, 
                new JsonCallbackJavaProxy(onResponse, onError));
        }
    }
}
#endif