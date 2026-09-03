namespace RuiXue.Rank.Impl
{
    internal class RXRankNotSupport :IRXRank
    {
        public void AddScore(string rank_id, int score, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("AddScore");
        }

        public void SetScore(string rank_id, int score, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("SetScore");
        }

        public void QueryUserRank(string rank_id, string open_id, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("QueryUserRank");
        }

        public void GetRankList(string rank_id, int start_rank, int end_rank, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("GetRankList");
        }

        public void FriendsRank(string rank_id, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            LogUtil.WarningNotSupport("FriendsRank");
        }
    }
}