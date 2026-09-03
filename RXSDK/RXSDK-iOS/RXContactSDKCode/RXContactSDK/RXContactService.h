//
//  RXContactService.h
//  RXSDK
//
//  Created by 陈汉 on 2021/12/2.

#import <Foundation/Foundation.h>
#import <RXSDK_Pure/RXPublicHeader.h>
//#import "RXLocationModel.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXContactService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 上报/更新经纬度坐标
 * @param lon 经度
 * @param lat 纬度
 * @param types 自定义坐标分组类型，字符串数组[@"type1", @"type2"]  必传
 */
- (void)lbsUpdateWithLon:(double)lon
                     lat:(double)lat
                   types:(NSArray * __nonnull)types
                complete:(RequestComplete)complete;

/**
 * 删除经纬度坐标
 * @param types 自定义坐标分组类型，字符串数组[@"type1", @"type2"]
 */
- (void)deleteLocationWithTypes:(NSArray *)types
                       complete:(RequestComplete)complete;

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
                       complete:(RequestComplete)complete;

/**
 * 设置用户自定义信息
 * @param custom 自定义信息，最大长度为 512 字节
 */
- (void)setUserCustomWithCustom:(NSString *)custom
                       complete:(RequestComplete)complete;

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
                     complete:(RequestComplete)complete;

/**
 * 删除自定义关系
 * @param target 目标openId  必须
 * @param types 自定义关系类型列表，value必须为BOOL  必须
 */
- (void)deleteRelationWithTarget:(NSString *)target
                           types:(NSDictionary *)types
                        complete:(RequestComplete)complete;

/**
 * 更新用户自定义关系备注
 * @param target 目标openId  必须
 * @param target_remarks 用户给Target设置的备注信息（最长512字符） 必须
 * @param type 自定义关系类型  必须
 */
- (void)updateRemarksWithTarget:(NSString *)target
                 target_remarks:(NSString *)target_remarks
                           type:(NSString *)type
                       complete:(RequestComplete)complete;

/**
 * 获取自定义关系列表
 * @param type 自定义关系类型  必须
 */
- (void)getRelationListWithType:(NSString *)type
                       complete:(RequestComplete)complete;

/**
 * 添加好友
 * @param target 目标openId  必须
 * @param target_remarks 用户给Target设置的备注信息（最长512字符） 非必须
 * @param user_remarks Target给用户设置的备注信息（最长512字符） 非必须
 */
- (void)addFriendWithTarget:(NSString *)target
             target_remarks:(NSString * _Nullable)target_remarks
               user_remarks:(NSString * _Nullable)user_remarks
                   complete:(RequestComplete)complete;

/**
 * 删除好友
 * @param target 目标openId  必须
 */
- (void)deleteFriendWithTarget:(NSString *)target
                      complete:(RequestComplete)complete;

/**
 * 更新好友备注
 * @param target 目标openId  必须
 * @param target_remarks 用户给Target设置的备注信息（最长512字符） 必须
 */
- (void)updateFriendRemarkWithTarget:(NSString *)target
                      target_remarks:(NSString *)target_remarks
                            complete:(RequestComplete)complete;

/**
 * 获取好友列表
 */
- (void)getFriendListWithComplete:(RequestComplete)complete;

/**
 * 判断两用户是否为好友
 * @param target 目标openId  必须
 */
- (void)requestIsFriendWithTarget:(NSString *)target
                         complete:(RequestComplete)complete;

/**
 * 判断两用户是否存在某自定关系
 * @param target 目标openId  必须
 * @param type CP自定义关系类型  必须
 */
- (void)requestHasRelationWithTarget:(NSString *)target
                                type:(NSString *)type
                            complete:(RequestComplete)complete;

/**
 * 增加用户分数
 * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  必须
 * @param source 增加的分数值  必须
 */
- (void)addscoreWithRank_id:(NSString *)rank_id
                      score:(NSInteger)source
                   complete:(RequestComplete)complete;

/**
 * 设置用户分数
 * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  必须
 * @param source 增加的分数值  必须
 */
- (void)setScoreWithRank_id:(NSString *)rank_id
                      score:(NSInteger)source
                   complete:(RequestComplete)complete;

/**
 * 查询用户分数
 * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  必须
 * @param target 目标openId  必须
 */
- (void)queryUserRankWithRank_id:(NSString *)rank_id
                          target:(NSString *)target
                        complete:(RequestComplete)complete;

/**
 * 获取排行榜列表
 * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  必须
 * @param start_rank 获取排行榜开始排名。取值[1,榜单容量)。可以用于分页加载  必须
 * @param end_rank 获取排行榜结束排名。取值[1,榜单容量]。可以用于分页加载  必须
 */
- (void)getRankListWithRank_id:(NSString *)rank_id
                    start_rank:(NSInteger)start_rank
                      end_rank:(NSInteger)end_rank
                      complete:(RequestComplete)complete;

/**
 * 获取好友排行榜列表
 * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  必须
 */
- (void)getFriendRankListWithRank_id:(NSString *)rank_id
                            complete:(RequestComplete)complete;

@end

NS_ASSUME_NONNULL_END
