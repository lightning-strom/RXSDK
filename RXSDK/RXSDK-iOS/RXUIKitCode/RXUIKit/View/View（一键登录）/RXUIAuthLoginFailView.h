//
//  RXUIAuthLoginFailView.h
//  RXUIKit
//
//  Created by 陈汉 on 2024/9/13.
//

#import <UIKit/UIKit.h>
#import "RXLoginUIConfig.h"
#import "RXUICommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

typedef NSDictionary *_Nullable(^LoginTypeBlock)(NSDictionary *loginEvent, LoginType loginType);
typedef void(^LoginComplete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXUIAuthLoginFailView : UIView

@property (nonatomic, copy) LoginComplete loginComplete;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;

- (instancetype)initWithConfig:(RXLoginUIConfig *)config
                        titile:(NSString *)title
                       content:(NSString *)content
                    loginEvent:(LoginTypeBlock)loginEvent
                      complete:(LoginComplete)complete;

- (void)hide;

@end

NS_ASSUME_NONNULL_END
