//
//  RXContactService.m
//  RXSDK
//
//  Created by 陈汉 on 2021/12/2.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

#import "RXContactService.h"
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import <RXSDK_Pure/RX_CommonRequest.h>
#import <RXSDK_Pure/RX_CommonNetworkExcuteManager.h>
#import <RXSDK_Pure/RXConfig.h>

//#import "RXCommonHeader.h"
//#import "RXLocationManager.h"

@implementation RXContactService

static RXContactService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXContactService alloc] init];
    });
    return sharedSDK;
}

/**
 * 获取位置信息
 */
//- (void)getLocationInfo:(void(^)(RXLocationModel *location))complete
//{
//    [[RXLocationManager sharedManger] getLocationInfo:complete];
//}

/**
 * 上报/更新经纬度坐标
 * @param lon 经度
 * @param lat 纬度
 * @param types 自定义坐标分组类型  必传
 */
- (void)lbsUpdateWithLon:(double)lon
                     lat:(double)lat
                   types:(NSArray * __nonnull)types
                complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:@(lon) forKey:@"lon"];
    [dic setValue:@(lat) forKey:@"lat"];
    [dic setValue:types forKey:@"types"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/lbs/update" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"位置上报成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"位置上报失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 删除位置信息
 * @param types 用户类型定义
 */
- (void)deleteLocationWithTypes:(NSArray *)types
                       complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:types forKey:@"types"];
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/lbs/delete" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"删除位置信息成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"删除位置信息失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}


/**
 * 获取指定半径内的其他用户信息
 * @param lon 经度
 * @param lat 纬度
 * @param radius 半径（米）
 * @param count 查询数量，（默认0，0为全部）非必传
 * @param page 页数，从1开始
 * @param page_size 每页数量
 * @param type 查询类型
 */
