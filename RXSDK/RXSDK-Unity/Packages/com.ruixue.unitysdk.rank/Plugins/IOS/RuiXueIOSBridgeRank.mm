#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import <RXContactSDK/RXContactSDK.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeUtils.h"
#include "RuiXueIOSBridgeRank.h"


// 增加用户分数
void ios_addscoreWithRank_id(const char* rank_id, int score, RequestResponseCallBack onSuccess, RequestErrorCallBack onError)
{
    [[RXContactService sharedSDK] addscoreWithRank_id:[RuiXueIOSBridgeUtils toNSString:rank_id] score:score complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
        if(!error)
        {
            NSLog(@"增加用户分数成功");
            onSuccess("ios_addscoreWithRank_id", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"增加用户分数失败");
            onError("ios_addscoreWithRank_id", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 设置用户分数
void ios_setScoreWithRank_id(const char* rank_id, int score, RequestResponseCallBack onSuccess, RequestErrorCallBack onError)
{
    [[RXContactService sharedSDK] setScoreWithRank_id:[RuiXueIOSBridgeUtils toNSString:rank_id] score:score complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
           
        if(!error)
        {
            NSLog(@"设置用户分数成功");
            onSuccess("ios_setScoreWithRank_id", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"设置用户分数失败");
            onError("ios_setScoreWithRank_id", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}


// 查询用户分数
void ios_queryUserRankWithRank_id(const char* rank_id,
                                  const char* target,
                                  RequestResponseCallBack onSuccess,
                                  RequestErrorCallBack onError)
{
    [[RXContactService sharedSDK] queryUserRankWithRank_id:[RuiXueIOSBridgeUtils toNSString:rank_id] target:[RuiXueIOSBridgeUtils toNSString:target] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
        if(!error)
        {
            NSLog(@"查询用户分数成功");
            onSuccess("ios_queryUserRankWithRank_id",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"查询用户分数失败");
            onError("ios_queryUserRankWithRank_id",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 获取排行榜列表
void ios_getRankListWithRank_id(const char* rank_id,
                                int start_rank,
                                int end_rank,
                                RequestResponseCallBack onSuccess,
                                RequestErrorCallBack onError)
{
    [[RXContactService sharedSDK] getRankListWithRank_id:[RuiXueIOSBridgeUtils toNSString:rank_id] start_rank:start_rank end_rank:end_rank complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
        if(!error)
        {
            NSLog(@"获取排行榜列表成功");
            onSuccess("ios_getRankListWithRank_id", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"获取排行榜列表失败");
            onError("ios_getRankListWithRank_id",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}


// 获取好友排行榜列表
void ios_getFriendRankListWithRank_id(const char *rank_id,
                                      RequestResponseCallBack onSuccess,
                                      RequestErrorCallBack onError)
{
    [[RXContactService sharedSDK] getFriendRankListWithRank_id:[RuiXueIOSBridgeUtils toNSString:rank_id] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
        if(!error)
        {
            NSLog(@"获取好友排行榜列表成功");
            onSuccess("ios_getFriendRankListWithRank_id", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"获取好友排行榜列表失败");
            onError("ios_getFriendRankListWithRank_id",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}
