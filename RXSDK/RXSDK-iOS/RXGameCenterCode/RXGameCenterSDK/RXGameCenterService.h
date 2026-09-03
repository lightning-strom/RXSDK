//
//  RXGameCenterService.h
//  RXGameCenterSDK
//
//  Created by 陈汉 on 2025/9/15.
//

#import <Foundation/Foundation.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXGameCenterService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 登录 Game Center
 */
- (void)authenticateWithComplete:(RequestComplete)complete;

/**
 * 展示 Game Center 主界面
 */
- (void)showGameCenterWithComplete:(RequestComplete)complete;

/**
 * 上传 Game Center 排行榜分数
 * @param score 分数
 * @param leaderboardID 排行榜 id
 */
- (void)submitScoreWithScore:(NSInteger)score
               leaderboardID:(NSString *)leaderboardID
                    complete:(RequestComplete)complete;

/**
 * 展示排行榜
 */
- (void)showLeaderboardWithComplete:(RequestComplete)complete;

/**
 * 解锁 Game Center 成就进度
 * @param percentComplete 进度
 * @param achievementID 成就 id
 */
- (void)unlockGKAchievementWithAchievementID:(NSString *)achievementID
                             percentComplete:(double)percentComplete
                                    complete:(RequestComplete)complete;

/**
 * 展示成就
 */
- (void)showAchievementsWithComplete:(RequestComplete)complete;

@end

NS_ASSUME_NONNULL_END
