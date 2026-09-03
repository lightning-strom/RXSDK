//
//  RXSingleLoginView.h
//  RXUIKit
//
//  Created by 陈汉 on 2025/6/24.
//

#import <UIKit/UIKit.h>
#import "RXLoginUIConfig.h"
#import "RXUICommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

typedef NSDictionary *_Nullable(^LoginTypeBlock)(NSDictionary *loginEvent, LoginType loginType);
typedef void(^LoginComplete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXSingleLoginView : UIView

@property (nonatomic, strong) NSString *username;
@property (nonatomic, assign) BOOL hideAnimate;
@property (nonatomic, assign) BOOL isShowBack;
@property (nonatomic, assign) BOOL isChange;
@property (nonatomic, assign) BOOL isFirstView;
@property (nonatomic, assign) BOOL isOutside;

- (instancetype)initWithConfig:(RXLoginUIConfig *)config
                    loginEvent:(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType))loginEvent
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

- (void)hide;

@end

NS_ASSUME_NONNULL_END
