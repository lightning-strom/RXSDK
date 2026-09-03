//
//  RXLoginView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import <UIKit/UIKit.h>
#import "RXLoginUIConfig.h"
#import "RXUICommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

typedef NSDictionary *_Nullable(^LoginTypeBlock)(NSDictionary *loginEvent, LoginType loginType);
typedef void(^LoginComplete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXLoginView : UIView

@property (nonatomic, strong) UIButton *codeLoginBtn;
@property (nonatomic, strong) NSString *username;
@property (nonatomic, assign) BOOL hideAnimate;
@property (nonatomic, assign) BOOL isShowBack;
@property (nonatomic, assign) BOOL isChange;
@property (nonatomic, assign) BOOL isFirstView;
@property (nonatomic, assign) BOOL isOutside;

- (instancetype)initWithConfig:(RXLoginUIConfig *)config
                    loginEvent:(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType))loginEvent
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

- (void)codeLoginBtnAction:(UIButton *)btn;

- (void)hide;

@end

NS_ASSUME_NONNULL_END
