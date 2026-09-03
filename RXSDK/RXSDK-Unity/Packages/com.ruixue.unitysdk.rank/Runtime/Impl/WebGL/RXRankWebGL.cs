using System.Runtime.InteropServices;
using RuiXue.Impl;
using RuiXueLitJson;

#if UNITY_WEBGL
namespace RuiXue.Rank.Impl
{
    public class RXRankWebGL: JsCallBackHandlerBase, IRXRank
    {
        public void AddScore(string rank_id, int score, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
           var data = new JsonData
           {
               ["rank_id"] = rank_id,
               ["score"] = score
           };
           
           RegisterJsCallBack("rx_addScore", onResponse, onError);
           rx_addScore(data.ToJson());
               
        }

        public void SetScore(string rank_id, int score, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["rank_id"] = rank_id,
                ["score"] = score
            };
            
            RegisterJsCallBack("rx_setScore", onResponse, onError);
            rx_setScore(data.ToJson());
        }

        public void QueryUserRank(string rank_id, string open_id, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["rank_id"] = rank_id,
                ["open_id"] = open_id
            };
            
            RegisterJsCallBack("rx_queryUserRank", onResponse, onError);
            rx_queryUserRank(data.ToJson());
        }

        public void GetRankList(string rank_id, int start_rank, int end_rank, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["rank_id"] = rank_id,
                ["start_rank"] = start_rank,
                ["end_rank"] = end_rank
            };
            
            RegisterJsCallBack("rx_getRankList", onResponse, onError);
            rx_getRankList(data.ToJson());
        }
        

        public void FriendsRank(string rank_id, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            var data = new JsonData
            {
                ["rank_id"] = rank_id
            };
            
            RegisterJsCallBack("rx_friendsRank", onResponse, onError);
            rx_friendsRank(data.ToJson());
        }
        
        [DllImport("__Internal")]
        private static extern void rx_addScore(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_setScore(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_queryUserRank(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_getRankList(string json);
        
        [DllImport("__Internal")]
        private static extern void rx_friendsRank(string json);
        
    }
}
#endif