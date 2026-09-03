//
//  RXUISingleAuthLoginView.h
//  RXUIKit
//
//  Created by 陈汉 on 2025/6/23.
//

#import <UIKit/UIKit.h>
#import "RXLoginUIConfig.h"
#import "RXUICommonHeader.h"
#import <ATAuthSDK/ATAuthSDK.h>

NS_ASSUME_NONNULL_BEGIN

typedef NSDictionary *_Nullable(^LoginTypeBlock)(NSDictionary *loginEvent, LoginType loginType);
typedef void(^LoginComplete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXUISingleAuthLoginView : UIView

@property (nonatomic, copy) LoginComplete loginComplete;
@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;

- (instancetype)initWithConfig:(RXLoginUIConfig *)config
                       authKey:(NSString *)authKey
                    loginEvent:(NSDictionary *)loginEvent
                      complete:(void(^)(NSString *token))complete;

- (instancetype)initWithConfig:(RXLoginUIConfig *)config
                    loginEvent:(LoginTypeBlock)loginEvent
                      complete:(LoginComplete)complete;

- (void)hide;

- (void)setPrivacySelected:(BOOL)selected;

@end

NS_ASSUME_NONNULL_END
