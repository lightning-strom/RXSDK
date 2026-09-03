//
//  RXOSMoreLoginView.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/16.
//

#import <UIKit/UIKit.h>
#import "RXOSCommonTool.h"
#import "RXOSUILoginConfig.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^ClickBlock)(LoginType loginType);
typedef NSDictionary *_Nullable(^LoginTypeBlock)(NSDictionary *loginEvent, LoginType loginType);
typedef void(^LoginComplete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXOSMoreLoginView : UIView

@property (nonatomic, copy) ClickBlock clickBlock;

- (instancetype)initWithLoginConfig:(RXOSUILoginConfig *)loginConfig
                  showAllLoginTypes:(BOOL)showAllLoginTypes
                         loginEvent:(NSDictionary *(^)(NSDictionary *loginEvent, LoginType loginType))loginEvent
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

@end

NS_ASSUME_NONNULL_END
