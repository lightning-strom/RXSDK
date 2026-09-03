//
//  RXAccountListView.h
//  RXSDK
//
//  Created by 陈汉 on 2022/2/21.
//

#import <UIKit/UIKit.h>
#import "RXService.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^LoginAddAccountBlock)(void);
typedef void(^LoginTypeBlock)(LoginType loginType);

@interface RXAccountListView : UIView

- (instancetype)initWithAddAccount:(LoginAddAccountBlock)addAccount
                         loginType:(LoginTypeBlock)loginType;

@end

NS_ASSUME_NONNULL_END