- (void)getRadiusAccountWithLon:(double)lon
                            lat:(double)lat
                         radius:(NSInteger)radius
                          count:(NSInteger)count
                           page:(NSInteger)page
                      page_size:(NSInteger)page_size
                           type:(NSString *)type
                       complete:(RequestComplete)complete
{
    if (!count) {
        count = 0;
    }
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:@(lon) forKey:@"lon"];
    [dic setValue:@(lat) forKey:@"lat"];
    [dic setValue:@(radius) forKey:@"radius"];
    [dic setValue:@(count) forKey:@"count"];
    [dic setValue:@(page) forKey:@"page"];
    [dic setValue:@(page_size) forKey:@"page_size"];
    [dic setValue:type forKey:@"type"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/lbs/radius" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];

    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取附近人成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取附近人失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 设置用户自定义信息
 * @param custom 自定义信息，最大长度为 512 字节
 */
- (void)setUserCustomWithCustom:(NSString *)custom
                       complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:custom forKey:@"custom"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/user/setcustom" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"设置用户自定义信息成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"设置用户自定义信息失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 添加自定义关系
 * @param target 目标openId  必须
 * @param types 自定义关系类型列表，value必须为BOOL  必须
 * @param target_remarks 用户给Target设置的备注信息（最长512字符） 非必须
 * @param user_remarks Target给用户设置的备注信息（最长512字符） 非必须
 */
- (void)addRelationWithTarget:(NSString *)target
                        types:(NSDictionary *)types
               target_remarks:(NSString * _Nullable)target_remarks
                 user_remarks:(NSString * _Nullable)user_remarks
                     complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    [dic setValue:types forKey:@"types"];
    [dic setValue:target_remarks forKey:@"target_remarks"];
    [dic setValue:user_remarks forKey:@"user_remarks"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/relation/add" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"添加自定义关系成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"添加自定义关系失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 删除自定义关系
 * @param target 目标openId
 * @param types 自定义关系类型列表，value必须为BOOL  必须
 */
- (void)deleteRelationWithTarget:(NSString *)target
                                        types:(NSDictionary *)types
                                     complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    [dic setValue:types forKey:@"types"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/relation/delete" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"删除自定义关系成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"删除自定义关系失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 更新用户自定义关系备注
 * @param target 目标openId
 * @param target_remarks 用户给Target设置的备注信息（最长512字符）
 * @param type 自定义关系类型
 */
- (void)updateRemarksWithTarget:(NSString *)target
                 target_remarks:(NSString *)target_remarks
                           type:(NSString *)type
                       complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    [dic setValue:target_remarks forKey:@"target_remarks"];
    [dic setValue:type forKey:@"type"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/relation/updateremarks" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"更新用户自定义关系备注成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"更新用户自定义关系备注失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取自定关系列表
 * @param type 自定义关系类型  必须
 */
- (void)getRelationListWithType:(NSString *)type
                       complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:type forKey:@"type"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/relation/list" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取自定关系列表:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取自定关系列表:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 添加好友
 * @param target 目标openId  必须
 * @param target_remarks 用户给Target设置的备注信息（最长512字符） 非必须
 * @param user_remarks Target给用户设置的备注信息（最长512字符） 非必须
 */
- (void)addFriendWithTarget:(NSString *)target
             target_remarks:(NSString * _Nullable)target_remarks
               user_remarks:(NSString * _Nullable)user_remarks
                   complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    [dic setValue:target_remarks forKey:@"target_remarks"];
    [dic setValue:user_remarks forKey:@"user_remarks"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/relation/addfriend" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"添加好友成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"添加好友失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 删除好友
 * @param target 目标openId  必须
 */
- (void)deleteFriendWithTarget:(NSString *)target
                      complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/relation/delfriend" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"删除好友成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"删除好友失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 更新好友备注
 * @param target 目标openId  必须
 * @param target_remarks 用户给Target设置的备注信息（最长512字符） 必须
 */
- (void)updateFriendRemarkWithTarget:(NSString *)target
                      target_remarks:(NSString *)target_remarks
                            complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    [dic setValue:target_remarks forKey:@"target_remarks"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/relation/updatefriendremarks" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"更新好友备注成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"更新好友备注失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取好友列表
 */
- (void)getFriendListWithComplete:(RequestComplete)complete
{
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/relation/friends" andParams:nil requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取好友列表成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取好友列表失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 创建排行榜
 * @param rankId 类型 1:日榜 3:月榜 4:季榜 5:半年榜 6:年榜 99:长期榜单  必须
 */
- (void)createRankWithRankId:(NSString *)rankId
                    complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:rankId forKey:@"rankid"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/serverapi/createrank" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"创建排行榜成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"创建排行榜失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取排行榜
 * @param rankId  必须
 * @param userId  必须
 */
- (void)getRankListWithRankId:(NSString *)rankId
                       userId:(NSInteger)userId
                     complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:rankId forKey:@"rankid"];
    [dic setValue:@(userId) forKey:@"userid"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/rank/list" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取排行榜成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取排行榜失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 上报排行榜分数
 * @param rankId 排行榜标识  必须
 * @param openId 用户openId  必须
 * @param score 分数  必须
 * @param userId 用户userId  必须
 */
- (void)reportRankScoreWithRankId:(NSString *)rankId
                           openId:(NSString *)openId
                            score:(NSInteger)score
                           userId:(NSInteger)userId
                         complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:rankId forKey:@"rankid"];
    [dic setValue:openId forKey:@"openid"];
    [dic setValue:@(score) forKey:@"score"];
    [dic setValue:@(userId) forKey:@"userid"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/rank/report" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"上报排行榜分数成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"上报排行榜分数失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取openId
 * @param userId 用户userId  必须
 */
- (void)getOpenIdWithUserId:(NSInteger)userId
                   complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:@(userId) forKey:@"userid"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/user/getopenid" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取openId成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取openId失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 判断两用户是否为好友
 * @param target 目标openId  必须
 */
- (void)requestIsFriendWithTarget:(NSString *)target
                         complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/relation/isfriend" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"判断两用户是否为好友成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"判断两用户是否为好友失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 判断两用户是否存在某自定关系
 * @param target 目标openId  必须
 * @param type CP 自定义关系类型  必须
 */
- (void)requestHasRelationWithTarget:(NSString *)target
                                type:(NSString *)type
                            complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"target"];
    [dic setValue:type forKey:@"type"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/relation/hasrelation" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"判断两用户是否存在某自定关系成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"判断两用户是否存在某自定关系失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 增加用户分数
 * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  必须
 * @param source 增加的分数值  必须
 */
- (void)addscoreWithRank_id:(NSString *)rank_id
                      score:(NSInteger)source
                   complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:rank_id forKey:@"rank_id"];
    [dic setValue:@(source) forKey:@"source"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/rank/addscore" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"增加用户分数成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"增加用户分数失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 设置用户分数
 * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  必须
 * @param source 增加的分数值  必须
 */
- (void)setScoreWithRank_id:(NSString *)rank_id
                      score:(NSInteger)source
                   complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:rank_id forKey:@"rank_id"];
    [dic setValue:@(source) forKey:@"source"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/rank/setscore" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"设置用户分数成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"设置用户分数失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 查询用户分数
 * @param target 目标openId  必须
 * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  必须
 */
- (void)queryUserRankWithRank_id:(NSString *)rank_id
                          target:(NSString *)target
                        complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:target forKey:@"open_id"];
    [dic setValue:rank_id forKey:@"rank_id"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/rank/queryuserrank" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"查询用户分数成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"查询用户分数失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取排行榜列表
 * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  必须
 * @param start_rank 获取排行榜开始排名。取值[1,榜单容量)。可以用于分页加载  必须
 * @param end_rank 获取排行榜结束排名。取值[1,榜单容量]。可以用于分页加载  必须
 */
- (void)getRankListWithRank_id:(NSString *)rank_id
                    start_rank:(NSInteger)start_rank
                      end_rank:(NSInteger)end_rank
                      complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:rank_id forKey:@"rank_id"];
    [dic setValue:@(start_rank) forKey:@"start_rank"];
    [dic setValue:@(end_rank) forKey:@"end_rank"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/rank/getranklist" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取排行榜列表成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取排行榜列表失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取好友排行榜列表
 * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  必须
 */
- (void)getFriendRankListWithRank_id:(NSString *)rank_id
                            complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:rank_id forKey:@"rank_id"];
    [dic setValue:[[NSUserDefaults standardUserDefaults] valueForKey:@"rx_openId"] forKey:@"open_id"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/social/rank/friendsrank" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取好友排行榜列表成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取好友排行榜列表失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

@end
