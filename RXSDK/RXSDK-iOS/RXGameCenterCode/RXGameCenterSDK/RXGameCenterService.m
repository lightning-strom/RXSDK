//
//  RXGameCenterService.m
//  RXGameCenterSDK
//
//  Created by 陈汉 on 2025/9/15.
//

#import "RXGameCenterService.h"
#import <GameKit/GameKit.h>

@interface RXGameCenterService () <GKGameCenterControllerDelegate>

@end

@implementation RXGameCenterService

static RXGameCenterService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXGameCenterService alloc] init];
    });
    return sharedSDK;
}

/**
 * 登录 Game Center
 */
- (void)authenticateWithComplete:(RequestComplete)complete
{
    GKLocalPlayer *localPlayer = [GKLocalPlayer localPlayer];
    __weak GKLocalPlayer *weakLocalPlayer = localPlayer;
    
    localPlayer.authenticateHandler = ^(UIViewController * _Nullable viewController, NSError * _Nullable error) {
        if (viewController) {
            [[self currentViewController] presentViewController:viewController animated:YES completion:nil];
        } else if (weakLocalPlayer.isAuthenticated) {
            if (complete) {
                complete(@{@"code" : @(0)}, nil);
            }
        } else {
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:@(RXThirdError_default) forKey:@"code"];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXThirdError_default] forKey:@"msg"];
            if (error.code) {
                [errorRes setValue:@(error.code) forKey:@"thirdcode"];
            }
            if (error.localizedDescription) {
                [errorRes setValue:error.localizedDescription forKey:@"thirdmsg"];
            }
            
            RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
            rxError.responesObject = errorRes;
            if (complete) {
                complete(nil, rxError);
            }
        }
    };
}

/**
 * 上传 Game Center 排行榜分数
 */
- (void)submitScoreWithScore:(NSInteger)score
               leaderboardID:(NSString *)leaderboardID
                    complete:(RequestComplete)complete
{
    if (!GKLocalPlayer.localPlayer.isAuthenticated) {
        [self authenticateWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            if (!error) {
                [self privateSubmitScoreWithScore:score leaderboardID:leaderboardID complete:complete];
            } else {
                if (complete) {
                    complete(nil, error);
                }
            }
        }];
    } else {
        [self privateSubmitScoreWithScore:score leaderboardID:leaderboardID complete:complete];
    }
}

- (void)privateSubmitScoreWithScore:(NSInteger)score
                      leaderboardID:(NSString *)leaderboardID
                           complete:(RequestComplete)complete
{
    if (@available(iOS 14, *)) {
//        GKLeaderboardScore *lbScore = [[GKLeaderboardScore alloc] init];
//        lbScore.value = score;
//        lbScore.leaderboardID = leaderboardID;
//        lbScore.context = 0; // 可选：自定义上下文，便于统计
        
        [GKLeaderboard submitScore:score context:0 player:GKLocalPlayer.localPlayer leaderboardIDs:@[leaderboardID] completionHandler:^(NSError * _Nullable error) {
            if (!error) {
                if (complete) {
                    complete(@{@"code" : @(0)}, nil);
                }
            } else {
                NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                [errorRes setValue:@(RXThirdError_default) forKey:@"code"];
                [errorRes setValue:[RXErrorTool getRXErrorMsg:RXThirdError_default] forKey:@"msg"];
                if (error.code) {
                    [errorRes setValue:@(error.code) forKey:@"thirdcode"];
                }
                if (error.localizedDescription) {
                    [errorRes setValue:error.localizedDescription forKey:@"thirdmsg"];
                }
                
                RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                rxError.responesObject = errorRes;
                if (complete) {
                    complete(nil, rxError);
                }
            }
        }];
        
    } else {
        GKScore *scoreReporter = [[GKScore alloc] initWithLeaderboardIdentifier:leaderboardID];
        scoreReporter.value = (uint64_t)score;
        scoreReporter.shouldSetDefaultLeaderboard = YES;
        
        [GKScore reportScores:@[scoreReporter] withCompletionHandler:^(NSError * _Nullable error) {
            if (!error) {
                if (complete) {
                    complete(@{@"code" : @(0)}, nil);
                }
            } else {
                NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                [errorRes setValue:@(RXThirdError_default) forKey:@"code"];
                [errorRes setValue:[RXErrorTool getRXErrorMsg:RXThirdError_default] forKey:@"msg"];
                if (error.code) {
                    [errorRes setValue:@(error.code) forKey:@"thirdcode"];
                }
                if (error.localizedDescription) {
                    [errorRes setValue:error.localizedDescription forKey:@"thirdmsg"];
                }
                
                RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                rxError.responesObject = errorRes;
                if (complete) {
                    complete(nil, rxError);
                }
            }
        }];
    }
}

/**
 * 展示 Game Center 主界面
 */
- (void)showGameCenterWithComplete:(RequestComplete)complete
{
    if (!GKLocalPlayer.localPlayer.isAuthenticated) {
        [self authenticateWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            if (!error) {
                [self showGameCenterWithState:GKGameCenterViewControllerStateDefault];
                if (complete) {
                    complete(@{@"code" : @(0)}, nil);
                }
            } else {
                if (complete) {
                    complete(nil, error);
                }
            }
        }];
    } else {
        [self showGameCenterWithState:GKGameCenterViewControllerStateDefault];
        if (complete) {
            complete(@{@"code" : @(0)}, nil);
        }
    }
}

/**
 * 展示成就
 */
