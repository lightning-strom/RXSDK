//
//  RXLoginView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import <UIKit/UIKit.h>
#import "RXUserInfoModel.h"
#import "RXService.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^LoginAddAccountBlock)(void);
typedef void(^LoginTypeBlock)(LoginType loginType);

@interface RXLoginView : UIView

- (instancetype)initWithAccounts:(NSMutableArray <RXUserInfoModel *> *)accounts
                      addAccount:(LoginAddAccountBlock)addAccount
                       loginType:(LoginTypeBlock)loginType;

- (void)hide;

@end

NS_ASSUME_NONNULL_END
