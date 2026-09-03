//
//  RXOSHistoryListLoginView.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/20.
//

#import <UIKit/UIKit.h>
#import "RXOSCommonTool.h"
#import "RXOSUILoginConfig.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^AccountDeleteBlock)(void);
typedef void(^SelectAccountBlock)(NSMutableDictionary *userInfo);
typedef void(^LoginComplete)(NSDictionary *response, RX_CommonRequestError *error);
typedef NSDictionary *_Nullable(^LoginTypeBlock)(NSDictionary *loginEvent, LoginType loginType);


@interface RXOSHistoryListLoginView : UIView

@property (nonatomic, copy) LoginComplete loginComplete;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, copy) AccountDeleteBlock deleteBlock;

- (instancetype)initWithLoginConfig:(RXOSUILoginConfig *)loginConfig
                           viewType:(RXUserType)viewType
                      selectAccount:(SelectAccountBlock)selectAccount;

@end

NS_ASSUME_NONNULL_END
