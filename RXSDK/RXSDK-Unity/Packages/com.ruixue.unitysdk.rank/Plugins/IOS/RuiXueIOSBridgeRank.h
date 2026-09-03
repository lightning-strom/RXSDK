#ifndef __RuiXue__IOSBridge__Rank__
#define __RuiXue__IOSBridge__Rank__


extern "C"
{
// 增加用户分数
void ios_addscoreWithRank_id(const char* rank_id, int score, RequestResponseCallBack onSuccess, RequestErrorCallBack onError);
    

// 设置用户分数
void ios_setScoreWithRank_id(const char* rank_id, int score, RequestResponseCallBack onSuccess, RequestErrorCallBack onError);


// 查询用户分数
void ios_queryUserRankWithRank_id(const char* rank_id,
                                  const char* target,
                                  RequestResponseCallBack onSuccess,
                                  RequestErrorCallBack onError);

// 获取排行榜列表
void ios_getRankListWithRank_id(const char* rank_id,
                                int start_rank,
                                int end_rank,
                                RequestResponseCallBack onSuccess,
                                RequestErrorCallBack onError);


// 获取好友排行榜列表
void ios_getFriendRankListWithRank_id(const char *rank_id,
                                      RequestResponseCallBack onSuccess,
                                      RequestErrorCallBack onError);
}

#endif
