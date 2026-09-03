//
//  RXHistoryListLoginView.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/20.
//

#import <UIKit/UIKit.h>
#import "RXUICommonTool.h"
#import "RXLoginUIConfig.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^AccountDeleteBlock)(void);
typedef void(^SelectAccountBlock)(NSMutableDictionary *userInfo);
typedef void(^LoginComplete)(NSDictionary *response, RX_CommonRequestError *error);
typedef NSDictionary *_Nullable(^LoginTypeBlock)(NSDictionary *loginEvent, LoginType loginType);


@interface RXHistoryListLoginView : UIView

@property (nonatomic, copy) LoginComplete loginComplete;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, copy) AccountDeleteBlock deleteBlock;

// 常规模式
- (instancetype)initWithLoginConfig:(RXLoginUIConfig *)loginConfig
                           viewType:(RXUserType)viewType
                      selectAccount:(SelectAccountBlock)selectAccount;

// 快速模式
- (instancetype)initWithLoginConfig:(RXLoginUIConfig *)loginConfig
                         loginEvent:(LoginTypeBlock)loginEvent
                           complete:(LoginComplete)complete;

@end

NS_ASSUME_NONNULL_END
