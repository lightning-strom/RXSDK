namespace RuiXue.Rank.Impl
{
    public interface IRXRank
    {
        /// <summary>
        /// 增加用户分数
        /// </summary>
        /// <param name="rank_id"></param>
        /// <param name="score"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void AddScore(string rank_id, int score,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 设置用户分数
        /// </summary>
        /// <param name="rank_id"></param>
        /// <param name="score"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void SetScore(string rank_id, int score,
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 查询用户分数
        /// </summary>
        /// <param name="rank_id"></param>
        /// <param name="open_id"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void QueryUserRank(string rank_id, string open_id, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 获取排行榜列表
        /// </summary>
        /// <param name="rank_id"></param>
        /// <param name="start_rank"></param>
        /// <param name="end_rank"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void GetRankList(string rank_id, int start_rank, int end_rank, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

        /// <summary>
        /// 获取好友排行榜列表
        /// </summary>
        /// <param name="rank_id"></param>
        /// <param name="onResponse"></param>
        /// <param name="onError"></param>
        public void FriendsRank(string rank_id, 
            RequestResponseDelegate onResponse, RequestErrorDelegate onError);

    }
}
