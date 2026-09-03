//
//  RXOSEmailLoginView.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2024/7/5.
//

#import <UIKit/UIKit.h>
#import "RXOSUILoginConfig.h"
#import "RXOSCommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

typedef NSDictionary *_Nullable(^LoginTypeBlock)(NSDictionary *loginEvent, LoginType loginType);
typedef void(^LoginComplete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXOSEmailLoginView : UIView

@property (nonatomic, strong) UIButton *codeLoginBtn;
@property (nonatomic, strong) NSString *username;
@property (nonatomic, assign) BOOL hideAnimate;

- (instancetype)initWithConfig:(RXOSUILoginConfig *)config
                    loginEvent:(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType))loginEvent
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

- (void)codeLoginBtnAction:(UIButton *)btn;

- (void)hide;

- (void)codeLoginBtnAction:(UIButton *)btn;

@end

NS_ASSUME_NONNULL_END