- (void)showAchievementsWithComplete:(RequestComplete)complete
{
    if (!GKLocalPlayer.localPlayer.isAuthenticated) {
        [self authenticateWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            if (!error) {
                [self showGameCenterWithState:GKGameCenterViewControllerStateAchievements];
                if (complete) {
                    complete(@{@"code" : @(0)}, nil);
                }
            } else {
                if (complete) {
                    complete(nil, error);
                }
            }
        }];
    } else {
        [self showGameCenterWithState:GKGameCenterViewControllerStateAchievements];
        if (complete) {
            complete(@{@"code" : @(0)}, nil);
        }
    }
}

/**
 * 展示排行榜
 */
- (void)showLeaderboardWithComplete:(RequestComplete)complete
{
    if (!GKLocalPlayer.localPlayer.isAuthenticated) {
        [self authenticateWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            if (!error) {
                [self showGameCenterWithState:GKGameCenterViewControllerStateLeaderboards];
                if (complete) {
                    complete(@{@"code" : @(0)}, nil);
                }
            } else {
                if (complete) {
                    complete(nil, error);
                }
            }
        }];
    } else {
        [self showGameCenterWithState:GKGameCenterViewControllerStateLeaderboards];
        if (complete) {
            complete(@{@"code" : @(0)}, nil);
        }
    }
}

/**
 * 解锁 Game Center 成就进度
 */
- (void)unlockGKAchievementWithAchievementID:(NSString *)achievementID
                             percentComplete:(double)percentComplete
                                    complete:(RequestComplete)complete
{
    if (!GKLocalPlayer.localPlayer.isAuthenticated) {
        [self authenticateWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            if (!error) {
                [self privateUnlockGKAchievementWithAchievementID:achievementID percentComplete:percentComplete complete:complete];
            } else {
                if (complete) {
                    complete(nil, error);
                }
            }
        }];
    } else {
        [self privateUnlockGKAchievementWithAchievementID:achievementID percentComplete:percentComplete complete:complete];
    }
}

- (void)privateUnlockGKAchievementWithAchievementID:(NSString *)achievementID
                                    percentComplete:(double)percentComplete
                                           complete:(RequestComplete)complete
{
    GKAchievement *achievement = [[GKAchievement alloc] initWithIdentifier:achievementID];
    achievement.percentComplete = MIN(MAX(percentComplete, 0.0), 100.0);
    achievement.showsCompletionBanner = YES;
    
    [GKAchievement reportAchievements:@[achievement] withCompletionHandler:^(NSError * _Nullable error) {
        if (!error) {
            if (complete) {
                complete(@{@"code" : @(0)}, nil);
            }
        } else {
            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
            [errorRes setValue:@(RXThirdError_default) forKey:@"code"];
            [errorRes setValue:[RXErrorTool getRXErrorMsg:RXThirdError_default] forKey:@"msg"];
            if (error.code) {
                [errorRes setValue:@(error.code) forKey:@"thirdcode"];
            }
            if (error.localizedDescription) {
                [errorRes setValue:error.localizedDescription forKey:@"thirdmsg"];
            }
            
            RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
            rxError.responesObject = errorRes;
            if (complete) {
                complete(nil, rxError);
            }
        }
    }];
}

- (void)showGameCenterWithState:(GKGameCenterViewControllerState)state
{
    if (@available(iOS 14, *)) {
        GKGameCenterViewController *leaderboardViewController = [[GKGameCenterViewController alloc] initWithState:state];
        leaderboardViewController.gameCenterDelegate = self;
        [[self currentViewController] presentViewController:leaderboardViewController animated:YES completion:nil];
    } else {
        GKGameCenterViewController *leaderboardViewController = [[GKGameCenterViewController alloc] init];
        leaderboardViewController.viewState = state;
        leaderboardViewController.gameCenterDelegate = self;
        [[self currentViewController] presentViewController:leaderboardViewController animated:YES completion:nil];
    }
}

#pragma mark -- GKGameCenterControllerDelegate
- (void)gameCenterViewControllerDidFinish:(GKGameCenterViewController *)gameCenterViewController {
    [[UIApplication sharedApplication].keyWindow.rootViewController dismissModalViewControllerAnimated:YES];
}

#pragma mark -- getCurrentViewController
/** appdelegate */
- (id<UIApplicationDelegate>)applicationDelegate {
    return [UIApplication sharedApplication].delegate;
}

/** 返回当前控制器 */
- (UIViewController *)currentViewController {
    
    UIViewController *rootViewController = [self applicationDelegate].window.rootViewController;
    return [self currentViewControllerFrom:rootViewController];
}

/** 返回当前的导航控制器 */
- (UINavigationController *)currentNavigationViewController {
    
    UIViewController *currentViewController = [self currentViewController];
    return currentViewController.navigationController;
}

/** 通过递归拿到当前控制器 */
- (UIViewController *)currentViewControllerFrom:(UIViewController*)viewController {
    
    // 如果传入的控制器是导航控制器,则返回最后一个
    if ([viewController isKindOfClass:[UINavigationController class]]) {
        
        UINavigationController *navigationController = (UINavigationController *)viewController;
        return [self currentViewControllerFrom:navigationController.viewControllers.lastObject];
    }
    // 如果传入的控制器是tabBar控制器,则返回选中的那个
    else if([viewController isKindOfClass:[UITabBarController class]]) {
        
        UITabBarController *tabBarController = (UITabBarController *)viewController;
        return [self currentViewControllerFrom:tabBarController.selectedViewController];
    }
    // 如果传入的控制器发生了modal,则就可以拿到modal的那个控制器
    else if(viewController.presentedViewController != nil) {
        return [self currentViewControllerFrom:viewController.presentedViewController];
    }
    else {
        return viewController;
    }
}

@end
