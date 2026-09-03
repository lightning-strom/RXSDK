using System.Runtime.InteropServices;
#if UNITY_IOS
namespace RuiXue.Rank.Impl
{
    internal class RXRankIOS:IRXRank
    {
        public void AddScore(string rank_id, int score, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_addscoreWithRank_id", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_addscoreWithRank_id(rank_id, score, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void SetScore(string rank_id, int score, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_setScoreWithRank_id", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_setScoreWithRank_id(rank_id, score, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void QueryUserRank(string rank_id, string open_id, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_queryUserRankWithRank_id", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_queryUserRankWithRank_id(rank_id, open_id, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void GetRankList(string rank_id, int start_rank, int end_rank, RequestResponseDelegate onResponse,
            RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_getRankListWithRank_id", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_getRankListWithRank_id(rank_id, start_rank, end_rank, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }

        public void FriendsRank(string rank_id, RequestResponseDelegate onResponse, RequestErrorDelegate onError)
        {
            RuiXueSdkDriver.RegisterIOSCallBack("ios_getFriendRankListWithRank_id", new IOSCallBackWrapper
            {
                onResponse = onResponse,
                onError = onError
            });
            
            ios_getFriendRankListWithRank_id(rank_id, RuiXueSdkDriver.IOSCallBackOnResponse, RuiXueSdkDriver.IOSCallBackOnError);
        }
        
        // 增加用户分数
        [DllImport("__Internal")]
        private static extern void ios_addscoreWithRank_id(string rank_id, 
            int score, 
            IOSCallBackCommonDelegate onSuccess, 
            IOSCallBackCommonDelegate onError);
    

// 设置用户分数
        [DllImport("__Internal")]
        private static extern void ios_setScoreWithRank_id(string rank_id, 
            int score, 
            IOSCallBackCommonDelegate onSuccess, 
            IOSCallBackCommonDelegate onError);


// 查询用户分数
        [DllImport("__Internal")]
        private static extern void ios_queryUserRankWithRank_id(string rank_id,
        string target,
        IOSCallBackCommonDelegate onSuccess,
        IOSCallBackCommonDelegate onError);

// 获取排行榜列表
        [DllImport("__Internal")]
        private static extern void ios_getRankListWithRank_id(string rank_id,
        int start_rank,
        int end_rank,
        IOSCallBackCommonDelegate onSuccess,
        IOSCallBackCommonDelegate onError);


// 获取好友排行榜列表
        [DllImport("__Internal")]
        private static extern void ios_getFriendRankListWithRank_id(string rank_id,
            IOSCallBackCommonDelegate onSuccess,
            IOSCallBackCommonDelegate onError);
    }
}
#endif