
using RuiXue.Rank.Impl;
namespace RuiXue.Rank
{
    public static class RXRank
    {
#if UNITY_ANDROID
        private static readonly IRXRank _sdk = new RXRankAndroid();
#elif UNITY_IOS
        private static readonly IRXRank _sdk = new RXRankIOS();
#elif UNITY_WEBGL
        private static readonly IRXRank _sdk = new RXRankWebGL();
#else
        private static readonly IRXRank _sdk = new RXRankNotSupport();
#endif

        /// <summary>
        /// 增加用户分数
        /// </summary>
        /// <param name="rank_id"></param>
        /// <param name="score"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void AddScore(string rank_id, int score,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.AddScore(rank_id, score, onResponse, onError);
        }

        /// <summary>
        /// 设置用户分数
        /// </summary>
        /// <param name="rank_id"></param>
        /// <param name="score"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void SetScore(string rank_id, int score,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.SetScore(rank_id, score, onResponse, onError);
        }

        /// <summary>
        /// 查询用户分数
        /// </summary>
        /// <param name="rank_id"></param>
        /// <param name="open_id"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void QueryUserRank(string rank_id, string open_id,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.QueryUserRank(rank_id, open_id, onResponse, onError);
        }

        /// <summary>
        /// 获取排行榜列表
        /// </summary>
        /// <param name="rank_id"></param>
        /// <param name="start_rank"></param>
        /// <param name="end_rank"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void GetRankList(string rank_id, int start_rank, int end_rank,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.GetRankList(rank_id, start_rank, end_rank, onResponse, onError);
        }

        /// <summary>
        /// 获取好友排行榜列表
        /// </summary>
        /// <param name="rank_id"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public static void FriendsRank(string rank_id,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            _sdk.FriendsRank(rank_id, onResponse, onError);
        }
    }
}